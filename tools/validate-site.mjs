import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', 'node_modules']);
const errors = [];
const warnings = [];

async function collect(directory, extension) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await collect(absolute, extension));
    else if (entry.isFile() && entry.name.endsWith(extension)) found.push(absolute);
  }
  return found;
}

function routeTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '/') return path.join(root, 'index.html');
  const relative = clean.replace(/^\//, '');
  if (!relative) return path.join(root, 'index.html');
  if (path.extname(relative)) return path.join(root, relative);
  const directoryIndex = path.join(root, relative, 'index.html');
  const htmlPage = path.join(root, `${relative}.html`);
  return { directoryIndex, htmlPage };
}

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}

async function routeExists(href) {
  const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
  if (['/login', '/register', '/forgot-password', '/reset-password', '/logout'].includes(clean) || /^\/app(?:\/|$)/.test(clean)) return true;
  const target = routeTarget(href);
  if (typeof target === 'string') return exists(target);
  return (await exists(target.directoryIndex)) || (await exists(target.htmlPage));
}

const htmlFiles = await collect(root, '.html');
const publicHtml = htmlFiles.filter((file) => !file.includes(`${path.sep}components${path.sep}`));
const requiredNavLinks = ['/work/', '/capabilities/', '/engagements/', '/intelligence', '/studio/', '/project-direction/'];
const requiredFooterLinks = ['/work/', '/capabilities/', '/engagements/', '/intelligence', '/studio/', '/partners/', '/saurabh-sohan-singh', '/sitemap/', '/ai-disclosure', '/feedback', '/privacy-policy', '/terms-of-use', '/refund-policy'];

for (const file of publicHtml) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  const is404 = relative === '404.html';
  const isFocusedFlow = relative === 'project-direction/index.html';
  const isPrivateResult = relative === 'audit-results.html';
  const isPrivateAdmin = relative.startsWith('admin/') || relative.startsWith('app/') || relative.startsWith('auth/');

  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${relative}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) errors.push(`${relative}: missing meta description`);
  if (!is404 && !/<link\s+rel="canonical"\s+href="https:\/\/squargraph\.com\/[^"]*"/i.test(html)) errors.push(`${relative}: missing absolute canonical`);
  if (!isPrivateResult && !isPrivateAdmin) {
    ['og:title', 'og:description', 'og:image'].forEach((property) => {
      if (!new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]+"`, 'i').test(html)) errors.push(`${relative}: missing ${property}`);
    });
    ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach((name) => {
      if (!new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]+"`, 'i').test(html)) errors.push(`${relative}: missing ${name}`);
    });
  }
  if (/<meta\s+name="keywords"/i.test(html)) errors.push(`${relative}: obsolete meta keywords found`);
  if (html.includes('—')) errors.push(`${relative}: visible em dash found`);

  for (const schema of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(schema[1]); } catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }

  for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt="[^"]*"/i.test(image[1])) errors.push(`${relative}: image missing alt attribute`);
  }

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (!isPrivateResult && h1Count !== 1) warnings.push(`${relative}: expected one H1, found ${h1Count}`);

  if (!isFocusedFlow && !isPrivateAdmin) {
    if (!/<nav\b[^>]*id="nav"/i.test(html)) errors.push(`${relative}: shared navigation missing`);
    if (!/<footer\b[^>]*site-footer/i.test(html)) errors.push(`${relative}: shared footer missing`);
    requiredNavLinks.forEach((href) => {
      if (!html.includes(`href="${href}"`)) errors.push(`${relative}: navigation link ${href} missing`);
    });
    const nav = html.match(/<nav\b[^>]*id="nav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1] || '';
    let navPosition = -1;
    requiredNavLinks.forEach((href) => {
      const position = nav.indexOf(`href="${href}"`);
      if (position <= navPosition) errors.push(`${relative}: navigation order failed at ${href}`);
      navPosition = position;
    });
    if (!/<div\b[^>]*id="mob-menu"[^>]*aria-hidden="true"[^>]*inert/i.test(html)) errors.push(`${relative}: mobile navigation lacks initial hidden/inert state`);
    requiredFooterLinks.forEach((href) => {
      if (!html.includes(`href="${href}"`)) errors.push(`${relative}: footer link ${href} missing`);
    });
  }

  for (const match of html.matchAll(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/gi)) {
    const attributes = `${match[1]} ${match[3]}`;
    const href = match[2];
    if (/^https?:\/\//i.test(href) && /target="_blank"/i.test(attributes) && !/rel="[^"]*noopener/i.test(attributes)) {
      errors.push(`${relative}: target=_blank link lacks rel=noopener (${href})`);
    }
    if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) continue;
    if (href.startsWith('/')) {
      if (!await routeExists(href)) errors.push(`${relative}: broken internal link ${href}`);
    } else {
      const local = path.resolve(path.dirname(file), href.split('#')[0].split('?')[0]);
      if (href && !await exists(local)) warnings.push(`${relative}: unresolved relative link ${href}`);
    }
  }

  for (const match of html.matchAll(/<(?:img|script)\b[^>]*?src="([^"]+)"/gi)) {
    const src = match[1];
    if (/^(https?:|data:)/i.test(src)) continue;
    if (src.startsWith('/') && !await routeExists(src)) errors.push(`${relative}: missing local asset ${src}`);
  }
}

const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
const expectedHomeOrder = ['id="hero"', 'architecture-trust', 'id="work"', 'id="capabilities"', 'id="approach"', 'id="Engagements"', 'architecture-founder', 'id="intelligence"', 'id="contact"', 'site-footer'];
let lastPosition = -1;
for (const marker of expectedHomeOrder) {
  const position = homepage.indexOf(marker);
  if (position <= lastPosition) errors.push(`index.html: homepage order failed at ${marker}`);
  lastPosition = position;
}

const contactForm = homepage.match(/<form\b[^>]*id="contact-form"[\s\S]*?<\/form>/i)?.[0] || '';
['name','phone','email','company','industry','country','city','city_text','service','budget','timeline','message','reference'].forEach((name) => {
  if (!new RegExp(`name="${name}"`).test(contactForm)) errors.push(`index.html: contact field contract missing ${name}`);
});

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
['/work/','/capabilities/','/engagements/','/intelligence','/studio/','/project-direction/'].forEach((route) => {
  if (!sitemap.includes(`https://squargraph.com${route}<`)) errors.push(`sitemap.xml: ${route} missing`);
});

const workData = JSON.parse(await readFile(path.join(root, 'assets/data/work.json'), 'utf8'));
for (const entry of workData.entries || []) {
  if (!['squargraph', 'founder-previous-experience'].includes(entry.relationship)) errors.push(`work.json: invalid relationship for ${entry.id}`);
  if (entry.outcome && typeof entry.outcome !== 'string') errors.push(`work.json: invalid outcome for ${entry.id}`);
}

console.log(`Validated ${publicHtml.length} HTML files.`);
warnings.forEach((message) => console.warn(`WARN ${message}`));
errors.forEach((message) => console.error(`ERROR ${message}`));
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
