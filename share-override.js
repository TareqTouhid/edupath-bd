(function () {
  const { useState, useEffect, useMemo } = React;
  const E = React.createElement;

  const LS_KEY = "edupath_share_v2";
  const MIN_CHARS = 40;

  // ── Category detection ────────────────────────────────────────────────
  var FIELD_CATEGORY = {
    technology:       "engineering",
    business:         "business",
    "social-science": "humanities",
    humanities:       "humanities",
    science:          "health",
    environmental:    "health",
    applied:          "health",
    design:           "fallback",
  };

  var CLUSTER_OPTIONS = [
    { value: "engineering", label: "Computing, Engineering & Technology" },
    { value: "business",    label: "Business, Finance & Economics" },
    { value: "humanities",  label: "Humanities, Law, Social Science & Journalism" },
    { value: "health",      label: "Pharmacy, Life Sciences, Health & Agriculture" },
    { value: "fallback",    label: "Design, Creative Arts & Other" },
  ];

  var CATEGORY_LABELS = {
    engineering: "Computing, Engineering & Technology",
    business:    "Business, Finance & Economics",
    humanities:  "Humanities, Law, Social Science & Journalism",
    health:      "Pharmacy, Life Sciences, Health & Agriculture",
    fallback:    "Design, Creative Arts & Other",
  };

  var CATEGORY_SCALES = {
    engineering: [
      { key: "mathIntensity",    label: "Math intensity",                        low: "1 = Almost none",               high: "5 = Central to everything" },
      { key: "codingIntensity",  label: "Coding and technical depth",             low: "1 = Minimal",                   high: "5 = Core of the degree" },
      { key: "labIntensity",     label: "Lab, project, and hands-on work",        low: "1 = Mostly theory",             high: "5 = Frequent practical work" },
      { key: "selfLearning",     label: "How much must you learn on your own",    low: "1 = University teaching is enough", high: "5 = Self-study is essential" },
    ],
    business: [
      { key: "analyticalIntensity",    label: "Working with numbers and analysis",         low: "1 = Minimal",            high: "5 = Central to the degree" },
      { key: "communicationIntensity", label: "Communication, presentation, and teamwork", low: "1 = Rarely required",    high: "5 = Essential for performance" },
      { key: "networkingImportance",   label: "Importance of internship and networking",   low: "1 = Low impact",         high: "5 = Very important for opportunities" },
      { key: "industryPractical",      label: "Practical industry relevance",              low: "1 = Mostly theoretical", high: "5 = Strong real-world application" },
    ],
    humanities: [
      { key: "readingIntensity",    label: "Reading intensity",                        low: "1 = Light",           high: "5 = Very heavy reading load" },
      { key: "writingIntensity",    label: "Writing and argumentation",                low: "1 = Rarely tested",   high: "5 = Central to success" },
      { key: "researchIntensity",   label: "Research, fieldwork, or policy work",      low: "1 = Rarely involved", high: "5 = A major part of the degree" },
      { key: "publicCommunication", label: "Public communication and presentation",    low: "1 = Not important",   high: "5 = Very important" },
    ],
    health: [
      { key: "labPractical",     label: "Lab and practical work",                    low: "1 = Mostly theory", high: "5 = Frequent hands-on work" },
      { key: "memorization",     label: "Memorization requirement",                  low: "1 = Low",           high: "5 = Very high" },
      { key: "scienceIntensity", label: "Biology, chemistry, or science intensity",  low: "1 = Minimal",       high: "5 = Central to everything" },
      { key: "clinicalExposure", label: "Research, clinical, or field exposure",     low: "1 = Limited",       high: "5 = Strong exposure" },
    ],
    fallback: [
      { key: "practicalIntensity",     label: "Practical or hands-on work intensity",    low: "1 = Mostly conceptual or theoretical", high: "5 = Frequent practical, studio, or applied work" },
      { key: "readingWritingResearch", label: "Reading, writing, or research intensity", low: "1 = Light",                            high: "5 = Very heavy" },
      { key: "independentLearning",    label: "How much must you learn on your own",     low: "1 = University support is enough",     high: "5 = Self-study is essential" },
    ],
  };

  var UNIVERSITY_SCALES = [
    { key: "uniAdministration",  label: "University administration and bureaucracy",    low: "1 = Very poor", high: "5 = Well-organized" },
    { key: "uniInfrastructure",  label: "Physical infrastructure and campus resources", low: "1 = Poor",      high: "5 = Well-equipped" },
    { key: "uniCareerPlacement", label: "University-level career placement support",    low: "1 = Almost none", high: "5 = Very active" },
  ];

  var PROFESSION_OPTIONS = [
    "Software / IT", "Banking and Finance", "Teaching and Academia",
    "Healthcare", "Government and Public Service", "Development sector (NGO / INGO)",
    "Business and Entrepreneurship", "Sales, Marketing, and Communication",
    "Operations and Administration", "Creative sector",
    "Research and Further Studies", "Other",
  ];

  var SITUATION_OPTIONS = [
    { value: "Working",                    label: "Working" },
    { value: "Higher studies",             label: "Higher studies" },
    { value: "Job-seeking",               label: "Job-seeking" },
    { value: "BCS / Government exam prep", label: "BCS / Govt exam prep" },
    { value: "Other",                      label: "Other" },
  ];

  var BCS_STAGES = [
    "Preparing (have not appeared yet)",
    "Appeared in preliminary exam",
    "Cleared preliminary exam",
    "Selected as cadre",
  ];

  var TIME_OPTIONS = [
    "Before graduation", "Within 6 months",
    "6 to 12 months", "More than 1 year", "Still seeking",
  ];

  var EMPTY_FORM = {
    undergradUniversity: "", undergradSubjectName: "", subjectSlug: "",
    subjectCluster: "", session: "", hscGroup: "", currentStatus: "",
    subjectWorthRating: 0, academicPressure: 0, facultyQuality: 0,
    curriculumRelevance: 0, careerProspects: 0, studentSupport: 0,
    wouldChooseAgain: "", chooseAgainReason: "", notSureReason: "",
    subjectAttribution: 0,
    uniAdministration: 0, uniInfrastructure: 0, uniCareerPlacement: 0,
    mathIntensity: 0, codingIntensity: 0, labIntensity: 0, selfLearning: 0,
    analyticalIntensity: 0, communicationIntensity: 0, networkingImportance: 0, industryPractical: 0,
    readingIntensity: 0, writingIntensity: 0, researchIntensity: 0, publicCommunication: 0,
    labPractical: 0, memorization: 0, scienceIntensity: 0, clinicalExposure: 0,
    practicalIntensity: 0, readingWritingResearch: 0, independentLearning: 0,
    confidenceRating: 0,
    badExperience: "", whoShouldTake: "", whoShouldNotTake: "",
    oneThingToKnow: "", goodExperience: "", whatSurprised: "", batchmatePaths: "",
    currentCity: "", currentCountry: "", currentSituation: "",
    profession: "", jobTitle: "", workRelevance: 0, financialReturn: 0,
    bcsPrep: "", bcsStage: "", timeToOpportunity: "",
    consent: false,
  };

  function slugify(v) {
    return String(v || "").trim().toLowerCase()
      .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "").slice(0, 80) || "unknown-subject";
  }

  // ── UI primitives ──────────────────────────────────────────────────────
  function Field({ label, children, required, note }) {
    return E("label", { style: { display: "block", marginBottom: 18 } },
      E("span", { style: { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 } },
        label,
        required ? E("span", { style: { color: "#C8553D" } }, " *") : null),
      children,
      note ? E("span", { style: { display: "block", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 6 } }, note) : null);
  }

  function Scale({ label, value, onChange, low, high, required }) {
    return E(Field, { label, required: required !== false },
      E("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 } },
        [1, 2, 3, 4, 5].map(function (n) {
          return E("button", {
            key: n, type: "button",
            onClick: function () { onChange(n); },
            style: {
              minHeight: 42, borderRadius: 8,
              border: "1.5px solid " + (value === n ? "var(--green)" : "var(--ink-16)"),
              background: value === n ? "var(--green)" : "var(--surface)",
              color: value === n ? "#fff" : "var(--text)",
              fontWeight: 800, cursor: "pointer",
            },
          }, n);
        })),
      E("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" } },
        E("span", null, low),
        E("span", null, high)));
  }

  function TextAreaField({ label, required, value, onChange, placeholder, rows, minChars }) {
    var len = (value || "").trim().length;
    var tooShort = minChars && len < minChars && value.length > 0;
    return E(Field, { label, required },
      E("textarea", {
        rows: rows || 3,
        style: {
          width: "100%", padding: "12px 14px",
          border: "1.5px solid " + (tooShort ? "#C8553D" : "var(--ink-16)"),
          borderRadius: "var(--r-input,8px)", background: "var(--surface)",
          color: "var(--text)", fontFamily: "inherit", fontSize: 14,
          boxSizing: "border-box", resize: "vertical", minHeight: 80,
        },
        value, onChange, placeholder,
      }),
      minChars ? E("span", {
        style: { display: "block", fontSize: 12, marginTop: 4, color: tooShort ? "#C8553D" : "var(--text-muted)" },
      }, len + " / " + minChars + " characters minimum") : null);
  }

  function ChoiceGroup({ options, value, onChange }) {
    return E("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
      options.map(function (opt) {
        return E("button", {
          key: opt.value, type: "button",
          className: "pill" + (value === opt.value ? " is-active" : ""),
          onClick: function () { onChange(opt.value); },
          style: { border: "none", cursor: "pointer" },
        }, opt.label);
      }));
  }

  function ProgressBar({ step }) {
    var pct = step * 20;
    return E("div", { style: { marginBottom: 32 } },
      E("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "var(--text-muted)" } },
        E("span", null, "Step " + step + " of 5"),
        E("span", null, pct + "% complete")),
      E("div", { style: { height: 4, background: "var(--ink-08)", borderRadius: 2, overflow: "hidden" } },
        E("div", { style: { height: "100%", width: pct + "%", background: "var(--green)", borderRadius: 2, transition: "width 0.35s ease" } })));
  }

  // ── Main component ─────────────────────────────────────────────────────
  function ScreenContribute({ go }) {
    var universities = useMemo(function () {
      var data = window.UGCData || {};
      return (data.public || []).concat(data.private || []).concat(data.international || [])
        .map(function (u) { return u.name; }).filter(Boolean)
        .sort(function (a, b) { return a.localeCompare(b); });
    }, []);

    var subjects = useMemo(function () {
      var rows = (window.EduPathDB && window.EduPathDB.subjects)
        || window.DB_Subjects
        || (window.PFData && window.PFData.subjects) || [];
      return rows.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    }, []);

    var universitySet = useMemo(function () {
      return new Set(universities.map(function (u) { return u.toLowerCase(); }));
    }, [universities]);

    var [step, setStep] = useState(1);
    var [done, setDone] = useState(false);
    var [loading, setLoading] = useState(false);
    var [error, setError] = useState("");
    var [savedDraft, setSavedDraft] = useState(null);
    var [form, setForm] = useState(EMPTY_FORM);

    useEffect(function () {
      try {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed.undergradSubjectName || parsed.undergradUniversity) {
            setSavedDraft(parsed);
          }
        }
      } catch (e) {}
    }, []);

    useEffect(function () {
      try {
        if (form.undergradSubjectName || form.undergradUniversity) {
          localStorage.setItem(LS_KEY, JSON.stringify(form));
        }
      } catch (e) {}
    }, [form]);

    function set(key, value) {
      setForm(function (f) {
        var next = Object.assign({}, f, { [key]: value });
        if (key === "wouldChooseAgain") {
          if (value === "Yes") { next.chooseAgainReason = ""; next.notSureReason = ""; }
          if (value === "Not sure") next.chooseAgainReason = "";
          if (value === "No") next.notSureReason = "";
        }
        if (key === "currentStatus") {
          next.currentSituation = ""; next.timeToOpportunity = "";
        }
        if (key === "bcsPrep" && value !== "Yes") next.bcsStage = "";
        if (key === "currentSituation" && value !== "BCS / Government exam prep") next.bcsStage = "";
        return next;
      });
      setError("");
    }

    var inp = {
      width: "100%", padding: "12px 14px",
      border: "1.5px solid var(--ink-16)",
      borderRadius: "var(--r-input,8px)", background: "var(--surface)",
      color: "var(--text)", fontFamily: "inherit", fontSize: 14, boxSizing: "border-box",
    };
    var grid2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };

    // Derived
    var selectedSubject = subjects.find(function (s) {
      return s.name.toLowerCase() === form.undergradSubjectName.trim().toLowerCase();
    }) || subjects.find(function (s) { return s.slug === form.subjectSlug; });

    var subjectField   = (selectedSubject && selectedSubject.field) || "";
    var autoCategory   = FIELD_CATEGORY[subjectField] || "fallback";
    var category       = form.subjectCluster || autoCategory;
    var catScales      = CATEGORY_SCALES[category];
    var catScaleKeys   = catScales.map(function (s) { return s.key; });

    var isStudent      = form.currentStatus === "Still studying";
    var isRecentGrad   = form.currentStatus === "Graduated within the last 2 years";
    var isWorking      = form.currentStatus === "Working for 2 or more years";
    var recentGradWork = isRecentGrad && form.currentSituation === "Working";
    var showWorkFields = isWorking || recentGradWork;
    var isNonStudent   = !isStudent && form.currentStatus !== "";

    var uniReview  = Boolean(form.undergradUniversity.trim()) && !universitySet.has(form.undergradUniversity.trim().toLowerCase());
    var subjReview = Boolean(form.undergradSubjectName.trim()) && !selectedSubject;

    var showUniScales = form.subjectAttribution > 0 && form.subjectAttribution <= 2;

    // Small-cohort anonymity warning
    var pfTestimonials = (window.PFData && window.PFData.testimonials) || [];
    var subjSlugCount  = (selectedSubject && selectedSubject.slug) || "";
    var subjectCount   = subjSlugCount
      ? pfTestimonials.filter(function (t) { return (t.subjectSlug || t.undergradSubjectSlug) === subjSlugCount; }).length
      : 999;
    var showAnonWarn = step === 4 && form.session.trim() && form.currentCity.trim() && form.jobTitle.trim() && subjectCount < 10;

    // BCS
    var recentGradBcs = isRecentGrad && form.currentSituation === "BCS / Government exam prep";
    var showBcsStage  = recentGradBcs || (isWorking && form.bcsPrep === "Yes");

    // Step validation
    var s1Valid =
      form.undergradUniversity.trim() &&
      form.undergradSubjectName.trim() &&
      form.session.trim() &&
      form.hscGroup &&
      form.currentStatus;

    var s2Valid =
      form.subjectWorthRating > 0 && form.academicPressure > 0 &&
      form.facultyQuality > 0 && form.curriculumRelevance > 0 &&
      form.careerProspects > 0 && form.studentSupport > 0 &&
      form.wouldChooseAgain &&
      (form.wouldChooseAgain !== "No" || form.chooseAgainReason.trim()) &&
      form.subjectAttribution > 0 &&
      (!showUniScales || (form.uniAdministration > 0 && form.uniInfrastructure > 0 && form.uniCareerPlacement > 0));

    var s3Valid =
      catScaleKeys.every(function (k) { return form[k] > 0; }) &&
      form.confidenceRating > 0;

    var s4Valid =
      form.badExperience.trim().length >= MIN_CHARS &&
      form.whoShouldTake.trim().length >= MIN_CHARS &&
      form.whoShouldNotTake.trim().length >= MIN_CHARS &&
      form.oneThingToKnow.trim().length >= MIN_CHARS;

    var s5Valid =
      form.currentCountry.trim() &&
      (!isRecentGrad || form.currentSituation) &&
      (!showWorkFields || (form.profession && form.jobTitle.trim() && form.workRelevance > 0)) &&
      (isStudent || form.timeToOpportunity) &&
      form.consent;

    function goNext() {
      var ok = step === 1 ? s1Valid : step === 2 ? s2Valid : step === 3 ? s3Valid : step === 4 ? s4Valid : s5Valid;
      if (!ok) { setError("Please complete all required fields before continuing."); return; }
      setError("");
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function goBack() {
      setError("");
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function onSubmit(e) {
      e.preventDefault();
      if (!s5Valid) { setError("Please complete all required fields."); return; }
      setLoading(true);
      setError("");
      var slugFinal = (selectedSubject && selectedSubject.slug) || slugify(form.undergradSubjectName);
      var nameFinal = (selectedSubject && selectedSubject.name) || form.undergradSubjectName.trim();
      var payload = Object.assign({}, form, {
        schemaVersion: 2,
        undergradSubjectSlug: slugFinal,
        undergradSubjectName: nameFinal,
        subjectName: nameFinal,
        subjectSlug: slugFinal,
        university: form.undergradUniversity.trim(),
        subjectField: subjectField,
        reviewCategory: category,
        jobReality: form.careerProspects,
        designation: form.jobTitle,
        futureOpportunities: form.batchmatePaths,
        universityNeedsReview: uniReview,
        universityReviewName: uniReview ? form.undergradUniversity.trim() : "",
        subjectNeedsReview: subjReview,
        subjectReviewName: subjReview ? form.undergradSubjectName.trim() : "",
      });
      try {
        var res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          var json = await res.json().catch(function () { return {}; });
          throw new Error(json.error || "Submission failed.");
        }
        try { localStorage.removeItem(LS_KEY); } catch (e) {}
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err.message || "Submission failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    // ── Confirmation screen ────────────────────────────────────────────
    if (done) {
      return E("div", { style: { minHeight: "80vh", display: "grid", placeItems: "center", textAlign: "center", padding: "64px 24px" } },
        E("div", { style: { maxWidth: 560 } },
          E("div", { className: "micro", style: { marginBottom: 12 } }, "Received"),
          E("h1", { className: "display-2", style: { fontSize: 40, marginBottom: 14 } }, "Thank you."),
          E("p", { className: "lead", style: { marginBottom: 20 } },
            "Your anonymous experience has been saved. Once reviewed, it will appear in Real Stories and help improve subject recommendations."),
          E("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 } },
            "To request deletion of your response, email us at contact@edupathbd.com with the subject name and approximate date of submission. We will remove it within 7 days."),
          E("button", { className: "btn btn-primary", onClick: function () { go("landing"); } }, "Back to EduPath BD")));
    }

    // ── Resume banner ──────────────────────────────────────────────────
    var resumeBanner = savedDraft ? E("div", {
      style: {
        background: "var(--green,#3a7d44)", color: "#fff",
        padding: "14px 20px", borderRadius: 10, marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 16, fontSize: 14, flexWrap: "wrap",
      },
    },
      E("span", null, "You have an unfinished draft saved locally."),
      E("div", { style: { display: "flex", gap: 10, flexShrink: 0 } },
        E("button", {
          type: "button", className: "btn",
          style: { background: "#fff", color: "var(--green,#3a7d44)", fontSize: 13, padding: "6px 16px" },
          onClick: function () {
            setForm(Object.assign({}, EMPTY_FORM, savedDraft));
            setSavedDraft(null);
          },
        }, "Resume"),
        E("button", {
          type: "button",
          style: { background: "transparent", color: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", fontSize: 13 },
          onClick: function () {
            try { localStorage.removeItem(LS_KEY); } catch (e) {}
            setSavedDraft(null);
          },
        }, "Start fresh"))) : null;

    // ── Step content ───────────────────────────────────────────────────
    var content = null;

    if (step === 1) {
      content = E("div", null,
        E("h2", { style: { fontSize: 20, fontWeight: 800, marginBottom: 6 } }, "Your academic background"),
        E("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 } },
          "This connects your experience to the right subject and university page."),

        E(Field, {
          label: "Which university did you attend?", required: true,
          note: uniReview ? "Not in our database — will be saved as a suggestion for review." : "If not listed, type the full name.",
        },
          E("input", {
            list: "ep-uni-list", style: inp,
            value: form.undergradUniversity,
            onChange: function (e) { set("undergradUniversity", e.target.value); },
            placeholder: "Search or type your university name",
          }),
          E("datalist", { id: "ep-uni-list" },
            universities.map(function (u) { return E("option", { key: u, value: u }); }))),

        E("div", { style: grid2 },
          E(Field, {
            label: "Which subject or department?", required: true,
            note: subjReview ? "Not in our database — will be saved as a subject suggestion." : "e.g. CSE, Pharmacy, Law, English",
          },
            E("input", {
              list: "ep-subj-list", style: inp,
              value: form.undergradSubjectName,
              onChange: function (e) {
                var v = e.target.value;
                var match = subjects.find(function (s) { return s.name.toLowerCase() === v.trim().toLowerCase(); });
                setForm(function (f) {
                  var next = Object.assign({}, f, { undergradSubjectName: v, subjectSlug: (match && match.slug) || "" });
                  if (!f.subjectCluster && match) next.subjectCluster = FIELD_CATEGORY[match.field] || "";
                  return next;
                });
                setError("");
              },
              placeholder: "Search or type your subject",
            }),
            E("datalist", { id: "ep-subj-list" },
              subjects.map(function (s) { return E("option", { key: s.slug, value: s.name }); }))),

          E(Field, { label: "Batch / session", required: true },
            E("input", {
              style: inp, value: form.session,
              onChange: function (e) { set("session", e.target.value); },
              placeholder: "e.g. 2018–19, 2020–24",
            }))),

        E(Field, { label: "Subject cluster", note: "Auto-detected from your subject. Correct it if needed." },
          E("select", {
            style: Object.assign({}, inp, { cursor: "pointer" }),
            value: form.subjectCluster || autoCategory,
            onChange: function (e) { set("subjectCluster", e.target.value); },
          },
            CLUSTER_OPTIONS.map(function (o) { return E("option", { key: o.value, value: o.value }, o.label); }))),

        E(Field, { label: "Which HSC group were you from?", required: true },
          E(ChoiceGroup, {
            options: [
              { value: "science",   label: "Science" },
              { value: "commerce",  label: "Commerce" },
              { value: "arts",      label: "Humanities" },
            ],
            value: form.hscGroup, onChange: function (v) { set("hscGroup", v); },
          })),

        E(Field, { label: "What is your current status?", required: true },
          E(ChoiceGroup, {
            options: [
              { value: "Still studying",                     label: "Still studying" },
              { value: "Graduated within the last 2 years", label: "Graduated within last 2 years" },
              { value: "Working for 2 or more years",       label: "Working 2+ years" },
            ],
            value: form.currentStatus, onChange: function (v) { set("currentStatus", v); },
          })));
    }

    if (step === 2) {
      content = E("div", null,
        E("h2", { style: { fontSize: 20, fontWeight: 800, marginBottom: 6 } }, "The honest numbers"),
        E("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 } },
          "Six universal ratings that become comparison signals across all subjects in our database."),

        E(Scale, { label: "Overall worth of this subject for a well-matched student", value: form.subjectWorthRating, onChange: function (v) { set("subjectWorthRating", v); }, low: "1 = Not worth it", high: "5 = Strongly worth it" }),
        E(Scale, { label: "Academic pressure and workload", value: form.academicPressure, onChange: function (v) { set("academicPressure", v); }, low: "1 = Manageable, balanced", high: "5 = Constant pressure, very little breathing room" }),
        E(Scale, { label: "Faculty and teaching quality", value: form.facultyQuality, onChange: function (v) { set("facultyQuality", v); }, low: "1 = Weak or outdated", high: "5 = Genuinely learned, good teachers" }),
        E(Scale, { label: "Curriculum relevance to current practice and further study", value: form.curriculumRelevance, onChange: function (v) { set("curriculumRelevance", v); }, low: "1 = Mostly outdated or theoretical", high: "5 = Reflects what the field actually needs" }),
        E(Scale, { label: "Career prospects and job-market reality", value: form.careerProspects, onChange: function (v) { set("careerProspects", v); }, low: "1 = Hard to see or access relevant work", high: "5 = Clear, realistic pathways with strong demand" }),
        E(Scale, { label: "Student support and academic environment", value: form.studentSupport, onChange: function (v) { set("studentSupport", v); }, low: "1 = Very little support", high: "5 = Supportive environment" }),

        E(Field, { label: "Knowing what you know now, would you choose this subject again?", required: true },
          E(ChoiceGroup, {
            options: [
              { value: "Yes",      label: "Yes" },
              { value: "Not sure", label: "Not sure" },
              { value: "No",       label: "No" },
            ],
            value: form.wouldChooseAgain, onChange: function (v) { set("wouldChooseAgain", v); },
          })),

        form.wouldChooseAgain === "No"
          ? E(TextAreaField, {
              label: "What would you choose instead, and why was this a mismatch?", required: true,
              value: form.chooseAgainReason,
              onChange: function (e) { set("chooseAgainReason", e.target.value); },
              placeholder: "Wrong expectations, weak job market, not suited to your strengths — be specific",
            }) : null,

        form.wouldChooseAgain === "Not sure"
          ? E(TextAreaField, {
              label: "What is your main hesitation? (optional)",
              value: form.notSureReason,
              onChange: function (e) { set("notSureReason", e.target.value); },
              placeholder: "Mixed feelings, unclear career path, personal circumstances…",
            }) : null,

        E(Scale, {
          label: "How much of your experience was shaped by the subject itself versus the university environment?",
          value: form.subjectAttribution, onChange: function (v) { set("subjectAttribution", v); },
          low: "1 = Almost entirely the university", high: "5 = Almost entirely the subject",
        }),

        showUniScales ? E("div", {
          style: { marginTop: 8, padding: "16px 20px", background: "var(--ink-04,#f5f3ee)", borderRadius: 8, borderLeft: "3px solid var(--ink-16)" },
        },
          E("p", { style: { fontSize: 13, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 } },
            "Since the university environment shaped your experience significantly, please also rate:"),
          UNIVERSITY_SCALES.map(function (s) {
            return E(Scale, { key: s.key, label: s.label, value: form[s.key], onChange: function (v) { set(s.key, v); }, low: s.low, high: s.high });
          })) : null);
    }

    if (step === 3) {
      content = E("div", null,
        E("h2", { style: { fontSize: 20, fontWeight: 800, marginBottom: 6 } }, "What this subject is actually like"),
        E("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 } },
          "Questions tailored for " + CATEGORY_LABELS[category] + ". These only appear for your cluster."),

        catScales.map(function (s) {
          return E(Scale, { key: s.key, label: s.label, value: form[s.key], onChange: function (v) { set(s.key, v); }, low: s.low, high: s.high });
        }),

        E("div", { style: { marginTop: 8, padding: "16px 20px", background: "var(--ink-04,#f5f3ee)", borderRadius: 8 } },
          E(Scale, {
            label: "How well does your experience represent most students in this subject?",
            value: form.confidenceRating, onChange: function (v) { set("confidenceRating", v); },
            low: "1 = Very personal / may not apply to others",
            high: "5 = Fairly reflects most students in similar programs",
          })));
    }

    if (step === 4) {
      content = E("div", null,
        E("h2", { style: { fontSize: 20, fontWeight: 800, marginBottom: 6 } }, "Your story"),
        E("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 } },
          "Write like you are texting a junior who just asked for your honest opinion. Short and specific beats long and vague."),

        E("div", { style: { background: "var(--ink-04,#f5f3ee)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 } },
          "Do not include your name, your teachers’ names, or other identifying details. Reviews may be lightly edited to protect anonymity."),

        showAnonWarn ? E("div", { style: { background: "#FFF3CD", color: "#856404", border: "1px solid #FFECB5", borderRadius: 8, padding: "12px 14px", marginBottom: 20, fontSize: 13, lineHeight: 1.5 } },
          E("strong", null, "Anonymity note: "),
          "There are fewer than 10 responses for this subject. Your batch year, city, and job title together could make your identity traceable. Consider generalising one of those details.") : null,

        E(TextAreaField, {
          label: "What genuinely did not work?", required: true, minChars: MIN_CHARS,
          value: form.badExperience,
          onChange: function (e) { set("badExperience", e.target.value); },
          placeholder: "Outdated syllabus, session jam, weak labs, poor career support — be specific",
        }),
        E(TextAreaField, {
          label: "Take this subject if you…", required: true, minChars: MIN_CHARS,
          value: form.whoShouldTake,
          onChange: function (e) { set("whoShouldTake", e.target.value); },
          placeholder: "Describe the mindset or strengths of someone who would actually thrive here",
        }),
        E(TextAreaField, {
          label: "Think twice if you…", required: true, minChars: MIN_CHARS,
          value: form.whoShouldNotTake,
          onChange: function (e) { set("whoShouldNotTake", e.target.value); },
          placeholder: "Be honest about who this subject is a poor fit for",
        }),
        E(TextAreaField, {
          label: "One thing every junior should know before choosing this subject", required: true, minChars: MIN_CHARS,
          value: form.oneThingToKnow,
          onChange: function (e) { set("oneThingToKnow", e.target.value); },
          placeholder: "If a student messaged you right now — what would you tell them first?",
        }),
        E(TextAreaField, {
          label: "What genuinely worked for you? (optional)",
          value: form.goodExperience,
          onChange: function (e) { set("goodExperience", e.target.value); },
          placeholder: "A skill, a teacher, a project, a friendship — anything real that made it worth something",
        }),
        E(TextAreaField, {
          label: "What surprised you most after you started? (optional)",
          value: form.whatSurprised,
          onChange: function (e) { set("whatSurprised", e.target.value); },
          placeholder: "Something you did not expect — good or bad — that nobody told you before enrollment",
        }),
        E(TextAreaField, {
          label: "What paths did your batchmates actually take after graduating? (optional)",
          value: form.batchmatePaths,
          onChange: function (e) { set("batchmatePaths", e.target.value); },
          placeholder: "Jobs, higher studies, BCS, freelancing, abroad, career switches — what really happened",
        }));
    }

    if (step === 5) {
      content = E("div", null,
        E("h2", { style: { fontSize: 20, fontWeight: 800, marginBottom: 6 } }, "Where are you now"),
        E("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 } },
          "Helps students see real outcomes from real people."),

        E("div", { style: grid2 },
          E(Field, { label: "Current city (optional)" },
            E("input", { style: inp, value: form.currentCity, onChange: function (e) { set("currentCity", e.target.value); }, placeholder: "Dhaka, Sylhet, Toronto, Dubai" })),
          E(Field, { label: "Current country", required: true },
            E("input", { style: inp, value: form.currentCountry, onChange: function (e) { set("currentCountry", e.target.value); }, placeholder: "Bangladesh, Canada, UAE" }))),

        isRecentGrad ? E(Field, { label: "What is your current situation?", required: true },
          E(ChoiceGroup, { options: SITUATION_OPTIONS, value: form.currentSituation, onChange: function (v) { set("currentSituation", v); } })) : null,

        showWorkFields ? E("div", null,
          E("div", { style: grid2 },
            E(Field, { label: "What field are you working in?", required: true },
              E("select", {
                style: Object.assign({}, inp, { cursor: "pointer" }),
                value: form.profession,
                onChange: function (e) { set("profession", e.target.value); },
              },
                E("option", { value: "" }, "Select a field…"),
                PROFESSION_OPTIONS.map(function (o) { return E("option", { key: o, value: o }, o); }))),
            E(Field, { label: "Your current job title", required: true },
              E("input", { style: inp, value: form.jobTitle, onChange: function (e) { set("jobTitle", e.target.value); }, placeholder: "Junior Developer, Executive, Lecturer, Freelancer" }))),
          E(Scale, { label: "How related is your current work to your undergraduate subject?", value: form.workRelevance, onChange: function (v) { set("workRelevance", v); }, low: "1 = Not related at all", high: "5 = Directly related" }),
          E(Scale, { label: "Financial return compared to your expectations when you enrolled (optional)", value: form.financialReturn, onChange: function (v) { set("financialReturn", v); }, low: "1 = Much less than expected", high: "5 = Better than expected", required: false })) : null,

        isWorking ? E("div", null,
          E(Field, { label: "Are you preparing for BCS or any government competitive exam?" },
            E(ChoiceGroup, {
              options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }],
              value: form.bcsPrep, onChange: function (v) { set("bcsPrep", v); },
            }))) : null,

        showBcsStage ? E(Field, { label: "At what stage?" },
          E(ChoiceGroup, {
            options: BCS_STAGES.map(function (o) { return { value: o, label: o }; }),
            value: form.bcsStage, onChange: function (v) { set("bcsStage", v); },
          })) : null,

        isNonStudent ? E(Field, { label: "How long did it take to find your first relevant opportunity?", required: true },
          E(ChoiceGroup, {
            options: TIME_OPTIONS.map(function (o) { return { value: o, label: o }; }),
            value: form.timeToOpportunity, onChange: function (v) { set("timeToOpportunity", v); },
          })) : null,

        E("div", { style: { borderTop: "1px solid var(--ink-08)", paddingTop: 24, marginTop: 28 } },
          E("label", { style: { display: "flex", gap: 12, alignItems: "flex-start", lineHeight: 1.6, fontSize: 14 } },
            E("input", { type: "checkbox", checked: form.consent, onChange: function (e) { set("consent", e.target.checked); }, style: { marginTop: 4, accentColor: "var(--green)" } }),
            E("span", null, "I agree to let EduPath BD publish this review anonymously to help future students. EduPath BD does not collect my name or contact information, and nothing identifying will ever be shared."))));
    }

    // ── Shell ──────────────────────────────────────────────────────────
    return E("div", { style: { padding: "88px 24px 80px" } },
      E("div", { style: { maxWidth: 760, margin: "0 auto" } },
        E("div", { className: "micro", style: { marginBottom: 10 } }, "Share your experience"),
        E("h1", { className: "display-1", style: { fontSize: 46, lineHeight: 1.04, marginBottom: 18, maxWidth: 760 } },
          E("span", { style: { display: "block" } }, "Your 4 minutes can save someone’s"),
          E("span", { style: { display: "block" } }, "4 wrong years.")),
        E("p", { className: "lead", style: { marginBottom: 10 } },
          "Help the next HSC batch choose with their eyes open. Tell them what studying this subject actually felt like — not the brochure version."),
        E("p", { style: { color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, fontStyle: "italic" } },
          "No name. No contact information. Only anonymous quotes and aggregated numbers are ever published."),

        resumeBanner,
        E(ProgressBar, { step }),

        E("form", { onSubmit: step === 5 ? onSubmit : function (e) { e.preventDefault(); goNext(); } },
          content,

          error ? E("div", { style: { background: "#FDECEA", color: "#922820", padding: "12px 14px", borderRadius: 8, marginTop: 18, fontSize: 14 } }, error) : null,

          E("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 28, flexWrap: "wrap" } },
            step > 1
              ? E("button", { type: "button", className: "btn", onClick: goBack }, "← Back")
              : E("button", { type: "button", className: "pf-link", onClick: function () { go("landing"); } }, "Cancel"),
            step < 5
              ? E("button", { type: "button", className: "btn btn-primary", onClick: goNext }, "Next →")
              : E("button", { type: "submit", className: "btn btn-primary", disabled: loading || !s5Valid },
                  loading ? "Submitting…" : "Share my experience")))));
  }

  Object.assign(window, { ScreenContribute });
})();
