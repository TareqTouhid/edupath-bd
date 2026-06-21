// EduPath BD — Landing (editorial narrative scroll)

function ScreenLanding({ go, setSubjectSlug }) {
  useEffect(() => {
    if (typeof window.__pfReanimate === "function") window.__pfReanimate();
  }, []);

  // Journey stages — used in the dark strip below the hero
  const stages = [
    { id:"ssc",       stage:"SSC student",        label:"Still in SSC, planning ahead",     action:() => go("explore"),  cta:"Explore subjects →" },
    { id:"hsc",       stage:"HSC student",         label:"In HSC, deciding my path",         action:() => go("matcher"),  cta:"Find my path →" },
    { id:"admission", stage:"Admission candidate", label:"HSC done — applying this year",    action:() => go("matcher"),  cta:"Run the matcher →" },
    { id:"university",stage:"University student",  label:"Already in university",            action:() => go("stories"),  cta:"Read real stories →" },
    { id:"abroad",    stage:"Study abroad",        label:"I want to study outside BD",       action:() => go("careers"),  cta:"See salary data →" },
    { id:"parent",    stage:"Parent or teacher",   label:"Helping someone decide",           action:() => go("explore"),  cta:"Explore the data →" },
  ];

  return (
    <div>

      {/* ═══ SECTION 1 — IMMERSIVE EDITORIAL HERO ═══════════════════════ */}
      <section className="pf-hero pf-hero--editorial">
        {/* Three.js data constellation — ambient atmosphere */}
        <div className="pf-starfield" data-pf-starfield aria-hidden="true"/>

        <div className="pf-container" style={{position:"relative",zIndex:1}}>
          <div className="pf-hero__editorial">

            <div className="pf-hero__eyebrow" data-pf-reveal>
              For SSC &amp; HSC graduates of Bangladesh
            </div>

            <h1 className="pf-hero__h1">
              <span className="pf-mask"><span data-pf-split-line>Find the degree</span></span>
              <span className="pf-mask"><span data-pf-split-line>you were <em className="gold-em">made</em> for.</span></span>
            </h1>

            <p className="pf-hero__sub" data-pf-reveal>
              Stop risking your future on family rumors or outdated marketing.
              56 Bangladeshi graduates answered honestly — including the regrets.
              Their data is now a decision system built for you.
            </p>

            <div className="pf-hero__ctas" data-pf-reveal>
              <button className="btn btn-primary pf-nav__btn" onClick={() => go("matcher")}>
                Launch AI Matcher →
              </button>
              <button className="pf-link" onClick={() => go("stories")} style={{fontSize:15}}>
                Browse real stories →
              </button>
            </div>

            <div className="pf-hero__trust" data-pf-reveal>
              <span>56 verified voices</span>
              <span>31 subjects mapped</span>
              <span>15 countries</span>
              <span>Free forever</span>
            </div>

          </div>
        </div>

        <div className="pf-hero__scrollhint" aria-hidden="true">
          <div className="pf-hero__scrollhint-line"/>
          <div className="pf-hero__scrollhint-text">Scroll</div>
        </div>
      </section>

      {/* ═══ JOURNEY ENTRY STRIP ════════════════════════════════════════ */}
      <section className="pf-journey-strip">
        <div className="pf-container">
          <div className="pf-journey-strip__label">Where are you right now?</div>
          <div className="pf-journey">
            {stages.map(s => (
              <button key={s.id} className="pf-journey__card" onClick={s.action} type="button">
                <div className="pf-journey__stage">{s.stage}</div>
                <div className="pf-journey__label">{s.label}</div>
                <div className="pf-journey__cta">{s.cta}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — BRUTAL REALITY (PINNED GSAP) ═══════════════════ */}
      <PinnedRealitySection/>

      {/* ═══ STATS ══════════════════════════════════════════════════════ */}
      <section className="pf-stats">
        <div className="pf-stats__grid">
          <div data-pf-reveal>
            <div className="pf-stats__num"><span data-pf-counter data-target="56">56</span></div>
            <div className="pf-stats__lbl">Verified responses from real graduates</div>
          </div>
          <div data-pf-reveal>
            <div className="pf-stats__num" style={{color:"var(--terracotta)"}}>9</div>
            <div className="pf-stats__lbl">Who would choose a different subject</div>
          </div>
          <div data-pf-reveal>
            <div className="pf-stats__num">15</div>
            <div className="pf-stats__lbl">Countries with salary data</div>
          </div>
          <div data-pf-reveal>
            <div className="pf-stats__num">31</div>
            <div className="pf-stats__lbl">Subjects across all HSC groups</div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — MATCHER TEASER (split-screen, sticky) ══════════ */}
      <MatcherTeaserSection go={go}/>

      {/* ═══ SECTION 4 — FEATURED SUBJECTS (horizontal GSAP gallery) ════ */}
      <FeaturedSubjectsSection go={go} setSubjectSlug={setSubjectSlug}/>

      {/* ═══ WHAT THIS ACTUALLY IS ═══════════════════════════════════════ */}
      <section className="pf-features">
        <div className="pf-container" data-pf-stagger>
          <div style={{marginBottom:40}} data-pf-reveal>
            <div className="micro" style={{marginBottom:12}}>What this actually is</div>
            <h2 className="display-2" style={{maxWidth:680}}>
              Not a course. Not a chatbot.<br/>An education decision system.
            </h2>
          </div>
          <div className="pf-features__grid">

            <div className="pf-feature pf-feature--green" data-pf-stagger-item>
              <div className="pf-feature__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>56 graduates who told the truth</h3>
              <p>Including 9 who said they'd choose differently. The regrets are as useful as the successes.</p>
              <button className="pf-link" onClick={() => go("stories")} style={{marginTop:8,fontSize:13}}>Read what they said →</button>
            </div>

            <div className="pf-feature pf-feature--gold" data-pf-stagger-item>
              <div className="pf-feature__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <h3>Three routes, not one answer</h3>
              <p>Public university, private university, study abroad — real costs, admission odds, and a senior quote for each.</p>
              <button className="pf-link" onClick={() => go("matcher")} style={{marginTop:8,fontSize:13}}>See your three routes →</button>
            </div>

            <div className="pf-feature pf-feature--terra" data-pf-stagger-item>
              <div className="pf-feature__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Dhaka salary vs. everywhere else</h3>
              <p>CSE in Dhaka: BDT 35k–80k/mo. Outside Dhaka: 20k–40k/mo. Shown honestly for every subject.</p>
              <button className="pf-link" onClick={() => go("careers")} style={{marginTop:8,fontSize:13}}>See salary data →</button>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FEATURED TESTIMONIAL ════════════════════════════════════════ */}
      <FeaturedTestimonialSection/>

      {/* ═══ SIMULATION PREVIEW ══════════════════════════════════════════ */}
      <SimulationPreviewSection go={go}/>

      {/* ═══ REAL QUESTIONS ══════════════════════════════════════════════ */}
      <RealQuestionsSection go={go}/>

      {/* ═══ SECTION 5 — ALUMNI WALL (parallax masonry) ═════════════════ */}
      <MasonryVoicesSection go={go}/>

      {/* ═══ SECTION 6 — UNIVERSITY MARQUEE ════════════════════════════ */}
      <UniversityMarqueeSection/>

      {/* ═══ FOR PARENTS ════════════════════════════════════════════════ */}
      <ForParentsSection/>

      {/* ═══ SECTION 7 — FINAL CTA ══════════════════════════════════════ */}
      <section className="pf-cta-strip">
        <div className="pf-container" data-pf-reveal>
          <div className="micro" style={{color:"rgba(255,255,255,0.55)",marginBottom:16}}>
            3 minutes · No sign-up · Free forever
          </div>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(36px,5vw,56px)",fontWeight:700,letterSpacing:"-0.025em",lineHeight:1.05,marginBottom:16}}>
            Your future is too expensive to guess.
          </h2>
          <p style={{fontSize:17,lineHeight:1.6,color:"rgba(255,255,255,0.75)",maxWidth:520,margin:"0 auto 32px"}}>
            Get an evidence-backed shortlist in 3 minutes. Free forever.
          </p>
          <button className="btn btn-on-green" style={{fontSize:16,padding:"16px 36px"}} onClick={() => go("matcher")}>
            Find my path →
          </button>
          <div style={{marginTop:18}}>
            <button
              onClick={() => go("contribute")}
              style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.55)",fontSize:13,fontFamily:"inherit",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:4}}
            >
              Already studying? Share my experience →
            </button>
          </div>
        </div>
      </section>

      <Footer go={go}/>
    </div>
  );
}

Object.assign(window, { ScreenLanding });
