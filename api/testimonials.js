import { put } from "@vercel/blob";

const REQUIRED_FIELDS = [
  "currentCity",
  "currentCountry",
  "currentStatus",
  "profession",
  "undergradUniversity",
  "undergradSubjectName",
  "hscGroup",
  "session",
  "academicPressure",
  "facultyQuality",
  "jobReality",
  "subjectWorthRating",
  "wouldChooseAgain",
  "goodExperience",
  "badExperience",
  "whoShouldTake",
  "whoShouldNotTake",
  "futureOpportunities",
  "consent",
];

function cleanText(value, max = 1200) {
  return String(value || "").trim().slice(0, max);
}

function cleanScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1 || n > 5) return null;
  return n;
}

function slugify(value) {
  return cleanText(value, 180)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "unknown-subject";
}

function validate(body) {
  const missing = REQUIRED_FIELDS.filter(key => {
    if (key === "consent") return body[key] !== true;
    return body[key] === undefined || body[key] === null || body[key] === "";
  });
  if (String(body.wouldChooseAgain || "").toLowerCase() === "no" && !cleanText(body.chooseAgainReason)) {
    missing.push("chooseAgainReason");
  }
  if (missing.length) return { error: `Missing required fields: ${missing.join(", ")}` };

  const academicPressure = cleanScore(body.academicPressure);
  const facultyQuality = cleanScore(body.facultyQuality);
  const jobReality = cleanScore(body.jobReality);
  const subjectWorthRating = cleanScore(body.subjectWorthRating);
  if (!academicPressure || !facultyQuality || !jobReality || !subjectWorthRating) {
    return { error: "Metric scores must be numbers from 1 to 5." };
  }

  const undergradUniversity = cleanText(body.undergradUniversity || body.university, 180);
  const subjectName = cleanText(body.subjectName || body.undergradSubjectName || "", 180);
  const subjectSlug = cleanText(body.subjectSlug || body.undergradSubjectSlug || slugify(subjectName), 120);
  const wouldChooseAgain = cleanText(body.wouldChooseAgain, 12).toLowerCase();

  return {
    testimonial: {
      id: `approved_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      source: "submission",
      status: "approved",
      anonymous: true,
      approvedAt: new Date().toISOString(),
      schemaVersion: 2,
      currentCity: cleanText(body.currentCity, 120),
      currentCountry: cleanText(body.currentCountry, 120),
      currentStatus: cleanText(body.currentStatus, 80),
      profession: cleanText(body.profession, 160),
      designation: cleanText(body.designation || "", 160),
      undergradUniversity,
      university: undergradUniversity,
      universityNeedsReview: Boolean(body.universityNeedsReview),
      universityReviewName: cleanText(body.universityReviewName || "", 180),
      subjectSlug,
      undergradSubjectSlug: subjectSlug,
      subjectName,
      undergradSubjectName: subjectName,
      subjectNeedsReview: Boolean(body.subjectNeedsReview),
      subjectReviewName: cleanText(body.subjectReviewName || "", 180),
      hscGroup: cleanText(body.hscGroup, 40),
      session: cleanText(body.session, 60),
      academicPressure,
      facultyQuality,
      jobReality,
      subjectWorthRating,
      wouldChooseAgain,
      chooseAgainReason: cleanText(body.chooseAgainReason || ""),
      goodExperience: cleanText(body.goodExperience),
      badExperience: cleanText(body.badExperience),
      whoShouldTake: cleanText(body.whoShouldTake),
      whoShouldNotTake: cleanText(body.whoShouldNotTake),
      futureOpportunities: cleanText(body.futureOpportunities),
      wishKnew: cleanText(body.wishKnew || body.whoShouldTake),
      worstPart: cleanText(body.worstPart || body.badExperience),
      bestPart: cleanText(body.bestPart || body.goodExperience),
      jobTitle: cleanText(body.jobTitle || [body.designation, body.profession].filter(Boolean).join(" - "), 180),
      consent: true,
      createdAt: new Date().toISOString(),
    },
  };
}

async function storeInBlob(testimonial) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  const date = testimonial.createdAt.slice(0, 10);
  const slug = testimonial.subjectSlug || "unknown-subject";
  const pathname = `testimonials/approved/${date}/${slug}/${testimonial.id}.json`;
  const blob = await put(pathname, JSON.stringify(testimonial, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return blob.url;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const checked = validate(req.body || {});
  if (checked.error) return res.status(400).json({ error: checked.error });

  const stored = [];
  try {
    const blobUrl = await storeInBlob(checked.testimonial);
    if (blobUrl) stored.push({ type: "blob", url: blobUrl });
  } catch (err) {
    return res.status(502).json({ error: "Testimonial blob storage failed.", detail: err.message });
  }

  if (process.env.TESTIMONIAL_WEBHOOK_URL) {
    const response = await fetch(process.env.TESTIMONIAL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checked.testimonial),
    });
    if (!response.ok) {
      return res.status(502).json({ error: "Testimonial storage webhook failed." });
    }
    stored.push({ type: "webhook" });
  }

  return res.status(202).json({
    ok: true,
    testimonial: checked.testimonial,
    stored,
    storage: stored.length ? stored.map(s => s.type).join("+") : "not-configured",
  });
}
