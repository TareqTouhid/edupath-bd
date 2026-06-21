// Patches:
// 1. FeaturedSubjectsSection: remove salary/regret, add uni count + job count, update eyebrow/body copy
// 2. SearchBar: pill border-radius on input + button
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;

function rep(label, find, replace) {
  if (!html.includes(find)) { console.error('❌', label); fail++; return; }
  html = html.replace(find, replace);
  console.log('✅', label); ok++;
}

// ── 1. FeaturedSubjectsSection eyebrow: remove "honest data" ──────────────
rep('Subjects: remove honest-data eyebrow',
  '"Six subjects \\xB7 honest data"',
  '"Six subjects"'
);

// ── 2. Subjects: remove "Salary ranges sourced / regret rates" body text ──
rep('Subjects: remove salary/regret body copy',
  '"Salary ranges sourced from alumni. Regret rates computed from responses. Click any subject to see the full profile."',
  '"Click any subject to see career paths, universities and alumni voices."'
);

// ── 3. Subject card: replace salary+regret rows with uni count + job count ──
// Current: pf-scard__data with Dhaka salary row + conditional regret row
// Replace with: universities count + jobs count
const OLD_CARD_DATA =
  `/*#__PURE__*/React.createElement("div", {\r\n        className: "pf-scard__data"\r\n      }, /*#__PURE__*/React.createElement("div", {\r\n        className: "pf-scard__row"\r\n      }, /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__lbl"\r\n      }, "Dhaka salary"), /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__val"\r\n      }, s.regional.dhaka.salary)), regretRate > 0 && tcount >= 3 && /*#__PURE__*/React.createElement("div", {\r\n        className: "pf-scard__row"\r\n      }, /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__lbl"\r\n      }, "Regret rate"), /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__val pf-scard__val--alert"\r\n      }, regretRate, "%")))`;

const NEW_CARD_DATA =
  `/*#__PURE__*/React.createElement("div", {\r\n        className: "pf-scard__data"\r\n      }, /*#__PURE__*/React.createElement("div", {\r\n        className: "pf-scard__row"\r\n      }, /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__lbl"\r\n      }, "Universities"), /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__val"\r\n      }, uniCount || "—")), /*#__PURE__*/React.createElement("div", {\r\n        className: "pf-scard__row"\r\n      }, /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__lbl"\r\n      }, "Career paths"), /*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__val"\r\n      }, jobCount || "—")))`;

rep('Subjects: swap salary/regret with uni+job count', OLD_CARD_DATA, NEW_CARD_DATA);

// ── 4. Add uniCount + jobCount variables before each subject card render ──
// Currently: const regretRate = ...
// Replace with: add uniCount + jobCount
rep('Subjects: add uniCount + jobCount vars',
  `const tcount = PFData.testimonials.filter(t => t.subjectSlug === s.slug).length;\r\n      const noCount = PFData.testimonials.filter(t => t.subjectSlug === s.slug && t.again === "no").length;\r\n      const regretRate = tcount ? Math.round(noCount / tcount * 100) : 0;`,
  `const tcount = PFData.testimonials.filter(t => t.subjectSlug === s.slug).length;\r\n      const allUnis = [\r\n        ...(window.UGCData?.universities?.public || []),\r\n        ...(window.UGCData?.universities?.private || []),\r\n        ...(window.UGCData?.universities?.international || [])\r\n      ];\r\n      const uniCount = allUnis.filter(u => (u.subjects || []).some(sub => sub.slug === s.slug)).length;\r\n      const jobCount = (window.CareerData?.jobTitles?.(s.slug) || []).length;`
);

// ── 5. Remove voices count from subject card top (cleaner look) ──
// Keep just the field pill, remove voice count
rep('Subjects: remove voice count from card top',
  `/*#__PURE__*/React.createElement("span", {\r\n        className: "pf-scard__voices"\r\n      }, tcount, " ", tcount === 1 ? "voice" : "voices")`,
  `null`
);

// ── 6. SearchBar input: pill border-radius ──────────────────────────────
rep('SearchBar: pill input',
  'flex: 1, padding: "14px 18px", fontSize: 16,\r\n            border: "2px solid var(--ink-16)", borderRadius: 10,',
  'flex: 1, padding: "14px 20px", fontSize: 16,\r\n            border: "1.5px solid var(--ink-16)", borderRadius: "var(--r-pill)",'
);

// ── 7. SearchBar button: match primary btn style ────────────────────────
rep('SearchBar: pill button',
  'padding: "14px 24px", background: "var(--green)", color: "white",\r\n            border: "none", borderRadius: 10, fontSize: 15,\r\n            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",',
  'padding: "14px 28px", background: "var(--green)", color: "white",\r\n            border: "none", borderRadius: "var(--r-pill)", fontSize: 15,\r\n            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "-0.01em",'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log(`\n${ok} ok · ${fail} failed · ${Math.round(html.length/1024)}KB`);
