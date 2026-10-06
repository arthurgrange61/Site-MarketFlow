/* ══ GA4 + Consent Mode v2 ══ */
(function () {
  var GA_ID = 'G-VKGLEBT0QS';
  var KEY = 'mf_cookie_consent';

  /* ---------- dataLayer & gtag ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  /* Consent Mode v2 — tout refusé par défaut */
  gtag('consent', 'default', {
    analytics_storage:   'denied',
    ad_storage:          'denied',
    ad_user_data:        'denied',
    ad_personalization:  'denied',
    wait_for_update:     500
  });

  /* ---------- Charger GA4 ---------- */
  var _ga4Loaded = false;
  function loadGA4() {
    if (_ga4Loaded) return;
    _ga4Loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  /* ---------- Consentement ---------- */
  function grant() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    localStorage.setItem(KEY, 'accepted');
    loadGA4();
  }
  function deny() {
    localStorage.setItem(KEY, 'refused');
  }

  /* Si déjà accepté : charger GA4 immédiatement */
  var saved = localStorage.getItem(KEY);
  if (saved === 'accepted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGA4();
  }

  /* ---------- Bandeau cookie ---------- */
  function buildBanner() {
    var b = document.createElement('div');
    b.id = 'mf-cookie-banner';
    b.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'z-index:9999', 'background:#fff', 'border:1px solid #e5e5e5',
      'border-radius:16px', 'padding:16px 22px', 'display:none',
      'align-items:center', 'gap:16px',
      'box-shadow:0 8px 32px rgba(0,0,0,.1)',
      'max-width:620px', 'width:calc(100% - 48px)', 'flex-wrap:wrap'
    ].join(';');
    b.innerHTML =
      '<p style="font-size:13px;color:#555;line-height:1.6;margin:0;flex:1 1 220px;">' +
        'Ce site utilise des cookies analytiques pour mesurer son audience. ' +
        '<a href="politique-confidentialite.html" style="color:#000;text-decoration:underline;">En savoir plus</a>' +
      '</p>' +
      '<div style="display:flex;gap:10px;flex-shrink:0;">' +
        '<button id="ck-no" style="padding:8px 18px;border:1px solid #e5e5e5;border-radius:100px;background:#fff;font-family:\'DM Sans\',sans-serif;font-size:13px;color:#555;cursor:pointer;">Refuser</button>' +
        '<button id="ck-yes" style="padding:8px 20px;border:none;border-radius:100px;background:#000;font-family:\'DM Sans\',sans-serif;font-size:13px;font-weight:500;color:#fff;cursor:pointer;">Accepter</button>' +
      '</div>';
    document.body.appendChild(b);
    return b;
  }

  function wireBanner(b) {
    var yes = document.getElementById('ck-yes');
    var no  = document.getElementById('ck-no');
    if (yes) yes.addEventListener('click', function () { grant(); b.style.display = 'none'; });
    if (no)  no.addEventListener('click',  function () { deny();  b.style.display = 'none'; });
  }

  function wireManageLinks() {
    document.querySelectorAll('[data-cookie-manage]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem(KEY);
        var b = document.getElementById('mf-cookie-banner');
        if (b) b.style.display = 'flex';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var existing = document.getElementById('mf-cookie-banner');
    var b = existing || buildBanner();
    wireBanner(b);
    if (!saved) b.style.display = 'flex';
    wireManageLinks();
  });
})();
