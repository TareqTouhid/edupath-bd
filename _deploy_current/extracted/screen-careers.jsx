// EduPath BD — Career Salary Guide
// Starting salaries by field across 15 countries relevant to BD graduates.
// All figures: starting/entry-level, 0-3 years experience.
// Sources: Glassdoor, LinkedIn Salary, Levels.fyi, BBS, World Bank job portals.

const CAREER_COUNTRIES = [
  { id:"us",  flag:"🇺🇸", name:"USA",            unit:"USD/yr",    visa:"H-1B · OPT",         note:"Highest absolute pay. Very competitive visa." },
  { id:"uk",  flag:"🇬🇧", name:"United Kingdom", unit:"GBP/yr",    visa:"Skilled Worker visa", note:"Strong for Finance, Law, Engineering." },
  { id:"ca",  flag:"🇨🇦", name:"Canada",         unit:"CAD/yr",    visa:"Express Entry · PNP", note:"Clearest PR pathway for BD graduates." },
  { id:"au",  flag:"🇦🇺", name:"Australia",      unit:"AUD/yr",    visa:"TSS 482 · SC 189",   note:"High quality of life, strong engineering demand." },
  { id:"de",  flag:"🇩🇪", name:"Germany",        unit:"EUR/yr",    visa:"EU Blue Card",        note:"No tuition. DAAD scholarships. Strong industry." },
  { id:"kr",  flag:"🇰🇷", name:"South Korea",    unit:"KRW/mo",    visa:"E-7 · GKS scholar",  note:"GKS scholarship covers full tuition + stipend." },
  { id:"sg",  flag:"🇸🇬", name:"Singapore",      unit:"SGD/mo",    visa:"Employment Pass",     note:"Regional tech hub. Low tax. High competition." },
  { id:"ae",  flag:"🇦🇪", name:"UAE (Dubai)",    unit:"AED/mo",    visa:"Work visa",           note:"Tax-free income. Largest BD expatriate community." },
  { id:"my",  flag:"🇲🇾", name:"Malaysia",       unit:"MYR/mo",    visa:"Employment Pass",     note:"Affordable living. Common first destination abroad." },
  { id:"jp",  flag:"🇯🇵", name:"Japan",          unit:"JPY/mo",    visa:"Engineer / HSP",      note:"MEXT scholarship. Language barrier is real." },
  { id:"qa",  flag:"🇶🇦", name:"Qatar",          unit:"QAR/mo",    visa:"Work visa",           note:"Tax-free. Infrastructure boom. Construction/Eng." },
  { id:"sa",  flag:"🇸🇦", name:"Saudi Arabia",   unit:"SAR/mo",    visa:"Iqama",               note:"Large BD diaspora. Engineering & healthcare roles." },
  { id:"nl",  flag:"🇳🇱", name:"Netherlands",    unit:"EUR/yr",    visa:"Highly Skilled Migrant",note:"Strong tech scene. English widely spoken." },
  { id:"se",  flag:"🇸🇪", name:"Sweden",         unit:"SEK/mo",    visa:"Work permit",         note:"High salary, high tax. Strong welfare system." },
  { id:"nz",  flag:"🇳🇿", name:"New Zealand",    unit:"NZD/yr",    visa:"Skilled Migrant",     note:"Peaceful, growing tech sector. PR-friendly." },
];

