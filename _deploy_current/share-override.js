(function () {
  const { useMemo, useState } = React;
  const E = React.createElement;

  function Field({ label, children, required }) {
    return E("label", { style: { display: "block", marginBottom: 18 } },
      E("span", { style: { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 } },
        label, required ? E("span", { style: { color: "#C8553D" } }, " *") : null),
      children);
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

  function ScreenContribute({ go }) {
    const universities = useMemo(() => {
      const data = window.UGCData || {};
      return ((data.public || []).concat(data.private || [])).map(u => u.name).sort();
    }, []);
    const subjects = useMemo(() => (window.PFData?.subjects || []).slice().sort((a, b) => a.name.localeCompare(b.name)), []);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
      university: "",
      subjectSlug: "",
      currentStatus: "",
      wouldChooseAgain: "",
      academicPressure: 0,
      facultyQuality: 0,
      jobReality: 0,
      wishKnew: "",
      worstPart: "",
      bestPart: "",
      jobTitle: "",
      consent: false
    });
    const set = (key, value) => setForm(f => Object.assign({}, f, { [key]: value }));
    const input = { width: "100%", padding: "11px 14px", border: "1.5px solid var(--ink-16)", borderRadius: "var(--r-input)", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", fontSize: 14, boxSizing: "border-box" };
    const canSubmit = form.university && form.subjectSlug && form.currentStatus && form.wouldChooseAgain && form.academicPressure && form.facultyQuality && form.jobReality && form.wishKnew && form.worstPart && form.bestPart && form.consent;

    async function onSubmit(e) {
      e.preventDefault();
      if (!canSubmit) {
        setError("Please complete all required fields.");
        return;
      }
      setLoading(true);
      setError("");
      const subject = subjects.find(s => s.slug === form.subjectSlug);
      try {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({}, form, { subjectName: subject?.name || "" }))
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
          E("p", { className: "lead", style: { marginBottom: 28 } }, "Your anonymous experience has been saved for review. Once approved, it can appear in Real Stories, subject pages, university pages, career pages, and AI recommendation signals."),
          E("button", { className: "btn btn-primary", onClick: () => go("landing") }, "Back to EduPath BD")));
    }

    return E("div", { style: { padding: "88px 24px 80px" } },
      E("div", { style: { maxWidth: 760, margin: "0 auto" } },
        E("div", { className: "micro", style: { marginBottom: 10 } }, "Share Your Reality"),
        E("h1", { className: "display-1", style: { fontSize: 46, marginBottom: 12 } }, "100% anonymous. No PR talk."),
        E("p", { className: "lead", style: { marginBottom: 28 } }, "Help the next generation of HSC candidates understand the brutal truth about your degree. Your name and email will never be published."),
        E("form", { onSubmit },
          E(Section, { title: "1. The Foundation", note: "Required so your story can connect to the right university, subject, and pages." },
            E(Field, { label: "University Name", required: true }, E("select", { style: input, value: form.university, onChange: e => set("university", e.target.value) }, E("option", { value: "" }, "Select university"), universities.map(u => E("option", { key: u, value: u }, u)))),
            E(Field, { label: "Subject / Department", required: true }, E("select", { style: input, value: form.subjectSlug, onChange: e => set("subjectSlug", e.target.value) }, E("option", { value: "" }, "Select subject"), subjects.map(s => E("option", { key: s.slug, value: s.slug }, s.name)))),
            E(Field, { label: "What is your current status?", required: true }, E("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, ["Current Student", "Recent Graduate", "Alumni (Working for 2+ years)"].map(v => E("button", { key: v, type: "button", className: "pill" + (form.currentStatus === v ? " is-active" : ""), onClick: () => set("currentStatus", v), style: { border: "none", cursor: "pointer" } }, v))))),
          E(Section, { title: "2. The Brutal Truth", note: "These metrics become subject and university stats." },
            E(Field, { label: "Knowing what you know now, would you choose this exact subject at this exact university again?", required: true }, E("div", { style: { display: "flex", gap: 10 } }, ["Yes", "No"].map(v => E("button", { key: v, type: "button", className: "pill" + (form.wouldChooseAgain === v ? " is-active" : ""), onClick: () => set("wouldChooseAgain", v), style: { border: "none", cursor: "pointer" } }, v)))),
            E(Scale, { label: "Academic Pressure & Workload", value: form.academicPressure, onChange: v => set("academicPressure", v), low: "1 = Very chill", high: "5 = No sleep" }),
            E(Scale, { label: "Faculty & Teaching Quality", value: form.facultyQuality, onChange: v => set("facultyQuality", v), low: "1 = Terrible", high: "5 = World-class" }),
            E(Scale, { label: "Job Market Reality", value: form.jobReality, onChange: v => set("jobReality", v), low: "1 = Brutal", high: "5 = High demand" })),
          E(Section, { title: "3. The Story Cards", note: "These become direct quotes on public pages after review." },
            E(Field, { label: "What do you wish you knew BEFORE enrolling in this degree?", required: true }, E("textarea", { rows: 4, style: input, value: form.wishKnew, onChange: e => set("wishKnew", e.target.value), placeholder: "e.g. I thought CSE was just coding, but it was much more math-heavy..." })),
            E(Field, { label: "What is the absolute WORST part about this degree/department?", required: true }, E("textarea", { rows: 4, style: input, value: form.worstPart, onChange: e => set("worstPart", e.target.value), placeholder: "Lab equipment? Politics? Outdated syllabus? Job-market mismatch?" })),
            E(Field, { label: "What is the BEST part?", required: true }, E("textarea", { rows: 4, style: input, value: form.bestPart, onChange: e => set("bestPart", e.target.value), placeholder: "Alumni network, specific skills, campus life, professors, career path..." }))),
          form.currentStatus !== "Current Student" ? E(Section, { title: "4. Career", note: "Optional, but helps juniors see real outcomes." },
            E(Field, { label: "What is your current Job Title / Profession?" }, E("input", { style: input, value: form.jobTitle, onChange: e => set("jobTitle", e.target.value), placeholder: "Software Engineer, Bank Officer, Unemployed..." }))) : null,
          E(Section, { title: "5. The Handshake", note: "Required for anonymous publication." },
            E("label", { style: { display: "flex", gap: 12, alignItems: "flex-start", lineHeight: 1.6, fontSize: 14 } },
              E("input", { type: "checkbox", checked: form.consent, onChange: e => set("consent", e.target.checked), style: { marginTop: 4, accentColor: "var(--green)" } }),
              E("span", null, "I agree to let EduPath BD publish this review anonymously to help future students. I understand my personal contact info will never be shared."))),
          error ? E("div", { style: { background: "#FDECEA", color: "#922820", padding: "12px 14px", borderRadius: 8, marginTop: 18, fontSize: 14 } }, error) : null,
          E("div", { style: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 } },
            E("button", { type: "button", className: "pf-link", onClick: () => go("landing") }, "Cancel"),
            E("button", { type: "submit", className: "btn btn-primary", disabled: loading || !canSubmit, style: { opacity: loading || !canSubmit ? 0.6 : 1 } }, loading ? "Submitting..." : "Submit my experience")))));
  }

  Object.assign(window, { ScreenContribute });
})();
