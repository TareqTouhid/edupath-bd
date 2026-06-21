(function () {
  function installGlobalCleanupStyles() {
    if (document.getElementById("edupath-global-cleanup")) return;
    var style = document.createElement("style");
    style.id = "edupath-global-cleanup";
    style.textContent = [
      ".pf-footer,.pf-cta-strip{display:none!important}",
      ".pf-nav__actions{display:none!important}",
      ".pf-nav__inner{display:flex!important;align-items:center!important;justify-content:space-between!important}",
      ".pf-nav__links{display:flex!important;justify-content:flex-end!important;gap:32px!important;margin-left:auto!important}"
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
