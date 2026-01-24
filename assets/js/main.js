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

  const modal = document.querySelector("[data-project-modal]");
  if (modal) {
    const modalTitle = modal.querySelector("[data-modal-title]");
    const modalYear = modal.querySelector("[data-modal-year]");
    const modalTags = modal.querySelector("[data-modal-tags]");
    const modalBody = modal.querySelector("[data-modal-body]");
    const modalLinks = modal.querySelector("[data-modal-links]");
    const closeButtons = modal.querySelectorAll("[data-modal-close]");

    const openModal = (card) => {
      const dataScript = card.querySelector(".project-data");
      if (!dataScript) {
        return;
      }
      let data = null;
      try {
        data = JSON.parse(dataScript.textContent);
      } catch (error) {
        return;
      }
      if (!data) {
        return;
      }

      if (modalTitle) {
        modalTitle.textContent = data.title || "";
      }
      if (modalYear) {
        modalYear.textContent = data.year ? String(data.year) : "";
      }

      if (modalTags) {
        modalTags.innerHTML = "";
        (data.tags || []).forEach((tag) => {
          const span = document.createElement("span");
          span.className = "tag";
          span.textContent = tag.label || tag.id || "";
          modalTags.appendChild(span);
        });
      }

      const renderParagraph = (text) => {
        const escaped = String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      };

      const buildImages = (images, className) => {
        if (!Array.isArray(images) || images.length === 0) {
          return null;
        }
        const gallery = document.createElement("div");
        gallery.className = className;
        images.forEach((image) => {
          if (!image || !image.src) {
            return;
          }
          const img = document.createElement("img");
          img.className = "modal-image";
          img.src = image.src;
          img.alt = image.alt || data.title || "";
          img.loading = "lazy";
          img.decoding = "async";
          gallery.appendChild(img);
        });
        return gallery.children.length > 0 ? gallery : null;
      };

      if (modalBody) {
        modalBody.innerHTML = "";
        if (data.embed && data.embed.src) {
          const layout = document.createElement("div");
          layout.className = "modal-layout";

          const left = document.createElement("div");
          left.className = "modal-left";

          const imageList = data.images || (data.image ? [data.image] : []);
          const gallery = buildImages(imageList, "modal-gallery modal-gallery--small");
          if (gallery) {
            left.appendChild(gallery);
          }

          (data.details || []).forEach((paragraph) => {
            const p = document.createElement("p");
            p.innerHTML = renderParagraph(paragraph);
            left.appendChild(p);
          });

          const right = document.createElement("div");
          right.className = "modal-right";

          const frame = document.createElement("iframe");
          frame.className = "modal-embed";
          frame.src = data.embed.src;
          frame.title = data.embed.title || "Embedded content";
          frame.loading = "lazy";
          frame.allowFullscreen = true;
          frame.referrerPolicy = "no-referrer";
          right.appendChild(frame);

          layout.appendChild(left);
          layout.appendChild(right);
          modalBody.appendChild(layout);
        } else {
          const imageList = data.images || (data.image ? [data.image] : []);
          if (imageList.length > 0) {
            const layout = document.createElement("div");
            layout.className = "modal-layout";

            const left = document.createElement("div");
            left.className = "modal-left";

            (data.details || []).forEach((paragraph) => {
              const p = document.createElement("p");
              p.innerHTML = renderParagraph(paragraph);
              left.appendChild(p);
            });

            const right = document.createElement("div");
            right.className = "modal-right";

            const gallery = buildImages(imageList, "modal-gallery modal-gallery--right");
            if (gallery) {
              right.appendChild(gallery);
            }

            layout.appendChild(left);
            layout.appendChild(right);
            modalBody.appendChild(layout);
          } else {
            (data.details || []).forEach((paragraph) => {
              const p = document.createElement("p");
              p.innerHTML = renderParagraph(paragraph);
              modalBody.appendChild(p);
            });
          }
        }
      }

      if (modalLinks) {
        modalLinks.innerHTML = "";
        (data.links || []).forEach((link) => {
          const a = document.createElement("a");
          a.className = "text-link";
          a.href = link.url;
          a.target = "_blank";
          a.rel = "noreferrer";
          a.textContent = link.label;
          modalLinks.appendChild(a);
        });
      }

      modal.hidden = false;
      document.body.classList.add("modal-open");
      if (closeButtons.length > 0) {
        closeButtons[0].focus();
      }
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (modalTags) {
        modalTags.innerHTML = "";
      }
      if (modalBody) {
        modalBody.innerHTML = "";
      }
      if (modalLinks) {
        modalLinks.innerHTML = "";
      }
    };

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-modal-close]")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!modal.hidden && event.key === "Escape") {
        closeModal();
      }
    });

    cards.forEach((card) => {
      const openButton = card.querySelector(".project-open");
      if (openButton) {
        openButton.addEventListener("click", (event) => {
          event.preventDefault();
          openModal(card);
        });
      }

      card.addEventListener("click", (event) => {
        if (
          event.target.closest(".tag") ||
          event.target.closest(".text-link") ||
          event.target.closest(".project-open") ||
          event.target.closest("a")
        ) {
          return;
        }
        openModal(card);
      });
    });
  }
}
