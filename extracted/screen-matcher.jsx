// EduPath BD — Matcher
// 7-step questionnaire covering the AI Matcher Spec's 14 questions (A1–A7, B1–B7).
// Steps 1–4 = Layer 01 (Interest & working style). Steps 5–7 = Layer 02 (Constraints).
// The scoring heuristic remains intentionally lightweight; the spec describes the
// real retrieval-grounded model that lives server-side in production.

// ── A1: Activities that genuinely hold attention (multi-select, max 5) ──
const INTERESTS = [
  ["building",  "🔧", "Building & fixing",      "Hardware, construction, hands-on systems"],
  ["puzzles",   "🧩", "Puzzles & math",         "Rules, algorithms, optimization"],
  ["writing",   "✍️", "Writing & language",     "Stories, prose, communication"],
  ["people",    "🤝", "Helping people",         "Counseling, teaching, social impact"],
  ["art",       "🎨", "Art, design & visuals",  "Drawing, branding, products"],
  ["nature",    "🌿", "Nature & living things", "Biology, environment, agriculture"],
  ["business",  "💰", "Business & markets",     "Money, trade, organisations"],
  ["lab",       "🧪", "Experiments & lab work", "Hypotheses, data, the bench"],
  ["computers", "💻", "Computers & software",   "Programming, products, the web"],
  ["society",   "🏛️", "Law, society & policy",  "How things are governed"],
];

// ── A2: What keeps you going when a task is hard? ──
const DRIVERS = [
  ["logic",     "🧠", "Cracking the logic of it"],
  ["aesthetic", "🎨", "Creating something good-looking"],
  ["impact",    "🤲", "The impact on people"],
  ["payoff",    "💰", "The money / career payoff"],
  ["curiosity", "🔍", "Pure curiosity"],
];

// ── A3: Mathematics comfort ──
const MATH_OPTS = [
  ["love",  "❤️", "I enjoy it",      "Calculus, proofs, problems all feel satisfying."],
  ["ok",    "👍", "I can handle it", "Applied math is fine when the goal is clear."],
  ["avoid", "🙅", "I'd rather not",  "I'd prefer a path with minimal calculation."],
];

// ── A4: Memorization tolerance ──
const MEMORIZATION = [
  ["fine",   "📚", "Fine with it",            "Memorising names, dates, facts is okay."],
  ["mid",    "🆗", "Tolerable in doses",      "I can do it but it's not enjoyable."],
  ["reason", "💡", "Strongly prefer reasoning", "I want to work things out, not memorise them."],
];

// ── A5: Open vs closed problems ──
const PROBLEM_STYLE = [
  ["closed", "🎯", "A clear right answer"],
  ["open",   "🌫️", "Open problems with many answers"],
  ["mix",    "⚖️", "A mix of both"],
];

// ── A6: Working environment ──
const WORK_ENV = [
  ["desk",    "💻", "At a desk / on a computer"],
  ["lab",     "🔬", "In a lab or in the field"],
  ["people",  "🗣️", "With and among people"],
  ["site",    "🏗️", "On a site / hands-on"],
  ["flex",    "🌀", "Flexible / varied"],
];

// ── B1: HSC group ──
const HSC = [
  ["science",  "🔬", "Science",
   "Opens CSE, Engineering, Physics, Architecture, Agriculture, Medicine, Geography, Psychology"],
  ["commerce", "📊", "Commerce / Business Studies",
   "Opens BBA, Finance & Banking, Economics, Accounting, Management"],
  ["arts",     "🎭", "Humanities / Arts",
   "Opens Bangla, English Lit, History, Philosophy, Development Studies, Social Work, Geography"],
  ["any",      "🤔", "Not sure / different board",
   "Show me all paths — I'll filter by interest only"],
];

// ── B2: Results band ──
const RESULTS_BAND = [
  ["strong",  "Strong results",      "GPA close to the top of my college"],
  ["average", "Average",             "Around the middle of my class"],
  ["below",   "Below what I hoped",  "I want a realistic path given where I am"],
];

// ── B3: Family budget ──
const BUDGET = [
  ["public",  "Public university only",   "Cost is a real constraint"],
  ["private", "Private is an option",     "We can stretch if the path is right"],
  ["unsure",  "Not sure yet",             "Don't filter on this yet"],
];

// ── B4: Where you can study ──
const LOCATION = [
  ["home",     "Home division only",          "I can't relocate yet"],
  ["national", "Anywhere in Bangladesh",      "I can move within the country"],
  ["global",   "Anywhere — including abroad", "Open to studying outside BD"],
];

// ── B5: Abroad intent ──
const ABROAD = [
  ["yes",   "✈️", "Yes — it's a goal",    "Boosts subjects with strong abroad pathways"],
  ["maybe", "🤔", "Maybe",                "Treat it as a soft preference"],
  ["stay",  "🏠", "No — I plan to stay",  "Local opportunities ranked higher"],
];

// ── B6: Career risk appetite ──
const RISK = [
  ["stable", "🛡️", "Stable, predictable",      "Banking, govt, established sectors"],
  ["upside", "🚀", "Trade some stability for upside", "Tech, startups, finance"],
  ["unsure", "🤷", "Unsure yet",                "Show me both"],
];

