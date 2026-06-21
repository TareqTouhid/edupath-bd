"""
EduPath BD — Static SEO Page Generator
Generates /subject/{slug}/index.html for each subject.
Each page has specific <head> meta tags for Googlebot, but the body
loads the same React app which routes to the detail screen via URL hash.

Run: python3 build_seo.py
Output: subject/{slug}/index.html for each subject in DB_Subjects
"""
import os, re, json

ROOT = r"H:\education system bd"
OUT_DIR = os.path.join(ROOT, "subject")
DB_FILE = os.path.join(ROOT, "db", "subjects_db.js")
UNI_FILE = os.path.join(ROOT, "university-subjects.js")
INDEX_HTML = os.path.join(ROOT, "index.html")

# ── 1. Parse subjects from subjects_db.js ─────────────────────────────────
def parse_subjects(js_path):
    """Extract slug, name, desc, field, degree from subjects_db.js."""
    with open(js_path, encoding="utf-8") as f:
        content = f.read()

    subjects = []
    # The file is a JS array. Each subject's flat scalar fields appear before
    # the "curriculum" key which begins a deeply nested array. We can safely
    # extract the preamble of each object by splitting on '"slug":' and reading
    # the first ~400 chars of each block (enough to cover the flat fields).
    parts = content.split('"slug":')
    for part in parts[1:]:  # skip everything before the first subject
        # Take just the first 600 chars — flat fields appear before curriculum nesting
        head = part[:600]
        slug_m   = re.search(r'"([a-z0-9\-]+)"', head)
        name_m   = re.search(r'"name":\s*"([^"]+)"', head)
        degree_m = re.search(r'"degree":\s*"([^"]+)"', head)
        field_m  = re.search(r'"field":\s*"([^"]+)"', head)
        desc_m   = re.search(r'"desc":\s*"([^"]+)"', head)

        if slug_m and name_m:
            subjects.append({
                "slug":   slug_m.group(1),
                "name":   name_m.group(1),
                "degree": degree_m.group(1) if degree_m else "Bachelor's",
                "field":  field_m.group(1)  if field_m  else "",
                "desc":   desc_m.group(1)   if desc_m   else "",
            })

    return subjects


# ── 2. Parse university seat data ─────────────────────────────────────────
def parse_uni_seats(js_path):
    """Extract SubjectUniIds and SubjectSeats from university-subjects.js."""
    with open(js_path, encoding="utf-8") as f:
        content = f.read()

    # Extract SubjectUniIds block
    uni_ids = {}
    uni_match = re.search(r'window\.SubjectUniIds\s*=\s*(\{[^;]+\})', content, re.DOTALL)
    if uni_match:
        try:
            # Clean up JS object to make it valid JSON (handles trailing commas)
            raw = uni_match.group(1)
            raw = re.sub(r',\s*}', '}', raw)
            raw = re.sub(r',\s*]', ']', raw)
            uni_ids = json.loads(raw)
        except Exception:
            pass

    # Extract SubjectSeats block
    seats = {}
    seats_match = re.search(r'window\.SubjectSeats\s*=\s*(\{[^;]+\})', content, re.DOTALL)
    if seats_match:
        try:
            raw = seats_match.group(1)
            raw = re.sub(r',\s*}', '}', raw)
            raw = re.sub(r',\s*]', ']', raw)
            seats = json.loads(raw)
        except Exception:
            pass

    return uni_ids, seats

# ── 3. University display names ────────────────────────────────────────────
UNI_NAMES = {
    "du": "Dhaka University",
    "buet": "BUET",
    "ju": "Jahangirnagar University",
    "ru": "Rajshahi University",
    "cu": "Chittagong University",
    "sust": "SUST",
    "ku": "Khulna University",
    "kuet": "KUET",
    "ruet": "RUET",
    "duet": "DUET",
    "jnu": "Jagannath University",
    "bup": "Bangladesh University of Professionals",
    "brur": "Begum Rokeya University",
    "hstu": "Hajee Mohammad Danesh University",
    "cou": "Comilla University",
    "gb": "Government Barendrabhu University",
    "iu": "Islamic University",
    "bau": "Bangladesh Agricultural University",
    "bsmrmu": "BSMRMU",
    "ubar": "University of Barishal",
    "butex": "BUTEX",
}

FIELD_LABELS = {
    "technology": "Engineering & Technology",
    "business": "Business & Commerce",
    "science": "Natural Sciences",
    "social-science": "Social Sciences",
    "humanities": "Arts & Humanities",
    "environmental": "Life & Earth Sciences",
    "design": "Design & Architecture",
    "applied": "Health & Applied Sciences"
}

