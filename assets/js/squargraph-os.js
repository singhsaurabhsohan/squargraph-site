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
    dashboard: ['OPERATING VIEW', 'Workspace dashboard'],
    opportunities: ['GROWTH OS', 'Opportunities'],
    companies: ['GROWTH OS', 'Companies'],
    contacts: ['GROWTH OS', 'Contacts'],
    outreach: ['GROWTH OS', 'Outreach'],
    proposals: ['GROWTH OS', 'Proposals'],
    pipeline: ['GROWTH OS', 'Pipeline'],
    calendar: ['GROWTH OS', 'Calendar'],
    settings: ['WORKSPACE', 'Settings']
  };

  var ROUTE_TO_VIEW = {
    '/app': 'dashboard', '/app/': 'dashboard', '/app/dashboard': 'dashboard',
    '/app/opportunities': 'opportunities', '/app/companies': 'companies',
    '/app/contacts': 'contacts', '/app/outreach': 'outreach',
    '/app/proposals': 'proposals', '/app/pipeline': 'pipeline',
    '/app/calendar': 'calendar', '/app/settings': 'settings'
  };

  var state = {
    client: null,
    session: null,
    member: null,
    profile: null,
    permissions: new Set(),
    roles: [],
    opportunities: [],
    messagesAll: [],
    proposals: [],
    audit: [],
    directoryProfiles: [],
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
      'app-loading', 'workspace', 'sidebar', 'sidebar-toggle', 'member-name', 'member-role',
      'sign-out-button', 'view-eyebrow', 'view-title', 'global-search',
      'add-opportunity-button', 'system-banner', 'nav-due-count', 'metric-new',
      'metric-due', 'metric-overdue', 'metric-research', 'metric-emails', 'metric-calls',
      'metric-proposals', 'metric-pipeline', 'metric-win-rate', 'priority-list',
      'dashboard-due-list', 'stage-summary', 'pipeline-board', 'pipeline-priority-filter',
      'lead-status-filter', 'lead-priority-filter', 'lead-count', 'lead-table-body',
      'followup-groups', 'company-count', 'company-grid', 'contact-count',
      'contact-table-body', 'outreach-count', 'outreach-grid', 'proposal-count',
      'proposal-table-body', 'profile-form', 'profile-name', 'profile-phone',
      'profile-avatar', 'profile-timezone', 'profile-notifications', 'settings-role', 'settings-email',
      'permission-list', 'invite-panel', 'invite-form', 'invite-name', 'invite-email',
      'invite-role', 'sign-out-all-button', 'session-detail', 'workspace-audit-list',
      'opportunity-modal', 'opportunity-form', 'opportunity-form-message',
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
    return state.permissions.has('opportunities.edit');
  }

  function can(permission) {
    return state.permissions.has(permission);
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
          detectSessionInUrl: true,
          flowType: 'pkce',
          storageKey: 'sq-os-auth'
        }
      }
    );
  }

  async function initialiseSession() {
    var result = await state.client.auth.getSession();
    if (result.error) throw result.error;
    if (result.data.session) await authoriseSession(result.data.session);
    else redirectToLogin();

    state.client.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_OUT') redirectToLogin();
      if (event === 'TOKEN_REFRESHED' && session) state.session = session;
    });
  }

  function redirectToLogin(reason) {
    var next = window.location.pathname.indexOf('/app') === 0 ? window.location.pathname : '/app/dashboard';
    window.location.replace('/login?next=' + encodeURIComponent(next) + (reason ? '&error=' + encodeURIComponent(reason) : ''));
  }

  async function authoriseSession(session) {
    state.session = session;
    var membership = await state.client
      .from('os_members')
      .select('user_id,email,status,role_id,role:os_roles(role_key,name,rank)')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (membership.error || !membership.data) {
      await state.client.auth.signOut({ scope: 'local' });
      redirectToLogin('This account does not have active workspace access.');
      return;
    }

    state.member = membership.data;
    var profileResult = await state.client.from('os_profiles').select('*').eq('user_id', session.user.id).maybeSingle();
    state.profile = profileResult.data || { user_id: session.user.id, full_name: '', phone: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, notifications: { email: true } };
    var permissionResult = await state.client.rpc('os_my_permissions');
    if (permissionResult.error) throw permissionResult.error;
    state.permissions = new Set((permissionResult.data || []).map(function (item) { return item.permission_key; }));
    els['member-name'].textContent = state.profile.full_name || state.member.email;
    els['member-role'].textContent = (state.member.role && state.member.role.name) || 'Workspace member';
    els['app-loading'].hidden = true;
    els.workspace.hidden = false;
    if (!isWriteMember()) {
      els['add-opportunity-button'].hidden = true;
      showBanner('Your workspace access is read-only for opportunities.');
    }
    await recordLoginHistory();
    await loadWorkspace();
    setView(viewFromPath(), false);
  }

  async function recordLoginHistory() {
    var key = 'sq-os-login-' + state.session.user.id + '-' + String(state.session.access_token || '').slice(-10);
    if (window.sessionStorage.getItem(key)) return;
    await state.client.from('os_login_history').insert({
      user_id: state.session.user.id,
      event_type: 'sign_in',
      user_agent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      path: window.location.pathname
    });
    window.sessionStorage.setItem(key, '1');
  }

  async function loadWorkspace() {
    showBanner('Loading workspace...');
    var opportunityRequest = state.client
      .from('growth_opportunities')
      .select('*,company:growth_companies(id,name,website,linkedin_url,location),contact:growth_contacts(id,full_name,title,email,phone,linkedin_url,is_decision_maker)')
      .order('updated_at', { ascending: false })
      .limit(500);
    var messageRequest = state.client.from('growth_messages').select('*,opportunity:growth_opportunities(id,requirement,company:growth_companies(name))').order('updated_at', { ascending: false }).limit(500);
    var proposalRequest = state.client.from('growth_proposals').select('*,opportunity:growth_opportunities(id,requirement,company:growth_companies(name))').order('updated_at', { ascending: false }).limit(500);
    var auditRequest = can('audit.view')
      ? state.client.from('os_audit_log').select('id,actor_id,action,entity_type,entity_id,metadata,created_at').order('created_at', { ascending: false }).limit(40)
      : Promise.resolve({ data: [], error: null });
    var roleRequest = can('users.invite')
      ? state.client.from('os_roles').select('id,role_key,name,rank').order('rank', { ascending: false })
      : Promise.resolve({ data: [], error: null });
    var profileRequest = can('audit.view')
      ? state.client.from('os_profiles').select('user_id,full_name')
      : Promise.resolve({ data: [], error: null });
    var results = await Promise.all([opportunityRequest, messageRequest, proposalRequest, auditRequest, roleRequest, profileRequest]);
    if (results[0].error) {
      showBanner('Workspace data could not be loaded: ' + results[0].error.message);
      return;
    }
    state.opportunities = results[0].data || [];
    state.messagesAll = results[1].error ? [] : (results[1].data || []);
    state.proposals = results[2].error ? [] : (results[2].data || []);
    state.audit = results[3].error ? [] : (results[3].data || []);
    state.roles = results[4].error ? [] : (results[4].data || []);
    state.directoryProfiles = results[5].error ? [] : (results[5].data || []);
    if (isWriteMember()) showBanner('');
    renderAll();
  }

  async function loadOpportunities() {
    await loadWorkspace();
  }

  function renderAll() {
    renderMetrics();
    renderPriorityList();
    renderDashboardDue();
    renderStageSummary();
    renderPipeline();
    renderLeadTable();
    renderFollowups();
    renderCompanies();
    renderContacts();
    renderOutreach();
    renderProposals();
    renderSettings();
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
    var newItems = state.opportunities.filter(function (item) { return item.status === 'New'; });
    var research = active.filter(function (item) { return item.status === 'Researching' || !item.company_summary; });
    var emails = state.messagesAll.filter(function (item) { return item.message_type === 'email' && item.status === 'sent'; });
    var calls = active.filter(function (item) { return item.status === 'Discovery Scheduled'; });
    var openProposals = state.proposals.filter(function (item) { return ['accepted', 'declined'].indexOf(item.status) === -1; });
    var pipeline = active.reduce(function (sum, item) { return sum + Number(item.estimated_value || 0); }, 0);
    var won = state.opportunities.filter(function (item) { return item.status === 'Won'; }).length;
    var lost = state.opportunities.filter(function (item) { return item.status === 'Lost'; }).length;
    els['metric-due'].textContent = String(due.length);
    els['metric-overdue'].textContent = overdue.length + ' overdue';
    els['metric-new'].textContent = String(newItems.length);
    els['metric-research'].textContent = String(research.length);
    els['metric-emails'].textContent = String(emails.length);
    els['metric-calls'].textContent = String(calls.length);
    els['metric-proposals'].textContent = String(openProposals.length);
    els['metric-pipeline'].textContent = formatMoney(pipeline).replace('₹', 'INR ');
    els['metric-win-rate'].textContent = (won + lost ? Math.round((won / (won + lost)) * 100) : 0) + '%';
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

  function renderCompanies() {
    var companies = {};
    state.opportunities.forEach(function (item) {
      var company = getCompany(item);
      if (!company.id) return;
      if (!companies[company.id]) companies[company.id] = { company: company, opportunities: [] };
      companies[company.id].opportunities.push(item);
    });
    var items = Object.keys(companies).map(function (key) { return companies[key]; });
    els['company-count'].textContent = items.length + (items.length === 1 ? ' company' : ' companies');
    els['company-grid'].innerHTML = items.length ? items.map(function (entry) {
      var active = entry.opportunities.filter(function (item) { return ['Won', 'Lost', 'Dormant'].indexOf(item.status) === -1; });
      var first = active[0] || entry.opportunities[0];
      return '<article class="entity-card"><div class="entity-card-header"><div><h3>' + escapeHtml(entry.company.name) + '</h3><p>' + escapeHtml(entry.company.location || 'Location not set') + '</p></div><span class="source-pill">' + entry.opportunities.length + ' opportunities</span></div><p>' + escapeHtml(first.requirement || 'No visible requirement recorded.') + '</p><div class="entity-card-footer"><button class="text-button" type="button" data-open-record="' + escapeHtml(first.id) + '">Open latest record</button>' + (safeUrl(entry.company.website) ? '<a class="text-button" href="' + escapeHtml(safeUrl(entry.company.website)) + '" target="_blank" rel="noopener">Website</a>' : '') + '</div></article>';
    }).join('') : emptyState('Companies will appear as opportunities are added.');
  }

  function renderContacts() {
    var contacts = {};
    state.opportunities.forEach(function (item) {
      var contact = getContact(item);
      if (!contact.id) return;
      contacts[contact.id] = { contact: contact, company: getCompany(item), opportunity: item };
    });
    var items = Object.keys(contacts).map(function (key) { return contacts[key]; });
    els['contact-count'].textContent = items.length + (items.length === 1 ? ' contact' : ' contacts');
    els['contact-table-body'].innerHTML = items.length ? items.map(function (entry) {
      return '<tr tabindex="0" data-open-record="' + escapeHtml(entry.opportunity.id) + '"><td><div class="row-primary"><strong>' + escapeHtml(entry.contact.full_name) + '</strong><span>' + escapeHtml(entry.contact.title || 'Role not set') + '</span></div></td><td>' + escapeHtml(entry.company.name || 'Unassigned') + '</td><td><div class="row-primary"><strong>' + escapeHtml(entry.contact.email || 'No email') + '</strong><span>' + escapeHtml(entry.contact.phone || '') + '</span></div></td><td><span class="stage-pill">' + escapeHtml(entry.opportunity.status) + '</span></td></tr>';
    }).join('') : '<tr><td colspan="4">' + emptyState('Contacts will appear as opportunities are added.') + '</td></tr>';
  }

  function renderOutreach() {
    els['outreach-count'].textContent = state.messagesAll.length + (state.messagesAll.length === 1 ? ' message' : ' messages');
    els['outreach-grid'].innerHTML = state.messagesAll.length ? state.messagesAll.map(function (message) {
      var opportunity = message.opportunity || {};
      var company = opportunity.company || {};
      return '<article class="outreach-card"><div class="entity-card-header"><div><span class="source-pill">' + escapeHtml(message.message_type.replace(/_/g, ' ')) + '</span><h3>' + escapeHtml(company.name || opportunity.requirement || 'Opportunity outreach') + '</h3></div><span class="stage-pill">' + escapeHtml(message.status) + '</span></div><p>' + escapeHtml(message.body || 'Empty draft') + '</p><div class="outreach-card-footer"><span>' + escapeHtml(formatDate(message.updated_at, true)) + '</span>' + (opportunity.id ? '<button class="text-button" type="button" data-open-record="' + escapeHtml(opportunity.id) + '">Open opportunity</button>' : '') + '</div></article>';
    }).join('') : emptyState('No outreach drafts or sent records yet.');
  }

  function renderProposals() {
    els['proposal-count'].textContent = state.proposals.length + (state.proposals.length === 1 ? ' proposal' : ' proposals');
    els['proposal-table-body'].innerHTML = state.proposals.length ? state.proposals.map(function (proposal) {
      var opportunity = proposal.opportunity || {};
      var company = opportunity.company || {};
      return '<tr' + (opportunity.id ? ' tabindex="0" data-open-record="' + escapeHtml(opportunity.id) + '"' : '') + '><td><div class="row-primary"><strong>' + escapeHtml(proposal.title) + '</strong><span>' + escapeHtml(company.name || 'Unassigned company') + '</span></div></td><td>' + escapeHtml(opportunity.requirement || 'Not linked') + '</td><td><span class="stage-pill">' + escapeHtml(proposal.status) + '</span></td><td>' + escapeHtml(formatMoney(proposal.estimated_value || 0).replace('₹', 'INR ')) + '</td><td>' + escapeHtml(formatDate(proposal.expected_close_date, false)) + '</td></tr>';
    }).join('') : '<tr><td colspan="5">' + emptyState('Proposals will appear when they are added to an opportunity.') + '</td></tr>';
  }

  function renderSettings() {
    var role = state.member && state.member.role ? state.member.role : {};
    var notifications = state.profile && state.profile.notifications ? state.profile.notifications : {};
    els['profile-name'].value = (state.profile && state.profile.full_name) || '';
    els['profile-phone'].value = (state.profile && state.profile.phone) || '';
    els['profile-avatar'].value = (state.profile && state.profile.avatar_url) || '';
    els['profile-timezone'].value = (state.profile && state.profile.timezone) || Intl.DateTimeFormat().resolvedOptions().timeZone;
    els['profile-notifications'].checked = notifications.email !== false;
    els['settings-role'].textContent = role.name || 'Workspace member';
    els['settings-email'].textContent = (state.member && state.member.email) || '';
    els['permission-list'].innerHTML = Array.from(state.permissions).sort().map(function (permission) { return '<span class="permission-chip">' + escapeHtml(permission.replace(/\./g, ' · ')) + '</span>'; }).join('');
    els['invite-panel'].hidden = !can('users.invite');
    els['invite-role'].innerHTML = '<option value="">Select role</option>' + state.roles.filter(function (item) { return Number(item.rank) < Number(role.rank || 0); }).map(function (item) { return '<option value="' + escapeHtml(item.role_key) + '">' + escapeHtml(item.name) + '</option>'; }).join('');
    els['session-detail'].textContent = 'Signed in as ' + ((state.member && state.member.email) || '') + ' · ' + navigator.userAgent.replace(/\s+/g, ' ').slice(0, 90);
    els['workspace-audit-list'].innerHTML = state.audit.length ? state.audit.map(function (activity) {
      var actor = state.directoryProfiles.find(function (profile) { return profile.user_id === activity.actor_id; });
      return '<article class="activity-item"><span class="activity-icon"><i data-lucide="history" aria-hidden="true"></i></span><div><p>' + escapeHtml(activity.action.replace(/_/g, ' ')) + '</p><div class="activity-meta"><span>' + escapeHtml((actor && actor.full_name) || 'System') + '</span><span>' + escapeHtml(activity.entity_type || 'workspace') + '</span><span>' + escapeHtml(formatDate(activity.created_at, true)) + '</span></div></div></article>';
    }).join('') : emptyState(can('audit.view') ? 'Workspace activity will appear here.' : 'Audit history is limited by your permissions.');
  }

  function viewFromPath() {
    return ROUTE_TO_VIEW[window.location.pathname.replace(/\/+$/, '') || '/app'] || 'dashboard';
  }

  function setView(view, pushState) {
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
    if (pushState !== false) {
      var route = view === 'dashboard' ? '/app/dashboard' : '/app/' + view;
      if (window.location.pathname !== route) window.history.pushState({ view: view }, '', route);
    }
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

  async function handleProfileSave(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var submit = form.querySelector('[type="submit"]');
    var message = form.querySelector('[data-form-message]');
    var payload = {
      user_id: state.session.user.id,
      full_name: els['profile-name'].value.trim() || null,
      phone: els['profile-phone'].value.trim() || null,
      avatar_url: safeUrl(els['profile-avatar'].value.trim()) || null,
      timezone: els['profile-timezone'].value.trim() || Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: { email: els['profile-notifications'].checked }
    };
    setBusy(submit, true, 'Saving...');
    var result = await state.client.from('os_profiles').upsert(payload, { onConflict: 'user_id' }).select().single();
    setBusy(submit, false);
    if (result.error) {
      setMessage(message, result.error.message || 'The profile could not be saved.', false);
      return;
    }
    state.profile = result.data;
    els['member-name'].textContent = state.profile.full_name || state.member.email;
    setMessage(message, 'Profile saved.', true);
  }

  async function handleInvite(event) {
    event.preventDefault();
    if (!can('users.invite')) return;
    var form = event.currentTarget;
    var submit = form.querySelector('[type="submit"]');
    var message = form.querySelector('[data-form-message]');
    var payload = {
      full_name: els['invite-name'].value.trim(),
      email: els['invite-email'].value.trim().toLowerCase(),
      role_key: els['invite-role'].value
    };
    if (!payload.full_name || !/^\S+@\S+\.\S+$/.test(payload.email) || !payload.role_key) {
      setMessage(message, 'Complete the name, email address and workspace role.', false);
      return;
    }
    setBusy(submit, true, 'Sending invitation...');
    var result = await state.client.functions.invoke('invite-os-user', { body: payload });
    setBusy(submit, false);
    if (result.error) {
      setMessage(message, result.error.message || 'The invitation could not be sent.', false);
      return;
    }
    form.reset();
    setMessage(message, 'Invitation sent to ' + payload.email + '.', true);
  }

  async function handleGlobalSignOut() {
    setBusy(els['sign-out-all-button'], true, 'Signing out...');
    await state.client.auth.signOut({ scope: 'global' });
    window.location.replace('/login?signed_out=1');
  }

  function initSelectOptions() {
    var options = STAGES.map(function (stage) { return '<option>' + escapeHtml(stage) + '</option>'; }).join('');
    els['record-status'].innerHTML = options;
    els['lead-status-filter'].insertAdjacentHTML('beforeend', options);
  }

  function bindEvents() {
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
    els['profile-form'].addEventListener('submit', handleProfileSave);
    els['invite-form'].addEventListener('submit', handleInvite);
    els['sign-out-all-button'].addEventListener('click', handleGlobalSignOut);
    window.addEventListener('popstate', function () { setView(viewFromPath(), false); });
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
    initSelectOptions();
    buildScoreGrid();
    bindEvents();
    try {
      initClient();
      await initialiseSession();
    } catch (error) {
      els['app-loading'].querySelector('p').textContent = error.message || 'SQUARGRAPH OS could not be initialised.';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
