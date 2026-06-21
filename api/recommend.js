// Vercel serverless function - AI-powered subject recommendation
// POST /api/recommend  { profile: {...wizardInputs}, matched_subjects: [...slugs] }
import Anthropic from "@anthropic-ai/sdk";
import { get, list } from "@vercel/blob";
import { loadEduPathData } from "../server-lib/edupath-data.js";
import { readOverlay } from "../server-lib/overlay-store.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function compactMoney(row) {
  if (!row?.salary?.bd?.entry) return "BD salary not available";
  const bd = row.salary.bd.entry;
  const abroad = row.salary.abroad || {};
  const abroadBits = Object.entries(abroad).slice(0, 4).map(([country, s]) =>
    `${country}: ${s.currency || ""} ${s.entry_min || "?"}-${s.entry_max || "?"}/${s.unit || "year"}`
  );
  return `BD entry ${row.salary.bd.currency || "BDT"} ${bd.min}-${bd.max}/${row.salary.bd.unit || "month"}; abroad ${abroadBits.join(", ")}`;
}

async function streamToText(stream) {
  const response = new Response(stream);
  return response.text();
}

async function loadApprovedBlobTestimonials() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const result = await list({ prefix: "testimonials/approved/", limit: 200 });
    const bySubject = {};
    for (const blob of result.blobs || []) {
      const file = await get(blob.pathname);
      if (!file || file.statusCode !== 200) continue;
      const t = JSON.parse(await streamToText(file.stream));
      const slug = t.subjectSlug || t.subject_slug;
      if (!slug) continue;
      bySubject[slug] ||= [];
      bySubject[slug].push(t);
    }
    return bySubject;
  } catch (err) {
    console.warn("Approved testimonial blob load failed:", err.message);
    return {};
  }
}

function avg(rows) {
  const nums = rows.map(Number).filter(Number.isFinite);
  return nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : null;
}

function blobStats(rows = []) {
  const count = rows.length;
  const yes = rows.filter(t => String(t.wouldChooseAgain || "").toLowerCase() === "yes").length;
  const no = rows.filter(t => String(t.wouldChooseAgain || "").toLowerCase() === "no").length;
  return {
    count,
    wouldAgainYes: yes,
    wouldAgainNo: no,
    wouldAgainRate: count ? Math.round((yes / count) * 100) : null,
    regretRate: count ? Math.round((no / count) * 100) : null,
    avgSubjectWorthRating: avg(rows.map(t => t.subjectWorthRating)),
    whoShould: rows.map(t => t.whoShouldTake || t.whoShould).filter(Boolean).slice(0, 3),
    whoShouldNot: rows.map(t => t.whoShouldNotTake || t.whoShouldNot).filter(Boolean).slice(0, 3),
    futureOpportunities: rows.map(t => t.futureOpportunities || t.opportunities).filter(Boolean).slice(0, 3),
    regretReasons: rows.map(t => t.chooseAgainReason).filter(Boolean).slice(0, 3),
    hscGroups: rows.reduce((acc, t) => {
      if (t.hscGroup) acc[t.hscGroup] = (acc[t.hscGroup] || 0) + 1;
      return acc;
    }, {}),
  };
}

function mergeStats(staticStats = {}, approvedRows = []) {
  const fresh = blobStats(approvedRows);
  const count = (staticStats.count || 0) + fresh.count;
  const yes = (staticStats.wouldAgainYes || 0) + fresh.wouldAgainYes;
  const no = (staticStats.wouldAgainNo || 0) + fresh.wouldAgainNo;
  const hscGroups = { ...(staticStats.hscGroups || {}) };
  for (const [group, n] of Object.entries(fresh.hscGroups || {})) {
    hscGroups[group] = (hscGroups[group] || 0) + n;
  }
  return {
    ...staticStats,
    count,
    wouldAgainYes: yes,
    wouldAgainNo: no,
    wouldAgainRate: count ? Math.round((yes / count) * 100) : staticStats.wouldAgainRate,
    regretRate: count ? Math.round((no / count) * 100) : staticStats.regretRate,
    avgSubjectWorthRating: fresh.avgSubjectWorthRating || staticStats.avgSubjectWorthRating,
    whoShould: [...(staticStats.whoShould || []), ...fresh.whoShould].slice(0, 3),
    whoShouldNot: [...(staticStats.whoShouldNot || []), ...fresh.whoShouldNot].slice(0, 3),
    futureOpportunities: [...(staticStats.futureOpportunities || []), ...fresh.futureOpportunities].slice(0, 3),
    regretReasons: [...(staticStats.regretReasons || []), ...fresh.regretReasons].slice(0, 3),
    hscGroups,
  };
}

