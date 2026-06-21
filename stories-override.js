(function () {
  const { useState, useEffect } = React;
  const E = React.createElement;

  const COUNTRY_MAP = {
    "bangladesh": "BD", "bd": "BD",
    "canada": "CA", "ca": "CA",
    "united states": "US", "usa": "US", "us": "US",
    "uk": "GB", "united kingdom": "GB", "gb": "GB",
    "australia": "AU", "au": "AU",
    "uae": "AE", "united arab emirates": "AE", "ae": "AE",
    "germany": "DE", "de": "DE",
    "india": "IN", "in": "IN",
    "malaysia": "MY", "my": "MY",
    "singapore": "SG", "sg": "SG",
    "qatar": "QA", "qa": "QA",
    "saudi arabia": "SA", "ksa": "SA", "sa": "SA",
    "japan": "JP", "south korea": "KR", "netherlands": "NL",
    "sweden": "SE", "norway": "NO", "finland": "FI",
    "new zealand": "NZ", "nz": "NZ"
  };

  function toCountryCode(raw) {
    if (!raw) return "BD";
    const key = raw.toLowerCase().trim();
    return COUNTRY_MAP[key] || (key.length === 2 ? key.toUpperCase() : "BD");
  }

  function normalise(t) {
    return {
      id: t.id,
      subjectSlug: t.subjectSlug || t.undergradSubjectSlug,
      subjectName: t.subjectName || t.undergradSubjectName,
      uni: t.undergradUniversity || t.university,
      role: [t.designation, t.profession].filter(Boolean).join(", ") || t.jobTitle || "",
      session: t.session || "",
      city: t.currentCity || "",
      country: toCountryCode(t.currentCountry),
      again: (t.wouldChooseAgain || "").toLowerCase(),
      alternative: t.chooseAgainReason || "",
      good: t.goodExperience || t.bestPart || "",
      bad: t.badExperience || t.worstPart || "",
      whoShould: t.whoShouldTake || t.wishKnew || "",
      whoShouldnt: t.whoShouldNotTake || "",
      opportunities: t.futureOpportunities || "",
      _blob: true,
      _approvedAt: t.approvedAt,
    };
  }

  function ScreenStories({ go }) {
    const [filter, setFilter] = useState("all");
    const [fieldFilter, setFieldFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState(new Set());
    const [blobStories, setBlobStories] = useState([]);

    useEffect(function () {
      fetch("/api/testimonials-approved")
        .then(function (r) { return r.ok ? r.json() : { rows: [] }; })
        .then(function (json) {
          const rows = (json.rows || [])
            .map(normalise)
            .filter(function (t) { return t.good && t.good.length > 10; });
          setBlobStories(rows);
        })
        .catch(function () {});
    }, []);

    const toggle = function (i) {
      const n = new Set(expanded);
      if (n.has(i)) n.delete(i); else n.add(i);
      setExpanded(n);
    };

    // Blob stories first (newest real submissions), then existing PFData stories
    const allStories = blobStories.concat(PFData.testimonials);
    const total = allStories.length;

    const filtered = allStories.filter(function (t) {
      if (filter === "yes" && t.again !== "yes") return false;
      if (filter === "no" && t.again !== "no") return false;
      if (filter === "abroad" && t.country === "BD") return false;
      if (fieldFilter !== "all") {
        const subj = PFData.subjects.find(function (s) { return s.slug === t.subjectSlug; });
        const fieldOnSubject = subj ? subj.field : (t.field || "");
        if (fieldOnSubject !== fieldFilter) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [t.good, t.bad, t.uni, t.role, t.subjectName].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const filterBtns = [
      { id: "all", label: "All" },
      { id: "yes", label: "Chose again" },
      { id: "no", label: "Changed path" },
      { id: "abroad", label: "Now abroad" }
    ];

    return E("div", null,
      E("div", { className: "pf-stickybar" },
        E("div", { className: "pf-stickybar__inner", style: { gap: 10, flexWrap: "wrap" } },
          E("div", { className: "pf-tagrow" },
            filterBtns.map(function (f) {
              return E("button", {
                key: f.id,
                className: "pill" + (filter === f.id ? " is-active" : ""),
                onClick: function () { setFilter(f.id); },
                style: { fontSize: 12, padding: "6px 12px", border: "none", cursor: "pointer", fontFamily: "inherit" }
              }, f.label);
            })
          ),
          E("div", { style: { flex: 1 } }),
          E("div", { className: "pf-search-wrap" },
            E("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" } },
              E("circle", { cx: "11", cy: "11", r: "8" }),
              E("path", { d: "m21 21-4.35-4.35" })
            ),
            E("input", { type: "search", className: "pf-search pf-search--sm", placeholder: "Search stories…", value: query, onChange: function (e) { setQuery(e.target.value); } })
          ),
          E("select", {
            value: fieldFilter,
            onChange: function (e) { setFieldFilter(e.target.value); },
            style: { padding: "8px 14px", borderRadius: 100, border: "1px solid var(--ink-16)", background: "var(--surface)", fontSize: 13, fontFamily: "inherit", cursor: "pointer" }
          },
            E("option", { value: "all" }, "All fields"),
            Object.entries(PFData.FIELDS).map(function (entry) {
              return E("option", { key: entry[0], value: entry[0] }, entry[1].label);
            })
          )
        )
      ),
      E("div", { className: "pf-page" },
        E("div", { className: "pf-container" },
          E(window.SectionHead, {
            eyebrow: filtered.length + " of " + total + " responses",
            title: "What graduates actually say.",
            sub: "Unedited. Reviewed for authenticity, not filtered for positivity."
          }),
          E("div", { className: "pf-stories-nudge" },
            E("span", null, "A graduate? Your experience helps the next student."),
            E("button", { className: "pf-link", onClick: function () { go("contribute"); }, style: { fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 } }, "Share my experience →")
          ),
          filtered.length === 0
            ? E("div", { style: { padding: 48, textAlign: "center", background: "var(--surface)", borderRadius: 14, border: "1px solid var(--ink-08)" } },
                E("h3", { className: "h3", style: { marginBottom: 8 } }, query ? "No results for \"" + query + "\"" : "No responses match this filter yet."),
                E("p", { style: { fontSize: 15, color: "var(--text-muted)", maxWidth: 400, margin: "8px auto 20px", lineHeight: 1.5 } }, query ? "Try different keywords." : "Be the first in this category."),
                !query && E("button", { className: "pf-link", onClick: function () { go("contribute"); } }, "Share my experience →")
              )
            : E("div", { className: "pf-grid-2" },
                filtered.map(function (t, i) {
                  return E(window.TestimonialCard, {
                    key: (t.id || t.name || "") + i,
                    t: t,
                    expanded: expanded.has(i),
                    onToggle: function () { toggle(i); }
                  });
                })
              ),
          filtered.length > 0 && E("div", { className: "pf-stories-bottom" },
            E("div", { style: { fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, lineHeight: 1.2 } }, "Add your experience."),
            E("button", { className: "pf-link", onClick: function () { go("contribute"); }, style: { flexShrink: 0 } }, "Share my experience →")
          )
        )
      ),
      E(window.Footer, { go: go })
    );
  }

  Object.assign(window, { ScreenStories });
})();
