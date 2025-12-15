document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("navbar")) {
    fetch("./components/navbar.html")
      .then(res => res.text())
      .then(async (html) => {
        document.getElementById("navbar").innerHTML = html;

        // Initialize theme toggle if available
        try {
          if (typeof initThemeToggle === 'function') {
            initThemeToggle();
          }
        } catch (e) {
          console.warn('initThemeToggle not available yet', e);
        }

        // Dynamically import search module and initialize search (if available)
        try {
          const mod = await import('./search.js');
          if (mod && typeof mod.initializeSearch === 'function') {
            mod.initializeSearch();
          }
        } catch (err) {
          console.warn('Could not initialize search module:', err);
        }
      });
  }
});
