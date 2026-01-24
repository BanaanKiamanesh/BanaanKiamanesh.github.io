export function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".nav-panel");

  if (!toggle || !panel) {
    return;
  }

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    document.body.classList.add("nav-open");
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
