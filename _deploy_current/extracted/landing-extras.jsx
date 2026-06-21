// EduPath BD — Additional landing sections
// Composed by screen-landing.jsx into a 14-section editorial scroll.

// ── 1. Pinned "brutal reality" — three stats appear sequentially over a
//        cream→green background transition, with floating quote snippets behind ──
function PinnedRealitySection() {
  const fragments = [
    { q: "All bad experience.", who: "Physics · DU · class of 2013", x: "12%", y: "18%", r: -8 },
    { q: "Topology, fuzzy mathematics are hard topics… and teachers are not fully efficient.", who: "Mathematics · DU · 2008", x: "62%", y: "24%", r: 4 },
    { q: "Outside Dhaka, no jobs really.", who: "Civil Eng. · 2017", x: "8%", y: "62%", r: 6 },
    { q: "I wish someone had told me the math gets like this in year 2.", who: "CSE · BUET · 2018", x: "70%", y: "70%", r: -3 },
    { q: "Course structure was a bit off — we never received proper training in programming.", who: "Physics · DU · 2013 · now Syracuse", x: "44%", y: "8%", r: 2 },
    { q: "Lack of professional recognition and opportunity with a bare minimum salary.", who: "Journalism · JU · 2014", x: "38%", y: "82%", r: -5 },
  ];
  return (
    <section className="pf-reality" data-pf-reality>
      <div className="pf-reality__pin">
        <div className="pf-reality__bg" data-pf-reality-bg/>
        <div className="pf-reality__quotes" aria-hidden="true">
          {fragments.map((f, i) => (
            <div
              key={i}
              className="pf-reality__quote"
              data-pf-reality-quote
              style={{ left: f.x, top: f.y, transform: `rotate(${f.r}deg)` }}
            >
              <div>"{f.q}"</div>
              <div className="pf-reality__qwho">{f.who}</div>
            </div>
          ))}
        </div>
        <div className="pf-reality__inner">
          <div className="pf-reality__eyebrow micro" data-pf-reality-eyebrow>The brutal reality, in three numbers</div>
          <div className="pf-reality__stack">
            <div className="pf-reality__stat" data-pf-reality-stat>
              <div className="pf-reality__num">56</div>
              <div className="pf-reality__lbl">We surveyed fifty-six recent Bangladeshi graduates.</div>
            </div>
            <div className="pf-reality__stat" data-pf-reality-stat>
              <div className="pf-reality__num"><span className="pf-reality__num--bold">9</span><span className="pf-reality__num--frac"> / 56</span></div>
              <div className="pf-reality__lbl">One in six said they would not recommend their own subject to anyone.</div>
            </div>
            <div className="pf-reality__stat" data-pf-reality-stat>
              <div className="pf-reality__num"><span className="pf-reality__num--bold">24</span><span className="pf-reality__num--frac"> / 31</span></div>
              <div className="pf-reality__lbl">Of the subjects they covered, twenty-four are backed by just one person's voice.</div>
            </div>
            <div className="pf-reality__rule" data-pf-reality-rule>
              <div className="pf-reality__rule-q">Coverage can be broad. <span style={{color:"var(--gold)"}}>Confidence must be honest.</span></div>
              <div className="pf-reality__rule-attr">— Core design rule, Build Plan §1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 2. Featured testimonial at editorial scale ──
function FeaturedTestimonialSection() {
  const t = PFData.testimonials.find(t => t.id === "resp_055"); // Nuzhat F., Physics, regrets
  if (!t) return null;
  return (
    <section className="pf-landing-section">
      <div className="pf-container pf-narrow" data-pf-reveal>
        <div className="micro" style={{marginBottom: 12, color: "var(--terracotta)"}}>One real voice · response 055 of 56</div>
        <div style={{position: "relative"}}>
          <blockquote className="pf-feature-quote">
            Course structure was a bit off. We never received proper training in programming, which is a prerequisite for solving Physics problems — while we had to study random subjects which we never required in the end.
          </blockquote>
          <div className="pf-feature-attribution">
            <Avatar subjectName="Physics" field="science" size={56}/>
            <div>
              <div style={{fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600}}>Physics graduate · class of 2013</div>
              <div className="small" style={{color: "var(--text-muted)"}}>University of Dhaka · now PhD candidate in Syracuse, USA · {flagFor(t.country)}</div>
              <div style={{marginTop: 10}}>
                <span className="pill pill-sw" style={{fontSize: 12}}>Would not recommend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 3. Confidence tier explainer ──
function ConfidenceTierSection() {
  return (
    <section className="pf-landing-section">
      <div className="pf-container" data-pf-reveal>
        <div className="micro" style={{marginBottom: 12}}>The trust architecture</div>
        <h2 className="display-2" style={{fontSize: 44, lineHeight: 1.1, maxWidth: 760, marginBottom: 20}}>
          Every subject carries a visible evidence tier.
        </h2>
        <p className="lead" style={{maxWidth: 720, marginBottom: 40}}>
          Computed live from the testimonial count. Updates as the dataset grows. The matcher reads the tier directly — it cannot dress a thin subject up as a confident recommendation.
        </p>

        <div className="pf-tier-grid" data-pf-stagger>
          <div className="pf-tier-card pf-tier-card--verified" data-pf-stagger-item>
            <div className="pf-tier-dot"/>
            <div className="pf-tier-label">Verified</div>
            <div className="pf-tier-criteria">Verified profile + 8 or more responses</div>
            <div className="pf-tier-body">Full profile shown. The matcher may recommend confidently. Today: <strong>Computer Science &amp; Engineering</strong> (11 responses).</div>
          </div>
          <div className="pf-tier-card pf-tier-card--emerging" data-pf-stagger-item>
            <div className="pf-tier-dot"/>
            <div className="pf-tier-label">Emerging</div>
            <div className="pf-tier-criteria">Profile present OR 3–7 responses</div>
            <div className="pf-tier-body">Shown with a "limited data" note. The matcher suggests tentatively, with caveats. Today: <strong>Physics, BBA, Bangla, Civil Engineering, Mathematics</strong>.</div>
          </div>
          <div className="pf-tier-card pf-tier-card--listed" data-pf-stagger-item>
            <div className="pf-tier-dot"/>
            <div className="pf-tier-label">Listed only</div>
            <div className="pf-tier-criteria">Fewer than 3 responses · no verified profile</div>
            <div className="pf-tier-body">Appears in the directory and Stories. The matcher mentions it only as "worth investigating" and <strong>never ranks it #1</strong>. Today: 16 of 31 subjects sit here.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4. Featured subjects — horizontal scroll pinned ──
function FeaturedSubjectsSection({ go, setSubjectSlug }) {
  const featured = ["cse", "physics", "bba", "uiux", "agriculture", "journalism"]
    .map(slug => PFData.subjects.find(s => s.slug === slug))
    .filter(Boolean);

  return (
    <section className="pf-hscroll" data-pf-hscroll>
      <div className="pf-hscroll__sticky">
        <div className="pf-container" style={{marginBottom: 28}}>
          <div className="micro" style={{marginBottom: 12}}>Six subjects, in their honest light</div>
          <h2 className="display-2" style={{lineHeight: 1.1, maxWidth: 720}}>
            Scroll sideways. The data has nowhere to hide.
          </h2>
        </div>
        <div className="pf-hscroll__track" data-pf-hscroll-track>
          {featured.map(s => {
            const tcount = PFData.testimonials.filter(t => t.subjectSlug === s.slug).length;
            const noCount = PFData.testimonials.filter(t => t.subjectSlug === s.slug && t.again === "no").length;
            const regretRate = tcount ? Math.round((noCount / tcount) * 100) : 0;
            return (
              <button
                key={s.slug}
                className="pf-hcard"
                onClick={() => { setSubjectSlug(s.slug); go("detail"); }}
              >
                <div className="pf-hcard__meta">
                  <span className="pill" style={{fontSize:11,padding:"4px 10px"}}>{PFData.FIELDS[s.field].label}</span>
                  <span className="pf-hcard__count">{tcount} {tcount === 1 ? "voice" : "voices"}</span>
                </div>
                <h3 className="pf-hcard__name">{s.name}</h3>
                <p className="pf-hcard__desc">{s.desc}</p>
                <div className="pf-hcard__data">
                  <div className="pf-hcard__row">
                    <span className="pf-hcard__lbl">Salary, Dhaka</span>
                    <span className="pf-hcard__val">{s.regional.dhaka.salary}</span>
                  </div>
                  <div className="pf-hcard__row">
                    <span className="pf-hcard__lbl">Salary, outside Dhaka</span>
                    <span className="pf-hcard__val">{s.regional.outside.salary}</span>
                  </div>
                  {regretRate > 0 && (
                    <div className="pf-hcard__row pf-hcard__row--alert">
                      <span className="pf-hcard__lbl">Regret rate</span>
                      <span className="pf-hcard__val" style={{color:"var(--terracotta)"}}>{regretRate}% ({noCount} of {tcount})</span>
                    </div>
                  )}
                  <div className="pf-hcard__row">
                    <span className="pf-hcard__lbl">Confidence tier</span>
                    <span className="pf-hcard__val">{(s.confidence || "listed").replace(/^./, c => c.toUpperCase())}</span>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="pf-hcard pf-hcard--more">
            <h3 className="pf-hcard__name" style={{fontSize: 28}}>+ 25 more subjects in the directory</h3>
            <p className="pf-hcard__desc">From Architecture to Zoology. Sixteen are <em>Listed only</em> — they appear here because the data isn't there yet.</p>
            <button className="btn btn-primary" onClick={() => go("explore")}>Browse the directory →</button>
          </div>
        </div>
        <div className="pf-hscroll__hint" data-pf-hscroll-hint>↔ scroll to advance</div>
      </div>
    </section>
  );
}

// ── 5. Real questions from real students ──
function RealQuestionsSection({ go }) {
  const questions = [
    {
      q: "Should I choose CSE or EEE? I like both equally.",
      tag: "Science group",
      route: "matcher",
    },
    {
      q: "I got GPA 4.2 in HSC Science. Which public universities are realistic for me?",
      tag: "Admission planning",
      route: "matcher",
    },
    {
      q: "What do CSE graduates actually earn — in Dhaka and outside?",
      tag: "Salary reality",
      route: "detail",
      slug: "cse",
    },
    {
      q: "I want to end up in Korea or Australia within 5 years. Which subject opens the most doors?",
      tag: "Study abroad",
      route: "matcher",
    },
    {
      q: "Is a private university worth the cost if I can't get into a public one?",
      tag: "Budget decision",
      route: "matcher",
    },
    {
      q: "My family wants MBBS. I want design or tech. What are my real options?",
      tag: "Family pressure",
      route: "matcher",
    },
    {
      q: "Can I build a tech career without a pure engineering degree?",
      tag: "Alternative paths",
      route: "explore",
    },
    {
      q: "What do Physics graduates from DU actually do for work after graduating?",
      tag: "Career reality",
      route: "detail",
      slug: "physics",
    },
  ];

  return (
    <section className="pf-landing-section pf-section--questions">
      <div className="pf-container">
        <div data-pf-reveal style={{marginBottom: 40}}>
          <div className="micro" style={{marginBottom: 12, color: "var(--terracotta)"}}>Questions we actually answer</div>
          <h2 className="display-2" style={{fontSize: 44, lineHeight: 1.1, maxWidth: 720, marginBottom: 16}}>
            Not "personalized guidance."<br/>
            <em style={{color:"var(--text-muted)", fontStyle:"normal", fontSize:"0.88em"}}>Specific answers to the questions you're already asking.</em>
          </h2>
          <p style={{fontSize:16, color:"var(--text-muted)", maxWidth:620, lineHeight:1.6}}>
            Every one of these is a real question a Bangladeshi student has typed into Google, asked in a Facebook group,
            or lost sleep over. Click any to get a grounded answer.
          </p>
        </div>
        <div className="pf-questions" data-pf-stagger>
          {questions.map((item, i) => (
            <button
              key={i}
              className="pf-question"
              data-pf-stagger-item
              type="button"
              onClick={() => {
                if (item.slug) { go("detail", { subjectSlug: item.slug }); }
                else go(item.route);
              }}
            >
              <div className="pf-question__tag">{item.tag}</div>
              <div className="pf-question__text">"{item.q}"</div>
              <div className="pf-question__cta">Get the honest answer →</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 6. Full simulation preview — shows what you ACTUALLY get ──
function SimulationPreviewSection({ go }) {
  const routes = [
    {
      id: "A",
      variant: "public",
      label: "Route A — CSE at a public university",
      fit:   "Best fit for this profile",
      rows: [
        { k: "4-year total cost",   v: "BDT 60,000–100,000" },
        { k: "Key universities",    v: "BUET · RUET · DU · KUET" },
        { k: "Starting salary",     v: "BDT 35,000–55,000/mo in Dhaka" },
        { k: "Abroad pathway",      v: "Very strong — highest int'l demand" },
        { k: "Admission odds",      v: "~3–8% at top public universities" },
      ],
      risk:  "Year 2–3 math workload surprises almost everyone. Ask anyone who's done it.",
      quote: "I wish someone told me the math gets this intense in year 2.",
      who:   "CSE · BUET · class of 2018",
    },
    {
      id: "B",
      variant: "private",
      label: "Route B — UI/UX at a private university",
      fit:   "Strong alternative · portfolio-based",
      rows: [
        { k: "4-year total cost",   v: "BDT 700k–900k (merit waiver: −30%)" },
        { k: "Key universities",    v: "BRAC · NSU · UIU · Daffodil" },
        { k: "Starting salary",     v: "BDT 25,000–60,000/mo · remote USD 800–2,000" },
        { k: "Remote probability",  v: "High after 2 years of strong portfolio" },
        { k: "Admission odds",      v: "High — portfolio matters more than GPA" },
      ],
      risk:  "Bangladesh's local design job market is still thin. Strong English is non-negotiable for remote.",
      quote: "The degree matters less than the portfolio. Start building from semester one.",
      who:   "UI/UX · NSU · class of 2021",
    },
    {
      id: "C",
      variant: "abroad",
      label: "Route C — Korea (GKS Scholarship)",
      fit:   "Matches abroad goal · fully-funded option",
      rows: [
        { k: "Cost if scholarship",  v: "Full tuition + BDT 80,000/mo stipend" },
        { k: "Programme",            v: "4-yr Bachelor's at a Korean university" },
        { k: "Requirements",         v: "TOPIK L3 or English track · SOP · transcripts" },
        { k: "Settlement",           v: "F-series work visa after graduation" },
        { k: "Competition",          v: "~200 GKS seats/year for Bangladesh" },
      ],
      risk:  "Highly competitive. Applications open Oct–Dec. Language prep takes 12–18 months.",
      quote: "Start the TOPIK prep in HSC year 2. Most people who miss the scholarship waited too long.",
      who:   "Korean alumni · GKS batch of 2022",
    },
  ];

  const variantColor = { public: "var(--green)", private: "#1F4F86", abroad: "var(--gold)" };
  const variantBg    = { public: "#E2F1EA",      private: "#DCEAF7",  abroad: "#FBEFD0"   };
  const variantFg    = { public: "#0A5E44",      private: "#1F4F86",  abroad: "#7A5400"   };

  return (
    <section className="pf-landing-section pf-section--sim">
      <div className="pf-container">

        {/* ── Header ── */}
        <div data-pf-reveal style={{marginBottom: 40}}>
          <div className="micro" style={{marginBottom: 12}}>Example output · what you actually receive</div>
          <h2 className="display-2" style={{fontSize: 40, lineHeight: 1.1, maxWidth: 760, marginBottom: 16}}>
            Three routes, mapped honestly.<br/>Not a verdict — a starting point.
          </h2>

          {/* ── Student profile chip ── */}
          <div className="pf-sim-profile">
            <div className="pf-sim-profile__label">Student profile used for this simulation</div>
            <div className="pf-sim-profile__chips">
              {["HSC Science group", "GPA 4.6", "Likes tech + design", "Not a math lover", "Wants to work abroad", "Budget: moderate"].map(c => (
                <span key={c} className="pill" style={{fontSize:12,padding:"5px 12px"}}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Three route cards ── */}
        <div className="pf-sim-grid" data-pf-stagger>
          {routes.map(r => (
            <div key={r.id} className="pf-sim-card" data-pf-stagger-item>

              <div style={{marginBottom: 12}}>
                <span style={{
                  display:"inline-block", fontSize:10, fontWeight:700, letterSpacing:".07em",
                  textTransform:"uppercase", padding:"3px 9px", borderRadius:100,
                  background: variantBg[r.variant], color: variantFg[r.variant], marginBottom:8,
                }}>
                  {r.fit}
                </span>
                <div style={{fontFamily:"var(--font-display)",fontSize:17,fontWeight:700,lineHeight:1.25,color:"var(--text)"}}>
                  {r.label}
                </div>
              </div>

              {/* Data rows */}
              <div className="pf-sim-rows">
                {r.rows.map(row => (
                  <div key={row.k} className="pf-sim-row">
                    <span className="pf-sim-row__k">{row.k}</span>
                    <span className="pf-sim-row__v">{row.v}</span>
                  </div>
                ))}
              </div>

              {/* Risk signal */}
              <div style={{
                marginTop:14, padding:"10px 13px", borderRadius:10,
                background: variantBg[r.variant], fontSize:12, lineHeight:1.5,
                color: variantFg[r.variant],
              }}>
                <span style={{fontWeight:700}}>Honest risk: </span>{r.risk}
              </div>

              {/* Senior quote */}
              <div style={{
                marginTop:10, padding:"12px 14px",
                background:"var(--surface)", borderRadius:10,
                borderLeft:`2px solid ${variantColor[r.variant]}`,
                fontSize:13, lineHeight:1.6, fontStyle:"italic", color:"var(--text)",
              }}>
                "{r.quote}"
                <div style={{fontSize:11,fontStyle:"normal",color:"var(--text-muted)",marginTop:6,fontWeight:600}}>
                  — {r.who}
                </div>
              </div>

            </div>
          ))}
        </div>

        <div style={{marginTop:32, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap"}} data-pf-reveal>
          <button className="btn btn-primary" onClick={() => go("matcher")}>
            Run this for your profile →
          </button>
          <span style={{fontSize:13, color:"var(--text-muted)"}}>
            3 minutes · No sign-up · Results are honest about uncertainty
          </span>
        </div>

      </div>
    </section>
  );
}

// ── 7. Masonry of real voices with parallax ──
function MasonryVoicesSection({ go }) {
  // Six contentful, diverse responses
  const ids = ["resp_002", "resp_055", "resp_056", "resp_031", "resp_038", "resp_011"];
  const picks = ids.map(id => PFData.testimonials.find(t => t.id === id)).filter(Boolean);
  return (
    <section className="pf-landing-section">
      <div className="pf-container" data-pf-reveal>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, gap: 24, flexWrap: "wrap"}}>
          <div>
            <div className="micro" style={{marginBottom: 12}}>Six of fifty-six</div>
            <h2 className="display-2" style={{fontSize: 44, lineHeight: 1.1, maxWidth: 720}}>
              Real responses, unedited.
            </h2>
            <p className="lead" style={{maxWidth: 640, marginTop: 12}}>
              Hand-picked across fields, sessions and decision states — including three that would not recommend.
            </p>
          </div>
          <button className="pf-link" onClick={() => go("stories")} style={{fontSize: 16}}>See all 56 →</button>
        </div>
        <div className="pf-masonry">
          {picks.map((t, i) => (
            <div key={t.id} className="pf-masonry__cell" data-pf-parallax={(i % 3) * 30}>
              <TestimonialCard t={t} expanded={false} compact={true}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 8. Universities row — quiet, with response counts ──
function UniversitiesSection() {
  // Aggregate from testimonials
  const counts = {};
  PFData.testimonials.forEach(t => {
    const k = (t.uni || "").trim();
    if (!k || k === "—") return;
    counts[k] = (counts[k] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([k]) => !k.toLowerCase().includes("anonymised"))
    .slice(0, 12);

  return (
    <section className="pf-landing-section pf-section--alt">
      <div className="pf-container" data-pf-reveal>
        <div className="micro" style={{marginBottom: 12}}>Universities represented in the dataset</div>
        <h2 className="display-2" style={{fontSize: 36, lineHeight: 1.15, maxWidth: 760, marginBottom: 32}}>
          Twelve campuses. {Object.keys(counts).length} unique institutions.
        </h2>
        <div className="pf-unirow">
          {sorted.map(([uni, n]) => (
            <div key={uni} className="pf-unirow__item">
              <div className="pf-unirow__name">{uni.replace(/\s*\(.*\)\s*$/, "").trim()}</div>
              <div className="pf-unirow__count">{n} {n === 1 ? "voice" : "voices"}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 9. For parents / teachers callout ──
function ForParentsSection() {
  return (
    <section className="pf-landing-section">
      <div className="pf-container pf-narrow" data-pf-reveal>
        <div className="pf-twocol">
          <div>
            <div className="micro" style={{marginBottom: 12}}>For parents &amp; teachers</div>
            <h2 className="display-2" style={{fontSize: 36, lineHeight: 1.15, marginBottom: 16}}>
              You are still part of this decision.
            </h2>
            <p style={{fontSize: 17, lineHeight: 1.55, color: "var(--text-muted)", marginBottom: 16}}>
              EduPath BD does not replace the conversation a student needs to have with their family. It gives that conversation better material — verified course information, honest career signals, real voices from people who chose this path before — so the disagreement, if there is one, is at least about the right things.
            </p>
            <p style={{fontSize: 17, lineHeight: 1.55, color: "var(--text-muted)"}}>
              Read the methodology. Treat the numbers as ranges, not forecasts. We are a starting point — not a finish line.
            </p>
          </div>
          <div>
            <div style={{background: "var(--surface)", padding: 24, borderRadius: "var(--r-card)", boxShadow: "var(--shadow-1)"}}>
              <div className="micro" style={{marginBottom: 14, color: "var(--terracotta)"}}>Our standing rules</div>
              <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 14, lineHeight: 1.5}}>
                <li><strong>·</strong> Salary is always a range, always sourced, never a future forecast.</li>
                <li><strong>·</strong> Every factual claim carries a "verified / community / unverified" label.</li>
                <li><strong>·</strong> A subject with thin evidence can never be ranked #1.</li>
                <li><strong>·</strong> The matcher is one input. Teachers, family and counselors are still part of the decision.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Matcher Teaser — split-screen, sticky left / animated right ──
function MatcherTeaserSection({ go }) {
  const steps = [
    {
      label: "Step 1 — Your signal",
      card: { text: "Interest detected: Physics + problem-solving", type: "signal" },
    },
    {
      label: "Step 2 — Reality check",
      card: { text: "Arts HSC group detected. Direct entry to Physics at DU is restricted. This path is blocked for you.", type: "warning" },
    },
    {
      label: "Step 3 — Rerouted",
      card: { text: "Suggested instead: Economics & Data Analytics — same analytical drive, open to all HSC groups.", type: "success" },
    },
  ];

  return (
    <section className="pf-landing-section pf-section--alt">
      <div className="pf-container">
        <div className="pf-teaser-split" data-pf-stagger>
          {/* Left — sticky description */}
          <div className="pf-teaser-left" data-pf-reveal>
            <div className="micro" style={{marginBottom:14}}>The AI Dual-Matcher</div>
            <h2 className="display-2" style={{marginBottom:20}}>
              Your interests.<br/>Bangladesh's reality.
            </h2>
            <p style={{fontSize:16,lineHeight:1.65,color:"var(--text-muted)",marginBottom:28,maxWidth:420}}>
              We don't just ask what you like. We map it against your HSC stream,
              your math tolerance, and regional hiring reality — and flag paths
              that don't actually exist for you before you get attached to them.
            </p>
            <button className="btn btn-primary pf-nav__btn" onClick={() => go("matcher")}>
              Find my path →
            </button>
          </div>

          {/* Right — three step cards */}
          <div className="pf-teaser-right" data-pf-stagger>
            {steps.map((s, i) => (
              <div key={i} className="pf-teaser-step" data-pf-stagger-item>
                <div className="pf-teaser-step__label">{s.label}</div>
                <div className={"pf-teaser-card pf-teaser-card--" + s.card.type}>
                  {s.card.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── University Marquee — infinite CSS scroll ──
function UniversityMarqueeSection() {
  const unis = [
    "University of Dhaka", "BUET", "Jahangirnagar University", "BRAC University",
    "North South University", "IUT", "Rajshahi University", "SUST",
    "Chittagong University", "RUET", "KUET", "DUET", "Daffodil International University",
    "East West University", "United International University",
  ];
  // Duplicate for seamless loop
  const track = [...unis, ...unis];
  return (
    <section className="pf-marquee-section">
      <div className="pf-marquee-eyebrow">Data mapped across 50+ campuses</div>
      <div className="pf-marquee" aria-hidden="true">
        <div className="pf-marquee__track">
          {track.map((u, i) => (
            <span key={i} className="pf-marquee__item">
              {u} <span className="pf-marquee__dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  PinnedRealitySection,
  FeaturedTestimonialSection,
  ConfidenceTierSection,
  FeaturedSubjectsSection,
  MatcherTeaserSection,
  UniversityMarqueeSection,
  RealQuestionsSection,
  SimulationPreviewSection,
  MasonryVoicesSection,
  UniversitiesSection,
  ForParentsSection,
});
