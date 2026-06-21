# EduPath BD — Design System

> Helping Bangladeshi students choose with evidence, not pressure.

EduPath BD is a free, non-commercial guidance platform for SSC & HSC graduates of Bangladesh. It helps students pick an undergraduate subject using two things they can't get anywhere else: **real testimonials** from people already in the field, and an **AI matcher that understands Bangladesh's actual admission rules** (HSC stream eligibility, the Dhaka-vs-elsewhere reality, math comfort, family budget).

The brand voice is the opposite of the typical EdTech "your dream future awaits" performance. It is calm, honest, slightly editorial. It assumes the reader is 17, scared, and has parents in the room.

---

## Direction (warm)

The system is built on a **warm cream** canvas with **Bangladesh green** as the dominant accent, **gold** for highlights/active states, and **terracotta** as a third accent reserved for honesty signals (warnings, attrition notes, "alternative path" callouts). Type pairs **Fraunces** (editorial, optical-size serif) for headlines with **Plus Jakarta Sans** for body.

An earlier dark direction (`SettleRight` logo, dark-navy code-energy hero — see `uploads/ChatGPT Image…png`) was explicitly rejected. Keep the canvas cream. Keep the type warm. Honesty over hype.

---

## Index

```
README.md              ← you are here
SKILL.md               ← Agent Skill manifest (cross-compatible with Claude Code)
colors_and_type.css    ← Tokens (CSS vars) for color + type + spacing + radius

assets/                ← Logo wordmarks, icons, hero glyphs
fonts/                 ← Font loading notes (Google Fonts CDN — see below)
preview/               ← Design system cards (Type, Colors, Spacing, Components, Brand)
ui_kits/
  pathfinder-web/      ← Marketing + product surfaces (Landing, Explore, Stories, Matcher, Detail)
    index.html         ← Interactive click-thru of all surfaces
    *.jsx              ← Modular React components (Nav, SubjectCard, TestimonialCard, …)
```

## Sources

This system is built on a real survey of Bangladeshi students and graduates plus two written design specs. Treat every section below as canonical input.

| Source | What it is | Trust level |
|---|---|---|
| `uploads/testimonials_clean.json` | 56 cleaned, normalised survey responses across 31 subjects. Used verbatim as the `testimonials` array in `ui_kits/pathfinder-web/data.js`. | Primary data |
| `uploads/Centralized Education System in Bangladesh - Form Responses 1 (1).csv` | The raw Google Form responses behind the cleaned JSON. Useful for re-verifying a quote or pulling new fields not in the cleaned set. | Primary data (raw) |
| `uploads/EduPathBD_Cleaned_Dataset.xlsx` | Normalised dataset with field-cluster mapping, university spellings, etc. | Primary data |
| `uploads/EduPathBD_Build_Plan.docx` | Technical build plan v1.0 — the architecture brief, the *Coverage broad, Confidence honest* design rule, confidence-tier definitions, schema sketches. | Spec (canonical) |
| `uploads/EduPathBD_AI_Matcher_Spec.docx` | Matcher logic & questionnaire spec v1.0 — the 12–15-question questionnaire, signal extraction, retrieval-grounded reasoning, output schema. | Spec (canonical) |
| Untitled UI Figma file (mounted in project) | Generic SaaS-UI pattern reference only. Untitled UI's Inter/purple palette is **not** the EduPath palette — we only consulted it for component anatomy. | Reference |
| `uploads/original-*.webp` | Competitor / mood references — EduLearn, Stwedy, Edukids-style 3-column colored cards, Zisaa's hero. Informed composition only. | Reference |
| `uploads/ChatGPT Image…png` | An earlier dark "SettleRight" direction that was explicitly **rejected** in favour of the warm-editorial direction. Kept here only as documentation of what we are not. | Anti-reference |
| Font files | `Fraunces` (variable, opsz+wght+SOFT+WONK axes) and `Plus Jakarta Sans` (variable, wght axis) self-hosted in `fonts/`, loaded via `@font-face` in `colors_and_type.css`. No CDN fallback. | Asset |

### How the data flows into the UI

- The 56 cleaned responses populate the **Real responses** wall verbatim (Stories surface).
- Of the 31 distinct subjects in the dataset, **15 have hand-built profiles** in `data.js` and appear as Explore cards. The remaining 16 are *Listed only* — they appear in the Stories wall but never as Explore cards, and the matcher will not recommend them as a #1 fit.
- Subject **confidence tiers** are derived live from testimonial count + profile presence (see `computeConfidence()` in `data.js`): `verified` (8+ responses + profile), `emerging` (profile OR 3–7 responses), `listed` (under 3, no profile). These names match Build Plan §4.1 verbatim.
- **The 42% headline stat is not in the data.** The honest equivalent — *24 of 31 subjects are backed by just one person's opinion* — is the brand's actual opening line, and it's the lede on the landing page.

