(function () {
  function installGlobalCleanupStyles() {
    if (document.getElementById("edupath-global-cleanup")) return;
    var style = document.createElement("style");
    style.id = "edupath-global-cleanup";
    style.textContent = [
      ".pf-footer,.pf-cta-strip{display:none!important}",
      ".pf-nav__inner>div:last-child{display:none!important}",
      ".pf-nav__inner{display:grid!important;grid-template-columns:auto 1fr auto!important}",
      ".pf-nav__links{justify-content:center!important}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function removeFooterAndCta() {
    installGlobalCleanupStyles();
    document.querySelectorAll(".pf-footer, .pf-cta-strip").forEach(function (node) {
      node.remove();
    });
  }

  window.Footer = function Footer() {
    return null;
  };

  if (window.React) {
    window.Footer = function Footer() {
      return null;
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeFooterAndCta);
  } else {
    removeFooterAndCta();
  }

  var observer = new MutationObserver(removeFooterAndCta);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
