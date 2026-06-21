// Vercel serverless function — AI-powered subject recommendation
// POST /api/recommend  { profile: {...wizardInputs}, matched_subjects: [...slugs] }
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Load subjects DB at cold start
let SUBJECTS_DB = [];
let TESTIMONIALS_DB = [];
try {
  const __dir = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(join(__dir, "../db/subjects_db.js"), "utf8");
  SUBJECTS_DB = JSON.parse(src.replace(/^[^[]*/, "").replace(/;\s*$/, ""));

  const pfSrc = readFileSync(join(__dir, "../extracted/pfdata.js"), "utf8");
  const sandbox = { window: {} };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(pfSrc, sandbox, { timeout: 1000 });
  TESTIMONIALS_DB = (sandbox.window.PFData && sandbox.window.PFData.testimonials) || [];
} catch (e) {
  // Fallback minimal list
  SUBJECTS_DB = [];
  TESTIMONIALS_DB = [];
}

function summarizeTestimonials(subjectSlugs) {
  return subjectSlugs.map(slug => {
    const rows = TESTIMONIALS_DB.filter(t => t.subjectSlug === slug);
    if (!rows.length) return `- ${slug}: no approved testimonial evidence yet`;

    const yes = rows.filter(t => String(t.again).toLowerCase() === "yes").length;
    const no = rows.filter(t => String(t.again).toLowerCase() === "no").length;
    const examples = rows.slice(0, 3).map(t => {
      const uni = t.uni ? ` at ${t.uni}` : "";
      const role = t.role ? `; outcome: ${t.role}` : "";
      const caution = t.bad ? `; caution: ${t.bad}` : "";
      return `${t.subjectName || slug}${uni}${role}${caution}`;
    }).join(" | ");

    return `- ${slug}: ${rows.length} approved voices; would choose again ${yes}, would not ${no}. ${examples}`;
  }).join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { profile, matched_subjects = [] } = req.body || {};
  if (!profile) return res.status(400).json({ error: "Missing profile" });

  // Build subject list from pre-filtered matches (client already filtered by HSC group)
  const relevant = matched_subjects.length > 0
    ? SUBJECTS_DB.filter(s => matched_subjects.includes(s.slug))
    : SUBJECTS_DB.filter(s => !s.hsc_groups || s.hsc_groups.includes(profile.hscGroup));

  const subjectList = relevant.map(s =>
    `- ${s.slug} | ${s.name} (${s.field}): ${s.desc || ""}`
  ).join("\n");
  const testimonialSignals = summarizeTestimonials(relevant.map(s => s.slug));

  const interestLabels = {
    coding: "building software / coding",
    mathematics: "solving complex math problems",
    "building-things": "designing & building structures",
    "business-money": "business, markets & money",
    "writing-language": "creative writing / language",
    "law-governance": "law, politics & governance",
    "lab-research": "lab experiments & research",
    "nature-environment": "nature, plants & animals",
    "creative-design": "art, design & visual creation",
    "helping-people": "helping & serving people",
    technology: "technology & electronics",
    "agriculture-food": "agriculture & food science",
    healthcare: "healthcare & medicine",
    "arts-culture": "arts, culture & heritage",
  };

  const interests = (profile.interests || []).map(k => interestLabels[k] || k).join(", ");
  const gpaInfo = profile.sscGpa && profile.hscGpa
    ? `SSC GPA: ${profile.sscGpa}/5.00, HSC GPA: ${profile.hscGpa}/5.00`
    : "GPA not provided";

  const prompt = `You are an expert Bangladeshi university admissions counselor with deep knowledge of the job market. A student has completed a profile quiz and our system has pre-filtered ${relevant.length} subject options that match their HSC group eligibility.

STUDENT PROFILE:
- HSC Group: ${profile.hscGroup || "not specified"}
- ${gpaInfo}
- Interests: ${interests || "not specified"}
- Preferred domains: ${(profile.domains || []).join(", ") || "not specified"}
- Location preference: ${profile.division || "Anywhere"}
- University type: ${profile.uniType || "both"}

PRE-FILTERED ELIGIBLE SUBJECTS (${relevant.length} options):
${subjectList}

REAL STUDENT / GRADUATE EXPERIENCE SIGNALS:
${testimonialSignals}

Your task: Recommend exactly 4 subjects from this list that best match the student's complete profile. Consider:
1. Strong alignment between their interests and the subject's daily reality
2. GPA realism — higher difficulty subjects need stronger GPA
3. Job market in Bangladesh (not just prestigious, but actually employable)
4. The specific Bangladeshi context — what actually happens after graduation

Return ONLY valid JSON, no other text:
{
  "recommendations": [
    {
      "slug": "the-slug",
      "name": "Subject Name",
      "score": 88,
      "headline": "6–8 word reason why it fits them specifically",
      "why": "2 sentences explaining the match based on their specific interests and GPA",
      "caution": "One genuinely useful caution about this subject in Bangladesh — job market, difficulty spike, common regrets"
    }
  ]
}

Rules:
- Scores 65–95 (no perfect scores, no terrible ones)
- Be specific to Bangladesh — mention real outcomes, not generic advice
- The caution must be honest and specific, not generic ("job market is competitive" is not useful)
- If their GPA is below 3.5, gently steer away from ultra-competitive subjects like CSE at top universities`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const result = JSON.parse(jsonMatch[0]);
    res.status(200).json(result);
  } catch (err) {
    console.error("AI recommend error:", err.message);
    res.status(500).json({ error: "AI recommendation failed", detail: err.message });
  }
}
