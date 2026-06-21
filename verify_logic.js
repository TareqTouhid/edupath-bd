// verify_logic.js — Verify hard-lock eligibility and DB integrity
const fs = require('fs');

const ENGINEERING_SLUGS = [
  "cse", "eee", "civil-engineering", "mechanical-engineering", "chemical-engineering",
  "textile-engineering", "industrial-engineering", "naval-architecture", "urban-planning",
  "architecture", "ipe", "biomedical-engineering", "materials-engineering", "petroleum-engineering"
];

const LIFESCIENCE_SLUGS = [
  "pharmacy", "botany", "zoology", "agriculture", "fisheries", "microbiology",
  "genetic-engineering", "biotechnology", "biochemistry", "public-health", "food-technology"
];

// ── 1. Load subjects_db.js and extract slugs ──────────────────────────────
const dbCode = fs.readFileSync('db/subjects_db.js', 'utf8');
// Run in a sandbox via Function constructor
const sandbox = {};
new Function('window', dbCode)(sandbox);
const subjects = sandbox.DB_Subjects || [];
console.log(`✅ DB_Subjects loaded: ${subjects.length} subjects`);

// ── 2. Spot-check field normalization ─────────────────────────────────────
const cse = subjects.find(s => s.slug === 'cse');
const pharmacy = subjects.find(s => s.slug === 'pharmacy');
const bangla = subjects.find(s => s.slug === 'bangla');
console.log(`\n── Field normalization ──`);
console.log(`  cse.field       = "${cse ? cse.field : 'NOT FOUND'}" (expected: technology)`);
console.log(`  pharmacy.field  = "${pharmacy ? pharmacy.field : 'NOT FOUND'}" (expected: applied)`);
console.log(`  bangla.field    = "${bangla ? bangla.field : 'NOT FOUND'}" (expected: humanities)`);

// ── 3. BCS relevance flags ────────────────────────────────────────────────
const law = subjects.find(s => s.slug === 'law');
const eee = subjects.find(s => s.slug === 'eee');
console.log(`\n── BCS relevance ──`);
console.log(`  law.bcs_relevance = "${law ? law.bcs_relevance : 'NOT FOUND'}" (expected: high)`);
console.log(`  eee.bcs_relevance = "${eee ? eee.bcs_relevance : 'NOT FOUND'}" (expected: low)`);

// ── 4. HSC groups coverage ────────────────────────────────────────────────
const scienceOnly = subjects.filter(s => s.hsc_groups && s.hsc_groups.length === 1 && s.hsc_groups[0] === 'science');
const allGroups   = subjects.filter(s => s.hsc_groups && s.hsc_groups.length === 3);
console.log(`\n── HSC group coverage ──`);
console.log(`  Science-only subjects: ${scienceOnly.length} (e.g. ${scienceOnly.slice(0,3).map(s=>s.slug).join(', ')})`);
console.log(`  Open-to-all subjects:  ${allGroups.length} (e.g. ${allGroups.slice(0,3).map(s=>s.slug).join(', ')})`);

// ── 5. Simulate hard-lock scenarios ──────────────────────────────────────
function simulate(hscGroup, fourthSubject, swapIntent) {
  return subjects.map(subj => {
    const slug = subj.slug;
    const isGroupEligible = subj.hsc_groups && subj.hsc_groups.includes(hscGroup);
    if (!isGroupEligible) return { slug, eligible: false, reason: `Not open to ${hscGroup}` };

    if (hscGroup === 'science') {
      if (fourthSubject === 'math' && swapIntent === 'swap' && ENGINEERING_SLUGS.includes(slug)) {
        return { slug, eligible: false, reason: 'Hard-locked: Math swap blocks engineering' };
      }
      if (fourthSubject === 'biology' && swapIntent === 'swap' && LIFESCIENCE_SLUGS.includes(slug)) {
        return { slug, eligible: false, reason: 'Hard-locked: Biology swap blocks life sciences' };
      }
    }
    return { slug, eligible: true };
  });
}

