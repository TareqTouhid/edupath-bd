export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const configured = process.env.ADMIN_REVIEW_TOKEN;
  if (!configured) {
    return res.status(503).json({ error: "ADMIN_REVIEW_TOKEN is not configured." });
  }

  const token = String(req.body?.token || req.body?.password || "").trim();
  if (!token || token !== configured) {
    return res.status(401).json({ error: "Invalid admin password." });
  }

  return res.status(200).json({
    ok: true,
    role: "admin",
    expiresInHours: 24
  });
}
