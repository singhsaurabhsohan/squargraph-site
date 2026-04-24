// NAV SCROLL EFFECT
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


// REVEAL ON SCROLL
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));


// MOBILE NAV
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});


// DYNAMIC ACCENT SHIFT
const root = document.documentElement;
let toggle = false;

setInterval(() => {
  root.style.setProperty(
    "--accent",
    toggle ? "#95acff" : "#4ee6c3"
  );
  toggle = !toggle;
}, 4000);


// CUSTOM CURSOR
const cursor = document.createElement("div");
cursor.classList.add("cursor");

const ring = document.createElement("div");
ring.classList.add("cursor-ring");

document.body.appendChild(cursor);
document.body.appendChild(ring);

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  ring.style.left = e.clientX + "px";
  ring.style.top = e.clientY + "px";
});

document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("hovered");
    ring.classList.add("hovered");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hovered");
    ring.classList.remove("hovered");
  });
});


// CHATBOT
const trigger = document.getElementById("chatbotTrigger");
const panel = document.getElementById("chatbotPanel");
const closeBtn = document.getElementById("chatbotClose");

trigger.addEventListener("click", () => {
  panel.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  panel.classList.remove("open");
});


// CHAT SEND
const input = document.getElementById("chatInput");
const send = document.getElementById("chatSend");
const messages = document.getElementById("chatMessages");

send.addEventListener("click", () => {
  if (!input.value.trim()) return;

  const userMsg = document.createElement("div");
  userMsg.classList.add("chat-msg", "user");
  userMsg.innerHTML = `<p>${input.value}</p>`;
  messages.appendChild(userMsg);

  input.value = "";

  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.classList.add("chat-msg", "bot");
    botMsg.innerHTML = `<p>Got it. Let’s take this forward on WhatsApp.</p>`;
    messages.appendChild(botMsg);
  }, 800);
});
