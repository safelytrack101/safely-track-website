// Stamps the shared header and footer (partials/*.html) into every page that has site navigation.
// Edit the partials or assets/site-chrome.css, then run from the repo root: node scripts/chrome.mjs
// The first run replaces each page's own <nav> and <footer>; later runs replace what sits between
// the site-header / site-footer marker comments. The ehs-guide landing pages have no nav on purpose
// and are skipped.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const header = readFileSync('partials/header.html', 'utf8').trim();
const footer = readFileSync('partials/footer.html', 'utf8').trim();

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  if (e.name.startsWith('.') || ['node_modules', 'partials', 'resources', 'scripts', 'assets', 'demo-videos'].includes(e.name)) return [];
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
});

const block = (name, html) => `<!-- site-${name}:start -->\n${html}\n<!-- site-${name}:end -->`;
const swap = (page, name, tag, html, file) => {
  const marked = new RegExp(`<!-- site-${name}:start -->[\\s\\S]*?<!-- site-${name}:end -->`);
  if (marked.test(page)) return page.replace(marked, () => block(name, html));
  const raw = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`);
  if (!raw.test(page)) throw new Error(`${file}: no <${tag}> or site-${name} markers`);
  return page.replace(raw, () => block(name, html));
};

let count = 0;
for (const abs of walk(ROOT)) {
  const file = relative(ROOT, abs).split(sep).join('/');
  let page = readFileSync(abs, 'utf8');
  if (!/<nav\b|site-header:start/.test(page)) continue;
  const root = '../'.repeat(file.split('/').length - 1);
  const fill = s => s.replaceAll('{{root}}', root);
  page = swap(page, 'header', 'nav', fill(header), file);
  page = swap(page, 'footer', 'footer', fill(footer), file);
  const css = `<link rel="stylesheet" href="${root}assets/site-chrome.css">`;
  const js = `<script src="${root}assets/site-chrome.js" defer></script>`;
  if (!page.includes('assets/site-chrome.css')) page = page.replace('</head>', `${css}\n${js}\n</head>`);
  writeFileSync(abs, page);
  count++;
}
console.log(`Stamped header and footer into ${count} pages.`);
