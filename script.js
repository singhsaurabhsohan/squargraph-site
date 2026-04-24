// ==========================================
// SQUARGRAPH — CLEAN CINEMATIC SYSTEM
// ==========================================

// -----------------------------
// CORE ELEMENTS
// -----------------------------
const navbar = document.getElementById("navbar");
const layers = document.querySelectorAll(".hero-layer");
const glow = document.querySelector(".hero-glow");

// -----------------------------
// REVEAL ENGINE (SAFE)
// -----------------------------
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

revealElements.forEach((el) => revealObserver.observe(el));

// fallback safety
revealElements.forEach((el) => el.classList.add("visible"));


// -----------------------------
// ACCENT COLOR SYSTEM
// -----------------------------
const root = document.documentElement;
let progress = 0;

function lerpColor(a, b, t) {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);

  const ar = (ah >> 16) & 255,
        ag = (ah >> 8) & 255,
        ab = ah & 255;

  const br = (bh >> 16) & 255,
        bg = (bh >> 8) & 255,
        bb = bh & 255;

  return `rgb(
    ${ar + t * (br - ar)},
    ${ag + t * (bg - ag)},
    ${ab + t * (bb - ab)}
  )`;
}

function animateAccent() {
  progress += 0.002;
  if (progress > 1) progress = 0;

  root.style.setProperty("--accent", lerpColor("#95acff", "#4ee6c3", progress));

  requestAnimationFrame(animateAccent);
}
animateAccent();


// -----------------------------
// SMOOTH SCROLL ENGINE (FIXED)
// -----------------------------
let smoothScroll = 0;
let targetScroll = 0;

function smoothScrollLoop() {
  targetScroll = window.scrollY;
  smoothScroll += (targetScroll - smoothScroll) * 0.08;

  // NAVBAR
  if (navbar) {
    if (smoothScroll > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }

  // HERO DEPTH
  layers.forEach((layer, i) => {
    const depth = (i + 1) * 0.05;
    const offset = smoothScroll * depth * 0.8;
    layer.style.transform = `translateY(${offset}px)`;
  });

  // GLOW
  if (glow) {
    glow.style.transform = `translate(-50%, calc(-50% + ${smoothScroll * 0.08}px))`;
  }

  requestAnimationFrame(smoothScrollLoop);
}
smoothScrollLoop();


// -----------------------------
// CUSTOM CURSOR
// -----------------------------
const cursor = document.createElement("div");
cursor.classList.add("cursor");

const ring = document.createElement("div");
ring.classList.add("cursor-ring");

document.body.appendChild(cursor);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();


// -----------------------------
// HERO HEADLINE INTERACTION
// -----------------------------
const headline = document.querySelector(".interactive-headline");

if (headline) {
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener("mousemove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 6;
    ty = (e.clientY / window.innerHeight - 0.5) * 6;
  });

  function animateHeadline() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    headline.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(animateHeadline);
  }
  animateHeadline();
}


// -----------------------------
// STAR FIELD
// -----------------------------
const starField = document.getElementById("starField");

if (starField) {
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");

    const size = Math.random() * 2;

    Object.assign(star.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      background: "white",
      opacity: Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `twinkle ${2 + Math.random() * 4}s infinite`
    });

    starField.appendChild(star);
  }
}


// -----------------------------
// SAFE NAV TOGGLE
// -----------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}


// -----------------------------
// CHATBOT (SAFE)
// -----------------------------
const trigger = document.getElementById("chatbotTrigger");
const panel = document.getElementById("chatbotPanel");
const closeBtn = document.getElementById("chatbotClose");

if (trigger && panel && closeBtn) {
  trigger.addEventListener("click", () => panel.classList.toggle("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));
}


// -----------------------------
// SMOOTH ANCHOR SCROLL
// -----------------------------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});