function applyApprovedBlobScore(candidates, approvedBySubject = {}) {
  return candidates.map(candidate => {
    const stats = mergeStats(candidate.subject.testimonial_stats || {}, approvedBySubject[candidate.subject.slug] || []);
    let score = candidate.score;
    if (stats.avgSubjectWorthRating >= 4) score += 5;
    if (stats.avgSubjectWorthRating && stats.avgSubjectWorthRating < 3) score -= 5;
    if (stats.wouldAgainRate >= 70) score += 4;
    if (stats.regretRate >= 40) score -= 6;
    return {
      ...candidate,
      score: Math.max(0, Math.min(100, score)),
      subject: { ...candidate.subject, testimonial_stats: stats }
    };
  }).sort((a, b) => b.score - a.score);
}

function candidateBlock(candidate, approvedBySubject = {}) {
  const s = candidate.subject;
  const offerings = (s.offerings || []).slice(0, 8).map(o =>
    `${o.university_short || o.university_name}${o.seats ? ` (${o.seats} seats)` : ""}`
  ).join(", ");
  const jobs = (s.related_jobs || []).slice(0, 5).map(j =>
    `${j.title}: ${compactMoney(j)}`
  ).join(" | ");
  const stats = mergeStats(s.testimonial_stats || {}, approvedBySubject[s.slug] || []);
  const approvedBlobCount = (approvedBySubject[s.slug] || []).length;
  const risks = (s.difficulty_flags || []).slice(0, 4).map(r => `${r.year}: ${r.course}`).join("; ");
  const fourth = (s.fourth_subject_rules || []).map(r => `${r.condition} ${r.consequence}`).join(" ");

  return [
    `SLUG: ${s.slug}`,
    `NAME: ${s.name}`,
    `SCORE_HINT: ${candidate.score}`,
    `FIELD: ${s.field}; DEGREE: ${s.degree || "not specified"}; DURATION: ${s.duration_years || 4} years`,
    `HSC GROUPS: ${(s.hsc_groups || []).join(", ") || "not specified"}; REQUIRED: ${(s.hsc_subjects_required || []).join(", ") || "verify circular"}; PREFERRED: ${(s.hsc_subjects_preferred || []).join(", ") || "none listed"}`,
    `OFFERINGS/SEATS: ${offerings || "No offering map yet"}; TOTAL KNOWN SEATS: ${s.total_seats || "unknown"}`,
    `JOBS/SALARIES: ${jobs || "No linked job data yet"}`,
    `TESTIMONIALS: ${stats.count || 0} total approved voices (${approvedBlobCount} newly approved submitted voices); choose again yes ${stats.wouldAgainYes || 0}, no ${stats.wouldAgainNo || 0}; would-again rate ${stats.wouldAgainRate ?? "n/a"}%, regret rate ${stats.regretRate ?? "n/a"}%; worth rating ${stats.avgSubjectWorthRating || "n/a"}/5; pressure ${stats.avgAcademicPressure || "n/a"}, faculty ${stats.avgFacultyQuality || "n/a"}, job reality ${stats.avgJobReality || "n/a"}`,
    `TESTIMONIAL HSC BACKGROUNDS: ${Object.entries(stats.hscGroups || {}).map(([group, count]) => `${group}: ${count}`).join(", ") || "n/a"}`,
    `TESTIMONIAL FIT SIGNALS: who should take: ${(stats.whoShould || []).join(" | ") || "n/a"}; who should not take: ${(stats.whoShouldNot || []).join(" | ") || "n/a"}; future opportunities: ${(stats.futureOpportunities || []).join(" | ") || "n/a"}; regret reasons: ${(stats.regretReasons || []).join(" | ") || "n/a"}`,
    `BCS: relevance ${s.bcs?.relevance || s.bcs_relevance || "unknown"}; cadres ${(s.bcs?.cadre_options || []).join(", ")}`,
    `4TH SUBJECT CAUTIONS: ${fourth || "No special optional-subject caution recorded"}`,
    `CURRICULUM RISK FLAGS: ${risks || "No major weed-out flags detected"}`,
    `OUTLINE: ${(s.curriculum || []).map(p => `${p.year}: ${(p.items || []).slice(0, 5).join(", ")}`).join(" / ")}`,
  ].join("\n");
}

