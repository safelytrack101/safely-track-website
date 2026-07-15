/* Shared lead-capture handler for the EHS-guide role landing pages.
   Config comes from the <form> data-* attributes:
     data-guide  → guide key (consultant | loss-control | in-house)
     data-pdf    → absolute path to the guide PDF (used in the inbox autoresponse)
   The form POSTs to Formspree, then redirects to the shared thank-you page. */
(function () {
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykakkww';
  var CALENDLY = 'https://calendly.com/thomas-usesafelytrack/30min';

  var form = document.getElementById('lead-form');
  if (!form) return;

  var guide = form.getAttribute('data-guide') || '';
  var pdf = form.getAttribute('data-pdf') || '';
  var btn = document.getElementById('submit-btn');
  var errorBox = document.getElementById('form-error');

  // Read ?source= from the URL (defaults to "direct").
  var source = 'direct';
  try {
    var p = new URLSearchParams(window.location.search);
    if (p.get('source')) source = p.get('source').slice(0, 60);
  } catch (e) { /* no-op */ }
  var sourceField = document.getElementById('source');
  if (sourceField) sourceField.value = source;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorBox.style.display = 'none';

    var firstName = form.first_name.value.trim();
    var lastName = form.last_name.value.trim();
    var email = form.email.value.trim();

    if (!firstName || !lastName || !email) {
      errorBox.textContent = 'Please fill in your first name, last name, and work email.';
      errorBox.style.display = 'block';
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;

    var pdfUrl = 'https://usesafelytrack.com' + pdf;
    var payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      job_title: form.job_title.value.trim(),
      company: form.company.value.trim(),
      whitepaper: form.whitepaper.value,
      source: source,
      _subject: form._subject.value,
      _autoresponse: 'Hi ' + firstName + ', thanks for downloading our guide.\n\n' +
        'You can access it here: ' + pdfUrl + '\n\n' +
        'Want to see Safely Track turn field notes into a client-ready report in minutes? ' +
        'Book a 15-minute demo: ' + CALENDLY + '\n\n' +
        '— The Safely Track team\nusesafelytrack.com'
    };

    try {
      var res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Bad response');
      window.location.href = '../thank-you/?guide=' + encodeURIComponent(guide) +
        '&email=' + encodeURIComponent(email);
    } catch (err) {
      btn.textContent = btn.getAttribute('data-label') || 'Get the Free Guide →';
      btn.disabled = false;
      errorBox.innerHTML = 'Something went wrong sending your request. Please try again, or email ' +
        '<a href="mailto:thomas@usesafelytrack.com">thomas@usesafelytrack.com</a>.';
      errorBox.style.display = 'block';
    }
  });
})();
