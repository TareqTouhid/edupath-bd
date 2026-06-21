const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const START_MARKER = '<!-- ═══════════════════════════════════════════════════════════\r\n     SCREEN — ALL UNIVERSITIES\r\n     ═══════════════════════════════════════════════════════════ -->\r\n<script type="text/javascript">';
const END_MARKER = 'Object.assign(window, {\r\n    ScreenAllUniversities\r\n  });\r\n})();\r\n</script>';

let startPos = h.indexOf(START_MARKER);
// Fallback: find the comment block that contains SCREEN — ALL UNIVERSITIES
if (startPos === -1) {
  const midPos = h.indexOf('SCREEN — ALL UNIVERSITIES');
  if (midPos !== -1) startPos = h.lastIndexOf('<!-- ═', midPos);
}
let endPos = h.indexOf(END_MARKER, startPos);
if (endPos === -1) {
  // Try alternate ending
  endPos = h.indexOf('ScreenAllUniversities\r\n  });\r\n})();\r\n</script>', startPos);
}
if (endPos !== -1) endPos += (h.indexOf('</script>', endPos) - endPos) + '</script>'.length;

if (startPos === -1 || endPos <= startPos) {
  console.error('Markers not found, start:', startPos, 'end:', endPos); process.exit(1);
}

const NEW_BLOCK = `<!-- ═══════════════════════════════════════════════════════════
     SCREEN — ALL UNIVERSITIES
     ═══════════════════════════════════════════════════════════ -->
<script type="text/javascript">
(function () {
  const { useState, useEffect, useMemo } = React;

  function UniCard({ uni, onClick }) {
    const subjectCount = window.UniSubjects && window.UniSubjects[uni.id]
      ? window.UniSubjects[uni.id].length
      : null;
    return React.createElement("button", {
      onClick,
      style: {
        padding: "20px 20px 18px",
        background: "var(--surface)",
        border: "1px solid var(--ink-08)",
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        display: "flex",
        flexDirection: "column",
        gap: 6
      },
      onMouseOver: e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; },
      onMouseOut:  e => { e.currentTarget.style.borderColor = "var(--ink-08)"; e.currentTarget.style.boxShadow = "none"; }
    },
      React.createElement("h3", {
        style: {
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.3,
          color: "var(--text)",
          margin: 0
        }
      }, uni.name),
      React.createElement("p", {
        style: {
          fontSize: 12,
          color: subjectCount ? "var(--green)" : "var(--text-muted)",
          margin: 0,
          fontWeight: subjectCount ? 500 : 400
        }
      }, subjectCount ? "Subjects: " + subjectCount : "Not listed yet")
    );
  }

  function ScreenAllUniversities({ go, setUniversitySlug }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [dataReady, setDataReady] = useState(
      !!(window.UGCData && window.UGCData.public && window.UGCData.public.length)
    );

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

    const allUnis = useMemo(() => {
      if (!dataReady || !window.UGCData) return [];
      return (window.UGCData.public || []).map(u => ({ ...u, _type: "public" }))
        .concat((window.UGCData.private || []).map(u => ({ ...u, _type: "private" })))
        .concat((window.UGCData.international || []).map(u => ({ ...u, _type: "international" })));
    }, [dataReady]);

    const filtered = useMemo(() => {
      let result = allUnis;
      if (typeFilter !== "all") result = result.filter(u => u._type === typeFilter);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(u =>
          u.name.toLowerCase().includes(q) ||
          (u.short && u.short.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q))
        );
      }
      if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      else if (sortBy === "city") result = [...result].sort((a, b) => (a.city || "").localeCompare(b.city || ""));
      return result;
    }, [allUnis, typeFilter, searchQuery, sortBy]);

    if (!dataReady) return React.createElement("div", {
      style: { padding: "80px 24px", textAlign: "center", color: "var(--text-muted)" }
    }, "Loading...");

    const inputStyle = {
      flex: 1, minWidth: 200, padding: "10px 16px", fontSize: 14,
      border: "1px solid var(--ink-08)", borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-body)", outline: "none", background: "var(--surface)"
    };
    const selectStyle = {
      padding: "10px 14px", fontSize: 14,
      border: "1px solid var(--ink-08)", borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-body)", cursor: "pointer", background: "var(--surface)"
    };

    const listed   = allUnis.filter(u => window.UniSubjects && window.UniSubjects[u.id]).length;
    const unlisted = allUnis.length - listed;

    return React.createElement("div", { style: { padding: "48px 0 80px" } },
      React.createElement("div", { className: "pf-container" },
        React.createElement("button", {
          className: "pf-link",
          onClick: () => go("landing"),
          style: { fontSize: 13, marginBottom: 24 }
        }, "← Back to home"),
        React.createElement("h1", {
          className: "display-2",
          style: { fontSize: 40, marginBottom: 8 }
        }, allUnis.length + "+ universities in Bangladesh"),
        React.createElement("p", {
          style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }
        },
          listed + " with subject data · " + unlisted + " not yet listed · click any to explore"
        ),
        React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" } },
          React.createElement("input", {
            type: "text",
            placeholder: "Search by name, short code, or city…",
            value: searchQuery,
            onChange: e => setSearchQuery(e.target.value),
            style: inputStyle
          }),
          React.createElement("select", {
            value: typeFilter,
            onChange: e => setTypeFilter(e.target.value),
            style: selectStyle
          },
            React.createElement("option", { value: "all" },   "All types"),
            React.createElement("option", { value: "public" }, "Public"),
            React.createElement("option", { value: "private"}, "Private"),
            React.createElement("option", { value: "international" }, "International")
          ),
          React.createElement("select", {
            value: sortBy,
            onChange: e => setSortBy(e.target.value),
            style: selectStyle
          },
            React.createElement("option", { value: "name" }, "Sort by name"),
            React.createElement("option", { value: "city" }, "Sort by city")
          )
        ),
        React.createElement("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12
          }
        },
          filtered.map(uni => React.createElement(UniCard, {
            key: uni.id,
            uni: uni,
            onClick: () => { setUniversitySlug(uni.id); go("university-detail"); }
          }))
        ),
        filtered.length === 0 && React.createElement("div", {
          style: { textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }
        },
          React.createElement("p", null, "No universities found matching your search")
        )
      )
    );
  }

  Object.assign(window, { ScreenAllUniversities });
})();
</script>`.replace(/\n/g, '\r\n');

h = h.slice(0, startPos) + NEW_BLOCK + h.slice(endPos);
fs.writeFileSync('index.html', h, 'utf8');
console.log('Done. Size:', Math.round(h.length / 1024), 'KB');
