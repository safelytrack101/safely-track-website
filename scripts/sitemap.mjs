// Regenerates sitemap.xml with each page's real last-change date from git.
// Run from the repo root after committing page changes: node scripts/sitemap.mjs
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const BASE = 'https://usesafelytrack.com/';

// [path, changefreq, priority]. Thank-you pages and other form steps stay out.
const PAGES = [
  ['', 'weekly', '1.0'],
  ['safety-consultant-software.html', 'monthly', '0.9'],
  ['loss-control.html', 'monthly', '0.9'],
  ['ehs-inhouse.html', 'monthly', '0.9'],
  ['safetyculture-alternative.html', 'monthly', '0.8'],
  ['safetyculture-alternative-retail-hospitality-facilities.html', 'monthly', '0.8'],
  ['sitedocs-alternative.html', 'monthly', '0.8'],
  ['safety-reports-alternative.html', 'monthly', '0.8'],
  ['safety-training-software.html', 'monthly', '0.8'],
  ['safety-bench.html', 'monthly', '0.8'],
  ['get-started.html', 'monthly', '0.6'],
  ['quiz.html', 'monthly', '0.6'],
  ['whitepaper.html', 'monthly', '0.6'],
  ['resources/ehs-guide/', 'monthly', '0.5'],
  ['resources/ehs-guide/consultant/', 'monthly', '0.5'],
  ['resources/ehs-guide/loss-control/', 'monthly', '0.5'],
  ['resources/ehs-guide/in-house/', 'monthly', '0.5'],
  ['blog/', 'weekly', '0.8'],
  ['blog/proof-of-fix.html', 'monthly', '0.7'],
  ['blog/hazard-observations-that-get-fixed.html', 'monthly', '0.7'],
  ['blog/weekly-client-safety-summary.html', 'monthly', '0.7'],
  ['blog/introducing-safety-bench.html', 'monthly', '0.7'],
  ['blog/ai-in-ehs-assp-survey.html', 'monthly', '0.7'],
  ['blog/ai-human-oversight-ehs-policy.html', 'monthly', '0.7'],
  ['blog/ehs-data-quality-before-ai.html', 'monthly', '0.7'],
];

const fileFor = p => (p === '' || p.endsWith('/')) ? p + 'index.html' : p;
const lastmod = p => {
  const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', fileFor(p)], { encoding: 'utf8' }).trim();
  if (!d) throw new Error('no git history for ' + fileFor(p) + ' (commit it first)');
  return d;
};

const urls = PAGES.map(([p, freq, pri]) => `  <url>
    <loc>${BASE}${p}</loc>
    <lastmod>${lastmod(p)}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`).join('\n');

writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
console.log('sitemap.xml: ' + PAGES.length + ' URLs');
