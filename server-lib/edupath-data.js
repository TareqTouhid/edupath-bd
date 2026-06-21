import { readFileSync } from "fs";
import { join } from "path";
import vm from "vm";

const ROOT = process.cwd();

function loadWindowScript(relativePath) {
  const src = readFileSync(join(ROOT, relativePath), "utf8");
  const sandbox = { window: {} };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 3000 });
  return sandbox.window;
}

function bySlug(rows = []) {
  return Object.fromEntries(rows.filter(Boolean).map(row => [row.slug, row]));
}

function flattenUniversities(ugc = {}) {
  const groups = ["public", "private", "international"];
  return groups.flatMap(type => (ugc[type] || []).map(u => ({ ...u, type })));
}

function subjectBcsOptions(subject) {
  const relevance = subject.bcs_relevance || "medium";
  const general = ["Admin", "Police", "Foreign", "Customs", "Taxation", "Audit & Accounts"];
  const fieldCadres = {
    agriculture: ["Agriculture", "Fisheries", "Livestock", "Forest"],
    law: ["Judicial Service", "Admin", "Police"],
    economics: ["Economic", "Statistics", "Admin"],
    "public-administration": ["Admin", "Police", "Foreign", "Customs"],
    "political-science": ["Admin", "Police", "Foreign"],
    bangla: ["Education", "Admin"],
    english: ["Education", "Foreign", "Admin"],
    mathematics: ["Education", "Statistics"],
    statistics: ["Statistics", "Economic"],
    cse: ["ICT/general govt tech roles", "Admin"],
    eee: ["Technical cadres where advertised", "Admin"],
    civil: ["Public Works / Roads technical roles where advertised", "Admin"],
  };
  return {
    relevance,
    relevant: relevance !== "low",
    cadre_options: fieldCadres[subject.slug] || fieldCadres[subject.field] || general,
  };
}

function curriculumDifficultyFlags(subject) {
  const hardWords = [
    "calculus",
    "algorithm",
    "data structures",
    "thermodynamics",
    "electromagnetic",
    "organic chemistry",
    "econometrics",
    "statistics",
    "quantum",
    "structural",
    "compiler",
    "operating systems",
    "thesis",
  ];
  return (subject.curriculum || []).flatMap(phase => {
    const items = phase.items || [];
    return items
      .filter(item => hardWords.some(word => String(item).toLowerCase().includes(word)))
      .slice(0, 3)
      .map(item => ({
        year: phase.year,
        course: item,
        risk: "weed-out",
        note: "Frequently becomes a pressure point for students who chose the subject by name rather than daily workload.",
      }));
  }).slice(0, 8);
}

function optionalSubjectRules(subject) {
  const scienceMath = ["cse", "eee", "civil-engineering", "mechanical-engineering", "architecture", "physics", "mathematics", "statistics"];
  const biology = ["pharmacy", "botany", "zoology", "microbiology", "biochemistry", "biotechnology", "agriculture"];
  const rules = [];
  if (scienceMath.includes(subject.slug)) {
    rules.push({
      condition: "Science students should verify Higher Mathematics / admission-test mathematics requirements.",
      consequence: "Biology as optional without a strong math route can block or weaken eligibility at selective engineering/science programs.",
    });
  }
  if (biology.includes(subject.slug)) {
    rules.push({
      condition: "Biology background is strongly preferred and sometimes required.",
      consequence: "Students without Biology should verify each university circular before shortlisting.",
    });
  }
  return rules;
}