console.log(`\n── Scenario A: Science + Higher Math + Swap ──`);
const scenarioA = simulate('science', 'math', 'swap');
const lockedA = scenarioA.filter(s => s.reason && s.reason.includes('Hard-locked'));
const eligibleA = scenarioA.filter(s => s.eligible);
console.log(`  Locked paths:   ${lockedA.length} → ${lockedA.map(s=>s.slug).join(', ')}`);
console.log(`  Eligible paths: ${eligibleA.length}`);
console.log(`  CSE locked?     ${lockedA.find(s=>s.slug==='cse') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);
console.log(`  EEE locked?     ${lockedA.find(s=>s.slug==='eee') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);
console.log(`  Pharmacy free?  ${eligibleA.find(s=>s.slug==='pharmacy') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);
console.log(`  Economics free? ${eligibleA.find(s=>s.slug==='economics') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);

console.log(`\n── Scenario B: Science + Biology + Swap ──`);
const scenarioB = simulate('science', 'biology', 'swap');
const lockedB = scenarioB.filter(s => s.reason && s.reason.includes('Hard-locked'));
const eligibleB = scenarioB.filter(s => s.eligible);
console.log(`  Locked paths:   ${lockedB.length} → ${lockedB.map(s=>s.slug).join(', ')}`);
console.log(`  Pharmacy locked? ${lockedB.find(s=>s.slug==='pharmacy') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);
console.log(`  CSE free?        ${eligibleB.find(s=>s.slug==='cse') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);

console.log(`\n── Scenario C: Science + Higher Math + Answer (no swap) ──`);
const scenarioC = simulate('science', 'math', 'answer');
const lockedC = scenarioC.filter(s => s.reason && s.reason.includes('Hard-locked'));
console.log(`  Locked paths: ${lockedC.length} (expected: 0)`);
console.log(`  CSE unlocked? ${scenarioC.find(s=>s.slug==='cse')?.eligible ? '✅ YES (correct)' : '❌ NO (bug!)'}`);

console.log(`\n── Scenario D: Commerce student ──`);
const scenarioD = simulate('commerce', null, null);
const eligibleD = scenarioD.filter(s => s.eligible);
const lockedD = scenarioD.filter(s => !s.eligible);
console.log(`  Eligible paths: ${eligibleD.length} (e.g. ${eligibleD.slice(0,4).map(s=>s.slug).join(', ')})`);
console.log(`  Locked paths:   ${lockedD.length} (science-only subjects)`);
console.log(`  CSE locked for commerce? ${lockedD.find(s=>s.slug==='cse') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);
console.log(`  BBA open to commerce?    ${eligibleD.find(s=>s.slug==='bba') ? '✅ YES (correct)' : '❌ NO (bug!)'}`);

// ── 6. Curriculum format check ────────────────────────────────────────────
console.log(`\n── Curriculum format ──`);
const withCurriculum = subjects.filter(s => s.curriculum && s.curriculum.length > 0);
const asArray = withCurriculum.filter(s => Array.isArray(s.curriculum));
console.log(`  Subjects with curriculum data: ${withCurriculum.length}`);
console.log(`  Curriculum in array format:    ${asArray.length} (all should be arrays)`);

// ── 7. University mapping check ───────────────────────────────────────────
const uniCode = fs.readFileSync('university-subjects.js', 'utf8');
const uniSandbox = {};
new Function('window', uniCode)(uniSandbox);
const uniSubjects = uniSandbox.UniSubjects || {};
const subjectUniIds = uniSandbox.SubjectUniIds || {};
const subjectSeats = uniSandbox.SubjectSeats || {};
const cseSeatMap = subjectSeats['cse'] || {};
const cseUnis = Object.keys(cseSeatMap);
const cseTotalSeats = Object.values(cseSeatMap).reduce((a,b) => a+b, 0);
console.log(`\n── University/seat mapping ──`);
console.log(`  CSE: ${cseUnis.length} universities, ${cseTotalSeats} total seats`);
console.log(`  CSE universities: ${cseUnis.join(', ')}`);

console.log('\n✅ All verification checks complete.');
