// Shared header behaviour: the phone menu button and the dropdowns.
// Dropdowns open on click (and on hover with a mouse), close on Escape or a click outside.
(function () {
  var header = document.querySelector('.st-header');
  if (!header) return;
  var menuBtn = header.querySelector('.st-menu-btn');
  var dds = Array.prototype.slice.call(header.querySelectorAll('.st-dd'));
  var hoverable = window.matchMedia('(hover: hover) and (min-width: 961px)');

  function setDd(dd, open) {
    dd.classList.toggle('is-open', open);
    dd.querySelector('.st-dd-btn').setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) {
    dds.forEach(function (dd) { if (dd !== except) setDd(dd, false); });
  }
  function setMenu(open) {
    header.classList.toggle('is-menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAll();
  }

  dds.forEach(function (dd) {
    var btn = dd.querySelector('.st-dd-btn');
    btn.addEventListener('click', function () {
      // With a mouse the panel is already open from hover; a click should not shut it.
      var open = hoverable.matches || !dd.classList.contains('is-open');
      closeAll(dd);
      setDd(dd, open);
    });
    dd.addEventListener('mouseenter', function () { if (hoverable.matches) { closeAll(dd); setDd(dd, true); } });
    dd.addEventListener('mouseleave', function () { if (hoverable.matches) setDd(dd, false); });
  });

  menuBtn.addEventListener('click', function () {
    setMenu(!header.classList.contains('is-menu-open'));
  });

  // Following an in-page link (index.html#how-it-works) should close the phone menu.
  header.querySelectorAll('.st-menu a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) { closeAll(); setMenu(false); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openDd = dds.filter(function (dd) { return dd.classList.contains('is-open'); })[0];
    if (openDd) { setDd(openDd, false); openDd.querySelector('.st-dd-btn').focus(); }
    else if (header.classList.contains('is-menu-open')) { setMenu(false); menuBtn.focus(); }
  });

  // Mark the current page so it reads as "you are here".
  var here = location.pathname.replace(/\/index\.html$/, '/');
  header.querySelectorAll('.st-menu a[href]').forEach(function (a) {
    var url = new URL(a.getAttribute('href'), location.href);
    if (url.hash || url.origin !== location.origin) return;
    if (url.pathname.replace(/\/index\.html$/, '/') === here) a.setAttribute('aria-current', 'page');
  });
})();