### Respondent anonymity

The cleaned JSON does not carry respondent names — the raw CSV does, but consent for display wasn't captured as a structured field. The UI therefore treats every response as anonymous: avatars use subject initials, titles read *"Class of {session} · age {N}"*, and the original CSV name field is not surfaced. Add an explicit consent field to the production submission flow and switch to *"first name + last initial"* once that's in place.

---

## CONTENT FUNDAMENTALS

EduPath BD's voice is the platform's most important design element. The whole point is that we *don't* sound like the brochure-y marketing that lied to the current generation of regretful graduates. Every line of copy should pass the test: "would a slightly older, slightly tired sibling actually say this?"

### Tone

- **Honest before persuasive.** We lead with the awkward number ("24 of our 31 subjects are backed by just one person's opinion"), not the success story.
- **Grounded, not aspirational.** No "transform your future." No "unlock your potential." Replace with: "Find the degree you were made for." / "Get grounded recommendations." / "We're a starting point, not a finish line."
- **Specific over generic.** Not "great career outcomes" — "৳30k–2L+/mo in Dhaka, ৳15k–80k outside Dhaka, with a 30–40% initial gap."
- **Calm, slightly editorial.** Read it aloud — if it sounds like a Forbes ad, rewrite it.
- **Direct, never preachy.** "This affects which paths are realistic for you." not "It's important that you understand…"

### Person & voice

- **You** for the reader. Always. ("Tell us what you love.")
- **We** for the platform, sparingly. ("We're students too." "We check your real constraints.")
- **I** never. The system is not a personality.
- **No imperatives that sound like commands** ("Take the quiz NOW!"). Soft imperatives are fine ("Be honest — this affects which paths are realistic.").

### Casing

- **Sentence case for everything**, including buttons, nav, headings. ("Find my path", not "Find My Path".) The single exception is the wordmark **EduPath BD**, which keeps its Pascal-cased Title-case form.
- **Body sentences end in periods.** Microcopy under 5 words (button labels, badges, stat labels) does not.

### Section headings

Fraunces, sentence case, often a complete sentence rather than a noun phrase:
- "Find the degree you were *made* for." (the *made* in italics + gold)
- "Your matched paths."
- "What people say."
- "If [this subject] feels out of reach…"

### Italics in headlines

