var React={useState:()=>[null,()=>{}],createElement:()=>{}};
var window={PFData:{subjects:[],testimonials:[]},UGCData:{universities:{public:[],private:[],international:[]}},CareerData:null,UniSubjects:{},SubjectUniIds:{}};
var PFData=window.PFData;
(function () {
  function buildSearchIndex() {
    const index = {
      subjects: [],
      universities: [],
      jobs: []
    };
    if (window.PFData?.subjects) {
      const _allUnis = (window.UGCData?.universities?.public || []).concat(window.UGCData?.universities?.private || []).concat(window.UGCData?.universities?.international || []);
      index.subjects = window.PFData.subjects.map(s => {
        const uniIds = window.SubjectUniIds?.[s.slug] || [];
        const uniNames = uniIds.map(id => _allUnis.find(u => u.id === id)?.name || id).join(" ");
        return {
          type: "subject",
          slug: s.slug,
          name: s.name,
          desc: s.desc,
          field: s.field,
          uniCount: uniIds.length,
          searchText: (s.name + " " + s.desc + " " + (s.alts?.join(" ") || "") + " " + uniNames).toLowerCase()
        };
      });
    }
    if (window.UGCData?.universities) {
      const unis = window.UGCData.universities;
      index.universities = (unis.public || []).concat(unis.private || []).concat(unis.international || []).map(u => {
        const subSlugs = window.UniSubjects?.[u.id] || [];
        const allSubjs = window.PFData?.subjects || [];
        const subNames = subSlugs.map(sl => allSubjs.find(x => x.slug === sl)?.name || sl).join(" ");
        return {
          type: "university",
          id: u.id,
          name: u.name,
          short: u.short || "",
          city: u.city,
          tier: u.tier,
          category: u.category,
          cost: u.cost,
          subjectCount: subSlugs.length,
          searchText: (u.name + " " + (u.short || "") + " " + (u.city || "") + " " + subNames).toLowerCase()
        };
      });
    }
    if (window.CareerData?.jobs) {
      const jobSet = new Set();
      window.PFData?.subjects?.forEach(s => {
        const jobs = window.CareerData.jobTitles(s.slug) || [];
        jobs.forEach(j => jobSet.add(j));
      });
      index.jobs = Array.from(jobSet).map(title => ({
        type: "job",
        title: title,
        searchText: title.toLowerCase(),
        salary: window.CareerData.bdSalary(title)
      }));
    }
    return index;
  }
  function searchIndex(query, index) {
    if (!query.trim()) return {
      subjects: [],
      universities: [],
      jobs: []
    };
    const q = query.toLowerCase().trim();
    const results = {
      subjects: [],
      universities: [],
      jobs: []
    };
    results.subjects = (index.subjects || []).filter(s => s.searchText.includes(q)).slice(0, 8);
    results.universities = (index.universities || []).filter(u => u.searchText.includes(q)).slice(0, 8);
    results.jobs = (index.jobs || []).filter(j => j.searchText.includes(q)).slice(0, 8);
    return results;
  }
  function SearchBar({
    onSearch,
    go
  }) {
    const [query, setQuery] = React.useState("");
    const [index] = React.useState(() => buildSearchIndex());
    const [suggestions, setSuggestions] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const handleChange = e => {
      const val = e.target.value;
      setQuery(val);
      if (val.trim().length >= 2) {
        const results = searchIndex(val, index);
        setSuggestions(results);
        setIsOpen(true);
      } else {
        setSuggestions(null);
        setIsOpen(false);
      }
    };
    const handleSelect = (type, item) => {
      const q = item.name || item.title;
      const results = searchIndex(q, index);
      onSearch({
        query: q,
        results
      });
      setQuery("");
      setIsOpen(false);
      setTimeout(() => go("search-results"), 0);
    };
    const handleSubmit = e => {
      e.preventDefault();
      if (query.trim()) {
        const results = searchIndex(query, index);
        onSearch({
          query,
          results
        });
        setQuery("");
        setIsOpen(false);
        setTimeout(() => go("search-results"), 0);
      }
    };
    const hasSuggestions = suggestions && (suggestions.subjects.length > 0 || suggestions.universities.length > 0 || suggestions.jobs.length > 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("form", {
      onSubmit: handleSubmit,
      style: {
        display: "flex",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: query,
      onChange: handleChange,
      onFocus: () => suggestions && setIsOpen(true),
      onBlur: () => setTimeout(() => setIsOpen(false), 200),
      placeholder: "Search subjects, universities, careers...",
      style: {
        flex: 1,
        padding: "14px 18px",
        fontSize: 16,
        border: "2px solid var(--ink-16)",
        borderRadius: 10,
        fontFamily: "var(--font-body)",
        outline: "none",
        background: "var(--surface)",
        color: "var(--text)"
      }
    }), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn btn-primary",
      style: {
        padding: "14px 28px",
        fontSize: 15,
        whiteSpace: "nowrap"
      }
    }, "Search \u2192")), isOpen && hasSuggestions && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--surface)",
        border: "1px solid var(--ink-08)",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        marginTop: 4,
        maxHeight: 320,
        overflowY: "auto"
      }
    }, suggestions.subjects.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 12px",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase"
      }
    }, "Subjects"), suggestions.subjects.slice(0, 3).map(s => /*#__PURE__*/React.createElement("button", {
      key: s.slug,
      onClick: () => handleSelect("subject", s),
      style: {
        display: "block",
        width: "100%",
        padding: "8px 12px",
        textAlign: "left",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        borderBottom: "0.5px solid var(--ink-08)"
      },
      onMouseOver: e => e.currentTarget.style.background = "var(--surface-alt)",
      onMouseOut: e => e.currentTarget.style.background = "none"
    }, s.uniCount > 0 ? s.name + " ("+s.uniCount+" unis)" : s.name)), suggestions.universities.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 12px",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase"
      }
    }, "Universities"), suggestions.universities.slice(0, 3).map(u => /*#__PURE__*/React.createElement("button", {
      key: u.id,
      onClick: () => handleSelect("university", u),
      style: {
        display: "block",
        width: "100%",
        padding: "8px 12px",
        textAlign: "left",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        borderBottom: "0.5px solid var(--ink-08)"
      },
      onMouseOver: e => e.currentTarget.style.background = "var(--surface-alt)",
      onMouseOut: e => e.currentTarget.style.background = "none"
    }, u.subjectCount > 0 ? u.name + " · "+u.subjectCount+" subjects" : u.name)), suggestions.jobs.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 12px",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase"
      }
    }, "Career Paths"), suggestions.jobs.slice(0, 3).map((j, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => handleSelect("job", j),
      style: {
        display: "block",
        width: "100%",
        padding: "8px 12px",
        textAlign: "left",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        borderBottom: "0.5px solid var(--ink-08)"
      },
      onMouseOver: e => e.currentTarget.style.background = "var(--surface-alt)",
      onMouseOut: e => e.currentTarget.style.background = "none"
    }, j.title)))));
  }
  window.buildSearchIndex = buildSearchIndex;
  window.searchIndex = searchIndex;
  window.SearchBar = SearchBar;
})();