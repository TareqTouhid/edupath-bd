// Patch ScreenLanding: consistent eyebrow + title + body + both CTAs per section
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let passed = 0, failed = 0;

function replace(label, find, replacement) {
  if (!html.includes(find)) {
    console.error('❌  Not found:', label);
    console.error('    Looking for:', JSON.stringify(find.slice(0, 80)));
    failed++;
    return;
  }
  html = html.replace(find, replacement);
  console.log('✅ ', label);
  passed++;
}

// ── Shared compiled button pair (no JSX, plain React.createElement) ─────────
const B_PRIMARY   = '/*#__PURE__*/React.createElement("button", {className: "btn btn-primary", onClick: () => go("matcher")}, "Find my path \\u2192")';
const B_SECONDARY = '/*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192")';
const CTA_WRAP    = `/*#__PURE__*/React.createElement("div", {style: {marginTop: 40, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"}}, ${B_PRIMARY}, ${B_SECONDARY})`;
const COMMA_CTA   = `, ${CTA_WRAP}`;

// ══════════════════════════════════════════════════════════════════════════
// 1. Hero — add "Share my experience" secondary CTA next to "Find my path"
// ══════════════════════════════════════════════════════════════════════════
// Current: one btn-primary "Find my path →" then div.pf-hero__trust
// Find the exact anchor
replace(
  'Hero: add secondary CTA',
  `}, "Find my path \\u2192")), /*#__PURE__*/React.createElement("div", {\r\n      className: "pf-hero__trust"`,
  `}, "Find my path \\u2192"), /*#__PURE__*/React.createElement("button", {className: "btn btn-ghost", onClick: () => go("contribute")}, "Share my experience \\u2192")), /*#__PURE__*/React.createElement("div", {\r\n      className: "pf-hero__trust"`
);

// ══════════════════════════════════════════════════════════════════════════
// 2. "The problem" section — add both CTAs inside pf-container after stats
//    "Universities on scattered websites"))))) = p + stat3-div + grid + container + section
//    Inject after ")))  " (grid closes) but before "))" (container + section close)
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Problem section: add CTAs after stats',
  `}, "Universities on scattered websites")))))`,
  `}, "Universities on scattered websites")))${COMMA_CTA}))`
);

// ══════════════════════════════════════════════════════════════════════════
// 3. "What we built" stats section — add h2 + body BEFORE stats grid
//    and add both CTAs AFTER stats grid (inside section, before section closes)
//    "Job titles with salary")))), = lbl + data-pf-reveal + grid + section
//    Inject CTA after grid closes (3rd ")") but before section closes (4th ")")
// ══════════════════════════════════════════════════════════════════════════
// 3a. Add h2 + body after the micro "What we built"
replace(
  'Stats: add h2 + body',
  `}, "What we built"), /*#__PURE__*/React.createElement("div", {\r\n      className: "pf-stats__grid"`,
  `}, "What we built"), ` +
  `/*#__PURE__*/React.createElement("h2", {style: {fontFamily: "var(--font-display)", fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8, textAlign: "center", marginTop: 8}}, "Proof is in the data."), ` +
  `/*#__PURE__*/React.createElement("p", {style: {fontSize: 15, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6, textAlign: "center"}}, "Every number comes from a real Bangladeshi graduate. Nothing estimated."), ` +
  `/*#__PURE__*/React.createElement("div", {\r\n      className: "pf-stats__grid"`
);

// 3b. Add CTAs after stats grid (before section closes)
replace(
  'Stats: add CTAs after grid',
  `}, "Job titles with salary"))))`,
  `}, "Job titles with salary")))${COMMA_CTA})`
);

// ══════════════════════════════════════════════════════════════════════════
// 4. Universities section — add both CTAs inside container
//    "See all 180+ universities →"))))  = btn + center-div + container + section
//    Inject after center-div closes (2nd ")") before container + section close
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Universities: add CTAs',
  `}, "See all 180+ universities \\u2192"))))`,
  `}, "See all 180+ universities \\u2192"))${COMMA_CTA}))`
);

// ══════════════════════════════════════════════════════════════════════════
// 5. FeaturedSubjectsSection — add both CTAs inside section
//    "See all 31 subjects →")))); = btn + marginTop-div + container + section
//    Inject after marginTop-div closes (2nd ")") before container + section
// ══════════════════════════════════════════════════════════════════════════
replace(
  'Featured Subjects: add CTAs',
  `}, "See all 31 subjects \\u2192"))))`,
  `}, "See all 31 subjects \\u2192"))${COMMA_CTA}))`
);

// ══════════════════════════════════════════════════════════════════════════
// 6. Testimonials — restructure CTAs
//    6a. Remove the inline "Share your experience" primary btn from header
//    6b. After "Read all 56 voices" add both CTAs (primary+secondary)
// ══════════════════════════════════════════════════════════════════════════
// 6a: The header is a flex div with title text + the Share btn. Remove the btn,
//     making the header just show the eyebrow/title/body text.
replace(
  'Testimonials: remove inline Share btn',
  `}, "Share your experience \\u2192")), /*#__PURE__*/React.createElement("div", {\r\n      style: {\r\n        display: "grid"`,
  `}), /*#__PURE__*/React.createElement("div", {\r\n      style: {\r\n        display: "grid"`
);

// 6b: "Read all 56 voices →")))) = btn + center-div + container + section
//     Inject CTAs after center-div closes (2nd ")") inside container
replace(
  'Testimonials: add CTAs after Read all link',
  `}, "Read all 56 voices \\u2192"))))`,
  `}, "Read all 56 voices \\u2192"))${COMMA_CTA}))`
);

// ══════════════════════════════════════════════════════════════════════════
// 7. FAQ section — add supporting body + both CTAs after accordion
//    item.a)))))) = p + details + map + flexCol-div + container + section
//    Inject after flexCol-div closes (4th ")") before container + section
// ══════════════════════════════════════════════════════════════════════════
replace(
  'FAQ: add body text + CTAs after accordion',
  `item.a))))))`,
  `item.a))))` +
  `, /*#__PURE__*/React.createElement("div", {style: {marginTop: 48, textAlign: "center"}},` +
  ` /*#__PURE__*/React.createElement("p", {style: {fontSize: 16, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6}}, "Still not sure which path is right for you? Take 3 minutes.")` +
  `${COMMA_CTA}))` // close the center div, then close container, then section = 2 more
);

// ══════════════════════════════════════════════════════════════════════════
// Done
// ══════════════════════════════════════════════════════════════════════════
fs.writeFileSync('index.html', html, 'utf8');
console.log(`\n${passed} passed · ${failed} failed · ${Math.round(html.length/1024)}KB`);
