function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const root = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);

  toggle.className =
    savedTheme === "dark"
      ? "bi bi-sun nav-icon"
      : "bi bi-moon nav-icon";

  toggle.addEventListener("click", () => {
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

    toggle.className =
      next === "dark"
        ? "bi bi-sun nav-icon"
        : "bi bi-moon nav-icon";
  });
}
