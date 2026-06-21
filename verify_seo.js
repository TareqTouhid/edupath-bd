const fs = require('fs');
const html = fs.readFileSync('subject/cse/index.html', 'utf8');

const titleMatch = html.match(/<title>(.*?)<\/title>/);
const descMatch  = html.match(/name="description" content="([^"]+)"/);
const canonMatch = html.match(/rel="canonical" href="([^"]+)"/);
const schemaPresent = html.includes('application/ld+json');
const navScript = html.includes('window.__SUBJECT_SLUG__');
const fileKB = Math.round(html.length / 1024);

console.log('=== /subject/cse/index.html verification ===');
console.log('Title:         ', titleMatch ? titleMatch[1] : 'MISSING');
console.log('Meta desc:     ', descMatch  ? descMatch[1].slice(0,120) + '...' : 'MISSING');
console.log('Canonical URL: ', canonMatch ? canonMatch[1] : 'MISSING');
console.log('Schema JSON-LD:', schemaPresent ? 'present' : 'MISSING');
console.log('SPA nav script:', navScript   ? 'present' : 'MISSING');
console.log('File size (KB):', fileKB);

// Check that it is distinct from the base index.html
const base = fs.readFileSync('index.html', 'utf8');
console.log('Has unique head:', html !== base ? 'YES' : 'NO - identical to index.html (BUG)');

// Show first 20 entries in sitemap
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('\n=== sitemap.xml (' + urls.length + ' URLs) ===');
urls.slice(0, 5).forEach(u => console.log(' ', u));
console.log('  ...');
urls.slice(-3).forEach(u => console.log(' ', u));
