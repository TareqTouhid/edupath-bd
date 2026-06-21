import { del, put, list } from "@vercel/blob";

function requireAdmin(req, res) {
  const configured = process.env.ADMIN_REVIEW_TOKEN;
  if (!configured) {
    res.status(503).json({ error: "ADMIN_REVIEW_TOKEN is not configured." });
    return false;
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.body?.token || req.query?.token;
  if (token !== configured) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

async function readBlobByPathname(pathname) {
  const result = await list({ prefix: pathname, limit: 1 });
  const blob = result.blobs?.[0];
  if (!blob) return null;
  const res = await fetch(blob.url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
  });
  if (!res.ok) return null;
  return res.json();
}

function publicShape(testimonial) {
  return {
    ...testimonial,
    status: "approved",
    approvedAt: new Date().toISOString(),
    anonymous: true,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: "Blob storage is not configured." });

  const pathname = req.body?.pathname;
  if (!pathname || !pathname.startsWith("testimonials/pending/")) {
    return res.status(400).json({ error: "A pending testimonial pathname is required." });
  }

  const pending = await readBlobByPathname(pathname);
  if (!pending) return res.status(404).json({ error: "Pending testimonial not found." });

  const approved = publicShape(pending);
  const date = approved.approvedAt.slice(0, 10);
  const subject = approved.subjectSlug || "unknown-subject";
  const approvedPath = `testimonials/approved/${date}/${subject}/${approved.id}.json`;
  const blob = await put(approvedPath, JSON.stringify(approved, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  if (req.body?.deletePending !== false) await del(pathname);

  res.status(200).json({
    ok: true,
    approved,
    approvedPath,
    approvedUrl: blob.url,
    pendingDeleted: req.body?.deletePending !== false,
  });
}
