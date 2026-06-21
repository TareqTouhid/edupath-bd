"""
EduPath BD — Data generator
Reads CSV university/subject data → updates subject-universities.js and universities.js
Run: python3 _generate_data.py
"""

import csv, json, re, os
from collections import defaultdict

# ── 1. CSV university name → our university ID ────────────────────────────
UNI_ID = {
    "University of Dhaka (DU)": "du",
    "Bangladesh University of Engineering and Technology (BUET)": "buet",
    "Rajshahi University (RU)": "ru",
    "Jahangirnagar University (JU)": "ju",
    "Jahangirnagar University": "ju",
    "Shahjalal University of Science & Technology (SUST)": "sust",
    "Bangladesh Agricultural University (BAU)": "bau",
    "Gono Bishwabidyalay (GB)": "gb",
    "Khulna University of Engineering & Technology (KUET)": "kuet",
    "Rajshahi University of Engineering & Technology (RUET)": "ruet",
    "Dhaka University of Engineering & Technology (DUET)": "duet",
    "Khulna University": "ku",
    "Chittagong University": "cu",
    "University of Chittagong (CU)": "cu",
    "Jagannath University": "jnu",
    "Jagannath University (JnU)": "jnu",
    "Islamic University": "iu",
    "Cumilla University": "cou",
    "Comilla University (CoU)": "cou",
    "Barishal University": "ubar",
    "Bangabandhu Sheikh Mujibur Rahman Maritime University (BSMRMU)": "bsmrmu",
    "Bangladesh University of Textiles (BUTEX)": "butex",
    "Bangladesh University of Professionals (BUP)": "bup",
    "Begum Rokeya University (BRUR)": "brur",
    "Hajee Mohammad Danesh Science and Technology University (HSTU)": "hstu",
}

# University type (public/private) — all CSVs are public universities
PUBLIC_IDS = set(UNI_ID.values())

