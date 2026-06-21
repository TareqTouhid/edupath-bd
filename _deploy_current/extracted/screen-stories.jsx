// EduPath BD — Stories wall

function ScreenStories({ go }) {
  const [filter, setFilter]     = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [query, setQuery]       = useState("");
  const [expanded, setExpanded] = useState(new Set());

  const toggle = (i) => {
    const n = new Set(expanded);
    if (n.has(i)) n.delete(i); else n.add(i);
    setExpanded(n);
  };

  const filtered = PFData.testimonials.filter(t => {
    if (filter === "yes"    && t.again !== "yes") return false;
    if (filter === "no"     && t.again !== "no")  return false;
    if (filter === "abroad" && t.country === "BD") return false;
    if (fieldFilter !== "all") {
      const subj = PFData.subjects.find(s => s.slug === t.subjectSlug);
      const fieldOnSubject = subj ? subj.field : t.field;
      if (fieldOnSubject !== fieldFilter) return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = [t.good, t.bad, t.uni, t.role, t.subjectName].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* ── Sticky filter bar ── */}
      <div className="pf-stickybar">
        <div className="pf-stickybar__inner" style={{gap:10,flexWrap:"wrap"}}>

          {/* Sentiment filters */}
          <div className="pf-tagrow">
            {[
              { id:"all",    label:"All" },
              { id:"yes",    label:"Chose again" },
              { id:"no",     label:"Changed path" },
              { id:"abroad", label:"Now abroad" },
            ].map(f => (
              <button
                key={f.id}
                className={"pill" + (filter === f.id ? " is-active" : "")}
                onClick={() => setFilter(f.id)}
                style={{fontSize:12,padding:"6px 12px",border:"none",cursor:"pointer",fontFamily:"inherit"}}
              >{f.label}</button>
            ))}
          </div>

          <div style={{flex:1}}/>

          {/* Text search */}
          <div className="pf-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-muted)",pointerEvents:"none"}}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className="pf-search pf-search--sm"
              placeholder="Search stories…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Field filter */}
          <select
            value={fieldFilter}
            onChange={e => setFieldFilter(e.target.value)}
            style={{padding:"8px 14px",borderRadius:100,border:"1px solid var(--ink-16)",background:"var(--surface)",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}
          >
            <option value="all">All fields</option>
            {Object.entries(PFData.FIELDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

        </div>
      </div>

      <div className="pf-page">
        <div className="pf-container">

          <SectionHead
            eyebrow={`${filtered.length} of ${PFData.testimonials.length} responses`}
            title="What graduates actually say."
            sub="Unedited. Reviewed for authenticity, not filtered for positivity."
          />

          {/* ── Share nudge ── */}
          <div className="pf-stories-nudge">
            <span>A graduate? Your experience helps the next student.</span>
            <button className="btn btn-primary" onClick={() => go("contribute")} style={{fontSize:13,padding:"9px 18px",whiteSpace:"nowrap",flexShrink:0}}>
              Share my experience →
            </button>
          </div>

          {/* ── Cards grid ── */}
          {filtered.length === 0 ? (
            <div style={{padding:48,textAlign:"center",background:"var(--surface)",borderRadius:14,border:"1px solid var(--ink-08)"}}>
              <h3 className="h3" style={{marginBottom:8}}>
                {query ? `No results for "${query}"` : "No responses match this filter yet."}
              </h3>
              <p style={{fontSize:15,color:"var(--text-muted)",maxWidth:400,margin:"8px auto 20px",lineHeight:1.5}}>
                {query ? "Try different keywords." : "Be the first in this category."}
              </p>
              {!query && <button className="btn btn-primary" onClick={() => go("contribute")}>Share my experience →</button>}
            </div>
          ) : (
            <div className="pf-grid-2">
              {filtered.map((t, i) => (
                <TestimonialCard
                  key={t.name + i}
                  t={t}
                  expanded={expanded.has(i)}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          )}

          {/* ── Bottom CTA ── */}
          {filtered.length > 0 && (
            <div className="pf-stories-bottom">
              <div style={{fontFamily:"var(--font-display)",fontSize:20,fontWeight:600,lineHeight:1.2}}>
                Add your experience.
              </div>
              <button className="btn btn-primary" onClick={() => go("contribute")} style={{flexShrink:0}}>
                Share my experience →
              </button>
            </div>
          )}

        </div>
      </div>

      <Footer go={go}/>
    </div>
  );
}

Object.assign(window, { ScreenStories });
