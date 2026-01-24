export function initTypewriter() {
  const target = document.querySelector(".typewriter");
  const cursor = document.querySelector(".cursor");

  if (!target || !cursor) {
    return;
  }

  const text = target.dataset.text || "";
  const speed = Number.parseInt(target.dataset.speed, 10) || 75;
  const startDelay = Number.parseInt(target.dataset.delay, 10) || 300;
  let index = 0;

  target.textContent = "";

  const tick = () => {
    target.textContent = text.slice(0, index);
    if (index < text.length) {
      index += 1;
      window.setTimeout(tick, speed);
    } else {
      cursor.classList.add("cursor--idle");
    }
  };

  window.setTimeout(tick, startDelay);
}