// ── Reusable sub-question chip-row component ──
function MatcherChip({ emo, label, desc, active, onClick, small = false }) {
  return (
    <button className={"pf-matcher__chip" + (active ? " is-active" : "")} onClick={onClick} type="button" style={small ? {padding:"10px 14px"} : null}>
      <span className="emo">{emo}</span>
      <span>
        <div className="label">{label}</div>
        {desc ? <div className="desc">{desc}</div> : null}
      </span>
    </button>
  );
}
function MatcherOption({ emo, label, desc, active, onClick }) {
  return (
    <button className={"pf-matcher__option" + (active ? " is-active" : "")} onClick={onClick} type="button">
      {emo ? <div className="emo">{emo}</div> : null}
      <div className="label">{label}</div>
      {desc ? <div className="desc">{desc}</div> : null}
    </button>
  );
}
// Sub-question wrapper — a small label + the chip row below
function SubQ({ label, hint, children }) {
  return (
    <div style={{marginBottom: 24}}>
      <div className="micro" style={{marginBottom: 8}}>{label}</div>
      {hint ? <div style={{fontSize: 14, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.4}}>{hint}</div> : null}
      {children}
    </div>
  );
}

function ScreenMatcher({ go }) {
  const [step, setStep] = useState(1); // 1..7
  const [phase, setPhase] = useState("step"); // step | processing | results

  // Layer 01 — interests & working style
  const [interests, setInterests] = useState(new Set());
  const [driver, setDriver] = useState(null);
  const [math, setMath] = useState(null);
  const [memorization, setMemorization] = useState(null);
  const [problemStyle, setProblemStyle] = useState(null);
  const [workEnv, setWorkEnv] = useState(null);
  const [curiosity, setCuriosity] = useState("");

  // Layer 02 — constraints
  const [hsc, setHsc] = useState(null);
  const [resultsBand, setResultsBand] = useState(null);
  const [budget, setBudget] = useState(null);
  const [location, setLocation] = useState(null);
  const [abroad, setAbroad] = useState(null);
  const [risk, setRisk] = useState(null);
  const [pushed, setPushed] = useState("");

  const toggle = (set, key, max) => {
    const n = new Set(set);
    if (n.has(key)) n.delete(key);
    else if (!max || n.size < max) n.add(key);
    return n;
  };

  const TOTAL = 7;
  const layer2 = step >= 5;
  const progress = (step / TOTAL) * 100;

  const canNext = () => {
    if (step === 1) return interests.size >= 1;
    if (step === 2) return driver && problemStyle;
    if (step === 3) return math && memorization;
    if (step === 4) return workEnv !== null;
    if (step === 5) return hsc !== null;
    if (step === 6) return resultsBand && budget && location;
    if (step === 7) return abroad && risk;
    return false;
  };

  const onNext = () => {
    if (step < TOTAL) { setStep(step + 1); return; }
    setPhase("processing");
    setTimeout(() => setPhase("results"), 1800);
  };
  const onBack = () => {
    if (phase === "results") { setPhase("step"); setStep(TOTAL); return; }
    if (step > 1) setStep(step - 1);
  };

  if (phase === "processing") return <Processing/>;
  if (phase === "results") return (
    <Results
      inputs={{ interests, driver, math, memorization, problemStyle, workEnv, curiosity, hsc, resultsBand, budget, location, abroad, risk, pushed }}
      go={go}
      onRetry={() => { setPhase("step"); setStep(1); }}
    />
  );

  // HSC live-preview
  let hscPreview = null;
  if (step === 5 && hsc) {
    const map = {
      science:  "✓ You're eligible for the widest range of subjects. You can access all profiled subjects in our database.",
      commerce: "✓ You're eligible for Business, Economics, Finance and most Arts subjects. ⚠ Engineering, Physics, Architecture, Agriculture, Medicine typically require Science group admission.",
      arts:     "✓ You're eligible for most Arts and Social Science subjects. ⚠ CSE, Engineering, Physics, Architecture, Agriculture, Medicine, Geography typically require Science group admission.",
      any:      "We'll filter by your interest signals alone — and surface subjects with the lowest HSC-group friction first.",
    };
    hscPreview = <HonestyBox label="Eligibility preview">{map[hsc]}</HonestyBox>;
  }

  return (
    <div className="pf-matcher">
      <div className="pf-matcher__card">
        <div className="pf-matcher__progress">
          <div className="micro">
            <span>Step {step} of {TOTAL}</span>
            <span className="right">≈ {Math.max(1, TOTAL - step + 1)} min remaining</span>
          </div>
          <div className="pf-matcher__track">
            <div className={"pf-matcher__fill" + (layer2 ? " l2" : "")} style={{width: progress + "%"}}/>
          </div>
        </div>

        <div className={"pf-matcher__layer" + (layer2 ? " l2" : "")}>
          {layer2 ? "Part 2 · Real-world constraints" : "Part 1 · What makes you tick"}
        </div>

        {/* STEP 1 — A1 Interests */}
        {step === 1 && (
          <>
            <h2 className="pf-matcher__q">Four free hours on a Sunday. No obligation. What do you actually do?</h2>
            <p className="pf-matcher__sub">Not what sounds impressive — what you genuinely drift toward. Pick up to five.</p>
            <div className="pf-matcher__chips">
              {INTERESTS.map(([k, e, l, d]) => (
                <MatcherChip key={k} emo={e} label={l} desc={d} active={interests.has(k)} onClick={() => setInterests(toggle(interests, k, 5))}/>
              ))}
            </div>
          </>
        )}

        {/* STEP 2 — A2 Driver + A5 Problem style */}
        {step === 2 && (
          <>
            <h2 className="pf-matcher__q">Here's what most people get wrong when choosing a subject.</h2>
            <p className="pf-matcher__sub">They pick the subject name. You need to pick the <em>type of thinking</em>. Two questions that reveal the difference.</p>
            <SubQ label="When a task is hard, what keeps you going?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(2, 1fr)"}}>
                {DRIVERS.map(([k, e, l]) => (
                  <MatcherChip key={k} emo={e} label={l} active={driver === k} onClick={() => setDriver(k)} small/>
                ))}
              </div>
            </SubQ>
            <SubQ label="Which appeals more?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {PROBLEM_STYLE.map(([k, e, l]) => (
                  <MatcherChip key={k} emo={e} label={l} active={problemStyle === k} onClick={() => setProblemStyle(k)} small/>
                ))}
              </div>
            </SubQ>
          </>
        )}

        {/* STEP 3 — A3 Math + A4 Memorization */}
        {step === 3 && (
          <>
            <h2 className="pf-matcher__q">Two questions that can save you four years.</h2>
            <p className="pf-matcher__sub">A lot of regret comes from ignoring these. Be honest — no one is watching.</p>
            <SubQ label="How do you feel about mathematics?">
              <div className="pf-matcher__cards" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {MATH_OPTS.map(([k, e, l, d]) => (
                  <MatcherOption key={k} emo={e} label={l} desc={d} active={math === k} onClick={() => setMath(k)}/>
                ))}
              </div>
            </SubQ>
            <SubQ label="How do you feel about a lot of memorization?">
              <div className="pf-matcher__cards" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {MEMORIZATION.map(([k, e, l, d]) => (
                  <MatcherOption key={k} emo={e} label={l} desc={d} active={memorization === k} onClick={() => setMemorization(k)}/>
                ))}
              </div>
            </SubQ>
          </>
        )}

        {/* STEP 4 — A6 Work env + A7 Free text */}
        {step === 4 && (
          <>
            <h2 className="pf-matcher__q">Picture yourself at 27, on a Tuesday afternoon. Where are you working?</h2>
            <p className="pf-matcher__sub">Not the glamorous version — the ordinary Tuesday. Pick what's actually appealing.</p>
            <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(2, 1fr)"}}>
              {WORK_ENV.map(([k, e, l]) => (
                <MatcherChip key={k} emo={e} label={l} active={workEnv === k} onClick={() => setWorkEnv(k)} small/>
              ))}
            </div>
            <SubQ label="What topic do you fall down rabbit holes about — where you forget to eat?" hint="Optional. Two or three words is enough. This helps the matcher reason about you specifically, not just a bucket.">
              <textarea
                value={curiosity}
                onChange={e => setCuriosity(e.target.value)}
                placeholder="e.g. how apps are built · why economies collapse · architecture of cities"
                rows={3}
                style={{width:"100%",padding:"12px 14px",border:"1.5px solid var(--ink-16)",borderRadius:"var(--r-input)",background:"var(--bg)",fontFamily:"inherit",fontSize:14,lineHeight:1.5,outline:"none",resize:"vertical"}}
              />
            </SubQ>
          </>
        )}

        {/* STEP 5 — B1 HSC */}
        {step === 5 && (
          <>
            <div className="pf-matcher__transition">
              <strong>Good.</strong> Now the parts most career quizzes skip entirely — the real-world constraints that actually determine what's available to you.
            </div>
            <h2 className="pf-matcher__q">Which stream did you study in HSC?</h2>
            <p className="pf-matcher__sub">The hard filter — this determines which subjects you can actually apply for. No point planning around a subject that won't take you.</p>
            <div className="pf-matcher__cards">
              {HSC.map(([k, e, l, d]) => (
                <MatcherOption key={k} emo={e} label={l} desc={d} active={hsc === k} onClick={() => setHsc(k)}/>
              ))}
            </div>
            {hscPreview ? <div style={{marginBottom: 16}}>{hscPreview}</div> : null}
          </>
        )}

        {/* STEP 6 — B2 Results + B3 Budget + B4 Location */}
        {step === 6 && (
          <>
            <h2 className="pf-matcher__q">Three questions your parents are definitely already asking.</h2>
            <p className="pf-matcher__sub">Soft filters — these shape which universities surface, not which subjects you can pick. Be realistic, not optimistic.</p>
            <SubQ label="Roughly, how did your results go?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {RESULTS_BAND.map(([k, l, d]) => (
                  <MatcherChip key={k} emo="" label={l} desc={d} active={resultsBand === k} onClick={() => setResultsBand(k)} small/>
                ))}
              </div>
            </SubQ>
            <SubQ label="Which is realistic for your family right now?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {BUDGET.map(([k, l, d]) => (
                  <MatcherChip key={k} emo="" label={l} desc={d} active={budget === k} onClick={() => setBudget(k)} small/>
                ))}
              </div>
            </SubQ>
            <SubQ label="Where can you realistically study?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {LOCATION.map(([k, l, d]) => (
                  <MatcherChip key={k} emo="" label={l} desc={d} active={location === k} onClick={() => setLocation(k)} small/>
                ))}
              </div>
            </SubQ>
          </>
        )}

        {/* STEP 7 — B5 Abroad + B6 Risk + B7 Pushed (optional) */}
        {step === 7 && (
          <>
            <h2 className="pf-matcher__q">Two honest questions most people answer wrong.</h2>
            <p className="pf-matcher__sub">These tune your result — not your eligibility. Answer what's true, not what sounds ambitious.</p>
            <SubQ label="Do you hope to study or work abroad eventually?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {ABROAD.map(([k, e, l, d]) => (
                  <MatcherChip key={k} emo={e} label={l} desc={d} active={abroad === k} onClick={() => setAbroad(k)} small/>
                ))}
              </div>
            </SubQ>
            <SubQ label="How do you feel about career risk?">
              <div className="pf-matcher__chips" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                {RISK.map(([k, e, l, d]) => (
                  <MatcherChip key={k} emo={e} label={l} desc={d} active={risk === k} onClick={() => setRisk(k)} small/>
                ))}
              </div>
            </SubQ>
            <SubQ label="Is your family already pushing a specific subject on you?" hint="Optional. We won't dismiss it — but we'll show you what else fits alongside it, so the conversation can be about real tradeoffs.">
              <input
                type="text"
                value={pushed}
                onChange={e => setPushed(e.target.value)}
                placeholder="e.g. MBBS · CSE · BBA · Engineering"
                style={{width:"100%",padding:"12px 14px",border:"1.5px solid var(--ink-16)",borderRadius:"var(--r-input)",background:"var(--bg)",fontFamily:"inherit",fontSize:14,outline:"none"}}
              />
            </SubQ>
          </>
        )}

        <div className="pf-matcher__actions">
          {step > 1 ? <button className="pf-link" onClick={onBack}>← Back</button> : <span/>}
          <button className="btn btn-primary" onClick={onNext} disabled={!canNext()} style={{opacity: canNext() ? 1 : 0.5, cursor: canNext() ? "pointer" : "not-allowed"}}>
            {step < TOTAL ? "Continue →" : "See my matches →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Processing() {
  const lines = [
    "Reading your answers…",
    "Matching against HSC eligibility rules…",
    "Pulling in what seniors actually said…",
    "Building your personalised roadmap…",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const ts = [
      setTimeout(() => setI(1), 500),
      setTimeout(() => setI(2), 1000),
      setTimeout(() => setI(3), 1500),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <div className="pf-matcher">
      <div className="pf-matcher__card" style={{textAlign:"center", padding: "64px 44px"}}>
        <div style={{margin: "0 auto 32px",width:"60%",height:6,background:"var(--ink-08)",borderRadius:100,overflow:"hidden",position:"relative"}}>
          <div style={{height:"100%",width:"30%",background:"var(--green)",borderRadius:100,animation:"pf-sweep 1.5s linear infinite",position:"absolute",left:"-30%"}}/>
        </div>
        <style>{`@keyframes pf-sweep { from {left:-30%;} to {left:100%;} }`}</style>
        <div style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:22,lineHeight:1.3,color:"var(--text)"}}>{lines[i]}</div>
      </div>
    </div>
  );
}

