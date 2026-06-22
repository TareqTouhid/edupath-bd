(function () {
  const { useMemo, useState } = React;
  const E = React.createElement;

  function Field({ label, children, required, note }) {
    return E("label", { style: { display: "block", marginBottom: 18 } },
      E("span", { style: { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 } },
        label, required ? E("span", { style: { color: "#C8553D" } }, " *") : null),
      children,
      note ? E("span", { style: { display: "block", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 6 } }, note) : null);
  }

  function Section({ title, note, children }) {
    return E("section", { style: { borderTop: "1px solid var(--ink-08)", paddingTop: 24, marginTop: 28 } },
      E("div", { style: { marginBottom: 18 } },
        E("h2", { style: { fontSize: 18, fontWeight: 800, marginBottom: 4 } }, title),
        note ? E("p", { style: { fontSize: 13, color: "var(--text-muted)", margin: 0 } }, note) : null),
      children);
  }

  function Scale({ label, value, onChange, low, high, required }) {
    return E(Field, { label, required: required !== false },
      E("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 } },
        [1, 2, 3, 4, 5].map(function (n) {
          return E("button", {
            key: n,
            type: "button",
            onClick: function () { onChange(n); },
            style: {
              minHeight: 42,
              borderRadius: 8,
              border: "1.5px solid " + (value === n ? "var(--green)" : "var(--ink-16)"),
              background: value === n ? "var(--green)" : "var(--surface)",
              color: value === n ? "#fff" : "var(--text)",
              fontWeight: 800,
              cursor: "pointer"
            }
          }, n);
        })),
      E("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" } },
        E("span", null, low),
        E("span", null, high)));
  }

  function TextArea({ input, value, onChange, placeholder, rows }) {
    return E("textarea", {
      rows: rows || 3,
      style: Object.assign({}, input, { resize: "vertical", minHeight: 80 }),
      value,
      onChange,
      placeholder
    });
  }

  function ChoiceGroup({ options, value, onChange }) {
    return E("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
      options.map(function (opt) {
        return E("button", {
          key: opt.value,
          type: "button",
          className: "pill" + (value === opt.value ? " is-active" : ""),
          onClick: function () { onChange(opt.value); },
          style: { border: "none", cursor: "pointer" }
        }, opt.label);
      }));
  }

  function slugify(v) {
    return String(v || "").trim().toLowerCase()
      .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "").slice(0, 80) || "unknown-subject";
  }

  // Maps PFData subject field → question category
  var FIELD_CATEGORY = {
    technology:      "engineering",
    business:        "business",
    "social-science":"humanities",
    humanities:      "humanities",
    science:         "health",
    environmental:   "health",
    applied:         "health",
  };

  // 4 scales per category, 3 for fallback
  var CATEGORY_SCALES = {
    engineering: [
      { key: "mathIntensity",    label: "Math intensity",                      low: "1 = Almost none",               high: "5 = Central to everything" },
      { key: "codingIntensity",  label: "Coding and technical depth",           low: "1 = Minimal",                   high: "5 = Core of the degree" },
      { key: "labIntensity",     label: "Lab, project, and hands-on work",      low: "1 = Mostly theory",             high: "5 = Frequent practical work" },
      { key: "selfLearning",     label: "How much must you learn on your own",  low: "1 = University teaching is enough", high: "5 = Self-study is essential to survive" },
    ],
    business: [
      { key: "analyticalIntensity",   label: "Working with numbers and analysis",        low: "1 = Minimal",           high: "5 = Central to the degree" },
      { key: "communicationIntensity",label: "Communication, presentation, and teamwork", low: "1 = Rarely required",   high: "5 = Essential for performance" },
      { key: "networkingImportance",  label: "Importance of internship and networking",   low: "1 = Low impact",        high: "5 = Very important for getting opportunities" },
      { key: "industryPractical",     label: "Practical industry relevance",              low: "1 = Mostly theoretical", high: "5 = Strong real-world application" },
    ],
    humanities: [
      { key: "readingIntensity",    label: "Reading intensity",                         low: "1 = Light",           high: "5 = Very heavy reading load" },
      { key: "writingIntensity",    label: "Writing and argumentation",                  low: "1 = Rarely tested",   high: "5 = Central to success" },
      { key: "researchIntensity",   label: "Research, fieldwork, or policy work",        low: "1 = Rarely involved", high: "5 = A major part of the degree" },
      { key: "publicCommunication", label: "Public communication and presentation",      low: "1 = Not important",   high: "5 = Very important" },
    ],
    health: [
      { key: "labPractical",     label: "Lab and practical work",                       low: "1 = Mostly theory",  high: "5 = Frequent hands-on work" },
      { key: "memorization",     label: "Memorization requirement",                     low: "1 = Low",            high: "5 = Very high" },
      { key: "scienceIntensity", label: "Biology, chemistry, or science intensity",     low: "1 = Minimal",        high: "5 = Central to everything" },
      { key: "clinicalExposure", label: "Research, clinical, or field exposure",        low: "1 = Limited",        high: "5 = Strong exposure" },
    ],
    fallback: [
      { key: "practicalIntensity",    label: "Practical or hands-on work intensity",     low: "1 = Mostly conceptual or theoretical", high: "5 = Frequent practical, studio, or applied work" },
      { key: "readingWritingResearch",label: "Reading, writing, or research intensity",  low: "1 = Light",                            high: "5 = Very heavy" },
      { key: "independentLearning",   label: "How much must you learn on your own",      low: "1 = University support is enough",     high: "5 = Self-study is essential" },
    ],
  };

  var CATEGORY_LABELS = {
    engineering: "Computing, Engineering & Technology",
    business:    "Business, Finance & Economics",
    humanities:  "Humanities, Law, Social Science & Journalism",
    health:      "Pharmacy, Life Sciences, Health & Agriculture",
    fallback:    "Your Subject",
  };

  var PROFESSION_OPTIONS = [
    "Software / IT", "Banking and Finance", "Teaching and Academia",
    "Healthcare", "Government and Public Service", "Development sector (NGO / INGO)",
    "Business and Entrepreneurship", "Creative sector", "Research and Further Studies", "Other"
  ];

  var SITUATION_OPTIONS = [
    { value: "Working",         label: "Working" },
    { value: "Higher studies",  label: "Higher studies" },
    { value: "Job-seeking",     label: "Job-seeking" },
    { value: "Other",           label: "Other" },
  ];

  var TIME_OPTIONS = [
    "Before graduation", "Within 6 months", "6 to 12 months",
    "More than 1 year", "Still seeking"
  ];

  function ScreenContribute({ go }) {
    var universities = useMemo(function () {
      var data = window.UGCData || {};
      return (data.public || []).concat(data.private || []).concat(data.international || [])
        .map(function (u) { return u.name; })
        .filter(Boolean)
        .sort(function (a, b) { return a.localeCompare(b); });
    }, []);

    var subjects = useMemo(function () {
      var rows = (window.EduPathDB && window.EduPathDB.subjects) || window.DB_Subjects || (window.PFData && window.PFData.subjects) || [];
      return rows.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    }, []);

    var universitySet = useMemo(function () {
      return new Set(universities.map(function (u) { return u.toLowerCase(); }));
    }, [universities]);

    var [done, setDone] = useState(false);
    var [loading, setLoading] = useState(false);
    var [error, setError] = useState("");
    var [form, setForm] = useState({
      // Background
      undergradUniversity: "",
      undergradSubjectName: "",
      subjectSlug: "",
      session: "",
      hscGroup: "",
      currentStatus: "",
      currentCity: "",
      currentCountry: "",

      // Universal scales
      subjectWorthRating: 0,
      academicPressure: 0,
      facultyQuality: 0,
      curriculumRelevance: 0,
      careerProspects: 0,

      // Binary outcome
      wouldChooseAgain: "",
      chooseAgainReason: "",

      // Category-specific — engineering
      mathIntensity: 0,
      codingIntensity: 0,
      labIntensity: 0,
      selfLearning: 0,
      // business
      analyticalIntensity: 0,
      communicationIntensity: 0,
      networkingImportance: 0,
      industryPractical: 0,
      // humanities
      readingIntensity: 0,
      writingIntensity: 0,
      researchIntensity: 0,
      publicCommunication: 0,
      // health
      labPractical: 0,
      memorization: 0,
      scienceIntensity: 0,
      clinicalExposure: 0,
      // fallback
      practicalIntensity: 0,
      readingWritingResearch: 0,
      independentLearning: 0,

      // Story
      goodExperience: "",
      badExperience: "",
      whoShouldTake: "",
      whoShouldNotTake: "",
      oneThingToKnow: "",
      whatSurprised: "",
      batchmatePaths: "",

      // Outcome (conditional)
      currentSituation: "",
      profession: "",
      jobTitle: "",
      workRelevance: 0,
      timeToOpportunity: "",

      consent: false,
    });

    function set(key, value) {
      setForm(function (f) {
        var next = Object.assign({}, f, { [key]: value });
        if (key === "wouldChooseAgain" && value === "Yes") next.chooseAgainReason = "";
        if (key === "currentStatus") {
          next.currentSituation = "";
          next.profession = "";
          next.jobTitle = "";
          next.workRelevance = 0;
          next.timeToOpportunity = "";
        }
        return next;
      });
      setError("");
    }

    var input = {
      width: "100%",
      padding: "12px 14px",
      border: "1.5px solid var(--ink-16)",
      borderRadius: "var(--r-input)",
      background: "var(--surface)",
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 14,
      boxSizing: "border-box"
    };

    var compactGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };

    // Derive selected subject and category
    var selectedSubject = subjects.find(function (s) {
      return s.name.toLowerCase() === form.undergradSubjectName.trim().toLowerCase();
    }) || subjects.find(function (s) { return s.slug === form.subjectSlug; });

    var subjectField = (selectedSubject && selectedSubject.field) || "";
    var category = FIELD_CATEGORY[subjectField] || "fallback";
    var categoryScales = CATEGORY_SCALES[category];
    var categoryScaleKeys = categoryScales.map(function (s) { return s.key; });
    var categoryScalesComplete = form.undergradSubjectName.trim()
      ? categoryScaleKeys.every(function (k) { return form[k] > 0; })
      : true;

    // Status flags
    var isStudent    = form.currentStatus === "Still studying";
    var isRecentGrad = form.currentStatus === "Graduated within the last 2 years";
    var isWorking    = form.currentStatus === "Working for 2 or more years";
    var recentGradWorking = isRecentGrad && form.currentSituation === "Working";
    var showWorkFields    = isWorking || recentGradWorking;
    var showOutcomeSection = !isStudent && form.currentStatus !== "";

    var universityNeedsReview = Boolean(form.undergradUniversity.trim()) && !universitySet.has(form.undergradUniversity.trim().toLowerCase());
    var subjectNeedsReview = Boolean(form.undergradSubjectName.trim()) && !selectedSubject;

    // Outcome required logic
    var outcomeOk =
      !showOutcomeSection ||
      (
        (!isRecentGrad || form.currentSituation) &&
        (!showWorkFields || (form.profession && form.jobTitle.trim() && form.workRelevance > 0)) &&
        form.timeToOpportunity
      );

    var canSubmit =
      form.currentCountry.trim() &&
      form.currentStatus &&
      form.undergradUniversity.trim() &&
      form.undergradSubjectName.trim() &&
      form.hscGroup &&
      form.session.trim() &&
      form.subjectWorthRating > 0 &&
      form.academicPressure > 0 &&
      form.facultyQuality > 0 &&
      form.curriculumRelevance > 0 &&
      form.careerProspects > 0 &&
      categoryScalesComplete &&
      form.wouldChooseAgain &&
      (form.wouldChooseAgain !== "No" || form.chooseAgainReason.trim()) &&
      form.badExperience.trim() &&
      form.whoShouldTake.trim() &&
      form.whoShouldNotTake.trim() &&
      form.oneThingToKnow.trim() &&
      outcomeOk &&
      form.consent;

    async function onSubmit(e) {
      e.preventDefault();
      if (!canSubmit) { setError("Please complete all required fields."); return; }
      setLoading(true);
      setError("");
      var payload = Object.assign({}, form, {
        undergradSubjectSlug: (selectedSubject && selectedSubject.slug) || slugify(form.undergradSubjectName),
        undergradSubjectName: (selectedSubject && selectedSubject.name) || form.undergradSubjectName.trim(),
        subjectName:          (selectedSubject && selectedSubject.name) || form.undergradSubjectName.trim(),
        subjectSlug:          (selectedSubject && selectedSubject.slug) || slugify(form.undergradSubjectName),
        university:           form.undergradUniversity.trim(),
        subjectField:         subjectField,
        reviewCategory:       category,
        // backward compat alias
        jobReality:           form.careerProspects,
        designation:          form.jobTitle,
        profession:           form.profession,
        jobTitle:             form.jobTitle,
        futureOpportunities:  form.batchmatePaths,
        universityNeedsReview,
        universityReviewName: universityNeedsReview ? form.undergradUniversity.trim() : "",
        subjectNeedsReview,
        subjectReviewName:    subjectNeedsReview ? form.undergradSubjectName.trim() : "",
      });
      try {
        var res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          var json = await res.json().catch(function () { return {}; });
          throw new Error(json.error || "Submission failed.");
        }
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err.message || "Submission failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (done) {
      return E("div", { style: { minHeight: "80vh", display: "grid", placeItems: "center", textAlign: "center", padding: "64px 24px" } },
        E("div", { style: { maxWidth: 560 } },
          E("div", { className: "micro", style: { marginBottom: 12 } }, "Received"),
          E("h1", { className: "display-2", style: { fontSize: 40, marginBottom: 14 } }, "Thank you."),
          E("p", { className: "lead", style: { marginBottom: 28 } }, "Your anonymous experience has been saved. Once reviewed, it will improve Real Stories, subject pages, and the recommendation system."),
          E("button", { className: "btn btn-primary", onClick: function () { go("landing"); } }, "Back to EduPath BD")));
    }

    return E("div", { style: { padding: "88px 24px 80px" } },
      E("div", { style: { maxWidth: 760, margin: "0 auto" } },
        E("div", { className: "micro", style: { marginBottom: 10 } }, "Share your experience"),
        E("h1", { className: "display-1", style: { fontSize: 46, lineHeight: 1.04, marginBottom: 18, maxWidth: 760 } },
          E("span", { style: { display: "block" } }, "Your 4 minutes can save someone's"),
          E("span", { style: { display: "block" } }, "4 wrong years.")),
        E("p", { className: "lead", style: { marginBottom: 10 } },
          "Help the next HSC batch choose with their eyes open. Tell them what studying this subject actually felt like — not the brochure version."),
        E("p", { style: { color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, fontStyle: "italic" } },
          "No name. No contact information. Only anonymous quotes and aggregated numbers are ever published."),

        E("form", { onSubmit },

          // ── SECTION 1: ACADEMIC BACKGROUND ─────────────────────────────
          E(Section, { title: "Your academic background", note: "This connects your experience to the right subject and university page." },
            E(Field, {
              label: "Which university did you attend?",
              required: true,
              note: universityNeedsReview ? "This university is not in our database. It will be saved as a suggestion for review." : "If not listed, type the full name."
            },
              E("input", {
                list: "edupath-university-list",
                style: input,
                value: form.undergradUniversity,
                onChange: function (e) { set("undergradUniversity", e.target.value); },
                placeholder: "Search or type your university name"
              }),
              E("datalist", { id: "edupath-university-list" },
                universities.map(function (u) { return E("option", { key: u, value: u }); }))),

            E("div", { style: compactGrid },
              E(Field, {
                label: "Which subject or department?",
                required: true,
                note: subjectNeedsReview ? "Not in our database — will be saved as a subject suggestion." : "For example: CSE, Pharmacy, Law, English"
              },
                E("input", {
                  list: "edupath-subject-list",
                  style: input,
                  value: form.undergradSubjectName,
                  onChange: function (e) {
                    var value = e.target.value;
                    var match = subjects.find(function (s) { return s.name.toLowerCase() === value.trim().toLowerCase(); });
                    setForm(function (f) { return Object.assign({}, f, { undergradSubjectName: value, subjectSlug: (match && match.slug) || "" }); });
                    setError("");
                  },
                  placeholder: "Search or type your subject"
                }),
                E("datalist", { id: "edupath-subject-list" },
                  subjects.map(function (s) { return E("option", { key: s.slug, value: s.name }); }))),

              E(Field, { label: "Batch / session", required: true },
                E("input", { style: input, value: form.session, onChange: function (e) { set("session", e.target.value); }, placeholder: "e.g. 2018–19, 2020–24" }))),

            E(Field, { label: "Which HSC group were you from?", required: true },
              E(ChoiceGroup, {
                options: [{ value: "science", label: "Science" }, { value: "commerce", label: "Commerce" }, { value: "arts", label: "Humanities" }],
                value: form.hscGroup,
                onChange: function (v) { set("hscGroup", v); }
              })),

            E(Field, { label: "What is your current status?", required: true },
              E(ChoiceGroup, {
                options: [
                  { value: "Still studying",                       label: "Still studying" },
                  { value: "Graduated within the last 2 years",   label: "Graduated within last 2 years" },
                  { value: "Working for 2 or more years",         label: "Working 2+ years" },
                ],
                value: form.currentStatus,
                onChange: function (v) { set("currentStatus", v); }
              }))),

          // ── SECTION 2: THE HONEST NUMBERS ──────────────────────────────
          E(Section, { title: "The honest numbers", note: "Five universal ratings plus four specific to your subject. These become the comparison signal across subjects." },

            E(Scale, { label: "Overall worth of this subject for a well-matched student", value: form.subjectWorthRating, onChange: function (v) { set("subjectWorthRating", v); }, low: "1 = Not worth it", high: "5 = Strongly worth it" }),
            E(Scale, { label: "Academic pressure and workload", value: form.academicPressure, onChange: function (v) { set("academicPressure", v); }, low: "1 = Manageable, balanced", high: "5 = Constant pressure, very little breathing room" }),
            E(Scale, { label: "Faculty and teaching quality", value: form.facultyQuality, onChange: function (v) { set("facultyQuality", v); }, low: "1 = Weak or outdated", high: "5 = Genuinely learned, good teachers" }),
            E(Scale, { label: "Curriculum relevance to current practice and further study", value: form.curriculumRelevance, onChange: function (v) { set("curriculumRelevance", v); }, low: "1 = Mostly outdated or theoretical", high: "5 = Reflects what the field actually needs" }),
            E(Scale, { label: "Career prospects and job-market reality", value: form.careerProspects, onChange: function (v) { set("careerProspects", v); }, low: "1 = Hard to see or access relevant work", high: "5 = Clear, realistic pathways with strong demand" }),

            E(Field, { label: "Knowing what you know now, would you choose this subject again?", required: true },
              E(ChoiceGroup, {
                options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }],
                value: form.wouldChooseAgain,
                onChange: function (v) { set("wouldChooseAgain", v); }
              })),

            form.wouldChooseAgain === "No"
              ? E(Field, { label: "What would you choose instead, and why was this a mismatch?", required: true },
                  E(TextArea, { input, value: form.chooseAgainReason, onChange: function (e) { set("chooseAgainReason", e.target.value); }, placeholder: "Wrong expectations, weak job market, not suited to your strengths — be specific" }))
              : null),

          // ── SECTION 3: SUBJECT-SPECIFIC ─────────────────────────────────
          form.undergradSubjectName.trim()
            ? E(Section, {
                title: "What this subject is actually like",
                note: "Questions for " + CATEGORY_LABELS[category] + ". Shown based on your selected subject."
              },
                categoryScales.map(function (s) {
                  return E(Scale, {
                    key: s.key,
                    label: s.label,
                    value: form[s.key],
                    onChange: function (v) { set(s.key, v); },
                    low: s.low,
                    high: s.high
                  });
                }))
            : null,

          // ── SECTION 4: YOUR STORY ────────────────────────────────────────
          E(Section, { title: "Your story", note: "Write like you are texting a junior who just asked for your honest opinion. Short and specific beats long and vague." },
            E("div", { style: { background: "var(--ink-04,#f5f3ee)", borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 } },
              "Do not include your name, your teachers' names, or other details that could identify you. Reviews may be edited to protect anonymity."),

            E(Field, { label: "What genuinely did not work?", required: true },
              E(TextArea, { input, value: form.badExperience, onChange: function (e) { set("badExperience", e.target.value); }, placeholder: "Outdated syllabus, session jam, weak labs, poor career support — be specific" })),

            E(Field, { label: "Take this subject if you…", required: true },
              E(TextArea, { input, value: form.whoShouldTake, onChange: function (e) { set("whoShouldTake", e.target.value); }, placeholder: "Describe the mindset or strengths of someone who would actually thrive here" })),

            E(Field, { label: "Think twice if you…", required: true },
              E(TextArea, { input, value: form.whoShouldNotTake, onChange: function (e) { set("whoShouldNotTake", e.target.value); }, placeholder: "Be honest about who this subject is a poor fit for" })),

            E(Field, { label: "One thing every junior should know before choosing this subject", required: true },
              E(TextArea, { input, value: form.oneThingToKnow, onChange: function (e) { set("oneThingToKnow", e.target.value); }, placeholder: "If a student messaged you right now asking \"should I take this?\" — what would you tell them first?" })),

            E(Field, { label: "What genuinely worked for you?" },
              E(TextArea, { input, value: form.goodExperience, onChange: function (e) { set("goodExperience", e.target.value); }, placeholder: "A skill, a teacher, a project, a friendship — anything real that made it worth something" })),

            E(Field, { label: "What surprised you most after you started?" },
              E(TextArea, { input, value: form.whatSurprised, onChange: function (e) { set("whatSurprised", e.target.value); }, placeholder: "Something you did not expect — good or bad — that nobody told you before enrollment" })),

            E(Field, { label: "What paths did your batchmates actually take after graduating?" },
              E(TextArea, { input, value: form.batchmatePaths, onChange: function (e) { set("batchmatePaths", e.target.value); }, placeholder: "Jobs, higher studies, BCS, freelancing, abroad, career switches — what really happened" }))),

          // ── SECTION 5: WHERE ARE YOU NOW ────────────────────────────────
          E(Section, { title: "Where are you now", note: "Helps students see real outcomes from real people." },
            E("div", { style: compactGrid },
              E(Field, { label: "Current city" },
                E("input", { style: input, value: form.currentCity, onChange: function (e) { set("currentCity", e.target.value); }, placeholder: "Dhaka, Sylhet, Toronto, Dubai" })),
              E(Field, { label: "Current country", required: true },
                E("input", { style: input, value: form.currentCountry, onChange: function (e) { set("currentCountry", e.target.value); }, placeholder: "Bangladesh, Canada, UAE" }))),

            // Graduated or working: current situation
            isRecentGrad
              ? E(Field, { label: "What is your current situation?", required: true },
                  E(ChoiceGroup, {
                    options: SITUATION_OPTIONS,
                    value: form.currentSituation,
                    onChange: function (v) { set("currentSituation", v); }
                  }))
              : null,

            // Working fields (2+ years, or recent grad who is working)
            showWorkFields
              ? E("div", null,
                  E("div", { style: compactGrid },
                    E(Field, { label: "What field are you working in?", required: true },
                      E("select", {
                        style: Object.assign({}, input, { cursor: "pointer" }),
                        value: form.profession,
                        onChange: function (e) { set("profession", e.target.value); }
                      },
                        E("option", { value: "" }, "Select a field…"),
                        PROFESSION_OPTIONS.map(function (o) { return E("option", { key: o, value: o }, o); }))),
                    E(Field, { label: "Your current job title", required: true },
                      E("input", { style: input, value: form.jobTitle, onChange: function (e) { set("jobTitle", e.target.value); }, placeholder: "Junior Developer, Executive, Lecturer, Freelancer" }))),
                  E(Scale, { label: "How related is your current work to your undergraduate subject?", value: form.workRelevance, onChange: function (v) { set("workRelevance", v); }, low: "1 = Not related at all", high: "5 = Directly related" }))
              : null,

            // Time to opportunity (all non-students)
            showOutcomeSection
              ? E(Field, { label: "How long did it take to find your first relevant opportunity?", required: true },
                  E(ChoiceGroup, {
                    options: TIME_OPTIONS.map(function (o) { return { value: o, label: o }; }),
                    value: form.timeToOpportunity,
                    onChange: function (v) { set("timeToOpportunity", v); }
                  }))
              : null),

          // ── CONSENT + SUBMIT ─────────────────────────────────────────────
          E("section", { style: { borderTop: "1px solid var(--ink-08)", paddingTop: 24, marginTop: 28 } },
            E("label", { style: { display: "flex", gap: 12, alignItems: "flex-start", lineHeight: 1.6, fontSize: 14 } },
              E("input", { type: "checkbox", checked: form.consent, onChange: function (e) { set("consent", e.target.checked); }, style: { marginTop: 4, accentColor: "var(--green)" } }),
              E("span", null, "I agree to let EduPath BD publish this review anonymously to help future students. EduPath BD does not collect my name or contact information, and nothing identifying will ever be shared."))),

          error ? E("div", { style: { background: "#FDECEA", color: "#922820", padding: "12px 14px", borderRadius: 8, marginTop: 18, fontSize: 14 } }, error) : null,

          E("div", { style: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, flexWrap: "wrap" } },
            E("button", { type: "button", className: "pf-link", onClick: function () { go("landing"); } }, "Cancel"),
            E("button", { type: "submit", className: "btn btn-primary", disabled: loading || !canSubmit }, loading ? "Submitting…" : "Share my experience")))));
  }

  Object.assign(window, { ScreenContribute });
})();
