(function () {
  'use strict';

  var client;
  var els = {};
  var path = window.location.pathname.replace(/\/+$/, '') || '/login';

  function cacheElements() {
    [
      'auth-eyebrow', 'auth-title', 'auth-intro', 'login-panel', 'forgot-panel',
      'password-setup-panel', 'auth-result-panel', 'password-login-form',
      'magic-login-form', 'google-login-button', 'forgot-form',
      'password-setup-form', 'login-email', 'login-password', 'magic-email',
      'forgot-email', 'setup-name', 'setup-password', 'setup-confirm',
      'password-strength', 'auth-message', 'result-title', 'result-copy',
      'result-action'
    ].forEach(function (id) { els[id] = document.getElementById(id); });
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
    }
  }

  function setMessage(message, success) {
    els['auth-message'].textContent = message || '';
    els['auth-message'].classList.toggle('success', Boolean(success));
  }

  function setBusy(button, busy, busyText) {
    if (!button) return;
    if (busy) {
      button.dataset.label = button.textContent;
      button.textContent = busyText || 'Working...';
      button.disabled = true;
      return;
    }
    button.textContent = button.dataset.label || button.textContent;
    button.disabled = false;
  }

  function validEmail(value) {
    return /^\S+@\S+\.\S+$/.test(String(value || '').trim());
  }

  function appDestination() {
    var next = new URLSearchParams(window.location.search).get('next');
    return next && /^\/app(?:\/|$)/.test(next) ? next : '/app/dashboard';
  }

  function initClient() {
    if (!window.supabase || !window.SQ || !window.SQ.config) {
      throw new Error('The secure authentication client could not be loaded.');
    }
    client = window.supabase.createClient(window.SQ.config.supabaseUrl, window.SQ.config.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'sq-os-auth'
      }
    });
  }

  function showOnly(panel) {
    ['login-panel', 'forgot-panel', 'password-setup-panel', 'auth-result-panel'].forEach(function (id) {
      els[id].hidden = id !== panel;
    });
  }

  function configureRoute() {
    if (path === '/forgot-password') {
      document.title = 'Reset password | SQUARGRAPH OS';
      els['auth-eyebrow'].textContent = 'ACCOUNT RECOVERY';
      els['auth-title'].textContent = 'Reset your password';
      els['auth-intro'].textContent = 'Enter your authorised workspace email. We will send a secure recovery link.';
      showOnly('forgot-panel');
      return;
    }
    if (path === '/register' || path === '/reset-password') {
      var invited = path === '/register';
      document.title = (invited ? 'Accept invitation' : 'Choose a new password') + ' | SQUARGRAPH OS';
      els['auth-eyebrow'].textContent = invited ? 'INVITED ACCESS' : 'ACCOUNT RECOVERY';
      els['auth-title'].textContent = invited ? 'Secure your workspace account' : 'Choose a new password';
      els['auth-intro'].textContent = invited
        ? 'Complete your invited profile and set a strong password to enter SQUARGRAPH OS.'
        : 'Set a strong password for your authorised workspace account.';
      showOnly('password-setup-panel');
      return;
    }
    if (path === '/logout') {
      document.title = 'Signing out | SQUARGRAPH OS';
      els['auth-title'].textContent = 'Signing out securely';
      els['auth-intro'].textContent = 'Your local workspace session is being closed.';
      showOnly('auth-result-panel');
      els['result-title'].textContent = 'Signing out';
      els['result-copy'].textContent = 'Please wait a moment.';
      els['result-action'].hidden = true;
      return;
    }
    showOnly('login-panel');
  }

  async function hasWorkspaceAccess(userId) {
    var membership = await client.from('os_members').select('status').eq('user_id', userId).eq('status', 'active').maybeSingle();
    return !membership.error && Boolean(membership.data);
  }

  async function redirectAuthorisedSession() {
    var result = await client.auth.getSession();
    if (result.error || !result.data.session || path !== '/login') return;
    if (await hasWorkspaceAccess(result.data.session.user.id)) window.location.replace(appDestination());
  }

  async function handlePasswordLogin(event) {
    event.preventDefault();
    var email = els['login-email'].value.trim().toLowerCase();
    var password = els['login-password'].value;
    var button = event.currentTarget.querySelector('[type="submit"]');
    if (!validEmail(email) || !password) {
      setMessage('Enter your authorised email address and password.');
      return;
    }
    setBusy(button, true, 'Signing in...');
    setMessage('');
    var result = await client.auth.signInWithPassword({ email: email, password: password });
    if (result.error || !result.data.user) {
      setBusy(button, false);
      setMessage((result.error && result.error.message) || 'Sign-in failed.');
      return;
    }
    if (!(await hasWorkspaceAccess(result.data.user.id))) {
      await client.auth.signOut({ scope: 'local' });
      setBusy(button, false);
      setMessage('This account is authenticated but does not have active workspace access.');
      return;
    }
    window.location.replace(appDestination());
  }

  async function handleMagicLogin(event) {
    event.preventDefault();
    var email = els['magic-email'].value.trim().toLowerCase();
    var button = event.currentTarget.querySelector('[type="submit"]');
    if (!validEmail(email)) {
      setMessage('Enter a valid authorised email address.');
      return;
    }
    setBusy(button, true, 'Sending link...');
    setMessage('');
    var result = await client.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin + appDestination() }
    });
    setBusy(button, false);
    if (result.error) {
      setMessage(result.error.message || 'The magic link could not be sent.');
      return;
    }
    showOnly('auth-result-panel');
    els['result-title'].textContent = 'Check your email';
    els['result-copy'].textContent = 'A secure sign-in link was sent to ' + email + '.';
  }

  async function handleGoogleLogin() {
    setBusy(els['google-login-button'], true, 'Opening Google...');
    setMessage('');
    var result = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + appDestination() }
    });
    if (result.error) {
      setBusy(els['google-login-button'], false);
      setMessage(result.error.message || 'Google sign-in could not be started.');
    }
  }

  async function handleForgot(event) {
    event.preventDefault();
    var email = els['forgot-email'].value.trim().toLowerCase();
    var button = event.currentTarget.querySelector('[type="submit"]');
    if (!validEmail(email)) {
      setMessage('Enter a valid authorised email address.');
      return;
    }
    setBusy(button, true, 'Sending link...');
    var result = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    setBusy(button, false);
    if (result.error) {
      setMessage(result.error.message || 'The recovery link could not be sent.');
      return;
    }
    showOnly('auth-result-panel');
    els['result-title'].textContent = 'Check your email';
    els['result-copy'].textContent = 'If the address belongs to an authorised account, a password reset link is on its way.';
  }

  function passwordScore(password) {
    return [password.length >= 12, /[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)]
      .filter(Boolean).length;
  }

  function updatePasswordStrength() {
    var score = passwordScore(els['setup-password'].value);
    var colors = ['#a13b32', '#a13b32', '#b67a24', '#b67a24', '#58725e', '#344b3a'];
    els['password-strength'].style.setProperty('--strength', (score * 20) + '%');
    els['password-strength'].style.setProperty('--strength-color', colors[score]);
  }

  async function handlePasswordSetup(event) {
    event.preventDefault();
    var password = els['setup-password'].value;
    var confirmation = els['setup-confirm'].value;
    var fullName = els['setup-name'].value.trim();
    var button = event.currentTarget.querySelector('[type="submit"]');
    var sessionResult = await client.auth.getSession();
    if (!sessionResult.data.session) {
      setMessage('Open this page from the secure invitation or recovery link in your email.');
      return;
    }
    if (passwordScore(password) < 5) {
      setMessage('Use at least 12 characters with upper and lowercase letters, a number and a symbol.');
      return;
    }
    if (password !== confirmation) {
      setMessage('The passwords do not match.');
      return;
    }
    setBusy(button, true, 'Securing account...');
    var update = await client.auth.updateUser({ password: password, data: fullName ? { full_name: fullName } : {} });
    if (update.error) {
      setBusy(button, false);
      setMessage(update.error.message || 'The password could not be updated.');
      return;
    }
    if (fullName) await client.from('os_profiles').upsert({ user_id: update.data.user.id, full_name: fullName }, { onConflict: 'user_id' });
    window.location.replace('/app/dashboard');
  }

  async function handleLogout() {
    await client.auth.signOut({ scope: 'local' });
    window.location.replace('/login?signed_out=1');
  }

  function bindEvents() {
    document.querySelectorAll('[data-auth-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        var tab = button.dataset.authTab;
        document.querySelectorAll('[data-auth-tab]').forEach(function (item) {
          var active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-auth-panel]').forEach(function (panel) { panel.hidden = panel.dataset.authPanel !== tab; });
        setMessage('');
      });
    });
    document.querySelectorAll('[data-password-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var input = document.getElementById(button.dataset.passwordToggle);
        var visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
        button.innerHTML = '<i data-lucide="' + (visible ? 'eye' : 'eye-off') + '" aria-hidden="true"></i>';
        refreshIcons();
      });
    });
    els['password-login-form'].addEventListener('submit', handlePasswordLogin);
    els['magic-login-form'].addEventListener('submit', handleMagicLogin);
    els['google-login-button'].addEventListener('click', handleGoogleLogin);
    els['forgot-form'].addEventListener('submit', handleForgot);
    els['password-setup-form'].addEventListener('submit', handlePasswordSetup);
    els['setup-password'].addEventListener('input', updatePasswordStrength);
  }

  async function init() {
    cacheElements();
    configureRoute();
    bindEvents();
    refreshIcons();
    try {
      initClient();
      if (path === '/logout') {
        await handleLogout();
        return;
      }
      await redirectAuthorisedSession();
      if (new URLSearchParams(window.location.search).get('signed_out')) setMessage('You have been signed out securely.', true);
    } catch (error) {
      setMessage(error.message || 'Authentication could not be initialised.');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