// ── Scoring heuristic v2 — weighted features, interaction effects, hard gates ──
// Approximates what an XGBoost model trained on the CSV would learn.
// Swap scoreSubject() for model inference once you have real training data.
function scoreSubject(s, inputs) {
  let score = 50;

  // ── Feature 1: Interest overlap (most predictive feature) ──
  // Each match adds weight proportional to how "core" that interest is to the subject.
  const interestMap = {
    "cse":                 { puzzles:18, computers:20, building:10, art:4 },
    "uiux":                { art:20, computers:18, puzzles:8, writing:6 },
    "physics":             { puzzles:18, lab:15, building:8, nature:6 },
    "mathematics":         { puzzles:22, lab:6 },
    "civil-engineering":   { building:20, puzzles:14, nature:6 },
    "agriculture":         { nature:20, lab:14, building:8 },
    "bba":                 { business:20, people:16, society:8 },
    "economics":           { puzzles:14, business:18, society:14, writing:6 },
    "finance-banking":     { business:18, puzzles:14, society:8 },
    "psychology":          { people:20, lab:12, writing:8, society:10 },
    "development-studies": { people:16, society:18, writing:12, nature:6 },
    "journalism":          { writing:20, society:16, art:10, people:12 },
    "english-lit":         { writing:22, society:12, art:8 },
    "bangla":              { writing:18, society:14, art:6 },
    "geography":           { nature:16, society:14, lab:10, building:6 },
  };
  const weights = interestMap[s.slug] || {};
  for (const [tag, w] of Object.entries(weights)) {
    if (inputs.interests.has(tag)) score += w;
  }

  // ── Feature 2: Math — hard gate for math-heavy subjects ──
  if (s.math) {
    if (inputs.math === "love")  score += 22;
    else if (inputs.math === "ok") score += 8;
    else { score -= 25; } // "avoid" + math-heavy = serious mismatch
  } else {
    if (inputs.math === "avoid") score += 10;
    if (inputs.math === "love")  score -= 4; // math lovers less satisfied in non-math subjects
  }

  // ── Feature 3: Memorization tolerance ──
  const heavyMemSubjects = ["bangla","english-lit","psychology","development-studies","journalism"];
  if (heavyMemSubjects.includes(s.slug)) {
    if (inputs.memorization === "fine")   score += 8;
    if (inputs.memorization === "reason") score -= 12;
  }

  // ── Feature 4: Primary driver (what keeps you going) ──
  const driverFit = {
    "logic":     { cse:14, mathematics:14, physics:12, economics:10, "finance-banking":10, "civil-engineering":10 },
    "aesthetic": { uiux:16, journalism:12, "english-lit":10 },
    "impact":    { psychology:16, "development-studies":14, agriculture:12, bangla:8, journalism:8 },
    "payoff":    { cse:14, bba:12, "finance-banking":14, economics:8 },
    "curiosity": { physics:14, mathematics:12, "english-lit":10, geography:10, "development-studies":8, uiux:8 },
  };
  const driverBoosts = driverFit[inputs.driver] || {};
  score += driverBoosts[s.slug] || 0;

  // ── Feature 5: Problem style preference ──
  const closedSubjects = ["cse","civil-engineering","mathematics","finance-banking","physics"];
  const openSubjects   = ["development-studies","journalism","uiux","english-lit","psychology","bangla","geography"];
  if (inputs.problemStyle === "closed" && closedSubjects.includes(s.slug)) score += 8;
  if (inputs.problemStyle === "open"   && openSubjects.includes(s.slug))   score += 8;
  if (inputs.problemStyle === "closed" && openSubjects.includes(s.slug))   score -= 5;
  if (inputs.problemStyle === "open"   && closedSubjects.includes(s.slug)) score -= 5;

  // ── Feature 6: Work environment ──
  const envFit = {
    "desk":   { cse:12, uiux:10, "finance-banking":10, mathematics:8, journalism:6 },
    "lab":    { physics:14, agriculture:12, geography:10, psychology:8 },
    "people": { bba:12, psychology:14, "development-studies":10, "english-lit":8, bangla:6, journalism:8 },
    "site":   { "civil-engineering":14, agriculture:10, geography:8 },
    "flex":   { journalism:10, uiux:8, psychology:6, "development-studies":8 },
  };
  const envBoosts = envFit[inputs.workEnv] || {};
  score += envBoosts[s.slug] || 0;

  // ── Feature 7: HSC group — hard eligibility gate ──
  const groupMap = { science: "Science", commerce: "Commerce", arts: "Arts", any: null };
  const group = groupMap[inputs.hsc];
  let eligibility = "full";
  if (group && !s.hsc.includes(group)) {
    eligibility = "alternative";
    score -= 50; // hard gate — wrong HSC = very unlikely to admit
  } else if (s.math && inputs.math === "avoid") {
    eligibility = "note";
  }

  // ── Feature 8: Results band ──
  // Strong results → reward competitive subjects, penalise nothing
  // Below average → reward more accessible subjects
  const competitive = ["cse","physics","mathematics"];
  if (inputs.resultsBand === "strong"  && competitive.includes(s.slug)) score += 8;
  if (inputs.resultsBand === "below"   && competitive.includes(s.slug)) score -= 10;
  if (inputs.resultsBand === "below"   && !competitive.includes(s.slug)) score += 4;

  // ── Feature 9: Budget constraint ──
  if (inputs.budget === "public" && s.confidence === "verified") score += 4; // verified = popular at public unis

  // ── Feature 10: Abroad intent — interaction effect ──
  const abroadFriendly = ["cse","physics","mathematics","economics","finance-banking","uiux","development-studies"];
  if (inputs.abroad === "yes" && abroadFriendly.includes(s.slug)) score += 10;
  if (inputs.abroad === "stay" && ["bangla","journalism","development-studies"].includes(s.slug)) score += 5;

  // ── Feature 11: Risk appetite ──
  if (inputs.risk === "stable") {
    if (["bba","civil-engineering","bangla","agriculture","psychology"].includes(s.slug)) score += 7;
    if (["uiux","journalism"].includes(s.slug)) score -= 5; // volatile markets
  }
  if (inputs.risk === "upside") {
    if (["cse","uiux","finance-banking","economics"].includes(s.slug)) score += 8;
  }

  // ── Feature 12: Free-text curiosity signal (simple keyword match) ──
  if (inputs.curiosity) {
    const curio = inputs.curiosity.toLowerCase();
    const curioBoosters = {
      "cse": ["code","coding","programming","software","web","app","algorithm","data","machine","ai","tech"],
      "uiux": ["design","ui","ux","figma","product","visual","brand","graphic"],
      "physics": ["physics","quantum","energy","universe","research","science"],
      "economics": ["economy","economics","market","trade","finance","macro","micro"],
      "journalism": ["journalism","media","news","writing","story","content","blog"],
      "psychology": ["psychology","mental","mind","therapy","behavior","human"],
      "agriculture": ["agriculture","farming","food","environment","biology","plant"],
      "civil-engineering": ["civil","structure","building","bridge","urban","construction"],
    };
    for (const [slug, keywords] of Object.entries(curioBoosters)) {
      if (s.slug === slug && keywords.some(k => curio.includes(k))) score += 8;
    }
  }

  // ── Guard: Listed-only subjects cannot rank #1 ──
  if (s.confidence === "listed")   score -= 8;
  if (s.confidence === "emerging") score -= 2;

  score = Math.max(28, Math.min(96, Math.round(score)));
  return { score, eligibility };
}