// Starting salaries — entry level (0-3 years experience)
const CAREER_FIELDS = [
  {
    slug: "cse",
    name: "Software Engineering / CSE",
    desc: "Backend, frontend, mobile, DevOps, AI/ML engineering",
    demand: "high",
    subjectSlugs: ["cse"],
    bd_dhaka:   "BDT 35,000–80,000/mo",
    bd_outside: "BDT 20,000–40,000/mo",
    salaries: {
      us: "USD 80,000–125,000/yr",  uk: "£30,000–55,000/yr",
      ca: "CAD 65,000–95,000/yr",   au: "AUD 70,000–100,000/yr",
      de: "€42,000–65,000/yr",      kr: "KRW 3,200,000–4,800,000/mo",
      sg: "SGD 4,500–8,500/mo",     ae: "AED 12,000–24,000/mo",
      my: "MYR 3,500–6,500/mo",     jp: "JPY 300,000–500,000/mo",
      qa: "QAR 14,000–26,000/mo",   sa: "SAR 10,000–20,000/mo",
      nl: "€38,000–60,000/yr",      se: "SEK 38,000–55,000/mo",
      nz: "NZD 65,000–95,000/yr",
    },
  },
  {
    slug: "civil",
    name: "Civil & Structural Engineering",
    desc: "Construction, infrastructure, roads, bridges, urban planning",
    demand: "medium",
    subjectSlugs: ["civil-engineering"],
    bd_dhaka:   "BDT 25,000–55,000/mo",
    bd_outside: "BDT 18,000–35,000/mo",
    salaries: {
      us: "USD 55,000–80,000/yr",  uk: "£26,000–42,000/yr",
      ca: "CAD 55,000–80,000/yr",  au: "AUD 65,000–90,000/yr",
      de: "€36,000–52,000/yr",     kr: "KRW 2,800,000–4,000,000/mo",
      sg: "SGD 3,500–5,500/mo",    ae: "AED 10,000–18,000/mo",
      my: "MYR 2,800–4,500/mo",    jp: "JPY 260,000–380,000/mo",
      qa: "QAR 12,000–22,000/mo",  sa: "SAR 8,000–16,000/mo",
      nl: "€32,000–48,000/yr",     se: "SEK 33,000–46,000/mo",
      nz: "NZD 58,000–82,000/yr",
    },
  },
  {
    slug: "eee",
    name: "Electrical & Electronic Engineering",
    desc: "Power systems, telecom, embedded systems, electronics",
    demand: "medium",
    subjectSlugs: ["eee"],
    bd_dhaka:   "BDT 25,000–55,000/mo",
    bd_outside: "BDT 18,000–38,000/mo",
    salaries: {
      us: "USD 70,000–105,000/yr", uk: "£28,000–48,000/yr",
      ca: "CAD 60,000–88,000/yr",  au: "AUD 65,000–92,000/yr",
      de: "€38,000–58,000/yr",     kr: "KRW 2,900,000–4,200,000/mo",
      sg: "SGD 3,800–6,200/mo",    ae: "AED 9,000–17,000/mo",
      my: "MYR 3,000–5,000/mo",    jp: "JPY 270,000–400,000/mo",
      qa: "QAR 10,000–20,000/mo",  sa: "SAR 8,000–16,000/mo",
      nl: "€34,000–52,000/yr",     se: "SEK 34,000–48,000/mo",
      nz: "NZD 60,000–85,000/yr",
    },
  },
  {
    slug: "bba",
    name: "Business Administration (BBA/MBA)",
    desc: "Management, operations, marketing, HR, strategy",
    demand: "medium",
    subjectSlugs: ["bba"],
    bd_dhaka:   "BDT 20,000–45,000/mo",
    bd_outside: "BDT 14,000–28,000/mo",
    salaries: {
      us: "USD 50,000–85,000/yr",  uk: "£24,000–40,000/yr",
      ca: "CAD 48,000–75,000/yr",  au: "AUD 55,000–80,000/yr",
      de: "€32,000–50,000/yr",     kr: "KRW 2,500,000–3,800,000/mo",
      sg: "SGD 3,200–5,500/mo",    ae: "AED 8,000–16,000/mo",
      my: "MYR 2,800–4,500/mo",    jp: "JPY 240,000–360,000/mo",
      qa: "QAR 9,000–18,000/mo",   sa: "SAR 7,000–14,000/mo",
      nl: "€30,000–46,000/yr",     se: "SEK 30,000–44,000/mo",
      nz: "NZD 50,000–72,000/yr",
    },
  },
  {
    slug: "finance",
    name: "Finance & Banking",
    desc: "Investment, commercial banking, accounting, financial analysis",
    demand: "medium",
    subjectSlugs: ["finance-banking", "economics"],
    bd_dhaka:   "BDT 25,000–60,000/mo",
    bd_outside: "BDT 16,000–30,000/mo",
    salaries: {
      us: "USD 60,000–100,000/yr", uk: "£28,000–55,000/yr",
      ca: "CAD 52,000–82,000/yr",  au: "AUD 58,000–88,000/yr",
      de: "€34,000–55,000/yr",     kr: "KRW 2,800,000–4,200,000/mo",
      sg: "SGD 3,800–6,800/mo",    ae: "AED 10,000–20,000/mo",
      my: "MYR 3,000–5,200/mo",    jp: "JPY 260,000–400,000/mo",
      qa: "QAR 10,000–20,000/mo",  sa: "SAR 8,000–16,000/mo",
      nl: "€32,000–52,000/yr",     se: "SEK 32,000–48,000/mo",
      nz: "NZD 52,000–78,000/yr",
    },
  },
  {
    slug: "medicine",
    name: "Medicine / MBBS",
    desc: "General practice, specialisation, hospital medicine",
    demand: "high",
    subjectSlugs: [],
    bd_dhaka:   "BDT 30,000–60,000/mo (govt) · 40,000–100,000/mo (pvt)",
    bd_outside: "BDT 20,000–40,000/mo",
    salaries: {
      us: "USD 55,000–75,000/yr (resident) · 200,000–350,000/yr (attending)",
      uk: "£28,000–40,000/yr (junior) · £80,000–150,000/yr (consultant)",
      ca: "CAD 60,000–90,000/yr (resident) · 250,000–400,000/yr (specialist)",
      au: "AUD 65,000–100,000/yr (resident) · 200,000–400,000/yr (specialist)",
      de: "€45,000–65,000/yr (resident)",
      kr: "KRW 4,000,000–6,000,000/mo",
      sg: "SGD 5,000–9,000/mo",
      ae: "AED 15,000–35,000/mo",
      my: "MYR 4,000–7,000/mo",
      jp: "JPY 400,000–600,000/mo",
      qa: "QAR 18,000–35,000/mo",
      sa: "SAR 15,000–30,000/mo",
      nl: "€42,000–65,000/yr",
      se: "SEK 40,000–58,000/mo",
      nz: "NZD 70,000–110,000/yr (resident)",
    },
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    desc: "Clinical pharmacy, pharmaceutical industry, drug research",
    demand: "medium",
    subjectSlugs: [],
    bd_dhaka:   "BDT 22,000–50,000/mo",
    bd_outside: "BDT 15,000–28,000/mo",
    salaries: {
      us: "USD 100,000–130,000/yr",uk: "£24,000–40,000/yr",
      ca: "CAD 70,000–100,000/yr", au: "AUD 65,000–90,000/yr",
      de: "€30,000–48,000/yr",     kr: "KRW 2,600,000–3,800,000/mo",
      sg: "SGD 3,200–5,500/mo",    ae: "AED 8,000–15,000/mo",
      my: "MYR 2,800–4,500/mo",    jp: "JPY 260,000–380,000/mo",
      qa: "QAR 9,000–16,000/mo",   sa: "SAR 8,000–15,000/mo",
      nl: "€28,000–44,000/yr",     se: "SEK 30,000–42,000/mo",
      nz: "NZD 55,000–78,000/yr",
    },
  },
  {
    slug: "architecture",
    name: "Architecture & Urban Design",
    desc: "Building design, urban planning, interior architecture",
    demand: "low",
    subjectSlugs: [],
    bd_dhaka:   "BDT 20,000–50,000/mo",
    bd_outside: "BDT 14,000–28,000/mo",
    salaries: {
      us: "USD 50,000–75,000/yr",  uk: "£24,000–38,000/yr",
      ca: "CAD 48,000–72,000/yr",  au: "AUD 55,000–80,000/yr",
      de: "€30,000–48,000/yr",     kr: "KRW 2,400,000–3,500,000/mo",
      sg: "SGD 3,000–5,000/mo",    ae: "AED 8,000–16,000/mo",
      my: "MYR 2,500–4,000/mo",    jp: "JPY 230,000–350,000/mo",
      qa: "QAR 9,000–18,000/mo",   sa: "SAR 7,000–14,000/mo",
      nl: "€28,000–44,000/yr",     se: "SEK 28,000–40,000/mo",
      nz: "NZD 50,000–70,000/yr",
    },
  },
  {
    slug: "data",
    name: "Data Science / AI / ML",
    desc: "Machine learning, analytics, data engineering, AI research",
    demand: "high",
    subjectSlugs: ["cse"],
    bd_dhaka:   "BDT 40,000–90,000/mo",
    bd_outside: "BDT 25,000–50,000/mo",
    salaries: {
      us: "USD 90,000–140,000/yr", uk: "£35,000–65,000/yr",
      ca: "CAD 72,000–105,000/yr", au: "AUD 75,000–110,000/yr",
      de: "€44,000–70,000/yr",     kr: "KRW 3,500,000–5,500,000/mo",
      sg: "SGD 5,000–9,500/mo",    ae: "AED 14,000–28,000/mo",
      my: "MYR 4,000–7,500/mo",    jp: "JPY 330,000–550,000/mo",
      qa: "QAR 14,000–26,000/mo",  sa: "SAR 12,000–22,000/mo",
      nl: "€40,000–65,000/yr",     se: "SEK 40,000–60,000/mo",
      nz: "NZD 70,000–105,000/yr",
    },
  },
  {
    slug: "uiux",
    name: "UI/UX & Product Design",
    desc: "User interface, user experience, product design, visual design",
    demand: "medium",
    subjectSlugs: ["uiux"],
    bd_dhaka:   "BDT 20,000–55,000/mo",
    bd_outside: "BDT 12,000–30,000/mo",
    salaries: {
      us: "USD 65,000–105,000/yr", uk: "£27,000–50,000/yr",
      ca: "CAD 58,000–88,000/yr",  au: "AUD 60,000–92,000/yr",
      de: "€36,000–58,000/yr",     kr: "KRW 2,800,000–4,200,000/mo",
      sg: "SGD 3,800–7,000/mo",    ae: "AED 9,000–18,000/mo",
      my: "MYR 3,000–5,500/mo",    jp: "JPY 270,000–430,000/mo",
      qa: "QAR 9,000–18,000/mo",   sa: "SAR 8,000–16,000/mo",
      nl: "€34,000–55,000/yr",     se: "SEK 34,000–50,000/mo",
      nz: "NZD 55,000–85,000/yr",
    },
  },
  {
    slug: "textile",
    name: "Textile & Garment Engineering",
    desc: "Garment production, textile R&D, quality management",
    demand: "medium",
    subjectSlugs: [],
    bd_dhaka:   "BDT 25,000–60,000/mo",
    bd_outside: "BDT 18,000–35,000/mo",
    salaries: {
      us: "USD 48,000–72,000/yr",  uk: "£22,000–36,000/yr",
      ca: "CAD 45,000–68,000/yr",  au: "AUD 52,000–75,000/yr",
      de: "€30,000–46,000/yr",     kr: "KRW 2,400,000–3,600,000/mo",
      sg: "SGD 2,800–4,500/mo",    ae: "AED 7,000–14,000/mo",
      my: "MYR 2,500–4,200/mo",    jp: "JPY 230,000–340,000/mo",
      qa: "QAR 7,000–13,000/mo",   sa: "SAR 6,000–12,000/mo",
      nl: "€26,000–40,000/yr",     se: "SEK 26,000–38,000/mo",
      nz: "NZD 45,000–65,000/yr",
    },
  },
  {
    slug: "journalism",
    name: "Journalism & Media",
    desc: "Print, broadcast, digital media, content creation, PR",
    demand: "low",
    subjectSlugs: ["journalism"],
    bd_dhaka:   "BDT 15,000–35,000/mo",
    bd_outside: "BDT 10,000–20,000/mo",
    salaries: {
      us: "USD 38,000–62,000/yr",  uk: "£20,000–34,000/yr",
      ca: "CAD 36,000–58,000/yr",  au: "AUD 45,000–65,000/yr",
      de: "€26,000–42,000/yr",     kr: "KRW 2,000,000–3,200,000/mo",
      sg: "SGD 2,500–4,200/mo",    ae: "AED 6,000–12,000/mo",
      my: "MYR 2,200–3,800/mo",    jp: "JPY 220,000–320,000/mo",
      qa: "QAR 7,000–13,000/mo",   sa: "SAR 5,000–10,000/mo",
      nl: "€24,000–38,000/yr",     se: "SEK 26,000–36,000/mo",
      nz: "NZD 40,000–60,000/yr",
    },
  },
];

