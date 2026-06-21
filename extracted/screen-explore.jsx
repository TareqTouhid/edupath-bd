// EduPath BD — Explore (subject grid + search + regional lens + bookmarks)

// ── localStorage bookmark helpers (no React state needed) ──
function getSaved() {
  try { return new Set(JSON.parse(localStorage.getItem("pf-saved") || "[]")); }
  catch { return new Set(); }
}
function toggleSaved(slug) {
  const s = getSaved();
  if (s.has(slug)) s.delete(slug); else s.add(slug);
  localStorage.setItem("pf-saved", JSON.stringify([...s]));
  window.dispatchEvent(new CustomEvent("pf-saved-changed", { detail: { slug } }));
  return s.has(slug);
}

function ScreenExplore({ go, setSubjectSlug }) {
  const [lens, setLens]   = useState("dhaka");
  const [field, setField] = useState("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => getSaved());

  // Listen for bookmark changes from other components
  useEffect(() => {
    const handler = () => setSaved(getSaved());
    window.addEventListener("pf-saved-changed", handler);
    return () => window.removeEventListener("pf-saved-changed", handler);
  }, []);

  const fields = [
    ["all", "All"], ["technology", "Technology"], ["business", "Business"],
    ["science", "Science"], ["social-science", "Social Science"],
    ["humanities", "Humanities"], ["environmental", "Environmental"], ["design", "Design"],
  ];

  const filtered = PFData.subjects.filter(s => {
    if (field !== "all" && s.field !== field) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = (s.name + " " + s.desc + " " + (PFData.FIELDS[s.field]?.label || "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* ── Sticky bar ── */}
      <div className="pf-stickybar">
        <div className="pf-stickybar__inner" style={{gap:10,flexWrap:"wrap"}}>

          {/* Search */}
          <div className="pf-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)",pointerEvents:"none"}}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className="pf-search"
              placeholder="Search subjects…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Regional lens */}
          <div className="pf-lens">
            <button className={lens === "dhaka"   ? "is-active" : ""} onClick={() => setLens("dhaka")}>Dhaka</button>
            <button className={lens === "outside" ? "is-active" : ""} onClick={() => setLens("outside")}>Outside Dhaka</button>
          </div>

          <div style={{flex:1}}/>

          {/* Field filter */}
          <div className="pf-tagrow">
            {fields.map(([k, l]) => (
              <button
                key={k}
                className={"pill" + (field === k ? " is-active" : "")}
                onClick={() => setField(k)}
                style={{fontSize:12,padding:"6px 12px",cursor:"pointer",border:"none",fontFamily:"inherit"}}
              >{l}</button>
            ))}
          </div>

        </div>
      </div>

      <div className="pf-page">
        <div className="pf-container">

          <SectionHead
            eyebrow={`${filtered.length} of ${PFData.subjects.length} subjects`}
            title="Browse what's possible."
            sub="Tap any subject to see the full profile — curriculum, real testimonials, and the honest salary breakdown."
          />

          {filtered.length === 0 ? (
            <div style={{padding:48,textAlign:"center",color:"var(--text-muted)",background:"var(--surface)",borderRadius:14,border:"1px solid var(--ink-08)"}}>
              No subjects match "{query}". Try a broader term.
            </div>
          ) : (
            <div className="pf-grid-3">
              {filtered.map(s => (
                <SubjectCardWithLens
                  key={s.slug}
                  subject={s}
                  lens={lens}
                  saved={saved.has(s.slug)}
                  onSave={e => { e.stopPropagation(); toggleSaved(s.slug); setSaved(getSaved()); }}
                  onClick={() => { setSubjectSlug(s.slug); go("detail"); }}
                />
              ))}
            </div>
          )}

          {/* Saved subjects shortcut */}
          {saved.size > 0 && (
            <div className="pf-saved-strip">
              <span>{saved.size} subject{saved.size > 1 ? "s" : ""} bookmarked</span>
              <button className="pf-link" style={{fontSize:13}} onClick={() => {
                setQuery(""); setField("all");
                const slugs = [...saved];
                // highlight saved ones — just scroll to first
                const firstCard = document.querySelector(`[data-slug="${slugs[0]}"]`);
                if (firstCard) firstCard.scrollIntoView({ behavior:"smooth", block:"center" });
              }}>
                View saved →
              </button>
            </div>
          )}

        </div>
      </div>

      <Footer go={go}/>
    </div>
  );
}

// SubjectCard variant with regional lens + bookmark button
function SubjectCardWithLens({ subject, lens, saved, onSave, onClick }) {
  const fieldLabel = PFData.FIELDS[subject.field]?.label || subject.field;
  const sal = subject.regional[lens === "dhaka" ? "dhaka" : "outside"].salary;
  return (
    <button
      className="pf-scard"
      onClick={onClick}
      type="button"
      data-slug={subject.slug}
      style={{position:"relative"}}
    >
      {/* Bookmark button */}
      <button
        className={"pf-bookmark" + (saved ? " is-saved" : "")}
        onClick={onSave}
        title={saved ? "Remove bookmark" : "Bookmark this subject"}
        type="button"
        aria-label={saved ? "Remove bookmark" : "Bookmark"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
      </button>

      <div className="pf-scard__body">
        <div className="pf-scard__meta">
          <span className="pill" style={{fontSize:11,padding:"4px 10px"}}>{fieldLabel}</span>
          <TrendPill trend={subject.trend}/>
        </div>
        <div className="pf-scard__name">{subject.name}</div>
        <div className="pf-scard__desc">{subject.desc}</div>
        <div className="pf-scard__hsc">
          {subject.hsc.map(h => <span key={h} className="pill" style={{fontSize:11,padding:"4px 10px"}}>{h}</span>)}
          {subject.math ? <span className="pill" style={{fontSize:11,padding:"4px 10px"}}>Math required</span> : null}
        </div>
        <DiffDots level={subject.difficulty}/>
        <div className="pf-scard__foot">
          <div className="pf-scard__sal">{sal}</div>
          <div className="pf-scard__arr">→</div>
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { ScreenExplore, getSaved, toggleSaved });