function summarizeTestimonials(testimonials = []) {
  const bySubject = {};
  const byUniversity = {};
  for (const t of testimonials) {
    const subjectSlug = t.subjectSlug || t.undergradSubjectSlug || t.subject_slug;
    if (subjectSlug) {
      bySubject[subjectSlug] ||= {
        count: 0,
        wouldAgainYes: 0,
        wouldAgainNo: 0,
        academicPressure: [],
        facultyQuality: [],
        jobReality: [],
        subjectWorthRating: [],
        whoShould: [],
        whoShouldNot: [],
        futureOpportunities: [],
        regretReasons: [],
        hscGroups: {},
        examples: []
      };
      const bucket = bySubject[subjectSlug];
      bucket.count += 1;
      if (String(t.again || t.wouldChooseAgain || "").toLowerCase() === "yes") bucket.wouldAgainYes += 1;
      if (String(t.again || t.wouldChooseAgain || "").toLowerCase() === "no") bucket.wouldAgainNo += 1;
      for (const key of ["academicPressure", "facultyQuality", "jobReality", "subjectWorthRating"]) {
        const n = Number(t[key]);
        if (Number.isFinite(n)) bucket[key].push(n);
      }
      if (t.whoShould || t.whoShouldTake) bucket.whoShould.push(t.whoShould || t.whoShouldTake);
      if (t.whoShouldNot || t.whoShouldNotTake) bucket.whoShouldNot.push(t.whoShouldNot || t.whoShouldNotTake);
      if (t.opportunities || t.futureOpportunities) bucket.futureOpportunities.push(t.opportunities || t.futureOpportunities);
      if (t.chooseAgainReason) bucket.regretReasons.push(t.chooseAgainReason);
      if (t.hscGroup) bucket.hscGroups[t.hscGroup] = (bucket.hscGroups[t.hscGroup] || 0) + 1;
      if (bucket.examples.length < 3) bucket.examples.push(t);
    }
    const uni = t.uni || t.undergradUniversity || t.university;
    if (uni) {
      byUniversity[uni] ||= { count: 0, subjects: {} };
      byUniversity[uni].count += 1;
      if (subjectSlug) byUniversity[uni].subjects[subjectSlug] = (byUniversity[uni].subjects[subjectSlug] || 0) + 1;
    }
  }
  const avg = rows => rows.length ? Math.round((rows.reduce((a, b) => a + b, 0) / rows.length) * 10) / 10 : null;
  for (const bucket of Object.values(bySubject)) {
    bucket.avgAcademicPressure = avg(bucket.academicPressure);
    bucket.avgFacultyQuality = avg(bucket.facultyQuality);
    bucket.avgJobReality = avg(bucket.jobReality);
    bucket.avgSubjectWorthRating = avg(bucket.subjectWorthRating);
    bucket.wouldAgainRate = bucket.count ? Math.round((bucket.wouldAgainYes / bucket.count) * 100) : null;
    bucket.regretRate = bucket.count ? Math.round((bucket.wouldAgainNo / bucket.count) * 100) : null;
    bucket.whoShould = bucket.whoShould.slice(0, 3);
    bucket.whoShouldNot = bucket.whoShouldNot.slice(0, 3);
    bucket.futureOpportunities = bucket.futureOpportunities.slice(0, 3);
    bucket.regretReasons = bucket.regretReasons.slice(0, 3);
    delete bucket.academicPressure;
    delete bucket.facultyQuality;
    delete bucket.jobReality;
    delete bucket.subjectWorthRating;
  }
  return { bySubject, byUniversity };
}

let cached;

