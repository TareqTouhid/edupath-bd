// EduPath BD — ScreenLanding (source JSX, compiled by _compile_landing.js)

// University data: image + abbreviation + accent color
const UNI_META = {
  "BUET": {
    abbr: "BUET", color: "#006A4E", bg: "#e8f5ee",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/15/BUET_Campus_01.jpg"
  },
  "University of Dhaka": {
    abbr: "DU", color: "#1a3a5c", bg: "#e8eef5",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Karjon_hall.JPG"
  },
  "BRAC University": {
    abbr: "BRACU", color: "#b5451b", bg: "#fdf0eb",
    img: "https://upload.wikimedia.org/wikipedia/commons/5/53/BRAC_University.jpg"
  },
  "North South University": {
    abbr: "NSU", color: "#7b3fa0", bg: "#f5eefb",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/19/North_South_University_Campus_01.jpg"
  },
  "KUET": {
    abbr: "KUET", color: "#006A4E", bg: "#e8f5ee",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/17/KUET_campus_landscape.jpg"
  },
  "RUET": {
    abbr: "RUET", color: "#006A4E", bg: "#e8f5ee",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Rajshahi_University_of_Engineering_and_Technology_%28RUET%29_Campus.jpg"
  },
};

function ScreenLanding({ go, setSubjectSlug, onSearch, goSearch }) {
  React.useEffect(() => {
    if (typeof window.__pfReanimate === "function") window.__pfReanimate();
  }, []);

  return (
    <div>

      {/* ── HERO: split layout — text+search left, image right ────────── */}
      <section className="pf-hero pf-hero--editorial">
        <div className="pf-starfield" data-pf-starfield aria-hidden="true"/>
        <div className="pf-container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
            minHeight: 480,
          }}>
            {/* Left: copy + search */}
            <div data-pf-reveal>
              <div className="micro" style={{ marginBottom: 16 }}>
                For SSC & HSC graduates of Bangladesh
              </div>
              <h1 className="pf-hero__h1" style={{ textAlign: "left", fontSize: "clamp(36px,4.5vw,60px)" }}>
                <span className="pf-mask"><span data-pf-split-line>Explore 180+</span></span>
                <span className="pf-mask"><span data-pf-split-line>universities.</span></span>
                <span className="pf-mask"><span data-pf-split-line>Compare <em className="gold-em">subjects</em></span></span>
                <span className="pf-mask"><span data-pf-split-line>& careers.</span></span>
              </h1>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 480, margin: "20px 0 28px" }}>
                Search by subject, university, or career. See which universities offer CSE. Which jobs need Physics. What graduates actually earn.
              </p>
              <SearchBar onSearch={onSearch} go={go}/>
            </div>

            {/* Right: hero image */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 460 }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/24/Students_reading_newspapers_in_East_West_University%2C_Dhaka.jpg"
                alt="Bangladeshi university students"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Overlay card */}
              <div style={{
                position: "absolute", bottom: 24, left: 24, right: 24,
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                borderRadius: 12, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ display: "flex" }}>
                  {["seed1","seed2","seed3","seed4"].map((s, i) => (
                    <img key={s}
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${s}&backgroundColor=b6e3f4,ffd5dc,c0aede,d1d4f9`}
                      style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #fff", marginLeft: i === 0 ? 0 : -8, background: "#f0f0f0" }}
                      alt=""
                    />
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>56 graduates shared their story</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Real experiences · Honest answers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: collapse to single column via CSS (handled by media query) */}
          <style>{`
            @media (max-width: 768px) {
              .pf-hero--editorial .pf-container > div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
              }
              .pf-hero--editorial img { height: 260px !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── THE PROBLEM ───────────────────────────────────────────────── */}
      <section className="pf-landing-section pf-section--alt">
        <div className="pf-container" data-pf-reveal>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="micro" style={{ marginBottom: 12 }}>The problem</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 600, lineHeight: 1.2, marginBottom: 12, letterSpacing: "-0.02em", textAlign: "center" }}>
              Bangladeshi students choose in the dark.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6, textAlign: "center" }}>
              180+ universities. 2500+ programs. Zero unified guidance. Parents push. Coaching centers mislead. Regret comes after 4 years.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div className="pf-stats__num" style={{ color: "var(--green)", textAlign: "center" }}>9/56</div>
              <div className="pf-stats__lbl" style={{ textAlign: "center" }}>Students regret their subject choice</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="pf-stats__num" style={{ color: "var(--terracotta)", textAlign: "center" }}>2500+</div>
              <div className="pf-stats__lbl" style={{ textAlign: "center" }}>Programs with no career outcome data</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="pf-stats__num" style={{ color: "var(--gold)", textAlign: "center" }}>180+</div>
              <div className="pf-stats__lbl" style={{ textAlign: "center" }}>Universities on scattered websites</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM STATS ────────────────────────────────────────────── */}
      <section className="pf-stats">
        <div className="micro" style={{ textAlign: "center", marginBottom: 8, paddingTop: 48, color: "var(--text-muted)" }}>What we built</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8, textAlign: "center" }}>
          Real data. Real graduates. Real outcomes.
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6, textAlign: "center" }}>
          Collected from 56 Bangladeshi graduates across 20+ universities.
        </p>
        <div className="pf-stats__grid">
          <div data-pf-reveal>
            <div className="pf-stats__num"><span data-pf-counter data-target="56">56</span></div>
            <div className="pf-stats__lbl">Verified alumni voices</div>
          </div>
          <div data-pf-reveal>
            <div className="pf-stats__num">34</div>
            <div className="pf-stats__lbl">Subjects searchable</div>
          </div>
          <div data-pf-reveal>
            <div className="pf-stats__num">180+</div>
            <div className="pf-stats__lbl">Universities mapped</div>
          </div>
          <div data-pf-reveal>
            <div className="pf-stats__num">204</div>
            <div className="pf-stats__lbl">Job titles with salary</div>
          </div>
        </div>
      </section>

      {/* ── FEATURED UNIVERSITIES ─────────────────────────────────────── */}
      <section className="pf-landing-section">
        <div className="pf-container" data-pf-reveal>
          <div style={{ marginBottom: 32 }}>
            <div className="micro" style={{ marginBottom: 10 }}>Explore universities</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 600, lineHeight: 1.15, maxWidth: 560, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Start with a university. See salaries, subjects & outcomes.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 520, lineHeight: 1.6 }}>
              Public (BUET, DU, KUET), private (BRACU, NSU, BRAC), or international (Korea GKS). Click any university to see which subjects they offer, what graduates earn, and real alumni reviews.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {["BUET", "University of Dhaka", "BRAC University", "North South University", "KUET", "RUET"].map((uni, i) => {
              const meta = UNI_META[uni] || { abbr: uni.slice(0,4).toUpperCase(), color: "#006A4E", bg: "#e8f5ee", img: "" };
              return (
                <button key={i}
                  onClick={() => {
                    const allUnis = window.UGCData?.universities
                      ? (window.UGCData.public || [])
                          .concat(window.UGCData.private || [])
                          .concat(window.UGCData.international || [])
                      : [];
                    const uniData = allUnis.find(u => u.name === uni);
                    if (uniData && window.app) {
                      window.app.setUniversitySlug(uniData.id);
                      window.app.go("university-detail");
                    }
                  }}
                  style={{ padding: 0, background: "var(--surface)", border: "1px solid var(--ink-08)", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 200ms ease", overflow: "hidden" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.boxShadow = "var(--shadow-2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "var(--ink-08)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Card image header — no overlay, no text */}
                  <div style={{ height: 140, overflow: "hidden", background: meta.bg }}>
                    {meta.img && (
                      <img src={meta.img} alt={uni}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  {/* Card body */}
                  <div style={{ padding: "14px 16px 16px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{uni}</h3>
                    {(() => {
                      const allUnis = window.UGCData?.universities
                        ? (window.UGCData.public || [])
                            .concat(window.UGCData.private || [])
                            .concat(window.UGCData.international || [])
                        : [];
                      const uniData = allUnis.find(u => u.name === uni);
                      const subjectCount = uniData?.subjects?.length || null;
                      return <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {subjectCount ? `${subjectCount} subjects offered` : "Subjects, salaries & alumni reviews"}
                      </p>;
                    })()}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button className="pf-link" onClick={() => go("all-universities")} style={{ fontSize: 14 }}>See all 180+ universities →</button>
          </div>
        </div>
      </section>

      {/* ── FEATURED SUBJECTS ─────────────────────────────────────────── */}
      <FeaturedSubjectsSection go={go} setSubjectSlug={setSubjectSlug}/>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="pf-landing-section pf-section--alt">
        <div className="pf-container" data-pf-reveal>
          <div style={{ marginBottom: 32 }}>
            <div className="micro" style={{ marginBottom: 10 }}>Real voices from real alumni</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 600, lineHeight: 1.15, maxWidth: 560, letterSpacing: "-0.02em" }}>
              56 graduates. Honest answers.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 500, marginTop: 10, lineHeight: 1.6 }}>
              Including the 9 who would choose a different subject. Their regrets are as useful as their successes. If you've graduated, your story helps the next student choose wisely.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {PFData.testimonials.slice(0, 6).map((t, idx) => {
              const subj = PFData.subjects.find(s => s.slug === t.subjectSlug);
              const subjName = t.subjectName || (subj && subj.name) || t.subjectSlug;
              const avatarSeed = t.name ? t.name.replace(/\s+/g, '') : `anon${idx}`;
              const bgColors = ["b6e3f4", "ffd5dc", "c0aede", "d1d4f9", "ffdfbf", "b5ead7"];
              const avatarBg = bgColors[idx % bgColors.length];
              return (
                <div key={t.id} style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--ink-08)", borderRadius: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text)", fontStyle: "italic", flex: 1 }}>
                    "{t.good || "Gained valuable experience during my studies"}"
                  </p>
                  <div style={{ borderTop: "1px solid var(--ink-08)", paddingTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarSeed}&backgroundColor=${avatarBg}`}
                      alt=""
                      style={{ width: 40, height: 40, borderRadius: "50%", background: `#${avatarBg}`, flexShrink: 0 }}
                    />
                    <div>
                      {t.name && <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", margin: 0 }}>{t.name}</p>}
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{subjName} · {t.uni}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Class of {t.session || "—"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="pf-link" onClick={() => go("stories")} style={{ fontSize: 14 }}>Read all 56 voices →</button>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="pf-landing-section">
        <div className="pf-container" style={{ maxWidth: 720 }} data-pf-reveal>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="micro" style={{ marginBottom: 12 }}>Still wondering?</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3.2vw,34px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Frequently asked questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "How do I search for a specific subject?", a: "Type the subject name in the search bar to see all universities offering it, related jobs, and salary ranges in Bangladesh and abroad." },
              { q: "Can I search by university?", a: "Yes. Search any university name to see all subjects they offer, admission patterns, seat numbers, and testimonials from their alumni." },
              { q: "Can I search by career or job?", a: "Yes. Search a job title (e.g., 'Software Engineer', 'Architect') to see which subjects lead to it, salary data across countries, and professionals working in that field." },
              { q: "Where does the salary data come from?", a: "From BLS (USA), Glassdoor, LinkedIn, GulfTalent, Seek, StepStone, Bdjobs, JobStreet, and MyCareersFuture. Data covers 10 countries with 2,000+ salary points." },
              { q: "How does the matcher work?", a: "Answer 3 quick questions about your interests, strengths, and priorities. We match you against all 34 subjects, rank by fit, and show you the best paths to each." },
              { q: "Is EduPath free?", a: "Yes, completely free. Forever. No hidden costs, no premium tier, no sign-up required." },
              { q: "Is this really from Bangladesh?", a: "Yes. 56 verified graduates from 20+ Bangladeshi universities answered honestly about their experiences, including the 9 who would choose differently." },
              { q: "Can I contribute my experience?", a: "Yes! If you're a graduate or current student, click 'Share my experience' in the navigation to submit your story and help future students." },
            ].map((item, i) => (
              <details key={i} style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--ink-08)", borderRadius: 8, cursor: "pointer" }}>
                <summary style={{ fontWeight: 500, fontSize: 14, cursor: "pointer" }}>{item.q}</summary>
                <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="pf-cta-strip">
        <div className="pf-container" data-pf-reveal>
          <div className="micro" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>
            3 minutes · No sign-up · Free forever
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 16 }}>
            Your future is too expensive to guess.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: "0 auto 32px" }}>
            Get an evidence-backed shortlist in 3 minutes. Free forever.
          </p>
          <button className="btn btn-primary pf-nav__btn" onClick={() => go("matcher")}>
            Find my path →
          </button>
        </div>
      </section>

      <Footer go={go}/>
    </div>
  );
}

Object.assign(window, { ScreenLanding });
