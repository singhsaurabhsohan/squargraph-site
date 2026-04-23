/* ═══════════════════════════════════════
   SQUARGRAPH STUDIOS — JavaScript
   GSAP Animations · Interactions · UX
═══════════════════════════════════════ */

/* ─── INIT ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initRevealObserver();
  initMagneticButtons();
  initScrollHint();

  // Wait for GSAP to load
  const checkGSAP = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      clearInterval(checkGSAP);
      gsap.registerPlugin(ScrollTrigger);
      initHeroAnimation();
      initParallax();
    }
  }, 100);
});

/* ─── NAV SCROLL BEHAVIOR ─────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ─── HAMBURGER / MOBILE NAV ──────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  btn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    btn.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ─── SCROLL REVEAL (IntersectionObserver) ── */
function initRevealObserver() {
  const els = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Stagger siblings within same parent
          const siblings = Array.from(el.parentElement.querySelectorAll('.reveal-up:not(.is-visible)'));
          const idx = siblings.indexOf(el);
          const delay = Math.min(idx * 80, 320);
          setTimeout(() => el.classList.add('is-visible'), delay);
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach(el => io.observe(el));
}

/* ─── HERO ANIMATION (GSAP) ───────────── */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Orbs drift
  gsap.to('.hero-orb-1', {
    y: -40,
    x: 20,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
  gsap.to('.hero-orb-2', {
    y: 30,
    x: -20,
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Hero entrance
  tl.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.3)
    .fromTo('.hero-headline', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0.5)
    .fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
    .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.95)
    .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.3);
}

/* ─── PARALLAX (GSAP ScrollTrigger) ──── */
function initParallax() {
  // Hero orbs gentle parallax
  gsap.to('.hero-orb-1', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: '-20%',
  });
  gsap.to('.hero-orb-2', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: '-10%',
  });

  // Work images subtle parallax
  document.querySelectorAll('.work-card-img img, .about-visual img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.work-card, .about-visual'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  });
}

/* ─── MAGNETIC BUTTONS ────────────────── */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.magnetic');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ─── SCROLL HINT FADE OUT ────────────── */
function initScrollHint() {
  const hint = document.querySelector('.hero-scroll-hint');
  if (!hint) return;
  const handleScroll = () => {
    if (window.scrollY > 120) {
      hint.style.opacity = '0';
      hint.style.transform = 'translateX(-50%) translateY(10px)';
    } else {
      hint.style.opacity = '1';
      hint.style.transform = 'translateX(-50%) translateY(0)';
    }
  };
  hint.style.transition = 'opacity 0.5s, transform 0.5s';
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ─── FORM HANDLING ───────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Allow Formspree to handle the actual submission
    // This just provides UX feedback for non-Formspree fallback
    await new Promise(r => setTimeout(r, 2000));
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

/* ─── SMOOTH ANCHOR SCROLLING ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── CURSOR GLOW (desktop only) ─────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(149,172,255,0.04), transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  };
  animateGlow();
}

/* ─── WORK CARD TILT (subtle) ────────── */
document.querySelectorAll('.work-card, .insight-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    card.style.transition = 'transform 0.1s linear, border-color 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.3s';
  });
});
// ─── PAGE TRANSITION ───
const transitionEl = document.querySelector('.page-transition');

document.querySelectorAll('a[href]').forEach(link => {
  const url = link.getAttribute('href');

  // ignore anchors (#) and same page links
  if (!url || url.startsWith('#') || url.startsWith('mailto') || url.startsWith('tel')) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();

    gsap.to(transitionEl, {
      scaleY: 1,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        window.location.href = url;
      }
    });
  });
});

// reveal on load
window.addEventListener('load', () => {
  gsap.to('.page-transition', {
    scaleY: 0,
    duration: 0.8,
    ease: "power3.out"
  });
});
// ─── CUSTOM CURSOR ───
const cursor = document.querySelector('.cursor');

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.2
  });
});

// scale on hover
document.querySelectorAll('a, button, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 2 });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 1 });
  });
});
