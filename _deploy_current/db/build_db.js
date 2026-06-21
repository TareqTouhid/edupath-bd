/**
 * EduPath BD — Build master database files from research data
 * Run: node db/build_db.js
 * Outputs: db/subjects_db.js, db/jobs_db.js, db/hsc_mapping.js
 */

const fs = require('fs');
const path = require('path');

const curricula = JSON.parse(fs.readFileSync(path.join(__dirname, 'curricula.json'), 'utf8'));
const jobsSalary = JSON.parse(fs.readFileSync(path.join(__dirname, 'jobs_salary.json'), 'utf8'));

// ─────────────────────────────────────────────
// 1. HSC/SSC → Undergrad Subject Mapping
// ─────────────────────────────────────────────
const HSC_MAPPING = {
  science: {
    label: "Science",
    hsc_subjects: ["Physics", "Chemistry", "Biology", "Higher Mathematics", "Mathematics", "ICT", "Agriculture"],
    maps_to: {
      "Physics":            { subjects: ["cse","eee","civil-engineering","mechanical-engineering","physics","architecture","kuet-others"], weight: 0.9 },
      "Chemistry":          { subjects: ["chemistry","pharmacy","agriculture","food-technology","chemical-engineering"], weight: 0.9 },
      "Biology":            { subjects: ["pharmacy","botany","zoology","agriculture","fisheries","microbiology","genetic-engineering"], weight: 0.9 },
      "Higher Mathematics": { subjects: ["cse","eee","civil-engineering","mechanical-engineering","mathematics","statistics","physics","architecture"], weight: 0.95 },
      "Mathematics":        { subjects: ["cse","eee","mathematics","statistics","physics","economics","civil-engineering"], weight: 0.85 },
      "ICT":                { subjects: ["cse","eee","information-technology"], weight: 0.8 },
      "Agriculture":        { subjects: ["agriculture","botany","zoology","food-technology","fisheries"], weight: 0.85 }
    }
  },
  commerce: {
    label: "Commerce",
    hsc_subjects: ["Accounting", "Business Studies", "Finance & Banking", "Economics", "Statistics", "ICT"],
    maps_to: {
      "Accounting":         { subjects: ["accounting","finance-banking","bba","management"], weight: 0.95 },
      "Business Studies":   { subjects: ["bba","management","marketing","hrm","accounting"], weight: 0.9 },
      "Finance & Banking":  { subjects: ["finance-banking","economics","bba","accounting"], weight: 0.95 },
      "Economics":          { subjects: ["economics","development-studies","public-administration","statistics","bba"], weight: 0.9 },
      "Statistics":         { subjects: ["statistics","economics","mathematics","cse"], weight: 0.85 },
      "ICT":                { subjects: ["cse","information-technology","bba"], weight: 0.75 }
    }
  },
  arts: {
    label: "Humanities (Arts)",
    hsc_subjects: ["Bangla", "English", "History", "Civics", "Islamic Studies", "Geography", "Sociology", "Economics", "Logic", "Social Work"],
    maps_to: {
      "Bangla":             { subjects: ["bangla","journalism","history","philosophy","islamic-studies"], weight: 0.95 },
      "English":            { subjects: ["english","journalism","law","development-studies","public-administration"], weight: 0.9 },
      "History":            { subjects: ["history","political-science","islamic-studies","philosophy","sociology"], weight: 0.9 },
      "Civics":             { subjects: ["political-science","public-administration","law","sociology","development-studies"], weight: 0.9 },
      "Islamic Studies":    { subjects: ["islamic-studies","arabic","history","philosophy","bangla"], weight: 0.95 },
      "Geography":          { subjects: ["geography","environmental-science","agriculture","geology","sociology"], weight: 0.85 },
      "Sociology":          { subjects: ["sociology","social-work","anthropology","development-studies","political-science"], weight: 0.95 },
      "Economics":          { subjects: ["economics","development-studies","bba","statistics","public-administration"], weight: 0.85 },
      "Logic":              { subjects: ["philosophy","law","mathematics","political-science"], weight: 0.8 },
      "Social Work":        { subjects: ["social-work","sociology","development-studies","public-administration"], weight: 0.95 }
    }
  }
};

