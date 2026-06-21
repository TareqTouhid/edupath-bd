var React={useState:()=>[null,()=>{}],useEffect:()=>{},useMemo:(f)=>f(),createElement:()=>{}};
var window={UGCData:{public:[],private:[],international:[]},UniSubjects:{}};
const UNI_IMAGES = {
    buet:  "https://upload.wikimedia.org/wikipedia/commons/1/15/BUET_Campus_01.jpg",
    du:    "https://upload.wikimedia.org/wikipedia/commons/6/6b/Karjon_hall.JPG",
    bracu: "https://upload.wikimedia.org/wikipedia/commons/5/53/BRAC_University.jpg",
    nsu:   "https://upload.wikimedia.org/wikipedia/commons/1/19/North_South_University_Campus_01.jpg",
    kuet:  "https://upload.wikimedia.org/wikipedia/commons/1/17/KUET_campus_landscape.jpg",
    ruet:  "https://upload.wikimedia.org/wikipedia/commons/b/bc/Rajshahi_University_of_Engineering_and_Technology_%28RUET%29_Campus.jpg",
  };
  function ScreenAllUniversities({
    go,
    setUniversitySlug
  }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [dataReady, setDataReady] = useState(!!(window.UGCData && window.UGCData.public && window.UGCData.public.length));
    useEffect(() => {
      if (dataReady) return;
      const t = setInterval(() => {
        if (window.UGCData && window.UGCData.public && window.UGCData.public.length) {
          setDataReady(true);
          clearInterval(t);
        }
      }, 80);
      return () => clearInterval(t);
    }, []);
    const allUnis = (dataReady && window.UGCData) ? (window.UGCData.public || []).concat(window.UGCData.private || []).concat(window.UGCData.international || []) : [];
    const filtered = useMemo(() => {
      let result = allUnis;

      // Type filter
      if (typeFilter !== "all") {
        result = result.filter(u => u.type === typeFilter);
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(u => u.name.toLowerCase().includes(q) || u.short && u.short.toLowerCase().includes(q) || u.city && u.city.toLowerCase().includes(q));
      }

      // Sort
      if (sortBy === "name") {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "city") {
        result = [...result].sort((a, b) => (a.city || "").localeCompare(b.city || ""));
      }
      return result;
    }, [allUnis, typeFilter, searchQuery, sortBy]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "48px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "pf-container"
    }, /*#__PURE__*/React.createElement("button", {
      className: "pf-link",
      onClick: () => go("landing"),
      style: {
        fontSize: 13,
        marginBottom: 24
      }
    }, "\u2190 Back to home"), /*#__PURE__*/React.createElement("h1", {
      className: "display-2",
      style: {
        fontSize: 44,
        marginBottom: 32
      }
    }, "All ", allUnis.length, "+ universities in Bangladesh"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16,
        marginBottom: 32,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search by name, city...",
      value: searchQuery,
      onChange: e => setSearchQuery(e.target.value),
      style: {
        flex: 1,
        minWidth: 200,
        padding: "10px 14px",
        fontSize: 14,
        border: "1px solid var(--ink-08)",
        borderRadius: 8,
        fontFamily: "var(--font-body)"
      }
    }), /*#__PURE__*/React.createElement("select", {
      value: typeFilter,
      onChange: e => setTypeFilter(e.target.value),
      style: {
        padding: "10px 14px",
        fontSize: 14,
        border: "1px solid var(--ink-08)",
        borderRadius: 8,
        fontFamily: "var(--font-body)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "all"
    }, "All types"), /*#__PURE__*/React.createElement("option", {
      value: "public"
    }, "Public"), /*#__PURE__*/React.createElement("option", {
      value: "private"
    }, "Private"), /*#__PURE__*/React.createElement("option", {
      value: "international"
    }, "International")), /*#__PURE__*/React.createElement("select", {
      value: sortBy,
      onChange: e => setSortBy(e.target.value),
      style: {
        padding: "10px 14px",
        fontSize: 14,
        border: "1px solid var(--ink-08)",
        borderRadius: 8,
        fontFamily: "var(--font-body)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "name"
    }, "Sort by name"), /*#__PURE__*/React.createElement("option", {
      value: "city"
    }, "Sort by city"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16
      }
    }, filtered.map(uni => /*#__PURE__*/React.createElement("button", {
      key: uni.id,
      onClick: () => {
        setUniversitySlug(uni.id);
        go("university-detail");
      },
      style: {
        padding: 20,
        background: "var(--surface)",
        border: "1px solid var(--ink-08)",
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        overflow: "hidden",
        transition: "all 200ms ease"
      },
      onMouseOver: e => {
        e.currentTarget.style.borderColor = "var(--green)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      },
      onMouseOut: e => {
        e.currentTarget.style.borderColor = "var(--ink-08)";
        e.currentTarget.style.boxShadow = "none";
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 120, overflow: "hidden",
        margin: "-20px -20px 14px -20px",
        background: "var(--ink-04)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }
    }, UNI_IMAGES[uni.id]
      ? /*#__PURE__*/React.createElement("img", {
          src: UNI_IMAGES[uni.id], alt: uni.name,
          style: { width: "100%", height: "100%", objectFit: "cover" }
        })
      : /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: "var(--font-display)", fontSize: 26,
            fontWeight: 700, color: "var(--green)", opacity: 0.4
          }
        }, (uni.short || uni.name.slice(0, 4)).toUpperCase())
    ), /*#__PURE__*/React.createElement("h3", {
      style: { fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }
    }, uni.name), /*#__PURE__*/React.createElement("p", {
      style: { fontSize: 12, color: "var(--text-muted)" }
    }, (window.UniSubjects && window.UniSubjects[uni.id])
      ? window.UniSubjects[uni.id].length + " subjects offered"
      : (uni.focus ? uni.focus.charAt(0).toUpperCase() + uni.focus.slice(1) + " university" : "")
    ))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "48px 0",
        color: "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement("p", null, "No universities found matching your search")))));
  }
  Object.assign(window, {
    ScreenAllUniversities
  });
})();
<