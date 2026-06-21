import { requireAdmin } from "../../server-lib/admin-auth.js";
import { slugify } from "../../server-lib/overlay-store.js";

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function stripTags(html) {
  return clean(html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "));
}

function parseTables(html) {
  const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(m => m[0]);
  const proposals = [];
  for (const table of tables.slice(0, 8)) {
    const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(m => m[0]);
    const parsed = rows.map(row => [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(cell => stripTags(cell[1]))).filter(cells => cells.length >= 2);
    if (parsed.length < 2) continue;
    const header = parsed[0].map(h => h.toLowerCase());
    for (const cells of parsed.slice(1)) {
      const row = {};
      cells.forEach((cell, i) => {
        const h = header[i] || "";
        if (/department|dept/.test(h)) row.department = cell;
        if (/subject|program|programme|discipline/.test(h)) row.subject_name = cell;
        if (/degree|qualification/.test(h)) row.degree_name = cell;
        if (/seat|intake|capacity/.test(h)) row.seats = Number(String(cell).match(/\d+/)?.[0] || "") || null;
      });
      if (!row.subject_name && cells[0]) row.subject_name = cells[0];
      if (!row.department && cells[1] && !/\d/.test(cells[1])) row.department = cells[1];
      if (!row.seats) {
        const seatCell = cells.find(c => /\b\d{1,4}\b/.test(c) && /seat|intake|capacity|\d/.test(c.toLowerCase()));
        row.seats = Number(String(seatCell || "").match(/\d+/)?.[0] || "") || null;
      }
      if (row.subject_name || row.department) proposals.push(row);
    }
  }
  return proposals;
}

function inferFromText(text) {
  const lines = text.split(/[.;\n]/).map(clean).filter(line => line.length > 8 && line.length < 220);
  const proposals = [];
  for (const line of lines) {
    const seat = line.match(/(?:seat|seats|intake|capacity)\D{0,12}(\d{1,4})/i) || line.match(/(\d{1,4})\s*(?:seat|seats)/i);
    const subject = line.match(/(?:B\.?Sc\.?|Bachelor|BA|BBA|LLB|Engineering|Department of)\s+([A-Za-z &().-]{4,80})/i);
    if (seat || subject) {
      proposals.push({
        subject_name: clean(subject?.[1] || line.replace(/\d{1,4}.*/, "")).slice(0, 90),
        department: /department/i.test(line) ? line : "",
        degree_name: clean(line.match(/(B\.?Sc\.?[^,.;]*)|(Bachelor[^,.;]*)|(BBA)|(LLB)/i)?.[0] || ""),
        seats: seat ? Number(seat[1]) : null,
      });
    }
    if (proposals.length >= 30) break;
  }
  return proposals;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req, res)) return;

  const url = String(req.body?.url || "").trim();
  if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: "A valid http(s) URL is required." });

  const response = await fetch(url, {
    headers: {
      "User-Agent": "EduPathBDBot/1.0 (+https://edupath-bd.vercel.app)",
      "Accept": "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) return res.status(502).json({ error: `Fetch failed with ${response.status}` });

  const html = await response.text();
  const text = stripTags(html);
  const tableRows = parseTables(html);
  const inferred = tableRows.length ? [] : inferFromText(text);
  const base = tableRows.length ? tableRows : inferred;
  const universityName = clean(req.body?.universityName || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const universityId = slugify(req.body?.universityId || universityName);
  const offerings = base.map(row => ({
    university_id: universityId,
    university_name: universityName,
    department: row.department || row.subject_name || "",
    degree_name: row.degree_name || "",
    subject_name: row.subject_name || row.department || "",
    subject_slug: slugify(row.subject_slug || row.subject_name || row.department),
    seats: row.seats,
    source_url: url,
    confidence: row.seats ? "medium" : "low",
  })).filter(row => row.subject_slug);

  res.status(200).json({
    ok: true,
    sourceUrl: url,
    university: universityName ? { id: universityId, name: universityName, source_url: url } : null,
    offerings,
    sampleText: text.slice(0, 1200),
    warning: "Review extracted rows before importing. Scraped pages are messy and may need manual correction.",
  });
}
