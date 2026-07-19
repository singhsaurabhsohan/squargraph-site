import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['.git', 'node_modules', 'supabase', 'tools', 'components', 'assets', 'docs', 'tmp', 'workers']);
const errors = [];
const warnings = [];

async function collectHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

async function exists(absolute) {
  try {
    await access(absolute);
    return true;
  } catch {
    return false;
  }
}

function relative(file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function localTarget(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean.startsWith('/') || clean.startsWith('//')) return null;
  const route = clean === '/' ? '' : clean.slice(1).replace(/\/$/, '');
  return [
    path.join(root, `${route}.html`),
    path.join(root, route, 'index.html'),
    path.join(root, route),
  ];
}

const htmlFiles = await collectHtml(root);
const htmlCache = new Map();
for (const file of htmlFiles) htmlCache.set(file, await readFile(file, 'utf8'));

const intelligence = JSON.parse(await readFile(path.join(root, 'assets/data/intelligence.json'), 'utf8'));
const runtimeAnchors = new Set(
  (intelligence.entries || [])
    .filter((entry) => entry.published === true && entry.type === 'study' && entry.slug)
    .map((entry) => `study-${entry.slug}`),
);

const footerHashes = new Map();
for (const [file, html] of htmlCache) {
  const rel = relative(file);
  const footer = html.match(/<footer\b[^>]*class="[^"]*site-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i)?.[0] || '';
  if (rel !== 'project-direction/index.html') {
    if (!footer) errors.push(`${rel}: shared footer is missing`);
    else {
      const hash = crypto.createHash('sha256').update(footer).digest('hex');
      footerHashes.set(rel, hash);
      const links = [...footer.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
      const duplicates = [...new Set(links.filter((href, index) => links.indexOf(href) !== index))];
      if (duplicates.length) errors.push(`${rel}: duplicate footer links: ${duplicates.join(', ')}`);
    }
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const candidates = localTarget(href);
    if (!candidates) continue;
    const target = await Promise.all(candidates.map(exists));
    if (!target.some(Boolean)) errors.push(`${rel}: unresolved internal link ${href}`);

    const fragment = href.includes('#') ? decodeURIComponent(href.split('#')[1]) : '';
    if (fragment) {
      const targetFile = candidates[target.findIndex(Boolean)];
      const targetHtml = targetFile && targetFile.endsWith('.html') ? await readFile(targetFile, 'utf8') : '';
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hasStaticAnchor = new RegExp(`(?:id|name)=["']${escaped}["']`, 'i').test(targetHtml);
      if (!hasStaticAnchor && !runtimeAnchors.has(fragment)) errors.push(`${rel}: unresolved fragment ${href}`);
    }
  }

  for (const match of html.matchAll(/<img\b([^>]+)>/gi)) {
    const attrs = match[1];
    const src = attrs.match(/src="([^"]+)"/i)?.[1] || '';
    if (!src || /^(?:https?:|data:|\/\/)/i.test(src)) continue;
    const local = path.join(root, src.replace(/^\//, '').split('?')[0]);
    if (!await exists(local)) errors.push(`${rel}: missing image ${src}`);
    if (/\/assets\/images\/(?:blog|work)\//.test(src) || /boat-brand-quotient\.webp/.test(src)) {
      if (!/\balt="[^"]+"/i.test(attrs)) errors.push(`${rel}: new image needs descriptive alt text ${src}`);
      if (!/\bwidth="\d+"/i.test(attrs) || !/\bheight="\d+"/i.test(attrs)) errors.push(`${rel}: new image needs width and height ${src}`);
    }
  }

  const prohibited = [
    ['dQw4w9WgXcQ', 'unrelated dormant YouTube reference'],
    ['href="/websites-digital-experiences.html"', 'non-canonical website engagement link'],
    ['href="/work/#squargraph-work"', 'work self-loop link'],
    ['featured-img-placeholder', 'featured placeholder media'],
    ['post-thumb-placeholder', 'blog placeholder media'],
    ['work-entry-media work-entry-media--system', 'blank work media'],
    ['architecture-work-media architecture-work-media--system', 'blank homepage work media'],
  ];
  prohibited.forEach(([needle, label]) => {
    if (html.includes(needle)) errors.push(`${rel}: ${label}`);
  });
}

const footerVariants = new Set(footerHashes.values());
if (footerVariants.size > 1) errors.push(`shared footer mismatch across ${footerHashes.size} pages`);

const work = JSON.parse(await readFile(path.join(root, 'assets/data/work.json'), 'utf8'));
for (const entry of (work.entries || []).filter((item) => item.published === true)) {
  if (!entry.image) errors.push(`work.json: blank image for ${entry.id}`);
  else if (!await exists(path.join(root, entry.image.replace(/^\//, '')))) errors.push(`work.json: missing image ${entry.image}`);
  if (!entry.imageAlt) errors.push(`work.json: missing image alt for ${entry.id}`);
}

for (const entry of (intelligence.entries || []).filter((item) => item.published === true && item.media?.type === 'image')) {
  if (!entry.media.url || !await exists(path.join(root, entry.media.url.replace(/^\//, '')))) {
    errors.push(`intelligence.json: missing image for ${entry.slug || entry.id}`);
  }
}

const blogHtml = htmlCache.get(path.join(root, 'blog.html')) || '';
const blogCovers = [...blogHtml.matchAll(/(?:featured-img-inner|post-thumb-img)[^>]+src="([^"]+)"/g)].map((match) => match[1]);
if (blogCovers.length !== 7) errors.push(`blog.html: expected 7 editorial covers, found ${blogCovers.length}`);
if (new Set(blogCovers).size !== blogCovers.length) errors.push('blog.html: repeated editorial cover image');

const legacyHtml = htmlCache.get(path.join(root, 'creative-agency-delhi.html')) || '';
const gumletPosters = [...legacyHtml.matchAll(/data-src="(https:\/\/play\.gumlet\.io\/embed\/[^"]+)"[^>]+background:url\('([^']+)'\)/g)];
if (gumletPosters.length !== 11) errors.push(`creative-agency-delhi.html: expected 11 Gumlet poster mappings, found ${gumletPosters.length}`);
for (const [, , poster] of gumletPosters) {
  if (!await exists(path.join(root, poster.replace(/^\//, '')))) errors.push(`creative-agency-delhi.html: missing video poster ${poster}`);
}

const allSource = [...htmlCache.values()].join('\n') + '\n' + await readFile(path.join(root, 'assets/data/intelligence.json'), 'utf8');
if (allSource.includes('dQw4w9WgXcQ')) errors.push('dormant unrelated YouTube ID remains');
if (/href="\/engagements"[^>]*>Discovery Session/i.test(allSource)) errors.push('Discovery Session still points to /engagements');

if (warnings.length) warnings.forEach((warning) => console.warn(`WARN ${warning}`));
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  console.error(`Final architecture audit failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Final architecture audit passed.`);
console.log(`${htmlFiles.length} HTML files checked.`);
console.log(`${footerHashes.size} shared footers match with no duplicate links.`);
console.log(`${blogCovers.length} unique blog covers found.`);
console.log(`${gumletPosters.length} Gumlet embeds have local poster assets.`);
