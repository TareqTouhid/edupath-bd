import { list } from "@vercel/blob";

function requireAdmin(req, res) {
  const configured = process.env.ADMIN_REVIEW_TOKEN;
  if (!configured) {
    res.status(503).json({ error: "ADMIN_REVIEW_TOKEN is not configured." });
    return false;
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.query?.token;
  if (token !== configured) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

async function readBlob(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: "Blob storage is not configured." });

  const result = await list({ prefix: "testimonials/pending/", limit: 100 });
  const rows = [];
  for (const blob of result.blobs || []) {
    try {
      const json = await readBlob(blob.url);
      rows.push({
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
        testimonial: json || {},
      });
    } catch (err) {
      rows.push({
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
        error: err.message,
      });
    }
  }

  res.status(200).json({ ok: true, count: rows.length, rows });
}
