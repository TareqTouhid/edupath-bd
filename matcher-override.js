(function () {
  const { useMemo, useState } = React;
  const E = React.createElement;

  const HSC_GROUPS = [
    { id: "science", label: "Science", note: "Science, engineering, tech, agriculture, pharmacy and life-science options." },
    { id: "commerce", label: "Commerce", note: "Business, finance, economics, accounting and management options." },
    { id: "arts", label: "Humanities (Arts)", note: "Law, governance, journalism, humanities and social-science options." }
  ];

  const GROUP_FIT = {
    science: {
      subjects: [
        option("Physics"),
        option("Chemistry"),
        option("Biology"),
        option("Higher Mathematics"),
        option("ICT"),
        option("Agriculture")
      ],
      activities: [
        activity("math-problems", "Solving mathematical problems", ["math", "mathematics", "statistics", "analytics", "engineering", "physics"]),
        activity("software", "Building software", ["software", "coding", "programming", "computer", "cse", "ict", "technology"]),
        activity("experiments", "Conducting experiments", ["lab", "research", "chemistry", "biology", "pharmacy", "science"]),
        activity("scientific-research", "Researching scientific topics", ["research", "science", "biology", "physics", "environment", "agriculture"]),
        activity("systems", "Designing systems", ["engineering", "architecture", "systems", "design", "civil", "eee", "mechanical"]),
        activity("technology", "Working with technology", ["technology", "computer", "electronics", "software", "data", "machine"])
      ],
      goals: [
        goal("high-salary", "High salary", ["salary", "software", "engineering", "data", "finance", "pharmacy", "technology"]),
        goal("research", "Research opportunities", ["research", "science", "lab", "academic", "biology", "physics", "chemistry"]),
        goal("government", "Government jobs", ["government", "bcs", "public service", "cadre", "administration"]),
        goal("international", "International careers", ["abroad", "international", "global", "software", "engineering", "research"]),
        goal("entrepreneurship", "Entrepreneurship", ["business", "startup", "entrepreneurship", "product", "technology", "agriculture"])
      ]
    },
    commerce: {
      subjects: [
        option("Accounting"),
        option("Finance & Banking"),
        option("Economics"),
        option("Business Organization", "Business Studies"),
        option("Statistics"),
        option("ICT")
      ],
      activities: [
        activity("managing-teams", "Managing teams", ["management", "business", "organization", "leadership", "administration"]),
        activity("markets", "Analyzing markets", ["marketing", "economics", "market", "analytics", "business", "finance"]),
        activity("running-business", "Running businesses", ["business", "entrepreneurship", "management", "operations"]),
        activity("negotiating", "Negotiating deals", ["marketing", "business", "sales", "law", "management"]),
        activity("numbers", "Working with numbers", ["accounting", "finance", "statistics", "economics", "analytics"]),
        activity("financial-planning", "Financial planning", ["finance", "banking", "accounting", "investment", "economics"])
      ],
      goals: [
        goal("corporate-leadership", "Corporate leadership", ["management", "business", "leadership", "corporate", "administration"]),
        goal("entrepreneurship", "Entrepreneurship", ["business", "startup", "entrepreneurship", "marketing", "management"]),
        goal("banking-finance", "Banking & finance", ["bank", "finance", "accounting", "economics", "investment"]),
        goal("international-business", "International business", ["international", "business", "trade", "global", "economics"]),
        goal("government-admin", "Government administration", ["government", "bcs", "administration", "public service", "cadre"])
      ]
    },
    arts: {
      subjects: [
        option("Bangla"),
        option("English"),
        option("History"),
        option("Civics"),
        option("Geography"),
        option("Sociology"),
        option("Economics"),
        option("Islamic Studies")
      ],
      activities: [
        activity("writing", "Writing", ["writing", "language", "bangla", "english", "journalism", "communication"]),
        activity("speaking", "Public speaking", ["public", "speaking", "law", "communication", "debate", "governance"]),
        activity("policy", "Policy analysis", ["policy", "government", "public administration", "economics", "development"]),
        activity("teaching", "Teaching", ["education", "teaching", "academic", "english", "bangla", "history"]),
        activity("community", "Community development", ["development", "society", "sociology", "social", "ngo", "public service"]),
        activity("research", "Research", ["research", "history", "sociology", "economics", "geography", "academic"])
      ],
      goals: [
        goal("public-service", "Public service", ["government", "public service", "bcs", "administration", "policy"]),
        goal("academia", "Academia", ["academic", "teaching", "research", "education", "university"]),
        goal("law", "Law", ["law", "legal", "justice", "governance", "rights"]),
        goal("journalism", "Journalism", ["journalism", "media", "writing", "communication", "english", "bangla"]),
        goal("development-sector", "Development sector", ["development", "ngo", "social", "community", "policy"]),
        goal("civil-service", "Civil service", ["bcs", "civil service", "government", "cadre", "administration"])
      ]
    }
  };

  const DIVISIONS = ["Anywhere in Bangladesh", "Dhaka Division", "Chattogram Division", "Rajshahi/Rangpur", "Khulna/Barishal", "Sylhet/Mymensingh"];
  const UNI_TYPES = [["public", "Public only"], ["private", "Open to private"], ["both", "Both"]];

  function option(label, value) {
    return { label, value: value || label };
  }

  function activity(id, label, keywords) {
    return { id, label, keywords };
  }

  function goal(id, label, keywords) {
    return { id, label, keywords };
  }

  function allSubjects() {
    return window.EduPathDB?.subjects || window.DB_Subjects || window.PFData?.subjects || [];
  }

  function hscConfig(group) {
    return (window.EduPathDB?.hscMapping || window.DB_HSCMapping || {})[group] || { hsc_subjects: [], maps_to: {} };
  }

  function fitConfig(group) {
    return GROUP_FIT[group] || { subjects: [], activities: [], goals: [] };
  }

  function hscEligible(subject, group) {
    if (!group) return true;
    const groups = subject.hsc_groups || (subject.hsc || []).map(v => String(v).toLowerCase());
    return !groups.length || groups.includes(group);
  }

  function typeOfferings(subject, uniType) {
    const offerings = subject.offerings || [];
    if (uniType === "both") return offerings;
    return offerings.filter(o => String(o.university_type || "").toLowerCase() === uniType);
  }

  function subjectBoostFromHscPick(subject, picked, group, mode) {
    const cfg = hscConfig(group);
    let boost = 0;
    picked.forEach(name => {
      const map = cfg.maps_to?.[name];
      if (!map) return;
      if ((map.subjects || []).includes(subject.slug)) {
        boost += (mode === "strong" ? 32 : -24) * (Number(map.weight) || 1);
      }
    });
    return boost;
  }

  function searchableText(subject) {
    return [
      subject.slug,
      subject.name,
      subject.desc,
      subject.degree,
      subject.field,
      subject.bcs_relevance,
      ...(subject.related_interests || []),
      ...(subject.hsc_subjects_required || []),
      ...(subject.hsc_subjects_preferred || []),
      ...((subject.related_jobs || []).flatMap(job => [job.title, job.field, job.level]))
    ].join(" ").toLowerCase();
  }

  function textMatches(subject, keys) {
    const text = searchableText(subject);
    return keys.some(key => text.includes(String(key).toLowerCase()));
  }

  function careerGoalMatches(subject, goalItem) {
    if (textMatches(subject, goalItem.keywords)) return true;

    const slug = String(subject.slug || "").toLowerCase();
    const field = String(subject.field || "").toLowerCase();
    const bcs = String(subject.bcs_relevance || "").toLowerCase();

    if (["government", "government-admin", "public-service", "civil-service"].includes(goalItem.id)) {
      return bcs && bcs !== "low" || ["law", "economics", "public-administration", "political-science", "bangla", "english", "sociology"].some(k => slug.includes(k));
    }

    if (goalItem.id === "high-salary") {
      return ["technology", "engineering", "business", "health", "applied"].some(k => field.includes(k) || slug.includes(k));
    }

    if (goalItem.id === "international" || goalItem.id === "international-business") {
      return ["cse", "software", "engineering", "business", "economics", "finance", "pharmacy", "data"].some(k => slug.includes(k) || field.includes(k));
    }

    if (goalItem.id === "entrepreneurship") {
      return ["business", "management", "marketing", "cse", "software", "agriculture", "food"].some(k => slug.includes(k) || field.includes(k));
    }

    if (goalItem.id === "research" || goalItem.id === "academia") {
      return ["science", "research", "biology", "physics", "chemistry", "environment", "history", "sociology", "economics"].some(k => slug.includes(k) || field.includes(k));
    }

    return false;
  }

  function scoreSubject(subject, form) {
    if (!hscEligible(subject, form.hscGroup)) {
      return { subject, score: -999, blocked: true, reasons: [], warnings: ["HSC group mismatch."] };
    }

    let score = 30;
    const reasons = ["Open for your HSC group."];
    const warnings = [];
    const fit = fitConfig(form.hscGroup);

    const strongBoost = subjectBoostFromHscPick(subject, form.strongSubjects, form.hscGroup, "strong");
    if (strongBoost > 0) {
      score += strongBoost;
      reasons.push("Matches a subject you are strong in.");
    }

    const avoidPenalty = subjectBoostFromHscPick(subject, form.avoidSubjects, form.hscGroup, "avoid");
    if (avoidPenalty < 0) {
      score += avoidPenalty;
      warnings.push("This path may involve a subject you prefer to avoid.");
    }

    form.activities.forEach(id => {
      const item = fit.activities.find(x => x.id === id);
      if (item && textMatches(subject, item.keywords)) {
        score += 24;
        reasons.push(`Fits activity: ${item.label}.`);
      }
    });

    form.careerGoals.forEach(id => {
      const item = fit.goals.find(x => x.id === id);
      if (item && careerGoalMatches(subject, item)) {
        score += 20;
        reasons.push(`Supports goal: ${item.label}.`);
      }
    });

    const hscGpa = Number(form.hscGpa);
    if (Number.isFinite(hscGpa) && hscGpa > 0) {
      if (hscGpa >= 4.5) score += 8;
      else if (hscGpa < 3.5 && (subject.difficulty || 3) >= 4) {
        score -= 8;
        warnings.push("High-pressure subject; compare real stories before shortlisting.");
      }
    }

    const offerings = typeOfferings(subject, form.uniType);
    if (offerings.length) {
      score += Math.min(16, offerings.length * 2);
      reasons.push(`${offerings.length} university option${offerings.length === 1 ? "" : "s"} found in DB.`);
    } else if (form.uniType !== "both") {
      score -= 18;
    }

    const stats = subject.testimonial_stats || {};
    if (stats.count) {
      score += Math.min(18, stats.count * 4);
      reasons.push(`${stats.count} real student/alumni stor${stats.count === 1 ? "y" : "ies"} available.`);
    }

    return {
      subject,
      score,
      blocked: false,
      warnings: Array.from(new Set(warnings)).slice(0, 2),
      reasons: Array.from(new Set(reasons)).slice(0, 4)
    };
  }

  function getMatches(form) {
    return allSubjects()
      .map(subject => scoreSubject(subject, form))
      .filter(row => !row.blocked && row.score > 18)
      .sort((a, b) => b.score - a.score);
  }

  function Field({ label, note, children }) {
    return E("label", { style: { display: "block", marginBottom: 18 } },
      E("span", { style: { display: "block", fontSize: 13, fontWeight: 800, marginBottom: 7 } }, label),
      children,
      note ? E("span", { style: { display: "block", color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5, marginTop: 6 } }, note) : null);
  }

  function ChoiceSection({ label, children, first }) {
    return window.EduPathUI?.choiceSection
      ? window.EduPathUI.choiceSection(E, { label, children, style: first ? { marginTop: 8 } : null })
      : E("section", { style: { borderTop: first ? "none" : "1px solid var(--ink-08)", paddingTop: first ? 0 : 18, marginTop: first ? 8 : 20 } },
        E("div", { style: { fontSize: 13, fontWeight: 800, marginBottom: 10 } }, label),
        children);
  }

  function CardButton({ active, children, onClick }) {
    return E("button", {
      type: "button",
      onClick,
      style: {
        minHeight: 88,
        padding: 16,
        borderRadius: 10,
        border: "1.5px solid " + (active ? "var(--green)" : "var(--ink-16)"),
        background: active ? "var(--green)" : "var(--surface)",
        color: active ? "#fff" : "var(--text)",
        textAlign: "left",
        cursor: "pointer",
        font: "inherit"
      }
    }, children);
  }

  function ChoiceGroup({ children }) {
    return window.EduPathUI?.choiceGroup
      ? window.EduPathUI.choiceGroup(E, children)
      : E("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 } }, children);
  }

  function Chip({ active, disabled, children, onClick }) {
    return window.EduPathUI?.choicePill
      ? window.EduPathUI.choicePill(E, { active, disabled, onClick, children })
      : E("button", { type: "button", onClick, disabled, className: "pill" + (active ? " is-active" : "") }, children);
  }

  function Progress({ step }) {
    return E("div", { style: { marginBottom: 26 } },
      E("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 } },
        [1, 2, 3].map(n => E("div", { key: n, style: { height: 6, borderRadius: 99, background: n <= step ? "var(--green)" : "var(--ink-08)" } }))),
      E("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: 12, fontWeight: 700 } },
        E("span", null, "Step ", step, " of 3"),
        E("span", null, step === 1 ? "Basic info" : step === 2 ? "Academic fit" : "Preferences")));
  }

  function ScreenMatcher({ go }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState(null);
    const [form, setForm] = useState({
      hscGroup: "",
      hscGpa: "",
      strongSubjects: [],
      avoidSubjects: [],
      activities: [],
      careerGoals: [],
      division: "Anywhere in Bangladesh",
      uniType: "both",
      extra: ""
    });

    const input = { width: "100%", border: "1.5px solid var(--ink-16)", borderRadius: "var(--r-input)", background: "var(--surface)", padding: "12px 14px", font: "inherit", fontSize: 14 };
    const fit = fitConfig(form.hscGroup);
    const matches = useMemo(() => getMatches(form), [form]);
    const canStep1 = Boolean(form.hscGroup);
    const canStep2 = form.strongSubjects.length > 0 && form.activities.length > 0 && form.careerGoals.length > 0;

    function set(key, value) {
      setForm(current => Object.assign({}, current, { [key]: value }));
      setResults(null);
      setError("");
    }

    function resetGroup(group) {
      setForm(current => Object.assign({}, current, {
        hscGroup: group,
        strongSubjects: [],
        avoidSubjects: [],
        activities: [],
        careerGoals: []
      }));
      setResults(null);
      setError("");
    }

    function toggleList(key, id) {
      setForm(current => {
        const list = current[key] || [];
        const exists = list.includes(id);
        if (exists) return Object.assign({}, current, { [key]: list.filter(x => x !== id) });
        const next = Object.assign({}, current, { [key]: list.concat(id) });
        if (key === "strongSubjects") {
          next.avoidSubjects = (current.avoidSubjects || []).filter(x => x !== id);
        }
        if (key === "avoidSubjects") {
          next.strongSubjects = (current.strongSubjects || []).filter(x => x !== id);
        }
        return next;
      });
      setResults(null);
      setError("");
    }

    async function submit() {
      if (!canStep1 || !canStep2) {
        setError("Please choose at least one strongest subject, one activity, and one career goal.");
        return;
      }
      setLoading(true);
      setError("");
      const local = matches.slice(0, 8);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: form,
            matched_subjects: local.map(row => row.subject.slug),
            candidate_subjects: local.map(row => ({
              slug: row.subject.slug,
              name: row.subject.name,
              score: row.score,
              reasons: row.reasons,
              warnings: row.warnings
            }))
          })
        });
        const json = await res.json().catch(() => ({}));
        setResults({ local, ai: json });
      } catch (err) {
        setResults({ local, ai: null });
      } finally {
        setLoading(false);
      }
    }

    if (results) {
      return E("div", { style: { padding: "56px 24px 90px" } },
        E("div", { style: { maxWidth: 980, margin: "0 auto" } },
          E("button", { className: "pf-link", onClick: () => setResults(null), style: { marginBottom: 14 } }, "Back to form"),
          E("h1", { className: "display-2", style: { fontSize: 44, marginBottom: 10 } }, "Options worth exploring"),
          E("p", { className: "lead", style: { marginBottom: 26 } }, "These are not final admission decisions. They are option matches from HSC group, strongest subjects, avoided subjects, activities, career goals, university availability, and real stories."),
          E("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 } },
            results.local.map((row, index) => E("article", { key: row.subject.slug, className: "card", style: { padding: 18 } },
              E("div", { className: "micro", style: { marginBottom: 8 } }, "#", index + 1, " option"),
              E("h2", { style: { fontSize: 24, marginBottom: 8 } }, row.subject.name),
              E("p", { style: { color: "var(--text-muted)", marginBottom: 12 } }, row.subject.desc || row.subject.degree || ""),
              E("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 } },
                E("span", { className: "pill" }, (row.subject.hsc || []).join(" / ") || form.hscGroup),
                row.subject.total_seats ? E("span", { className: "pill" }, row.subject.total_seats, " seats") : null,
                row.subject.testimonial_stats?.count ? E("span", { className: "pill" }, row.subject.testimonial_stats.count, " stories") : null),
              row.reasons.length ? E("ul", { style: { paddingLeft: 18, margin: "0 0 12px", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 } },
                row.reasons.slice(0, 3).map(reason => E("li", { key: reason }, reason))) : null,
              row.warnings.length ? E("div", { style: { background: "var(--terracotta-16)", borderRadius: 8, padding: 10, color: "var(--text)", fontSize: 13, marginBottom: 12 } }, row.warnings[0]) : null,
              E("button", { className: "btn btn-ghost", onClick: () => { window.app?.setSubjectSlug?.(row.subject.slug); go("detail"); } }, "View subject"))))));
    }

    return E("div", { style: { padding: "56px 24px 90px" } },
      E("div", { style: { maxWidth: 760, margin: "0 auto" } },
        E("div", { className: "micro", style: { marginBottom: 10 } }, "Find my path"),
        E("h1", { className: "display-2", style: { fontSize: 44, marginBottom: 12 } }, "Find options from your academic fit and real stories."),
        E("p", { className: "lead", style: { marginBottom: 26 } }, "Start broad. We use your HSC group, strongest subjects, subjects you prefer to avoid, activities, career goals, and testimonials to suggest paths to explore."),
        E(Progress, { step }),
        step === 1 ? E("section", null,
          E("h2", { style: { fontSize: 24, marginBottom: 14 } }, "Basic info"),
          E(Field, { label: "HSC / equivalent group" },
            E("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 } },
              HSC_GROUPS.map(g => E(CardButton, { key: g.id, active: form.hscGroup === g.id, onClick: () => resetGroup(g.id) },
                E("strong", { style: { display: "block", marginBottom: 6 } }, g.label),
                E("span", { style: { fontSize: 12, lineHeight: 1.5, opacity: form.hscGroup === g.id ? 0.9 : 0.72 } }, g.note))))),
          E(Field, { label: "HSC GPA (optional)", note: "Used only as a light signal. University-wise exact grade rules should be checked on each university circular." },
            E("input", { type: "number", min: 0, max: 5, step: 0.01, style: input, value: form.hscGpa, onChange: e => set("hscGpa", e.target.value), placeholder: "e.g. 4.50" }))) : null,

        step === 2 ? E("section", null,
          E("h2", { style: { fontSize: 24, marginBottom: 14 } }, "Academic fit assessment"),
          E(ChoiceSection, { label: "Strongest Subjects", first: true },
            E(ChoiceGroup, null, fit.subjects.map(item => E(Chip, { key: item.value, active: form.strongSubjects.includes(item.value), onClick: () => toggleList("strongSubjects", item.value) }, item.label)))),
          E(ChoiceSection, { label: "Subjects You Prefer to Avoid" },
            E(ChoiceGroup, null, fit.subjects.map(item => E(Chip, { key: item.value, active: form.avoidSubjects.includes(item.value), onClick: () => toggleList("avoidSubjects", item.value) }, item.label)))),
          E(ChoiceSection, { label: "Activities You Enjoy" },
            E(ChoiceGroup, null, fit.activities.map(item => E(Chip, { key: item.id, active: form.activities.includes(item.id), onClick: () => toggleList("activities", item.id) }, item.label)))),
          E(ChoiceSection, { label: "Career Goals" },
            E(ChoiceGroup, null, fit.goals.map(item => E(Chip, { key: item.id, active: form.careerGoals.includes(item.id), onClick: () => toggleList("careerGoals", item.id) }, item.label)))),
          !canStep2 ? E("p", { style: { color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5, marginTop: 14 } }, "Choose at least one strongest subject, one activity, and one career goal to continue.") : null) : null,

        step === 3 ? E("section", null,
          E("h2", { style: { fontSize: 24, marginBottom: 14 } }, "Preferences"),
          E(Field, { label: "Location preference" },
            E("select", { style: input, value: form.division, onChange: e => set("division", e.target.value) },
              DIVISIONS.map(v => E("option", { key: v, value: v }, v)))),
          E(Field, { label: "University category" },
            E("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
              UNI_TYPES.map(([id, label]) => E(Chip, { key: id, active: form.uniType === id, onClick: () => set("uniType", id) }, label)))),
          E(Field, { label: "Anything else? (optional)" },
            E("textarea", { rows: 4, style: Object.assign({}, input, { resize: "vertical" }), value: form.extra, onChange: e => set("extra", e.target.value), placeholder: "Example: wants BCS, wants abroad, afraid of math, family prefers public university..." }))) : null,

        error ? E("div", { style: { background: "#FDECEA", color: "#922820", padding: 12, borderRadius: 8, marginTop: 14, fontSize: 14 } }, error) : null,
        E("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 24, flexWrap: "wrap" } },
          E("button", { type: "button", className: "pf-link", onClick: () => step === 1 ? go("landing") : setStep(step - 1) }, step === 1 ? "Cancel" : "Back"),
          E("div", { style: { display: "flex", gap: 10 } },
            step < 3 ? E("button", { type: "button", className: "btn btn-primary", disabled: step === 1 ? !canStep1 : !canStep2, onClick: () => setStep(step + 1) }, "Next") :
              E("button", { type: "button", className: "btn btn-primary", disabled: loading || !canStep1 || !canStep2, onClick: submit }, loading ? "Matching..." : "Submit")))));
  }

  Object.assign(window, { ScreenMatcher });
})();
