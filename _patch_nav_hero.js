// Patch: Nav cleanup + Hero redesign + CTA cleanup across all sections
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let passed = 0, failed = 0;

function replace(label, find, rep) {
  if (!html.includes(find)) { console.error('❌  Not found:', label); failed++; return; }
  html = html.replace(find, rep);
  console.log('✅ ', label);
  passed++;
}

// ══════════════════════════════════════════════════════════════════════════
// 1. NAV — remove "Home" link, rename links to:
//    Universities | Subjects | Real Stories | Jobs
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Nav: remove Home, rename links',
  `}, /*#__PURE__*/React.createElement(Link, {
      id: "landing",
      label: "Home"
    }), /*#__PURE__*/React.createElement(Link, {
      id: "explore",
      label: "Explore"
    }), /*#__PURE__*/React.createElement(Link, {
      id: "stories",
      label: "Real stories"
    }), /*#__PURE__*/React.createElement(Link, {
      id: "careers",
      label: "Salary guide"
    })`,
  `}, /*#__PURE__*/React.createElement(Link, {
      id: "all-universities",
      label: "Universities"
    }), /*#__PURE__*/React.createElement(Link, {
      id: "all-subjects",
      label: "Subjects"
    }), /*#__PURE__*/React.createElement(Link, {
      id: "stories",
      label: "Real stories"
    }), /*#__PURE__*/React.createElement(Link, {
      id: "careers",
      label: "Jobs"
    })`
);

// ══════════════════════════════════════════════════════════════════════════
// 2. HERO — center-align, remove right demo panel, remove CTAs
//    Keep: eyebrow + h1 + subtext + search bar + trust stats
// ══════════════════════════════════════════════════════════════════════════
// The hero editorial div currently has a 2-column split with a right demo panel.
// We'll collapse it to a single centered column.

// Remove the right demo panel (everything from pf-hero__demo-panel to its closing)
replace(
  'Hero: remove demo panel',
  `, /*#__PURE__*/React.createElement("div", {
      className: "pf-hero__demo-panel",
      "data-pf-reveal": true
    },`,
  `, /*#__PURE__*/React.createElement("div", {
      style: {display: "none"},
      "aria-hidden": "true"
    },`
);

// Remove the 2 CTAs from hero (Find my path + Share my experience)
replace(
  'Hero: remove CTA buttons',
  `/*#__PURE__*/React.createElement("div", {
      className: "pf-hero__ctas",
      "data-pf-reveal": true,
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary pf-nav__btn",
      onClick: () => go("matcher")
    }, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: () => go("contribute")
    }, "Share my experience \\u2192")),`,
  `/*#__PURE__*/React.createElement("div", {style: {display:"none"}}),`
);

// ══════════════════════════════════════════════════════════════════════════
// 3. ALL EYEBROWS — ensure consistent color via .micro class
//    The micro class should always be var(--text-muted), no exceptions
// ══════════════════════════════════════════════════════════════════════════
// The CTA strip has a white eyebrow - that's fine for dark bg, keep it.
// All other micros on light backgrounds should use the .micro class color.
// The class is already defined in CSS: just make sure no inline color overrides exist
// except for the dark CTA strip.
// (The CSS .micro color is already consistent - no code change needed here)

// ══════════════════════════════════════════════════════════════════════════
// 4. STATS SECTIONS — remove both CTAs from:
//    a) "Bangladeshi students choose in the dark" (problem stats)
//    b) "Proof is in the data" (what we built)
// ══════════════════════════════════════════════════════════════════════════

// 4a. Problem stats: remove COMMA_CTA between "))))" and "))"
replace(
  'Problem stats: remove CTAs',
  `}, "Universities on scattered websites"))), /*#__PURE__*/React.createElement("div", {style: {marginTop: 40, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, /*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192")))`,
  `}, "Universities on scattered websites")))))`
);

