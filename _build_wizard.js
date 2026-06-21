/**
 * Replaces the Find My Path matcher screen with a proper 3-step GPA-aware wizard
 * Run: node _build_wizard.js
 */
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ─── Find the Matcher screen IIFE boundaries ───────────────────
const matcherStart = h.indexOf('<!-- ═══════════════════════════════════════════════════════════\r\n     SCREEN — MATCHER');
if (matcherStart === -1) { console.error('Matcher block not found'); process.exit(1); }
const matcherEnd = h.indexOf('</script>', h.indexOf('ScreenMatcher', matcherStart)) + '</script>'.length;
console.log('Matcher block:', matcherStart, '-', matcherEnd, '=', Math.round((matcherEnd-matcherStart)/1024), 'KB');

// ─── New 3-step wizard ─────────────────────────────────────────
const WIZARD = `<!-- ═══════════════════════════════════════════════════════════
     SCREEN — MATCHER (3-Step GPA-Aware Path Finder)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/javascript">
(function () {
  const { useState, useEffect, useMemo, useCallback } = React;

  // ── Interests list (Step 2) ─────────────────────────────────
  const INTERESTS = [
    { id: "coding",           label: "Building software / coding" },
    { id: "mathematics",      label: "Solving complex math problems" },
    { id: "building-things",  label: "Designing & building structures" },
    { id: "business-money",   label: "Business, markets & money" },
    { id: "writing-language", label: "Creative writing / language" },
    { id: "law-governance",   label: "Law, politics & governance" },
    { id: "lab-research",     label: "Lab experiments & research" },
    { id: "nature-environment","label": "Nature, plants & animals" },
    { id: "creative-design",  label: "Art, design & visual creation" },
    { id: "helping-people",   label: "Helping & serving people" },
    { id: "technology",       label: "Technology & electronics" },
    { id: "agriculture-food", label: "Agriculture & food science" },
    { id: "healthcare",       label: "Healthcare & medicine" },
    { id: "arts-culture",     label: "Arts, culture & heritage" },
  ];

  const DOMAINS = [
    { id: "engineering", label: "Engineering & Technology" },
    { id: "business",    label: "Business & Economics" },
    { id: "science",     label: "Science & Research" },
    { id: "humanities",  label: "Arts & Humanities" },
    { id: "social",      label: "Social Sciences & Law" },
    { id: "life",        label: "Life & Agricultural Sciences" },
    { id: "health",      label: "Health & Pharmacy" },
    { id: "design",      label: "Design & Architecture" },
  ];

  const DIVISIONS = [
    "Dhaka", "Chattogram", "Rajshahi", "Khulna",
    "Sylhet", "Rangpur", "Barishal", "Mymensingh", "Anywhere"
  ];

  // ── Compute matching paths ──────────────────────────────────
  function computePaths(form) {
    const subjects = window.DB_Subjects || [];
    const uniMap   = window.DB_Universities || [];
    const hscMap   = window.DB_HSCMapping   || {};
    const intMap   = window.DB_InterestsMapping || {};

    if (!subjects.length) return [];

    // 1. Filter by HSC group
    let eligible = subjects.filter(s =>
      !s.hsc_groups || !s.hsc_groups.length || s.hsc_groups.includes(form.hscGroup)
    );

    // 2. Score by interests (multi-select tags)
    const interestSlugs = new Set();
    (form.interests || []).forEach(int => {
      (intMap[int] || []).forEach(slug => interestSlugs.add(slug));
    });

    // 3. Score by domain preference
    const DOMAIN_FIELD_MAP = {
      engineering: ["Engineering & Technology"],
      business:    ["Business & Commerce"],
      science:     ["Natural Sciences"],
      humanities:  ["Arts & Humanities"],
      social:      ["Social Science"],
      life:        ["Life & Earth Sciences"],
      health:      ["Health Sciences"],
      design:      ["Design"],
    };
    const domainFields = new Set();
    (form.domains || []).forEach(d => {
      (DOMAIN_FIELD_MAP[d] || []).forEach(f => domainFields.add(f));
    });

    // 4. Score each eligible subject
    const scored = eligible.map(s => {
      let score = 0;
      if (interestSlugs.has(s.slug)) score += 40;
      (s.related_interests || []).forEach(i => {
        if ((form.interests || []).includes(i)) score += 10;
      });
      if (domainFields.size && domainFields.has(s.field)) score += 30;
      // GPA bonus — subjects with lower difficulty get higher score for lower GPA
      const gpa = parseFloat(form.hscGpa) || 0;
      const diff = s.difficulty || 3;
      if (gpa >= 4.5 && diff >= 4) score += 15;
      else if (gpa >= 4.0 && diff <= 4) score += 10;
      else if (gpa < 3.5 && diff <= 3) score += 10;
      return { ...s, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }

  // ── Step components ─────────────────────────────────────────
  function ProgressBar({ step }) {
    const steps = ["Academic", "Interests", "Logistics"];
    return React.createElement("div", { style: { marginBottom: 32 } },
      React.createElement("div", {
        style: { display: "flex", gap: 0, borderRadius: 8, overflow: "hidden",
          background: "var(--ink-04)", height: 6 }
      },
        steps.map((_, i) => React.createElement("div", {
          key: i,
          style: {
            flex: 1,
            background: i < step ? "var(--green)" : "transparent",
            transition: "background 300ms"
          }
        }))
      ),
      React.createElement("div", {
        style: { display: "flex", justifyContent: "space-between", marginTop: 8 }
      },
        steps.map((label, i) => React.createElement("span", {
          key: i,
          style: {
            fontSize: 11, fontWeight: i + 1 === step ? 600 : 400,
            color: i + 1 === step ? "var(--green)" : "var(--text-muted)"
          }
        }, "Step " + (i+1) + ": " + label))
      )
    );
  }

  function PathCounter({ count }) {
    return React.createElement("div", {
      style: {
        background: "var(--green-8, #e8f5ee)",
        border: "1px solid var(--green)",
        borderRadius: "var(--r-pill, 999px)",
        padding: "8px 20px",
        textAlign: "center",
        marginBottom: 24,
        fontSize: 14,
        color: "var(--green)"
      }
    },
      React.createElement("strong", null, count),
      " matching paths found as you fill in your profile"
    );
  }

  function Tag({ label, selected, onClick, color }) {
    return React.createElement("button", {
      onClick,
      style: {
        padding: "8px 16px",
        borderRadius: "var(--r-pill, 999px)",
        border: "1.5px solid " + (selected ? "var(--green)" : "var(--ink-08)"),
        background: selected ? "var(--green)" : "var(--surface)",
        color: selected ? "white" : "var(--text)",
        fontSize: 13, cursor: "pointer",
        transition: "all 150ms",
        fontFamily: "var(--font-body)"
      }
    }, label);
  }

  function GpaInput({ label, value, onChange }) {
    return React.createElement("div", { style: { flex: 1, minWidth: 140 } },
      React.createElement("label", { style: { fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 } }, label),
      React.createElement("input", {
        type: "number", min: 0, max: 5, step: 0.01,
        placeholder: "e.g. 4.75",
        value: value,
        onChange: e => onChange(e.target.value),
        style: {
          width: "100%", padding: "10px 14px", fontSize: 15,
          border: "1.5px solid var(--ink-08)", borderRadius: 8,
          fontFamily: "var(--font-body)", outline: "none",
          background: "var(--surface)"
        }
      })
    );
  }

  // ── Main wizard component ───────────────────────────────────
  function ScreenMatcher({ go, setMatcherResults }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
      hscGroup: "", sscGpa: "", hscGpa: "", sscHscGpa: "",
      interests: [], domains: [],
      division: "Anywhere", uniType: "both"
    });

    const pathCount = useMemo(() => computePaths(form).length, [form]);

    function setField(key, val) { setForm(f => ({ ...f, [key]: val })); }

    function toggleInterest(id) {
      setForm(f => {
        const cur = f.interests;
        if (cur.includes(id)) return { ...f, interests: cur.filter(x => x !== id) };
        if (cur.length >= 3) return f; // max 3
        return { ...f, interests: [...cur, id] };
      });
    }

    function toggleDomain(id) {
      setForm(f => {
        const cur = f.domains;
        if (cur.includes(id)) return { ...f, domains: cur.filter(x => x !== id) };
        return { ...f, domains: [...cur, id] };
      });
    }

    async function handleSubmit() {
      setLoading(true);
      const matched = computePaths(form);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: form, matched_subjects: matched.slice(0, 15).map(s => s.slug) })
        });
        const data = await res.json();
        setMatcherResults({ form, matched, ai: data });
        go("results");
      } catch (e) {
        setMatcherResults({ form, matched, ai: null });
        go("results");
      }
      setLoading(false);
    }

    const inp = {
      padding: "10px 14px", fontSize: 14,
      border: "1.5px solid var(--ink-08)", borderRadius: 8,
      fontFamily: "var(--font-body)", width: "100%",
      background: "var(--surface)", outline: "none"
    };

    const canNext1 = form.hscGroup && form.sscGpa && form.hscGpa;
    const canNext2 = form.interests.length > 0;

    return React.createElement("div", { style: { padding: "48px 0 80px", minHeight: "80vh" } },
      React.createElement("div", { className: "pf-container", style: { maxWidth: 600, margin: "0 auto" } },

        React.createElement("button", {
          className: "pf-link", onClick: () => go("landing"), style: { fontSize: 13, marginBottom: 24 }
        }, "← Back to home"),

        React.createElement("h1", {
          className: "display-2", style: { fontSize: 32, marginBottom: 8 }
        }, "Find your path"),

        React.createElement("p", {
          style: { color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }
        }, "Answer 3 quick steps. We'll match you to the right undergraduate subjects based on your actual profile."),

        React.createElement(ProgressBar, { step }),

        React.createElement(PathCounter, { count: pathCount }),

        // ── STEP 1: Academic Foundation ─────────────────────
        step === 1 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 20, fontWeight: 600, marginBottom: 24 } },
            "Step 1 — Your Academic Background"),

          React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" } },
            "HSC / Equivalent Group"),
          React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" } },
            ["science", "commerce", "arts"].map(g => React.createElement(Tag, {
              key: g,
              label: g === "arts" ? "Humanities (Arts)" : g.charAt(0).toUpperCase() + g.slice(1),
              selected: form.hscGroup === g,
              onClick: () => setField("hscGroup", g)
            }))
          ),

          React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" } },
            React.createElement(GpaInput, { label: "SSC GPA (out of 5.00)", value: form.sscGpa, onChange: v => setField("sscGpa", v) }),
            React.createElement(GpaInput, { label: "HSC GPA (out of 5.00)", value: form.hscGpa, onChange: v => setField("hscGpa", v) })
          ),

          React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", marginBottom: 8 } },
            "Optional: SSC + HSC combined GPA (used by some universities for eligibility)"),
          React.createElement("input", {
            type: "number", min: 0, max: 10, step: 0.01, placeholder: "e.g. 9.25",
            value: form.sscHscGpa, onChange: e => setField("sscHscGpa", e.target.value),
            style: { ...inp, maxWidth: 200, marginBottom: 32 }
          }),

          React.createElement("button", {
            disabled: !canNext1,
            onClick: () => setStep(2),
            style: {
              padding: "12px 32px", background: canNext1 ? "var(--green)" : "var(--ink-08)",
              color: "white", border: "none", borderRadius: "var(--r-pill, 999px)",
              fontSize: 15, fontWeight: 600, cursor: canNext1 ? "pointer" : "not-allowed",
              fontFamily: "var(--font-body)"
            }
          }, "Next: Interests →")
        ),

        // ── STEP 2: Interests & Strengths ──────────────────
        step === 2 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 20, fontWeight: 600, marginBottom: 8 } },
            "Step 2 — What excites you?"),
          React.createElement("p", { style: { fontSize: 13, color: "var(--text-muted)", marginBottom: 20 } },
            "Pick up to 3 areas that genuinely interest you. Don't pick what sounds impressive — pick what you actually enjoy."),

          React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 } },
            INTERESTS.map(i => React.createElement(Tag, {
              key: i.id, label: i.label,
              selected: form.interests.includes(i.id),
              onClick: () => toggleInterest(i.id)
            }))
          ),

          React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" } },
            "Preferred subject domain (optional — select any that appeal to you)"),
          React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 } },
            DOMAINS.map(d => React.createElement(Tag, {
              key: d.id, label: d.label,
              selected: form.domains.includes(d.id),
              onClick: () => toggleDomain(d.id)
            }))
          ),

          React.createElement("div", { style: { display: "flex", gap: 12 } },
            React.createElement("button", {
              onClick: () => setStep(1),
              style: { padding: "12px 24px", background: "none", border: "1.5px solid var(--ink-08)", borderRadius: "var(--r-pill,999px)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" }
            }, "← Back"),
            React.createElement("button", {
              disabled: !canNext2,
              onClick: () => setStep(3),
              style: {
                padding: "12px 32px", background: canNext2 ? "var(--green)" : "var(--ink-08)",
                color: "white", border: "none", borderRadius: "var(--r-pill,999px)",
                fontSize: 15, fontWeight: 600, cursor: canNext2 ? "pointer" : "not-allowed",
                fontFamily: "var(--font-body)"
              }
            }, "Next: Logistics →")
          )
        ),

        // ── STEP 3: Logistics ───────────────────────────────
        step === 3 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 20, fontWeight: 600, marginBottom: 24 } },
            "Step 3 — Practical preferences"),

          React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" } },
            "Preferred division / location"),
          React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 } },
            DIVISIONS.map(d => React.createElement(Tag, {
              key: d, label: d,
              selected: form.division === d,
              onClick: () => setField("division", d)
            }))
          ),

          React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)" } },
            "University type"),
          React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" } },
            [
              { id: "public", label: "Public only" },
              { id: "private", label: "Open to private" },
              { id: "both", label: "Either is fine" }
            ].map(t => React.createElement(Tag, {
              key: t.id, label: t.label,
              selected: form.uniType === t.id,
              onClick: () => setField("uniType", t.id)
            }))
          ),

          React.createElement("div", { style: { background: "var(--ink-04)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 } },
            React.createElement("p", { style: { fontSize: 13, fontWeight: 600, marginBottom: 8 } }, "Your profile summary"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-muted)" } },
              "Group: " + (form.hscGroup || "—") + " · SSC: " + (form.sscGpa || "—") +
              " · HSC: " + (form.hscGpa || "—") + " · " + (form.interests.length) + " interests selected"
            ),
            React.createElement("p", { style: { fontSize: 14, fontWeight: 600, color: "var(--green)", marginTop: 8 } },
              pathCount + " subject paths match your profile"
            )
          ),

          React.createElement("div", { style: { display: "flex", gap: 12 } },
            React.createElement("button", {
              onClick: () => setStep(2),
              style: { padding: "12px 24px", background: "none", border: "1.5px solid var(--ink-08)", borderRadius: "var(--r-pill,999px)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" }
            }, "← Back"),
            React.createElement("button", {
              onClick: handleSubmit,
              disabled: loading,
              style: {
                flex: 1, padding: "14px 32px",
                background: "var(--green)", color: "white",
                border: "none", borderRadius: "var(--r-pill,999px)",
                fontSize: 16, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-body)"
              }
            }, loading ? "Finding your path…" : "See my recommendations →")
          )
        )
      )
    );
  }

  Object.assign(window, { ScreenMatcher });
})();
</script>`.replace(/\n/g, '\r\n');

// ─── Replace in index.html ─────────────────────────────────────
h = h.slice(0, matcherStart) + WIZARD + h.slice(matcherEnd);

// Also update api/recommend.js to use the new profile shape
fs.writeFileSync('index.html', h, 'utf8');
console.log('Wizard written. Size:', Math.round(h.length / 1024), 'KB');
