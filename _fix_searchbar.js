// Restores the SearchBar component + search infrastructure
// as a global script block placed BEFORE ScreenLanding
const fs    = require('fs');
const babel = require('@babel/core');

// The original SearchBar JSX source (reconstructed from codebase knowledge)
const searchBarJSX = `
function buildSearchIndex() {
  const index = { subjects: [], universities: [], jobs: [] };
  if (window.PFData?.subjects) {
    index.subjects = window.PFData.subjects.map(s => ({
      type: "subject", slug: s.slug, name: s.name, desc: s.desc, field: s.field,
      searchText: (s.name + " " + s.desc + " " + (s.alts?.join(" ") || "")).toLowerCase(),
    }));
  }
  if (window.UGCData?.universities) {
    const unis = window.UGCData.universities;
    index.universities = (unis.public || []).concat(unis.private || []).concat(unis.international || [])
      .map(u => ({
        type: "university", id: u.id, name: u.name, city: u.city,
        tier: u.tier, category: u.category, cost: u.cost,
        searchText: (u.name + " " + (u.city || "")).toLowerCase(),
      }));
  }
  if (window.CareerData?.jobs) {
    const jobSet = new Set();
    window.PFData?.subjects?.forEach(s => {
      const jobs = window.CareerData.jobTitles(s.slug) || [];
      jobs.forEach(j => jobSet.add(j));
    });
    index.jobs = Array.from(jobSet).map(title => ({
      type: "job", title: title,
      searchText: title.toLowerCase(),
      salary: window.CareerData.bdSalary(title),
    }));
  }
  return index;
}

function searchIndex(query, index) {
  if (!query.trim()) return { subjects: [], universities: [], jobs: [] };
  const q = query.toLowerCase().trim();
  const results = { subjects: [], universities: [], jobs: [] };
  results.subjects    = (index.subjects    || []).filter(s => s.searchText.includes(q)).slice(0, 8);
  results.universities= (index.universities|| []).filter(u => u.searchText.includes(q)).slice(0, 8);
  results.jobs        = (index.jobs        || []).filter(j => j.searchText.includes(q)).slice(0, 8);
  return results;
}

function SearchBar({ onSearch, go }) {
  const [query, setQuery]           = React.useState("");
  const [index]                     = React.useState(() => buildSearchIndex());
  const [suggestions, setSuggestions] = React.useState(null);
  const [isOpen, setIsOpen]         = React.useState(false);

  const handleChange = (e) => {
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
    onSearch({ query: q, results });
    setQuery("");
    setIsOpen(false);
    setTimeout(() => go("search-results"), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const results = searchIndex(query, index);
      onSearch({ query, results });
      setQuery("");
      setIsOpen(false);
      setTimeout(() => go("search-results"), 0);
    }
  };

  const hasSuggestions = suggestions && (
    suggestions.subjects.length > 0 || suggestions.universities.length > 0 || suggestions.jobs.length > 0
  );

  return (
    <div style={{ position: "relative", marginBottom: 24 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search subjects, universities, careers..."
          style={{
            flex: 1, padding: "14px 18px", fontSize: 16,
            border: "2px solid var(--ink-16)", borderRadius: 10,
            fontFamily: "var(--font-body)", outline: "none",
            background: "var(--surface)", color: "var(--text)",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "14px 24px", background: "var(--green)", color: "white",
            border: "none", borderRadius: 10, fontSize: 15,
            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          Search →
        </button>
      </form>

      {isOpen && hasSuggestions && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
          background: "var(--surface)", border: "1px solid var(--ink-08)",
          borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          marginTop: 4, maxHeight: 320, overflowY: "auto",
        }}>
          {suggestions.subjects.length > 0 && (
            <div>
              <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Subjects</div>
              {suggestions.subjects.slice(0, 3).map(s => (
                <button key={s.slug} onClick={() => handleSelect("subject", s)}
                  style={{ display: "block", width: "100%", padding: "8px 12px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, borderBottom: "0.5px solid var(--ink-08)" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--surface-alt)"}
                  onMouseOut={e => e.currentTarget.style.background = "none"}
                >{s.name}</button>
              ))}
            </div>
          )}
          {suggestions.universities.length > 0 && (
            <div>
              <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Universities</div>
              {suggestions.universities.slice(0, 3).map(u => (
                <button key={u.id} onClick={() => handleSelect("university", u)}
                  style={{ display: "block", width: "100%", padding: "8px 12px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, borderBottom: "0.5px solid var(--ink-08)" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--surface-alt)"}
                  onMouseOut={e => e.currentTarget.style.background = "none"}
                >{u.name}</button>
              ))}
            </div>
          )}
          {suggestions.jobs.length > 0 && (
            <div>
              <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Career Paths</div>
              {suggestions.jobs.slice(0, 3).map((j, i) => (
                <button key={i} onClick={() => handleSelect("job", j)}
                  style={{ display: "block", width: "100%", padding: "8px 12px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 13, borderBottom: "0.5px solid var(--ink-08)" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--surface-alt)"}
                  onMouseOut={e => e.currentTarget.style.background = "none"}
                >{j.title}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.buildSearchIndex = buildSearchIndex;
window.searchIndex = searchIndex;
window.SearchBar = SearchBar;
`;

// Compile JSX → JS
const compiled = babel.transformSync(searchBarJSX, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  configFile: false,
  babelrc: false,
}).code;

const newBlock = `
<!-- ═══════════════════════════════════════════════════════════
     SEARCH INFRASTRUCTURE — buildSearchIndex, searchIndex, SearchBar
     Runs before ScreenLanding which uses <SearchBar>
     ═══════════════════════════════════════════════════════════ -->
<script type="text/javascript">
(function () {
  ${compiled.split('\n').join('\n  ')}
})();
</script>
`;

// Inject before SCREEN — LANDING
let html = fs.readFileSync('index.html', 'utf8');

// Remove the placeholder comment left by previous failed script
html = html.replace(
  '  // buildSearchIndex, searchIndex, SearchBar moved to global script block above\n',
  ''
);

// Insert the new block before the landing screen marker
const MARKER = 'SCREEN — LANDING';
if (!html.includes(MARKER)) {
  console.error('Could not find SCREEN — LANDING marker');
  process.exit(1);
}
// Find the full comment block start (<!-- comes before the ═══ chars)
const markerPos = html.indexOf(MARKER);
const commentStart = html.lastIndexOf('<!--', markerPos);
html = html.slice(0, commentStart) + newBlock + '\r\n' + html.slice(commentStart);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅  SearchBar injected before ScreenLanding');
console.log('   New file size:', Math.round(html.length / 1024), 'KB');
