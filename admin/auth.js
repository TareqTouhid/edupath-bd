(function () {
  const TOKEN_KEY = "edupath_admin_token";
  const LOGIN_PATH = "/admin/login.html";

  function nextUrl() {
    return encodeURIComponent(location.pathname + location.search + location.hash);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function requireLogin() {
    if (getToken()) return true;
    location.replace(`${LOGIN_PATH}?next=${nextUrl()}`);
    return false;
  }

  function headers(extra) {
    return Object.assign({
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }, extra || {});
  }

  async function login(token) {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Login failed.");
    setToken(token);
    return json;
  }

  function logout() {
    clearToken();
    location.replace(LOGIN_PATH);
  }

  function attachLogout(id) {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", logout);
  }

  window.EduPathAdminAuth = {
    token: getToken,
    login,
    logout,
    requireLogin,
    headers,
    attachLogout
  };
})();