# ── 2. Subject name → slug ────────────────────────────────────────────────
def slugify_subject(name):
    n = name.lower().strip()
    # Engineering
    if re.search(r'computer science.*(engineering|technology)|cse|software engineering|information technology|information.*communication', n): return "cse"
    if re.search(r'electrical.*(electronic|electronics)|electronics.*communication', n): return "eee"
    if re.search(r'civil.*engineer|building.*construction', n): return "civil-engineering"
    if re.search(r'mechanical.*engineer|mechatronics', n): return "mechanical-engineering"
    if re.search(r'^architecture$|architecture.*planning|architectural', n): return "architecture"
    if re.search(r'graphic.*design|ui.*ux|fashion design', n): return "uiux"
    if re.search(r'textile engineer|yarn|fabric|wet process|dyes.*chem', n): return "textile-engineering"
    if re.search(r'chemical engineer|chemical.*polymer', n): return "chemical-engineering"
    if re.search(r'biomedical|medical.*physics', n): return "biomedical-engineering"
    if re.search(r'industrial.*production|industrial.*engineering', n): return "industrial-engineering"
    if re.search(r'naval architect|marine engineer', n): return "naval-architecture"
    if re.search(r'urban.*regional|urban.*plan', n): return "urban-planning"
    if re.search(r'agricultural engineer|food.*process.*engineer|food engineer', n): return "agricultural-engineering"
    if re.search(r'petroleum|mining engineer', n): return "petroleum-engineering"
    if re.search(r'materials.*metallurgi|materials science', n): return "materials-engineering"
    if re.search(r'energy science', n): return "energy-engineering"
    if re.search(r'leather engineer', n): return "leather-engineering"
    # Business
    if re.search(r'^accounting$|accounting.*information|accounting.*system|accounts', n): return "accounting"
    if re.search(r'finance.*banking|banking.*insurance|banking.*finance', n): return "finance-banking"
    if re.search(r'^finance$', n): return "finance-banking"
    if re.search(r'economics|agricultural econom', n): return "economics"
    if re.search(r'business admin|management.*business|bba|management studies|management$|marketing|tourism.*hospitality|international business|organisation.*strategy', n): return "bba"
    # Sciences
    if re.search(r'^physics$|applied physics', n): return "physics"
    if re.search(r'^chemistry$|chemistry.*physics', n): return "chemistry"
    if re.search(r'^mathematics$|applied math|math$', n): return "mathematics"
    if re.search(r'^statistics$|applied statistics|data science', n): return "statistics"
    if re.search(r'botany|plant', n): return "botany"
    if re.search(r'zoology|animal husbandry|veterinary', n): return "zoology"
    if re.search(r'^agriculture$|agronomy|agricultural.*rural|agri-tech|food safety', n): return "agriculture"
    if re.search(r'geography|environmental science|environment', n): return "geography"
    if re.search(r'geology|geological', n): return "geography"
    if re.search(r'oceanography|marine|fisheries|meteorology', n): return "marine-sciences"
    if re.search(r'microbiology', n): return "microbiology"
    if re.search(r'biochemistry|molecular biology', n): return "biochemistry"
    if re.search(r'genetic.*bio|biotechnology', n): return "biotechnology"
    if re.search(r'food.*tech|food.*science|food.*tea', n): return "food-technology"
    if re.search(r'forestry', n): return "forestry"
    if re.search(r'psychology', n): return "psychology"
    if re.search(r'nutrition', n): return "nutrition"
    # Social Sciences
    if re.search(r'sociology', n): return "sociology"
    if re.search(r'political science|political studies|government.*politics|governance', n): return "political-science"
    if re.search(r'social work|social welfare', n): return "social-work"
    if re.search(r'public admin', n): return "public-administration"
    if re.search(r'development studies', n): return "development-studies"
    if re.search(r'^law$|law.*justice|law.*land|maritime law', n): return "law"
    if re.search(r'international relations', n): return "international-relations"
    if re.search(r'anthropology', n): return "anthropology"
    if re.search(r'population|demographics', n): return "demographics"
    if re.search(r'social science$', n): return "sociology"
    # Humanities
    if re.search(r'^bangla$', n): return "bangla"
    if re.search(r'^english$|english.*speaker', n): return "english"
    if re.search(r'^history$|islamic history', n): return "history"
    if re.search(r'philosophy', n): return "philosophy"
    if re.search(r'islamic studies', n): return "islamic-studies"
    if re.search(r'journalism|mass communication|media studies|communication.*journalism|tv.*film', n): return "journalism"
    if re.search(r'arabic|persian|urdu|sanskrit|pali|french|japanese|chinese', n): return "language-studies"
    if re.search(r'fine arts|drawing.*paint|sculpture|printmaking|ceramic|oriental art|craft$', n): return "fine-arts"
    if re.search(r'music|dance|theatre|drama', n): return "performing-arts"
    if re.search(r'linguistics', n): return "linguistics"
    if re.search(r'women.*gender|gender.*studies', n): return "social-work"
    if re.search(r'criminology|criminal', n): return "law"
    if re.search(r'disaster.*management|disaster science|climate resilience', n): return "geography"
    if re.search(r'public health|health informatics', n): return "pharmacy"
    if re.search(r'peace.*conflict|conflict.*human rights', n): return "political-science"
    if re.search(r'archaeology', n): return "history"
    if re.search(r'folklore', n): return "bangla"
    if re.search(r'television.*film|film.*photo|tv.*film', n): return "journalism"
    if re.search(r'printing.*publication', n): return "journalism"
    if re.search(r'world religions', n): return "islamic-studies"
    if re.search(r'water resources', n): return "civil-engineering"
    if re.search(r'port.*management|logistics', n): return "bba"
    if re.search(r'statistic$', n): return "statistics"
    if re.search(r'management.*information|mis$', n): return "bba"
    if re.search(r'nuclear engineer', n): return "eee"
    if re.search(r'organisation.*strategy|international business|tourism.*hospitality', n): return "bba"
    if re.search(r'communication disorders', n): return "sociology"
    # Health
    if re.search(r'pharmacy', n): return "pharmacy"
    return None  # unmapped