Reserved for **one** word per headline, usually a verb or adjective, and rendered in **gold (#F4A823)** on cream backgrounds. The Fraunces variable axis gives a true italic optical shape, not an algorithmic slant. This is the brand's signature type detail — don't overuse it.

### Numbers

Numbers are stars of the show. Stats sit in Fraunces at very large sizes (48–96px) on dark green strips, paired with tiny Plus Jakarta Sans uppercase labels (12px, letter-spacing 0.08em). Always include the unit. Always source-note salary data.

- ✅ "৳30k–2L+/mo · Based on 2024 bdjobs data — verify independently"
- ❌ "Great earning potential"

### Pills, badges, chips

- HSC eligibility: small pill, sentence case, with a leading neutral dot — `· Science`, `· Commerce`, `· Arts`.
- Trend: with glyph + word — `📈 Rising demand`, `⟶ Stable`, `◎ Niche`.
- "Would recommend?": green chip `✅ Would recommend` / terracotta chip `🔄 Would not recommend`.

### Honesty boxes

Terracotta-bordered (#C8553D) callout boxes appear wherever the data is thin, the regional reality is harsh, or a result needs to be downgraded. They are the brand's most distinctive content pattern. Always start with the actual number or situation, never a softener:

- "We only have 2 voices for this subject. Treat this as early signal, not authority."
- "85% of BD software roles are in Dhaka. Outside-Dhaka graduates report a 30–40% initial salary gap."
- "Direct entry restricted for Arts group. But if this interests you, here's a realistic route: …"

### Emoji

Used **sparingly and functionally**, never decoratively. Three approved categories:

1. **Country flags in regional contexts** — 🇧🇩 (Bangladesh), 🌐 (international). The 🇧🇩 is part of the brand voice — it earns its place.
2. **Glyph-style category icons in chips/buttons only** — 🧩 🎨 🤝 🌿 🔢 ✍️ 🔧 🔍 💰 🛡️ ✈️ 🚀 📚 🏛️ 🔬 📊 🎭 💸 🏠 🧪. These are the matcher's interest taxonomy and constraint set. Always sit at the start of a chip, never inline in prose.
3. **State chips:** ✅ (would recommend / eligible), 🔄 (would not recommend / alternative path), ⚠️ (eligible with note), 🥇 🥈 🥉 (match rank), 📍 (location), 📈 (rising).

**Never use** decorative sparkles ✨, fire 🔥, party 🎉, generic faces 😀, rocket 🚀 in headlines (only in matcher chip "Building my own thing"), or AI/robot emoji. If you find yourself reaching for "✨" to make something feel polished, write better copy instead.

### Voice examples (copy these as templates)

| Place | Bad (rejected) | Good (do this) |
|---|---|---|
| Hero H1 | "Discover Your Dream Career Today!" | "Find the degree you were *made* for." |
| Stat | "Helping thousands succeed" | "56 responses · 31 subjects · 24 backed by 1 voice" |
| Empty state | "Oops! No results found." | "No responses match this filter yet. If you fit this category, share yours and help the next 17-year-old." |
| Match warning | "This may be challenging." | "Direct entry restricted for Arts group. But if this interests you, here's a realistic route: …" |
| Trust line | "Industry-leading platform" | "Built for students · Free forever" |

---

## VISUAL FOUNDATIONS

### Color

The palette is **8 tokens**. That's it. No tints, no shades-of-10, no transparent overlays except the two explicit ones below.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#F5EFE4` | Warm cream — the canvas everything lives on |
| `--surface` | `#FFFFFF` | Cards, modals, the matcher card |
| `--surface-alt` | `#EDE8DF` | Subtle inset sections, "Did You Know" recess strip |
| `--green` | `#006A4E` | Bangladesh green — headings, primary CTAs, links, accent fills |
| `--green-dark` | `#004D38` | Nav-on-scroll bg, footer bg, stats strip bg |
| `--gold` | `#F4A823` | Highlights, active states, italic word in H1, secondary CTAs on green |
| `--terracotta` | `#C8553D` | Honesty boxes, warnings, "would not recommend" chip, alternative-path borders |
| `--text` | `#1A1714` | Warm near-black for body |
| `--text-muted` | `#7A6E65` | Secondary text, labels, microcopy |

Two derived overlays are allowed:
- `--green-12`: `color-mix(in oklab, #006A4E 12%, transparent)` — for ghost button hover, active nav-link backgrounds
- `--ink-08`: `color-mix(in oklab, #1A1714 8%, transparent)` — for hairlines on cream

**Never** introduce: bluish-purple gradients, pastel rainbows, dark backgrounds (other than `--green-dark` strips), pure black (`#000`), pure white text on cream.

### Type

- **Display / headlines:** Fraunces (variable, optical axis on). Weights 400–700. Optical size axis is critical at large scales — use `font-optical-sizing: auto`.
- **Body / UI:** Plus Jakarta Sans. Weights 400, 500, 600, 700.
- **Italic emphasis word in H1:** Fraunces Italic, gold (#F4A823). One word per headline only.

Type scale (root 16px):

| Token | Size / Line / Weight / Family | Use |
|---|---|---|
| `--display-1` | 72/76/600 Fraunces | Hero H1 ("Find the degree…") |
| `--display-2` | 56/60/600 Fraunces | Section H1 ("Your matched paths.") |
| `--h1` | 40/48/600 Fraunces | Subject name on detail page |
| `--h2` | 32/40/600 Fraunces | Card titles, step questions |
| `--h3` | 24/32/600 Fraunces | Sub-section labels |
| `--lead` | 20/30/400 Plus Jakarta | Hero subtext, intro paragraphs |
| `--body` | 16/26/400 Plus Jakarta | Default body |
| `--small` | 14/22/500 Plus Jakarta | Card meta, supporting labels |
| `--micro` | 12/16/600 Plus Jakarta, uppercase, +0.08em tracking | Stat labels, eyebrow labels |
| `--quote` | 28/40/400 Fraunces Italic | Pull quotes — the "24 of 31" stat callout |

`text-wrap: pretty` on every Fraunces headline. `text-wrap: balance` on stats and tiny labels.

### Spacing

A **4px base grid**. Use multiples — 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 96 / 128. Don't invent in-between values.

### Radii

- **Cards:** 16px (`--r-card`)
- **Modals, large containers, the matcher card:** 24px (`--r-modal`)
- **Pills, chips, buttons:** 100px (`--r-pill`) — always a full pill, never half-rounded
- **Inputs, dropdowns:** 12px (`--r-input`)
- **Inner image masks:** 12px (`--r-image`)

### Shadows / elevation

Three steps, all warm — they pick up the cream by tinting toward brown, never blue.

- `--shadow-1` (resting cards): `0 1px 2px rgba(26,23,20,0.06), 0 4px 12px rgba(26,23,20,0.04)`
- `--shadow-2` (hover lift, sticky nav on scroll): `0 4px 8px rgba(26,23,20,0.08), 0 12px 28px rgba(26,23,20,0.08)`
- `--shadow-3` (modal, focused matcher card, fullscreen overlay): `0 24px 64px rgba(26,23,20,0.18), 0 8px 16px rgba(26,23,20,0.08)`

### Backgrounds & textures

- Default canvas: flat `--bg` cream. **No gradients.** No noise.
- Section variation comes from **swapping the bg color of an entire strip**, not from gradients. Three allowed strip backgrounds: `--surface-alt` (subtle inset), `--green-dark` (stats / footer), `--green` (CTA footer strips).
- **No hand-drawn squiggle decorations.** They were tempting (EduLearn does them well) but feel infantile next to honest content about regret.
- **No grain.** No film texture. No paper-feel overlays.
- The single ornament: **a small compass / path glyph** used at the corner of section headers and inside the wordmark. SVG, stroke 1.5, `--green-dark` on cream.

### Borders

- Hairlines on cream: `1px solid var(--ink-08)`.
- Card borders by default: **none**. Cards rely on `--shadow-1` and a 4px **green top border** when the card needs a field accent.
- Focus rings: `2px solid var(--green)` with `2px` offset on the cream. Never a generic browser focus ring.

### Hover & press states

- **Cards:** `transform: translateY(-4px)` over 180ms ease-out + shadow promotion `--shadow-1` → `--shadow-2`. The trailing arrow `→` animates 4px right.
- **Primary buttons (green):** background darkens to `--green-dark` over 120ms. Press: `transform: scale(0.98)`.
- **Ghost buttons (outlined green):** fill becomes `--green-12`. Press: scale(0.98).
- **Pills / chips (inactive → active):** fill `transparent` → `--green`, text `--text` → `white`. 120ms ease.
- **Nav links:** the **green dot underneath** (a 4px circle, 8px below the text baseline) is the active marker. Hover shows the dot at 40% opacity.
- **No opacity-fade hovers.** Color changes only.

### Transitions & motion

- Section change (route): **fade + 8px upward slide**, 350ms `cubic-bezier(0.2, 0.8, 0.2, 1)`. Use sparingly.
- Filter chip reordering: CSS grid `:has()` driven, 300ms ease.
- Matcher step transitions: outgoing card slides up 16px and fades 200ms; incoming slides up from +16px and fades 250ms. Progress bar fill animates 400ms ease.
- Regional-lens toggle data refresh: **0.4s opacity pulse 1.0 → 0.6 → 1.0** on the cards being updated, so the user perceives the data shift without a layout jump.
- **No bouncing.** No springs. No elastic. The motion is editorial, not playful.
- **Avoid 'scrollIntoView'.**

### Transparency & blur

- Nav-on-scroll: `--bg` at 88% opacity + `backdrop-filter: blur(12px)`. Off at the very top of the page (fully transparent).
- The "Read full story" expanded card uses no transparency — it grows in place.
- **No frosted-glass overlays** elsewhere. Modals use solid `--surface` on a `rgba(26,23,20,0.45)` scrim.

### Imagery

- **No stock photography of smiling students.** The brand tone makes them look dishonest.
- **Avatars are gradient circles with initials**, two-color radial gradients keyed to the subject's field color (see `--field-*` tokens below). Initials are Fraunces 600 in white.
- Optional real testimonial photos, *only* if the testifier opts in, are rendered as monochrome (warm sepia duotone using `--text` and `--bg`) — never full color. This matches the editorial gravity.

### Field accent colors

Each broad academic field gets a single accent used for the top-border of a subject card and the avatar gradient of its testimonials. They sit in a slightly desaturated, warm range so they read as one family on the cream.

```
--field-technology      #2A6FDB
--field-business        #B07A1F
--field-science         #5C8C3E
--field-social-science  #8E5BB7
--field-humanities      #C8553D   (same as terracotta — earned)
--field-environmental   #2F8F6A
--field-design          #D97757
--field-applied         #4F5D75
```

### Layout

- Marketing pages: **1200px max content**, 24px outer gutter on desktop, 16px on mobile.
- Product pages (matcher, subject detail): **960px max content**, the matcher card itself is 720px wide.
- Grid: 12-column on desktop, 4-column on tablet, 1-column on mobile.
- Sticky nav: 72px tall, full-width.
- Sticky filter bars (Explore, Stories): 64px tall, full-width, sit immediately below nav.

### Fixed elements

Only **two** elements are ever fixed: the **nav** (top) and an optional **share-your-story footer CTA** (bottom-right corner, after scrolling past hero). Never a chat bubble, never a cookie banner, never a "back to top." Less is the brand.

---

## ICONOGRAPHY

EduPath BD uses **Lucide** (CDN via `https://unpkg.com/lucide@latest`) as the working icon set, with a deliberately tiny vocabulary. Stroke `1.75`, never filled. Always sized at `20×20` (chip icons) or `24×24` (nav, CTA) — no other sizes. Color matches surrounding text.

**Why Lucide:** open-source, MIT licensed, ~1400 icons, consistent geometric stroke. The brand's editorial gravity calls for line icons, not duotone or fill. Heroicons-outline would also work — Lucide is the pick because the stroke is slightly warmer (the corners are *just* softer) and the compass/route/map glyphs are excellent (relevant since the brand is literally about wayfinding).

Allowed icons (the whole vocabulary):

```
compass        — brand mark, nav-section dot
arrow-right    — CTAs, "Read full story" affordance
chevron-down   — dropdowns, expandable cards
check          — eligible, no-regrets, success
alert-triangle — eligible-with-note, attrition signal
shuffle        — would-switch, alternative path
map-pin        — Dhaka / Outside-Dhaka lens
trending-up    — rising demand
minus          — stable trend
circle         — niche trend (just the outline circle)
sparkles       — RESERVED — used only in the matcher's "matched" success state badge
graduation-cap — university chip leading glyph
book-open      — curriculum timeline phase marker
users          — testimonial count
clock          — "3 min" CTA microcopy
external-link  — when a uni pill links offsite
chevron-left   — back navigation
filter         — filter bars
search         — RESERVED (future)
x              — modal close
```

**Functional emoji** (see Content Fundamentals → Emoji) supplements Lucide for the matcher's interest taxonomy and constraint chips, where each option is meant to feel hand-picked (🧩 Logical systems, 🎨 Creating things, etc). These deliberately *don't* match the line-icon style — the friction is the point. Logic icons are clean; what you love is a little playful.

**Country flags** (🇧🇩, 🌐) appear only in regional contexts — never decoratively.

**No custom drawn SVG illustrations.** The brand cannot afford the "AI-drew-this" tell. When a section calls for imagery (empty state, success screen, hero composition), use the **testimonial card composition** (overlapping cards with gradient avatars) as the visual instead.

### Logo

The wordmark **EduPath BD** is set in **Fraunces 600** with a small **compass glyph** (Lucide `compass`, stroke 1.75, --green) sitting `8px` to the left of the P, vertically centered. The `BD` is rendered in `--green` while `EduPath` is `--text`. No animation. No mark-only / icon-only version — the wordmark always travels with its label.

Files in `assets/`:
- `logo.svg` — full wordmark, cream-bg variant
- `logo-on-green.svg` — same wordmark on `--green-dark`, with white `EduPath` and `--gold` `BD`
- `compass-glyph.svg` — the standalone Lucide compass at 24×24
- `bd-flag.svg` — Bangladesh flag for the regional-lens toggle (a simple two-color SVG, no real flag art — the spec uses 🇧🇩 emoji inline)

---

## How to use this kit

If you are an agent and you've been asked to design a screen, slide, or asset for EduPath BD:

1. Load `colors_and_type.css` into your HTML head — it already declares `@font-face` for Fraunces and Plus Jakarta Sans from `fonts/`. No CDN needed.
2. Lift components verbatim from `ui_kits/pathfinder-web/*.jsx` — the kit is the source of truth for buttons, cards, the matcher card, testimonial card, nav, footer. (`pathfinder-web/` is an internal codename — the brand is **EduPath BD**.)
3. Read the **Content Fundamentals** section above twice before writing any copy. The voice is the brand.

If you are a human iterating on this system, edits to `colors_and_type.css` should propagate to every preview card and the UI kit. Open `ui_kits/pathfinder-web/index.html` to see live components.
