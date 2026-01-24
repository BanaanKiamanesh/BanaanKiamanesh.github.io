import { initMenu } from "./menu.js";

initMenu();

const year = document.querySelector("[data-year]");
if (year) {
  year.textContent = new Date().getFullYear();
}

const projectGrid = document.querySelector(".project-grid");
if (projectGrid) {
  const cards = Array.from(projectGrid.querySelectorAll(".project-card"));
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const count = document.querySelector("[data-project-count]");
  const allButton = buttons.find(
    (button) => (button.dataset.filter || "").toLowerCase() === "all"
  );

  const normalizeTag = (value) => (value || "").trim().toLowerCase();

  const sortByDate = () => {
    cards.sort((a, b) => {
      const aDate = a.dataset.updated || "";
      const bDate = b.dataset.updated || "";
      return bDate.localeCompare(aDate);
    });
    cards.forEach((card) => projectGrid.appendChild(card));
  };

  const applyFilter = (tag) => {
    const activeTag = normalizeTag(tag);
    let visible = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .map(normalizeTag)
        .filter(Boolean);
      const show = activeTag === "all" || tags.includes(activeTag);
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });
    if (count) {
      count.textContent = String(visible);
    }
  };

  const setActiveButton = (active) => {
    buttons.forEach((button) => {
      const isActive = button === active;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const handleFilter = (tag) => {
    const normalized = normalizeTag(tag) || "all";
    const activeButton = buttons.find(
      (button) => normalizeTag(button.dataset.filter) === normalized
    );
    setActiveButton(activeButton || allButton || buttons[0]);
    applyFilter(normalized);
  };

  sortByDate();
  applyFilter("all");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      handleFilter(button.dataset.filter || "all");
    });
  });

  const tagChips = Array.from(projectGrid.querySelectorAll("[data-tag]"));
  tagChips.forEach((chip) => {
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");
    chip.addEventListener("click", () => {
      handleFilter(chip.dataset.tag || "all");
    });
    chip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleFilter(chip.dataset.tag || "all");
      }
    });
  });
}