// ─────────────────────────────────────────────
// 2. Interests → Subject Mapping
// ─────────────────────────────────────────────
const INTERESTS_MAPPING = {
  "coding":             ["cse","eee","information-technology","statistics"],
  "mathematics":        ["mathematics","statistics","cse","eee","physics","economics"],
  "building-things":    ["civil-engineering","mechanical-engineering","architecture","eee","cse"],
  "creative-design":    ["architecture","uiux","journalism","fine-arts","bangla"],
  "helping-people":     ["social-work","sociology","development-studies","public-administration","law"],
  "nature-environment": ["botany","zoology","agriculture","geography","fisheries","environmental-science"],
  "business-money":     ["bba","accounting","finance-banking","economics","management","marketing"],
  "writing-language":   ["bangla","english","journalism","history","philosophy"],
  "law-governance":     ["law","political-science","public-administration","development-studies","sociology"],
  "lab-research":       ["chemistry","physics","pharmacy","botany","zoology","microbiology"],
  "teaching":           ["education","bangla","english","mathematics","history"],
  "healthcare":         ["pharmacy","public-health","botany","zoology","microbiology"],
  "arts-culture":       ["fine-arts","bangla","history","islamic-studies","philosophy","journalism"],
  "technology":         ["cse","eee","information-technology","mechanical-engineering","architecture"],
  "agriculture-food":   ["agriculture","food-technology","botany","zoology","fisheries"]
};

// ─────────────────────────────────────────────
// 3. Enriched Subject Profiles & Legacy Mapping
// ─────────────────────────────────────────────
const CORE_PROFILES = {
  "cse": { field: "technology", desc: "Software, systems, AI — the backbone of modern work.", difficulty: 4, trend: "rising", bcs_relevance: "medium", math: true },
  "eee": { field: "technology", desc: "Circuits, power systems, electronics, and hardware design.", difficulty: 4, trend: "stable", bcs_relevance: "low", math: true },
  "civil-engineering": { field: "technology", desc: "Structures, transport, water — the physical infrastructure of the country.", difficulty: 4, trend: "stable", bcs_relevance: "low", math: true },
  "mechanical-engineering": { field: "technology", desc: "Thermodynamics, robotics, engines, and mechanical systems.", difficulty: 4, trend: "stable", bcs_relevance: "low", math: true },
  "bba": { field: "business", desc: "Management, finance, marketing — broad, applied, employable.", difficulty: 3, trend: "stable", bcs_relevance: "low", math: false },
  "accounting": { field: "business", desc: "Financial reporting, auditing, taxation, and corporate governance.", difficulty: 3, trend: "stable", bcs_relevance: "medium", math: true },
  "economics": { field: "social-science", desc: "How resources, people, and policy actually move.", difficulty: 3, trend: "stable", bcs_relevance: "medium", math: true },
  "finance-banking": { field: "business", desc: "Capital markets, banking, risk — quantitative, structured, employable.", difficulty: 3, trend: "stable", bcs_relevance: "low", math: true },
  "law": { field: "social-science", desc: "Legal systems, jurisprudence, constitutional law, and corporate compliance.", difficulty: 4, trend: "stable", bcs_relevance: "high", math: false },
  "pharmacy": { field: "applied", desc: "Medicines, pharmacology, drug formulation, and healthcare systems.", difficulty: 4, trend: "rising", bcs_relevance: "low", math: false },
  "physics": { field: "science", desc: "Classical mechanics, quantum, electrodynamics — pure science with a heavy theory load.", difficulty: 4, trend: "stable", bcs_relevance: "medium", math: true },
  "chemistry": { field: "science", desc: "Molecular structures, organic reactions, analytical and physical chemistry.", difficulty: 4, trend: "stable", bcs_relevance: "medium", math: false },
  "mathematics": { field: "science", desc: "Pure proofs, applied stats, the language behind everything technical.", difficulty: 4, trend: "stable", bcs_relevance: "medium", math: true },
  "statistics": { field: "science", desc: "Data analysis, probability theory, statistical models, and research design.", difficulty: 3, trend: "rising", bcs_relevance: "medium", math: true },
  "bangla": { field: "humanities", desc: "Literature, language, criticism — the national tongue, studied seriously.", difficulty: 2, trend: "stable", bcs_relevance: "high", math: false },
  "english": { field: "humanities", desc: "Close reading, writing, English literature, and linguistics.", difficulty: 2, trend: "stable", bcs_relevance: "high", math: false },
  "political-science": { field: "social-science", desc: "Government systems, political theory, international affairs, and public policy.", difficulty: 2, trend: "stable", bcs_relevance: "high", math: false },
  "sociology": { field: "social-science", desc: "Social structures, cultural behaviors, community dynamics, and research.", difficulty: 2, trend: "stable", bcs_relevance: "medium", math: false },
  "agriculture": { field: "environmental", desc: "Field work, food systems, applied biology.", difficulty: 3, trend: "stable", bcs_relevance: "medium", math: false },
  "architecture": { field: "design", desc: "Designing buildings, spatial planning, structural aesthetics, and history.", difficulty: 4, trend: "stable", bcs_relevance: "low", math: true }
};