# ── 4. Generate one static HTML page per subject ──────────────────────────
def generate_page(subj, uni_ids, seats, base_html):
    slug  = subj["slug"]
    name  = subj["name"]
    desc  = subj["desc"][:160] if subj["desc"] else f"Explore {name} — curriculum, universities, job salaries, and admission requirements in Bangladesh."
    field = FIELD_LABELS.get(subj["field"], subj["field"].replace("-", " ").title())
    degree = subj.get("degree", "Bachelor's")

    # Build dynamic meta content
    uni_list = uni_ids.get(slug, [])
    seat_map = seats.get(slug, {})
    total_seats = sum(seat_map.values())
    top_unis_str = ", ".join(UNI_NAMES.get(u, u.upper()) for u in uni_list[:4])

    title = f"{name} in Bangladesh — Admission, Seats & Salary | EduPath BD"
    og_desc = (
        f"Everything about {name} ({degree}) in Bangladesh: "
        f"admission requirements, seat count ({total_seats} merit seats), "
        f"top universities ({top_unis_str}), and real salary data. "
        f"Find your path with EduPath BD."
    )[:300]

    # Schema.org structured data
    schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": name,
        "description": desc,
        "provider": {
            "@type": "Organization",
            "name": "EduPath BD",
            "url": "https://edupath.bd"
        },
        "educationalLevel": degree,
        "about": {
            "@type": "Thing",
            "name": field
        }
    }, ensure_ascii=False, indent=2)

    # Inject subject slug into body so the SPA can route to it on load
    # The React app checks window.__SUBJECT_SLUG__ to auto-navigate to the detail page
    page_html = re.sub(
        r'<head>',
        f'''<head>
  <!-- ═══ SEO: {name} ═══ -->
  <title>{title}</title>
  <meta name="description" content="{og_desc}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{og_desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="EduPath BD" />
  <link rel="canonical" href="https://edupath.bd/subject/{slug}/" />
  <script type="application/ld+json">
{schema}
  </script>
  <!-- ═══ END SEO ═══ -->''',
        base_html, count=1
    )

    # Inject the auto-navigation script right before </body>
    nav_script = f"""
<script>
// Auto-navigate to subject detail on page load (SPA deep-link)
(function() {{
  window.__SUBJECT_SLUG__ = "{slug}";
  window.__AUTO_SCREEN__ = "detail";
  // Wait for React to mount then navigate
  var attempts = 0;
  var timer = setInterval(function() {{
    attempts++;
    // The App component watches window.__AUTO_SCREEN__ to route on mount
    if (window.__PF_NAVIGATE__ || attempts > 40) clearInterval(timer);
    if (typeof window.__PF_NAVIGATE__ === 'function') {{
      window.__PF_NAVIGATE__("{slug}");
      clearInterval(timer);
    }}
  }}, 100);
}})();
</script>"""

    page_html = page_html.replace("</body>", nav_script + "\n</body>")
    return page_html

# ── 5. Main build ─────────────────────────────────────────────────────────
def main():
    print("EduPath BD — Static SEO Generator")
    print("=" * 40)

    subjects = parse_subjects(DB_FILE)
    print(f"Subjects parsed: {len(subjects)}")

    uni_ids, seats = parse_uni_seats(UNI_FILE)
    print(f"UniIds parsed for {len(uni_ids)} subjects")
    print(f"Seat data parsed for {len(seats)} subjects")

    with open(INDEX_HTML, encoding="utf-8") as f:
        base_html = f.read()
    print(f"Base index.html loaded ({len(base_html)//1024} KB)")

    os.makedirs(OUT_DIR, exist_ok=True)
    created = 0

    for subj in subjects:
        slug = subj["slug"]
        page_dir = os.path.join(OUT_DIR, slug)
        os.makedirs(page_dir, exist_ok=True)
        page_path = os.path.join(page_dir, "index.html")

        page_html = generate_page(subj, uni_ids, seats, base_html)
        with open(page_path, "w", encoding="utf-8") as f:
            f.write(page_html)

        uni_count = len(uni_ids.get(slug, []))
        total_seats = sum(seats.get(slug, {}).values())
        print(f"  [{created+1:02d}] /subject/{slug}/ — {uni_count} unis, {total_seats} seats")
        created += 1

    print(f"[OK] Generated {created} subject pages in {OUT_DIR}")
    print(f"   Deploy: vercel --prod (subject/ dir is auto-included)\n")

    # Generate sitemap.xml
    sitemap_lines = ['<?xml version="1.0" encoding="UTF-8"?>',
                     '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                     '  <url><loc>https://edupath.bd/</loc><priority>1.0</priority></url>']
    for subj in subjects:
        sitemap_lines.append(f'  <url><loc>https://edupath.bd/subject/{subj["slug"]}/</loc><priority>0.8</priority></url>')
    sitemap_lines.append('</urlset>')
    sitemap_path = os.path.join(ROOT, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap_lines))
    print(f"[OK] sitemap.xml generated -- {len(subjects) + 1} URLs")

if __name__ == "__main__":
    main()
