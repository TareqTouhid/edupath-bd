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

  function Scale({ label, value, onChange, low, high }) {
    return E(Field, { label, required: true },
      E("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 } },
        [1, 2, 3, 4, 5].map(n => E("button", {
          key: n,
          type: "button",
          onClick: () => onChange(n),
          style: {
            minHeight: 42,
            borderRadius: 8,
            border: "1.5px solid " + (value === n ? "var(--green)" : "var(--ink-16)"),
            background: value === n ? "var(--green)" : "var(--surface)",
            color: value === n ? "#fff" : "var(--text)",
            fontWeight: 800,
            cursor: "pointer"
          }
        }, n))),
      E("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" } },
        E("span", null, low),
        E("span", null, high)));
  }

  function TextArea({ input, value, onChange, placeholder }) {
    return E("textarea", {
      rows: 4,
      style: Object.assign({}, input, { resize: "vertical", minHeight: 92 }),
      value,
      onChange,
      placeholder
    });
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "unknown-subject";
  }

  function ScreenContribute({ go }) {
    const universities = useMemo(() => {
      const data = window.UGCData || {};
      return ((data.public || []).concat(data.private || []).concat(data.international || []))
        .map(u => u.name)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    }, []);
    const subjects = useMemo(() => {
      const rows = window.EduPathDB?.subjects || window.DB_Subjects || window.PFData?.subjects || [];
      return rows.slice().sort((a, b) => a.name.localeCompare(b.name));
    }, []);
    const universitySet = useMemo(() => new Set(universities.map(u => u.toLowerCase())), [universities]);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
      currentCity: "",
      currentCountry: "",
      currentStatus: "",
      designation: "",
      jobPlaceName: "",
      undergradUniversity: "",
      undergradSubjectName: "",
      subjectSlug: "",
      hscGroup: "",
      session: "",
      academicPressure: 0,
      facultyQuality: 0,
      jobReality: 0,
      subjectWorthRating: 0,
      wouldChooseAgain: "",
      chooseAgainReason: "",
      goodExperience: "",
      badExperience: "",
      whoShouldTake: "",
      whoShouldNotTake: "",
      futureOpportunities: "",
      consent: false
    });
    const set = (key, value) => {
      setForm(f => {
        const next = Object.assign({}, f, { [key]: value });
        if (key === "wouldChooseAgain" && value === "Yes") next.chooseAgainReason = "";
        return next;
      });
      setError("");
    };
    const input = {
      width: "100%",
      padding: "12px 42px 12px 14px",
      border: "1.5px solid var(--ink-16)",
      borderRadius: "var(--r-input)",
      background: "var(--surface)",
      color: "var(--text)",
      fontFamily: "inherit",
      fontSize: 14,
      boxSizing: "border-box"
    };
    const compactGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 };
    const statusOptions = ["Still studying", "Finished within last 2 years", "Working (2+ years)"];
    const selectedSubject = subjects.find(s => s.name.toLowerCase() === form.undergradSubjectName.trim().toLowerCase()) || subjects.find(s => s.slug === form.subjectSlug);
    const universityNeedsReview = Boolean(form.undergradUniversity.trim()) && !universitySet.has(form.undergradUniversity.trim().toLowerCase());
    const subjectNeedsReview = Boolean(form.undergradSubjectName.trim()) && !selectedSubject;
    const canSubmit =
      form.currentCity.trim() &&
      form.currentCountry.trim() &&
      form.currentStatus &&
      form.designation.trim() &&
      form.undergradUniversity.trim() &&
      form.undergradSubjectName.trim() &&
      form.hscGroup &&
      form.session.trim() &&
      form.academicPressure &&
      form.facultyQuality &&
      form.jobReality &&
      form.subjectWorthRating &&
      form.wouldChooseAgain &&
      (form.wouldChooseAgain !== "No" || form.chooseAgainReason.trim()) &&
      form.goodExperience.trim() &&
      form.badExperience.trim() &&
      form.whoShouldTake.trim() &&
      form.whoShouldNotTake.trim() &&
      form.futureOpportunities.trim() &&
      form.consent;

    async function onSubmit(e) {
      e.preventDefault();
      if (!canSubmit) {
        setError("Please complete all required fields.");
        return;
      }
      setLoading(true);
      setError("");
      const payload = Object.assign({}, form, {
        undergradSubjectSlug: selectedSubject?.slug || slugify(form.undergradSubjectName),
        undergradSubjectName: selectedSubject?.name || form.undergradSubjectName.trim(),
        subjectName: selectedSubject?.name || form.undergradSubjectName.trim(),
        university: form.undergradUniversity.trim(),
        subjectSlug: selectedSubject?.slug || slugify(form.undergradSubjectName),
        profession: form.designation.trim(),
        jobTitle: [form.designation, form.jobPlaceName].filter(Boolean).join(" at "),
        universityNeedsReview,
        universityReviewName: universityNeedsReview ? form.undergradUniversity.trim() : "",
        subjectNeedsReview,
        subjectReviewName: subjectNeedsReview ? form.undergradSubjectName.trim() : ""
      });
      try {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
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
          E("p", { className: "lead", style: { marginBottom: 28 } }, "Your anonymous experience has been saved for review. Once approved, it can improve Real Stories, subject pages, university pages, career pages, and AI recommendation signals."),
          E("button", { className: "btn btn-primary", onClick: () => go("landing") }, "Back to EduPath BD")));
    }

    return E("div", { style: { padding: "88px 24px 80px" } },
      E("div", { style: { maxWidth: 760, margin: "0 auto" } },
        E("div", { className: "micro", style: { marginBottom: 10 } }, "Share your experience"),
        E("h1", {
          className: "display-1",
          style: { fontSize: 46, lineHeight: 1.04, marginBottom: 18, maxWidth: 760 }
        },
          E("span", { style: { display: "block" } }, "Your 4 minutes can save someone's"),
          E("span", { style: { display: "block" } }, "4 wrong years.")),
        E("p", { className: "lead", style: { marginBottom: 10 } }, "Help the next HSC batch make a smarter choice. Share what your undergraduate subject actually felt like - the good, the bad, and what nobody tells you before you enroll."),
        E("p", { style: { color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, fontStyle: "italic" } }, "We do not ask for your name or contact info. We only publish anonymous quotes and aggregated stats."),
        E("form", { onSubmit },
          E(Section, { title: "Your Academic Background", note: "This connects your experience to the right subject and university pages." },
            E(Field, {
              label: "Which university did you attend?",
              required: true,
              note: universityNeedsReview ? "This university is not in the current DB. It will be saved as a pending university suggestion for admin review." : "Search or type your university name - if not listed, type the full name."
            },
              E("input", {
                list: "edupath-university-list",
                style: input,
                value: form.undergradUniversity,
                onChange: e => set("undergradUniversity", e.target.value),
                placeholder: "Search or type your university name"
              }),
              E("datalist", { id: "edupath-university-list" }, universities.map(u => E("option", { key: u, value: u })))) ,
            E("div", { style: compactGrid },
              E(Field, {
                label: "Which subject / department?",
                required: true,
                note: subjectNeedsReview ? "This subject is not in the current DB. It will be saved as a pending subject suggestion for admin review." : "Search or type - e.g. CSE, Pharmacy, Economics."
              },
                E("input", {
                  list: "edupath-subject-list",
                  style: input,
                  value: form.undergradSubjectName,
                  onChange: e => {
                    const value = e.target.value;
                    const match = subjects.find(s => s.name.toLowerCase() === value.trim().toLowerCase());
                    setForm(f => Object.assign({}, f, {
                      undergradSubjectName: value,
                      subjectSlug: match?.slug || ""
                    }));
                    setError("");
                  },
                  placeholder: "Search or type your subject"
                }),
                E("datalist", { id: "edupath-subject-list" }, subjects.map(s => E("option", { key: s.slug, value: s.name })))),
              E(Field, { label: "Batch / Session", required: true },
                E("input", { style: input, value: form.session, onChange: e => set("session", e.target.value), placeholder: "e.g. 2018-19, 2020-24" }))),
            E(Field, { label: "Which HSC group were you from?", required: true },
              (window.EduPathUI?.choiceGroup || ((_, c) => E("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, c)))(E,
                [["science", "Science"], ["commerce", "Commerce"], ["arts", "Humanities / Arts"]].map(([id, label]) =>
                  (window.EduPathUI?.choicePill || ((_, opts) => E("button", { key: opts.key, type: "button", className: "pill" + (opts.active ? " is-active" : ""), onClick: opts.onClick, style: { border: "none", cursor: "pointer" } }, opts.children)))(E, {
                    key: id,
                    active: form.hscGroup === id,
                    onClick: () => set("hscGroup", id),
                    children: label
                  })))),
            E(Field, { label: "What is your current status?", required: true },
              (window.EduPathUI?.choiceGroup || ((_, c) => E("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, c)))(E,
                statusOptions.map(v =>
                  (window.EduPathUI?.choicePill || ((_, opts) => E("button", { key: opts.key, type: "button", className: "pill" + (opts.active ? " is-active" : ""), onClick: opts.onClick, style: { border: "none", cursor: "pointer" } }, opts.children)))(E, {
                    key: v,
                    active: form.currentStatus === v,
                    onClick: () => set("currentStatus", v),
                    children: v
                  }))))),

          E(Section, { title: "The Honest Numbers", note: "These ratings become the trust signal on subject pages. Honest answers help juniors more than anything else." },
            E(Field, { label: "Knowing everything you know now - would you choose this subject again?", required: true },
              E("div", { style: { display: "flex", gap: 10 } }, ["Yes", "No"].map(v =>
                E("button", { key: v, type: "button", className: "pill" + (form.wouldChooseAgain === v ? " is-active" : ""), onClick: () => set("wouldChooseAgain", v), style: { border: "none", cursor: "pointer" } }, v)))),
            form.wouldChooseAgain === "No" ? E(Field, { label: "What would you have chosen instead, and why was this a mismatch?", required: true },
              E(TextArea, { input, value: form.chooseAgainReason, onChange: e => set("chooseAgainReason", e.target.value), placeholder: "Be specific. Wrong expectations, wrong job market, wrong fit - what happened?" })) : null,
            E(Scale, { label: "How worth it is this subject to study?", value: form.subjectWorthRating, onChange: v => set("subjectWorthRating", v), low: "1 = Not worth it", high: "5 = Strongly worth it" }),
            E(Scale, { label: "Academic Pressure & Workload", value: form.academicPressure, onChange: v => set("academicPressure", v), low: "1 = Very chill, easy to manage", high: "5 = No sleep, constant pressure" }),
            E(Scale, { label: "Faculty & Teaching Quality", value: form.facultyQuality, onChange: v => set("facultyQuality", v), low: "1 = Outdated, hard to learn", high: "5 = World-class, actually learned things" }),
            E(Scale, { label: "Job Market Reality for this subject", value: form.jobReality, onChange: v => set("jobReality", v), low: "1 = Very hard to find relevant work", high: "5 = Strong demand, clear job pathways" })),

          E(Section, { title: "Your Story", note: "These become the most-read cards on subject pages. Specific and honest beats polished and vague." },
            E(Field, { label: "What were some genuinely good experiences during your undergrad?", required: true },
              E(TextArea, { input, value: form.goodExperience, onChange: e => set("goodExperience", e.target.value), placeholder: "Projects you're proud of, teachers who changed how you think, skills that paid off, friendships, campus moments - anything real" })),
            E(Field, { label: "What were some bad or frustrating experiences?", required: true },
              E(TextArea, { input, value: form.badExperience, onChange: e => set("badExperience", e.target.value), placeholder: "Outdated syllabus, session jam, weak labs, department politics, poor career support - don't hold back" })),
            E(Field, { label: "Who should take this subject?", required: true },
              E(TextArea, { input, value: form.whoShouldTake, onChange: e => set("whoShouldTake", e.target.value), placeholder: "Describe the mindset, strengths, or goals that make someone a natural fit - e.g. someone who loves math and doesn't mind spending hours debugging" })),
            E(Field, { label: "Who should NOT take this subject?", required: true },
              E(TextArea, { input, value: form.whoShouldNotTake, onChange: e => set("whoShouldNotTake", e.target.value), placeholder: "Be honest about mismatch signals - e.g. if the job title sounds cool but dense reading feels impossible, this may be hard" })),
            E(Field, { label: "What future doors does this subject open?", required: true },
              E(TextArea, { input, value: form.futureOpportunities, onChange: e => set("futureOpportunities", e.target.value), placeholder: "Jobs, higher studies abroad, research, freelancing, startups, specific industries - list what you've seen actually work" }))),

          E(Section, { title: "Where Are You Now", note: "Helps students see real outcomes from this subject." },
            E("div", { style: compactGrid },
              E(Field, { label: "Your designation / title", required: true },
                E("input", { style: input, value: form.designation, onChange: e => set("designation", e.target.value), placeholder: "e.g. UI/UX Designer, Software Engineer, Bank Officer, Lecturer" })),
              E(Field, { label: "Where do you work? (optional)" },
                E("input", { style: input, value: form.jobPlaceName, onChange: e => set("jobPlaceName", e.target.value), placeholder: "e.g. Grameenphone, BRAC, a startup, freelancing" }))),
            E("div", { style: compactGrid },
              E(Field, { label: "Current city", required: true },
                E("input", { style: input, value: form.currentCity, onChange: e => set("currentCity", e.target.value), placeholder: "Dhaka, Sylhet, Toronto, Dubai" })),
              E(Field, { label: "Current country", required: true },
                E("input", { style: input, value: form.currentCountry, onChange: e => set("currentCountry", e.target.value), placeholder: "Bangladesh, Canada, UAE" })))),

          E("section", { style: { borderTop: "1px solid var(--ink-08)", paddingTop: 24, marginTop: 28 } },
            E("div", { style: { display: "none" } },
              E("div", { style: { fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 } }, "Review summary"),
              E("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.6 } },
                (form.undergradUniversity || "University"), " · ",
                (selectedSubject?.name || form.undergradSubjectName || "Subject"), " · ",
                (form.currentStatus || "Status"), " · ",
                "Worth ", form.subjectWorthRating || "-", "/5 · ",
                "Pressure ", form.academicPressure || "-", "/5 · ",
                "Faculty ", form.facultyQuality || "-", "/5 · ",
                "Jobs ", form.jobReality || "-", "/5")),
            E("label", { style: { display: "flex", gap: 12, alignItems: "flex-start", lineHeight: 1.6, fontSize: 14 } },
              E("input", { type: "checkbox", checked: form.consent, onChange: e => set("consent", e.target.checked), style: { marginTop: 4, accentColor: "var(--green)" } }),
              E("span", null, "I agree to let EduPath BD publish this review anonymously to help future students. We do not ask for your name or contact info, and nothing identifying will ever be shared."))),
          error ? E("div", { style: { background: "#FDECEA", color: "#922820", padding: "12px 14px", borderRadius: 8, marginTop: 18, fontSize: 14 } }, error) : null,
          E("div", { style: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, flexWrap: "wrap" } },
            E("button", { type: "button", className: "pf-link", onClick: () => go("landing") }, "Cancel"),
            E("button", { type: "submit", className: "btn btn-primary", disabled: loading || !canSubmit }, loading ? "Submitting..." : "Share my experience")))));
  }

  Object.assign(window, { ScreenContribute });
})();
