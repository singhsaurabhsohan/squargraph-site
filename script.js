/* =========================================
   SQUARGRAPH STUDIOS — script.js
   Interstellar Edition. Cinematic. Deep.
   ========================================= */

'use strict';

/* ═══════════════════════════════════════════
   BLACK HOLE + ACCRETION DISK + STAR FIELD
   ═══════════════════════════════════════════ */
(function initCinematicUniverse() {
  const container = document.getElementById('starField');
  if (!container) return;

  const W = window.innerWidth;
  const H = window.innerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  const BH = { x: W * 0.62, y: H * 0.48, radius: Math.min(W, H) * 0.09 };

  // ── STARS
  const STAR_COUNT = 320;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = BH.radius * 2.2 + Math.random() * Math.max(W, H);
    stars.push({
      x: BH.x + Math.cos(angle) * dist,
      y: BH.y + Math.sin(angle) * dist,
      baseX: BH.x + Math.cos(angle) * dist,
      baseY: BH.y + Math.sin(angle) * dist,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.012 + 0.003,
      twinklePhase: Math.random() * Math.PI * 2,
      color: starColor(),
    });
  }
  function starColor() {
    const r = Math.random();
    if (r < 0.6)  return [200, 215, 255];
    if (r < 0.8)  return [255, 240, 200];
    if (r < 0.93) return [180, 200, 255];
    return [255, 210, 180];
  }

  // ── ACCRETION DISK
  const DISK_COUNT = 280;
  const diskParticles = [];
  for (let i = 0; i < DISK_COUNT; i++) {
    const lane = Math.random();
    const minR = BH.radius * 1.15;
    const maxR = BH.radius * 3.8;
    diskParticles.push({
      angle: Math.random() * Math.PI * 2,
      dist: minR + Math.pow(lane, 0.6) * (maxR - minR),
      speed: (0.0004 + (1 - lane) * 0.0012) * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.4 + 0.8),
      r: Math.random() * 1.6 + 0.3,
      a: Math.random() * 0.7 + 0.2,
      hue: 195 + Math.random() * 60,
      decay: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // ── PHOTON RING
  const LENS_COUNT = 120;
  const lensRing = [];
  for (let i = 0; i < LENS_COUNT; i++) {
    lensRing.push({
      angle: (i / LENS_COUNT) * Math.PI * 2,
      speed: 0.00025 + Math.random() * 0.0002,
      r: Math.random() * 0.8 + 0.3,
      a: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // ── NEBULA DUST
  const dustClouds = [];
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = BH.radius * 2.5 + Math.random() * BH.radius * 4;
    dustClouds.push({
      x: BH.x + Math.cos(angle) * dist,
      y: BH.y + Math.sin(angle) * dist,
      rx: 80 + Math.random() * 160,
      ry: 40 + Math.random() * 100,
      rotation: Math.random() * Math.PI * 2,
      hue: 200 + Math.random() * 80,
      a: Math.random() * 0.04 + 0.01,
    });
  }

  // ── INFALLING JETS
  const jets = [];
  for (let i = 0; i < 18; i++) spawnJet(i);
  function spawnJet(i) {
    const angle = Math.random() * Math.PI * 2;
    jets[i] = {
      angle,
      dist: BH.radius * 3.5 + Math.random() * BH.radius * 3,
      speed: 0.004 + Math.random() * 0.008,
      r: Math.random() * 1.2 + 0.4,
      a: Math.random() * 0.6 + 0.2,
      hue: 180 + Math.random() * 60,
      trail: [],
    };
  }

  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  let frame = 0;
  function drawFrame() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    const px = (mouseX - W / 2) * 0.012;
    const py = (mouseY - H / 2) * 0.012;

    // Deep space bg
    const bgGrad = ctx.createRadialGradient(BH.x, BH.y, 0, BH.x, BH.y, Math.max(W, H) * 0.8);
    bgGrad.addColorStop(0, 'rgba(4,6,12,0)');
    bgGrad.addColorStop(0.4, 'rgba(8,14,28,0.4)');
    bgGrad.addColorStop(1, 'rgba(4,6,10,0.8)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Nebula
    dustClouds.forEach(d => {
      ctx.save();
      ctx.translate(d.x + px * 0.3, d.y + py * 0.3);
      ctx.rotate(d.rotation);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(d.rx, d.ry));
      g.addColorStop(0, `hsla(${d.hue},60%,70%,${d.a * 1.5})`);
      g.addColorStop(1, 'hsla(0,0%,0%,0)');
      ctx.scale(d.rx / Math.max(d.rx, d.ry), d.ry / Math.max(d.rx, d.ry));
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(d.rx, d.ry), 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    });

    // Stars with lensing
    stars.forEach(s => {
      const dx = s.baseX - BH.x, dy = s.baseY - BH.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const lensFactor = Math.max(0, 1 - (BH.radius * 3.5) / dist);
      const lensAngle = Math.atan2(dy, dx) + (BH.radius * 0.6) / Math.max(dist, 1);
      const lx = BH.x + Math.cos(lensAngle) * dist * lensFactor + px * (1 - dist / Math.max(W, H));
      const ly = BH.y + Math.sin(lensAngle) * dist * lensFactor + py * (1 - dist / Math.max(W, H));
      const twinkle = 0.4 + 0.6 * Math.sin(frame * s.twinkleSpeed + s.twinklePhase);
      const [r, g, b] = s.color;
      ctx.beginPath();
      ctx.arc(lx, ly, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${s.a * twinkle * lensFactor})`;
      ctx.fill();
      if (s.r > 0.9 && twinkle > 0.7) {
        const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, s.r * 6);
        glow.addColorStop(0, `rgba(${r},${g},${b},${0.15 * twinkle * lensFactor})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(lx, ly, s.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    });

    // Accretion disk
    diskParticles.forEach(p => {
      p.angle += p.speed;
      const wobble = Math.sin(frame * p.decay + p.phase) * 0.08;
      const tilt = 0.28 + wobble;
      const bpx = BH.x + Math.cos(p.angle) * p.dist;
      const bpy = BH.y + Math.sin(p.angle) * p.dist * tilt;
      const distFromBH = p.dist / BH.radius;
      const brightness = Math.max(0, 1.0 - (distFromBH - 1.15) / 2.8);
      const twinkle = 0.6 + 0.4 * Math.sin(frame * 0.04 + p.phase);
      const alpha = p.a * brightness * twinkle;
      if (alpha < 0.01) return;
      const dopplerShift = Math.cos(p.angle) * 30;
      const h = p.hue + dopplerShift;
      ctx.beginPath();
      ctx.arc(bpx, bpy, p.r * brightness, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${h},80%,${60 + brightness * 30}%,${alpha})`;
      ctx.fill();
      if (p.dist < BH.radius * 1.8) {
        const g = ctx.createRadialGradient(bpx, bpy, 0, bpx, bpy, p.r * 4);
        g.addColorStop(0, `hsla(${h},90%,85%,${alpha * 0.5})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(bpx, bpy, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });

    // Broad disk haze
    const diskGrad = ctx.createRadialGradient(BH.x, BH.y, BH.radius * 1.1, BH.x, BH.y, BH.radius * 4);
    diskGrad.addColorStop(0, 'rgba(100,160,255,0.06)');
    diskGrad.addColorStop(0.35, 'rgba(78,200,195,0.04)');
    diskGrad.addColorStop(0.7, 'rgba(149,172,255,0.02)');
    diskGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.translate(BH.x, BH.y);
    ctx.scale(1, 0.3);
    ctx.translate(-BH.x, -BH.y);
    ctx.beginPath();
    ctx.arc(BH.x, BH.y, BH.radius * 4, 0, Math.PI * 2);
    ctx.fillStyle = diskGrad;
    ctx.fill();
    ctx.restore();

    // Photon ring
    lensRing.forEach(p => {
      p.angle += p.speed;
      const wobble = Math.sin(frame * 0.008 + p.phase) * 0.05;
      const lensR = BH.radius * (1.0 + wobble);
      const bpx = BH.x + Math.cos(p.angle) * lensR;
      const bpy = BH.y + Math.sin(p.angle) * lensR * 0.32;
      const brightnessAngle = (Math.cos(p.angle) + 1) / 2;
      const alpha = p.a * brightnessAngle * (0.5 + 0.5 * Math.sin(frame * 0.02 + p.phase));
      ctx.beginPath();
      ctx.arc(bpx, bpy, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,235,255,${alpha})`;
      ctx.fill();
    });

    // Jets
    jets.forEach((j, i) => {
      j.dist -= j.speed;
      j.trail.push({ x: BH.x + Math.cos(j.angle) * j.dist, y: BH.y + Math.sin(j.angle) * j.dist });
      if (j.trail.length > 22) j.trail.shift();
      j.trail.forEach((pt, ti) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, j.r * (ti / j.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${j.hue},80%,75%,${(ti / j.trail.length) * j.a * 0.7})`;
        ctx.fill();
      });
      if (j.dist < BH.radius * 1.05) spawnJet(i);
    });

    // Event horizon void
    const shadow = ctx.createRadialGradient(BH.x, BH.y, 0, BH.x, BH.y, BH.radius * 1.02);
    shadow.addColorStop(0, 'rgba(0,0,0,1)');
    shadow.addColorStop(0.88, 'rgba(0,0,0,1)');
    shadow.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.beginPath();
    ctx.arc(BH.x, BH.y, BH.radius, 0, Math.PI * 2);
    ctx.fillStyle = shadow;
    ctx.fill();

    // Photon edge pulse
    const edgePulse = 0.5 + 0.5 * Math.sin(frame * 0.015);
    const edgeGrad = ctx.createRadialGradient(BH.x, BH.y, BH.radius * 0.92, BH.x, BH.y, BH.radius * 1.08);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(0.5, `rgba(255,200,120,${0.08 + edgePulse * 0.05})`);
    edgeGrad.addColorStop(0.75, `rgba(200,230,255,${0.06 + edgePulse * 0.04})`);
    edgeGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(BH.x, BH.y, BH.radius * 1.08, 0, Math.PI * 2);
    ctx.fillStyle = edgeGrad;
    ctx.fill();

    // Re-stamp void center
    ctx.beginPath();
    ctx.arc(BH.x, BH.y, BH.radius * 0.96, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fill();

    // Gravitational lensing rings
    for (let ri = 0; ri < 3; ri++) {
      const ringR = BH.radius * (1.12 + ri * 0.14);
      const alpha = (0.04 - ri * 0.01) * (0.7 + 0.3 * Math.sin(frame * 0.009 + ri));
      ctx.save();
      ctx.translate(BH.x, BH.y);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(149,172,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }

    // Vignette
    const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawFrame);
  }
  drawFrame();
})();


/* ═══════════════════════════════════════════
   WORMHOLE TUNNEL (Showreel section)
   ═══════════════════════════════════════════ */
(function initWormhole() {
  const reel = document.getElementById('showreel');
  if (!reel) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.55;z-index:0;';
  reel.style.position = 'relative';
  reel.style.overflow = 'hidden';
  reel.insertBefore(canvas, reel.firstChild);

  function resize() { canvas.width = reel.offsetWidth; canvas.height = reel.offsetHeight; }
  resize();

  const ctx = canvas.getContext('2d');
  let frame = 0;
  let active = false;

  new IntersectionObserver(e => { active = e[0].isIntersecting; }, { threshold: 0.1 }).observe(reel);

  function draw() {
    if (!active) { requestAnimationFrame(draw); return; }
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const maxR = Math.max(canvas.width, canvas.height) * 0.55;
    const speed = frame * 0.008;

    // Tunnel rings
    for (let i = 0; i < 48; i++) {
      const t = ((i / 48) + speed * 0.35) % 1;
      const r = Math.pow(t, 1.6) * maxR;
      const alpha = (1 - t) * 0.18 * Math.sin(t * Math.PI);
      const hue = 220 + t * 40 + Math.sin(frame * 0.01 + i) * 20;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.38, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue},70%,65%,${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Radial streams
    for (let s = 0; s < 45; s++) {
      const angle = (s / 45) * Math.PI * 2 + speed * 0.12;
      const phase = ((s / 45) + speed * 0.28) % 1;
      const r0 = Math.pow(phase, 2) * maxR * 0.1;
      const r1 = Math.pow(phase, 1.4) * maxR;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0 * 0.38);
      ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1 * 0.38);
      ctx.strokeStyle = `hsla(${200 + phase * 60},60%,70%,${(1 - phase) * 0.06})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Central core glow
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.25);
    cg.addColorStop(0, 'rgba(140,180,255,0.12)');
    cg.addColorStop(0.4, 'rgba(78,200,195,0.05)');
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.ellipse(cx, cy, maxR * 0.25, maxR * 0.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = cg;
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════
   PARALLAX DEEP SPACE DUST (fixed overlay)
   ═══════════════════════════════════════════ */
(function initParallaxDust() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.3;';
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const dust = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 80 + 30,
    hue: 200 + Math.random() * 80,
    a: Math.random() * 0.06 + 0.01,
    driftX: (Math.random() - 0.5) * 0.08,
    driftY: (Math.random() - 0.5) * 0.05,
    depth: Math.random() * 0.015 + 0.003,
  }));

  let mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const ox = mx - W / 2, oy = my - H / 2;
    dust.forEach(d => {
      d.x += d.driftX;
      d.y += d.driftY;
      if (d.x < -d.r) d.x = W + d.r;
      if (d.x > W + d.r) d.x = -d.r;
      if (d.y < -d.r) d.y = H + d.r;
      if (d.y > H + d.r) d.y = -d.r;
      const px = d.x - ox * d.depth, py = d.y - oy * d.depth;
      const g = ctx.createRadialGradient(px, py, 0, px, py, d.r);
      g.addColorStop(0, `hsla(${d.hue},60%,70%,${d.a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, d.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════
   HERO PARALLAX ON SCROLL
   ═══════════════════════════════════════════ */
(function initHeroParallax() {
  const content = document.querySelector('#hero .hero-content');
  const glow = document.querySelector('#hero .hero-glow');
  if (!content) return;
  window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    content.style.transform = `translateY(${progress * 60}px)`;
    content.style.opacity = String(Math.max(0, 1 - progress * 1.4));
    if (glow) glow.style.transform = `translate(-50%,-50%) scale(${1 + progress * 0.3})`;
  }, { passive: true });
})();


/* ═══════════════════════════════════════════
   CINEMATIC CURSOR
   ═══════════════════════════════════════════ */
(function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function animRing() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .work-item, .service-item, .social-link, .play-btn, .submit-btn, .strength-stat').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });
})();


/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
})();


/* ═══════════════════════════════════════════
   MOBILE NAV
   ═══════════════════════════════════════════ */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    const s = toggle.querySelectorAll('span');
    s[0].style.transform = open ? 'translateY(6px) rotate(45deg)' : '';
    s[1].style.transform = open ? 'translateY(-6px) rotate(-45deg)' : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  }));
})();