const CORE_HSC_GROUPS = {
  "cse": ["science"], "eee": ["science"], "civil-engineering": ["science"], "mechanical-engineering": ["science"],
  "bba": ["science", "commerce", "arts"], "accounting": ["science", "commerce"], "economics": ["science", "commerce", "arts"],
  "finance-banking": ["science", "commerce"], "law": ["science", "commerce", "arts"], "pharmacy": ["science"],
  "physics": ["science"], "chemistry": ["science"], "mathematics": ["science"], "statistics": ["science", "commerce"],
  "bangla": ["science", "commerce", "arts"], "english": ["science", "commerce", "arts"], "political-science": ["science", "commerce", "arts"],
  "sociology": ["science", "commerce", "arts"], "agriculture": ["science"], "architecture": ["science"]
};

const fieldMap = {
  "Engineering & Technology": "technology",
  "Business & Commerce": "business",
  "Natural Sciences": "science",
  "Social Science": "social-science",
  "Social Sciences": "social-science",
  "Arts & Humanities": "humanities",
  "Life & Earth Sciences": "environmental",
  "Design": "design",
  "Health & Medicine": "applied"
};

function getBCSRelevance(slug, field) {
  if (CORE_PROFILES[slug] && CORE_PROFILES[slug].bcs_relevance) {
    return CORE_PROFILES[slug].bcs_relevance;
  }
  const highSlugs = ["public-administration", "history", "islamic-studies", "philosophy", "international-relations"];
  const medSlugs = ["geography", "environmental-science", "botany", "zoology", "social-work"];
  if (highSlugs.includes(slug)) return "high";
  if (medSlugs.includes(slug) || field === "science" || field === "social-science") return "medium";
  return "low";
}

function mapCurriculum(curr) {
  if (!curr) return [];
  if (Array.isArray(curr)) return curr;
  return [
    { year: "Year 1", title: "Foundation Courses", items: curr.year1 || [] },
    { year: "Year 2", title: "Core & Intermediate", items: curr.year2 || [] },
    { year: "Year 3", title: "Specialisation Beats", items: curr.year3 || [] },
    { year: "Year 4", title: "Advanced & Capstone", items: curr.year4 || [] }
  ];
}

