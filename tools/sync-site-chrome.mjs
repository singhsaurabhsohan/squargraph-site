import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const navReference = await readFile(path.join(root, 'components/navigation.html.reference'), 'utf8');
const footerReference = await readFile(path.join(root, 'components/footer.html.reference'), 'utf8');

const excludedDirectories = new Set(['.git', 'node_modules', 'supabase', 'tools', 'components', 'assets']);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) files.push(...await collect(absolute));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(absolute);
    }
  }
  return files;
}

function currentFor(relative) {
  const normalized = relative.replaceAll('\\', '/').toLowerCase();
  if (normalized === 'project-direction/index.html') return 'PROJECT_CURRENT';
  if (normalized === 'work/index.html') return 'WORK_CURRENT';
  if (normalized === 'capabilities/index.html') return 'CAPABILITIES_CURRENT';
  if (normalized === 'engagements/index.html' || /^(discovery|audit|audit-results|brand-foundation-sprint|websites-digital-experiences|growth-partner)\.html$/.test(normalized)) return 'ENGAGEMENTS_CURRENT';
  if (normalized === 'intelligence.html' || normalized === 'blog.html' || normalized.startsWith('blog/')) return 'INTELLIGENCE_CURRENT';
  if (normalized === 'studio/index.html' || normalized === 'saurabh-sohan-singh.html' || normalized === 'ai-disclosure.html' || normalized.startsWith('partners/') || normalized.startsWith('careers/')) return 'STUDIO_CURRENT';
  return '';
}

function renderNav(current) {
  return navReference.replace(/\{\{([A-Z_]+)\}\}/g, (_, token) => token === current ? ' aria-current="page"' : '');
}

const replacements = [
  [/href="\/#work"/g, 'href="/work/"'],
  [/href="\/#capabilities"/g, 'href="/capabilities/"'],
  [/href="\/#growth-ecosystem"/g, 'href="/capabilities/#growth-ecosystem"'],
  [/href="\/#studio"/g, 'href="/studio/"'],
  [/href="\/#approach"/g, 'href="/studio/#approach"'],
  [/href="\/#Engagements"/g, 'href="/engagements/"']
];

let changed = 0;
for (const file of await collect(root)) {
  const relative = path.relative(root, file);
  const normalized = relative.replaceAll('\\', '/').toLowerCase();
  let html = await readFile(file, 'utf8');
  const original = html;

  if (normalized === 'project-direction/index.html') {
    html = html.replace(/<header\b[^>]*class="finder-header"[^>]*>[\s\S]*?<\/header>/i, renderNav('PROJECT_CURRENT').trim());
    if (!/<footer\b[^>]*class="[^"]*site-footer/i.test(html)) {
      html = html.replace('</main>', `</main>\n\n${footerReference.trim()}`);
    }
  }

  if (/<nav\b[^>]*id="nav"/i.test(html) && /<div\b[^>]*id="mob-menu"/i.test(html)) {
    html = html.replace(/<nav\b[^>]*id="nav"[^>]*>[\s\S]*?<\/nav>\s*(?:<!--[\s\S]*?-->\s*)?<div\b[^>]*id="mob-menu"[^>]*>[\s\S]*?<\/div>/i, renderNav(currentFor(relative)).trim());
  }
  if (relative.replaceAll('\\', '/') === '404.html' && !/<nav\b[^>]*id="nav"/i.test(html)) {
    html = html.replace(/\s*<a href="\/" class="brand"[\s\S]*?<\/a>/i, '');
    html = html.replace('<body>', `<body>\n<a href="#main-content" class="skip-link">Skip to main content</a>\n${renderNav('')}`);
    html = html.replace('<main class="error-main">', '<main class="error-main" id="main-content">');
  }
  if (/<footer\b[^>]*class="[^"]*site-footer/i.test(html)) {
    html = html.replace(/<footer\b[^>]*class="[^"]*site-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i, footerReference.trim());
  }
  html = html.replace(/\s*<meta\s+name="keywords"[^>]*\/?>\s*/gi, '\n');
  replacements.forEach(([pattern, value]) => { html = html.replace(pattern, value); });

  if (html !== original) {
    await writeFile(file, html, 'utf8');
    changed += 1;
  }
}

console.log(`Synchronized navigation and footer in ${changed} HTML files.`);
