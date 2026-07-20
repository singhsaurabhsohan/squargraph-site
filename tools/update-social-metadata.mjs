import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageRoot = 'https://squargraph.com/assets/images/social/og-v20260720';

const pages = {
  'index.html': ['og-home-v20260720.webp', 'Connected brand, campaign, digital, film, and performance system by SQUARGRAPH'],
  'work/index.html': ['og-work-v20260720.webp', 'Selected SQUARGRAPH brand, campaign, digital, and film work'],
  'work/zucero/index.html': ['og-zucero-v20260720.webp', 'ZUCERO editorial website experience presented by SQUARGRAPH'],
  'capabilities/index.html': ['og-capabilities-v20260720.webp', 'SQUARGRAPH connected capability system across brand, digital, content, media, influence, and visibility'],
  'engagements/index.html': ['og-engagements-v20260720.webp', 'SQUARGRAPH engagement pathways for discovery, audit, foundation, digital experience, and growth'],
  'intelligence.html': ['og-intelligence-v20260720.webp', 'SQUARGRAPH brand intelligence system for perception-led decisions'],
  'studio/index.html': ['og-studio-v20260720.webp', 'Founder-led SQUARGRAPH studio aligning brand decisions and execution'],
  'project-direction/index.html': ['og-project-direction-v20260720.webp', 'SQUARGRAPH Project Direction guided requirement experience'],
  'partners/index.html': ['og-partners-v20260720.webp', 'Specialist expertise aligned through one SQUARGRAPH strategic direction'],
  'saurabh-sohan-singh.html': ['og-founder-v20260720.webp', 'Saurabh Sohan Singh, Founder and Creative Strategist at SQUARGRAPH'],
  'blog.html': ['og-blog-v20260720.webp', 'SQUARGRAPH strategy notes on positioning, execution, perception, and growth'],
  'blog/why-execution-matters.html': ['og-why-execution-matters-v20260720.webp', 'Why execution matters more than ideas, a SQUARGRAPH strategy article'],
  'discovery.html': ['og-discovery-v20260720.webp', 'SQUARGRAPH Discovery Session for focused strategic direction'],
  'audit.html': ['og-brand-growth-audit-v20260720.webp', 'SQUARGRAPH Brand Growth Audit identifying gaps between intent and perception'],
  'brand-foundation-sprint.html': ['og-brand-foundation-sprint-v20260720.webp', 'SQUARGRAPH Brand Foundation Sprint for clarity before scale'],
  'websites-digital-experiences.html': ['og-website-digital-experience-v20260720.webp', 'SQUARGRAPH website and digital experience system'],
  'growth-partner.html': ['og-integrated-growth-partnership-v20260720.webp', 'SQUARGRAPH Integrated Growth Partnership aligning brand and growth'],
  'creative-agency-delhi.html': ['og-creative-agency-delhi-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio in New Delhi'],
  'privacy-policy.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  'terms-of-use.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  'refund-policy.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  'ai-disclosure.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  'sitemap/index.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  'feedback.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  '404.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio'],
  'audit-results.html': ['og-utility-v20260720.webp', 'SQUARGRAPH brand strategy, creative, and digital studio']
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function removeMeta(html, attribute, key) {
  const escaped = escapeRegExp(key);
  const patterns = [
    new RegExp(`^[ \\t]*<meta\\s+${attribute}=["']${escaped}["']\\s+content=["'][^"']*["']\\s*\\/?>(?:\\r?\\n)?`, 'gim'),
    new RegExp(`^[ \\t]*<meta\\s+content=["'][^"']*["']\\s+${attribute}=["']${escaped}["']\\s*\\/?>(?:\\r?\\n)?`, 'gim')
  ];
  return patterns.reduce((current, pattern) => current.replace(pattern, ''), html);
}

function insertAfterMeta(html, attribute, key, block) {
  const escaped = escapeRegExp(key);
  const pattern = new RegExp(`(^[ \\t]*<meta\\s+${attribute}=["']${escaped}["']\\s+content=["'][^"']*["']\\s*\\/?>)`, 'im');
  if (pattern.test(html)) return html.replace(pattern, `$1\n${block}`);
  return html.replace(/<\/head>/i, `${block}\n</head>`);
}

for (const [relativePath, [filename, alt]] of Object.entries(pages)) {
  const file = path.join(root, relativePath);
  let html = await readFile(file, 'utf8');
  const image = `${imageRoot}/${filename}`;

  for (const key of ['og:image', 'og:image:width', 'og:image:height', 'og:image:type', 'og:image:alt']) {
    html = removeMeta(html, 'property', key);
  }
  for (const key of ['twitter:image', 'twitter:image:alt']) {
    html = removeMeta(html, 'name', key);
  }

  const ogBlock = [
    `  <meta property="og:image" content="${image}" />`,
    '  <meta property="og:image:width" content="1200" />',
    '  <meta property="og:image:height" content="630" />',
    '  <meta property="og:image:type" content="image/webp" />',
    `  <meta property="og:image:alt" content="${alt}" />`
  ].join('\n');
  const twitterBlock = [
    `  <meta name="twitter:image" content="${image}" />`,
    `  <meta name="twitter:image:alt" content="${alt}" />`
  ].join('\n');

  html = insertAfterMeta(html, 'property', 'og:site_name', ogBlock);
  html = insertAfterMeta(html, 'name', 'twitter:description', twitterBlock);

  if (relativePath === 'index.html' || relativePath === 'creative-agency-delhi.html') {
    html = html.replace(/"image":\s*"https:\/\/squargraph\.com\/squargraph-brand-image\.webp"/g, `"image": "${image}"`);
  }
  if (relativePath === 'blog/why-execution-matters.html') {
    html = html.replace(/"image":\s*"https:\/\/squargraph\.com\/assets\/images\/blog\/why-execution-matters\.webp"/g, `"image": "${image}"`);
  }

  await writeFile(file, html, 'utf8');
  console.log(`${relativePath} -> ${filename}`);
}