function fallbackRecommendations(candidates) {
  return {
    recommendations: candidates.slice(0, 4).map(({ subject, score }) => ({
      slug: subject.slug,
      name: subject.name,
      score: Math.max(65, Math.min(95, score)),
      headline: `${subject.name} matches your strongest signals`,
      why: `This path matches your academic group and available EduPath BD data. It has ${subject.offerings?.length || 0} mapped university offerings, ${subject.related_jobs?.length || 0} linked job paths, and ${subject.testimonial_stats?.count || 0} approved student/alumni signal(s).`,
      caution: subject.testimonial_stats?.regretReasons?.[0] || subject.testimonial_stats?.whoShouldNot?.[0] || subject.fourth_subject_rules?.[0]?.consequence || subject.difficulty_flags?.[0]?.note || "Verify the latest admission circular and talk to current students before deciding.",
    })),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { profile, matched_subjects = [] } = req.body || {};
  if (!profile) return res.status(400).json({ error: "Missing profile" });

  const data = loadEduPathData();
  data.applyOverlay(await readOverlay());
  let candidates = data.matchCandidates(profile);
  if (matched_subjects.length > 0) {
    const allowed = new Set(matched_subjects);
    candidates = candidates.filter(c => allowed.has(c.subject.slug));
  }
  candidates = candidates.slice(0, 12);

  const approvedBySubject = await loadApprovedBlobTestimonials();
  candidates = applyApprovedBlobScore(candidates, approvedBySubject).slice(0, 12);

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(200).json(fallbackRecommendations(candidates));
  }

  const prompt = `You are an expert Bangladeshi admissions and career counselor.

Use ONLY the relational EduPath BD candidate data below. Do not invent universities, seats, salaries, testimonials, or admission rules.

STUDENT PROFILE:
${JSON.stringify(profile, null, 2)}

RELATIONAL CANDIDATES:
${candidates.map(candidate => candidateBlock(candidate, approvedBySubject)).join("\n\n---\n\n")}

Recommend exactly 4 undergraduate subjects. Be precise and Bangladesh-specific.

Decision rules:
1. Eligibility and HSC/optional-subject constraints override prestige.
2. Interest fit matters, but curriculum reality and weed-out courses must be explained.
3. Use testimonials as evidence strength, not as absolute truth.
4. Mention seats/university availability and job/salary reality when they affect ranking.
5. If data is thin, say it is thin.

Return ONLY valid JSON:
{
  "recommendations": [
    {
      "slug": "subject-slug",
      "name": "Subject Name",
      "score": 88,
      "headline": "6-10 word Bangladesh-specific reason",
      "why": "2-3 sentences based on the profile plus mapped seats/universities/jobs/testimonials.",
      "caution": "One specific caution about eligibility, curriculum pressure, job market, or testimonial/regret signal."
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const result = JSON.parse(jsonMatch[0]);
    res.status(200).json(result);
  } catch (err) {
    console.error("AI recommend error:", err.message);
    res.status(200).json({ ...fallbackRecommendations(candidates), warning: "AI failed; deterministic fallback used." });
  }
}