/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ═══════════════════════════════════════════
   ACCENT COLOR
   ═══════════════════════════════════════════ */
(function initAccentShift() {
  const root = document.documentElement;
  const sections = [
    { id: 'hero',            accent: '#95acff' },
    { id: 'work',            accent: '#a0b8ff' },
    { id: 'showreel',        accent: '#4ee6c3' },
    { id: 'services',        accent: '#95acff' },
    { id: 'process',         accent: '#6ee0c8' },
    { id: 'studio-strength', accent: '#b0c0ff' },
    { id: 'founder',         accent: '#80d8c0' },
    { id: 'about',           accent: '#95acff' },
    { id: 'contributors',    accent: '#6ecfb8' },
    { id: 'social',          accent: '#a8b8ff' },
    { id: 'contact',         accent: '#4ee6c3' },
  ];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const m = sections.find(s => s.id === e.target.id);
        if (m) root.style.setProperty('--accent', m.accent);
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
})();


/* ═══════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });
})();


/* ═══════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const project = form.querySelector('#project').value.trim();
    if (!name || !email || !project) {
      btn.textContent = 'Please fill all fields.';
      setTimeout(() => { btn.innerHTML = 'Send Brief <span>→</span>'; }, 2500);
      return;
    }
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Brief received. ✓'; form.reset();
      setTimeout(() => { btn.innerHTML = 'Send Brief <span>→</span>'; btn.disabled = false; }, 3500);
    }, 1200);
  });
})();


/* ═══════════════════════════════════════════
   CHATBOT
   ═══════════════════════════════════════════ */
