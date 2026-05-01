import { useState, useEffect, useRef } from "react";

// ─── UTILS ───────────────────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #080808;
      --surface: #101010;
      --border: rgba(255,255,255,0.07);
      --text: #f0ede8;
      --muted: rgba(240,237,232,0.45);
      --accent: #c8ff00;
      --accent2: #ff6b35;
      --glow: rgba(200,255,0,0.18);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
      overflow-x: hidden;
      cursor: none;
    }

    h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }

    /* Custom cursor */
    .cursor {
      width: 12px; height: 12px;
      background: var(--accent);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease, width 0.2s ease, height 0.2s ease;
      mix-blend-mode: difference;
    }
    .cursor-ring {
      width: 36px; height: 36px;
      border: 1px solid rgba(200,255,0,0.4);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transition: all 0.25s ease;
      mix-blend-mode: difference;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    /* Noise overlay */
    .noise::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      opacity: 0.25;
      pointer-events: none;
      z-index: 1000;
    }

    /* Header */
    .header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 500;
      padding: 20px 48px;
      display: flex; align-items: center; justify-content: space-between;
      transition: background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease;
    }
    .header.scrolled {
      background: rgba(8,8,8,0.82);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .brand {
      display: flex; align-items: center; gap: 12px;
      text-decoration: none; color: var(--text);
    }
    .brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .nav { display: flex; gap: 32px; align-items: center; }
    .nav a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .nav a:hover { color: var(--text); }
    .nav-cta {
      background: var(--accent) !important;
      color: #080808 !important;
      padding: 8px 20px;
      border-radius: 2px;
      font-weight: 500 !important;
    }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 0 48px 80px;
      position: relative; overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 50% at 70% 40%, rgba(200,255,0,0.07) 0%, transparent 70%),
                  radial-gradient(ellipse 40% 60% at 20% 80%, rgba(255,107,53,0.05) 0%, transparent 60%),
                  var(--bg);
    }
    .hero-grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
    }
    .hero-orb {
      position: absolute; top: 15%; right: 8%;
      width: 480px; height: 480px;
      background: radial-gradient(circle, rgba(200,255,0,0.08) 0%, transparent 70%);
      border-radius: 50%;
      animation: orbFloat 8s ease-in-out infinite;
    }
    @keyframes orbFloat {
      0%,100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }
    .hero-content { position: relative; z-index: 2; max-width: 900px; }
    .hero-eyebrow {
      font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--accent); margin-bottom: 28px;
      display: flex; align-items: center; gap: 12px;
    }
    .hero-eyebrow::before {
      content: ''; display: inline-block;
      width: 32px; height: 1px; background: var(--accent);
    }
    .hero-h1 {
      font-size: clamp(3rem, 6vw, 5.5rem);
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -0.02em;
      margin-bottom: 28px;
    }
    .hero-h1 em { font-style: normal; color: var(--accent); }
    .hero-sub {
      font-size: clamp(1rem, 1.5vw, 1.15rem);
      color: var(--muted);
      max-width: 480px;
      line-height: 1.7;
      margin-bottom: 48px;
    }
    .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn-primary {
      background: var(--accent);
      color: #080808;
      padding: 14px 32px;
      border: none; border-radius: 2px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: none;
      text-decoration: none;
      transition: box-shadow 0.3s, transform 0.2s;
      display: inline-block;
    }
    .btn-primary:hover {
      box-shadow: 0 0 32px var(--glow);
      transform: translateY(-2px);
    }
    .btn-ghost {
      background: transparent;
      color: var(--text);
      padding: 14px 32px;
      border: 1px solid var(--border);
      border-radius: 2px;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: none;
      text-decoration: none;
      transition: border-color 0.3s, color 0.3s;
      display: inline-block;
    }
    .btn-ghost:hover { border-color: rgba(200,255,0,0.4); color: var(--accent); }

    /* Trust line */
    .trust {
      background: var(--surface);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 24px 48px;
      display: flex; align-items: center; justify-content: center; gap: 48px;
      overflow: hidden;
    }
    .trust-text {
      font-size: 0.78rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
      white-space: nowrap;
    }
    .trust-dot { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; opacity: 0.6; flex-shrink: 0; }

    /* Section */
    .section { padding: 120px 48px; }
    .section-label {
      font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
      color: var(--accent); margin-bottom: 20px;
      display: flex; align-items: center; gap: 10px;
    }
    .section-label::before { content: ''; display: inline-block; width: 24px; height: 1px; background: var(--accent); }
    .section-h2 {
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.05;
    }

    /* Reveal animations */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.in { opacity: 1; transform: none; }
    .reveal-d1 { transition-delay: 0.1s; }
    .reveal-d2 { transition-delay: 0.2s; }
    .reveal-d3 { transition-delay: 0.3s; }
    .reveal-d4 { transition-delay: 0.4s; }

    /* Services */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      margin-top: 64px;
    }
    .service-card {
      background: var(--surface);
      padding: 44px 36px;
      transition: background 0.3s, transform 0.3s;
      position: relative; overflow: hidden;
    }
    .service-card::after {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(200,255,0,0.06) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s;
    }
    .service-card:hover::after { opacity: 1; }
    .service-card:hover { transform: translateY(-4px); background: #141414; }
    .service-icon {
      width: 44px; height: 44px;
      margin-bottom: 28px;
      color: var(--accent);
    }
    .service-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: 0.01em;
    }
    .service-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

    /* Approach */
    .approach-flow {
      display: flex;
      gap: 0;
      margin-top: 72px;
      position: relative;
    }
    .approach-flow::before {
      content: '';
      position: absolute;
      top: 28px; left: 28px; right: 28px;
      height: 1px;
      background: linear-gradient(90deg, var(--accent) 0%, rgba(200,255,0,0.1) 100%);
    }
    .step {
      flex: 1;
      display: flex; flex-direction: column; align-items: center;
      text-align: center;
      padding: 0 16px;
      position: relative;
    }
    .step-num {
      width: 56px; height: 56px;
      border-radius: 50%;
      border: 1px solid var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 0.05em;
      background: var(--bg);
      margin-bottom: 20px;
      transition: background 0.3s, box-shadow 0.3s;
      position: relative; z-index: 1;
    }
    .step:hover .step-num { background: var(--accent); color: #080808; box-shadow: 0 0 24px var(--glow); }
    .step-label {
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: 0.04em;
    }
    .step-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.6; }

    /* Founder */
    .founder-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .founder-inner {
      display: flex; gap: 80px; align-items: center;
      max-width: 1000px;
    }
    .founder-img-wrap {
      position: relative; flex-shrink: 0;
      width: 220px; height: 280px;
    }
    .founder-img-wrap::before {
      content: '';
      position: absolute; inset: -1px;
      border: 1px solid rgba(200,255,0,0.25);
      border-radius: 4px;
      box-shadow: 0 0 40px rgba(200,255,0,0.1);
    }
    .founder-img {
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: 3px;
      filter: grayscale(20%);
    }
    .founder-fallback {
      width: 100%; height: 100%;
      border-radius: 3px;
      background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .founder-name {
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .founder-title {
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 28px;
    }
    .founder-quote {
      font-size: clamp(1rem, 1.5vw, 1.2rem);
      color: var(--muted);
      line-height: 1.7;
      font-style: italic;
    }

    /* Contact */
    .contact-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 56px;
      max-width: 700px;
    }
    .form-field {
      display: flex; flex-direction: column; gap: 8px;
    }
    .form-field.full { grid-column: 1 / -1; }
    .form-label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
    .form-input {
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 14px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 300;
      border-radius: 2px;
      outline: none;
      transition: border-color 0.3s;
      width: 100%;
    }
    .form-input:focus { border-color: rgba(200,255,0,0.4); }
    .form-input::placeholder { color: rgba(240,237,232,0.2); }

    /* Chatbot */
    .chatbot-wrap {
      position: fixed; bottom: 28px; left: 28px; z-index: 800;
      display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
    }
    .chatbot-panel {
      background: rgba(16,16,16,0.95);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 12px;
      width: 300px;
      overflow: hidden;
      transform-origin: bottom left;
      transition: all 0.3s ease;
    }
    .chatbot-header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .chatbot-title { font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.05em; }
    .chatbot-messages { padding: 16px; display: flex; flex-direction: column; gap: 10px; min-height: 80px; max-height: 180px; overflow-y: auto; }
    .chat-msg { font-size: 0.82rem; line-height: 1.5; }
    .chat-msg.bot { color: var(--muted); }
    .chat-msg.user { color: var(--accent); text-align: right; }
    .chatbot-chips {
      padding: 0 16px 12px;
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .chip {
      font-size: 0.72rem; padding: 5px 10px;
      border: 1px solid var(--border); border-radius: 20px;
      color: var(--muted); cursor: none;
      transition: border-color 0.2s, color 0.2s;
      background: transparent;
    }
    .chip:hover { border-color: var(--accent); color: var(--accent); }
    .chatbot-input-row {
      display: flex;
      border-top: 1px solid var(--border);
      padding: 10px 12px;
      gap: 8px;
    }
    .chatbot-input {
      flex: 1; background: transparent; border: none; outline: none;
      color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 300;
    }
    .chatbot-input::placeholder { color: rgba(240,237,232,0.2); }
    .chat-send {
      background: var(--accent); color: #080808;
      border: none; border-radius: 4px;
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: none; font-size: 0.8rem; font-weight: 700;
      transition: box-shadow 0.2s;
    }
    .chat-send:hover { box-shadow: 0 0 12px var(--glow); }
    .chatbot-toggle {
      width: 48px; height: 48px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: none;
      transition: border-color 0.3s, box-shadow 0.3s;
      color: var(--accent);
    }
    .chatbot-toggle:hover { border-color: var(--accent); box-shadow: 0 0 16px var(--glow); }

    /* WhatsApp */
    .wa-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 800;
      width: 52px; height: 52px;
      background: #25D366;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      text-decoration: none;
      box-shadow: 0 0 0 0 rgba(37,211,102,0.4);
      animation: waPulse 2.5s ease-in-out infinite;
    }
    @keyframes waPulse {
      0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.4); }
      70% { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
      100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
    }

    /* Footer */
    .footer {
      background: var(--bg);
      border-top: 1px solid var(--border);
      padding: 48px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 24px;
    }
    .footer-brand { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
    .footer-tagline { font-size: 0.75rem; color: var(--muted); margin-top: 4px; }
    .social-row { display: flex; gap: 16px; align-items: center; }
    .social-link { color: var(--muted); transition: color 0.2s; text-decoration: none; }
    .social-link:hover { color: var(--accent); }
    .footer-copy { font-size: 0.72rem; color: rgba(240,237,232,0.2); letter-spacing: 0.05em; width: 100%; text-align: center; margin-top: 16px; padding-top: 24px; border-top: 1px solid var(--border); }

    /* Responsive */
    @media (max-width: 768px) {
      .header { padding: 16px 24px; }
      .nav { display: none; }
      .hero { padding: 0 24px 64px; }
      .section { padding: 80px 24px; }
      .approach-flow { flex-direction: column; gap: 32px; }
      .approach-flow::before { display: none; }
      .founder-inner { flex-direction: column; gap: 40px; }
      .contact-form { grid-template-columns: 1fr; }
      .footer { padding: 32px 24px; }
      .trust { padding: 20px 24px; gap: 24px; overflow: auto; }
    }
  `}</style>
);

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" stroke="#c8ff00" strokeWidth="1.2"/>
    <rect x="18" y="2" width="12" height="12" fill="#c8ff00" fillOpacity="0.15" stroke="#c8ff00" strokeWidth="1.2"/>
    <rect x="2" y="18" width="12" height="12" fill="#c8ff00" fillOpacity="0.08" stroke="#c8ff00" strokeWidth="1.2"/>
    <rect x="18" y="18" width="12" height="12" stroke="#c8ff00" strokeWidth="1.2" strokeDasharray="2 2"/>
    <circle cx="16" cy="16" r="2" fill="#c8ff00"/>
  </svg>
);

// ─── CURSOR ───────────────────────────────────────────────────────────────────

const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const animate = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      if (dot.current) { dot.current.style.left = `${mx - 6}px`; dot.current.style.top = `${my - 6}px`; }
      if (ring.current) { ring.current.style.left = `${rx - 18}px`; ring.current.style.top = `${ry - 18}px`; }
      requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    animate();
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (<><div ref={dot} className="cursor"/><div ref={ring} className="cursor-ring"/></>);
};

// ─── HEADER ───────────────────────────────────────────────────────────────────

const Header = () => {
  const y = useScrollY();
  return (
    <header className={`header ${y > 40 ? "scrolled" : ""}`}>
      <a href="#" className="brand">
        <Logo />
        <span className="brand-name">SQUARGRAPH</span>
      </a>
      <nav className="nav">
        <a href="#services">Services</a>
        <a href="#approach">Approach</a>
        <a href="#founder">Studio</a>
        <a href="#contact" className="nav-cta">Start a Project</a>
      </nav>
    </header>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

const Hero = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <section className="hero">
      <div className="hero-bg"/>
      <div className="hero-grid"/>
      <div className="hero-orb"/>
      <div className="hero-content">
        <div className="hero-eyebrow" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease 0.3s" }}>
          Creative Strategy Studio
        </div>
        <h1 className="hero-h1" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.8s ease 0.5s" }}>
          We don't just<br/>create content.<br/><em>We build ideas</em><br/>that scale brands.
        </h1>
        <p className="hero-sub" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.7s ease 0.75s" }}>
          Strategy-led creative for brands that want more than just posts.
        </p>
        <div className="hero-ctas" style={{ opacity: visible ? 1 : 0, transition: "all 0.6s ease 1s" }}>
          <a href="#contact" className="btn-primary">Start a Project</a>
          <a href="https://wa.me/918588897488?text=Hi%20SQUARGRAPH%20Studios%2C%20I'd%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer" className="btn-ghost">Talk to Us</a>
        </div>
      </div>
    </section>
  );
};

// ─── TRUST ────────────────────────────────────────────────────────────────────

const Trust = () => (
  <div className="trust">
    <span className="trust-text">Built on experience</span>
    <span className="trust-dot"/>
    <span className="trust-text">Campaigns · Content · Brand Thinking</span>
    <span className="trust-dot"/>
    <span className="trust-text">Strategy first. Always.</span>
  </div>
);

// ─── SERVICES ─────────────────────────────────────────────────────────────────

const services = [
  {
    icon: <svg className="service-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="22" cy="22" r="18"/><path d="M14 22h16M22 14v16"/><circle cx="22" cy="22" r="4" fill="currentColor" fillOpacity="0.2"/></svg>,
    title: "Strategy",
    desc: "Brand positioning, audience intelligence, and campaign blueprints that define direction before a single pixel is placed."
  },
  {
    icon: <svg className="service-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="8" y="8" width="12" height="12"/><rect x="24" y="8" width="12" height="12"/><rect x="8" y="24" width="12" height="12"/><rect x="24" y="24" width="12" height="12"/></svg>,
    title: "Execution",
    desc: "Visual storytelling, motion content, and platform-native creatives delivered with surgical precision."
  },
  {
    icon: <svg className="service-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2"><polyline points="8,32 18,18 26,24 36,10"/><circle cx="36" cy="10" r="3" fill="currentColor" fillOpacity="0.3"/></svg>,
    title: "Growth",
    desc: "Data-backed performance layers—organic amplification, paid strategy, and conversion architecture."
  },
  {
    icon: <svg className="service-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="22,6 38,16 38,28 22,38 6,28 6,16"/><circle cx="22" cy="22" r="5" fill="currentColor" fillOpacity="0.2"/></svg>,
    title: "Branding",
    desc: "Identity systems, visual language, and brand guidelines that make your market position undeniable."
  },
];

const Services = () => {
  const [ref, inView] = useInView();
  return (
    <section className="section" id="services" ref={ref}>
      <div className={`reveal ${inView ? "in" : ""}`}>
        <div className="section-label">What we do</div>
        <h2 className="section-h2">Built to move<br/>every brand forward.</h2>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={s.title} className={`service-card reveal reveal-d${i+1} ${inView ? "in" : ""}`}>
            {s.icon}
            <div className="service-title">{s.title}</div>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── APPROACH ─────────────────────────────────────────────────────────────────

const steps = [
  { label: "Decode", desc: "Understand the brand, the gap, the opportunity." },
  { label: "Narrative", desc: "Build the story that earns attention." },
  { label: "Create", desc: "Design and produce with intent." },
  { label: "Distribute", desc: "Place content where it matters most." },
  { label: "Scale", desc: "Amplify what works, drop what doesn't." },
];

const Approach = () => {
  const [ref, inView] = useInView();
  return (
    <section className="section" id="approach" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }} ref={ref}>
      <div className={`reveal ${inView ? "in" : ""}`}>
        <div className="section-label">How we work</div>
        <h2 className="section-h2">No templates.<br/>Every move is intentional.</h2>
      </div>
      <div className={`approach-flow reveal reveal-d2 ${inView ? "in" : ""}`}>
        {steps.map((s, i) => (
          <div key={s.label} className="step">
            <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="step-label">{s.label}</div>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── FOUNDER ─────────────────────────────────────────────────────────────────

const Founder = () => {
  const [ref, inView] = useInView();
  const [imgErr, setImgErr] = useState(false);
  return (
    <section className="section founder-section" id="founder" ref={ref}>
      <div className="founder-inner">
        <div className={`founder-img-wrap reveal ${inView ? "in" : ""}`}>
          {!imgErr ? (
            <img src="/founder.jpeg" alt="Saurabh Sohan Singh" className="founder-img" onError={() => setImgErr(true)}/>
          ) : (
            <div className="founder-fallback">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="rgba(200,255,0,0.3)" strokeWidth="1">
                <circle cx="32" cy="24" r="12"/>
                <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24"/>
              </svg>
            </div>
          )}
        </div>
        <div>
          <div className={`reveal reveal-d2 ${inView ? "in" : ""}`}>
            <div className="section-label">The studio</div>
            <h2 className="founder-name">Saurabh<br/>Sohan Singh</h2>
            <div className="founder-title">Founder — Strategy & Campaigns</div>
            <p className="founder-quote">"Building ideas that move brands."</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────

const Contact = () => {
  const [ref, inView] = useInView();
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", email: "", requirement: "", budget: "" });
  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xzdykrjl", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch { setStatus("error"); }
  };
  return (
    <section className="section" id="contact" ref={ref}>
      <div className={`reveal ${inView ? "in" : ""}`}>
        <div className="section-label">Get in touch</div>
        <h2 className="section-h2">Let's build something<br/>meaningful.</h2>
      </div>
      {status === "sent" ? (
        <div style={{ marginTop: 56, color: "var(--accent)", fontFamily: "Syne", fontSize: "1.2rem", fontWeight: 700 }}>
          Message received. We'll be in touch.
        </div>
      ) : (
        <form className={`contact-form reveal reveal-d2 ${inView ? "in" : ""}`} onSubmit={onSubmit}>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input name="name" value={form.name} onChange={onChange} required className="form-input" placeholder="Your name"/>
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required className="form-input" placeholder="your@email.com"/>
          </div>
          <div className="form-field full">
            <label className="form-label">Requirement</label>
            <input name="requirement" value={form.requirement} onChange={onChange} className="form-input" placeholder="What are you looking to build?"/>
          </div>
          <div className="form-field">
            <label className="form-label">Budget</label>
            <input name="budget" value={form.budget} onChange={onChange} className="form-input" placeholder="Approx. budget"/>
          </div>
          <div className="form-field" style={{ justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" style={{ marginTop: 22 }} disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </div>
          {status === "error" && <p style={{ gridColumn: "1/-1", color: "var(--accent2)", fontSize: "0.82rem" }}>Something went wrong. Try again or email us directly.</p>}
        </form>
      )}
    </section>
  );
};

// ─── CHATBOT ─────────────────────────────────────────────────────────────────

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Tell us about your brand" }]);
  const [input, setInput] = useState("");
  const chips = ["Campaign Idea", "Instagram Audit", "Content Plan"];
  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: "user", text }, { from: "bot", text: "Thanks! Our team will get back to you shortly. Or reach us on WhatsApp →" }]);
    setInput("");
  };
  return (
    <div className="chatbot-wrap">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span className="chatbot-title">SQUARGRAPH AI</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "none", fontSize: "1rem" }}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}
          </div>
          <div className="chatbot-chips">
            {chips.map(c => <button key={c} className="chip" onClick={() => send(c)}>{c}</button>)}
          </div>
          <div className="chatbot-input-row">
            <input className="chatbot-input" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}/>
            <button className="chat-send" onClick={() => send(input)}>→</button>
          </div>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 10c0 4.418-3.582 8-8 8a7.96 7.96 0 01-4.343-1.278L2 18l1.278-3.657A7.96 7.96 0 012 10c0-4.418 3.582-8 8-8s8 3.582 8 8z"/>
        </svg>
      </button>
    </div>
  );
};

// ─── WHATSAPP ─────────────────────────────────────────────────────────────────

const WhatsApp = () => (
  <a href="https://wa.me/918588897488?text=Hi%20SQUARGRAPH%20Studios%2C%20I'd%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer" className="wa-btn">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="footer">
    <div>
      <div className="footer-brand">SQUARGRAPH Studios</div>
      <div className="footer-tagline">Creative strategy-led execution for modern brands.</div>
    </div>
    <div className="social-row">
      {[
        { href: "#", label: "Instagram", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg> },
        { href: "#", label: "Facebook", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
        { href: "#", label: "LinkedIn", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
        { href: "#", label: "YouTube", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" fillOpacity="0.4"/></svg> },
        { href: "#", label: "X", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
      ].map(s => (
        <a key={s.label} href={s.href} className="social-link" aria-label={s.label}>{s.icon}</a>
      ))}
    </div>
    <div className="footer-copy">© {new Date().getFullYear()} SQUARGRAPH Studios. All rights reserved.</div>
  </footer>
);

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="noise">
      <G/>
      <Cursor/>
      <Header/>
      <Hero/>
      <Trust/>
      <Services/>
      <Approach/>
      <Founder/>
      <Contact/>
      <Footer/>
      <Chatbot/>
      <WhatsApp/>
    </div>
  );
}