// ── Per-subject pathway data ──
const PATHWAY_UNIS = {
  cse:                 { pub: "BUET · RUET · DU · KUET · SUST",      priv: "BRAC · NSU · DIU · AIUB · EWU" },
  physics:             { pub: "DU · BUET · JU · RU · SUST",          priv: "BRAC · IUB" },
  bba:                 { pub: "DU IBA · JU · RU · CU",               priv: "NSU · BRAC · IUB · EWU · ULAB" },
  economics:           { pub: "DU · JU · RU · CU",                   priv: "NSU · BRAC · IUB" },
  "finance-banking":   { pub: "DU · JU · RU · KUET",                 priv: "NSU · BRAC · EWU · DIU" },
  "civil-engineering": { pub: "BUET · RUET · CUET · KUET · DUET",   priv: "BRAC · IUB · UAP" },
  agriculture:         { pub: "BAU · BSMRAU · SAU · PSTU",           priv: "Daffodil · BSMRASTU" },
  psychology:          { pub: "DU · JU · JnU · CU",                  priv: "NSU · BRAC · IUB" },
  "english-lit":       { pub: "DU · JU · RU · CU · SUST",            priv: "NSU · BRAC · ULAB" },
  journalism:          { pub: "DU · JU · RU · SUST",                 priv: "BRAC · NSU · DIU" },
  uiux:                { pub: "BUET (CSE track) · DU (fine arts)",   priv: "BRAC · NSU · UIU · Daffodil" },
  mathematics:         { pub: "DU · BUET · JU · RU · SUST",          priv: "IUB · BRAC" },
  "development-studies": { pub: "DU · JU · BRAC University",         priv: "BRAC · NSU · IUB" },
  geography:           { pub: "DU · JU · RU · JnU",                  priv: "BRAC (limited)" },
  bangla:              { pub: "DU · JU · RU · CU · SUST",            priv: "BRAC · ULAB" },
};

