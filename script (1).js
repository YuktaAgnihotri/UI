/**
 * Puppy interactions: natural blinking, click-to-show-tongue, squish feedback.
 * Works with an SVG pasted into #puppy-slot. If the SVG has no eye / tongue
 * ids, the puppy still floats, tilts on hover and squishes when clicked.
 */
(() => {
  const TONGUE_MS = 1600;

  const hit = document.getElementById("puppy");
  const boop = document.getElementById("puppy-boop");
  const slot = document.getElementById("puppy-slot");
  const blep = document.getElementById("blep");
  const status = document.getElementById("puppy-status");
  if (!hit || !boop || !slot) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Tag the animatable parts of the pasted SVG (if present)
  slot
    .querySelectorAll('#puppy-eye-left, #puppy-eye-right, #puppy-eyes, [data-puppy="eye"]')
    .forEach((el) => el.classList.add("puppy-eye"));
  const tongue = slot.querySelector('#puppy-tongue, [data-puppy="tongue"]');
  if (tongue) tongue.classList.add("puppy-tongue");

  // Click / tap / Enter / Space: tongue out + squish
  let tongueTimer = null;
  hit.addEventListener("click", () => {
    hit.dataset.tongue = "out";
    blep.dataset.show = "true";
    status.textContent = "The puppy sticks its tongue out.";

    clearTimeout(tongueTimer);
    tongueTimer = setTimeout(() => {
      hit.dataset.tongue = "in";
      blep.dataset.show = "false";
      status.textContent = "";
    }, TONGUE_MS);

    if (!reduced.matches) {
      boop.animate(
        [
          { transform: "scale(1, 1)" },
          { transform: "scale(1.07, 0.9)", offset: 0.25 },
          { transform: "scale(0.97, 1.05) rotate(-1.5deg)", offset: 0.6 },
          { transform: "scale(1, 1)" },
        ],
        { duration: 520, easing: "ease-out" }
      );
    }
  });

  // Natural blinking: irregular gaps, occasional double-blink
  if (slot.querySelector(".puppy-eye")) {
    const blink = () => {
      if (reduced.matches || document.hidden || hit.dataset.tongue === "out") return;
      hit.dataset.blink = "true";
      setTimeout(() => delete hit.dataset.blink, 140);
    };
    const loop = () => {
      setTimeout(() => {
        blink();
        if (Math.random() < 0.2) setTimeout(blink, 320);
        loop();
      }, 2200 + Math.random() * 3800);
    };
    loop();
  }
})();