(function initChatbot() {
  const trigger = document.getElementById('chatbotTrigger');
  const panel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');
  if (!trigger || !panel) return;

  const responses = {
    default: "That's a great question. The best way to get a real answer is to drop us a brief — we'll come back to you within 24 hours.",
    services: "We cover strategy, social, content, video, copy, analytics, branding, and creatives. Essentially, everything from the idea to the platform.",
    pricing: "Every project is different, so pricing depends on scope. Share what you're building and we'll give you an honest number.",
    timeline: "Most projects move fast — we're built for speed without cutting corners. Timelines depend on scope, but we'll be upfront from day one.",
    contact: "You can reach us via the contact form on this page, or message us directly on WhatsApp. We reply fast.",
    work: "We've worked with Hyundai, EV brands, and built identity systems and social campaigns across verticals. Take a look at the Work section.",
    founder: "Squargraph is led by Saurabh Sohan Singh — 8+ years in campaigns, PR, and social strategy across India's top brands.",
    hello: "Hey — good to have you here. What are you working on?",
  };

  function matchResponse(text) {
    const t = text.toLowerCase();
    if (/\b(hi|hello|hey|yo)\b/.test(t)) return responses.hello;
    if (/service|offer|do you|what do/.test(t)) return responses.services;
    if (/price|cost|budget|how much|rate/.test(t)) return responses.pricing;
    if (/time|timeline|how long|deadline/.test(t)) return responses.timeline;
    if (/contact|reach|email|talk|speak/.test(t)) return responses.contact;
    if (/work|portfolio|case|client|project/.test(t)) return responses.work;
    if (/founder|saurabh|who|team|studio/.test(t)) return responses.founder;
    return responses.default;
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    const p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const val = input.value.trim();
    if (!val) return;
    addMessage(val, 'user'); input.value = '';
    setTimeout(() => addMessage(matchResponse(val), 'bot'), 600);
  }

  trigger.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) setTimeout(() => input.focus(), 300);
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
})();


/* ═══════════════════════════════════════════
   PLAY BUTTON
   ═══════════════════════════════════════════ */
(function initPlayButton() {
  const btn = document.getElementById('playBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const caption = document.querySelector('.reel-caption');
    if (caption) { caption.textContent = 'Reel coming soon — stay tuned.'; caption.style.color = 'rgba(149,172,255,0.7)'; }
  });
})();


/* ═══════════════════════════════════════════
   HERO ENTRANCE
   ═══════════════════════════════════════════ */
(function initHeroReveal() {
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 600 + i * 260);
  });
})();
