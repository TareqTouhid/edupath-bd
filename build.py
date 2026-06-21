"""
EduPath BD — Self-contained HTML assembler.
Reads each extracted source file and writes a single pathfinder-bd-v2.html.

Fix applied: each Babel script block declares its own React hooks via a
local preamble — avoids the var/const redeclaration conflict that silently
killed components.jsx when the global shim was present.
"""
import os, re

BASE = r"H:\education system bd\extracted"
OUT  = r"H:\education system bd\index.html"

def read(name):
    with open(os.path.join(BASE, name), encoding="utf-8") as f:
        return f.read()

def read_db(name):
    with open(os.path.join(r"H:\education system bd\db", name), encoding="utf-8") as f:
        return f.read()

def read_root(name):
    with open(os.path.join(r"H:\education system bd", name), encoding="utf-8") as f:
        return f.read()

# ── Helper: wrap every Babel block in an IIFE so its const/let declarations
#    never leak into the global lexical scope.  Without this, block-0's
#    `const { useState } = React` lands in global lexical scope and causes
#    a SyntaxError redeclaration when block-1 tries the same const.
# ──────────────────────────────────────────────────────────────────────────
HOOKS = "const { useState, useEffect, useRef, useCallback, useMemo } = React;\n\n"

def with_hooks(src):
    """Wrap src in an IIFE, prepending the hooks preamble if needed."""
    already = bool(re.search(r'const\s*\{[^}]*useState', src))
    inner = src if already else (HOOKS + src)
    return f"(function(){{\n{inner}\n}})();"

# ── 1. Load CSS (strip @font-face — replaced by Google Fonts) ──
ct_css  = read("colors_and_type.css")
ct_css  = re.sub(r'@font-face\s*\{[^}]+\}', '', ct_css)
kit_css = read("kit.css")

# ── 2. Load JS/JSX sources ──
data_js        = read("data.js")
subjects_db_js = read_db("subjects_db.js")
jobs_db_js     = read_db("jobs_db.js")
hsc_mapping_js = read_db("hsc_mapping.js")
uni_subjects_js = read_root("university-subjects.js")
components_jsx = read("components.jsx")   # already has const { useState, useEffect }
cards_jsx      = read("cards.jsx")
landing_extras = read("landing-extras.jsx")
screen_landing = read("screen-landing.jsx")
screen_explore = read("screen-explore.jsx")
screen_detail  = read("screen-detail.jsx")
screen_stories = read("screen-stories.jsx")
screen_matcher    = read("screen-matcher.jsx")
screen_contribute = read("screen-contribute.jsx")
screen_careers    = read("screen-careers.jsx")
share_modal       = read("share-modal.jsx")
app_jsx           = read("app.jsx")
landing_anims  = read("landing-anims.js")

# ── 3. Patches ──

# Replace the broken img path with a safe inline text logo
components_jsx = components_jsx.replace(
    '<img src="../../assets/logo-on-green.svg" alt="EduPath BD" style={{height: 32, width: "auto"}}/>',
    '<span style={{fontFamily:"var(--font-display)",fontSize:20,fontWeight:600,'
    'color:"#fff",letterSpacing:"-0.01em",lineHeight:1}}>'
    'EduPath <em style={{fontStyle:"normal",color:"var(--gold)"}}>BD</em></span>',
)

# ── 4. Wrap every Babel block in an IIFE + add hooks where needed ──
# with_hooks() detects existing declarations and skips the preamble but
# always adds the IIFE wrapper so consts don't pollute global lexical scope.
components_jsx = with_hooks(components_jsx)   # already has hooks → IIFE only
cards_jsx      = with_hooks(cards_jsx)
landing_extras = with_hooks(landing_extras)
screen_landing = with_hooks(screen_landing)
screen_explore = with_hooks(screen_explore)
screen_detail  = with_hooks(screen_detail)
screen_stories = with_hooks(screen_stories)
screen_matcher    = with_hooks(screen_matcher)
screen_contribute = with_hooks(screen_contribute)
screen_careers    = with_hooks(screen_careers)
share_modal       = with_hooks(share_modal)
app_jsx        = with_hooks(app_jsx)

