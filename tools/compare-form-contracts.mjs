import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseline = process.argv[2] || 'backup/pre-architecture-20260718';
const files = [
  'index.html',
  'discovery.html',
  'audit.html',
  'brand-foundation-sprint.html',
  'websites-digital-experiences.html',
  'growth-partner.html',
  'feedback.html',
  'partners/index.html',
  'project-direction/index.html'
];

function formsIn(html) {
  return Array.from(html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)).map(function (match, index) {
    var id = match[1].match(/\bid=["']([^"']+)["']/i);
    var names = Array.from(match[0].matchAll(/\bname=["']([^"']+)["']/gi))
      .map(function (field) { return field[1]; })
      .filter(function (name, position, all) { return all.indexOf(name) === position; })
      .sort();
    return { id: id ? id[1] : 'form-' + (index + 1), names: names };
  });
}

var errors = [];
files.forEach(function (file) {
  var current = formsIn(readFileSync(file, 'utf8'));
  var previousHtml;
  try {
    previousHtml = execFileSync('git', ['show', baseline + ':' + file], { encoding: 'utf8' });
  } catch (error) {
    errors.push(file + ': could not read baseline from ' + baseline);
    return;
  }
  var previous = formsIn(previousHtml);
  if (JSON.stringify(current) !== JSON.stringify(previous)) {
    errors.push(file + ': form ids or field names changed\n  before ' + JSON.stringify(previous) + '\n  after  ' + JSON.stringify(current));
  }
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Form contracts match ' + baseline + ' across ' + files.length + ' integration pages.');
}
