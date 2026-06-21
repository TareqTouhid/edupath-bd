// EduPath BD — Shared components
// Nav, Footer, primitives (Pill, Avatar, HonestyBox, StatsStrip, SectionHead)

const { useState, useEffect } = React;

function Nav({ section, go }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const Link = ({ id, label }) => (
    <button className={"pf-nav__link" + (section === id ? " is-active" : "")} onClick={() => go(id)}>{label}</button>
  );
  return (
    <nav className={"pf-nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="pf-nav__inner">
        <div className="pf-logo" onClick={() => go("landing")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--green)"}}>
            <circle cx="12" cy="12" r="10"/>
            <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>
          </svg>
          <span className="pf-logo__text">EduPath<em> BD</em></span>
        </div>
        <div className="pf-nav__links">
          <Link id="landing"  label="Home" />
          <Link id="explore"  label="Explore" />
          <Link id="stories"  label="Real stories" />
          <Link id="careers"  label="Salary guide" />
          <Link id="matcher"  label="Find my path" />
        </div>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <button className="btn btn-ghost pf-nav__btn" onClick={() => go("contribute")}>Share my experience</button>
          <button className="btn btn-primary pf-nav__btn" onClick={() => go("matcher")}>Find my path →</button>
        </div>
      </div>
    </nav>
  );
}

function Footer({ go }) {
  return (
    <footer className="pf-footer">
      <div className="pf-footer__grid">
        <div className="pf-footer__brand">
          <img src="../../assets/logo-on-green.svg" alt="EduPath BD" style={{height: 32, width: "auto"}}/>
          <p>Helping Bangladeshi students choose with evidence, not pressure.</p>
          <div className="small" style={{opacity:0.7, fontSize: 12}}>Built for students · Free forever</div>
        </div>
        <div>
          <h4>Explore</h4>
          <div className="pf-footer__links">
            <a onClick={() => go("explore")}>Subjects</a>
            <a onClick={() => go("stories")}>Real stories</a>
            <a onClick={() => go("matcher")}>AI matcher</a>
            <a onClick={() => go("share")}>Share your story</a>
          </div>
        </div>
        <div>
          <h4>Talk to us</h4>
          <div className="pf-footer__links">
            <a>Contact</a>
            <a>Methodology</a>
            <a>For schools</a>
          </div>
          <p style={{marginTop: 16, fontSize: 13, lineHeight: 1.5}}>Have questions or want to collaborate? We're students too.</p>
        </div>
      </div>
      <div className="pf-footer__legal">
        Data collected 2024–2025 · All testimonials published with consent · Career and salary data is indicative — verify independently · Not affiliated with any university or government body.
      </div>
    </footer>
  );
}

function SectionHead({ title, eyebrow, sub }) {
  return (
    <div className="pf-page__head">
      {eyebrow ? <div className="micro" style={{marginBottom: 12}}>{eyebrow}</div> : null}
      <h1 className="display-2">{title}</h1>
      {sub ? <p className="lead" style={{marginTop: 12}}>{sub}</p> : null}
    </div>
  );
}

function StatsStrip({ items }) {
  return (
    <section className="pf-stats">
      <div className="pf-stats__grid">
        {items.map((s, i) => (
          <div key={i}>
            <div className="pf-stats__num" dangerouslySetInnerHTML={{__html: s.num}}/>
            <div className="pf-stats__lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HonestyBox({ label, children }) {
  return (
    <div className="honesty">
      {label ? <div style={{fontFamily:"var(--font-body)",fontWeight:700,fontSize:12,letterSpacing:".05em",textTransform:"uppercase",color:"var(--terracotta)",marginBottom:6}}>{label}</div> : null}
      <div style={{fontSize:14,lineHeight:1.5,color:"var(--text)"}}>{children}</div>
    </div>
  );
}

// Initials avatar — gradient circle.
// Use `name` if given; otherwise derive initials from subject (first letter of each word, up to 2).
function Avatar({ name, subjectName, field, size = 48 }) {
  let initials;
  if (name) {
    initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  } else if (subjectName) {
    const words = subjectName.split(/[\s&()]+/).filter(w => w.length > 0 && /^[A-Z]/.test(w[0]));
    initials = words.slice(0, 2).map(w => w[0]).join("").toUpperCase() || subjectName.slice(0, 2).toUpperCase();
  } else {
    initials = "··";
  }
  const color = (PFData.FIELDS[field] && PFData.FIELDS[field].color) || "#006A4E";
  return (
    <div
      className="pf-av"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: `radial-gradient(circle at 30% 30%, ${color}cc, ${color} 70%)`,
      }}
    >
      {initials}
    </div>
  );
}

// Field-color top border helper
function fieldColor(field) {
  return (PFData.FIELDS[field] && PFData.FIELDS[field].color) || "#006A4E";
}

// Difficulty dots
function DiffDots({ level }) {
  return (
    <span className="pf-scard__dots">
      Difficulty
      {[1,2,3,4].map(i => (<span key={i} className={"d" + (i <= level ? " on" : "")}/>))}
    </span>
  );
}

// Trend pill
function TrendPill({ trend }) {
  if (trend === "rising") return <span className="pill pill-gold" style={{fontSize:11,padding:"4px 10px"}}>📈 Rising</span>;
  if (trend === "stable") return <span className="pill" style={{fontSize:11,padding:"4px 10px"}}>⟶ Stable</span>;
  return <span className="pill" style={{fontSize:11,padding:"4px 10px"}}>◎ Niche</span>;
}

// Confidence-tier badge — names match the EduPath BD Build Plan §4.1.
function ConfidencePill({ tier }) {
  const map = {
    listed:   { bg: "#FBEFD0", fg: "#7A5400", label: "Listed only — limited evidence" },
    emerging: { bg: "#DCEAF7", fg: "#1F4F86", label: "Emerging evidence" },
    verified: { bg: "#E2F1EA", fg: "#0A5E44", label: "Verified" },
  };
  const m = map[tier] || map.emerging;
  return <span style={{display:"inline-flex",alignItems:"center",padding:"4px 12px",borderRadius:100,background:m.bg,color:m.fg,fontSize:12,fontWeight:600}}>{m.label}</span>;
}

Object.assign(window, { Nav, Footer, SectionHead, StatsStrip, HonestyBox, Avatar, fieldColor, DiffDots, TrendPill, ConfidencePill });
