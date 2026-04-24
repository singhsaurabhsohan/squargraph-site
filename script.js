// ==========================================
// SQUARGRAPH — CINEMATIC INTERACTION SYSTEM
// ==========================================

// -----------------------------
// NAVBAR — GLASS TRANSITION
// -----------------------------
const navbar = document.getElementById("navbar");
const layers = document.querySelectorAll(".hero-layer");

let lastScroll = 0;

  // GLOW PARALLAX
  const glow = document.querySelector(".hero-glow");
  if (glow) {
    glow.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.08}px))`;
  }
});
const layers = document.querySelectorAll(".hero-layer");
// -----------------------------
// REVEAL ENGINE (SMOOTH + STAGGER)
// -----------------------------
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 80); // stagger
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));


// -----------------------------
// ACCENT COLOR SYSTEM (BREATHING)
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

  const rr = ar + t * (br - ar);
  const rg = ag + t * (bg - ag);
  const rb = ab + t * (bb - ab);

  return `rgb(${rr},${rg},${rb})`;
}

function animateAccent() {
  progress += 0.002;

  if (progress > 1) progress = 0;

  const color = lerpColor("#95acff", "#4ee6c3", progress);
  root.style.setProperty("--accent", color);

  requestAnimationFrame(animateAccent);
}

animateAccent();
// -----------------------------
// SMOOTH SCROLL ENGINE (CINEMATIC)
// -----------------------------
let smoothScroll = 0;
let targetScroll = 0;

function smoothScrollLoop() {
  targetScroll = window.scrollY;
  smoothScroll += (targetScroll - smoothScroll) * 0.08;

  // NAVBAR
  if (smoothScroll > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // HERO DEPTH
  layers.forEach((layer, i) => {
    const depth = (i + 1) * 0.05;
    const offset = smoothScroll * depth * 0.8;
    layer.style.transform = `translateY(${offset}px)`;
  });

  // GLOW
  const glow = document.querySelector(".hero-glow");
  if (glow) {
    glow.style.transform = `translate(-50%, calc(-50% + ${smoothScroll * 0.08}px))`;
  }

  requestAnimationFrame(smoothScrollLoop);
}

smoothScrollLoop();

// -----------------------------
// CUSTOM CURSOR (MAGNETIC)
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
// -----------------------------
// HERO HEADLINE INTERACTION (WOW)
// -----------------------------
const headline = document.querySelector(".interactive-headline");

if (headline) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 12;
    targetY = (e.clientY / window.innerHeight - 0.5) * 12;
  });

  function animateHeadline() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    headline.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animateHeadline);
  }

  animateHeadline();
}
// -----------------------------
// MAGNETIC CTA
// -----------------------------
const magnetic = document.querySelector(".magnetic");

if (magnetic) {
  magnetic.addEventListener("mousemove", (e) => {
    const rect = magnetic.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    magnetic.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  magnetic.addEventListener("mouseleave", () => {
    magnetic.style.transform = `translate(0,0)`;
  });
}

// smooth lag
function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;

  ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

// hover states
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("hovered");
    ring.classList.add("hovered");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hovered");
    ring.classList.remove("hovered");
  });
});


// -----------------------------
// HERO — STAR FIELD GENERATOR
// -----------------------------
const starField = document.getElementById("starField");

if (starField) {
  createStars();
}

function createStars(count = 80) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");

    const size = Math.random() * 2;

    star.style.position = "absolute";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.background = "white";
    star.style.opacity = Math.random();
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.animation = `twinkle ${2 + Math.random() * 4}s infinite`;

    starField.appendChild(star);
  }
}

// -----------------------------
// MOBILE NAV
// -----------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});


// -----------------------------
// CHATBOT SYSTEM (SMART FEEL)
// -----------------------------
const trigger = document.getElementById("chatbotTrigger");
const panel = document.getElementById("chatbotPanel");
const closeBtn = document.getElementById("chatbotClose");

trigger.addEventListener("click", () => {
  panel.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  panel.classList.remove("open");
});

const input = document.getElementById("chatInput");
const send = document.getElementById("chatSend");
const messages = document.getElementById("chatMessages");

function addMessage(text, type = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("chat-msg", type);
  msg.innerHTML = `<p>${text}</p>`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

send.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage("Got it. This sounds interesting. Let's take this forward on WhatsApp.");
  }, 800);
});


// -----------------------------
// SMOOTH SCROLL (PREMIUM FEEL)
// -----------------------------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