const ABROAD_NOTES = {
  cse:               "Germany (TU Munich, TU Berlin) · Canada · Korea GKS · Malaysia UTM. CSE scholarships plentiful.",
  physics:           "DAAD Germany · Korea GKS · Japan MEXT. Science scholarships very competitive.",
  bba:               "UK · Australia · Malaysia. MBA pathways after 2-3 years work experience.",
  economics:         "UK LSE, Edinburgh · Canada · Australia. Strong research pathway abroad.",
  "finance-banking": "UK · Singapore · Canada. CFA and ACCA open international doors.",
  uiux:              "UK · Germany · Canada. Portfolio-based — no IELTS barrier for some programmes.",
};

function getPathways(subject, inputs) {
  const unis = PATHWAY_UNIS[subject.slug] || {
    pub: "Major public universities offering " + subject.name,
    priv: "Private universities offering " + subject.name,
  };
  const salary = subject.regional && subject.regional.dhaka ? subject.regional.dhaka.salary : "BDT 20k–60k/mo";
  const abroadNote = ABROAD_NOTES[subject.slug] ||
    "Options exist — IELTS 6.5+ required for most English-taught programmes.";
  const budgetIsPublic  = inputs.budget === "public";
  const budgetIsPrivate = inputs.budget === "private";
  const wantsAbroad     = inputs.abroad === "yes";

  return [
    {
      id: "public",
      variant: "public",
      badge: "Route A",
      label: "Public university",
      title: subject.name + " at a public university",
      rows: [
        { key: "Yearly cost",      val: "BDT 5,000–30,000" },
        { key: "Duration",         val: "4 years (Honours / B.Sc)" },
        { key: "Key universities", val: unis.pub },
        { key: "Starting salary",  val: salary },
        { key: "Scholarship",      val: "Merit seats available — competition is high" },
      ],
      note: budgetIsPublic
        ? "This fits your budget goal."
        : "Most affordable route — but admission cutoffs are very competitive.",
      recommended: budgetIsPublic && !wantsAbroad,
    },
    {
      id: "private",
      variant: "private",
      badge: "Route B",
      label: "Private university",
      title: subject.name + " at a private university",
      rows: [
        { key: "Yearly cost",      val: "BDT 80,000–200,000" },
        { key: "Duration",         val: "4 years (BSc / BBA)" },
        { key: "Key universities", val: unis.priv },
        { key: "Starting salary",  val: salary + " (similar ceiling)" },
        { key: "Scholarship",      val: "Merit-based waivers — negotiate before you enroll" },
      ],
      note: budgetIsPublic
        ? "This costs significantly more than your stated budget."
        : "More flexible entry — merit scholarships can reduce cost by 25–50%.",
      recommended: budgetIsPrivate && !wantsAbroad,
    },
    {
      id: "abroad",
      variant: "abroad",
      badge: "Route C",
      label: "Study abroad",
      title: subject.name + " — international track",
      rows: [
        { key: "Yearly cost",      val: "USD 8,000–35,000 (varies widely by country)" },
        { key: "Duration",         val: "3–4 years (Bachelor's)" },
        { key: "Where",            val: abroadNote.split(".")[0] },
        { key: "Requirements",     val: "IELTS 6.0–7.0 · transcript · SOP" },
        { key: "Scholarships",     val: abroadNote.split(".").slice(1).join(".").trim() || "Research country-specific portals" },
      ],
      note: wantsAbroad
        ? "This aligns with your stated goal — start IELTS prep early."
        : "Requires 12–18 months of preparation. Worth planning now even as a backup.",
      recommended: wantsAbroad,
    },
  ];
}

