'use strict';

window.SQ = window.SQ || {};

window.SQ.addDrag = function (el) {
  if (!el) return;
  var isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', function (e) {
    isDown = true; el.style.cursor = 'grabbing';
    startX = e.pageX - el.getBoundingClientRect().left;
    scrollLeft = el.scrollLeft;
  });
  document.addEventListener('mouseup', function () { isDown = false; el.style.cursor = 'grab'; });
  el.addEventListener('mousemove', function (e) {
    if (!isDown) return; e.preventDefault();
    var x = e.pageX - el.getBoundingClientRect().left;
    el.scrollLeft = scrollLeft - (x - startX);
  });
};

window.SQ.initActiveNav = function () {
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  navAnchors.forEach(function (a) {
    var id = a.getAttribute('href').replace('#', '');
    var sec = document.getElementById(id);
    if (sec) sections.push({ el: sec, link: a, top: 0 });
  });

  function recalcTops() {
    sections.forEach(function (s) { s.top = s.el.getBoundingClientRect().top + window.scrollY; });
  }
  recalcTops();
  window.addEventListener('resize', recalcTops, { passive: true });

  function setActiveNav() {
    var scrollY = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) { if (s.top <= scrollY) current = s; });
    sections.forEach(function (s) { s.link.classList.toggle('active', s === current); });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
};

window.SQ.initBackToTop = function () {
  var btt = document.getElementById('back-to-top');
  if (!btt) return;
  btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', function () {
    btt.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
};

window.SQ.initModals = function () {
  document.querySelectorAll('.intel-card').forEach(function (card) {
    function open() {
      var id = 'modal-' + card.getAttribute('data-exploration');
      var m = document.getElementById(id);
      if (m) { m.classList.add('open'); document.body.style.overflow = 'visible'; }
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  window.closeModal = function () {
    document.querySelectorAll('.modal-overlay').forEach(function (m) { m.classList.remove('open'); });
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-overlay').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) window.closeModal(); });
  });
};

window.SQ.initVideoPosters = function () {
  document.addEventListener('click', function (e) {
    var poster = e.target.closest('.reel-poster');
    if (!poster) return;
    var src = poster.getAttribute('data-src');
    var loading = document.createElement('div');
    loading.className = 'reel-poster-loading';
    loading.innerHTML = '<div class="reel-spinner"></div>';
    poster.parentNode.appendChild(loading);
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;display:block;';
    iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'origin';
    iframe.onload = function () { loading.remove(); };
    poster.parentNode.appendChild(iframe);
    poster.remove();
  });
};

window.SQ.initAIChat = function () {
  var history = [];
  var opened  = false;

  window.toggleAIChat = function () {
    var panel = document.getElementById('ai-chat-panel');
    if (!panel) return;
    var open = panel.classList.toggle('open');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open && !opened) {
      opened = true;
      addMsg('bot', 'This is the SQUARGRAPH™ intelligence layer. Ask me about our work, our process, or which engagement is right for your situation.');
    }
  };

  function addMsg(role, text) {
    var wrap = document.getElementById('ai-chat-messages');
    if (!wrap) return null;
    var div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    div.textContent = text;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
    return div;
  }

  async function send() {
    var input = document.getElementById('ai-chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    var loadEl = addMsg('bot loading', 'Typing…');
    try {
      var res = await fetch(window.SQ.config.aiChatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      var data = await res.json();
      if (loadEl) loadEl.remove();
      var reply = data.reply || 'Sorry, something went wrong. Try WhatsApp below.';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      if (loadEl) loadEl.remove();
      addMsg('bot', 'Connection error. Try WhatsApp below.');
    }
  }

  var sendBtn = document.getElementById('ai-chat-send');
  var chatInput = document.getElementById('ai-chat-input');
  var waBtn = document.getElementById('mobile-wa');

  if (sendBtn) sendBtn.addEventListener('click', send);
  if (chatInput) chatInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  if (waBtn) waBtn.addEventListener('click', window.toggleAIChat);
};

window.SQ.openRazorpay = function (productKey) {
  var cfg     = window.SQ.config;
  var product = cfg.razorpayProducts[productKey];
  if (!product) return;

  var options = {
    key: cfg.razorpayKey, amount: product.amount, currency: 'INR',
    name: 'SQUARGRAPH™', description: product.description,
    image: '/logo.webp', prefill: {}, notes: { product: product.name },
    theme: { color: '#8B7EC8' }, modal: { ondismiss: function () {}, animation: true },
    handler: function (response) {
      var overlay = document.getElementById('payment-success-overlay');
      var pidEl   = document.getElementById('success-payment-id');
      if (pidEl) pidEl.textContent = 'Payment ID: ' + response.razorpay_payment_id;
      if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'visible'; overlay.scrollTop = 0; }
    }
  };

  function launch() { new Razorpay(options).open(); }

  if (typeof Razorpay !== 'undefined') { launch(); return; }
  var script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = launch;
  document.head.appendChild(script);
};

window.openRazorpay = window.SQ.openRazorpay;

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initBackToTop();
  window.SQ.initActiveNav();
  window.SQ.initModals();
  window.SQ.initVideoPosters();
  window.SQ.initAIChat();
  window.SQ.addDrag(document.getElementById('films-strip'));
  window.SQ.addDrag(document.getElementById('reels-strip'));
});
