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
