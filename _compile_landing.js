// Compile _screenlanding.jsx and replace the ScreenLanding block in index.html
const fs    = require('fs');
const babel = require('@babel/core');

const jsx = fs.readFileSync('_screenlanding.jsx', 'utf8');

const { code } = babel.transformSync(jsx, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  configFile: false,
  babelrc: false,
});

// Wrap in the same IIFE + script tag structure
const newBlock =
  `<!-- ═══════════════════════════════════════════════════════════\r\n` +
  `     SCREEN — LANDING\r\n` +
  `     ═══════════════════════════════════════════════════════════ -->\r\n` +
  `<script type="text/javascript">\r\n` +
  `(function () {\r\n` +
  `  const { useState, useEffect, useRef, useCallback, useMemo } = React;\r\n` +
  `  const SearchBar = window.SearchBar;\r\n\r\n` +
  `  // EduPath BD — Landing (editorial narrative scroll)\r\n\r\n` +
  `  ${code.split('\n').join('\r\n  ')}\r\n` +
  `})();\r\n` +
  `</script>`;

let html = fs.readFileSync('index.html', 'utf8');

// Find the ScreenLanding block boundaries
const START_MARKER = '<!-- ═══════════════════════════════════════════════════════════\r\n     SCREEN — LANDING';
const END_MARKER   = `Object.assign(window, {\r\n    ScreenLanding\r\n  });\r\n})();\r\n</script>`;

const startPos = html.indexOf(START_MARKER);
const endPos   = html.indexOf(END_MARKER, startPos) + END_MARKER.length;

if (startPos === -1 || endPos <= startPos) {
  console.error('Could not find ScreenLanding block boundaries');
  console.error('  START found:', startPos !== -1);
  process.exit(1);
}

html = html.slice(0, startPos) + newBlock + html.slice(endPos);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅  ScreenLanding compiled and injected');
console.log('   File size:', Math.round(html.length / 1024), 'KB');
