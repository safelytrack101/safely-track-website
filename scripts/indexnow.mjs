// Tells Bing (and other IndexNow engines) which pages changed in a deploy.
// Usage, from the repo root, after the deploy is live:
//   node scripts/indexnow.mjs                 pages changed in the last commit
//   node scripts/indexnow.mjs <git-ref>       pages changed since <git-ref>, e.g. origin/main@{1}
//   node scripts/indexnow.mjs --all           every URL in sitemap.xml
//   add --dry-run to print the URLs without sending them
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const HOST = 'usesafelytrack.com';
const KEY = '1664672d22d03af71cd9cc838340ab6f'; // must match the 1664672d22d03af71cd9cc838340ab6f.txt file at the site root

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const ref = args.find(a => !a.startsWith('--'));

let urls;
if (args.includes('--all')) {
  urls = [...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
} else {
  const range = ref ? [ref, 'HEAD'] : ['HEAD~1', 'HEAD'];
  const changed = execFileSync('git', ['diff', '--name-only', '--diff-filter=AMR', ...range], { encoding: 'utf8' })
    .split('\n').filter(f => f.endsWith('.html'));
  const inSitemap = new Set([...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
  urls = changed
    .map(f => 'https://' + HOST + '/' + f.replace(/(^|\/)index\.html$/, '$1'))
    .filter(u => inSitemap.has(u)); // skips thank-you pages and anything else kept out of the sitemap
}

if (!urls.length) { console.log('No indexable pages changed.'); process.exit(0); }
console.log(urls.join('\n'));
if (dry) process.exit(0);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls }),
});
console.log('IndexNow: HTTP ' + res.status + (res.status === 200 || res.status === 202 ? ' (accepted)' : ' ' + await res.text()));
