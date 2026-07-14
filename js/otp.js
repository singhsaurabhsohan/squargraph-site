/**
 * SQUARGRAPH OTP Verification
 * Inline email OTP via Supabase Auth. No modal, no mobile OTP.
 */

(function () {
  'use strict';

  var SB_URL = 'https://jzlupkvgizfdwwbofzmu.supabase.co';
  var SB_KEY = 'sb_publishable_IPU4Nh7zQW_OfZr0Tlej6A_gfYhevRl';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var state = {
    email: '',
    sent: false,
    sending: false,
    verified: false,
    verifiedAt: '',
    resendCount: 0,
    timer: null,
    debounce: null,
    input: null,
    panel: null,
    onBothVerified: null
  };

  async function sbRequest(path, body) {
    var res = await fetch(SB_URL + path, {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error_description || data.msg || data.message || 'Verification request failed.');
    return data;
  }

  function sendEmailOtp(email) {
    return sbRequest('/auth/v1/otp', { email: email, create_user: true });
  }

  function verifyEmailOtp(email, token) {
    return sbRequest('/auth/v1/verify', { type: 'email', email: email, token: token });
  }

  function injectStyles() {
    if (document.getElementById('sq-inline-otp-styles')) return;
    var style = document.createElement('style');
    style.id = 'sq-inline-otp-styles';
    style.textContent = [
      '.sq-inline-otp{display:grid;gap:10px;width:100%;margin:10px 0 0;padding:12px;border:1px solid rgba(26,23,20,.1);border-radius:8px;background:rgba(248,246,241,.72);}',
      '.sq-inline-otp[hidden]{display:none!important;}',
      '.sq-inline-otp-sent{color:#3D3935;font-size:12px;line-height:1.45;margin:0;}',
      '.sq-inline-otp-code{display:grid;grid-template-columns:repeat(6,48px);gap:7px;justify-content:start;}',
      '.sq-inline-otp-code input{width:48px;height:44px;border:1px solid #D8D3CA;border-radius:7px;background:#fff;color:#151411;font-family:inherit;font-size:18px;font-weight:800;text-align:center;outline:none;transition:border-color .2s,box-shadow .2s;}',
      '.sq-inline-otp-code input:focus{border-color:#394536;box-shadow:0 0 0 3px rgba(57,69,54,.12);}',
      '.sq-inline-otp-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;}',
      '.sq-inline-otp-verify{min-height:42px;border:1px solid #151411;border-radius:999px;background:#151411;color:#fff;font-family:inherit;font-size:12.5px;font-weight:800;padding:0 17px;cursor:pointer;white-space:nowrap;}',
      '.sq-inline-otp-link{min-height:30px;border:0;background:transparent;color:#394536;font-family:inherit;font-size:11.5px;font-weight:800;padding:0;cursor:pointer;}',
      '.sq-inline-otp-link:disabled,.sq-inline-otp-verify:disabled{opacity:.58;cursor:not-allowed;}',
      '.sq-inline-otp-status{min-height:18px;color:#3D3935;font-size:12px;line-height:1.45;margin:0;}',
      '.sq-inline-otp-status.error{color:#B42318;font-weight:700;}',
      '.sq-inline-otp-status.verified{color:#16733F;font-weight:800;}',
      '.sq-inline-otp-field-verified{opacity:.72!important;}',
      '@media(max-width:760px){.sq-inline-otp-code{grid-template-columns:repeat(6,42px);gap:6px}.sq-inline-otp-code input{width:42px;height:42px;font-size:17px}.sq-inline-otp-verify{width:auto;min-width:154px}}',
      '@media(max-width:380px){.sq-inline-otp{padding:10px}.sq-inline-otp-code{grid-template-columns:repeat(6,38px);gap:5px}.sq-inline-otp-code input{width:38px;height:40px;font-size:16px}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function maskEmail(value) {
    var parts = String(value || '').split('@');
    if (parts.length !== 2) return value || '';
    var local = parts[0];
    var prefix = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
    return prefix + '•••@' + parts[1];
  }

  function findInput(email) {
    if (state.input && document.contains(state.input)) return state.input;
    var inputs = Array.from(document.querySelectorAll('input[type="email"], input[autocomplete="email"]'));
    if (email) {
      var exact = inputs.find(function (input) { return input.value.trim() === email; });
      if (exact) return exact;
    }
    return inputs.find(function (input) { return input.offsetParent !== null; }) || inputs[0] || null;
  }

  function createOtpInput(index) {
    var input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.autocomplete = 'one-time-code';
    input.setAttribute('aria-label', 'Email OTP digit ' + index);
    return input;
  }

  function ensurePanel(input) {
    injectStyles();
    if (!input) return null;
    if (input.dataset.sqOtpBound === 'true' && input._sqOtpPanel) return input._sqOtpPanel;

    var panel = document.createElement('div');
    panel.className = 'sq-inline-otp';
    panel.hidden = true;
    panel.innerHTML =
      '<p class="sq-inline-otp-sent"></p>' +
      '<div class="sq-inline-otp-code" aria-label="Email OTP code"></div>' +
      '<div class="sq-inline-otp-actions">' +
        '<button type="button" class="sq-inline-otp-verify">Verify email code</button>' +
        '<button type="button" class="sq-inline-otp-link sq-inline-otp-resend" disabled>Resend code in 45s</button>' +
        '<button type="button" class="sq-inline-otp-link sq-inline-otp-change">Change email address</button>' +
      '</div>' +
      '<p class="sq-inline-otp-status" aria-live="polite"></p>';

    var code = panel.querySelector('.sq-inline-otp-code');
    for (var i = 1; i <= 6; i += 1) code.appendChild(createOtpInput(i));

    var wrapper = input.closest('.form-field') || input.closest('label') || input.parentNode;
    if (wrapper && wrapper.parentNode) wrapper.parentNode.insertBefore(panel, wrapper.nextSibling);
    else input.insertAdjacentElement('afterend', panel);

    input.dataset.sqOtpBound = 'true';
    input._sqOtpPanel = panel;
    bindPanel(panel, input);
    return panel;
  }

  function otpInputs(panel) {
    return Array.from(panel.querySelectorAll('.sq-inline-otp-code input'));
  }

  function clearOtpInputs(panel) {
    otpInputs(panel).forEach(function (input) {
      input.value = '';
      input.disabled = false;
    });
  }

  function collectOtp(panel) {
    return otpInputs(panel).map(function (input) { return input.value; }).join('');
  }

  function setStatus(panel, message, mode) {
    var status = panel.querySelector('.sq-inline-otp-status');
    status.textContent = message || '';
    status.classList.toggle('error', mode === 'error');
    status.classList.toggle('verified', mode === 'verified');
  }

  function startResendTimer(panel) {
    var btn = panel.querySelector('.sq-inline-otp-resend');
    var seconds = 45;
    clearInterval(state.timer);
    btn.disabled = true;
    btn.textContent = 'Resend code in ' + seconds + 's';
    state.timer = setInterval(function () {
      seconds -= 1;
      if (seconds <= 0) {
        clearInterval(state.timer);
        if (state.resendCount >= 3) {
          btn.disabled = true;
          btn.textContent = 'Resend limit reached';
          return;
        }
        btn.disabled = false;
        btn.textContent = 'Resend code';
        return;
      }
      btn.textContent = 'Resend code in ' + seconds + 's';
    }, 1000);
  }

  function resetEmailState(input, keepValue) {
    clearTimeout(state.debounce);
    clearInterval(state.timer);
    state.email = '';
    state.sent = false;
    state.sending = false;
    state.verified = false;
    state.verifiedAt = '';
    state.resendCount = 0;
    if (!input) input = state.input;
    if (input) {
      input.readOnly = false;
      input.classList.remove('sq-inline-otp-field-verified');
      if (!keepValue) input.value = '';
      if (input._sqOtpPanel) {
        clearOtpInputs(input._sqOtpPanel);
        input._sqOtpPanel.hidden = true;
        setStatus(input._sqOtpPanel, '', '');
      }
    }
  }

  async function sendInlineEmailOtp(input, isResend) {
    input = input || findInput();
    if (!input) return false;
    var panel = ensurePanel(input);
    var email = input.value.trim();

    if (!EMAIL_RE.test(email)) {
      setStatus(panel, 'Enter a valid email address to receive the OTP.', 'error');
      input.focus();
      return false;
    }

    if (!isResend && state.sent && state.email === email) {
      panel.hidden = false;
      return true;
    }

    if (isResend && state.resendCount >= 3) {
      setStatus(panel, 'Maximum resend attempts reached. Change the email address or continue on WhatsApp.', 'error');
      return false;
    }

    if (state.sending) return false;
    if (isResend) state.resendCount += 1;

    state.input = input;
    state.panel = panel;
    state.sending = true;
    panel.hidden = false;
    setStatus(panel, isResend ? 'Resending verification code...' : 'Sending verification code...', '');

    try {
      await sendEmailOtp(email);
      state.email = email;
      state.sent = true;
      state.verified = false;
      input.readOnly = true;
      panel.querySelector('.sq-inline-otp-sent').textContent = 'OTP sent to ' + maskEmail(email);
      clearOtpInputs(panel);
      startResendTimer(panel);
      setStatus(panel, 'Enter the six-digit code from your email.', '');
      setTimeout(function () {
        var first = otpInputs(panel)[0];
        if (first) first.focus();
      }, 80);
      return true;
    } catch (err) {
      setStatus(panel, err.message || 'OTP could not be sent. Please try again.', 'error');
      return false;
    } finally {
      state.sending = false;
    }
  }

  async function verifyInlineEmailOtp(input) {
    input = input || state.input || findInput();
    var panel = input && input._sqOtpPanel ? input._sqOtpPanel : state.panel;
    if (!input || !panel) return false;

    var token = collectOtp(panel);
    var btn = panel.querySelector('.sq-inline-otp-verify');
    if (!/^\d{6}$/.test(token)) {
      setStatus(panel, 'Enter the six-digit OTP.', 'error');
      return false;
    }

    btn.disabled = true;
    btn.textContent = 'Verifying...';
    setStatus(panel, '', '');

    try {
      await verifyEmailOtp(state.email || input.value.trim(), token);
      state.verified = true;
      state.verifiedAt = new Date().toISOString();
      clearInterval(state.timer);
      otpInputs(panel).forEach(function (otpInput) { otpInput.disabled = true; });
      input.classList.add('sq-inline-otp-field-verified');
      btn.textContent = 'Email verified';
      panel.querySelector('.sq-inline-otp-resend').disabled = true;
      panel.querySelector('.sq-inline-otp-resend').textContent = 'Verified';
      setStatus(panel, '✓ Email verified', 'verified');
      if (typeof state.onBothVerified === 'function') state.onBothVerified();
      return true;
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Verify email code';
      setStatus(panel, err.message || 'OTP verification failed. Please check the code.', 'error');
      return false;
    }
  }

  function bindPanel(panel, input) {
    otpInputs(panel).forEach(function (otpInput, index, inputs) {
      otpInput.addEventListener('input', function () {
        var digits = otpInput.value.replace(/\D/g, '');
        if (digits.length > 1) {
          digits.slice(0, inputs.length).split('').forEach(function (digit, offset) {
            var target = inputs[index + offset];
            if (target) target.value = digit;
          });
        } else {
          otpInput.value = digits;
        }
        if (otpInput.value && inputs[index + 1]) inputs[index + 1].focus();
      });

      otpInput.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && !otpInput.value && inputs[index - 1]) inputs[index - 1].focus();
      });

      otpInput.addEventListener('paste', function (event) {
        event.preventDefault();
        var digits = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
        digits.split('').forEach(function (digit, digitIndex) {
          if (inputs[digitIndex]) inputs[digitIndex].value = digit;
        });
        var target = inputs[Math.min(digits.length, inputs.length) - 1];
        if (target) target.focus();
      });
    });

    panel.querySelector('.sq-inline-otp-verify').addEventListener('click', function () {
      verifyInlineEmailOtp(input);
    });

    panel.querySelector('.sq-inline-otp-resend').addEventListener('click', function () {
      sendInlineEmailOtp(input, true);
    });

    panel.querySelector('.sq-inline-otp-change').addEventListener('click', function () {
      resetEmailState(input, false);
      input.focus();
    });
  }

  function scheduleAutoSend(input, delay) {
    if (!input || input.readOnly) return;
    clearTimeout(state.debounce);
    var email = input.value.trim();
    if (!email) return;

    if (state.verified && state.email === email) return;

    if (!EMAIL_RE.test(email)) {
      if (email.length > 5) {
        var panel = ensurePanel(input);
        setStatus(panel, 'Enter a valid email address to receive the OTP.', 'error');
      }
      return;
    }

    var panel = ensurePanel(input);
    setStatus(panel, '', '');
    state.debounce = setTimeout(function () {
      sendInlineEmailOtp(input, false);
    }, typeof delay === 'number' ? delay : 900);
  }

  function bindEmailInput(input) {
    if (!input || input.dataset.sqInlineOtpInput === 'true') return;
    input.dataset.sqInlineOtpInput = 'true';
    ensurePanel(input);

    input.addEventListener('input', function () {
      if ((state.sent || state.verified) && input.value.trim() !== state.email) resetEmailState(input, true);
      scheduleAutoSend(input, 900);
    });

    input.addEventListener('blur', function () {
      scheduleAutoSend(input, 0);
    });
  }

  function bindAllEmailInputs() {
    Array.from(document.querySelectorAll('input[type="email"], input[autocomplete="email"]')).forEach(bindEmailInput);
  }

  window.SQOtp = {
    init: function (opts) {
      opts = opts || {};
      state.onBothVerified = opts.onBothVerified || null;
      if (opts.emailInputId) bindEmailInput(document.getElementById(opts.emailInputId));
      bindAllEmailInputs();
    },
    isEmailVerified: function (email) {
      var input = findInput(email);
      var value = email || (input ? input.value.trim() : state.email);
      return Boolean(state.verified && state.email && state.email === value);
    },
    isPhoneVerified: function () {
      return true;
    },
    isBothVerified: function () {
      return this.isEmailVerified();
    },
    verifyEmail: function (email) {
      var input = findInput(email);
      if (!input) return false;
      bindEmailInput(input);
      if (email && input.value.trim() !== email) input.value = email;
      if (this.isEmailVerified(input.value.trim())) return true;
      sendInlineEmailOtp(input, false);
      return false;
    },
    resetEmail: function () {
      resetEmailState(state.input, false);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAllEmailInputs);
  } else {
    bindAllEmailInputs();
  }
})();