# ── 5. Assemble ──
html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>EduPath BD — Find the degree you were made for.</title>

  <!-- SEO + Social sharing -->
  <meta name="description" content="56 Bangladeshi graduates answered honestly — what their subject was really like, and whether they'd choose it again. Use their data to choose yours."/>
  <meta name="keywords" content="Bangladesh university, HSC subject choice, CSE Bangladesh, BBA Bangladesh, admission guidance BD, EduPath BD"/>
  <meta name="author" content="EduPath BD"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="https://edupath-bd.vercel.app"/>
  <meta property="og:title" content="EduPath BD — Find the degree you were made for."/>
  <meta property="og:description" content="56 Bangladeshi graduates answered honestly about their subject. Use their data. Free forever."/>
  <meta property="og:image" content="https://edupath-bd.vercel.app/og-image.png"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="EduPath BD — Find the degree you were made for."/>
  <meta name="twitter:description" content="56 real responses. 31 subjects. 15 countries of salary data. Free forever."/>
  <link rel="canonical" href="https://edupath-bd.vercel.app"/>

  <!-- Analytics — replace 'YOUR-DOMAIN.com' with your Plausible domain, or remove if not needed -->
  <!-- <script defer data-domain="YOUR-DOMAIN.com" src="https://plausible.io/js/script.js"></script> -->

  <!-- Fonts via Google Fonts (Fraunces + Plus Jakarta Sans variable) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">

  <style>
{ct_css}
{kit_css}

/* ── Self-contained mode overrides ── */
.pf-hero--editorial {{ padding-top: 120px; }}
</style>

  <!-- React 18 (pinned) -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"
          integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
          crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
          integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
          crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
          integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
          crossorigin="anonymous"></script>

  <!-- Three.js r160 + GSAP 3.12.5 + ScrollTrigger + Lenis smooth scroll -->
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
  <script src="https://unpkg.com/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://unpkg.com/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
</head>
<body>
<div id="root"></div>

<!-- ═══════════════════════════════════════════════════════════
     DATA  (subjects + testimonials + FIELDS)
     ═══════════════════════════════════════════════════════════ -->
<script>
{data_js}
{subjects_db_js}
{jobs_db_js}
{hsc_mapping_js}
{uni_subjects_js}
if (window.DB_Subjects) {{
  window.PFData = window.PFData || {{}};
  window.PFData.subjects = window.DB_Subjects;
}}
</script>

<!-- ═══════════════════════════════════════════════════════════
     COMPONENTS  (Nav, Footer, Avatar, HonestyBox, primitives)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{components_jsx}
</script>

<!-- ═══════════════════════════════════════════════════════════
     CARDS  (SubjectCard, TestimonialCard, flagFor, shortSubject)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{cards_jsx}
</script>

<!-- ═══════════════════════════════════════════════════════════
     LANDING EXTRAS
     (PinnedReality, FeaturedTestimonial, ConfidenceTiers,
      FeaturedSubjects, FourPillars, SampleResult,
      MasonryVoices, Universities, ForParents)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{landing_extras}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — LANDING
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_landing}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — EXPLORE  (subject grid + regional lens + filters)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_explore}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — DETAIL  (full subject profile + timeline)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_detail}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — STORIES  (testimonials wall, masonry)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_stories}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — MATCHER  (7-step dual-layer questionnaire)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_matcher}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — CONTRIBUTE  (full-page submission form)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_contribute}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SCREEN — CAREERS  (salary guide across 15 countries)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{screen_careers}
</script>

<!-- ═══════════════════════════════════════════════════════════
     SHARE MODAL  (quick-access overlay from footer / detail)
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{share_modal}
</script>

<!-- ═══════════════════════════════════════════════════════════
     APP ROOT + ROUTER
     ═══════════════════════════════════════════════════════════ -->
<script type="text/babel" data-presets="react">
{app_jsx}
</script>

<!-- ═══════════════════════════════════════════════════════════
     LANDING ANIMATIONS
     Three.js 56-point starfield + GSAP ScrollTrigger reveals
     Loaded deferred so all DOM hooks from React are present.
     ═══════════════════════════════════════════════════════════ -->
<script defer>
{landing_anims}
</script>

</body>
</html>"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

size_kb = os.path.getsize(OUT) / 1024
print(f"[OK] Written: {OUT}  (deploy with: vercel --prod)")
print(f"  Size: {size_kb:.1f} KB")
