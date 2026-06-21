// Patch: wire university-subjects.js data into search index + subject/university displays
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0, fail = 0;
function rep(label, find, replace) {
  if (!html.includes(find)) { console.error('FAIL:', label); fail++; return; }
  html = html.replace(find, replace);
  console.log('OK:', label); ok++;
}

// ── 1. Enrich university search entries with their subject names ────────────
rep('Search: enrich university entries with subjects',
  `index.universities = (unis.public || []).concat(unis.private || []).concat(unis.international || []).map(u => ({\r\n        type: "university",\r\n        id: u.id,\r\n        name: u.name,\r\n        city: u.city,\r\n        tier: u.tier,\r\n        category: u.category,\r\n        cost: u.cost,\r\n        searchText: (u.name + " " + (u.city || "")).toLowerCase()\r\n      }));`,
  `index.universities = (unis.public || []).concat(unis.private || []).concat(unis.international || []).map(u => {\r\n        const subSlugs = window.UniSubjects?.[u.id] || [];\r\n        const allSubjs = window.PFData?.subjects || [];\r\n        const subNames = subSlugs.map(sl => allSubjs.find(x => x.slug === sl)?.name || sl).join(" ");\r\n        return {\r\n          type: "university",\r\n          id: u.id,\r\n          name: u.name,\r\n          short: u.short || "",\r\n          city: u.city,\r\n          tier: u.tier,\r\n          category: u.category,\r\n          cost: u.cost,\r\n          subjectCount: subSlugs.length,\r\n          searchText: (u.name + " " + (u.short || "") + " " + (u.city || "") + " " + subNames).toLowerCase()\r\n        };\r\n      });`
);

// ── 2. Enrich subject search entries with university names ──────────────────
rep('Search: enrich subject entries with uni names',
  `index.subjects = window.PFData.subjects.map(s => ({\r\n        type: "subject",\r\n        slug: s.slug,\r\n        name: s.name,\r\n        desc: s.desc,\r\n        field: s.field,\r\n        searchText: (s.name + " " + s.desc + " " + (s.alts?.join(" ") || "")).toLowerCase()\r\n      }));`,
  `const _allUnis = (window.UGCData?.universities?.public || []).concat(window.UGCData?.universities?.private || []).concat(window.UGCData?.universities?.international || []);\r\n      index.subjects = window.PFData.subjects.map(s => {\r\n        const uniIds = window.SubjectUniIds?.[s.slug] || [];\r\n        const uniNames = uniIds.map(id => _allUnis.find(u => u.id === id)?.name || id).join(" ");\r\n        return {\r\n          type: "subject",\r\n          slug: s.slug,\r\n          name: s.name,\r\n          desc: s.desc,\r\n          field: s.field,\r\n          uniCount: uniIds.length,\r\n          searchText: (s.name + " " + s.desc + " " + (s.alts?.join(" ") || "") + " " + uniNames).toLowerCase()\r\n        };\r\n      });`
);

// ── 3. Subject card: use SubjectUniIds for university count ─────────────────
// In FeaturedSubjectsSection, replace the manual count with SubjectUniIds
rep('Subject card: use SubjectUniIds for uni count',
  `const allUnis = [\r\n        ...(window.UGCData?.universities?.public || []),\r\n        ...(window.UGCData?.universities?.private || []),\r\n        ...(window.UGCData?.universities?.international || [])\r\n      ];\r\n      const uniCount = allUnis.filter(u => (u.subjects || []).some(sub => sub.slug === s.slug)).length;`,
  `const uniCount = (window.SubjectUniIds?.[s.slug] || []).length;`
);

// ── 4. University cards on landing: use UniSubjects for subject count ───────
rep('Landing uni cards: use UniSubjects for subject count',
  `const subjectCount = uniData?.subjects?.length || null;`,
  `const subjectCount = (uniData && window.UniSubjects?.[uniData.id]?.length) || null;`
);

// ── 5. Search suggestion: show subject count next to university name ────────
// Currently shows just city — enrich with subject count
rep('Search suggestions: show subject count for unis',
  `u.city ? window.UGCData.cities[u.city] || u.city : ""`,
  `(u.subjectCount ? u.subjectCount + " subjects" : "") + (u.city ? (u.subjectCount ? " · " : "") + (window.UGCData?.cities?.[u.city] || u.city) : "")`
);

// ── 6. Search suggestion: show uni count next to subject name ───────────────
// Find where subject suggestions are rendered and add "X unis"
rep('Search suggestions: show uni count for subjects',
  `s.field ? (PFData.FIELDS?.[s.field]?.label || s.field) : ""`,
  `(s.uniCount ? s.uniCount + " universities" : "") + (s.field ? (s.uniCount ? " · " : "") + (PFData.FIELDS?.[s.field]?.label || s.field) : "")`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log(`\n${ok} ok, ${fail} failed, ${Math.round(html.length/1024)}KB`);
