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
  window.gtag('config', GA4_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
})();
