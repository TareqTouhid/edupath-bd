import { put } from "@vercel/blob";

const REQUIRED_FIELDS = [
  "university",
  "subjectSlug",
  "currentStatus",
  "wouldChooseAgain",
  "academicPressure",
  "facultyQuality",
  "jobReality",
  "wishKnew",
  "worstPart",
  "bestPart",
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

function validate(body) {
  const missing = REQUIRED_FIELDS.filter(key => {
    if (key === "consent") return body[key] !== true;
    return body[key] === undefined || body[key] === null || body[key] === "";
  });
  if (missing.length) return { error: `Missing required fields: ${missing.join(", ")}` };

  const academicPressure = cleanScore(body.academicPressure);
  const facultyQuality = cleanScore(body.facultyQuality);
  const jobReality = cleanScore(body.jobReality);
  if (!academicPressure || !facultyQuality || !jobReality) {
    return { error: "Metric scores must be numbers from 1 to 5." };
  }

  return {
    testimonial: {
      id: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      source: "submission",
      status: "pending_review",
      university: cleanText(body.university, 180),
      subjectSlug: cleanText(body.subjectSlug, 120),
      subjectName: cleanText(body.subjectName || "", 180),
      currentStatus: cleanText(body.currentStatus, 80),
      wouldChooseAgain: cleanText(body.wouldChooseAgain, 12).toLowerCase(),
      academicPressure,
      facultyQuality,
      jobReality,
      wishKnew: cleanText(body.wishKnew),
      worstPart: cleanText(body.worstPart),
      bestPart: cleanText(body.bestPart),
      jobTitle: cleanText(body.jobTitle || "", 180),
      consent: true,
      createdAt: new Date().toISOString(),
    },
  };
}

async function storeInBlob(testimonial) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  const date = testimonial.createdAt.slice(0, 10);
  const slug = testimonial.subjectSlug || "unknown-subject";
  const pathname = `testimonials/pending/${date}/${slug}/${testimonial.id}.json`;
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
