import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const socialPrefix = 'https://squargraph.com/assets/images/social/og-v20260720/';
const expectedVersion = '-v20260720.webp';
const deprecatedMetadataUrls = [
  'https://squargraph.com/squargraph-brand-image.webp',
  'https://squargraph.com/assets/images/partners/partner-og-collaboration.webp',
  'https://squargraph.com/assets/images/blog/why-execution-matters.webp'
];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(absolute));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)=["']([^"']*)["']/g)].map((match) => [match[1].toLowerCase(), match[2]]));
}

function metaValues(html, attribute, key) {
  return (html.match(/<meta\b[^>]*>/gi) || [])
    .map(attributes)
    .filter((attrs) => attrs[attribute] === key)
    .map((attrs) => attrs.content || '');
}

function exactlyOne(html, attribute, key, file, failures) {
  const values = metaValues(html, attribute, key);
  if (values.length !== 1) failures.push(`${file}: expected one ${key} tag, found ${values.length}`);
  return values[0] || '';
}

const files = await htmlFiles(root);
const failures = [];
const referenced = new Set();

for (const absolute of files) {
  const relative = path.relative(root, absolute).replaceAll('\\', '/');
  const html = await readFile(absolute, 'utf8');
  const ogImage = exactlyOne(html, 'property', 'og:image', relative, failures);
  const twitterImage = exactlyOne(html, 'name', 'twitter:image', relative, failures);
  const ogAlt = exactlyOne(html, 'property', 'og:image:alt', relative, failures);
  const twitterAlt = exactlyOne(html, 'name', 'twitter:image:alt', relative, failures);
  const width = exactlyOne(html, 'property', 'og:image:width', relative, failures);
  const height = exactlyOne(html, 'property', 'og:image:height', relative, failures);
  const type = exactlyOne(html, 'property', 'og:image:type', relative, failures);
  const card = exactlyOne(html, 'name', 'twitter:card', relative, failures);

  if (ogImage !== twitterImage) failures.push(`${relative}: Open Graph and Twitter images differ`);
  if (ogAlt !== twitterAlt) failures.push(`${relative}: Open Graph and Twitter alt text differs`);
  if (!ogAlt.trim()) failures.push(`${relative}: social-image alt text is empty`);
  if (!ogImage.startsWith(socialPrefix) || !ogImage.endsWith(expectedVersion)) failures.push(`${relative}: social image is not versioned in the approved directory`);
  if (width !== '1200' || height !== '630') failures.push(`${relative}: expected 1200 x 630 metadata`);
  if (type !== 'image/webp') failures.push(`${relative}: expected image/webp metadata`);
  if (card !== 'summary_large_image') failures.push(`${relative}: expected summary_large_image Twitter card`);

  if (ogImage.startsWith(socialPrefix)) {
    const imagePath = path.join(root, new URL(ogImage).pathname.slice(1));
    try {
      await access(imagePath);
      referenced.add(path.basename(imagePath));
    } catch {
      failures.push(`${relative}: missing social image ${ogImage}`);
    }
  }

  const metaAndJsonLd = [
    ...(html.match(/<meta\b[^>]*>/gi) || []),
    ...(html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [])
  ].join('\n');
  for (const legacyUrl of deprecatedMetadataUrls) {
    if (metaAndJsonLd.includes(legacyUrl)) failures.push(`${relative}: deprecated metadata image ${legacyUrl}`);
  }
}

const generated = (await readdir(path.join(root, 'assets', 'images', 'social', 'og-v20260720')))
  .filter((name) => name.startsWith('og-') && name.endsWith('.webp'));
for (const image of generated) {
  if (!referenced.has(image)) failures.push(`Unreferenced generated social image: ${image}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Social metadata audit passed: ${files.length} pages, ${referenced.size} versioned images.`);
}
