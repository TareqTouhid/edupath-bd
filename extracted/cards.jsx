// EduPath BD — SubjectCard + TestimonialCard (minimal, uniform)

function SubjectCard({ subject, onClick }) {
  const fieldLabel = PFData.FIELDS[subject.field].label;
  return (
    <button className="pf-scard" onClick={onClick} type="button">
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
          <div className="pf-scard__sal">{subject.regional.dhaka.salary}</div>
          <div className="pf-scard__arr">→</div>
        </div>
      </div>
    </button>
  );
}

function shortSubject(name) {
  if (!name) return "";
  const map = {
    "Computer Science & Engineering": "CSE",
    "Business Administration (BBA)":  "BBA",
    "Electrical & Electronic Engineering": "EEE",
    "Information & Communication Engineering": "ICE",
    "Civil & Environmental Engineering": "Civil Eng.",
    "Geography & Environment": "Geography",
    "English Language & Literature": "English Lit.",
    "Journalism & Media Studies": "Journalism",
  };
  if (map[name]) return map[name];
  return name.length > 18 ? name.split(" ")[0] : name;
}

function flagFor(country) {
  return ({ BD: "🇧🇩", US: "🇺🇸", KR: "🇰🇷", AU: "🇦🇺", OTHER: "🌐" })[country] || "🌐";
}

function TestimonialCard({ t, expanded, onToggle, compact = false }) {
  const subj = PFData.subjects.find(s => s.slug === t.subjectSlug);
  const fieldKey = subj ? subj.field : (t.field || "social-science");
  const subjName = t.subjectName || (subj && subj.name) || t.subjectSlug;

  const whoLine = t.name
    ? `${t.name} · age ${t.age}`
    : `Class of ${t.session || "—"} · age ${t.age}`;

  return (
    <div className="pf-tcard">

      {/* Header */}
      <div className="pf-tcard__head">
        <div className="pf-tcard__who">
          <Avatar name={t.name} subjectName={subjName} field={fieldKey} size={36}/>
          <div>
            <div className="pf-tcard__name">{whoLine}</div>
            <div className="pf-tcard__location">
              {flagFor(t.country)} {t.city || (t.country === "BD" ? "Bangladesh" : "Abroad")}
            </div>
          </div>
        </div>
        <span className="pf-tcard__subj">{shortSubject(subjName)}</span>
      </div>

      {/* University / role */}
      <div className="pf-tcard__uni">
        {t.uni}
        {t.role ? <span className="pf-tcard__role"> · {t.role}</span> : null}
      </div>

      {/* Quote — clamped unless expanded */}
      <div className={"pf-tcard__quote" + (expanded ? " pf-tcard__quote--open" : "")}>
        {t.good}
      </div>

      {/* Expanded detail */}
      {expanded ? (
        <div className="pf-tcard__expand">
          {t.bad        ? <div><h5>What was hard</h5><p>{t.bad}</p></div> : null}
          {t.whoShould  ? <div><h5>Who should study this</h5><p>{t.whoShould}</p></div> : null}
          {t.whoShouldnt? <div><h5>Who shouldn't</h5><p>{t.whoShouldnt}</p></div> : null}
          {t.opportunities ? <div><h5>Career paths seen</h5><p>{t.opportunities}</p></div> : null}
          {t.alternative ? <div><h5>If choosing again</h5><p style={{fontStyle:"italic"}}>"{t.alternative}"</p></div> : null}
        </div>
      ) : null}

      {/* Footer — expand toggle only, no recommendation chip */}
      {!compact && onToggle ? (
        <div className="pf-tcard__foot">
          <span/>
          <button className="pf-link" onClick={onToggle} style={{fontSize:12, whiteSpace:"nowrap"}}>
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

Object.assign(window, { SubjectCard, TestimonialCard, flagFor, shortSubject });
