/* AI-referral tagging, on every page, with or without GA4.
   A visit that arrives from an AI assistant (by referrer, or by the
   utm_source those assistants add to links) is remembered for the session
   as window.stAiSource, e.g. "chatgpt". Lead forms send it with the lead:
   any hidden input with class "st-ai-source" is filled in, and the homepage
   email capture adds it to its post. Once GA4 is on, it is also set as the
   user property ai_source and logged as an ai_referral event, so AI-referred
   visits can be compared with the rest. */
(function () {
  var SOURCES = [
    ['chatgpt', /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$/],
    ['claude', /(^|\.)claude\.ai$/],
    ['perplexity', /(^|\.)perplexity\.ai$/],
    ['gemini', /(^|\.)gemini\.google\.com$/],
    ['copilot', /(^|\.)(copilot\.microsoft\.com|copilot\.cloud\.microsoft)$/],
    ['grok', /(^|\.)grok\.com$/],
    ['meta-ai', /(^|\.)meta\.ai$/],
    ['deepseek', /(^|\.)chat\.deepseek\.com$/],
    ['mistral', /(^|\.)chat\.mistral\.ai$/],
    ['you', /(^|\.)you\.com$/]
  ];
  function match(host) {
    host = (host || '').toLowerCase().replace(/^www\./, '');
    for (var i = 0; i < SOURCES.length; i++) if (SOURCES[i][1].test(host)) return SOURCES[i][0];
    return '';
  }

  var found = '';
  try { found = match(new URL(document.referrer).hostname); } catch (e) {}
  if (!found) {
    var utm = (/[?&]utm_source=([^&#]+)/.exec(location.search) || [])[1];
    if (utm) { utm = decodeURIComponent(utm); found = match(utm) || match(utm + '.com'); }
  }

  var KEY = 'st_ai_source';
  window.stAiLanding = !!found; /* true only on the page the visit arrived on */
  try {
    if (found) sessionStorage.setItem(KEY, found);
    else found = sessionStorage.getItem(KEY) || '';
  } catch (e) {}
  window.stAiSource = found;
  if (!found) return;

  document.addEventListener('DOMContentLoaded', function () {
    var inputs = document.querySelectorAll('input.st-ai-source');
    for (var i = 0; i < inputs.length; i++) inputs[i].value = found;
  });
})();

/* Google Analytics 4 for every page on the site.
   Set GA4_ID to the property's measurement ID (G-XXXXXXXXXX) to turn it on.
   While it is empty nothing loads, and the per-page track() helpers keep
   falling back to console.log. Once set, window.gtag exists, so those
   helpers send their events (book_audit_clicked, book_pilot_clicked, ...)
   to GA4 with no call-site changes. Enhanced measurement in GA4 records
   outbound clicks, which covers every Calendly "Book a demo" button. */
(function () {
  var GA4_ID = '';
  if (!GA4_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  if (window.stAiSource) window.gtag('set', 'user_properties', { ai_source: window.stAiSource });
  window.gtag('config', GA4_ID);
  if (window.stAiLanding) window.gtag('event', 'ai_referral', { ai_source: window.stAiSource });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
})();