export function loadEduPathData() {
  if (cached) return cached;

  const subjects = loadWindowScript("db/subjects_db.js").DB_Subjects || [];
  const jobs = loadWindowScript("db/jobs_db.js").DB_Jobs || [];
  const hscWindow = loadWindowScript("db/hsc_mapping.js");
  const ugc = loadWindowScript("extracted/universities.js").UGCData || {};
  const uniSubjects = loadWindowScript("university-subjects.js");
  const pf = loadWindowScript("extracted/pfdata.js").PFData || {};
  const approvedWindow = loadWindowScript("db/testimonials_db.js");

  const universities = flattenUniversities(ugc);
  const universitiesById = Object.fromEntries(universities.map(u => [u.id, u]));
  const jobsBySubject = {};
  for (const job of jobs) {
    for (const slug of job.related_subjects || []) {
      jobsBySubject[slug] ||= [];
      jobsBySubject[slug].push(job);
    }
  }

  const approvedTestimonials = [
    ...(pf.testimonials || []),
    ...(approvedWindow.DB_Testimonials || []),
  ];
  const testimonialStats = summarizeTestimonials(approvedTestimonials);

  const enrichedSubjects = subjects.map(subject => {
    const seatMap = (uniSubjects.SubjectSeats || {})[subject.slug] || {};
    const ids = (uniSubjects.SubjectUniIds || {})[subject.slug] || Object.keys(seatMap);
    const offerings = ids.map(id => {
      const uni = universitiesById[id] || { id, name: id.toUpperCase(), type: "unknown" };
      return {
        university_id: id,
        university_name: uni.name,
        university_short: uni.short || id.toUpperCase(),
        university_type: uni.type,
        city: uni.city,
        degree_name: subject.degree || subject.name,
        department: subject.name,
        subject_slug: subject.slug,
        subject_name: subject.name,
        seats: seatMap[id] || null,
      };
    });
    return {
      ...subject,
      related_interests: subject.related_interests || [],
      offerings,
      total_seats: Object.values(seatMap).reduce((sum, n) => sum + (Number(n) || 0), 0),
      related_jobs: jobsBySubject[subject.slug] || [],
      testimonial_stats: testimonialStats.bySubject[subject.slug] || { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 },
      bcs: subjectBcsOptions(subject),
      fourth_subject_rules: optionalSubjectRules(subject),
      difficulty_flags: curriculumDifficultyFlags(subject),
    };
  });
  const subjectsBySlug = bySlug(enrichedSubjects);

  function applyOverlay(overlay = {}) {
    const uniMap = new Map(universities.map(u => [u.id, u]));
    for (const u of overlay.universities || []) {
      if (!u.id) continue;
      uniMap.set(u.id, { type: u.type || "admin", ...(uniMap.get(u.id) || {}), ...u });
    }
    universities.length = 0;
    universities.push(...uniMap.values());
    for (const key of Object.keys(universitiesById)) delete universitiesById[key];
    Object.assign(universitiesById, Object.fromEntries(universities.map(u => [u.id, u])));

    const jobMap = new Map(jobs.map(j => [j.slug, j]));
    for (const j of overlay.jobs || []) {
      if (!j.slug) continue;
      jobMap.set(j.slug, { ...(jobMap.get(j.slug) || {}), ...j });
    }
    jobs.length = 0;
    jobs.push(...jobMap.values());

    for (const s of overlay.subjects || []) {
      if (!s.slug) continue;
      if (subjectsBySlug[s.slug]) Object.assign(subjectsBySlug[s.slug], s);
      else {
        const subject = {
          field: "admin",
          hsc: ["Science", "Commerce", "Arts"],
          hsc_groups: ["science", "commerce", "arts"],
          curriculum: [],
          related_interests: [],
          offerings: [],
          related_jobs: [],
          testimonial_stats: { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 },
          ...s,
          bcs: subjectBcsOptions(s),
          fourth_subject_rules: optionalSubjectRules(s),
          difficulty_flags: curriculumDifficultyFlags(s),
        };
        enrichedSubjects.push(subject);
        subjectsBySlug[subject.slug] = subject;
      }
    }

    for (const o of overlay.offerings || []) {
      if (!o.subject_slug) continue;
      let subject = subjectsBySlug[o.subject_slug];
      if (!subject) {
        subject = {
          slug: o.subject_slug,
          name: o.subject_name || o.subject_slug,
          field: "admin",
          hsc: ["Science", "Commerce", "Arts"],
          hsc_groups: ["science", "commerce", "arts"],
          curriculum: [],
          related_interests: [],
          offerings: [],
          related_jobs: [],
          testimonial_stats: { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 },
          bcs: subjectBcsOptions({ slug: o.subject_slug, field: "admin" }),
          fourth_subject_rules: [],
          difficulty_flags: [],
        };
        enrichedSubjects.push(subject);
        subjectsBySlug[subject.slug] = subject;
      }
      const uni = universitiesById[o.university_id] || { id: o.university_id, name: o.university_name || o.university_id, type: "admin" };
      const offering = {
        university_id: o.university_id,
        university_name: o.university_name || uni.name,
        university_short: uni.short || String(o.university_id || "").toUpperCase(),
        university_type: uni.type || "admin",
        city: uni.city,
        degree_name: o.degree_name || subject.degree || subject.name,
        department: o.department || subject.name,
        subject_slug: subject.slug,
        subject_name: o.subject_name || subject.name,
        seats: o.seats == null ? null : Number(o.seats),
        source_url: o.source_url,
      };
      const map = new Map((subject.offerings || []).map(row => [[row.university_id, row.subject_slug, row.department, row.degree_name].join("::"), row]));
      const key = [offering.university_id, offering.subject_slug, offering.department, offering.degree_name].join("::");
      map.set(key, { ...(map.get(key) || {}), ...offering });
      subject.offerings = Array.from(map.values());
      subject.total_seats = subject.offerings.reduce((sum, row) => sum + (Number(row.seats) || 0), 0);
    }

    const liveJobsBySubject = {};
    for (const job of jobs) {
      for (const slug of job.related_subjects || []) {
        liveJobsBySubject[slug] ||= [];
        liveJobsBySubject[slug].push(job);
      }
    }
    for (const subject of enrichedSubjects) {
      subject.related_jobs = liveJobsBySubject[subject.slug] || subject.related_jobs || [];
    }
  }

  cached = {
    subjects: enrichedSubjects,
    subjectsBySlug,
    jobs,
    universities,
    universitiesById,
    hscMapping: hscWindow.DB_HSCMapping || {},
    interestsMapping: hscWindow.DB_InterestsMapping || {},
    testimonials: approvedTestimonials,
    testimonialStats,
    applyOverlay,
    search(query) {
      const q = String(query || "").trim().toLowerCase();
      if (!q) return { subjects: [], universities: [], jobs: [] };
      return {
        subjects: enrichedSubjects.filter(s => `${s.slug} ${s.name} ${s.desc} ${(s.related_interests || []).join(" ")}`.toLowerCase().includes(q)).slice(0, 12),
        universities: universities.filter(u => `${u.name} ${u.short || ""} ${u.city || ""}`.toLowerCase().includes(q)).slice(0, 12),
        jobs: jobs.filter(j => `${j.title} ${(j.related_subjects || []).join(" ")}`.toLowerCase().includes(q)).slice(0, 12),
      };
    },
    matchCandidates(profile = {}) {
      const group = profile.hscGroup || profile.hsc || "any";
      const selectedHscSubjects = profile.hscSubjects || profile.hsc_subjects || profile.strongSubjects || [];
      const avoidHscSubjects = profile.avoidSubjects || profile.lessFavoriteSubjects || [];
      const selectedInterests = profile.interests || [];
      const selectedActivities = profile.activities || [];
      const selectedGoals = profile.careerGoals || profile.goals || [];
      const activityKeywords = {
        "math-problems": ["math", "mathematics", "statistics", "analytics", "engineering", "physics"],
        software: ["software", "coding", "programming", "computer", "cse", "ict", "technology"],
        experiments: ["lab", "research", "chemistry", "biology", "pharmacy", "science"],
        "scientific-research": ["research", "science", "biology", "physics", "environment", "agriculture"],
        systems: ["engineering", "architecture", "systems", "design", "civil", "eee", "mechanical"],
        technology: ["technology", "computer", "electronics", "software", "data", "machine"],
        "managing-teams": ["management", "business", "organization", "leadership", "administration"],
        markets: ["marketing", "economics", "market", "analytics", "business", "finance"],
        "running-business": ["business", "entrepreneurship", "management", "operations"],
        negotiating: ["marketing", "business", "sales", "law", "management"],
        numbers: ["accounting", "finance", "statistics", "economics", "analytics"],
        "financial-planning": ["finance", "banking", "accounting", "investment", "economics"],
        writing: ["writing", "language", "bangla", "english", "journalism", "communication"],
        speaking: ["public", "speaking", "law", "communication", "debate", "governance"],
        policy: ["policy", "government", "public administration", "economics", "development"],
        teaching: ["education", "teaching", "academic", "english", "bangla", "history"],
        community: ["development", "society", "sociology", "social", "ngo", "public service"],
        research: ["research", "history", "sociology", "economics", "geography", "academic"],
      };
      const goalKeywords = {
        "high-salary": ["salary", "software", "engineering", "data", "finance", "pharmacy", "technology"],
        research: ["research", "science", "lab", "academic", "biology", "physics", "chemistry"],
        government: ["government", "bcs", "public service", "cadre", "administration"],
        international: ["abroad", "international", "global", "software", "engineering", "research"],
        entrepreneurship: ["business", "startup", "entrepreneurship", "product", "technology", "agriculture"],
        "corporate-leadership": ["management", "business", "leadership", "corporate", "administration"],
        "banking-finance": ["bank", "finance", "accounting", "economics", "investment"],
        "international-business": ["international", "business", "trade", "global", "economics"],
        "government-admin": ["government", "bcs", "administration", "public service", "cadre"],
        "public-service": ["government", "public service", "bcs", "administration", "policy"],
        academia: ["academic", "teaching", "research", "education", "university"],
        law: ["law", "legal", "justice", "governance", "rights"],
        journalism: ["journalism", "media", "writing", "communication", "english", "bangla"],
        "development-sector": ["development", "ngo", "social", "community", "policy"],
        "civil-service": ["bcs", "civil service", "government", "cadre", "administration"],
      };
      const extraTerms = [
        ...selectedActivities.flatMap(id => activityKeywords[id] || [id]),
        ...selectedGoals.flatMap(id => goalKeywords[id] || [id]),
      ];
      const freeText = String([
        profile.freeText,
        profile.curiosity,
        profile.interestsText,
        profile.extra,
        extraTerms.join(" "),
      ].filter(Boolean).join(" ")).toLowerCase();
      const fromHsc = new Set();
      const avoidHsc = new Set();
      const groupMap = hscWindow.DB_HSCMapping?.[group]?.maps_to || {};
      for (const subjectName of selectedHscSubjects) {
        for (const slug of groupMap[subjectName]?.subjects || []) fromHsc.add(slug);
      }
      for (const subjectName of avoidHscSubjects) {
        for (const slug of groupMap[subjectName]?.subjects || []) avoidHsc.add(slug);
      }
      const fromInterests = new Set();
      for (const interest of selectedInterests) {
        for (const slug of hscWindow.DB_InterestsMapping?.[interest] || []) fromInterests.add(slug);
      }
      return enrichedSubjects.map(subject => {
        let score = 45;
        if (group === "any" || (subject.hsc_groups || []).includes(group)) score += 15;
        else score -= 35;
        if (fromHsc.has(subject.slug)) score += 18;
        if (avoidHsc.has(subject.slug)) score -= 14;
        if (fromInterests.has(subject.slug)) score += 18;
        const haystack = `${subject.name} ${subject.desc} ${subject.field || ""} ${(subject.related_interests || []).join(" ")} ${(subject.curriculum || []).flatMap(p => p.items || []).join(" ")} ${(subject.related_jobs || []).map(j => j.title).join(" ")} ${subject.bcs?.cadre_options?.join(" ") || ""}`.toLowerCase();
        if (freeText && freeText.split(/\W+/).filter(w => w.length > 3).some(w => haystack.includes(w))) score += 8;
        score += Math.min(8, Math.round((subject.testimonial_stats?.count || 0) / 2));
        if (subject.testimonial_stats?.avgSubjectWorthRating >= 4) score += 5;
        if (subject.testimonial_stats?.avgSubjectWorthRating && subject.testimonial_stats.avgSubjectWorthRating < 3) score -= 5;
        if (subject.testimonial_stats?.wouldAgainRate >= 70) score += 4;
        if (subject.testimonial_stats?.regretRate >= 40) score -= 6;
        if ((profile.mathComfort === "avoid" || profile.math === "avoid") && subject.math) score -= 16;
        return { subject, score: Math.max(0, Math.min(100, score)) };
      }).sort((a, b) => b.score - a.score);
    },
  };
  return cached;
}
