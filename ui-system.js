(function () {
  function choicePill(E, options) {
    const active = Boolean(options.active);
    return E("button", {
      key: options.key || options.value || options.children,
      type: "button",
      onClick: options.onClick,
      disabled: options.disabled,
      className: "pill" + (active ? " is-active" : ""),
      style: Object.assign({
        border: "none",
        cursor: options.disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        minHeight: 32
      }, options.style || {})
    }, options.children || options.label);
  }

  function choiceGroup(E, children) {
    return E("div", {
      style: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center"
      }
    }, children);
  }

  function choiceSection(E, options) {
    return E("section", {
      style: Object.assign({
        borderTop: "1px solid var(--ink-08)",
        paddingTop: 18,
        marginTop: 20,
        marginBottom: 4
      }, options.style || {})
    },
      E("div", {
        style: {
          fontSize: 13,
          fontWeight: 800,
          marginBottom: 10
        }
      }, options.label),
      options.children);
  }

  window.EduPathUI = Object.assign({}, window.EduPathUI || {}, {
    choicePill,
    choiceGroup,
    choiceSection
  });
})();
