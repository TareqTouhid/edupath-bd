// EduPath BD — pre-compile JSX → plain JS, remove Babel Standalone
// Run: node build.js
// Output: index.html (with all JSX compiled, no browser Babel needed)

const fs   = require('fs');
const path = require('path');
const babel = require('@babel/core');

const src  = fs.readFileSync('index.html', 'utf8');
let   out  = src;

// 1. Remove the Babel Standalone <script> tag (incl. integrity/crossorigin attrs)
out = out.replace(
  /<script\s+src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"[^>]*><\/script>/,
  '<!-- Babel Standalone removed — JSX pre-compiled at build time -->'
);

// 2. Find and compile every <script type="text/babel"> block
const BABEL_BLOCK = /<script\s+type="text\/babel"[^>]*>([\s\S]*?)<\/script>/g;
let match;
let compiled = 0;
let errors   = 0;

out = out.replace(BABEL_BLOCK, (full, jsx) => {
  try {
    const result = babel.transformSync(jsx, {
      presets: [['@babel/preset-react', { runtime: 'classic' }]],
      configFile: false,
      babelrc: false,
    });
    compiled++;
    return `<script type="text/javascript">\n${result.code}\n</script>`;
  } catch (err) {
    errors++;
    const snippet = jsx.trim().slice(0, 120).replace(/\n/g, '↵');
    console.error(`\n❌  Babel error in block ${compiled + errors}:`);
    console.error(`   Snippet: ${snippet}`);
    console.error(`   Error:   ${err.message}\n`);
    // Return the original block so the file is still valid
    return full;
  }
});

fs.writeFileSync('index.html', out, 'utf8');

console.log(`\n✅  Build complete`);
console.log(`   Compiled: ${compiled} blocks`);
if (errors) console.log(`   Errors:   ${errors} blocks (kept original)`);
console.log(`   Output:   index.html\n`);
