import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'assets', 'data', 'careers.json');
const pagePath = path.join(root, 'careers', 'index.html');

const allowedStatuses = new Set(['open', 'reviewing', 'paused', 'closed']);
const allowedWorkingModels = new Set(['Remote', 'Hybrid', 'On-site', 'Flexible']);
const allowedEngagementTypes = new Set(['Full-time', 'Part-time', 'Contract', 'Project-based', 'Internship', 'Commission-based', 'Freelance']);
const statusLabels = {
  open: 'Open',
  reviewing: 'Reviewing applications',
  paused: 'Paused',
  closed: 'Closed'
};
const statusOrder = { open: 0, reviewing: 1, paused: 2, closed: 3 };

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeUrl(value, fallback = '') {
  const candidate = String(value || '').trim();
  if (!candidate) return fallback;
  if (candidate.startsWith('#') || candidate.startsWith('/')) return candidate;
  try {
    const parsed = new URL(candidate);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

function validateRole(role, index) {
  const required = ['id', 'title', 'discipline', 'location', 'workingModel', 'engagementType', 'experience', 'summary', 'status'];
  const missing = required.filter((field) => !String(role[field] || '').trim());
  if (missing.length) throw new Error(`Role ${index + 1} is missing: ${missing.join(', ')}`);
  if (!allowedStatuses.has(role.status)) throw new Error(`Role ${role.id} has invalid status: ${role.status}`);
  if (!allowedWorkingModels.has(role.workingModel)) throw new Error(`Role ${role.id} has invalid workingModel: ${role.workingModel}`);
  if (!allowedEngagementTypes.has(role.engagementType)) throw new Error(`Role ${role.id} has invalid engagementType: ${role.engagementType}`);
}

function roleCategory(role) {
  if (role.engagementType === 'Internship') return 'internship';
  if (['Contract', 'Project-based', 'Commission-based', 'Freelance'].includes(role.engagementType)) return 'associate';
  return 'open';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function roleCard(role) {
  const id = escapeHtml(role.id);
  const applyUrl = safeUrl(role.applyUrl, `#introduce-yourself`);
  const detailUrl = safeUrl(role.detailUrl);
  const closingDate = formatDate(role.closingDate);
  const canApply = ['open', 'reviewing'].includes(role.status);
  const metadata = [role.discipline, role.location, role.workingModel, role.engagementType, role.experience]
    .filter(Boolean)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join('');
  const actions = [];
  if (detailUrl) actions.push(`<a class="destination-text-link" href="${escapeHtml(detailUrl)}" data-careers-role-id="${id}">View role</a>`);
  if (canApply) actions.push(`<a class="destination-button" href="${escapeHtml(applyUrl)}" data-careers-role-id="${id}" data-careers-apply>Apply</a>`);

  return `<article class="careers-role-card" data-status="${escapeHtml(role.status)}">
    <div class="careers-role-top"><h4>${escapeHtml(role.title)}</h4><span class="careers-role-status">${statusLabels[role.status]}</span></div>
    <div class="careers-role-meta">${metadata}</div>
    <p>${escapeHtml(role.summary)}</p>
    ${closingDate ? `<p class="careers-role-closing">Applications close ${escapeHtml(closingDate)}.</p>` : ''}
    ${actions.length ? `<div class="careers-role-actions">${actions.join('')}</div>` : ''}
  </article>`;
}

function groupMarkup({ id, number, title, description, roles, emptyTitle, emptyBody, emptyDetail }) {
  const content = roles.length
    ? `<div class="careers-role-list">${roles.map(roleCard).join('\n')}</div>`
    : `<div class="${id === 'open-roles-title' ? 'careers-empty-state' : 'careers-opportunity-note'}"><p>${emptyTitle ? `<strong>${emptyTitle}</strong>` : emptyBody}</p>${emptyTitle ? `<p>${emptyBody}</p><a class="destination-text-link" href="#introduce-yourself" data-sq-event="careers_introduce_yourself_start">Introduce Yourself</a>` : `<p>${emptyDetail}</p>`}</div>`;
  return `<section class="careers-opportunity-group" aria-labelledby="${id}"><div class="careers-opportunity-heading"><span>${number}</span><div><h3 id="${id}">${title}</h3><p>${description}</p></div></div>${content}</section>`;
}

const data = JSON.parse(await readFile(dataPath, 'utf8'));
if (!Array.isArray(data.roles)) throw new Error('careers.json must contain a roles array.');
data.roles.forEach(validateRole);

const published = data.roles
  .filter((role) => role.published === true && role.status !== 'closed')
  .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || statusOrder[a.status] - statusOrder[b.status] || String(b.postedDate || '').localeCompare(String(a.postedDate || '')));

const groups = {
  open: published.filter((role) => roleCategory(role) === 'open'),
  associate: published.filter((role) => roleCategory(role) === 'associate'),
  internship: published.filter((role) => roleCategory(role) === 'internship')
};

const opportunities = `<div class="careers-opportunity-groups" data-role-count="${published.length}">
  ${groupMarkup({ id: 'open-roles-title', number: '01', title: 'Open Roles', description: 'Employee and long-term individual roles with clearly defined ownership.', roles: groups.open, emptyTitle: 'No roles are open at the moment.', emptyBody: 'We are still interested in meeting exceptional people for future opportunities.' })}
  ${groupMarkup({ id: 'associate-title', number: '02', title: 'Associate Opportunities', description: 'For selected disciplines, SQUARGRAPH works with associates who contribute to business development, strategy, creative, production or delivery on defined terms.', roles: groups.associate, emptyBody: 'No associate opportunities are currently published.', emptyDetail: 'Future opportunities will state clearly whether they are commission-based, project-based, contract, part-time or full-time.' })}
  ${groupMarkup({ id: 'internships-title', number: '03', title: 'Internships and Early Career', description: 'We consider internships when there is meaningful work, direct guidance and a clear learning objective. We do not create internship roles simply to increase headcount.', roles: groups.internship, emptyBody: 'No internships are currently published.', emptyDetail: 'Any future listing will state its discipline, duration, location, paid status, learning objective and application requirements.' })}
</div>`;

const finalCta = published.some((role) => ['open', 'reviewing'].includes(role.status))
  ? `<section class="destination-final" aria-labelledby="careers-final-title"><div class="destination-shell destination-final-grid"><h2 id="careers-final-title">See a role that fits?</h2><div><p>Apply with your strongest work, clear context and an honest view of what you want to build next.</p><a class="destination-button destination-button--light" href="#opportunities" data-sq-event="careers_view_opportunities">View Opportunities</a></div></div></section>`
  : `<section class="destination-final" aria-labelledby="careers-final-title"><div class="destination-shell destination-final-grid"><h2 id="careers-final-title">No suitable role today?</h2><div><p>Introduce yourself for future opportunities.</p><a class="destination-button destination-button--light" href="#introduce-yourself" data-sq-event="careers_introduce_yourself_start">Introduce Yourself</a></div></div></section>`;

let html = await readFile(pagePath, 'utf8');
html = html.replace(/<!-- CAREERS_ROLES_START -->[\s\S]*?<!-- CAREERS_ROLES_END -->/, `<!-- CAREERS_ROLES_START -->\n        ${opportunities}\n        <!-- CAREERS_ROLES_END -->`);
html = html.replace(/<!-- CAREERS_FINAL_START -->[\s\S]*?<!-- CAREERS_FINAL_END -->/, `<!-- CAREERS_FINAL_START -->\n    ${finalCta}\n    <!-- CAREERS_FINAL_END -->`);
await writeFile(pagePath, html, 'utf8');

console.log(`Rendered ${published.length} published Careers role${published.length === 1 ? '' : 's'}.`);
