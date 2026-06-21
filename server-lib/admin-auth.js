export function requireAdmin(req, res) {
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
