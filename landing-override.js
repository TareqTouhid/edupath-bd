(function () {
  const E = React.createElement;

  function counts() {
    const pf = window.PFData || {};
    const ugc = window.UGCData || {};
    const unis = (ugc.public || []).length + (ugc.private || []).length + (ugc.international || []).length;
    return {
      stories: (pf.testimonials || []).length,
      subjects: (pf.subjects || []).length,
      universities: unis,
      jobs: (window.DB_Jobs || []).length
    };
  }

  function pickStory() {
    const list = (window.PFData && window.PFData.testimonials) || [];
    const ok = list.filter(t => t.good && t.bad && t.good.length > 70 && t.good.length < 260 && t.bad.length > 30 && t.bad.length < 240);
    return ok.find(t => t.again === "yes" && t.subjectName) || ok[0] || null;
  }

  function Audience({ eyebrow, title, subtitle, cta, onClick, tone }) {
    return E("article", { className: "ep-aud ep-aud--" + tone },
      E("div", { className: "ep-eyebrow" }, eyebrow),
      E("h2", { className: "ep-aud__title" }, title),
      E("p", { className: "ep-aud__sub" }, subtitle),
      E("button", { type: "button", className: tone === "base" ? "btn btn-primary" : "btn btn-ghost", onClick }, cta, " →"));
  }

  function RouteCard({ n, label, desc, count, onClick }) {
    return E("button", { type: "button", className: "ep-route", onClick },
      E("span", { className: "ep-route__count" }, count || "—"),
      E("span", { className: "ep-route__label" }, label),
      E("span", { className: "ep-route__desc" }, desc),
      E("span", { className: "ep-route__go", "aria-hidden": "true" }, "→"));
  }

  function ScreenLanding({ go }) {
    const c = counts();
    const story = pickStory();

    return E("div", { className: "ep-landing" },

      E("section", { className: "ep-hero", "aria-labelledby": "ep-h1" },
        E("div", { className: "ep-wrap" },
          E("div", { className: "ep-eyebrow" }, "EduPath BD · For students in Bangladesh"),
          E("h1", { id: "ep-h1", className: "ep-h1" }, "Your future is too expensive to guess."),
          E("p", { className: "ep-lead" }, "Real graduate experiences, university offerings and job data in one place, so you can choose an undergraduate subject with evidence instead of pressure."),
          E("div", { className: "ep-audiences" },
            E(Audience, {
              tone: "base",
              eyebrow: "For undergraduate candidates",
              title: "Stop Guessing Your Future",
              subtitle: "Discover your ideal undergraduate major through curriculum insights, graduate outcomes, and real-world career data.",
              cta: "Discover My Opportunities",
              onClick: () => go("matcher")
            }),
            E(Audience, {
              tone: "alt",
              eyebrow: "For undergraduates, graduates and alumni",
              title: "Guide Your Juniors",
              subtitle: "Share honest advice, practical lessons, and real experiences to help students choose their path with confidence.",
              cta: "Share My Experience",
              onClick: () => go("contribute")
            })))),

      E("section", { className: "ep-stats", "aria-label": "EduPath BD in numbers" },
        E("div", { className: "ep-wrap ep-stats__grid" },
          [[c.stories, "Graduate responses"], [c.subjects, "Subjects mapped"], [c.universities, "Universities listed"], [c.jobs, "Careers with salary data"]].map((s, i) =>
            E("div", { key: i, className: "ep-stat" },
              E("div", { className: "ep-stat__num" }, s[0] || "—"),
              E("div", { className: "ep-stat__lbl" }, s[1]))))),

      E("section", { className: "ep-section", "aria-labelledby": "ep-routes-h" },
        E("div", { className: "ep-wrap" },
          E("div", { className: "ep-eyebrow" }, "Start exploring"),
          E("h2", { id: "ep-routes-h", className: "ep-h2" }, "Four ways in"),
          E("div", { className: "ep-routes" },
            E(RouteCard, { label: "Subjects", count: c.subjects, desc: "Curriculum, HSC requirements, career paths and honest caveats for each subject.", onClick: () => go("all-subjects") }),
            E(RouteCard, { label: "Universities", count: c.universities, desc: "Public, private and international universities and the subjects they offer.", onClick: () => go("all-universities") }),
            E(RouteCard, { label: "Real stories", count: c.stories, desc: "What graduates liked, what they struggled with, and whether they'd choose it again.", onClick: () => go("stories") }),
            E(RouteCard, { label: "Jobs", count: c.jobs, desc: "Salary ranges in Bangladesh and abroad, and the subjects that lead to each career.", onClick: () => go("careers") })))),

      E("section", { className: "ep-section ep-section--white", "aria-labelledby": "ep-how-h" },
        E("div", { className: "ep-wrap" },
          E("div", { className: "ep-eyebrow" }, "How it works"),
          E("h2", { id: "ep-how-h", className: "ep-h2" }, "From a question to a shortlist"),
          E("ol", { className: "ep-steps" },
            [["Tell us what fits you", "Answer a short questionnaire about your interests, HSC group and constraints."],
             ["See the evidence", "Compare subjects, universities and salaries against what graduates actually report."],
             ["Decide with confidence", "Read honest stories from people who studied it, then pick with your eyes open."]].map((s, i) =>
              E("li", { key: i, className: "ep-step" },
                E("span", { className: "ep-step__n" }, "0" + (i + 1)),
                E("h3", { className: "ep-step__t" }, s[0]),
                E("p", { className: "ep-step__d" }, s[1])))))),

      story && E("section", { className: "ep-section", "aria-labelledby": "ep-story-h" },
        E("div", { className: "ep-wrap ep-story" },
          E("div", { className: "ep-eyebrow", id: "ep-story-h" }, "One real voice"),
          E("blockquote", { className: "ep-quote" }, "“" + story.good + "”"),
          E("p", { className: "ep-quote__bad" }, E("strong", null, "The hard part: "), story.bad),
          E("div", { className: "ep-quote__by" }, [story.subjectName, story.uni].filter(Boolean).join(" · ")),
          E("button", { type: "button", className: "btn btn-ghost", onClick: () => go("stories") }, "Read all stories →"))),

      E("section", { className: "ep-cta" },
        E("div", { className: "ep-wrap" },
          E("h2", { className: "ep-cta__h" }, "Ready when you are."),
          E("p", { className: "ep-cta__p" }, "Free, no sign-up. Start with the subjects or share what you learned."),
          E("div", { className: "ep-cta__btns" },
            E("button", { type: "button", className: "ep-btn-light", onClick: () => go("matcher") }, "Discover My Opportunities"),
            E("button", { type: "button", className: "ep-btn-outline", onClick: () => go("contribute") }, "Share My Experience")),
          E("p", { className: "ep-cta__trust" }, "Responses collected 2024–2025 and published with consent. Salary and career data is indicative, so verify it independently. Not affiliated with any university or government body."))),

      E("style", null, `
        .pf-nav__actions { display: none !important; }
        .pf-nav__inner { display: flex !important; align-items: center !important; justify-content: space-between !important; }
        .pf-nav__links { display: flex !important; justify-content: flex-end !important; gap: 32px !important; margin-left: auto !important; }

        .ep-wrap { max-width: var(--container-marketing); margin: 0 auto; padding: 0 24px; }
        .ep-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--green); margin-bottom: 12px; }
        .ep-h1 { font-family: var(--font-display); font-weight: 600; font-size: clamp(38px, 5.6vw, 68px); line-height: 1.08; letter-spacing: -0.02em; margin: 0 0 20px; max-width: 20ch; }
        .ep-h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 3.2vw, 36px); line-height: 1.15; letter-spacing: -0.01em; margin: 0 0 32px; }
        .ep-lead { font-size: 18px; line-height: 1.6; color: var(--text-muted); max-width: 62ch; margin: 0 0 40px; }

        .ep-hero { padding: 56px 0 48px; border-top: 1px solid var(--ink-08); }
        .ep-audiences { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .ep-aud { background: var(--surface); border-top: 3px solid var(--green); padding: 32px; display: flex; flex-direction: column; align-items: flex-start; gap: 14px; box-shadow: var(--shadow-1); }
        .ep-aud--alt { border-top-color: var(--gold); }
        .ep-aud .ep-eyebrow { margin: 0; }
        .ep-aud--alt .ep-eyebrow { color: var(--text-muted); }
        .ep-aud__title { font-family: var(--font-display); font-weight: 600; font-size: 28px; line-height: 1.15; margin: 0; }
        .ep-aud__sub { margin: 0 0 8px; font-size: 16px; line-height: 1.55; color: var(--text-muted); flex: 1; }

        .ep-stats { background: var(--green-dark); color: #fff; padding: 36px 0; }
        .ep-stats__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
        .ep-stat__num { font-family: var(--font-display); font-weight: 600; font-size: 48px; line-height: 1; letter-spacing: -0.02em; }
        .ep-stat__lbl { margin-top: 8px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 600; opacity: .85; }

        .ep-section { padding: 72px 0; }
        .ep-section--white { background: var(--surface); }
        .ep-routes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        .ep-route { position: relative; text-align: left; background: var(--surface); border: 1px solid var(--ink-08); border-top: 3px solid var(--green); padding: 24px 24px 56px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; font-family: inherit; color: inherit; transition: box-shadow var(--t-mid) var(--ease-editorial), transform var(--t-mid) var(--ease-editorial); }
        .ep-route:hover { box-shadow: var(--shadow-2); transform: translateY(-2px); }
        .ep-route__count { font-family: var(--font-display); font-weight: 600; font-size: 36px; line-height: 1; color: var(--green); }
        .ep-route__label { font-weight: 600; font-size: 18px; }
        .ep-route__desc { font-size: 14px; line-height: 1.5; color: var(--text-muted); }
        .ep-route__go { position: absolute; left: 24px; bottom: 20px; font-size: 20px; color: var(--green); }

        .ep-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
        .ep-step__n { display: block; font-family: var(--font-display); font-weight: 600; font-size: 40px; color: var(--green); margin-bottom: 8px; }
        .ep-step__t { font-family: var(--font-display); font-weight: 600; font-size: 20px; margin: 0 0 8px; }
        .ep-step__d { margin: 0; font-size: 15px; line-height: 1.55; color: var(--text-muted); }

        .ep-story { max-width: 820px; }
        .ep-quote { font-family: var(--font-display); font-style: italic; font-size: clamp(22px, 2.6vw, 30px); line-height: 1.4; margin: 0 0 20px; }
        .ep-quote__bad { font-size: 16px; line-height: 1.6; color: var(--text-muted); margin: 0 0 12px; }
        .ep-quote__by { font-size: 13px; font-weight: 600; letter-spacing: .04em; margin-bottom: 24px; }

        .ep-cta { background: var(--green); color: #fff; padding: 64px 0; text-align: center; }
        .ep-cta__h { font-family: var(--font-display); font-weight: 600; font-size: clamp(28px, 3.6vw, 40px); margin: 0 0 12px; color: #fff; }
        .ep-cta__p { margin: 0 0 28px; font-size: 17px; color: rgba(255,255,255,.88); }
        .ep-cta__trust { max-width: 640px; margin: 32px auto 0; font-size: 12px; line-height: 1.6; color: rgba(255,255,255,.75); }
        .ep-cta__btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .ep-btn-light, .ep-btn-outline { min-height: 44px; padding: 0 24px; border-radius: var(--r-pill); font: 600 16px/1 var(--font-body); cursor: pointer; }
        .ep-btn-light { background: #fff; color: var(--green-dark); border: 1px solid #fff; }
        .ep-btn-light:hover { background: #E8E8E8; }
        .ep-btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.7); }
        .ep-btn-outline:hover { background: rgba(255,255,255,.12); }

        @media (max-width: 960px) {
          .ep-routes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ep-stats__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 820px) {
          .pf-nav__inner > div:nth-of-type(3) { display: none !important; }
          .pf-nav__menu-toggle { justify-self: end; width: auto; }
          .pf-nav__mobile-menu { display: grid !important; }
          .ep-audiences, .ep-steps { grid-template-columns: 1fr; }
          .ep-hero { padding: 40px 0 32px; }
          .ep-section { padding: 48px 0; }
        }
        @media (max-width: 520px) {
          .ep-routes { grid-template-columns: 1fr; }
          .ep-aud { padding: 24px; }
        }
      `));
  }

  Object.assign(window, { ScreenLanding });
})();
