// EduPath BD — Smart Matcher v2 (GPA-Aware, Grade-Prerequisite, Data-Driven)

// ── GPA Cutoffs (from 2023/2024 official admission circulars) ──────────────
// Source: du.ac.bd, admission.buet.ac.bd, ju.ac.bd, ru.ac.bd
const SUBJECT_MIN_GPA = {
  "cse":                    { combined: 8.5, ssc: 4.0, hsc: 4.5, note: "BUET/KUET-level requirement" },
  "eee":                    { combined: 8.5, ssc: 4.0, hsc: 4.5, note: "BUET/KUET-level requirement" },
  "civil-engineering":      { combined: 8.0, ssc: 3.5, hsc: 4.0 },
  "mechanical-engineering": { combined: 8.0, ssc: 3.5, hsc: 4.0 },
  "chemical-engineering":   { combined: 8.0, ssc: 3.5, hsc: 4.0 },
  "biomedical-engineering": { combined: 8.0, ssc: 3.5, hsc: 4.0 },
  "naval-architecture":     { combined: 8.0, ssc: 3.5, hsc: 4.0 },
  "industrial-engineering": { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "materials-engineering":  { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "textile-engineering":    { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "petroleum-engineering":  { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "architecture":           { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "urban-planning":         { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "pharmacy":               { combined: 8.0, ssc: 3.5, hsc: 4.0, note: "DU Pharmacy highly competitive" },
  "biochemistry":           { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "microbiology":           { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "biotechnology":          { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "agriculture":            { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "agricultural-engineering":{ combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "food-technology":        { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "botany":                 { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "zoology":                { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "physics":                { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "chemistry":              { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "mathematics":            { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "statistics":             { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "marine-sciences":        { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "energy-engineering":     { combined: 7.5, ssc: 3.5, hsc: 3.5 },
  "bba":                    { combined: 7.0, ssc: 3.0, hsc: 3.5, note: "DU C Unit: min 3.5 HSC" },
  "accounting":             { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "economics":              { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "finance-banking":        { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "law":                    { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "english":                { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "bangla":                 { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "linguistics":            { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "language-studies":       { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "history":                { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "philosophy":             { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "political-science":      { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "public-administration":  { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "sociology":              { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "social-work":            { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "anthropology":           { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "psychology":             { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "geography":              { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "development-studies":    { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "international-relations":{ combined: 7.5, ssc: 3.0, hsc: 3.5 },
  "journalism":             { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "performing-arts":        { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "fine-arts":              { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "uiux":                   { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "demographics":           { combined: 7.0, ssc: 3.0, hsc: 3.5 },
  "islamic-studies":        { combined: 6.5, ssc: 3.0, hsc: 3.0 },
  "leather-engineering":    { combined: 7.5, ssc: 3.5, hsc: 3.5 },
};

// ── Subject Grade Prerequisites ────────────────────────────────────────────
// Grade points: A+=5.0, A=4.0, A-=3.5, B+=3.25, B=3.0, B-=2.75, C+=2.5, C=2.0
// { subjectGrade: minPoint } — triggers amber flag if student's grade is below
const SUBJECT_PREREQUISITES = {
  "cse":                    { math: 3.5, label: "HSC Math A- or above required" },
  "eee":                    { math: 3.5, physics: 3.5, label: "HSC Math & Physics A- or above required" },
  "civil-engineering":      { math: 3.5, physics: 3.5, label: "HSC Math & Physics A- or above required" },
  "mechanical-engineering": { math: 3.5, physics: 3.5, label: "HSC Math & Physics A- or above required" },
  "naval-architecture":     { math: 3.5, physics: 3.5, label: "HSC Math & Physics A- or above required" },
  "chemical-engineering":   { math: 3.5, chemistry: 3.5, label: "HSC Math & Chemistry A- or above required" },
  "architecture":           { math: 3.5, label: "HSC Math A- or above required" },
  "urban-planning":         { math: 3.5, label: "HSC Math A- or above required" },
  "industrial-engineering": { math: 3.5, label: "HSC Math A- or above required" },
  "biomedical-engineering": { math: 3.5, biology: 3.0, label: "HSC Math A- and Biology B or above required" },
  "petroleum-engineering":  { math: 3.5, chemistry: 3.0, label: "HSC Math A- and Chemistry B or above required" },
  "physics":                { math: 3.5, physics: 3.5, label: "HSC Math & Physics A- or above required" },
  "mathematics":            { math: 3.5, label: "HSC Math A- or above required" },
  "statistics":             { math: 3.5, label: "HSC Math A- or above required" },
  "pharmacy":               { biology: 3.0, chemistry: 3.0, label: "HSC Biology B & Chemistry B or above required" },
  "biochemistry":           { biology: 3.0, chemistry: 3.0, label: "HSC Biology & Chemistry B or above required" },
  "microbiology":           { biology: 3.0, label: "HSC Biology B or above required" },
  "biotechnology":          { biology: 3.0, label: "HSC Biology B or above required" },
  "botany":                 { biology: 3.0, label: "HSC Biology B or above required" },
  "zoology":                { biology: 3.0, label: "HSC Biology B or above required" },
  "food-technology":        { chemistry: 3.0, biology: 3.0, label: "HSC Chemistry & Biology B or above required" },
  "agriculture":            { biology: 3.0, label: "HSC Biology B or above required" },
};

// ── Engineering / Life Science Hard-Lock ──────────────────────────────────
const ENGINEERING_SLUGS = [
  "cse","eee","civil-engineering","mechanical-engineering","chemical-engineering",
  "textile-engineering","industrial-engineering","naval-architecture","urban-planning",
  "architecture","biomedical-engineering","materials-engineering","petroleum-engineering","energy-engineering"
];
const LIFESCIENCE_SLUGS = [
  "pharmacy","botany","zoology","agriculture","fisheries","microbiology",
  "genetic-engineering","biotechnology","biochemistry","food-technology","agricultural-engineering"
];

// ── Second-Timer Bans (official DU/BUET policy) ───────────────────────────
const SECOND_TIMER_BANNED_UNIS = ["du", "buet"];

// ── Grade string → numeric point ──────────────────────────────────────────
const GRADE_POINTS = { "A+": 5.0, "A": 4.0, "A-": 3.5, "B+": 3.25, "B": 3.0, "B-": 2.75, "C+": 2.5, "C": 2.0, "D": 1.0 };
function gradeToPoint(grade) { return GRADE_POINTS[grade] || 0; }

// ── Domain cluster → subject field mapping ────────────────────────────────
const DOMAIN_FIELD_MAP = {
  "engineering": ["technology", "design"],
  "arts-social":  ["humanities", "social-science"],
  "life-science": ["environmental", "applied"],
  "business":     ["business"],
  "health":       ["applied"]
};

// ── Interest tags → related_interests keys ────────────────────────────────
const INTEREST_TAG_MAP = {
  "coding":        "coding",
  "life-sciences": "nature-environment",
  "math":          "mathematics",
  "business":      "business-money",
  "writing":       "writing-language",
  "law":           "law-governance",
  "lab":           "lab-research"
};

// ── Core scoring engine ───────────────────────────────────────────────────
function scoreLocal({
  hscGroup, sscGpa, hscGpa, fourthSubject, swapIntent, isSecondTimer,
  subjectGrades, interestTags, domainClusters, location, uniCategory, priorities
}) {
  if (!hscGroup) return [];
  const combined = (parseFloat(sscGpa) || 0) + (parseFloat(hscGpa) || 0);
  const subjects = window.DB_Subjects || [];

  return subjects.map(subj => {
    const slug = subj.slug;

    // 1. HSC group eligibility
    if (!subj.hsc_groups || !subj.hsc_groups.includes(hscGroup)) {
      return { subj, score: 0, eligible: false,
        lockReason: `Requires HSC ${subj.hsc ? subj.hsc.join("/") : "Science"} background` };
    }

    // 2. 4th subject hard-lock
    if (hscGroup === "science") {
      if (fourthSubject === "math" && swapIntent === "swap" && ENGINEERING_SLUGS.includes(slug))
        return { subj, score: 0, eligible: false,
          lockReason: "Ineligible: You must answer Higher Mathematics to unlock Engineering/CSE paths." };
      if (fourthSubject === "biology" && swapIntent === "swap" && LIFESCIENCE_SLUGS.includes(slug))
        return { subj, score: 0, eligible: false,
          lockReason: "Ineligible: You must answer Biology to unlock Life Science/Pharmacy paths." };
    }

    // 3. GPA cutoff filter (soft — shows as amber warning, not hard lock unless both ssc+hsc provided)
    const gpaReq = SUBJECT_MIN_GPA[slug] || { combined: 6.5, ssc: 3.0, hsc: 3.0 };
    const gpaWarnings = [];
    const hasGpa = sscGpa && hscGpa;
    if (hasGpa) {
      if (combined < gpaReq.combined) {
        return { subj, score: 0, eligible: false,
          lockReason: `GPA too low: Combined ${combined.toFixed(2)} < ${gpaReq.combined} required (SSC+HSC sum)` };
      }
      if (parseFloat(sscGpa) < gpaReq.ssc)
        gpaWarnings.push(`SSC GPA ${sscGpa} < ${gpaReq.ssc} minimum`);
      if (parseFloat(hscGpa) < gpaReq.hsc)
        gpaWarnings.push(`HSC GPA ${hscGpa} < ${gpaReq.hsc} minimum`);
    }

    // 4. Grade prerequisite check (amber flags)
    const prereqs = SUBJECT_PREREQUISITES[slug];
    const prerequisiteWarnings = [];
    if (prereqs && subjectGrades) {
      const gradeKeys = { math: "math", physics: "physics", chemistry: "chemistry", biology: "biology", english: "english" };
      Object.entries(gradeKeys).forEach(([key, label]) => {
        if (prereqs[key] !== undefined && subjectGrades[key]) {
          const studentPoint = gradeToPoint(subjectGrades[key]);
          if (studentPoint < prereqs[key]) {
            const needed = Object.entries(GRADE_POINTS).find(([,v]) => v >= prereqs[key])?.[0] || "A-";
            prerequisiteWarnings.push(`${label.charAt(0).toUpperCase()+label.slice(1)}: you have ${subjectGrades[key]}, need ${needed}`);
          }
        }
      });
    }

    // 5. Domain cluster filter (soft — reduces score but doesn't block)
    let domainBoost = 0;
    if (domainClusters && domainClusters.length > 0) {
      const matchedFields = domainClusters.flatMap(d => DOMAIN_FIELD_MAP[d] || []);
      if (matchedFields.includes(subj.field)) domainBoost = 20;
      else if (domainClusters.length > 0) domainBoost = -10;
    }

    // 6. Interest tag scoring
    let interestScore = 0;
    const matchedInterests = [];
    if (interestTags && interestTags.length > 0 && subj.related_interests) {
      interestTags.forEach(tag => {
        const dbKey = INTEREST_TAG_MAP[tag] || tag;
        if (subj.related_interests.includes(dbKey)) {
          interestScore += 20;
          matchedInterests.push(tag);
        }
      });
    }

    // 7. Priority scoring
    let priorityScore = 0;
    if (priorities) {
      if (priorities.includes("salary") && subj.regional?.dhaka?.salary) priorityScore += 10;
      if (priorities.includes("bcs") && subj.bcs_relevance === "high") priorityScore += 15;
      if (priorities.includes("bcs") && subj.bcs_relevance === "medium") priorityScore += 7;
      if (priorities.includes("abroad") && ["technology","science","applied"].includes(subj.field)) priorityScore += 10;
      if (priorities.includes("research") && ["science","applied","humanities"].includes(subj.field)) priorityScore += 10;
    }

    // 8. Base score for field match with HSC group
    const baseScore = hscGroup === "science" ? 30 : 20;

    const rawScore = baseScore + interestScore + domainBoost + priorityScore;
    const score = Math.min(100, Math.max(0, rawScore));

    return {
      subj, score, eligible: true,
      matched: matchedInterests,
      gpaWarnings: [...gpaWarnings, ...prerequisiteWarnings],
      prerequisiteWarnings,
    };
  });
}


// EduPath BD — Smart Matcher v2 UI Part 2
const { useState, useMemo } = React;

function AIMatcher({ go, onBack }) {
  const [step, setStep] = useState(1);
  
  // State for Step 1: Academics
  const [hscGroup, setHscGroup] = useState(null); // 'science' | 'commerce' | 'humanities'
  const [sscGpa, setSscGpa] = useState("");
  const [hscGpa, setHscGpa] = useState("");
  const [fourthSubject, setFourthSubject] = useState(null); // 'math' | 'biology' | 'none'
  const [swapIntent, setSwapIntent] = useState(null); // 'answer' | 'swap'
  const [isSecondTimer, setIsSecondTimer] = useState(null); // false | true
  const [subjectGrades, setSubjectGrades] = useState({
    math: "", physics: "", chemistry: "", biology: "", english: ""
  });

  // State for Step 2: Interests & Strengths
  const [interestTags, setInterestTags] = useState([]); // Array of strings (max 3)
  const [domainClusters, setDomainClusters] = useState([]); // Array of strings

  // State for Step 3: Logistics & Preferences
  const [location, setLocation] = useState([]); // Array of divisions, e.g., ["dhaka"]
  const [uniCategory, setUniCategory] = useState("both"); // 'public' | 'private' | 'both'
  const [priorities, setPriorities] = useState([]); // 'salary' | 'bcs' | 'abroad' | 'research'

  // Calculate live eligibility and scoring
  const scoredResults = useMemo(() => {
    return scoreLocal({
      hscGroup, sscGpa, hscGpa, fourthSubject, swapIntent, isSecondTimer,
      subjectGrades, interestTags, domainClusters, location, uniCategory, priorities
    });
  }, [
    hscGroup, sscGpa, hscGpa, fourthSubject, swapIntent, isSecondTimer,
    subjectGrades, interestTags, domainClusters, location, uniCategory, priorities
  ]);

  const eligibleResults = useMemo(() => {
    return scoredResults.filter(r => r.eligible);
  }, [scoredResults]);

  const lockedResults = useMemo(() => {
    return scoredResults.filter(r => !r.eligible);
  }, [scoredResults]);

  // Form step-wise validation
  const step1Valid = useMemo(() => {
    if (!hscGroup) return false;
    if (isSecondTimer === null) return false;
    // GPA required inputs
    if (!sscGpa || !hscGpa) return false;
    const sGpa = parseFloat(sscGpa);
    const hGpa = parseFloat(hscGpa);
    if (isNaN(sGpa) || sGpa < 2.0 || sGpa > 5.0) return false;
    if (isNaN(hGpa) || hGpa < 2.0 || hGpa > 5.0) return false;

    // Science sub-questions check
    if (hscGroup === "science") {
      if (!fourthSubject) return false;
      if ((fourthSubject === "math" || fourthSubject === "biology") && !swapIntent) return false;
    }
    return true;
  }, [hscGroup, sscGpa, hscGpa, fourthSubject, swapIntent, isSecondTimer]);

  const step2Valid = useMemo(() => {
    return interestTags.length > 0 && domainClusters.length > 0;
  }, [interestTags, domainClusters]);

  const handleInterestToggle = (tag) => {
    setInterestTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= 3) return prev; // Limit to 3
      return [...prev, tag];
    });
  };

  const handleClusterToggle = (cluster) => {
    setDomainClusters(prev => {
      if (prev.includes(cluster)) return prev.filter(c => c !== cluster);
      return [...prev, cluster];
    });
  };

  const handleLocationToggle = (loc) => {
    setLocation(prev => {
      if (prev.includes(loc)) return prev.filter(l => l !== loc);
      return [...prev, loc];
    });
  };

  const handlePriorityToggle = (p) => {
    setPriorities(prev => {
      if (prev.includes(p)) return prev.filter(item => item !== p);
      return [...prev, p];
    });
  };

  const renderProgress = () => {
    const steps = [
      { id: 1, label: "Academics" },
      { id: 2, label: "Interests & Strengths" },
      { id: 3, label: "Logistics" },
      { id: 4, label: "Your Recommendations" }
    ];
    return (
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, borderBottom: "1px solid var(--ink-08)", paddingBottom: 16 }}>
        {steps.map(s => (
          <div key={s.id} style={{ opacity: step === s.id ? 1 : 0.4, transition: "opacity 150ms ease", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", background: step >= s.id ? "var(--green)" : "var(--ink-16)",
              color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600
            }}>{s.id}</span>
            <span style={{ fontSize: 13, fontWeight: step === s.id ? 600 : 500, color: "var(--text)" }}>{s.label}</span>
          </div>
        ))}
      </div>
    );
  };


// EduPath BD — Smart Matcher v2 UI Part 3 (Step 1, 2, 3 Form Render functions)

  // ── STEP 1: ACADEMICS RENDER ───────────────────────────
  const renderStep1 = () => {
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Select your HSC (or equivalent) stream:</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { id: "science", label: "Science", desc: "Engineering, Medicine, General Science paths" },
              { id: "commerce", label: "Commerce", desc: "Business Administration, Accounting, Economics paths" },
              { id: "humanities", label: "Humanities", desc: "Arts, Law, Social Sciences, Literature paths" }
            ].map(g => (
              <button key={g.id} onClick={() => {
                setHscGroup(g.id);
                if (g.id !== "science") {
                  setFourthSubject(null);
                  setSwapIntent(null);
                }
              }}
                style={{
                  padding: 16, textAlign: "left", borderRadius: 10, cursor: "pointer",
                  background: hscGroup === g.id ? "var(--green-12)" : "var(--surface)",
                  border: hscGroup === g.id ? "1.5px solid var(--green)" : "1px solid var(--ink-16)",
                  transition: "all 200ms ease"
                }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: hscGroup === g.id ? "var(--green)" : "var(--text)" }}>{g.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* GPA Inputs */}
        {hscGroup && (
          <div style={{ marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeIn 0.2s ease" }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>SSC GPA (with 4th subject):</label>
              <input type="number" min="2.00" max="5.00" step="0.01" value={sscGpa} onChange={e => setSscGpa(e.target.value)}
                placeholder="e.g., 5.00"
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--ink-16)", borderRadius: 8, background: "var(--surface)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>HSC GPA (with 4th subject):</label>
              <input type="number" min="2.00" max="5.00" step="0.01" value={hscGpa} onChange={e => setHscGpa(e.target.value)}
                placeholder="e.g., 4.85"
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--ink-16)", borderRadius: 8, background: "var(--surface)", color: "var(--text)" }}
              />
            </div>
          </div>
        )}

        {/* Science specific sub-questions */}
        {hscGroup === "science" && (
          <div style={{ marginBottom: 32, padding: 20, background: "var(--surface)", border: "1px solid var(--ink-08)", borderRadius: 12, animation: "fadeIn 0.3s ease" }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>What was your 4th (optional) subject?</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { id: "math", label: "Higher Mathematics" },
                { id: "biology", label: "Biology" },
                { id: "none", label: "None / Other" }
              ].map(sub => (
                <button key={sub.id} onClick={() => {
                  setFourthSubject(sub.id);
                  if (sub.id === "none") setSwapIntent(null);
                }}
                  style={{
                    padding: "10px 16px", fontSize: 13, borderRadius: 8, cursor: "pointer",
                    background: fourthSubject === sub.id ? "var(--green)" : "var(--surface)",
                    color: fourthSubject === sub.id ? "#fff" : "var(--text)",
                    border: "1px solid var(--ink-16)", transition: "all 150ms ease"
                  }}>
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Answer or Swap intent question */}
            {(fourthSubject === "math" || fourthSubject === "biology") && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                  Do you plan to answer <strong>{fourthSubject === "math" ? "Higher Mathematics" : "Biology"}</strong> in your admission test, or swap it for Bangla/English?
                </label>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { id: "answer", label: `I will answer ${fourthSubject === "math" ? "Math" : "Biology"}`, desc: "Keeps 100% eligibility for engineering/life science degrees." },
                    { id: "swap", label: "I will swap it for Bangla/English", desc: "Reduces exam stress, but legally bars you from engineering/life science options." }
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setSwapIntent(opt.id)}
                      style={{
                        padding: 14, textAlign: "left", borderRadius: 8, cursor: "pointer",
                        background: swapIntent === opt.id ? "var(--green-12)" : "var(--surface)",
                        border: swapIntent === opt.id ? "1.5px solid var(--green)" : "1px solid var(--ink-16)",
                        transition: "all 150ms ease"
                      }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: swapIntent === opt.id ? "var(--green)" : "var(--text)" }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grade-Specific Dropdowns (Optional/Advanced) */}
        {hscGroup && (
          <div style={{ marginBottom: 32, padding: 20, background: "var(--surface)", border: "1px solid var(--ink-08)", borderRadius: 12, animation: "fadeIn 0.3s ease" }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Subject Grades (Optional but highly recommended):</label>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
              Used to check specific university department prerequisites (e.g., A- in HSC Math for CSE/EEE).
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
              {["math", "physics", "chemistry", "biology", "english"].map(subjKey => {
                // Only show relevant grades based on HSC group
                if (hscGroup !== "science" && ["physics", "chemistry", "biology"].includes(subjKey)) return null;
                return (
                  <div key={subjKey}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, textTransform: "capitalize" }}>{subjKey}</label>
                    <select
                      value={subjectGrades[subjKey]}
                      onChange={e => setSubjectGrades(prev => ({ ...prev, [subjKey]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 10px", border: "1.5px solid var(--ink-16)", borderRadius: 6, background: "var(--surface)", color: "var(--text)", fontSize: 13 }}
                    >
                      <option value="">Select Grade</option>
                      {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D"].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Second-Timer Question */}
        {hscGroup && (
          <div style={{ marginBottom: 32, padding: 20, background: "var(--surface)", border: "1px solid var(--ink-08)", borderRadius: 12, animation: "fadeIn 0.3s ease" }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Are you a Second-Time Admission Candidate?</label>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>
              Second-timers (HSC passed in a previous year) are legally barred from applying to <strong>DU</strong> and <strong>BUET</strong>. JU, RU, and most other universities allow second-timers.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: false, label: "No — First-Time Candidate", desc: "All universities open" },
                { id: true, label: "Yes — Second-Timer", desc: "DU and BUET will be excluded from your results" }
              ].map(opt => (
                <button key={String(opt.id)} onClick={() => setIsSecondTimer(opt.id)}
                  style={{
                    padding: 14, textAlign: "left", borderRadius: 8, cursor: "pointer",
                    background: isSecondTimer === opt.id ? (opt.id ? "rgba(234,179,8,0.08)" : "var(--green-12)") : "var(--surface)",
                    border: isSecondTimer === opt.id ? (opt.id ? "1.5px solid rgba(234,179,8,0.5)" : "1.5px solid var(--green)") : "1px solid var(--ink-16)",
                    transition: "all 150ms ease"
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: isSecondTimer === opt.id ? (opt.id ? "#92400e" : "var(--green)") : "var(--text)" }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => setStep(2)}
            disabled={!step1Valid}
            style={{ padding: "12px 24px", opacity: step1Valid ? 1 : 0.5, cursor: step1Valid ? "pointer" : "not-allowed" }}>
            Next: Interests →
          </button>
        </div>
      </div>
    );
  };

  // ── STEP 2: INTERESTS RENDER ───────────────────────────
  const renderStep2 = () => {
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Select 2-3 fields of interest or activities that excite you most:</label>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Choose up to 3 options to match with subjects.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { id: "coding", label: "Building software / coding", icon: "💻" },
              { id: "life-sciences", label: "Treating animals or plants / life sciences", icon: "🌿" },
              { id: "math", label: "Solving complex math problems", icon: "🔢" },
              { id: "business", label: "Managing businesses or money", icon: "📊" },
              { id: "writing", label: "Creative writing / journalism / media", icon: "✍️" },
              { id: "law", label: "Law, governance, public service", icon: "⚖️" },
              { id: "lab", label: "Lab research / chemistry / experiments", icon: "🧪" }
            ].map(interest => {
              // Hide engineering-like or life-science-like options if background is invalid (e.g. Commerce/Humanities)
              if (hscGroup !== "science" && ["coding", "life-sciences", "math", "lab"].includes(interest.id)) return null;
              const isActive = interestTags.includes(interest.id);
              return (
                <button key={interest.id} onClick={() => handleInterestToggle(interest.id)}
                  style={{
                    padding: "10px 18px", borderRadius: 100, border: isActive ? "1.5px solid var(--green)" : "1.5px solid var(--ink-16)",
                    background: isActive ? "var(--green-12)" : "var(--surface)", color: "var(--text)", fontSize: 13,
                    cursor: "pointer", transition: "all 150ms ease", display: "inline-flex", alignItems: "center", gap: 8
                  }}>
                  <span>{interest.icon}</span>
                  <strong>{interest.label}</strong>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Preferred Domain / University Cluster:</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { id: "engineering", label: "Engineering & Tech", desc: "BUET, KUET, RUET, DUET, etc." },
              { id: "arts-social", label: "General Public Universities", desc: "DU, JU, RU, CU, etc." },
              { id: "life-science", label: "Agricultural Sciences & Life Sciences", desc: "BAU, BSMRMU, etc." },
              { id: "business", label: "Business Schools & Commerce", desc: "FBS (DU), IBA, etc." },
              { id: "health", label: "Medical & Health / Pharmacy", desc: "Pharmacy & Applied Biology fields" }
            ].map(cluster => {
              if (hscGroup !== "science" && ["engineering", "life-science", "health"].includes(cluster.id)) return null;
              const isActive = domainClusters.includes(cluster.id);
              return (
                <button key={cluster.id} onClick={() => handleClusterToggle(cluster.id)}
                  style={{
                    padding: 16, textAlign: "left", borderRadius: 10, cursor: "pointer",
                    background: isActive ? "var(--green-12)" : "var(--surface)",
                    border: isActive ? "1.5px solid var(--green)" : "1.5px solid var(--ink-16)",
                    transition: "all 200ms ease"
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isActive ? "var(--green)" : "var(--text)" }}>{cluster.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{cluster.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ padding: "12px 24px" }}>← Back: Academics</button>
          <button className="btn btn-primary" onClick={() => setStep(3)}
            disabled={!step2Valid}
            style={{ padding: "12px 24px", opacity: step2Valid ? 1 : 0.5 }}>
            Next: Logistics →
          </button>
        </div>
      </div>
    );
  };

  // ── STEP 3: LOGISTICS RENDER ───────────────────────────
  const renderStep3 = () => {
    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Geographic / Location Preference:</label>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Select divisions where you are willing to move/study.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { id: "dhaka", label: "Dhaka Division" },
              { id: "chattogram", label: "Chattogram Division" },
              { id: "rajshahi", label: "Rajshahi / Rangpur" },
              { id: "khulna", label: "Khulna / Barishal" }
            ].map(loc => {
              const isActive = location.includes(loc.id);
              return (
                <button key={loc.id} onClick={() => handleLocationToggle(loc.id)}
                  style={{
                    padding: "10px 18px", borderRadius: 100, border: isActive ? "1.5px solid var(--green)" : "1.5px solid var(--ink-16)",
                    background: isActive ? "var(--green-12)" : "var(--surface)", color: "var(--text)", fontSize: 13,
                    cursor: "pointer", transition: "all 150ms ease"
                  }}>
                  {loc.label}
                </button>
              );
            })}
            <button onClick={() => setLocation([])}
              style={{
                padding: "10px 18px", borderRadius: 100, border: location.length === 0 ? "1.5px solid var(--green)" : "1.5px solid var(--ink-16)",
                background: location.length === 0 ? "var(--green-12)" : "var(--surface)", color: "var(--text)", fontSize: 13,
                cursor: "pointer", transition: "all 150ms ease"
              }}>
              Anywhere in Bangladesh
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>University Type:</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { id: "public", label: "Strictly Public", desc: "Admission test based, highly competitive, minimal cost" },
              { id: "private", label: "Private Universities Only", desc: "Direct enrollment, higher cost, flexible conditions" },
              { id: "both", label: "Show Both Options", desc: "Recommend based purely on academic fit" }
            ].map(cat => (
              <button key={cat.id} onClick={() => setUniCategory(cat.id)}
                style={{
                  padding: 16, textAlign: "left", borderRadius: 10, cursor: "pointer",
                  background: uniCategory === cat.id ? "var(--green-12)" : "var(--surface)",
                  border: uniCategory === cat.id ? "1.5px solid var(--green)" : "1px solid var(--ink-16)",
                  transition: "all 200ms ease"
                }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: uniCategory === cat.id ? "var(--green)" : "var(--text)" }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Your Career Priorities:</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {[
              { id: "salary", label: "High Earning Potential", desc: "Prioritizes corporate, freelance, and industry salary packages" },
              { id: "bcs", label: "BCS / Govt. Job Relevance", desc: "Prioritizes subjects relevant to general and technical BCS cadres" },
              { id: "abroad", label: "Study & Work Abroad", desc: "Prioritizes stem paths with high international accreditation" },
              { id: "research", label: "Academic & Research Path", desc: "Prioritizes research labs, thesis work, and academic tracks" }
            ].map(p => {
              const isActive = priorities.includes(p.id);
              return (
                <button key={p.id} onClick={() => handlePriorityToggle(p.id)}
                  style={{
                    padding: 16, textAlign: "left", borderRadius: 10, cursor: "pointer",
                    background: isActive ? "var(--green-12)" : "var(--surface)",
                    border: isActive ? "1.5px solid var(--green)" : "1.5px solid var(--ink-16)",
                    transition: "all 200ms ease"
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isActive ? "var(--green)" : "var(--text)" }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ padding: "12px 24px" }}>← Back: Interests</button>
          <button className="btn btn-primary" onClick={() => setStep(4)} style={{ padding: "12px 24px" }}>
            See Recommendations ({eligibleResults.length} Paths) →
          </button>
        </div>
      </div>
    );
  };


// EduPath BD — Smart Matcher v2 UI Part 4 (Results Page & Subject Cards)

  // ── STEP 4: RESULTS RENDER ────────────────────────────
  const renderStep4 = () => {
    // Sort results by score (descending)
    const sortedEligible = [...eligibleResults].sort((a, b) => b.score - a.score);

    return (
      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {/* Second-timer global notice banner if active */}
        {isSecondTimer && (
          <div style={{
            background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)",
            padding: "12px 18px", borderRadius: 10, color: "#92400e", fontSize: 13,
            display: "flex", gap: 10, alignItems: "center", marginBottom: 24
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span>
              <strong>Second-Timer Mode Active:</strong> DU and BUET are hard-excluded from all qualifying lists below. Penalties are applied to medical and general public university scores.
            </span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Recommended Paths for You ({sortedEligible.length})</h2>
          <button className="pf-link" onClick={() => {
            setStep(1);
            setHscGroup(null);
            setSscGpa("");
            setHscGpa("");
            setFourthSubject(null);
            setSwapIntent(null);
            setIsSecondTimer(null);
            setSubjectGrades({ math: "", physics: "", chemistry: "", biology: "", english: "" });
            setInterestTags([]);
            setDomainClusters([]);
            setLocation([]);
            setUniCategory("both");
            setPriorities([]);
          }}>Reset & Restart</button>
        </div>

        {sortedEligible.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", background: "var(--surface)", border: "1.5px dashed var(--ink-16)", borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No Matching Paths Found</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360, margin: "0 auto 16px" }}>
              Your academic grades, combined GPA, or 4th subject swap selection locked all standard paths. Try relaxing your parameters or correcting inputs.
            </p>
            <button className="btn btn-primary" onClick={() => setStep(1)}>Modify Academics</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16, marginBottom: 40 }}>
            {sortedEligible.map(item => {
              const { subj, score, gpaWarnings } = item;
              const hasWarnings = gpaWarnings && gpaWarnings.length > 0;

              // Filter universities for this subject based on user location & second timer
              let unis = window.SubjectUniIds?.[subj.slug] || [];
              if (isSecondTimer) {
                unis = unis.filter(u => !SECOND_TIMER_BANNED_UNIS.includes(u));
              }

              // Category filters
              const isPrivateOnly = uniCategory === "private";
              const isPublicOnly = uniCategory === "public";
              
              // Mock/actual private check for demo purposes
              let qualifyingUnis = unis;
              if (isPublicOnly) {
                // Keep only public unis (for this demo all in window.SubjectUniIds are public)
              }

              // Calculate total merit seats across all qualifying universities
              const seatMap = window.SubjectSeats?.[subj.slug] || {};
              const totalSeats = qualifyingUnis.reduce((sum, u) => sum + (seatMap[u] || 0), 0);

              return (
                <div key={subj.slug}
                  style={{
                    background: "var(--surface)", border: hasWarnings ? "1.5px solid rgba(234,179,8,0.5)" : "1.5px solid var(--ink-16)",
                    borderRadius: 12, padding: 20, transition: "transform 150ms ease, border-color 150ms ease",
                    display: "flex", flexDirection: "column", gap: 12
                  }}>
                  {/* Card Head */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: "var(--text-muted)" }}>
                        {subj.degree || "Bachelor's Degree"}
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 2, marginBottom: 4 }}>
                        <a href={`#/subject/${subj.slug}`} onClick={(e) => {
                          e.preventDefault();
                          if (typeof window.__PF_NAVIGATE__ === "function") window.__PF_NAVIGATE__(subj.slug);
                        }} style={{ color: "inherit", textDecoration: "none" }}>
                          {subj.name}
                        </a>
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{subj.desc}</p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green)" }}>{score}% Match</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Match index</div>
                    </div>
                  </div>

                  {/* Warning banner inside card if GPA or grade prereqs are barely met */}
                  {hasWarnings && (
                    <div style={{
                      background: "rgba(234,179,8,0.06)", border: "1.5px solid rgba(234,179,8,0.25)",
                      padding: "8px 12px", borderRadius: 8, color: "#92400e", fontSize: 12, lineHeight: 1.4
                    }}>
                      <strong>⚠️ Grade / GPA Prerequisite Warning:</strong>
                      <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                        {gpaWarnings.map((w, idx) => <li key={idx}>{w}</li>)}
                      </ul>
                      <div style={{ fontSize: 11, marginTop: 4, opacity: 0.85 }}>
                        You may face high admission test competition or be ineligible for certain premium seats.
                      </div>
                    </div>
                  )}

                  {/* Seat counter & quota disclaimer */}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", borderTop: "1px solid var(--ink-08)", paddingTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
                    <div>
                      <strong>{totalSeats > 0 ? totalSeats : "N/A"}</strong> merit seats across <strong>{qualifyingUnis.length}</strong> public universities
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "flex", gap: 4, alignItems: "center" }}>
                        <span>ℹ️ Seat counts reflect general merit. Additional quota seats (Tribal, Freedom Fighter, Ward) apply.</span>
                      </div>
                    </div>
                    <div>
                      BCS Relevance: <strong style={{ color: "var(--text)" }}>{subj.bcs_relevance ? subj.bcs_relevance.toUpperCase() : "MEDIUM"}</strong>
                    </div>
                  </div>

                  {/* Interactive detail link */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--ink-08)", paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {qualifyingUnis.slice(0, 4).map(u => (
                        <span key={u} style={{ background: "var(--ink-08)", padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                          {u}
                        </span>
                      ))}
                      {qualifyingUnis.length > 4 && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "center" }}>
                          +{qualifyingUnis.length - 4} more
                        </span>
                      )}
                    </div>
                    <button className="pf-link" onClick={() => {
                      if (typeof window.__PF_NAVIGATE__ === "function") window.__PF_NAVIGATE__(subj.slug);
                    }} style={{ fontSize: 13 }}>
                      Explore Curriculum & Salaries →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LOCKED PATHS SECTION ───────────────────────────────── */}
        {lockedResults.length > 0 && (
          <div style={{ marginTop: 48, borderTop: "2px solid var(--ink-08)", paddingTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#922820", marginBottom: 6 }}>Locked / Ineligible Paths ({lockedResults.length})</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              These subjects were locked based on your HSC stream background, combined GPA cutoff, or 4th subject swap decision.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {lockedResults.map(item => (
                <div key={item.subj.slug}
                  style={{
                    background: "var(--surface)", border: "1.5px solid rgba(220,38,38,0.25)",
                    borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>{item.subj.name}</h4>
                    <p style={{ fontSize: 12, color: "#922820", margin: "4px 0 0 0", fontWeight: 500 }}>
                      🔒 {item.lockReason || "HSC background constraint"}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, background: "rgba(220,38,38,0.08)", color: "#dc2626", padding: "4px 8px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase" }}>
                    Locked
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 32 }}>
          <button className="btn btn-secondary" onClick={() => setStep(3)} style={{ padding: "12px 24px" }}>← Back: Modify Logistics</button>
        </div>
      </div>
    );
  };

  // ── MAIN LAYOUT ────────────────────────────────────────
  return (
    <div className="pf-page" style={{ paddingTop: 80 }}>
      <div className="pf-container" style={{ maxWidth: 800 }}>
        {/* Dynamic preview counter */}
        {step < 4 && hscGroup && (
          <div style={{
            background: "var(--green-12)", border: "1.5px solid var(--green)", padding: "12px 18px",
            borderRadius: 10, color: "var(--green)", fontSize: 14, fontWeight: 600,
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24,
            animation: "fadeIn 0.2s ease"
          }}>
            <span>⚡ Real-time Eligibility Preview:</span>
            <span>{eligibleResults.length} matching subjects found</span>
          </div>
        )}

        {renderProgress()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
}

Object.assign(window, { AIMatcher });