function PathwayCard({ p, onExplore }) {
  return (
    <div className={"pf-pathway pf-pathway--" + p.variant + (p.recommended ? " is-recommended" : "")}>
      {p.recommended && (
        <div className="pf-pathway__rec">Matches your goals</div>
      )}
      <div className="pf-pathway__badge">{p.badge} · {p.label}</div>
      <div className="pf-pathway__title">{p.title}</div>
      <div className="pf-pathway__rows">
        {p.rows.map(r => (
          <div key={r.key} className="pf-pathway__row">
            <span className="pf-pathway__key">{r.key}</span>
            <span className="pf-pathway__val">{r.val}</span>
          </div>
        ))}
      </div>
      <div className="pf-pathway__note">{p.note}</div>
      {onExplore && (
        <button className="pf-link" onClick={onExplore} style={{fontSize:12, marginTop:10}}>
          Full subject profile →
        </button>
      )}
    </div>
  );
}

function OutcomeStrip({ subject }) {
  const testimonials = PFData.testimonials.filter(t => t.subjectSlug === subject.slug);
  const total    = testimonials.length;
  const yesCount = testimonials.filter(t => t.again === "yes").length;
  const noCount  = testimonials.filter(t => t.again === "no").length;
  const abroadCount = testimonials.filter(t => t.country !== "BD").length;
  if (total < 2) return null;
  return (
    <div className="pf-outcome-strip">
      <div className="pf-outcome-strip__label">What seniors in this field reported</div>
      <div className="pf-outcome-strip__cols">
        <div>
          <div className="pf-outcome-strip__num" style={{color:"var(--green)"}}>{yesCount}</div>
          <div className="pf-outcome-strip__desc">of {total} would recommend</div>
        </div>
        {noCount > 0 && (
          <div>
            <div className="pf-outcome-strip__num" style={{color:"var(--terracotta)"}}>{noCount}</div>
            <div className="pf-outcome-strip__desc">would not</div>
          </div>
        )}
        {abroadCount > 0 && (
          <div>
            <div className="pf-outcome-strip__num" style={{color:"#1F4F86"}}>{abroadCount}</div>
            <div className="pf-outcome-strip__desc">now working / studying abroad</div>
          </div>
        )}
        <div>
          <div className="pf-outcome-strip__num">{total}</div>
          <div className="pf-outcome-strip__desc">total voices in this field</div>
        </div>
      </div>
    </div>
  );
}

