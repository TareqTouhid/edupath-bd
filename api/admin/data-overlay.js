import { requireAdmin } from "../../server-lib/admin-auth.js";
import { mergeOverlay, readOverlay, writeOverlay } from "../../server-lib/overlay-store.js";

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  if (req.method === "GET") {
    const overlay = await readOverlay();
    return res.status(200).json({ ok: true, overlay });
  }

  const mode = req.body?.mode || "replace";
  const source = req.body?.source || "manual-admin";
  const current = await readOverlay();
  const next = mode === "merge"
    ? mergeOverlay(current, req.body?.overlay || {}, source)
    : { ...current, ...(req.body?.overlay || {}) };
  const saved = await writeOverlay(next);
  return res.status(200).json({ ok: true, overlay: saved.overlay, url: saved.url });
}
