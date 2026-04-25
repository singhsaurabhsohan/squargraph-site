/* =========================================
   SQUARGRAPH STUDIOS — script.js
   Interstellar Black Hole + Claude AI Chat
   ========================================= */

'use strict';

/* ═══════════════════════════════════════════════════════════
   PHYSICALLY ACCURATE INTERSTELLAR BLACK HOLE
   Based on: gravitational lensing, relativistic doppler
   beaming, thermal accretion disk, photon sphere, Penrose
   process light bending — rendered on WebGL-style canvas 2D
   ═══════════════════════════════════════════════════════════ */
(function initBlackHole() {
  const container = document.getElementById('starField');
  if (!container) return;

  const W = window.innerWidth;
  const H = window.innerHeight;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // ── Physical parameters (Kerr-like geometry approximation)
  const BHX = W * 0.60, BHY = H * 0.50;
  const RS = Math.min(W, H) * 0.082; // Schwarzschild radius equivalent
  const PHOTON_SPHERE = RS * 1.5;    // photon sphere at 1.5x Schwarzschild
  const ISCO = RS * 3.0;             // innermost stable circular orbit

  // ── 1. FAR STAR FIELD — gravitationally lensed
  const STAR_COUNT = 400;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    // Distribute stars in rings avoiding event horizon
    const angle = Math.random() * Math.PI * 2;
    const rawDist = RS * 2.5 + Math.random() * Math.max(W, H) * 0.9;
    const [r, g, b] = pickStarColor();
    stars.push({
      angle, dist: rawDist,
      // Store Cartesian for lensing calculations
      ox: BHX + Math.cos(angle) * rawDist,
      oy: BHY + Math.sin(angle) * rawDist,
      size: Math.pow(Math.random(), 3) * 1.8 + 0.15,
      brightness: Math.random() * 0.7 + 0.3,
      twinkleFreq: Math.random() * 0.025 + 0.004,
      twinklePhase: Math.random() * Math.PI * 2,
      r, g, b,
    });
  }
  function pickStarColor() {
    const t = Math.random();
    if (t < 0.55) return [210, 225, 255]; // blue-white O/B
    if (t < 0.72) return [255, 248, 220]; // yellow-white F/G
    if (t < 0.85) return [255, 220, 170]; // orange K
    if (t < 0.94) return [200, 220, 255]; // blue A
    return [255, 190, 140];               // red M giant
  }

  // ── 2. ACCRETION DISK — thermal + relativistic beaming
  // Real Interstellar disk: hot inner, cooler outer, doppler blueshift on approach
  const DISK_INNER = ISCO;
  const DISK_OUTER = RS * 7.5;
  const DISK_TILT = 0.22; // relativistic disk tilt (line-of-sight)
  const NUM_DISK = 3200;   // high fidelity particle count
  const diskParticles = [];
  for (let i = 0; i < NUM_DISK; i++) {
    // Power-law radial distribution: denser toward ISCO
    const u = Math.pow(Math.random(), 1.8);
    const r = DISK_INNER + u * (DISK_OUTER - DISK_INNER);
    const angle = Math.random() * Math.PI * 2;

    // Keplerian angular velocity: ω ∝ r^(-3/2)
    const omega = 0.00055 * Math.pow(DISK_INNER / r, 1.5);

    // Temperature: T ∝ r^(-3/4) for standard thin disk (Shakura-Sunyaev)
    const tempFraction = Math.pow(DISK_INNER / r, 0.75);

    // Thermal color: inner=blue-white (>10k K), outer=orange-red (<3k K)
    const [cr, cg, cb] = diskThermalColor(tempFraction);

    diskParticles.push({
      r, angle, omega,
      tempFraction,
      cr, cg, cb,
      opacity: (0.5 + Math.random() * 0.5) * Math.pow(tempFraction, 0.3),
      size: 0.4 + Math.random() * (0.3 + tempFraction * 1.4),
      phase: Math.random() * Math.PI * 2,
    });
  }

  function diskThermalColor(t) {
    // t=1 → inner edge (hottest, blue-white ~50k K)
    // t=0 → outer edge (cooler, orange ~3k K)
    if (t > 0.85) return [200, 230, 255]; // hot blue-white core
    if (t > 0.65) return [255, 248, 220]; // yellow-white
    if (t > 0.45) return [255, 220, 150]; // orange-yellow
    if (t > 0.25) return [255, 180, 80];  // deep orange
    return [220, 120, 50];               // outer cool red-orange
  }

  // ── 3. PHOTON RING — light trapped at 1.5 RS
  // In Interstellar, this appears as a thin bright ring around the shadow
  const NUM_PHOTONS = 800;
  const photonRing = [];
  for (let i = 0; i < NUM_PHOTONS; i++) {
    const angle = (i / NUM_PHOTONS) * Math.PI * 2;
    photonRing.push({
      angle,
      speed: 0.0008 + Math.random() * 0.0004,
      brightness: Math.pow(Math.random(), 0.5),
      phase: Math.random() * Math.PI * 2,
      jitter: (Math.random() - 0.5) * 0.025,
    });
  }

  // ── 4. LENSED DISK ARC — the "Christmas ornament" top arc from Interstellar
  // Light from the disk bends around the top/bottom appearing as a secondary arc
  const LENS_ARC_COUNT = 600;
  const lensedArc = [];
  for (let i = 0; i < LENS_ARC_COUNT; i++) {
    // Arc spans mostly top of the black hole
    const arcAngle = -Math.PI * 0.85 + (i / LENS_ARC_COUNT) * Math.PI * 1.7;
    const arcR = PHOTON_SPHERE * (1.02 + Math.random() * 0.18);
    const t = Math.abs(Math.sin(arcAngle)) * (0.5 + Math.random() * 0.5);
    const [cr, cg, cb] = diskThermalColor(0.5 + t * 0.5);
    lensedArc.push({
      angle: arcAngle,
      r: arcR,
      cr, cg, cb,
      brightness: t * 0.7,
      size: 0.3 + t * 0.8,
    });
  }

  // ── 5. NEBULA / INTERSTELLAR MEDIUM
  const nebulae = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = RS * 3 + Math.random() * Math.min(W, H) * 0.4;
    nebulae.push({
      x: BHX + Math.cos(angle) * dist,
      y: BHY + Math.sin(angle) * dist,
      rX: 60 + Math.random() * 180,
      rY: 30 + Math.random() * 100,
      rot: Math.random() * Math.PI * 2,
      hue: 195 + Math.random() * 70,
      alpha: 0.012 + Math.random() * 0.025,
    });
  }

  // ── Mouse parallax
  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  let frame = 0;

  // Gravitational lensing deflection (post-Newtonian approximation)
  function lensingDeflect(sx, sy) {
    const dx = sx - BHX, dy = sy - BHY;
    const d2 = dx * dx + dy * dy;
    const d = Math.sqrt(d2);
    if (d < RS * 2) return null; // inside shadow — not visible

    // Deflection angle: α = 2RS / d (weak field) boosted near photon sphere
    const alpha = (RS * RS * 2.2) / d2;
    const factor = Math.max(0.001, 1 - alpha * 4);

    // Lensed position
    const lx = BHX + dx * factor;
    const ly = BHY + dy * factor;

    // Amplification: μ ≈ (RS/(2d))^2 correction
    const amplification = Math.min(2.5, 1 + (RS * 0.8) / d);
    return { lx, ly, amplification, d };
  }

  // Relativistic doppler beaming factor for disk
  // Blue-shifts approaching side, red-shifts receding side
  function dopplerFactor(angle, r) {
    // Keplerian velocity fraction of c: v/c ≈ sqrt(RS / 2r)
    const vc = Math.sqrt(RS / (2 * r)) * 0.7;
    // cos(angle): positive = approaching
    const cosA = Math.cos(angle);
    // Beaming: I_obs = I_em / (1 - β·cosA)^3 approximated
    const beta = vc;
    const doppler = Math.pow(1 / Math.max(0.1, 1 - beta * cosA), 3);
    return Math.min(doppler, 6.0);
  }

  function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    const px = (mouseX - W / 2) * 0.008;
    const py = (mouseY - H / 2) * 0.008;

    // ── Deep space background gradient
    const bg = ctx.createRadialGradient(BHX, BHY, 0, BHX, BHY, Math.max(W, H));
    bg.addColorStop(0, 'rgba(2,3,8,0)');
    bg.addColorStop(0.5, 'rgba(4,6,14,0.5)');
    bg.addColorStop(1, 'rgba(1,2,5,0.9)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── Nebula clouds (deep parallax)
    nebulae.forEach(n => {
      ctx.save();
      ctx.translate(n.x + px * 0.2, n.y + py * 0.2);
      ctx.rotate(n.rot);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.rX, n.rY));
      g.addColorStop(0, `hsla(${n.hue},55%,65%,${n.alpha * 2})`);
      g.addColorStop(0.5, `hsla(${n.hue},45%,45%,${n.alpha})`);
      g.addColorStop(1, 'hsla(0,0%,0%,0)');
      ctx.scale(n.rX / Math.max(n.rX, n.rY), n.rY / Math.max(n.rX, n.rY));
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(n.rX, n.rY), 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    });

    // ── Gravitationally lensed stars
    stars.forEach(s => {
      const result = lensingDeflect(s.ox + px, s.oy + py);
      if (!result) return;
      const { lx, ly, amplification, d } = result;

      // Lensing makes stars near the BH appear brighter + slightly blue-shifted
      const lensBrightness = Math.min(1, amplification * 0.5);
      const twinkle = 0.35 + 0.65 * Math.sin(frame * s.twinkleFreq + s.twinklePhase);
      const finalAlpha = s.brightness * twinkle * lensBrightness;
      if (finalAlpha < 0.02) return;

      // Stars very close to photon sphere appear as arcs (simplified as elongated dots)
      const proximityFactor = Math.max(0, 1 - ISCO / d);
      const drawSize = s.size * (1 + (1 - proximityFactor) * 0.5);

      ctx.beginPath();
      ctx.arc(lx, ly, drawSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${finalAlpha})`;
      ctx.fill();

      // Diffraction spike on bright stars
      if (s.size > 1.0 && twinkle > 0.75 && finalAlpha > 0.5) {
        const spikeLen = drawSize * 5 * twinkle;
        const spikeAlpha = finalAlpha * 0.3;
        ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},${spikeAlpha})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(lx - spikeLen, ly); ctx.lineTo(lx + spikeLen, ly);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx, ly - spikeLen); ctx.lineTo(lx, ly + spikeLen);
        ctx.stroke();
      }
    });

    // ── Accretion disk — BELOW event horizon shadow layer
    // Sort: render back-of-disk first (top in screen coords due to tilt)
    // We split into back half (approaching from above) and front half
    const sortedDisk = [...diskParticles].sort((a, b) => {
      // particles at sin(angle) > 0 are behind the BH (render first)
      return Math.sin(b.angle) - Math.sin(a.angle);
    });

    sortedDisk.forEach(p => {
      // Advance orbit: Keplerian
      p.angle += p.omega;

      const diskX = BHX + Math.cos(p.angle) * p.r;
      const diskY = BHY + Math.sin(p.angle) * p.r * DISK_TILT;

      // Skip if behind event horizon shadow (crude shadow mask)
      const shadowDX = diskX - BHX, shadowDY = diskY - BHY;
      if (Math.sqrt(shadowDX*shadowDX + shadowDY*shadowDY) < RS * 0.88) return;

      // Relativistic doppler beaming — bright blue-white approaching, dim red receding
      const beaming = dopplerFactor(p.angle, p.r);
      const baseAlpha = p.opacity * Math.min(beaming, 3) / 3;

      // Doppler color shift: boost blue on approach, boost red on recession
      const cosA = Math.cos(p.angle);
      const blueBoost = Math.max(0, cosA);
      const redBoost = Math.max(0, -cosA);
      const dr = Math.min(255, p.cr + redBoost * 60);
      const dg = p.cg;
      const db = Math.min(255, p.cb + blueBoost * 50);

      // Brightness falloff toward outer edge
      const radialFade = 1 - (p.r - DISK_INNER) / (DISK_OUTER - DISK_INNER) * 0.6;
      const finalAlpha = baseAlpha * radialFade * Math.min(beaming * 0.7, 1.5);

      if (finalAlpha < 0.015) return;

      ctx.beginPath();
      ctx.arc(diskX, diskY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dr},${dg},${db},${Math.min(finalAlpha, 0.95)})`;
      ctx.fill();

      // Inner disk hot glow particles
      if (p.r < ISCO * 1.4 && beaming > 1.2) {
        const glowR = p.size * 3.5;
        const g = ctx.createRadialGradient(diskX, diskY, 0, diskX, diskY, glowR);
        g.addColorStop(0, `rgba(${dr},${dg},${db},${finalAlpha * 0.6})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(diskX, diskY, glowR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    });

    // ── Disk broad thermal glow (orange haze close in, fades out)
    {
      const haze = ctx.createRadialGradient(BHX, BHY, DISK_INNER * 0.9, BHX, BHY, DISK_OUTER * 0.85);
      haze.addColorStop(0, 'rgba(255, 180, 60, 0.055)');
      haze.addColorStop(0.3, 'rgba(255, 140, 30, 0.04)');
      haze.addColorStop(0.65, 'rgba(255, 100, 20, 0.02)');
      haze.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.translate(BHX, BHY);
      ctx.scale(1, DISK_TILT * 1.1);
      ctx.translate(-BHX, -BHY);
      ctx.beginPath();
      ctx.arc(BHX, BHY, DISK_OUTER * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = haze;
      ctx.fill();
      ctx.restore();
    }

    // ── Lensed disk arc — the Interstellar "top arc"
    // This is disk light bent 180° over the north pole of the BH
    lensedArc.forEach(p => {
      const arcX = BHX + Math.cos(p.angle) * p.r;
      const arcY = BHY + Math.sin(p.angle) * p.r * 0.38;
      // Only render the top arc (above BH center)
      if (arcY > BHY + RS * 0.1) return;
      const alpha = p.brightness * 0.55;
      ctx.beginPath();
      ctx.arc(arcX, arcY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${alpha})`;
      ctx.fill();
    });

    // ── Photon sphere ring — razor-thin bright ring at 1.5 RS
    {
      // In Interstellar, this is the bright crescent / ring right at edge of shadow
      const t = frame * 0.001;
      photonRing.forEach(p => {
        p.angle += p.speed;
        const ringR = PHOTON_SPHERE * (1 + p.jitter);
        const px2 = BHX + Math.cos(p.angle) * ringR;
        const py2 = BHY + Math.sin(p.angle) * ringR * 0.35;

        // Brightness peaks on the approaching side (bottom — doppler beaming)
        const beamAngle = Math.cos(p.angle + Math.PI * 0.6);
        const brightness = p.brightness * (0.3 + 0.7 * Math.max(0, beamAngle));
        const flicker = 0.7 + 0.3 * Math.sin(frame * 0.03 + p.phase);

        ctx.beginPath();
        ctx.arc(px2, py2, 0.5 + brightness * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 210, ${brightness * flicker * 0.7})`;
        ctx.fill();
      });

      // Photon sphere glow band
      const photonGlow = ctx.createRadialGradient(BHX, BHY, PHOTON_SPHERE * 0.85, BHX, BHY, PHOTON_SPHERE * 1.2);
      photonGlow.addColorStop(0, 'rgba(0,0,0,0)');
      photonGlow.addColorStop(0.4, 'rgba(255,230,180,0.07)');
      photonGlow.addColorStop(0.7, 'rgba(255,210,140,0.04)');
      photonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.translate(BHX, BHY);
      ctx.scale(1, 0.35);
      ctx.translate(-BHX, -BHY);
      ctx.beginPath();
      ctx.arc(BHX, BHY, PHOTON_SPHERE * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = photonGlow;
      ctx.fill();
      ctx.restore();
    }

    // ── EVENT HORIZON — the shadow (pure void)
    // Perfectly black, slightly oblate due to spin (Kerr metric)
    {
      // Shadow is larger than RS due to photon capture: R_shadow = 3√3/2 × RS ≈ 2.6 RS
      const shadowR = RS * 1.0; // visual shadow (photon sphere appears at edge)

      // Outer gravitational redshift halo — very subtle reddish glow just outside shadow
      const redshiftHalo = ctx.createRadialGradient(BHX, BHY, shadowR * 0.9, BHX, BHY, shadowR * 1.5);
      redshiftHalo.addColorStop(0, 'rgba(60,20,0,0.0)');
      redshiftHalo.addColorStop(0.3, 'rgba(40,15,0,0.04)');
      redshiftHalo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(BHX, BHY, shadowR * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = redshiftHalo;
      ctx.fill();

      // The shadow itself: perfectly black
      ctx.beginPath();
      ctx.arc(BHX, BHY, shadowR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fill();

      // Extremely thin photon ring edge at shadow boundary
      // In Interstellar, this is the razor bright crescent at bottom
      const breathe = 0.5 + 0.5 * Math.sin(frame * 0.012);
      const ringEdge = ctx.createRadialGradient(BHX, BHY + shadowR * 0.15, shadowR * 0.88, BHX, BHY + shadowR * 0.15, shadowR * 1.12);
      ringEdge.addColorStop(0, 'rgba(0,0,0,0)');
      ringEdge.addColorStop(0.45, `rgba(255,220,150,${0.12 + breathe * 0.08})`);
      ringEdge.addColorStop(0.6, `rgba(255,200,100,${0.08 + breathe * 0.05})`);
      ringEdge.addColorStop(0.8, `rgba(200,230,255,${0.04 + breathe * 0.02})`);
      ringEdge.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(BHX, BHY, shadowR * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = ringEdge;
      ctx.fill();

      // Re-stamp the hard black void
      ctx.beginPath();
      ctx.arc(BHX, BHY, shadowR * 0.97, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fill();
    }

    // ── Cosmic dust filaments (very subtle)
    {
      const time = frame * 0.003;
      ctx.save();
      ctx.globalAlpha = 0.018;
      ctx.strokeStyle = 'rgba(200,220,255,1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        const a0 = (i / 8) * Math.PI * 2 + time;
        const r0 = RS * 4, r1 = RS * 8;
        ctx.beginPath();
        ctx.moveTo(BHX + Math.cos(a0) * r0, BHY + Math.sin(a0) * r0 * 0.3);
        ctx.quadraticCurveTo(
          BHX + Math.cos(a0 + 0.3) * (r0 + r1) * 0.5,
          BHY + Math.sin(a0 + 0.3) * (r0 + r1) * 0.5 * 0.3,
          BHX + Math.cos(a0 + 0.5) * r1,
          BHY + Math.sin(a0 + 0.5) * r1 * 0.28
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Cinematic vignette
    const vig = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H * 0.9);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.72)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ═══════════════════════════════════════════
   WORMHOLE (Showreel section)
   ═══════════════════════════════════════════ */
(function initWormhole() {
  const reel = document.getElementById('showreel');
  if (!reel) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.5;z-index:0;';
  reel.style.position = 'relative';
  reel.style.overflow = 'hidden';
  reel.insertBefore(canvas, reel.firstChild);
  function resize() { canvas.width = reel.offsetWidth; canvas.height = reel.offsetHeight; }
  resize();
  const ctx = canvas.getContext('2d');
  let frame = 0, active = false;
  new IntersectionObserver(e => { active = e[0].isIntersecting; }, { threshold: 0.1 }).observe(reel);
  function draw() {
    if (!active) { requestAnimationFrame(draw); return; }
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const maxR = Math.max(canvas.width, canvas.height) * 0.55;
    const speed = frame * 0.008;
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
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.25);
    cg.addColorStop(0, 'rgba(140,180,255,0.1)');
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
   PARALLAX DUST
   ═══════════════════════════════════════════ */
(function initParallaxDust() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.28;';
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const dust = Array.from({length: 50}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 80 + 30, hue: 200 + Math.random() * 80,
    a: Math.random() * 0.05 + 0.01,
    driftX: (Math.random() - 0.5) * 0.07,
    driftY: (Math.random() - 0.5) * 0.04,
    depth: Math.random() * 0.012 + 0.002,
  }));
  let mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const ox = mx - W / 2, oy = my - H / 2;
    dust.forEach(d => {
      d.x += d.driftX; d.y += d.driftY;
      if (d.x < -d.r) d.x = W + d.r; if (d.x > W + d.r) d.x = -d.r;
      if (d.y < -d.r) d.y = H + d.r; if (d.y > H + d.r) d.y = -d.r;
      const px = d.x - ox * d.depth, py = d.y - oy * d.depth;
      const g = ctx.createRadialGradient(px, py, 0, px, py, d.r);
      g.addColorStop(0, `hsla(${d.hue},60%,70%,${d.a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(px, py, d.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════
   HERO SCROLL PARALLAX
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
   CLAUDE AI CHATBOT INTEGRATION
   ═══════════════════════════════════════════ */
(function initChatbot() {
  const trigger = document.getElementById('chatbotTrigger');
  const panel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messagesEl = document.getElementById('chatMessages');
  const typingEl = document.getElementById('chatTyping');
  if (!trigger || !panel) return;

  const SYSTEM_PROMPT = `You are the AI assistant for Squargraph Studios, a premium creative and social-first studio based in New Delhi, India. You are sharp, confident, and speak with clarity — no fluff.

Studio info:
- Founded by Saurabh Sohan Singh (8+ years experience in campaigns, social, PR)
- Services: Strategy, Content, Social, Creatives, Video, Copy, Analytics, Branding
- Clients include: Hyundai India, EV brands, and social-first campaigns across verticals
- Process: Discover → Strategy → Execute → Scale
- Instagram: @squargraph | LinkedIn: squargraph | YouTube: squargraph

Your role: Help visitors understand what Squargraph does, answer questions about services, pricing approach, the founder, and guide them toward starting a project. Be concise — 2-3 sentences max per reply unless asked for more detail. Never make up specific pricing numbers. Sound human, not corporate.`;

  const conversationHistory = [];

  async function callClaudeAPI(userMessage) {
    conversationHistory.push({ role: 'user', content: userMessage });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    const reply = data.content?.[0]?.text || "I couldn't get a response. Try again in a moment.";
    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    const p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping(show) {
    if (typingEl) typingEl.style.display = show ? 'flex' : 'none';
    if (show) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const val = input.value.trim();
    if (!val) return;

    addMessage(val, 'user');
    input.value = '';
    sendBtn.disabled = true;
    input.disabled = true;
    showTyping(true);

    try {
      const reply = await callClaudeAPI(val);
      showTyping(false);
      addMessage(reply, 'bot');
    } catch (err) {
      showTyping(false);
      addMessage("Something went wrong on our end. Please try again or reach us directly via the contact form.", 'bot');
      console.error('Claude API error:', err);
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  trigger.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) setTimeout(() => input.focus(), 300);
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); });
})();


/* ═══════════════════════════════════════════
   CINEMATIC CURSOR
   ═══════════════════════════════════════════ */
(function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);
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
    { id: 'hero', accent: '#95acff' }, { id: 'work', accent: '#a0b8ff' },
    { id: 'showreel', accent: '#4ee6c3' }, { id: 'services', accent: '#95acff' },
    { id: 'process', accent: '#6ee0c8' }, { id: 'studio-strength', accent: '#b0c0ff' },
    { id: 'founder', accent: '#80d8c0' }, { id: 'about', accent: '#95acff' },
    { id: 'contributors', accent: '#6ecfb8' }, { id: 'contact', accent: '#4ee6c3' },
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
   SOCIAL DOCK REVEAL
   ═══════════════════════════════════════════ */
(function initSocialDock() {
  const dock = document.getElementById('socialDock');
  if (!dock) return;
  window.addEventListener('scroll', () => {
    dock.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  }, { passive: true });
})();


/* ═══════════════════════════════════════════
   HERO ENTRANCE
   ═══════════════════════════════════════════ */
(function initHeroReveal() {
  document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 600 + i * 260);
  });
})();
