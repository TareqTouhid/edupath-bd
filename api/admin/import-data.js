import { requireAdmin } from "../../server-lib/admin-auth.js";
import { mergeOverlay, readOverlay, writeOverlay } from "../../server-lib/overlay-store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  const patch = req.body?.patch;
  if (!patch || typeof patch !== "object") return res.status(400).json({ error: "Missing patch object." });

  const current = await readOverlay();
  const next = mergeOverlay(current, patch, req.body?.source || "admin-import");
  const saved = await writeOverlay(next);
  res.status(200).json({ ok: true, overlay: saved.overlay, url: saved.url });
}
