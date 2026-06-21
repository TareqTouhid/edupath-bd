(function () {
  const E = React.createElement;

  function AudiencePanel({ eyebrow, title, subtitle, cta, onClick, tone }) {
    return E("section", {
      className: "ep-audience-panel",
      style: {
        minHeight: "calc(100vh - var(--nav-h))",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(44px, 6vw, 88px) clamp(28px, 5vw, 72px)",
        background: "var(--bg)"
      }
    },
      E("div", { className: "micro", style: { marginBottom: 16 } }, eyebrow),
      E("h1", {
        className: "display-1",
        style: {
          fontSize: "clamp(42px, 6vw, 76px)",
          lineHeight: 1,
          maxWidth: 620,
          marginBottom: 22
        }
      }, title),
      E("p", {
        className: "lead",
        style: {
          fontSize: "clamp(17px, 1.65vw, 22px)",
          lineHeight: 1.55,
          maxWidth: 560,
          marginBottom: 34
        }
      }, subtitle),
      E("div", null,
        E("button", {
          type: "button",
          className: "btn btn-primary",
          onClick,
          style: { minWidth: 220 }
        }, cta)));
  }

  function ScreenLanding({ go }) {
    return E("div", {
      className: "ep-landing-shell",
      style: {
        minHeight: "calc(100vh - var(--nav-h))",
        borderTop: "1px solid var(--ink-08)",
        padding: "0 24px"
      }
    },
      E("div", {
        className: "ep-landing-split",
        style: {
          maxWidth: "var(--container-marketing)",
          minHeight: "calc(100vh - var(--nav-h))",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          borderLeft: "1px solid var(--ink-08)",
          borderRight: "1px solid var(--ink-08)",
          position: "relative"
        }
      },
        E(AudiencePanel, {
          eyebrow: "For undergraduate candidates",
          title: "Stop Guessing Your Future",
          subtitle: "Discover your ideal undergraduate major through curriculum insights, graduate outcomes, and real-world career data.",
          cta: "Discover My Opportunities",
          tone: "base",
          onClick: () => go("matcher")
        }),
        E("div", {
          className: "ep-landing-divider",
          style: {
            width: 1,
            background: "var(--ink-16)",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-0.5px)"
          },
          "aria-hidden": "true"
        }),
        E(AudiencePanel, {
          eyebrow: "For undergraduates, graduates and alumni",
          title: "Guide Your Juniors",
          subtitle: "Share honest advice, practical lessons, and real experiences to help students choose their path with confidence.",
          cta: "Share My Experience",
          tone: "alt",
          onClick: () => go("contribute")
        })),
      E("style", null, `
        .pf-nav__inner {
          display: grid !important;
          grid-template-columns: auto 1fr auto !important;
        }
        .pf-nav__links {
          justify-content: center !important;
        }
        .pf-nav__actions {
          display: none !important;
        }
        .ep-landing-shell,
        .ep-landing-split,
        .ep-audience-panel {
          min-width: 0;
        }
        @media (max-width: 820px) {
          .ep-landing-shell {
            min-height: auto !important;
            padding: 0 !important;
            overflow-x: clip;
          }
          .pf-nav__inner > div:nth-of-type(3) {
            display: none !important;
          }
          .pf-nav__menu-toggle {
            justify-self: end;
            width: auto;
          }
          .pf-nav__mobile-menu {
            display: grid !important;
          }
          .pf-landing-section .pf-nav__actions {
            display: block !important;
          }
          .ep-landing-split {
            display: block !important;
            min-height: auto !important;
            border-left: 0 !important;
            border-right: 0 !important;
          }
          .ep-audience-panel {
            min-height: auto !important;
            padding: 72px 24px !important;
          }
          .ep-audience-panel .display-1 {
            font-size: clamp(42px, 12vw, 58px) !important;
          }
          .ep-landing-divider {
            position: static !important;
            width: auto !important;
            height: 1px !important;
            margin: 0 24px !important;
            transform: none !important;
          }
        }
      `));
  }

  Object.assign(window, { ScreenLanding });
})();