// 4b. Stats "What we built": remove CTAs
replace(
  'Stats: remove CTAs',
  `}, "Job titles with salary"))), /*#__PURE__*/React.createElement("div", {style: {marginTop: 40, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, /*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192")))`,
  `}, "Job titles with salary"))))`
);

// ══════════════════════════════════════════════════════════════════════════
// 5. UNIVERSITIES SECTION — remove both CTAs (keep "See all" tertiary link)
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Universities: remove CTAs',
  `}, "See all 180+ universities \\u2192")), /*#__PURE__*/React.createElement("div", {style: {marginTop: 40, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, /*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192"))))`,
  `}, "See all 180+ universities \\u2192"))))`
);

// ══════════════════════════════════════════════════════════════════════════
// 6. FEATURED SUBJECTS — remove both CTAs (keep "See all" tertiary link)
//    This is in FeaturedSubjectsSection (a separate compiled block)
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Featured Subjects: remove CTAs',
  `}, "See all 31 subjects \\u2192")), /*#__PURE__*/React.createElement("div", {style: {marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, /*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path →"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience →"))))`,
  `}, "See all 31 subjects \\u2192"))))`
);

// ══════════════════════════════════════════════════════════════════════════
// 7. TESTIMONIALS — keep only "Share my experience" as secondary
//    Remove "Find my path" from here. Keep "Read all 56 voices" as tertiary.
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Testimonials: only Share button (remove Find my path)',
  `}, "Read all 56 voices \\u2192")), /*#__PURE__*/React.createElement("div", {style: {marginTop: 40, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, /*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192"))))`,
  `}, "Read all 56 voices \\u2192")), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute"), style: {marginTop: 24}}, "Share my experience \\u2192"))))`
);

// ══════════════════════════════════════════════════════════════════════════
// 8. FAQ — remove CTAs + supporting text (keep just the accordion)
// ══════════════════════════════════════════════════════════════════════════
replace(
  'FAQ: remove CTAs',
  `, /*#__PURE__*/React.createElement("div", {style: {marginTop: 48, textAlign: "center"}}, /*#__PURE__*/React.createElement("p", {style: {fontSize: 16, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6}}, "Still not sure which path is right for you? Take 3 minutes."), /*#__PURE__*/React.createElement("div", {style: {marginTop: 40, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, /*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192"))))),`,
  `),`
);

// ══════════════════════════════════════════════════════════════════════════
// 9. FINAL CTA STRIP — focus on "Find my path" only
//    Remove "Share my experience" link from the dark strip
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Final CTA: remove Share link',
  `}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {
      className: "pf-link",
      onClick: () => go("contribute"),
      style: {
        fontSize: 14,
        color: "rgba(255,255,255,0.65)"
      }
    }, "Already studying? Share your experience \\u2192")))`,
  `}, "Find my path \\u2192")))`
);

// ══════════════════════════════════════════════════════════════════════════
// 10. HERO CSS — center-align the hero content
// ══════════════════════════════════════════════════════════════════════════
// Update the hero editorial layout to be centered, not 2-col split
const HERO_EDITORIAL_CSS = `.pf-hero__editorial {`;
const heroEdiPos = html.indexOf(HERO_EDITORIAL_CSS);
if (heroEdiPos === -1) { console.error('❌  Hero editorial CSS not found'); failed++; }
else {
  // Find the closing } of this rule
  const blockStart = heroEdiPos + HERO_EDITORIAL_CSS.length;
  const blockEnd = html.indexOf('}', blockStart);
  const oldBlock = html.slice(heroEdiPos, blockEnd + 1);
  const newBlock = `.pf-hero__editorial { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 720px; margin: 0 auto; }`;
  html = html.replace(oldBlock, newBlock);
  console.log('✅  Hero: center-align CSS');
  passed++;
}

// ══════════════════════════════════════════════════════════════════════════
// Done
// ══════════════════════════════════════════════════════════════════════════
fs.writeFileSync('index.html', html, 'utf8');
console.log(`\n${passed} passed · ${failed} failed · ${Math.round(html.length/1024)}KB`);
