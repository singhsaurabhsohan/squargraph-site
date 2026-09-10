'use strict';

window.SQ = window.SQ || {};

window.SQ.addDrag = function (el) {
  if (!el) return;
  var isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', function (e) {
    isDown = true;
    el.style.cursor = 'grabbing';
    startX = e.pageX - el.getBoundingClientRect().left;
    scrollLeft = el.scrollLeft;
  });
  document.addEventListener('mouseup', function () {
    isDown = false;
    el.style.cursor = 'grab';
  });
  el.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - el.getBoundingClientRect().left;
    el.scrollLeft = scrollLeft - (x - startX);
  });
};

window.SQ.initActiveNav = function () {
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  navAnchors.forEach(function (anchor) {
    var section = document.getElementById(anchor.getAttribute('href').replace('#', ''));
    if (section) sections.push({ el: section, link: anchor, top: 0 });
  });
  function recalcTops() {
    sections.forEach(function (section) {
      section.top = section.el.getBoundingClientRect().top + window.scrollY;
    });
  }
  function setActiveNav() {
    var scrollY = window.scrollY + 120;
    var current = null;
    sections.forEach(function (section) { if (section.top <= scrollY) current = section; });
    sections.forEach(function (section) { section.link.classList.toggle('active', section === current); });
  }
  recalcTops();
  window.addEventListener('resize', recalcTops, { passive: true });
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
};

window.SQ.initBackToTop = function () {
  var button = document.getElementById('back-to-top');
  if (!button) return;
  button.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', function () {
    button.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
};

window.SQ.dialogFocusable = function (root) {
  if (!root) return [];
  return Array.prototype.slice.call(root.querySelectorAll(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
  )).filter(function (element) {
    return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
  });
};

window.SQ.trapDialogKey = function (event, root, close) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
    return;
  }
  if (event.key !== 'Tab') return;
  var focusable = window.SQ.dialogFocusable(root);
  if (!focusable.length) return;
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

window.SQ.initModals = function () {
  var lastFocus = null;
  var currentModal = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    currentModal = modal;
    modal.classList.add('open');
    modal.setAttribute('role', modal.getAttribute('role') || 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var target = window.SQ.dialogFocusable(modal)[0] || modal;
    if (!target.hasAttribute('tabindex') && target === modal) target.setAttribute('tabindex', '-1');
    window.setTimeout(function () { target.focus(); }, 0);
  }

  window.closeModal = function () {
    document.querySelectorAll('.modal-overlay.open').forEach(function (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    currentModal = null;
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  document.querySelectorAll('.intel-card').forEach(function (card) {
    function open() {
      openModal(document.getElementById('modal-' + card.getAttribute('data-exploration')));
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function (modal) {
    if (!modal.hasAttribute('aria-hidden')) modal.setAttribute('aria-hidden', 'true');
    modal.addEventListener('click', function (e) { if (e.target === modal) window.closeModal(); });
    modal.addEventListener('keydown', function (e) {
      if (currentModal === modal) window.SQ.trapDialogKey(e, modal, window.closeModal);
    });
  });
};

window.SQ.initVideoPosters = function () {
  function loadPoster(poster) {
    if (!poster) return;
    var src = poster.getAttribute('data-src');
    if (!src) return;
    var loading = document.createElement('div');
    loading.className = 'reel-poster-loading';
    var spinner = document.createElement('div');
    spinner.className = 'reel-spinner';
    loading.appendChild(spinner);
    poster.parentNode.appendChild(loading);
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = poster.getAttribute('data-title') || 'Video';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;display:block;';
    iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'origin';
    iframe.setAttribute('allowfullscreen', '');
    iframe.onload = function () { loading.remove(); };
    poster.parentNode.appendChild(iframe);
    poster.remove();
  }
  document.addEventListener('click', function (e) { loadPoster(e.target.closest('.reel-poster')); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var poster = e.target.closest('.reel-poster');
    if (!poster) return;
    e.preventDefault();
    loadPoster(poster);
  });
};

window.SQ.initAIChat = function () {
  var history = [];
  var introduced = false;
  var lastFocus = null;
  var panel = document.getElementById('ai-chat-panel');
  var input = document.getElementById('ai-chat-input');

  if (panel) {
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', panel.getAttribute('aria-label') || 'SQUARGRAPH AI assistant');
  }

  window.toggleAIChat = function (forceOpen) {
    if (!panel) return;
    var open = typeof forceOpen === 'boolean' ? forceOpen : !panel.classList.contains('open');
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      lastFocus = document.activeElement;
      if (!introduced) {
        introduced = true;
        addMsg('bot', 'Ask me about SQUARGRAPH™, Saurabh, our capabilities, engagements, process, policies, or partner network.');
      }
      if (input) window.setTimeout(function () { input.focus(); }, 0);
    } else if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
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
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    history = history.slice(-12);
    var loading = addMsg('bot loading', 'Typing…');
    try {
      var response = await fetch(window.SQ.config.aiChatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          page: { path: window.location.pathname, title: document.title }
        })
      });
      var data = await response.json().catch(function () { return {}; });
      if (loading) loading.remove();
      if (!response.ok) throw new Error(data.error || 'Assistant unavailable');
      var reply = data.reply || 'Sorry, something went wrong. Try WhatsApp below.';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
      history = history.slice(-12);
    } catch (error) {
      if (loading) loading.remove();
      addMsg('bot', 'Connection error. Try WhatsApp below.');
    }
  }

  var sendBtn = document.getElementById('ai-chat-send');
  var waBtn = document.getElementById('mobile-wa');
  if (sendBtn) sendBtn.addEventListener('click', send);
  if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  if (waBtn) waBtn.addEventListener('click', function () { window.toggleAIChat(); });
  if (panel) panel.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); window.toggleAIChat(false); }
  });
};

