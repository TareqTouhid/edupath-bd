import { readOverlay, writeOverlay } from "../server-lib/overlay-store.js";

function inc(obj, key, amount = 1) {
  if (!key) return;
  obj[key] = (Number(obj[key]) || 0) + amount;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(200).json({ ok: true, stored: false });

  const { type, query, entityType, entityId } = req.body || {};
  const overlay = await readOverlay();
  overlay.searchSignals ||= { queries: {}, clicks: {}, approvedTestimonials: {} };
  if (type === "query") {
    inc(overlay.searchSignals.queries, String(query || "").trim().toLowerCase());
  }
  if (type === "click") {
    inc(overlay.searchSignals.clicks, [entityType, entityId].filter(Boolean).join(":"));
    if (query) inc(overlay.searchSignals.clicks, `query:${String(query).trim().toLowerCase()}:${entityType}:${entityId}`);
  }
  await writeOverlay(overlay);
  res.status(200).json({ ok: true, stored: true });
}