# ── 3. Load & parse CSVs ──────────────────────────────────────────────────
rows = []
seen = set()
for f in [
    r'C:/Users/User/Downloads/bd_all_universities_master_final_v2.csv',
    r'C:/Users/User/Downloads/consolidated_universities_db.csv',
]:
    if not os.path.exists(f):
        continue
    with open(f, encoding='utf-8') as fh:
        for r in csv.DictReader(fh):
            key = (r['University Name'].strip(), r['Subject Name'].strip())
            if key not in seen:
                seen.add(key)
                rows.append({
                    'uni_raw': r['University Name'].strip(),
                    'dept': r['Department'].strip(),
                    'degree': r['Degree Name'].strip(),
                    'subject_raw': r['Subject Name'].strip(),
                    'seats': int(r['Seats']) if r.get('Seats','').strip().isdigit() else 0,
                })

# ── 4. Build uni_id → [subject slugs] mapping ────────────────────────────
uni_subjects = defaultdict(set)    # uni_id → set of slugs
subject_unis = defaultdict(set)    # slug → set of uni_ids
slug_seats   = defaultdict(dict)   # slug → {uni_id: seats}
unmapped_unis = set()
unmapped_subjects = set()

for r in rows:
    uni_id = UNI_ID.get(r['uni_raw'])
    slug   = slugify_subject(r['subject_raw'])
    if not uni_id:
        unmapped_unis.add(r['uni_raw'])
        continue
    if not slug:
        unmapped_subjects.add(r['subject_raw'])
        continue
    uni_subjects[uni_id].add(slug)
    subject_unis[slug].add(uni_id)
    # store seats (max if duplicate)
    prev = slug_seats[slug].get(uni_id, 0)
    slug_seats[slug][uni_id] = max(prev, r['seats'])

print(f"Mapped: {sum(len(v) for v in uni_subjects.values())} uni-subject pairs")
print(f"Unmapped universities ({len(unmapped_unis)}): {sorted(unmapped_unis)}")
print(f"\nUnmapped subjects ({len(unmapped_subjects)}):")
for s in sorted(unmapped_subjects): print(f"  {s}")

print(f"\n\nSlugs generated: {sorted(set(slug for slugs in uni_subjects.values() for slug in slugs))}")

# ── 5. Write university-subjects.js  (new lightweight lookup file) ────────
# Format: window.UniSubjects = { "du": ["cse","eee",...], ... }
lines = ["// EduPath BD — University → subjects lookup (auto-generated from CSV data)\n"]
lines.append("// Run _generate_data.py to regenerate\n")
lines.append("(function(){\n  window.UniSubjects = {\n")
for uid in sorted(uni_subjects.keys()):
    slugs = sorted(uni_subjects[uid])
    lines.append(f'    "{uid}": {json.dumps(slugs)},\n')
lines.append("  };\n")

# Also write slug → uni_ids mapping (enriches existing subject-universities.js)
lines.append("\n  window.SubjectUniIds = {\n")
for slug in sorted(subject_unis.keys()):
    unis = sorted(subject_unis[slug])
    lines.append(f'    "{slug}": {json.dumps(unis)},\n')
lines.append("  };\n")

# And seats
lines.append("\n  window.SubjectSeats = {\n")
for slug in sorted(slug_seats.keys()):
    lines.append(f'    "{slug}": {json.dumps(slug_seats[slug])},\n')
lines.append("  };\n")
lines.append("})();\n")

with open("H:/education system bd/university-subjects.js", "w", encoding="utf-8") as f:
    f.write("".join(lines))

print("Written: university-subjects.js")

# ── 6. Summary stats ─────────────────────────────────────────────────────
print(f"\nSubjects per university:")
for uid in sorted(uni_subjects.keys()):
    print(f"  {uid}: {len(uni_subjects[uid])} subjects")

print(f"\nUniversities per subject (top 10 by count):")
by_count = sorted(subject_unis.items(), key=lambda x: -len(x[1]))
for slug, unis in by_count[:15]:
    print(f"  {slug}: {len(unis)} unis -> {sorted(unis)}")
