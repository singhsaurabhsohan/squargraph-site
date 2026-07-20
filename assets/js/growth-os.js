(function () {
  'use strict';

  var STAGES = [
    'New', 'Qualified', 'Researching', 'Outreach Ready', 'Contacted', 'Replied',
    'Discovery Scheduled', 'Proposal Requested', 'Proposal Sent', 'Negotiation',
    'Won', 'Lost', 'Dormant'
  ];

  var SCORE_FIELDS = [
    { key: 'strategic_fit', label: 'Strategic fit', help: 'How closely the requirement matches SQUARGRAPH direction.' },
    { key: 'capability_fit', label: 'Capability fit', help: 'Ability to solve the requirement with credible capability.' },
    { key: 'proof_available', label: 'Proof available', help: 'Strength of relevant work, experience or evidence.' },
    { key: 'budget_potential', label: 'Budget potential', help: 'Likelihood of commercially viable investment.' },
    { key: 'decision_maker_access', label: 'Decision-maker access', help: 'Quality of access to the person shaping the decision.' },
    { key: 'urgency', label: 'Urgency', help: 'Clarity and immediacy of the need.' },
    { key: 'recurring_potential', label: 'Recurring potential', help: 'Potential to become a longer operating relationship.' },
    { key: 'reputational_value', label: 'Reputational value', help: 'Strategic value of the work beyond immediate revenue.' },
    { key: 'delivery_risk', label: 'Delivery risk', help: 'Higher scores reduce the final fit score.' }
  ];

  var DRAFT_TYPES = [
    { key: 'linkedin_comment', label: 'LinkedIn comment', placeholder: 'A useful public response that adds perspective without pitching.' },
    { key: 'dm', label: 'Direct message', placeholder: 'A concise private note grounded in the visible requirement.' },
    { key: 'email', label: 'Email', placeholder: 'A focused email that connects the requirement to a relevant next move.' }
  ];

  var VIEW_META = {
    dashboard: ['OPERATING VIEW', 'Pipeline dashboard'],
    pipeline: ['CRM PIPELINE', 'Opportunities by stage'],
    leads: ['OPPORTUNITY INBOX', 'Lead list'],
    followups: ['ACTION QUEUE', 'Follow-ups']
  };

  var state = {
    client: null,
    session: null,
    member: null,
    opportunities: [],
    currentId: null,
    activities: [],
    messages: [],
    view: 'dashboard',
    query: '',
    lastFocus: null
  };

  var els = {};

  function cacheElements() {
    [
      'auth-shell', 'workspace', 'login-form', 'login-email', 'send-code-button',
      'otp-form', 'otp-inputs', 'otp-caption', 'verify-code-button', 'change-email-button',
      'auth-message', 'sidebar', 'sidebar-toggle', 'member-name', 'member-role',
      'sign-out-button', 'view-eyebrow', 'view-title', 'global-search',
      'add-opportunity-button', 'system-banner', 'nav-due-count', 'metric-active',
      'metric-due', 'metric-overdue', 'metric-priority', 'metric-won', 'priority-list',
      'dashboard-due-list', 'stage-summary', 'pipeline-board', 'pipeline-priority-filter',
      'lead-status-filter', 'lead-priority-filter', 'lead-count', 'lead-table-body',
      'followup-groups', 'opportunity-modal', 'opportunity-form', 'opportunity-form-message',
      'record-panel', 'close-record-button', 'record-source', 'record-title',
      'record-requirement', 'record-summary', 'record-overview-form', 'record-status',
      'record-value', 'record-next-action', 'record-follow-up', 'record-probability',
      'record-notes', 'record-outcome', 'outcome-field', 'qualification-form',
      'qualification-score', 'qualification-priority', 'score-grid', 'research-form',
      'draft-list', 'activity-list', 'note-form', 'activity-note'
    ].forEach(function (id) {
      els[id] = document.getElementById(id);
    });
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      var url = new URL(value);
      return /^https?:$/.test(url.protocol) ? url.href : '';
    } catch (error) {
      return '';
    }
  }

  function normalizeUrl(value) {
    var url = String(value || '').trim();
    return url ? url.replace(/\/+$/, '') : '';
  }

  function setMessage(element, message, success) {
    if (!element) return;
    element.textContent = message || '';
    element.classList.toggle('success', Boolean(success));
  }

  function setBusy(button, busy, busyText) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = busyText || 'Working...';
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function showBanner(message) {
    els['system-banner'].textContent = message;
    els['system-banner'].hidden = !message;
  }

  function emptyState(message) {
    return '<div class="empty-state"><i data-lucide="circle-dashed" aria-hidden="true"></i><p>' + escapeHtml(message || 'No opportunities here yet.') + '</p></div>';
  }

  function priorityClass(priority) {
    if (priority === 'Priority A') return 'priority-a';
    if (priority === 'Priority B') return 'priority-b';
    if (priority === 'Priority C') return 'priority-c';
    return 'priority-skip';
  }

  function priorityRank(priority) {
    return { 'Priority A': 0, 'Priority B': 1, 'Priority C': 2, 'Skip': 3 }[priority] == null ? 4 : { 'Priority A': 0, 'Priority B': 1, 'Priority C': 2, 'Skip': 3 }[priority];
  }

  function formatMoney(value) {
    var amount = Number(value || 0);
    if (!Number.isFinite(amount)) amount = 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  function formatDate(value, includeTime) {
    if (!value) return 'Not set';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not set';
    var options = { day: '2-digit', month: 'short', year: 'numeric' };
    if (includeTime) { options.hour = '2-digit'; options.minute = '2-digit'; }
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  }

  function toLocalInput(value) {
    if (!value) return '';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    var local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function getCompany(opportunity) {
    return opportunity.company || {};
  }

  function getContact(opportunity) {
    return opportunity.contact || {};
  }

  function scoreFromValues(values) {
    var total = 0;
    SCORE_FIELDS.forEach(function (field) {
      var value = Number(values[field.key] || 0);
      total += field.key === 'delivery_risk' ? 5 - value : value;
    });
    return Math.round((total / 45) * 100);
  }

  function priorityFromScore(score) {
    if (score >= 75) return 'Priority A';
    if (score >= 55) return 'Priority B';
    if (score >= 35) return 'Priority C';
    return 'Skip';
  }

  function isWriteMember() {
    return state.member && ['owner', 'admin', 'member'].indexOf(state.member.role) !== -1;
  }

  function currentOpportunity() {
    return state.opportunities.find(function (item) { return item.id === state.currentId; }) || null;
  }

  function getVisibleOpportunities() {
    var query = state.query.toLowerCase().trim();
    if (!query) return state.opportunities.slice();
    return state.opportunities.filter(function (opportunity) {
      var haystack = [
        opportunity.requirement,
        opportunity.opportunity_type,
        opportunity.source,
        getCompany(opportunity).name,
        getContact(opportunity).full_name,
        getContact(opportunity).email
      ].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function initClient() {
    if (!window.supabase || !window.SQ || !window.SQ.config) {
      throw new Error('The secure client could not be loaded. Refresh and try again.');
    }
    state.client = window.supabase.createClient(
      window.SQ.config.supabaseUrl,
      window.SQ.config.supabaseKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: 'sq-growth-os-auth'
        }
      }
    );
  }

  async function initialiseSession() {
    var result = await state.client.auth.getSession();
    if (result.error) throw result.error;
    if (result.data.session) await authoriseSession(result.data.session);
    else showAuth();

    state.client.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_OUT') showAuth();
      if (event === 'TOKEN_REFRESHED' && session) state.session = session;
    });
  }

  function showAuth() {
    state.session = null;
    state.member = null;
    els.workspace.hidden = true;
    els['auth-shell'].hidden = false;
    document.body.classList.remove('modal-open');
    window.setTimeout(function () { els['login-email'].focus(); }, 0);
  }

  async function authoriseSession(session) {
    state.session = session;
    var membership = await state.client
      .from('growth_members')
      .select('user_id,email,display_name,role,active')
      .eq('user_id', session.user.id)
      .eq('active', true)
      .maybeSingle();

    if (membership.error || !membership.data) {
      await state.client.auth.signOut({ scope: 'local' });
      var missingTable = membership.error && (membership.error.code === '42P01' || membership.error.code === 'PGRST205');
      setMessage(
        els['auth-message'],
        missingTable
          ? 'Growth OS is not provisioned yet. Run supabase/growth_os.sql before signing in.'
          : 'This email is authenticated but is not authorised for Growth OS.',
        false
      );
      showAuth();
      return;
    }

    state.member = membership.data;
    els['member-name'].textContent = state.member.display_name || state.member.email;
    els['member-role'].textContent = state.member.role;
    els['auth-shell'].hidden = true;
    els.workspace.hidden = false;
    if (!isWriteMember()) {
      els['add-opportunity-button'].hidden = true;
      showBanner('Viewer access is read-only. Ask an owner to change your Growth OS role before editing.');
    }
    await loadOpportunities();
  }

  async function handleLogin(event) {
    event.preventDefault();
    var email = els['login-email'].value.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage(els['auth-message'], 'Enter a valid authorised email address.', false);
      return;
    }
    setBusy(els['send-code-button'], true, 'Sending...');
    setMessage(els['auth-message'], '', false);
    var result = await state.client.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: false }
    });
    setBusy(els['send-code-button'], false);
    if (result.error) {
      setMessage(els['auth-message'], result.error.message || 'The access code could not be sent.', false);
      return;
    }
    els['login-form'].hidden = true;
    els['otp-form'].hidden = false;
    els['otp-caption'].textContent = 'Access code sent to ' + maskEmail(email) + '.';
    els['otp-form'].dataset.email = email;
    var first = els['otp-inputs'].querySelector('input');
    if (first) first.focus();
    setMessage(els['auth-message'], 'Check your inbox for the six-digit access code.', true);
  }

  function maskEmail(email) {
    var parts = email.split('@');
    var name = parts[0] || '';
    return (name.slice(0, 2) || '*') + '***@' + (parts[1] || '');
  }

  async function handleOtp(event) {
    event.preventDefault();
    var inputs = Array.prototype.slice.call(els['otp-inputs'].querySelectorAll('input'));
    var token = inputs.map(function (input) { return input.value; }).join('');
    var email = els['otp-form'].dataset.email || '';
    if (!/^\d{6}$/.test(token)) {
      setMessage(els['auth-message'], 'Enter the complete six-digit access code.', false);
      return;
    }
    setBusy(els['verify-code-button'], true, 'Verifying...');
    var result = await state.client.auth.verifyOtp({ email: email, token: token, type: 'email' });
    setBusy(els['verify-code-button'], false);
    if (result.error || !result.data.session) {
      setMessage(els['auth-message'], (result.error && result.error.message) || 'The code could not be verified.', false);
      return;
    }
    await authoriseSession(result.data.session);
  }

  function resetLogin() {
    els['login-form'].hidden = false;
    els['otp-form'].hidden = true;
    els['otp-form'].dataset.email = '';
    Array.prototype.forEach.call(els['otp-inputs'].querySelectorAll('input'), function (input) { input.value = ''; });
    setMessage(els['auth-message'], '', false);
    els['login-email'].focus();
  }

  function initOtpInputs() {
    var inputs = Array.prototype.slice.call(els['otp-inputs'].querySelectorAll('input'));
    inputs.forEach(function (input, index) {
      input.addEventListener('input', function () {
        input.value = input.value.replace(/\D/g, '').slice(-1);
        if (input.value && inputs[index + 1]) inputs[index + 1].focus();
        if (inputs.every(function (field) { return field.value; })) els['otp-form'].requestSubmit();
      });
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && !input.value && inputs[index - 1]) inputs[index - 1].focus();
      });
      input.addEventListener('paste', function (event) {
        var pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length !== 6) return;
        event.preventDefault();
        inputs.forEach(function (field, position) { field.value = pasted[position] || ''; });
        inputs[5].focus();
        els['otp-form'].requestSubmit();
      });
    });
  }

  async function loadOpportunities() {
    showBanner('Loading pipeline...');
    var result = await state.client
      .from('growth_opportunities')
      .select('*,company:growth_companies(id,name,website,linkedin_url,location),contact:growth_contacts(id,full_name,title,email,phone,linkedin_url,is_decision_maker)')
      .order('updated_at', { ascending: false })
      .limit(500);
    if (result.error) {
      showBanner('Pipeline data could not be loaded: ' + result.error.message);
      return;
    }
    state.opportunities = result.data || [];
    if (isWriteMember()) showBanner('');
    renderAll();
  }

  function renderAll() {
    renderMetrics();
    renderPriorityList();
    renderDashboardDue();
    renderStageSummary();
    renderPipeline();
    renderLeadTable();
    renderFollowups();
    refreshIcons();
  }

  function activeItems() {
    return state.opportunities.filter(function (item) { return ['Won', 'Lost', 'Dormant'].indexOf(item.status) === -1; });
  }

  function followupState(opportunity) {
    if (!opportunity.follow_up_date) return 'none';
    var due = new Date(opportunity.follow_up_date);
    var now = new Date();
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var tomorrow = new Date(todayStart.getTime() + 86400000);
    if (due < todayStart) return 'overdue';
    if (due < tomorrow) return 'today';
    return 'upcoming';
  }

  function renderMetrics() {
    var active = activeItems();
    var due = active.filter(function (item) { return followupState(item) === 'today'; });
    var overdue = active.filter(function (item) { return followupState(item) === 'overdue'; });
    var priority = active.filter(function (item) { return item.priority === 'Priority A'; });
    var won = state.opportunities.filter(function (item) { return item.status === 'Won'; })
      .reduce(function (sum, item) { return sum + Number(item.estimated_value || 0); }, 0);
    els['metric-active'].textContent = String(active.length);
    els['metric-due'].textContent = String(due.length);
    els['metric-overdue'].textContent = overdue.length + ' overdue';
    els['metric-priority'].textContent = String(priority.length);
    els['metric-won'].textContent = formatMoney(won).replace('₹', 'INR ');
    els['nav-due-count'].textContent = String(due.length + overdue.length);
  }

  function renderPriorityList() {
    var items = activeItems().slice().sort(function (a, b) {
      return priorityRank(a.priority) - priorityRank(b.priority) || Number(b.fit_score) - Number(a.fit_score);
    }).slice(0, 8);
    if (!items.length) {
      els['priority-list'].innerHTML = emptyState('Add the first opportunity to begin qualification.');
      return;
    }
    els['priority-list'].innerHTML = items.map(function (item) {
      return '<article class="opportunity-row" tabindex="0" role="button" data-open-record="' + escapeHtml(item.id) + '">' +
        '<div class="row-primary"><strong>' + escapeHtml(getCompany(item).name || 'Unassigned company') + '</strong><span>' + escapeHtml(item.requirement) + '</span></div>' +
        '<span class="row-meta">' + escapeHtml(getContact(item).full_name || 'No contact') + '</span>' +
        '<span class="priority-pill ' + priorityClass(item.priority) + '">' + escapeHtml(item.priority) + '</span>' +
        '<span class="stage-pill">' + escapeHtml(item.status) + '</span>' +
        '<i class="row-arrow" data-lucide="arrow-up-right" aria-hidden="true"></i>' +
      '</article>';
    }).join('');
  }

  function dueItems() {
    return activeItems().filter(function (item) { return item.follow_up_date; }).sort(function (a, b) {
      return new Date(a.follow_up_date) - new Date(b.follow_up_date);
    });
  }

  function renderDashboardDue() {
    var items = dueItems().filter(function (item) { return ['overdue', 'today'].indexOf(followupState(item)) !== -1; }).slice(0, 6);
    if (!items.length) {
      els['dashboard-due-list'].innerHTML = emptyState('No actions are due today.');
      return;
    }
    els['dashboard-due-list'].innerHTML = items.map(renderDueRow).join('');
  }

  function renderDueRow(item) {
    var status = followupState(item);
    return '<article class="due-row" tabindex="0" role="button" data-open-record="' + escapeHtml(item.id) + '">' +
      '<span class="due-date ' + (status === 'overdue' ? 'overdue' : '') + '">' + escapeHtml(status === 'overdue' ? 'Overdue' : formatDate(item.follow_up_date, true)) + '</span>' +
      '<div class="row-primary"><strong>' + escapeHtml(getCompany(item).name || 'Unassigned company') + '</strong><span>' + escapeHtml(item.next_action || 'Follow up') + '</span></div>' +
      '<i class="row-arrow" data-lucide="arrow-up-right" aria-hidden="true"></i>' +
    '</article>';
  }

  function renderStageSummary() {
    var counts = {};
    state.opportunities.forEach(function (item) { counts[item.status] = (counts[item.status] || 0) + 1; });
    var max = Math.max.apply(null, STAGES.map(function (stage) { return counts[stage] || 0; }).concat([1]));
    var visible = STAGES.filter(function (stage) { return counts[stage]; }).slice(0, 7);
    if (!visible.length) {
      els['stage-summary'].innerHTML = emptyState('Stage distribution will appear here.');
      return;
    }
    els['stage-summary'].innerHTML = visible.map(function (stage) {
      var count = counts[stage] || 0;
      return '<div class="stage-summary-row"><span>' + escapeHtml(stage) + '</span><div class="stage-bar"><span style="width:' + Math.round((count / max) * 100) + '%"></span></div><strong>' + count + '</strong></div>';
    }).join('');
  }

  function renderPipeline() {
    var priority = els['pipeline-priority-filter'].value;
    var items = getVisibleOpportunities().filter(function (item) { return !priority || item.priority === priority; });
    els['pipeline-board'].innerHTML = STAGES.map(function (stage) {
      var stageItems = items.filter(function (item) { return item.status === stage; });
      return '<section class="pipeline-column" aria-label="' + escapeHtml(stage) + '">' +
        '<header class="pipeline-column-header"><h3>' + escapeHtml(stage) + '</h3><span>' + stageItems.length + '</span></header>' +
        '<div class="pipeline-stack">' + (stageItems.length ? stageItems.map(renderPipelineCard).join('') : emptyState('No opportunities')) + '</div>' +
      '</section>';
    }).join('');
  }

  function renderPipelineCard(item) {
    var followup = followupState(item);
    return '<article class="pipeline-card" tabindex="0" role="button" data-open-record="' + escapeHtml(item.id) + '">' +
      '<div class="pipeline-card-top"><span class="priority-pill ' + priorityClass(item.priority) + '">' + escapeHtml(item.priority) + '</span><strong>' + escapeHtml(String(item.fit_score || 0)) + '</strong></div>' +
      '<h4>' + escapeHtml(getCompany(item).name || 'Unassigned company') + '</h4>' +
      '<p>' + escapeHtml(item.requirement) + '</p>' +
      '<div class="pipeline-card-footer"><span>' + escapeHtml(getContact(item).full_name || item.source) + '</span><span class="' + (followup === 'overdue' ? 'due-date overdue' : '') + '">' + escapeHtml(item.follow_up_date ? formatDate(item.follow_up_date, false) : 'No follow-up') + '</span></div>' +
    '</article>';
  }

  function renderLeadTable() {
    var status = els['lead-status-filter'].value;
    var priority = els['lead-priority-filter'].value;
    var items = getVisibleOpportunities().filter(function (item) {
      return (!status || item.status === status) && (!priority || item.priority === priority);
    });
    els['lead-count'].textContent = items.length + (items.length === 1 ? ' opportunity' : ' opportunities');
    if (!items.length) {
      els['lead-table-body'].innerHTML = '<tr><td colspan="6">' + emptyState('No opportunities match these filters.') + '</td></tr>';
      return;
    }
    els['lead-table-body'].innerHTML = items.map(function (item) {
      var contact = getContact(item);
      return '<tr tabindex="0" data-open-record="' + escapeHtml(item.id) + '">' +
        '<td><div class="row-primary"><strong>' + escapeHtml(getCompany(item).name || 'Unassigned company') + '</strong><span>' + escapeHtml(item.requirement) + '</span></div></td>' +
        '<td><div class="row-primary"><strong>' + escapeHtml(contact.full_name || 'No contact') + '</strong><span>' + escapeHtml(contact.title || contact.email || '') + '</span></div></td>' +
        '<td><span class="priority-pill ' + priorityClass(item.priority) + '">' + escapeHtml(item.priority) + '</span></td>' +
        '<td><span class="stage-pill">' + escapeHtml(item.status) + '</span></td>' +
        '<td><div class="row-primary"><strong>' + escapeHtml(item.next_action || 'Not set') + '</strong><span>' + escapeHtml(item.follow_up_date ? formatDate(item.follow_up_date, false) : '') + '</span></div></td>' +
        '<td><span class="table-open"><i data-lucide="arrow-up-right" aria-hidden="true"></i></span></td>' +
      '</tr>';
    }).join('');
  }

  function renderFollowups() {
    var items = dueItems();
    var groups = [
      { key: 'overdue', title: 'Overdue' },
      { key: 'today', title: 'Due today' },
      { key: 'upcoming', title: 'Upcoming' }
    ];
    els['followup-groups'].innerHTML = groups.map(function (group) {
      var matching = items.filter(function (item) { return followupState(item) === group.key; });
      return '<section class="followup-group ' + group.key + '"><h3>' + group.title + ' <span>(' + matching.length + ')</span></h3><div class="due-list">' +
        (matching.length ? matching.map(renderDueRow).join('') : emptyState('No actions in this queue.')) +
      '</div></section>';
    }).join('');
  }

  function setView(view) {
    if (!VIEW_META[view]) return;
    state.view = view;
    document.querySelectorAll('[data-view-panel]').forEach(function (panel) {
      var active = panel.dataset.viewPanel === view;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    document.querySelectorAll('[data-view]').forEach(function (button) {
      var active = button.dataset.view === view;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    els['view-eyebrow'].textContent = VIEW_META[view][0];
    els['view-title'].textContent = VIEW_META[view][1];
    els.sidebar.classList.remove('open');
    els['sidebar-toggle'].setAttribute('aria-expanded', 'false');
    refreshIcons();
  }

  function openOpportunityModal() {
    if (!isWriteMember()) return;
    state.lastFocus = document.activeElement;
    els['opportunity-form'].reset();
    els['opportunity-form'].querySelector('#opp-date').value = new Date().toISOString().slice(0, 10);
    setMessage(els['opportunity-form-message'], '', false);
    els['opportunity-modal'].hidden = false;
    document.body.classList.add('modal-open');
    window.setTimeout(function () { document.getElementById('opp-source').focus(); }, 0);
  }

  function closeOpportunityModal() {
    els['opportunity-modal'].hidden = true;
    if (els['record-panel'].hidden) document.body.classList.remove('modal-open');
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') state.lastFocus.focus();
  }

  async function findOrCreateCompany(name, website) {
    var existing = await state.client.from('growth_companies').select('id,name,website').ilike('name', name).limit(1);
    if (existing.error) throw existing.error;
    if (existing.data && existing.data[0]) {
      if (website && !existing.data[0].website) await state.client.from('growth_companies').update({ website: website }).eq('id', existing.data[0].id);
      return existing.data[0].id;
    }
    var created = await state.client.from('growth_companies').insert({ name: name, website: website || null }).select('id').single();
    if (created.error) throw created.error;
    return created.data.id;
  }

  async function findOrCreateContact(data, companyId) {
    var query = state.client.from('growth_contacts').select('id,full_name,email').eq('company_id', companyId);
    if (data.email) query = query.ilike('email', data.email);
    else query = query.ilike('full_name', data.name);
    var existing = await query.limit(1);
    if (existing.error) throw existing.error;
    if (existing.data && existing.data[0]) return existing.data[0].id;
    var created = await state.client.from('growth_contacts').insert({
      company_id: companyId,
      full_name: data.name,
      title: data.title || null,
      email: data.email || null,
      phone: data.phone || null
    }).select('id').single();
    if (created.error) throw created.error;
    return created.data.id;
  }

  async function handleOpportunitySubmit(event) {
    event.preventDefault();
    if (!isWriteMember()) return;
    var form = new FormData(els['opportunity-form']);
    var submit = els['opportunity-form'].querySelector('[type="submit"]');
    if (!form.get('source') || !form.get('company_name').trim() || !form.get('contact_name').trim() || !form.get('requirement').trim()) {
      setMessage(els['opportunity-form-message'], 'Complete source, company, contact and requirement.', false);
      return;
    }
    setBusy(submit, true, 'Checking and adding...');
    setMessage(els['opportunity-form-message'], '', false);
    try {
      var sourceUrl = normalizeUrl(form.get('source_url'));
      if (sourceUrl) {
        var duplicateUrl = await state.client.from('growth_opportunities').select('id,requirement').ilike('source_url', sourceUrl).limit(1);
        if (duplicateUrl.error) throw duplicateUrl.error;
        if (duplicateUrl.data && duplicateUrl.data[0]) {
          throw new Error('This source URL already exists in the pipeline. Open the existing opportunity instead.');
        }
      }
      var companyId = await findOrCreateCompany(form.get('company_name').trim(), normalizeUrl(form.get('company_website')) || null);
      var contactId = await findOrCreateContact({
        name: form.get('contact_name').trim(),
        title: form.get('contact_title').trim(),
        email: form.get('contact_email').trim().toLowerCase(),
        phone: form.get('contact_phone').trim()
      }, companyId);

      var contactDuplicate = await state.client.from('growth_opportunities')
        .select('id').eq('company_id', companyId).eq('contact_id', contactId)
        .not('status', 'in', '(Won,Lost)').limit(1);
      if (contactDuplicate.error) throw contactDuplicate.error;
      if (contactDuplicate.data && contactDuplicate.data[0] && !sourceUrl) {
        throw new Error('An active opportunity for this contact and company already exists. Review it before adding another.');
      }

      var insertResult = await state.client.from('growth_opportunities').insert({
        source: form.get('source'),
        source_url: sourceUrl || null,
        company_id: companyId,
        contact_id: contactId,
        requirement: form.get('requirement').trim(),
        opportunity_type: form.get('opportunity_type').trim() || null,
        location: form.get('location').trim() || null,
        date_posted: form.get('date_posted') || null,
        internal_notes: form.get('internal_notes').trim() || null,
        assigned_to: state.member.user_id
      }).select('id').single();
      if (insertResult.error) throw insertResult.error;
      await state.client.from('growth_activities').insert({
        opportunity_id: insertResult.data.id,
        activity_type: 'created',
        body: 'Opportunity added to Growth OS from ' + form.get('source') + '.'
      });
      closeOpportunityModal();
      await loadOpportunities();
      openRecord(insertResult.data.id);
    } catch (error) {
      var message = error && error.code === '23505' ? 'This source URL already exists in the pipeline.' : (error.message || 'The opportunity could not be added.');
      setMessage(els['opportunity-form-message'], message, false);
    } finally {
      setBusy(submit, false);
    }
  }

  async function openRecord(id) {
    var opportunity = state.opportunities.find(function (item) { return item.id === id; });
    if (!opportunity) return;
    state.currentId = id;
    state.lastFocus = document.activeElement;
    populateRecord(opportunity);
    els['record-panel'].hidden = false;
    document.body.classList.add('modal-open');
    setRecordTab('overview');
    await Promise.all([loadActivities(id), loadMessages(id)]);
    window.setTimeout(function () { els['close-record-button'].focus(); }, 0);
  }

  function closeRecord() {
    els['record-panel'].hidden = true;
    document.body.classList.remove('modal-open');
    state.currentId = null;
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') state.lastFocus.focus();
  }

  function populateRecord(opportunity) {
    var company = getCompany(opportunity);
    var contact = getContact(opportunity);
    els['record-source'].textContent = opportunity.source || 'OPPORTUNITY';
    els['record-title'].textContent = company.name || contact.full_name || 'Lead detail';
    els['record-requirement'].textContent = opportunity.requirement || '';
    var sourceUrl = safeUrl(opportunity.source_url);
    var companyUrl = safeUrl(company.website);
    var summary = [
      '<span class="summary-item"><i data-lucide="user" aria-hidden="true"></i>' + escapeHtml(contact.full_name || 'No contact') + '</span>',
      '<span class="summary-item"><i data-lucide="badge-check" aria-hidden="true"></i>' + escapeHtml(opportunity.priority) + ' · ' + escapeHtml(String(opportunity.fit_score || 0)) + '</span>',
      '<span class="summary-item"><i data-lucide="map-pin" aria-hidden="true"></i>' + escapeHtml(opportunity.location || company.location || 'Location not set') + '</span>'
    ];
    if (sourceUrl) summary.push('<a class="summary-item" href="' + escapeHtml(sourceUrl) + '" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" aria-hidden="true"></i>Source</a>');
    if (companyUrl) summary.push('<a class="summary-item" href="' + escapeHtml(companyUrl) + '" target="_blank" rel="noopener noreferrer"><i data-lucide="globe-2" aria-hidden="true"></i>Website</a>');
    els['record-summary'].innerHTML = summary.join('');

    els['record-status'].value = opportunity.status;
    els['record-value'].value = opportunity.estimated_value == null ? '' : opportunity.estimated_value;
    els['record-next-action'].value = opportunity.next_action || '';
    els['record-follow-up'].value = toLocalInput(opportunity.follow_up_date);
    els['record-probability'].value = opportunity.probability == null ? '' : opportunity.probability;
    els['record-notes'].value = opportunity.internal_notes || '';
    els['record-outcome'].value = opportunity.outcome_notes || opportunity.loss_reason || '';
    toggleOutcomeField();

    SCORE_FIELDS.forEach(function (field) {
      var input = document.getElementById('score-' + field.key);
      if (input) input.value = opportunity[field.key] || 0;
    });
    updateQualificationPreview();

    var researchNames = [
      'company_summary', 'founder_profile', 'website_observations', 'current_positioning',
      'visible_gaps', 'probable_requirement', 'relevant_capability', 'relevant_proof', 'potential_objection'
    ];
    researchNames.forEach(function (name) {
      var field = els['research-form'].elements[name];
      if (field) field.value = opportunity[name] || '';
    });
    setReadOnlyState();
    refreshIcons();
  }

  function setReadOnlyState() {
    var readOnly = !isWriteMember();
    document.querySelectorAll('#record-panel input, #record-panel select, #record-panel textarea, #record-panel button[type="submit"], #record-panel [data-save-draft]').forEach(function (control) {
      control.disabled = readOnly;
    });
  }

  function toggleOutcomeField() {
    els['outcome-field'].hidden = ['Won', 'Lost'].indexOf(els['record-status'].value) === -1;
  }

  function setRecordTab(tab) {
    document.querySelectorAll('[data-record-tab]').forEach(function (button) {
      var active = button.dataset.recordTab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-record-panel]').forEach(function (panel) {
      var active = panel.dataset.recordPanel === tab;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  }

  async function saveOpportunityChanges(changes, activityType, activityBody) {
    if (!state.currentId || !isWriteMember()) return;
    var result = await state.client.from('growth_opportunities').update(changes).eq('id', state.currentId).select('id').single();
    if (result.error) throw result.error;
    if (activityBody) {
      var activity = await state.client.from('growth_activities').insert({
        opportunity_id: state.currentId,
        activity_type: activityType,
        body: activityBody
      });
      if (activity.error) throw activity.error;
    }
  }

  async function handleOverviewSave(event) {
    event.preventDefault();
    var opportunity = currentOpportunity();
    if (!opportunity) return;
    var submit = event.currentTarget.querySelector('[type="submit"]');
    var messageEl = event.currentTarget.querySelector('[data-form-message]');
    var status = els['record-status'].value;
    var followUp = els['record-follow-up'].value;
    setBusy(submit, true, 'Saving...');
    setMessage(messageEl, '', false);
    try {
      await saveOpportunityChanges({
        status: status,
        estimated_value: els['record-value'].value ? Number(els['record-value'].value) : null,
        next_action: els['record-next-action'].value.trim() || null,
        follow_up_date: followUp ? new Date(followUp).toISOString() : null,
        probability: els['record-probability'].value ? Number(els['record-probability'].value) : null,
        internal_notes: els['record-notes'].value.trim() || null,
        outcome_notes: ['Won', 'Lost'].indexOf(status) !== -1 ? (els['record-outcome'].value.trim() || null) : opportunity.outcome_notes
      }, status !== opportunity.status ? 'status_change' : 'note', status !== opportunity.status ? 'Pipeline stage changed from ' + opportunity.status + ' to ' + status + '.' : 'Opportunity overview updated.');

      var pending = await state.client.from('growth_follow_ups').update({ status: 'cancelled' })
        .eq('opportunity_id', state.currentId).eq('status', 'pending');
      if (pending.error) throw pending.error;
      if (followUp) {
        var followupInsert = await state.client.from('growth_follow_ups').insert({
          opportunity_id: state.currentId,
          due_at: new Date(followUp).toISOString(),
          action: els['record-next-action'].value.trim() || 'Follow up'
        });
        if (followupInsert.error) throw followupInsert.error;
      }
      setMessage(messageEl, 'Overview saved.', true);
      await loadOpportunities();
      var updated = currentOpportunity();
      if (updated) populateRecord(updated);
    } catch (error) {
      setMessage(messageEl, error.message || 'The overview could not be saved.', false);
    } finally {
      setBusy(submit, false);
    }
  }

  function buildScoreGrid() {
    els['score-grid'].innerHTML = SCORE_FIELDS.map(function (field) {
      return '<div class="score-row"><div class="score-row-header"><label for="score-' + field.key + '">' + escapeHtml(field.label) + '</label><output class="score-value" id="score-value-' + field.key + '">0</output></div>' +
        '<input id="score-' + field.key + '" name="' + field.key + '" type="range" min="0" max="5" step="1" value="0"><p class="score-help">' + escapeHtml(field.help) + '</p></div>';
    }).join('');
    SCORE_FIELDS.forEach(function (field) {
      var input = document.getElementById('score-' + field.key);
      input.addEventListener('input', updateQualificationPreview);
    });
  }

  function updateQualificationPreview() {
    var values = {};
    SCORE_FIELDS.forEach(function (field) {
      var input = document.getElementById('score-' + field.key);
      values[field.key] = Number(input ? input.value : 0);
      var output = document.getElementById('score-value-' + field.key);
      if (output) output.textContent = String(values[field.key]);
    });
    var score = scoreFromValues(values);
    var priority = priorityFromScore(score);
    els['qualification-score'].textContent = String(score);
    els['qualification-priority'].textContent = priority;
    els['qualification-priority'].className = 'priority-pill ' + priorityClass(priority);
  }

  async function handleQualificationSave(event) {
    event.preventDefault();
    var submit = event.currentTarget.querySelector('[type="submit"]');
    var messageEl = event.currentTarget.querySelector('[data-form-message]');
    var changes = {};
    SCORE_FIELDS.forEach(function (field) {
      changes[field.key] = Number(document.getElementById('score-' + field.key).value || 0);
    });
    setBusy(submit, true, 'Saving...');
    try {
      await saveOpportunityChanges(changes, 'qualification', 'Qualification score updated to ' + scoreFromValues(changes) + '.');
      setMessage(messageEl, 'Qualification saved.', true);
      await loadOpportunities();
      var updated = currentOpportunity();
      if (updated) populateRecord(updated);
    } catch (error) {
      setMessage(messageEl, error.message || 'Qualification could not be saved.', false);
    } finally {
      setBusy(submit, false);
    }
  }

  async function handleResearchSave(event) {
    event.preventDefault();
    var submit = event.currentTarget.querySelector('[type="submit"]');
    var messageEl = event.currentTarget.querySelector('[data-form-message]');
    var form = new FormData(event.currentTarget);
    var changes = {};
    [
      'company_summary', 'founder_profile', 'website_observations', 'current_positioning',
      'visible_gaps', 'probable_requirement', 'relevant_capability', 'relevant_proof', 'potential_objection'
    ].forEach(function (name) { changes[name] = String(form.get(name) || '').trim() || null; });
    setBusy(submit, true, 'Saving...');
    try {
      await saveOpportunityChanges(changes, 'research', 'Research workspace updated.');
      setMessage(messageEl, 'Research saved.', true);
      await loadOpportunities();
    } catch (error) {
      setMessage(messageEl, error.message || 'Research could not be saved.', false);
    } finally {
      setBusy(submit, false);
    }
  }

  async function loadMessages(opportunityId) {
    var result = await state.client.from('growth_messages').select('*').eq('opportunity_id', opportunityId);
    state.messages = result.error ? [] : (result.data || []);
    renderDrafts();
  }

  function renderDrafts() {
    els['draft-list'].innerHTML = DRAFT_TYPES.map(function (type) {
      var existing = state.messages.find(function (message) { return message.message_type === type.key; }) || {};
      return '<section class="draft-item"><div class="draft-item-header"><h3>' + escapeHtml(type.label) + '</h3><span class="stage-pill">' + escapeHtml(existing.status || 'draft') + '</span></div>' +
        (type.key === 'email' ? '<label class="sr-only" for="draft-subject-' + type.key + '">Email subject</label><input id="draft-subject-' + type.key + '" type="text" placeholder="Email subject" value="' + escapeHtml(existing.subject || '') + '">' : '') +
        '<label class="sr-only" for="draft-body-' + type.key + '">' + escapeHtml(type.label) + ' draft</label><textarea id="draft-body-' + type.key + '" placeholder="' + escapeHtml(type.placeholder) + '">' + escapeHtml(existing.body || '') + '</textarea>' +
        '<p class="form-message" id="draft-message-' + type.key + '"></p><div class="draft-actions"><button class="button button-quiet" type="button" data-copy-draft="' + type.key + '"><i data-lucide="copy" aria-hidden="true"></i><span>Copy</span></button><button class="button button-dark" type="button" data-save-draft="' + type.key + '">Save draft</button></div></section>';
    }).join('');
    setReadOnlyState();
    refreshIcons();
  }

  async function saveDraft(type) {
    if (!state.currentId || !isWriteMember()) return;
    var body = document.getElementById('draft-body-' + type).value.trim();
    var subjectEl = document.getElementById('draft-subject-' + type);
    var messageEl = document.getElementById('draft-message-' + type);
    if (!body) {
      setMessage(messageEl, 'Add draft copy before saving.', false);
      return;
    }
    var result = await state.client.from('growth_messages').upsert({
      opportunity_id: state.currentId,
      message_type: type,
      subject: subjectEl ? (subjectEl.value.trim() || null) : null,
      body: body,
      status: 'draft'
    }, { onConflict: 'opportunity_id,message_type' });
    if (result.error) {
      setMessage(messageEl, result.error.message || 'Draft could not be saved.', false);
      return;
    }
    await state.client.from('growth_activities').insert({
      opportunity_id: state.currentId,
      activity_type: 'draft',
      channel: type,
      body: DRAFT_TYPES.find(function (item) { return item.key === type; }).label + ' draft saved.'
    });
    setMessage(messageEl, 'Draft saved. Nothing was sent.', true);
    await loadMessages(state.currentId);
  }

  async function copyDraft(type) {
    var body = document.getElementById('draft-body-' + type).value.trim();
    var subjectEl = document.getElementById('draft-subject-' + type);
    var messageEl = document.getElementById('draft-message-' + type);
    if (!body) {
      setMessage(messageEl, 'There is no draft to copy.', false);
      return;
    }
    var text = subjectEl && subjectEl.value.trim() ? subjectEl.value.trim() + '\n\n' + body : body;
    try {
      await navigator.clipboard.writeText(text);
      setMessage(messageEl, 'Copied. Review before sending manually.', true);
    } catch (error) {
      setMessage(messageEl, 'Copy was blocked by the browser. Select the text manually.', false);
    }
  }

  async function loadActivities(opportunityId) {
    var result = await state.client.from('growth_activities').select('*').eq('opportunity_id', opportunityId).order('created_at', { ascending: false }).limit(100);
    state.activities = result.error ? [] : (result.data || []);
    renderActivities();
  }

  function activityIcon(type) {
    if (type === 'status_change') return 'move-right';
    if (type === 'qualification') return 'badge-check';
    if (type === 'research') return 'search-check';
    if (type === 'draft') return 'file-pen-line';
    if (type === 'call') return 'phone';
    if (type === 'follow_up') return 'calendar-clock';
    if (type === 'outcome') return 'flag';
    return 'message-square-text';
  }

  function renderActivities() {
    if (!state.activities.length) {
      els['activity-list'].innerHTML = emptyState('No activity has been recorded yet.');
      refreshIcons();
      return;
    }
    els['activity-list'].innerHTML = state.activities.map(function (activity) {
      return '<article class="activity-item"><span class="activity-icon"><i data-lucide="' + activityIcon(activity.activity_type) + '" aria-hidden="true"></i></span><div><p>' + escapeHtml(activity.body) + '</p><div class="activity-meta"><span>' + escapeHtml(activity.activity_type.replace(/_/g, ' ')) + '</span><span>' + escapeHtml(formatDate(activity.created_at, true)) + '</span></div></div></article>';
    }).join('');
    refreshIcons();
  }

  async function handleNoteSave(event) {
    event.preventDefault();
    if (!state.currentId || !isWriteMember()) return;
    var body = els['activity-note'].value.trim();
    var submit = event.currentTarget.querySelector('[type="submit"]');
    var messageEl = event.currentTarget.querySelector('[data-form-message]');
    if (!body) return;
    setBusy(submit, true, 'Adding...');
    var result = await state.client.from('growth_activities').insert({
      opportunity_id: state.currentId,
      activity_type: 'note',
      body: body
    });
    setBusy(submit, false);
    if (result.error) {
      setMessage(messageEl, result.error.message || 'The note could not be added.', false);
      return;
    }
    els['activity-note'].value = '';
    setMessage(messageEl, 'Activity note added.', true);
    await loadActivities(state.currentId);
  }

  function initSelectOptions() {
    var options = STAGES.map(function (stage) { return '<option>' + escapeHtml(stage) + '</option>'; }).join('');
    els['record-status'].innerHTML = options;
    els['lead-status-filter'].insertAdjacentHTML('beforeend', options);
  }

  function bindEvents() {
    els['login-form'].addEventListener('submit', handleLogin);
    els['otp-form'].addEventListener('submit', handleOtp);
    els['change-email-button'].addEventListener('click', resetLogin);
    els['sign-out-button'].addEventListener('click', async function () {
      await state.client.auth.signOut({ scope: 'local' });
      showAuth();
    });
    els['sidebar-toggle'].addEventListener('click', function () {
      var open = els.sidebar.classList.toggle('open');
      els['sidebar-toggle'].setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('[data-view]').forEach(function (button) {
      button.addEventListener('click', function () { setView(button.dataset.view); });
    });
    document.querySelectorAll('[data-open-view]').forEach(function (button) {
      button.addEventListener('click', function () { setView(button.dataset.openView); });
    });
    els['global-search'].addEventListener('input', function () {
      state.query = els['global-search'].value;
      renderPipeline();
      renderLeadTable();
      refreshIcons();
    });
    els['pipeline-priority-filter'].addEventListener('change', function () { renderPipeline(); refreshIcons(); });
    els['lead-status-filter'].addEventListener('change', function () { renderLeadTable(); refreshIcons(); });
    els['lead-priority-filter'].addEventListener('change', function () { renderLeadTable(); refreshIcons(); });
    els['add-opportunity-button'].addEventListener('click', openOpportunityModal);
    document.querySelectorAll('[data-close-modal]').forEach(function (button) { button.addEventListener('click', closeOpportunityModal); });
    els['opportunity-form'].addEventListener('submit', handleOpportunitySubmit);
    els['close-record-button'].addEventListener('click', closeRecord);
    els['record-status'].addEventListener('change', toggleOutcomeField);
    els['record-overview-form'].addEventListener('submit', handleOverviewSave);
    els['qualification-form'].addEventListener('submit', handleQualificationSave);
    els['research-form'].addEventListener('submit', handleResearchSave);
    els['note-form'].addEventListener('submit', handleNoteSave);
    document.querySelectorAll('[data-record-tab]').forEach(function (button) {
      button.addEventListener('click', function () { setRecordTab(button.dataset.recordTab); });
    });
    document.addEventListener('click', function (event) {
      var openTarget = event.target.closest('[data-open-record]');
      if (openTarget) openRecord(openTarget.dataset.openRecord);
      var saveTarget = event.target.closest('[data-save-draft]');
      if (saveTarget) saveDraft(saveTarget.dataset.saveDraft);
      var copyTarget = event.target.closest('[data-copy-draft]');
      if (copyTarget) copyDraft(copyTarget.dataset.copyDraft);
    });
    document.addEventListener('keydown', function (event) {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open-record]')) {
        event.preventDefault();
        openRecord(event.target.dataset.openRecord);
      }
      if (event.key === 'Escape') {
        if (!els['opportunity-modal'].hidden) closeOpportunityModal();
        else if (!els['record-panel'].hidden) closeRecord();
        else if (els.sidebar.classList.contains('open')) {
          els.sidebar.classList.remove('open');
          els['sidebar-toggle'].setAttribute('aria-expanded', 'false');
        }
      }
    });
    els['opportunity-modal'].addEventListener('click', function (event) { if (event.target === els['opportunity-modal']) closeOpportunityModal(); });
    els['record-panel'].addEventListener('click', function (event) { if (event.target === els['record-panel']) closeRecord(); });
  }

  async function init() {
    cacheElements();
    refreshIcons();
    initOtpInputs();
    initSelectOptions();
    buildScoreGrid();
    bindEvents();
    try {
      initClient();
      await initialiseSession();
    } catch (error) {
      setMessage(els['auth-message'], error.message || 'Growth OS could not be initialised.', false);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
