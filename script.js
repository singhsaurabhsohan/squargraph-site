gsap.registerPlugin(ScrollTrigger);

// Sections animation
gsap.utils.toArray(".section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
    }
  });
});

// Cards animation
gsap.utils.toArray(".card").forEach((card) => {
  gsap.from(card, {
    opacity: 0,
    y: 40,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
    }
  });
});

// Hero animation
gsap.from(".hero h1", {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power3.out"
});

gsap.from(".hero p", {
  opacity: 0,
  y: 20,
  delay: 0.3,
  duration: 0.8,
  ease: "power2.out"
});

gsap.from(".btn", {
  opacity: 0,
  y: 20,
  delay: 0.5,
  duration: 0.8,
  ease: "power2.out"
});
// Magnetic button effect
const buttons = document.querySelectorAll(".btn");

buttons.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });
});
