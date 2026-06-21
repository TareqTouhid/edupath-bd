import { readOverlay } from "../server-lib/overlay-store.js";

function publicOverlay(overlay) {
  return {
    version: overlay.version,
    updatedAt: overlay.updatedAt,
    universities: overlay.universities || [],
    subjects: overlay.subjects || [],
    offerings: overlay.offerings || [],
    jobs: overlay.jobs || [],
    searchSignals: overlay.searchSignals || {},
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const overlay = await readOverlay();
  res.status(200).json({ ok: true, overlay: publicOverlay(overlay) });
}
