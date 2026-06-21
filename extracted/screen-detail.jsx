// EduPath BD — Subject Detail

function ScreenDetail({ go, subjectSlug }) {
  const subj = PFData.subjects.find(s => s.slug === subjectSlug) || PFData.subjects[0];
  const [lens, setLens] = useState("dhaka");
  const region = subj.regional[lens === "dhaka" ? "dhaka" : "outside"];
  const intl = subj.regional.intl;
  const myStories = PFData.testimonials.filter(t => t.subjectSlug === subj.slug);
  const fieldLabel = PFData.FIELDS[subj.field].label;

  return (
    <div>
      {/* Head */}
      <div className="pf-detail-head">
        <div className="pf-container">
          <div className="pf-detail-head__top">
            <button className="pf-link" style={{color:"rgba(255,255,255,0.85)"}} onClick={() => go("explore")}>← Back to subjects</button>
            <div className="pf-lens" style={{background:"rgba(255,255,255,0.08)",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.18)"}}>
              <button className={lens === "dhaka" ? "is-active" : ""} onClick={() => setLens("dhaka")} style={{color: lens==='dhaka' ? '#fff' : 'rgba(255,255,255,0.78)'}}>Dhaka</button>
              <button className={lens === "outside" ? "is-active" : ""} onClick={() => setLens("outside")} style={{color: lens==='outside' ? '#fff' : 'rgba(255,255,255,0.78)'}}>Outside Dhaka</button>
            </div>
          </div>
          <div className="pf-detail-head__pills">
            <span className="pill">{fieldLabel}</span>
            <TrendPill trend={subj.trend}/>
            <ConfidencePill tier={subj.confidence}/>
          </div>
          <h1 className="display-2">{subj.name}</h1>
          <p className="pf-detail-head__desc">{subj.desc}</p>
          <div className="pf-detail-head__facts">
            <span>HSC: {subj.hsc.join(" · ")}</span>
            <span>·</span>
            <span>Difficulty: {["Low","Moderate","High","Very High"][subj.difficulty - 1]}</span>
            <span>·</span>
            <span>Math required: {subj.math ? "Yes" : "No"}</span>
            <span>·</span>
            <span>{myStories.length} {myStories.length === 1 ? "voice" : "voices"}</span>
          </div>
        </div>
      </div>

      {/* Regret signal — prominent on subjects where the data flags a serious caveat */}
      {subj.regretSignal ? (
        <section style={{padding: "32px 0 0"}}>
          <div className="pf-container">
            <div className="honesty" style={{display:"flex",gap:18,alignItems:"flex-start",padding:"22px 26px",borderLeftWidth:6}}>
              <div style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:48,lineHeight:1,color:"var(--terracotta)",letterSpacing:"-0.02em",flexShrink:0}}>{subj.regretSignal.rate}%</div>
              <div>
                <div style={{fontFamily:"var(--font-body)",fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--terracotta)",marginBottom:6}}>Honest signal</div>
                <div style={{fontSize:15,lineHeight:1.5,color:"var(--text)"}}>{subj.regretSignal.note}</div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Curriculum timeline */}
      <section className="pf-detail-section">
        <div className="pf-container">
          <div className="pf-section-head">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--green-dark)"}}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <h2 className="h2">{subj.curriculumStyle === "vertical" ? "The curriculum, two phases" : "The curriculum, four years"}</h2>
          </div>
          {subj.curriculumStyle === "vertical" ? (
            <div className="pf-vtimeline">
              {subj.curriculum.map((p, i) => (
                <div key={i} className="pf-vphase">
                  <div className="pf-vphase__rail"><span className="pf-vphase__dot"/></div>
                  <div className="pf-vphase__body">
                    <div className="pf-vphase__year">{p.year}</div>
                    <h4>{p.title}</h4>
                    <ul>{p.items.map(it => <li key={it}>{it}</li>)}</ul>
                    {p.note ? <div className={"pf-tphase__note" + (p.noteTone === "good" ? " good" : "")}>{p.note}</div> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pf-timeline">
              {subj.curriculum.map((p, i) => (
                <div key={i} className="pf-tphase">
                  <div className="pf-tphase__year">
                    <span className="pf-tphase__dot"/>
                    <span className="pf-tphase__yr-label">{p.year}</span>
                  </div>
                  <h4>{p.title}</h4>
                  <ul>{p.items.map(it => <li key={it}>{it}</li>)}</ul>
                  {p.note ? (
                    <div className={"pf-tphase__note" + (p.noteTone === "good" ? " good" : "")}>{p.note}</div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Careers */}
      <section className="pf-detail-section">
        <div className="pf-container">
          <div className="pf-section-head">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--green-dark)"}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <h2 className="h2">Where graduates actually end up</h2>
          </div>
          <div className="pf-careers">
            <div className="pf-career-col">
              <h3>🇧🇩 In Bangladesh — {lens === "dhaka" ? "Dhaka" : "Outside Dhaka"}</h3>
              <ul>{region.careers.map(c => <li key={c}>{c}</li>)}</ul>
              <div className="sal">{region.salary}</div>
              <div className="src">Based on 2024 bdjobs data · verify independently</div>
            </div>
            <div className="pf-career-col">
              <h3>🌐 Internationally</h3>
              <ul>{intl.careers.map(c => <li key={c}>{c}</li>)}</ul>
              <div className="sal">{intl.salary}</div>
              <div className="src">Indicative — GBP/EUR/USD vary by market</div>
            </div>
          </div>
          <div style={{marginTop:18}}>
            <HonestyBox label={lens === "dhaka" ? "Regional reality — Dhaka" : "Regional reality — Outside Dhaka"}>
              {region.note}
            </HonestyBox>
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="pf-detail-section">
        <div className="pf-container">
          <div className="pf-section-head">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--green-dark)"}}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <h2 className="h2">Where to study it</h2>
          </div>
          <div className="pf-unis">
            <div className="pf-unis__row">
              <div className="pf-unis__lbl">Public</div>
              {subj.unis.public.map(u => <span key={u} className="pf-unis__pill">{u}</span>)}
            </div>
            <div className="pf-unis__row">
              <div className="pf-unis__lbl">Private</div>
              {subj.unis.private.map(u => <span key={u} className="pf-unis__pill">{u}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* What people say */}
      <section className="pf-detail-section">
        <div className="pf-container">
          <div className="pf-section-head">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--green-dark)"}}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <h2 className="h2">What people say</h2>
          </div>
          {myStories.length === 0 ? (
            <HonestyBox label="No voices yet">
              We don't have testimonials for this subject yet. Treat the data above as early signal, not authority. Know someone who studied this? <span className="pf-link" style={{textDecoration:"underline"}}>Invite them to share →</span>
            </HonestyBox>
          ) : myStories.length < 3 ? (
            <div style={{marginBottom:18}}>
              <HonestyBox label={`Only ${myStories.length} voice(s)`}>
                Treat this information as early signal, not authority. Know someone who studied this? <span className="pf-link" style={{textDecoration:"underline"}}>Invite them to share →</span>
              </HonestyBox>
            </div>
          ) : null}
          <div className="pf-grid-2">
            {myStories.slice(0, 4).map((t, i) => (
              <TestimonialCard key={i} t={t} expanded={false} compact={true}/>
            ))}
          </div>
        </div>
      </section>

      {/* Alternative paths */}
      <section className="pf-detail-section" style={{borderBottom:"none"}}>
        <div className="pf-container">
          <div className="pf-section-head">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--terracotta)"}}>
              <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
            <h2 className="h2">If {subj.name} feels out of reach…</h2>
          </div>
          <p className="lead" style={{maxWidth:680,marginBottom:24}}>Adjacent paths that scratch a similar itch — open to more HSC groups or with a friendlier difficulty curve.</p>
          <div className="pf-grid-3">
            {subj.alts.map(slug => {
              const alt = PFData.subjects.find(s => s.slug === slug);
              if (!alt) return null;
              return <SubjectCard key={slug} subject={alt} onClick={() => go("detail", { subjectSlug: slug })}/>;
            })}
          </div>
        </div>
      </section>

      {/* End-of-detail CTA — primary + secondary, matching the platform pair */}
      <section className="pf-cta-strip">
        <div className="pf-container" data-pf-reveal>
          <div className="micro" style={{color: "rgba(255,255,255,0.7)", marginBottom: 14}}>Next</div>
          <h2 style={{marginBottom: 12}}>Take what you've read into the matcher.</h2>
          <p style={{fontSize: 16, lineHeight: 1.5, color: "rgba(255,255,255,0.8)", maxWidth: 560, margin: "0 auto 24px"}}>14 questions. 3 minutes. The matcher uses {subj.name} and the other 14 profiled subjects as candidates — and respects the evidence tier on each.</p>
          <div style={{display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap"}}>
            <button className="btn btn-on-green" onClick={() => go("matcher")}>Find my path →</button>
            <button className="pf-link" style={{color:"rgba(255,255,255,0.75)"}} onClick={() => go("stories")}>Read real responses →</button>
          </div>
        </div>
      </section>

      <Footer go={go}/>
    </div>
  );
}

Object.assign(window, { ScreenDetail });
