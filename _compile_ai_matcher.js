// Compile _ai_matcher.jsx and inject into index.html (replacing prior injection if present)
const fs = require("fs");
const babel = require("@babel/core");

const jsx = fs.readFileSync("_ai_matcher.jsx", "utf8");
const { code } = babel.transformSync(jsx, {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  configFile: false, babelrc: false,
});

const MARKER_START = "<!-- ═══ AI MATCHER (auto-generated) ═══ -->";
const MARKER_END   = "<!-- ═══ END AI MATCHER ═══ -->";

const block =
  `${MARKER_START}\r\n` +
  `<script type="text/javascript">\r\n` +
  `${code}\r\n` +
  `</script>\r\n` +
  `${MARKER_END}`;

let html = fs.readFileSync("index.html", "utf8");

// Replace existing block or inject before ScreenLanding marker
const startIdx = html.indexOf(MARKER_START);
if (startIdx !== -1) {
  const endIdx = html.indexOf(MARKER_END, startIdx) + MARKER_END.length;
  html = html.slice(0, startIdx) + block + html.slice(endIdx);
  console.log("✅  Replaced existing AI matcher block");
} else {
  // Inject before "SCREEN — LANDING" marker so it's available to App router
  const landingMarker = "SCREEN — LANDING";
  const landingPos = html.indexOf(landingMarker);
  if (landingPos === -1) {
    console.error("❌  Could not find SCREEN — LANDING marker");
    process.exit(1);
  }
  const commentStart = html.lastIndexOf("<!--", landingPos);
  html = html.slice(0, commentStart) + block + "\r\n" + html.slice(commentStart);
  console.log("✅  Injected AI matcher before SCREEN — LANDING");
}

fs.writeFileSync("index.html", html, "utf8");
console.log("   File size:", Math.round(html.length / 1024), "KB");