function Results({ inputs, go, onRetry }) {
  const scored = PFData.subjects
    .map(s => ({ ...scoreSubject(s, inputs), subject: s }))
    .sort((a, b) => b.score - a.score);
  // Build Plan §4.1: Listed-only subject may never be #1
  if (scored[0] && scored[0].subject.confidence === "listed") {
    const idx = scored.findIndex(r => r.subject.confidence !== "listed");
    if (idx > 0) { const swap = scored[0]; scored[0] = scored[idx]; scored[idx] = swap; }
  }
  const top   = scored[0];
  const alts  = scored.slice(1, 3);
  const ranks = ["Strong match", "Worth investigating"];

  if (!top) return (
    <div className="pf-matcher">
      <div className="pf-matcher__card" style={{textAlign:"center"}}>
        <p>Not enough data to match right now. Try the explore screen.</p>
        <button className="btn btn-primary" onClick={() => go("explore")}>Explore subjects →</button>
      </div>
    </div>
  );

  const s = top.subject;
  const pathways = getPathways(s, inputs);

  // One relevant senior quote for the top match
  const seniorQuote = PFData.testimonials.find(t =>
    t.subjectSlug === s.slug && t.good && t.good.length > 30
  );

  return (
    <div className="pf-matcher">
      <div style={{maxWidth: "var(--container-product)", margin: "0 auto", padding: "0 24px 64px"}}>

        {/* ── Nav row ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32,paddingTop:8}}>
          <button className="pf-link" onClick={onRetry}>← Start over</button>
          <span className="micro" style={{margin:0}}>Your personalised roadmap</span>
        </div>

        {/* ── Top match hero ── */}
        <div style={{marginBottom:8}}>
          <div className="micro" style={{color:"var(--green)",marginBottom:10}}>Best fit for you</div>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:36,fontWeight:700,lineHeight:1.1,marginBottom:8,letterSpacing:"-0.02em"}}>
            {s.name}
          </h2>
          <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:16,lineHeight:1.5}}>
            {PFData.FIELDS[s.field] ? PFData.FIELDS[s.field].label : s.field}
            {" · "}HSC: {s.hsc.join(" or ")}
            {s.confidence === "verified" && <span style={{color:"#0A5E44",fontWeight:600}}> · Verified evidence</span>}
            {s.confidence === "emerging" && <span style={{color:"#1F4F86",fontWeight:600}}> · Emerging evidence</span>}
            {s.confidence === "listed"   && <span style={{color:"#7A5400",fontWeight:600}}> · Limited evidence — treat as a starting point</span>}
          </div>

          {/* Match score bar */}
          <div className="pf-result__bar" style={{marginBottom:16}}>
            <span className="micro" style={{margin:0,minWidth:84}}>Match score</span>
            <div className="track"><div className="fill" style={{width: top.score + "%"}}/></div>
            <span className="pct">{top.score}%</span>
          </div>

          {/* Eligibility signal */}
          {top.eligibility === "full" && (
            <div style={{padding:"10px 14px",background:"#E2F1EA",borderRadius:10,color:"#0A5E44",fontSize:13,fontWeight:500,marginBottom:16,display:"inline-block"}}>
              Fully eligible — your HSC group qualifies. No barriers.
            </div>
          )}
          {top.eligibility === "note" && (
            <div style={{padding:"10px 14px",background:"#FBEFD0",borderRadius:10,color:"#7A5400",fontSize:13,fontWeight:500,marginBottom:16,display:"inline-block"}}>
              Eligible — but you said you prefer to avoid math, and this subject is math-heavy.
            </div>
          )}
          {top.eligibility === "alternative" && (
            <HonestyBox label="Direct entry restricted">
              Your HSC group can't directly enrol. If this interests you, consider{" "}
              <strong>{(PFData.subjects.find(x => x.slug === (s.alts && s.alts[0])) || {}).name || "a related subject"}</strong>{" "}
              — similar work, open to all HSC groups.
            </HonestyBox>
          )}
        </div>

        {/* ── Senior voice ── */}
        {seniorQuote && (
          <div style={{
            background:"var(--surface)", borderRadius:14, padding:"20px 22px",
            marginBottom:24, boxShadow:"var(--shadow-1)",
            borderLeft:"3px solid var(--green)",
          }}>
            <div className="micro" style={{marginBottom:8,color:"var(--green)"}}>
              A senior in this field says
            </div>
            <div style={{fontFamily:"var(--font-display)",fontSize:15,lineHeight:1.65,fontStyle:"italic",fontWeight:500,color:"var(--text)"}}>
              {seniorQuote.good}
            </div>
            <div style={{fontSize:12,color:"var(--text-muted)",marginTop:10}}>
              {seniorQuote.uni} · {seniorQuote.role || "Graduate"}
            </div>
          </div>
        )}

        {/* ── Outcome strip ── */}
        <OutcomeStrip subject={s}/>

        {/* ── Three pathway cards ── */}
        <div style={{marginTop:28,marginBottom:8}}>
          <div className="micro" style={{marginBottom:6}}>Your three routes for this subject</div>
          <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:20,lineHeight:1.5}}>
            Every subject can be reached through different paths. Here are the realistic options — with honest costs.
          </div>
        </div>
        <div className="pf-pathways">
          {pathways.map(p => (
            <PathwayCard
              key={p.id}
              p={p}
              onExplore={p.id === "public" ? () => go("detail", { subjectSlug: s.slug }) : null}
            />
          ))}
        </div>

        {/* ── Deep-dive CTA + Share ── */}
        <div style={{display:"flex",gap:10,marginTop:20,flexWrap:"wrap",alignItems:"center"}}>
          <button className="btn btn-primary" onClick={() => go("detail", { subjectSlug: s.slug })}>
            Full subject profile →
          </button>
          <button className="pf-link" onClick={() => go("stories")} style={{fontSize:13}}>
            Read seniors in this field →
          </button>
          <button
            className="pf-share-btn"
            onClick={() => {
              const text = `My EduPath BD result: ${s.name} (${top.score}% match).\nSee yours: https://edupath-bd.vercel.app`;
              if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                  const btn = document.getElementById("pf-copy-btn");
                  if (btn) { btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = "Copy result"; }, 2000); }
                });
              }
            }}
            id="pf-copy-btn"
          >
            Copy result
          </button>
          <a
            href={"https://wa.me/?text=" + encodeURIComponent(`My EduPath BD result: ${s.name} (${top.score}% match). Get yours free: https://edupath-bd.vercel.app`)}
            target="_blank"
            rel="noopener noreferrer"
            className="pf-share-btn pf-share-btn--wa"
          >
            Share on WhatsApp
          </a>
        </div>

        {/* ── Secondary matches ── */}
        {alts.length > 0 && (
          <div style={{marginTop:48}}>
            <div className="micro" style={{marginBottom:20}}>Also worth exploring</div>
            {alts.map((r, i) => {
              const as = r.subject;
              return (
                <div key={as.slug} className="pf-result" style={{marginBottom:16}}>
                  <div className="pf-result__head">
                    <div>
                      <div className="pf-result__rank" style={{color:"var(--text-muted)",fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase"}}>
                        {ranks[i]}
                      </div>
                      <div className="pf-result__title" style={{marginTop:6}}>{as.name}</div>
                      <div className="pf-result__meta">
                        {PFData.FIELDS[as.field] ? PFData.FIELDS[as.field].label : as.field}
                        {" · "}HSC: {as.hsc.join(" or ")}
                      </div>
                    </div>
                  </div>
                  <div className="pf-result__bar">
                    <span className="micro" style={{margin:0,minWidth:84}}>Match score</span>
                    <div className="track"><div className="fill" style={{width: r.score + "%"}}/></div>
                    <span className="pct">{r.score}%</span>
                  </div>
                  <button
                    className="pf-link"
                    style={{fontSize:12,marginTop:4}}
                    onClick={() => go("detail", { subjectSlug: as.slug })}
                  >
                    See subject profile →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pushed subject note ── */}
        {inputs.pushed && (
          <div style={{background:"var(--surface-alt)",borderRadius:14,padding:"18px 22px",marginTop:24,fontSize:14,lineHeight:1.5,color:"var(--text)"}}>
            <div className="micro" style={{marginBottom:6}}>About the subject you mentioned</div>
            You mentioned <strong>{inputs.pushed}</strong>. We're not dismissing it — but the matches above are the closest fit to how you described yourself. Both paths can be right; now you have data for both.
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div style={{background:"var(--gold-16)",borderRadius:14,padding:"20px 22px",marginTop:24,fontSize:14,lineHeight:1.6}}>
          <strong>This is one input — not a verdict.</strong> Talk to people already in these fields. Show this to your parents. Speak to a teacher you trust. We're a starting point, not a finish line.
        </div>

      </div>
      <Footer go={go}/>
    </div>
  );
}

Object.assign(window, { ScreenMatcher });
