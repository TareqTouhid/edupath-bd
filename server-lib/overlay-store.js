import { get, put } from "@vercel/blob";

export const OVERLAY_PATH = "central-db/edupath-overlay.json";

export function emptyOverlay() {
  return {
    version: 1,
    updatedAt: null,
    universities: [],
    subjects: [],
    offerings: [],
    jobs: [],
    searchSignals: {
      queries: {},
      clicks: {},
      approvedTestimonials: {},
    },
    imports: [],
  };
}

async function streamToText(stream) {
  const response = new Response(stream);
  return response.text();
}

export async function readOverlay() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return emptyOverlay();
  try {
    const file = await get(OVERLAY_PATH);
    if (!file || file.statusCode !== 200) return emptyOverlay();
    return { ...emptyOverlay(), ...JSON.parse(await streamToText(file.stream)) };
  } catch {
    return emptyOverlay();
  }
}

export async function writeOverlay(overlay) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Blob storage is not configured.");
  }
  const next = {
    ...emptyOverlay(),
    ...overlay,
    version: Number(overlay.version || 1),
    updatedAt: new Date().toISOString(),
  };
  const blob = await put(OVERLAY_PATH, JSON.stringify(next, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return { overlay: next, url: blob.url };
}

export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function upsertByKey(rows, nextRows, key) {
  const map = new Map((rows || []).map(row => [row[key], row]));
  for (const row of nextRows || []) {
    if (!row || !row[key]) continue;
    map.set(row[key], { ...(map.get(row[key]) || {}), ...row });
  }
  return Array.from(map.values());
}

function offeringKey(row) {
  return [row.university_id, row.subject_slug, row.department || "", row.degree_name || ""].join("::");
}

export function mergeOverlay(base, patch, source = "manual") {
  const overlay = { ...emptyOverlay(), ...base };
  const normalized = {
    universities: (patch.universities || []).map(row => ({
      ...row,
      id: row.id || slugify(row.short || row.name),
      source,
    })),
    subjects: (patch.subjects || []).map(row => ({
      ...row,
      slug: row.slug || slugify(row.name || row.subject_name),
      source,
    })),
    jobs: (patch.jobs || []).map(row => ({
      ...row,
      slug: row.slug || slugify(row.title),
      source,
    })),
    offerings: (patch.offerings || []).map(row => ({
      ...row,
      university_id: row.university_id || slugify(row.university_name),
      subject_slug: row.subject_slug || slugify(row.subject_name),
      seats: row.seats === "" || row.seats == null ? null : Number(row.seats),
      source,
    })),
  };

  overlay.universities = upsertByKey(overlay.universities, normalized.universities, "id");
  overlay.subjects = upsertByKey(overlay.subjects, normalized.subjects, "slug");
  overlay.jobs = upsertByKey(overlay.jobs, normalized.jobs, "slug");
  const offeringMap = new Map((overlay.offerings || []).map(row => [offeringKey(row), row]));
  for (const row of normalized.offerings) offeringMap.set(offeringKey(row), { ...(offeringMap.get(offeringKey(row)) || {}), ...row });
  overlay.offerings = Array.from(offeringMap.values());

  overlay.imports = [
    ...(overlay.imports || []),
    {
      source,
      addedAt: new Date().toISOString(),
      counts: {
        universities: normalized.universities.length,
        subjects: normalized.subjects.length,
        offerings: normalized.offerings.length,
        jobs: normalized.jobs.length,
      },
    },
  ].slice(-50);
  return overlay;
}
