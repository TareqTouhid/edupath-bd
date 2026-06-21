import { list } from "@vercel/blob";

async function readBlob(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
  });
  if (!res.ok) return null;
  return res.json();
}

function publicFields(t) {
  return {
    id: t.id,
    schemaVersion: t.schemaVersion || 1,
    currentCity: t.currentCity,
    currentCountry: t.currentCountry,
    currentStatus: t.currentStatus,
    profession: t.profession,
    designation: t.designation,
    university: t.undergradUniversity || t.university,
    undergradUniversity: t.undergradUniversity || t.university,
    universityNeedsReview: Boolean(t.universityNeedsReview),
    universityReviewName: t.universityReviewName,
    subjectSlug: t.subjectSlug || t.undergradSubjectSlug,
    undergradSubjectSlug: t.undergradSubjectSlug || t.subjectSlug,
    subjectName: t.subjectName || t.undergradSubjectName,
    undergradSubjectName: t.undergradSubjectName || t.subjectName,
    subjectNeedsReview: Boolean(t.subjectNeedsReview),
    subjectReviewName: t.subjectReviewName,
    hscGroup: t.hscGroup,
    session: t.session,
    wouldChooseAgain: t.wouldChooseAgain,
    chooseAgainReason: t.chooseAgainReason,
    academicPressure: t.academicPressure,
    facultyQuality: t.facultyQuality,
    jobReality: t.jobReality,
    subjectWorthRating: t.subjectWorthRating,
    goodExperience: t.goodExperience || t.bestPart,
    badExperience: t.badExperience || t.worstPart,
    whoShouldTake: t.whoShouldTake || t.wishKnew,
    whoShouldNotTake: t.whoShouldNotTake,
    futureOpportunities: t.futureOpportunities || t.jobTitle,
    wishKnew: t.wishKnew || t.whoShouldTake,
    worstPart: t.worstPart || t.badExperience,
    bestPart: t.bestPart || t.goodExperience,
    jobTitle: t.jobTitle,
    approvedAt: t.approvedAt,
    anonymous: true,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ ok: true, count: 0, rows: [] });
  }

  const subject = String(req.query?.subject || "").trim();
  const result = await list({ prefix: "testimonials/approved/", limit: 200 });
  const rows = [];

  for (const blob of result.blobs || []) {
    if (subject && !blob.pathname.includes(`/${subject}/`)) continue;
    try {
      const t = await readBlob(blob.url);
      if (!t) continue;
      rows.push(publicFields(t));
    } catch {
      // skip malformed
    }
  }

  res.status(200).json({ ok: true, count: rows.length, rows });
}