const subjectsDB = curricula.map(subj => {
  const slug = subj.slug;
  const core = CORE_PROFILES[slug] || {};
  
  const rawField = subj.field || core.field || "";
  const normalizedField = fieldMap[rawField] || rawField.toLowerCase().replace(/\s+/g, '-');
  
  const desc = subj.desc || core.desc || `Study of ${subj.name} and its practical applications.`;
  
  const hscGroups = subj.hsc_groups && subj.hsc_groups.length ? subj.hsc_groups : (CORE_HSC_GROUPS[slug] || ["science", "commerce", "arts"]);
  const legacyHsc = hscGroups.map(g => {
    if (g === "science") return "Science";
    if (g === "commerce") return "Commerce";
    if (g === "arts") return "Arts";
    return g;
  });

  const bcsRelevance = getBCSRelevance(slug, normalizedField);
  const mappedCurriculum = mapCurriculum(subj.curriculum);

  const relatedJobs = jobsSalary.filter(job => job.related_subjects && job.related_subjects.includes(slug));
  const jobSlugs = relatedJobs.map(job => job.slug);
  const careers = relatedJobs.map(job => job.title);

  let entryMin = 20, entryMax = 50, seniorMin = 60, seniorMax = 120;
  let usdMin = 40, usdMax = 90;
  if (relatedJobs.length > 0) {
    const bdtSalary = relatedJobs[0].bdt_salary || {};
    const intlSalary = relatedJobs[0].intl_salary || {};
    
    if (bdtSalary.entry_min) entryMin = Math.round(bdtSalary.entry_min / 1000);
    if (bdtSalary.entry_max) entryMax = Math.round(bdtSalary.entry_max / 1000);
    if (bdtSalary.senior_min) seniorMin = Math.round(bdtSalary.senior_min / 1000);
    if (bdtSalary.senior_max) seniorMax = Math.round(bdtSalary.senior_max / 1000);
    
    if (intlSalary.usd_entry_min) usdMin = Math.round(intlSalary.usd_entry_min / 1000);
    if (intlSalary.usd_entry_max) usdMax = Math.round(intlSalary.usd_entry_max / 1000);
  }

  const formatLakh = (kValue) => {
    if (kValue >= 100) return `${(kValue / 100).toFixed(1).replace('.0', '')}L`;
    return `${kValue}k`;
  };

  const regional = {
    dhaka: {
      careers: careers.slice(0, 3),
      salary: `৳${formatLakh(entryMin)}–${formatLakh(seniorMax)}/mo`,
      note: `Dhaka is the primary employment hub for ${subj.name} roles. Career progression scales with specialized expertise.`
    },
    outside: {
      careers: bcsRelevance === "high" ? ["BCS cadre officer", "Government officer", "College lecturer"] : ["Local manager", "District branch officer"],
      salary: `৳${formatLakh(Math.round(entryMin * 0.7))}–${formatLakh(Math.round(seniorMax * 0.75))}/mo`,
      note: `Outside the capital, roles are mostly concentrated in branch networks, local manufacturing, or education sector pathways.`
    },
    intl: {
      careers: [`MA/PhD scholar`, ...careers.slice(0, 2)].map(c => c + " abroad"),
      salary: `$${usdMin}k–$${usdMax}k/yr`,
      note: `Strong academic pathways for research-driven candidates. Technical degrees command premium starting salaries globally.`
    }
  };

  const difficulty = core.difficulty || (["technology", "science", "applied"].includes(normalizedField) ? 4 : 3);
  const trend = core.trend || (relatedJobs.some(j => j.demand_trend === "rising") ? "rising" : "stable");

  return {
    slug: slug,
    name: subj.name,
    degree: subj.degree,
    duration_years: subj.duration_years || 4,
    field: normalizedField,
    desc: desc,
    hsc: legacyHsc,
    hsc_groups: hscGroups,
    hsc_subjects_required: subj.hsc_subjects_required || [],
    hsc_subjects_preferred: subj.hsc_subjects_preferred || [],
    math: core.math !== undefined ? core.math : (["technology", "science"].includes(normalizedField)),
    difficulty: difficulty,
    trend: trend,
    bcs_relevance: bcsRelevance,
    curriculum: mappedCurriculum,
    regional: regional,
    unis: {
      public: [],
      private: ["—"]
    },
    alts: Object.entries(INTERESTS_MAPPING)
      .filter(([, slugs]) => slugs.includes(slug))
      .flatMap(([, slugs]) => slugs)
      .filter(s => s !== slug)
      .slice(0, 3),
    confidence: relatedJobs.length > 0 ? "verified" : "emerging",
    related_interests: Object.entries(INTERESTS_MAPPING)
      .filter(([, slugs]) => slugs.includes(slug))
      .map(([interest]) => interest),
    jobs: jobSlugs,
    references: subj.references || []
  };
});

// ─────────────────────────────────────────────
// 4. Output files
// ─────────────────────────────────────────────
const dbDir = __dirname;

// subjects_db.js
fs.writeFileSync(
  path.join(dbDir, 'subjects_db.js'),
  `// EduPath BD — Subjects Database\n// Auto-generated by build_db.js — DO NOT EDIT MANUALLY\n// ${subjectsDB.length} subjects with curriculum outlines\n\nwindow.DB_Subjects = ${JSON.stringify(subjectsDB, null, 2)};\n`,
  'utf8'
);
console.log('✅ subjects_db.js —', subjectsDB.length, 'subjects');

// jobs_db.js
fs.writeFileSync(
  path.join(dbDir, 'jobs_db.js'),
  `// EduPath BD — Jobs & Salary Database\n// Auto-generated by build_db.js — DO NOT EDIT MANUALLY\n// ${jobsSalary.length} jobs with BD + international salary data\n\nwindow.DB_Jobs = ${JSON.stringify(jobsSalary, null, 2)};\n`,
  'utf8'
);
console.log('✅ jobs_db.js —', jobsSalary.length, 'jobs');

// hsc_mapping.js
fs.writeFileSync(
  path.join(dbDir, 'hsc_mapping.js'),
  `// EduPath BD — HSC/SSC → Undergraduate Subject Mapping\n// Auto-generated by build_db.js — DO NOT EDIT MANUALLY\n\nwindow.DB_HSCMapping = ${JSON.stringify(HSC_MAPPING, null, 2)};\n\nwindow.DB_InterestsMapping = ${JSON.stringify(INTERESTS_MAPPING, null, 2)};\n`,
  'utf8'
);
console.log('✅ hsc_mapping.js — 3 groups, 10 interests');

console.log('\nAll DB files written to:', dbDir);
console.log('Next: copy to H:/education system bd/ and reference in index.html');
