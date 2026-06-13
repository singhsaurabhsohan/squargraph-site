/**
 * SQUARGRAPH™ OTP Verification
 * Handles email + phone OTP via Supabase Auth
 * Used across: index.html, discovery.html, audit.html
 */

(function () {
  'use strict';

  var SB_URL = 'https://jzlupkvgizfdwwbofzmu.supabase.co';
  var SB_KEY = 'sb_publishable_IPU4Nh7zQW_OfZr0Tlej6A_gfYhevRl';

  /* ── State ── */
  var state = {
    emailVerified: false,
    phoneVerified: false,
    currentType: null,   // 'email' | 'phone'
    currentValue: null,
    onBothVerified: null // callback when both done
  };

  /* ── Supabase Auth API helpers ── */
  async function sbRequest(path, body) {
    var res = await fetch(SB_URL + path, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Request failed');
    return data;
  }

  async function sendEmailOtp(email) {
    return sbRequest('/auth/v1/otp', { email: email, create_user: false });
  }

  async function sendPhoneOtp(phone) {
    return sbRequest('/auth/v1/otp', { phone: phone, channel: 'whatsapp', create_user: false });
  }

  async function verifyEmailOtp(email, token) {
    return sbRequest('/auth/v1/verify', { type: 'email', email: email, token: token });
  }

  async function verifyPhoneOtp(phone, token) {
    return sbRequest('/auth/v1/verify', { type: 'sms', phone: phone, token: token });
  }

  /* ── Modal HTML ── */
  function injectModal() {
    if (document.getElementById('sq-otp-modal')) return;
    var html = `
<div id="sq-otp-modal" style="display:none;position:fixed;inset:0;z-index:99999;background:rgba(26,23,20,.7);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:20px;">
  <div id="sq-otp-box" style="background:#fff;border-radius:20px;padding:36px 32px;max-width:400px;width:100%;box-shadow:0 24px 64px rgba(26,23,20,.18);position:relative;font-family:'Satoshi',-apple-system,BlinkMacSystemFont,sans-serif;">
    <button id="sq-otp-close" type="button" style="position:absolute;top:16px;right:16px;background:none;border:1px solid #E5E3DF;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:16px;color:#3D3935;display:flex;align-items:center;justify-content:center;line-height:1;" aria-label="Close">✕</button>

    <!-- Step 1: Send OTP -->
    <div id="sq-otp-send-screen">
      <div id="sq-otp-icon" style="width:48px;height:48px;border-radius:14px;background:#EEECf7;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
        <svg id="sq-otp-icon-email" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B5DB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <svg id="sq-otp-icon-phone" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B5DB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      </div>
      <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#6B5DB8;margin-bottom:8px;" id="sq-otp-eyebrow">Verify Email</p>
      <h3 style="font-size:20px;font-weight:600;letter-spacing:-0.025em;color:#1A1714;margin-bottom:8px;" id="sq-otp-heading">Confirm your email</h3>
      <p style="font-size:13px;color:#3D3935;line-height:1.6;margin-bottom:24px;" id="sq-otp-subtext">We'll send a 6-digit code to <strong id="sq-otp-value-display"></strong></p>
      <button id="sq-otp-send-btn" type="button" style="width:100%;background:#1A1714;color:#fff;border:none;border-radius:999px;padding:14px 24px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;letter-spacing:-0.01em;">Send OTP →</button>
      <p id="sq-otp-send-err" style="font-size:12px;color:#EF4444;margin-top:10px;display:none;text-align:center;"></p>
    </div>

    <!-- Step 2: Enter OTP -->
    <div id="sq-otp-verify-screen" style="display:none;">
      <div style="width:48px;height:48px;border-radius:14px;background:#EEECf7;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B5DB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
      </div>
      <p style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#6B5DB8;margin-bottom:8px;">Enter Code</p>
      <h3 style="font-size:20px;font-weight:600;letter-spacing:-0.025em;color:#1A1714;margin-bottom:8px;">Enter the 6-digit code</h3>
      <p style="font-size:13px;color:#3D3935;line-height:1.6;margin-bottom:24px;">Sent to <strong id="sq-otp-sent-to"></strong></p>

      <!-- OTP digit inputs -->
      <div id="sq-otp-inputs" style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;">
        <input class="sq-otp-digit" type="text" inputmode="numeric" maxlength="1" style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:600;border:1.5px solid #E5E3DF;border-radius:12px;font-family:inherit;color:#1A1714;background:#F5F5F3;outline:none;transition:border-color .2s;" />
        <input class="sq-otp-digit" type="text" inputmode="numeric" maxlength="1" style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:600;border:1.5px solid #E5E3DF;border-radius:12px;font-family:inherit;color:#1A1714;background:#F5F5F3;outline:none;transition:border-color .2s;" />
        <input class="sq-otp-digit" type="text" inputmode="numeric" maxlength="1" style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:600;border:1.5px solid #E5E3DF;border-radius:12px;font-family:inherit;color:#1A1714;background:#F5F5F3;outline:none;transition:border-color .2s;" />
        <input class="sq-otp-digit" type="text" inputmode="numeric" maxlength="1" style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:600;border:1.5px solid #E5E3DF;border-radius:12px;font-family:inherit;color:#1A1714;background:#F5F5F3;outline:none;transition:border-color .2s;" />
        <input class="sq-otp-digit" type="text" inputmode="numeric" maxlength="1" style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:600;border:1.5px solid #E5E3DF;border-radius:12px;font-family:inherit;color:#1A1714;background:#F5F5F3;outline:none;transition:border-color .2s;" />
        <input class="sq-otp-digit" type="text" inputmode="numeric" maxlength="1" style="width:44px;height:52px;text-align:center;font-size:22px;font-weight:600;border:1.5px solid #E5E3DF;border-radius:12px;font-family:inherit;color:#1A1714;background:#F5F5F3;outline:none;transition:border-color .2s;" />
      </div>

      <button id="sq-otp-verify-btn" type="button" style="width:100%;background:#6B5DB8;color:#fff;border:none;border-radius:999px;padding:14px 24px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;letter-spacing:-0.01em;margin-bottom:12px;">Verify Code</button>
      <p id="sq-otp-verify-err" style="font-size:12px;color:#EF4444;margin-bottom:12px;display:none;text-align:center;"></p>
      <p style="text-align:center;font-size:12px;color:#3D3935;">Didn't receive it? <button id="sq-otp-resend-btn" type="button" style="background:none;border:none;color:#6B5DB8;font-weight:600;cursor:pointer;font-size:12px;font-family:inherit;padding:0;">Resend</button> <span id="sq-otp-resend-timer" style="color:#B0ACA8;"></span></p>
    </div>

    <!-- Step 3: Success -->
    <div id="sq-otp-success-screen" style="display:none;text-align:center;">
      <div style="width:64px;height:64px;border-radius:50%;background:#DCFCE7;border:1px solid #86EFAC;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style="font-size:20px;font-weight:600;letter-spacing:-0.025em;color:#1A1714;margin-bottom:8px;" id="sq-otp-success-heading">Verified!</h3>
      <p style="font-size:13px;color:#3D3935;line-height:1.6;" id="sq-otp-success-msg"></p>
    </div>
  </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    bindModalEvents();
  }

  /* ── OTP digit input behaviour ── */
  function bindDigitInputs() {
    var digits = document.querySelectorAll('.sq-otp-digit');
    digits.forEach(function (inp, idx) {
      inp.value = '';
      inp.style.borderColor = '#E5E3DF';

      inp.addEventListener('input', function () {
        var v = inp.value.replace(/\D/g, '');
        inp.value = v ? v[0] : '';
        if (v && idx < digits.length - 1) digits[idx + 1].focus();
      });

      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && idx > 0) {
          digits[idx - 1].focus();
        }
      });

      inp.addEventListener('paste', function (e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        digits.forEach(function (d, i) { d.value = text[i] || ''; });
        var last = Math.min(text.length, digits.length) - 1;
        if (last >= 0) digits[last].focus();
      });

      inp.addEventListener('focus', function () { inp.style.borderColor = '#6B5DB8'; });
      inp.addEventListener('blur', function () { inp.style.borderColor = inp.value ? '#6B5DB8' : '#E5E3DF'; });
    });
  }

  function getOtpValue() {
    return Array.from(document.querySelectorAll('.sq-otp-digit')).map(function (d) { return d.value; }).join('');
  }

  /* ── Resend timer ── */
  var resendInterval = null;
  function startResendTimer() {
    var btn = document.getElementById('sq-otp-resend-btn');
    var timer = document.getElementById('sq-otp-resend-timer');
    var secs = 30;
    btn.disabled = true;
    btn.style.opacity = '.4';
    timer.textContent = '(' + secs + 's)';
    clearInterval(resendInterval);
    resendInterval = setInterval(function () {
      secs--;
      if (secs <= 0) {
        clearInterval(resendInterval);
        btn.disabled = false;
        btn.style.opacity = '1';
        timer.textContent = '';
      } else {
        timer.textContent = '(' + secs + 's)';
      }
    }, 1000);
  }

  /* ── Show / hide modal screens ── */
  function showScreen(name) {
    ['sq-otp-send-screen', 'sq-otp-verify-screen', 'sq-otp-success-screen'].forEach(function (id) {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById('sq-otp-' + name + '-screen').style.display = 'block';
  }

  function openModal(type, value) {
    state.currentType = type;
    state.currentValue = value;

    var isEmail = type === 'email';
    document.getElementById('sq-otp-icon-email').style.display = isEmail ? 'block' : 'none';
    document.getElementById('sq-otp-icon-phone').style.display = isEmail ? 'none' : 'block';
    document.getElementById('sq-otp-eyebrow').textContent = isEmail ? 'Verify Email' : 'Verify Phone';
    document.getElementById('sq-otp-heading').textContent = isEmail ? 'Confirm your email' : 'Confirm your phone';
    document.getElementById('sq-otp-subtext').innerHTML = (type === 'phone' ? 'We\'ll send a 6-digit code via <strong>WhatsApp</strong> to <strong>' + value + '</strong>' : 'We\'ll send a 6-digit code to <strong>' + value + '</strong>');
    document.getElementById('sq-otp-send-err').style.display = 'none';

    showScreen('send');
    document.getElementById('sq-otp-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('sq-otp-modal').style.display = 'none';
    document.body.style.overflow = '';
    clearInterval(resendInterval);
  }

  /* ── Send OTP ── */
  async function doSendOtp() {
    var btn = document.getElementById('sq-otp-send-btn');
    var errEl = document.getElementById('sq-otp-send-err');
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      if (state.currentType === 'email') {
        await sendEmailOtp(state.currentValue);
      } else {
        await sendPhoneOtp(state.currentValue);
      }
      document.getElementById('sq-otp-sent-to').textContent = state.currentValue;
      showScreen('verify');
      bindDigitInputs();
      startResendTimer();
      setTimeout(function () {
        var first = document.querySelector('.sq-otp-digit');
        if (first) first.focus();
      }, 100);
    } catch (err) {
      errEl.textContent = err.message || 'Failed to send OTP. Please check and try again.';
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Send OTP →';
    }
  }

  /* ── Verify OTP ── */
  async function doVerifyOtp() {
    var token = getOtpValue();
    var errEl = document.getElementById('sq-otp-verify-err');
    var btn = document.getElementById('sq-otp-verify-btn');

    if (token.length < 6) {
      errEl.textContent = 'Please enter all 6 digits.';
      errEl.style.display = 'block';
      return;
    }

    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Verifying…';

    try {
      if (state.currentType === 'email') {
        await verifyEmailOtp(state.currentValue, token);
        state.emailVerified = true;
      } else {
        await verifyPhoneOtp(state.currentValue, token);
        state.phoneVerified = true;
      }

      var isEmail = state.currentType === 'email';
      document.getElementById('sq-otp-success-heading').textContent = isEmail ? 'Email Verified!' : 'Phone Verified!';
      document.getElementById('sq-otp-success-msg').textContent = isEmail
        ? 'Your email has been confirmed. Please also verify your phone number.'
        : 'Your phone has been confirmed. You\'re all set!';

      showScreen('success');

      // Update verify button on form
      markFieldVerified(state.currentType);

      // Check if both verified
      if (state.emailVerified && state.phoneVerified) {
        document.getElementById('sq-otp-success-msg').textContent = 'Both email and phone verified. You\'re all set!';
        if (typeof state.onBothVerified === 'function') state.onBothVerified();
      }

      setTimeout(closeModal, 1800);
    } catch (err) {
      var msg = err.message || '';
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
        errEl.textContent = 'Invalid or expired code. Please try again.';
      } else {
        errEl.textContent = msg || 'Verification failed. Please try again.';
      }
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Verify Code';
      // Shake digits
      var inputs = document.getElementById('sq-otp-inputs');
      inputs.style.animation = 'none';
      setTimeout(function () {
        inputs.style.animation = 'sq-shake .4s ease';
      }, 10);
    }
  }

  /* ── Bind modal button events ── */
  function bindModalEvents() {
    document.getElementById('sq-otp-close').addEventListener('click', closeModal);
    document.getElementById('sq-otp-modal').addEventListener('click', function (e) {
      if (e.target === document.getElementById('sq-otp-modal')) closeModal();
    });
    document.getElementById('sq-otp-send-btn').addEventListener('click', doSendOtp);
    document.getElementById('sq-otp-verify-btn').addEventListener('click', doVerifyOtp);
    document.getElementById('sq-otp-resend-btn').addEventListener('click', function () {
      bindDigitInputs();
      document.getElementById('sq-otp-verify-err').style.display = 'none';
      doSendOtp().then(function () {
        showScreen('verify');
        startResendTimer();
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Enter' && document.getElementById('sq-otp-modal').style.display === 'flex') {
        var verifyScreen = document.getElementById('sq-otp-verify-screen');
        if (verifyScreen.style.display !== 'none') doVerifyOtp();
      }
    });
  }

  /* ── Inject shake animation ── */
  function injectStyles() {
    if (document.getElementById('sq-otp-styles')) return;
    var style = document.createElement('style');
    style.id = 'sq-otp-styles';
    style.textContent = `
      @keyframes sq-shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)}
        40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)}
        80%{transform:translateX(4px)}
      }
      .sq-verify-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: #6B5DB8;
        background: #EEECf7;
        border: 1px solid rgba(107,93,184,.2);
        border-radius: 999px;
        padding: 6px 14px;
        cursor: pointer;
        font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
        transition: background .2s, border-color .2s;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .sq-verify-btn:hover { background: rgba(107,93,184,.15); border-color: #6B5DB8; }
      .sq-verify-btn.verified {
        color: #16A34A;
        background: #DCFCE7;
        border-color: #86EFAC;
        cursor: default;
        pointer-events: none;
      }
      .sq-verify-btn:disabled { opacity: .5; pointer-events: none; }
      .sq-field-with-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }
      .sq-field-with-btn > .iti {
        flex: 1;
        min-width: 0;
        border-radius: 999px !important;
        overflow: visible !important;
      }
      .sq-field-with-btn > input {
        flex: 1;
        min-width: 0;
        border-radius: 999px !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Mark field as verified in the form UI ── */
  function markFieldVerified(type) {
    var btnId = type === 'email' ? 'sq-verify-email-btn' : 'sq-verify-phone-btn';
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Verified';
    btn.classList.add('verified');

    // Lock the input
    var inputId = type === 'email'
      ? (document.getElementById('email') ? 'email' : document.getElementById('d-email') ? 'd-email' : 'contact-email')
      : (document.getElementById('phone') ? 'phone' : document.getElementById('discovery-phone') ? 'discovery-phone' : 'contact-phone');
    var inp = document.getElementById(inputId);
    if (inp) {
      inp.readOnly = true;
      inp.style.opacity = '.7';
    }
  }

  /* ── Public API ── */
  window.SQOtp = {
    /**
     * init({ emailInputId, phoneInputId, submitBtnId, onBothVerified })
     * Call once per page after DOM ready
     */
    init: function (opts) {
      injectStyles();
      injectModal();

      state.emailVerified = false;
      state.phoneVerified = false;
      state.onBothVerified = opts.onBothVerified || null;

      var emailInput = document.getElementById(opts.emailInputId);
      var phoneInput = document.getElementById(opts.phoneInputId);
      var submitBtn = document.getElementById(opts.submitBtnId);

      /* Disable submit until both verified */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.title = 'Please verify your email and phone first';
      }
      /* Safety fallback — re-enable after 5 mins if something goes wrong */
      setTimeout(function() {
        if (submitBtn && submitBtn.disabled) {
          submitBtn.disabled = false;
          submitBtn.title = '';
        }
      }, 300000);

      /* ── Wrap email field ── */
      if (emailInput) {
        var emailParent = emailInput.parentNode;
        var emailWrapper = document.createElement('div');
        emailWrapper.className = 'sq-field-with-btn';
        emailParent.insertBefore(emailWrapper, emailInput);
        emailWrapper.appendChild(emailInput);

        var emailVerifyBtn = document.createElement('button');
        emailVerifyBtn.type = 'button';
        emailVerifyBtn.id = 'sq-verify-email-btn';
        emailVerifyBtn.className = 'sq-verify-btn';
        emailVerifyBtn.textContent = 'Verify';
        emailWrapper.appendChild(emailVerifyBtn);

        emailVerifyBtn.addEventListener('click', function () {
          var val = emailInput.value.trim();
          var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailReg.test(val)) {
            emailInput.focus();
            emailInput.style.borderColor = '#EF4444';
            setTimeout(function () { emailInput.style.borderColor = ''; }, 2000);
            return;
          }
          openModal('email', val);
        });
      }

      /* ── Wrap phone field ── */
      if (phoneInput) {
        /* ITI wraps the input in a div — find the outermost ITI container or the input itself */
        var phoneWrapper = document.createElement('div');
        phoneWrapper.className = 'sq-field-with-btn';
        var phoneContainer = phoneInput.closest('.iti') || phoneInput;
        var phoneParent = phoneContainer.parentNode;
        phoneParent.insertBefore(phoneWrapper, phoneContainer);
        phoneWrapper.appendChild(phoneContainer);

        var phoneVerifyBtn = document.createElement('button');
        phoneVerifyBtn.type = 'button';
        phoneVerifyBtn.id = 'sq-verify-phone-btn';
        phoneVerifyBtn.className = 'sq-verify-btn';
        phoneVerifyBtn.textContent = 'Verify via WhatsApp';
        phoneWrapper.appendChild(phoneVerifyBtn);

        phoneVerifyBtn.addEventListener('click', function () {
          /* Get full international number from ITI if available */
          var itiInstance = window.iti || window.itiAudit || window.discoveryIti;
          var val = itiInstance ? itiInstance.getNumber() : phoneInput.value.trim();
          if (!val || val.length < 8) {
            phoneInput.focus();
            return;
          }
          openModal('phone', val);
        });
      }

      /* ── Watch both verified → unlock submit ── */
      var pollInterval = setInterval(function () {
        if (state.emailVerified && state.phoneVerified) {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.title = '';
          }
          if (typeof state.onBothVerified === 'function') {
            state.onBothVerified();
            state.onBothVerified = null; // fire once
          }
          clearInterval(pollInterval);
        }
      }, 300);
    },

    isEmailVerified: function () { return state.emailVerified; },
    isPhoneVerified: function () { return state.phoneVerified; },
    isBothVerified: function () { return state.emailVerified && state.phoneVerified; }
  };

})();