window.SQ.initFloatingFooterGuard = function () {
  var footer = document.querySelector('.site-footer');
  if (!footer || !('IntersectionObserver' in window)) return;
  function setHidden(hidden) {
    ['sticky-banner', 'mobile-book-wrap', 'mobile-wa', 'back-to-top'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.classList.contains('sg-dismissed')) return;
      el.classList.toggle('sg-contact-hidden', hidden);
    });
  }
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { setHidden(entry.isIntersecting); });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 }).observe(footer);
};

window.SQ.ensureRazorpay = function () {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (window.SQ.razorpayReady) return window.SQ.razorpayReady;
  window.SQ.razorpayReady = new Promise(function (resolve, reject) {
    var script = document.querySelector('script[data-sq-razorpay]');
    function fail(message) {
      window.SQ.razorpayReady = null;
      if (script && script.parentNode) script.parentNode.removeChild(script);
      reject(new Error(message));
    }
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.setAttribute('data-sq-razorpay', 'true');
    }
    script.addEventListener('load', function () {
      if (window.Razorpay) resolve(window.Razorpay);
      else fail('Razorpay checkout loaded without initializing.');
    }, { once: true });
    script.addEventListener('error', function () { fail('Razorpay checkout failed to load.'); }, { once: true });
    if (!script.parentNode) document.head.appendChild(script);
  });
  return window.SQ.razorpayReady;
};

window.SQ.paymentRequest = async function (payload) {
  var endpoint = window.SQ.config && window.SQ.config.paymentEndpoint;
  if (!endpoint) throw new Error('Secure payment service is not configured.');
  var response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  var data = await response.json().catch(function () { return {}; });
  if (!response.ok || data.ok !== true) throw new Error(data.error || 'Secure payment service failed.');
  return data;
};

window.SQ.createPaymentOrder = function (productKey, context) {
  return window.SQ.paymentRequest({
    action: 'create_order',
    product: productKey,
    context: context || {},
    page: { path: window.location.pathname, href: window.location.href }
  });
};

window.SQ.verifyPayment = function (orderToken, response) {
  return window.SQ.paymentRequest({
    action: 'verify_payment',
    order_token: orderToken,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature
  });
};

window.SQ.openRazorpay = async function (productKey, callbacks) {
  callbacks = callbacks || {};
  try {
    var serverOrder = await window.SQ.createPaymentOrder(productKey, callbacks.context || {});
    await window.SQ.ensureRazorpay();

    var options = {
      key: serverOrder.key_id,
      order_id: serverOrder.order_id,
      amount: serverOrder.amount,
      currency: serverOrder.currency,
      name: 'SQUARGRAPH™',
      description: serverOrder.description,
      image: '/logo.webp',
      prefill: callbacks.prefill || {},
      notes: { product: serverOrder.product_name },
      theme: { color: '#394536' },
      modal: {
        ondismiss: function () {
          if (typeof callbacks.onDismiss === 'function') callbacks.onDismiss();
        },
        animation: true
      },
      handler: async function (response) {
        try {
          if (typeof callbacks.onVerifying === 'function') callbacks.onVerifying();
          var verification = await window.SQ.verifyPayment(serverOrder.order_token, response);
          if (!verification.verified) throw new Error('Payment verification failed.');

          var overlay = document.getElementById('payment-success-overlay');
          var pidEl = document.getElementById('success-payment-id');
          if (pidEl) pidEl.textContent = 'Payment ID: ' + response.razorpay_payment_id;
          if (overlay) {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            overlay.scrollTop = 0;
          }
          window.SQ.trackEvent('payment_verified', {
            product: productKey,
            payment_id: response.razorpay_payment_id,
            payment_status: verification.payment_status
          });
          if (typeof callbacks.onSuccess === 'function') callbacks.onSuccess(response, verification);
        } catch (error) {
          console.error('[SQUARGRAPH] Payment verification error:', error);
          if (typeof callbacks.onError === 'function') callbacks.onError(error);
        }
      }
    };

    var checkout = new window.Razorpay(options);
    checkout.on('payment.failed', function (failure) {
      window.SQ.trackEvent('payment_failed', { product: productKey, reason: failure.error && failure.error.reason });
    });
    checkout.open();
    if (typeof callbacks.onOpen === 'function') callbacks.onOpen(serverOrder);
    return true;
  } catch (error) {
    console.error('[SQUARGRAPH] Payment checkout error:', error);
    if (typeof callbacks.onError === 'function') callbacks.onError(error);
    return false;
  }
};

window.openRazorpay = window.SQ.openRazorpay;

document.addEventListener('DOMContentLoaded', function () {
  window.SQ.initBackToTop();
  window.SQ.initActiveNav();
  window.SQ.initModals();
  window.SQ.initVideoPosters();
  window.SQ.initAIChat();
  window.SQ.initFloatingFooterGuard();
  window.SQ.addDrag(document.getElementById('films-strip'));
  window.SQ.addDrag(document.getElementById('reels-strip'));
});