const demandLabel = { high: "High global demand", medium: "Good opportunities", low: "Competitive market" };
const demandColor = { high: "#0A5E44", medium: "#1F4F86", low: "#7A5400" };
const demandBg    = { high: "#E2F1EA", medium: "#DCEAF7", low: "#FBEFD0" };

function ScreenCareers({ go }) {
  const [activeField, setActiveField] = useState(CAREER_FIELDS[0].slug);

  const field = CAREER_FIELDS.find(f => f.slug === activeField) || CAREER_FIELDS[0];

  return (
    <div>
      <div className="pf-page">
        <div className="pf-container">

          {/* ── Header ── */}
          <SectionHead
            eyebrow="Starting salaries across 15 countries"
            title="What this degree actually pays."
            sub="Entry-level figures (0–3 years experience). All data is indicative — verify with current job portals before deciding."
          />

          {/* ── Field selector ── */}
          <div className="pf-careers-fields">
            {CAREER_FIELDS.map(f => (
              <button
                key={f.slug}
                className={"pf-careers-field" + (activeField === f.slug ? " is-active" : "")}
                onClick={() => setActiveField(f.slug)}
                type="button"
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* ── Field detail ── */}
          <div className="pf-careers-detail">

            {/* Field meta */}
            <div className="pf-careers-meta">
              <div>
                <h2 className="pf-careers-name">{field.name}</h2>
                <p className="pf-careers-desc">{field.desc}</p>
              </div>
              <span style={{
                display:"inline-block", padding:"5px 12px", borderRadius:100,
                background: demandBg[field.demand], color: demandColor[field.demand],
                fontSize:12, fontWeight:700, flexShrink:0,
              }}>
                {demandLabel[field.demand]}
              </span>
            </div>

            {/* Bangladesh baseline — always shown */}
            <div className="pf-careers-bd">
              <div className="pf-careers-bd__flag">🇧🇩</div>
              <div>
                <div className="pf-careers-bd__label">Bangladesh — starting salary</div>
                <div className="pf-careers-bd__dhaka">Dhaka: <strong>{field.bd_dhaka}</strong></div>
                <div className="pf-careers-bd__outside">Outside Dhaka: <strong>{field.bd_outside}</strong></div>
              </div>
            </div>

            {/* Country grid */}
            <div className="pf-careers-grid">
              {CAREER_COUNTRIES.map(c => {
                const salary = field.salaries[c.id];
                if (!salary) return null;
                return (
                  <div key={c.id} className="pf-careers-card">
                    <div className="pf-careers-card__head">
                      <span className="pf-careers-card__flag">{c.flag}</span>
                      <div>
                        <div className="pf-careers-card__country">{c.name}</div>
                        <div className="pf-careers-card__visa">{c.visa}</div>
                      </div>
                    </div>
                    <div className="pf-careers-card__salary">{salary}</div>
                    {c.note ? (
                      <div className="pf-careers-card__note">{c.note}</div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div style={{
              marginTop:28, padding:"14px 18px", background:"var(--surface-alt)",
              borderRadius:10, fontSize:12, color:"var(--text-muted)", lineHeight:1.6,
              border:"1px solid var(--ink-08)",
            }}>
              Figures reflect entry-level roles (0–3 years). Tax, cost of living, and purchasing power vary significantly by country — a SGD 5,000/mo salary in Singapore goes much less far than BDT 80,000/mo in Dhaka. Cross-reference with Glassdoor, LinkedIn Salary, and Numbeo before making decisions.
            </div>
          </div>

        </div>
      </div>

      <Footer go={go}/>
    </div>
  );
}

Object.assign(window, { ScreenCareers });
