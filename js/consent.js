/* Cookie consent + Google Tag Manager (GTM-TQQF5RL4) with Consent Mode v2.

   Loaded synchronously in <head>, before anything else, so that:
   1. every Google consent signal defaults to "denied",
   2. a returning visitor's stored choice is applied BEFORE GTM loads — tags
      firing on "All Pages" already see the right state, no extra event needed,
   3. GTM itself loads only after both of the above.

   The banner / settings dialog are built once the DOM is ready. The choice is
   kept in a first-party cookie (akar_consent, 12 months) — strictly necessary,
   so it needs no consent itself.

   dataLayer events are pushed ONLY when the visitor actively decides (banner
   or settings), never on page load — so a GA tag triggered by "All Pages" +
   "consent_granted" counts the first page after opting in and never double-
   counts later pages:
     consent_granted  { consent: { analytics, marketing } }  — at least one on
     consent_denied   { consent: { analytics, marketing } }  — both off
   Any element with [data-cookie-settings] reopens the settings. */
(function () {
  'use strict';

  var GTM_ID = 'GTM-TQQF5RL4';
  var COOKIE = 'akar_consent';
  var VERSION = 1;           // bump to ask everyone again (e.g. new category)
  var MAX_AGE = 60 * 60 * 24 * 365;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);

  function read() {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
    if (!m) return null;
    try {
      var c = JSON.parse(decodeURIComponent(m[1]));
      return c && c.v === VERSION ? c : null;
    } catch (e) { return null; }
  }

  function write(c) {
    document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(c)) +
      '; Max-Age=' + MAX_AGE + '; Path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  }

  function signals(c) {
    var a = c.analytics ? 'granted' : 'denied';
    var m = c.marketing ? 'granted' : 'denied';
    return {
      analytics_storage: a,
      functionality_storage: a,
      ad_storage: m,
      ad_user_data: m,
      ad_personalization: m,
      personalization_storage: m
    };
  }

  // Consent Mode stops new cookies once a category is denied, but the ones
  // already set stay behind — remove them when consent is withdrawn.
  var TRACKERS = {
    analytics: /^(_ga|_gid|_gat)/,
    marketing: /^(_gcl|_gac|_fbp|_fbc|IDE$|test_cookie$)/
  };
  function purge(category) {
    var parts = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i++) {
      var d = parts.slice(i).join('.');
      domains.push('; Domain=' + d, '; Domain=.' + d);
    }
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!TRACKERS[category].test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; Path=/' + d;
      });
    });
  }

  var current = read();
  if (current) gtag('consent', 'update', signals(current));

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);

  function decide(analytics, marketing) {
    var prev = current;
    current = { v: VERSION, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() };
    write(current);
    gtag('consent', 'update', signals(current));
    if (prev && prev.analytics && !current.analytics) purge('analytics');
    if (prev && prev.marketing && !current.marketing) purge('marketing');
    window.dataLayer.push({
      event: current.analytics || current.marketing ? 'consent_granted' : 'consent_denied',
      consent: { analytics: current.analytics, marketing: current.marketing }
    });
    hideBanner();
  }

  /* ---------- UI ---------- */
  var banner, dialog;

  var PRIVACY = 'datenschutz';

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function buildBanner() {
    banner = el(
      '<section class="cc-banner" role="region" aria-label="Cookie-Einwilligung" aria-live="polite">' +
        '<div class="cc-banner__text">' +
          '<p class="cc-title">Cookies &amp; Datenschutz</p>' +
          '<p>Wir möchten verstehen, wie unsere Website genutzt wird, um sie für Sie zu verbessern. ' +
          'Dafür setzen wir – nur mit Ihrer Einwilligung – Cookies und ähnliche Technologien von Google ein. ' +
          'Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Seitenfuß ändern. ' +
          'Mehr dazu in unserer <a href="' + PRIVACY + '">Datenschutzerklärung</a>.</p>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn cc-btn--settings" data-cc="settings">Einstellungen</button>' +
          '<button type="button" class="cc-btn cc-btn--ink" data-cc="reject">Nur notwendige</button>' +
          '<button type="button" class="cc-btn cc-btn--pink" data-cc="accept">Alle akzeptieren</button>' +
        '</div>' +
      '</section>'
    );
    banner.addEventListener('click', onAction);
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('is-visible'); });
  }

  function hideBanner() {
    if (!banner) return;
    var b = banner;
    banner = null;
    b.classList.remove('is-visible');
    setTimeout(function () { b.remove(); }, 400);
  }

  function row(id, title, text, locked) {
    return '<div class="cc-cat">' +
      '<div class="cc-cat__head">' +
        '<label class="cc-cat__title" for="cc-' + id + '">' + title + '</label>' +
        (locked
          ? '<span class="cc-cat__always">Immer aktiv</span>'
          : '<input class="cc-switch" type="checkbox" role="switch" id="cc-' + id + '" data-cat="' + id + '">') +
      '</div>' +
      '<p>' + text + '</p>' +
    '</div>';
  }

  function buildDialog() {
    dialog = el(
      '<dialog class="cc-dialog" aria-labelledby="cc-dialog-title">' +
        '<form method="dialog" class="cc-dialog__inner">' +
          '<button type="submit" class="cc-close" value="close" aria-label="Schließen">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
          '<p class="eyebrow">Datenschutz</p>' +
          '<h2 id="cc-dialog-title" class="cc-dialog__title">Cookie-Einstellungen</h2>' +
          '<p class="cc-dialog__lead">Wählen Sie, welche Kategorien Sie zulassen möchten. Ihre Einwilligung ist freiwillig und kann jederzeit mit Wirkung für die Zukunft widerrufen werden. ' +
          'Details in der <a href="' + PRIVACY + '">Datenschutzerklärung</a>.</p>' +
          row('necessary', 'Notwendig',
            'Speichern Ihre Cookie-Auswahl und sind für den Betrieb der Website erforderlich. Sie lassen sich nicht deaktivieren.', true) +
          row('analytics', 'Statistik',
            'Helfen uns zu verstehen, wie Besucher die Website nutzen – etwa welche Seiten aufgerufen werden (Google Analytics über den Google Tag Manager). Die Auswertung erfolgt pseudonymisiert.') +
          row('marketing', 'Marketing',
            'Ermöglichen es, den Erfolg unserer Google-Ads-Anzeigen zu messen – etwa ob eine Anzeige zu einer Kontaktanfrage oder einem Anruf geführt hat – und Anzeigen zu personalisieren.') +
          '<div class="cc-actions cc-actions--dialog">' +
            '<button type="button" class="cc-btn cc-btn--settings" data-cc="save">Auswahl speichern</button>' +
            '<button type="button" class="cc-btn cc-btn--ink" data-cc="reject">Nur notwendige</button>' +
            '<button type="button" class="cc-btn cc-btn--pink" data-cc="accept">Alle akzeptieren</button>' +
          '</div>' +
        '</form>' +
      '</dialog>'
    );
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) { dialog.close(); return; } // backdrop click
      onAction(e);
    });
    document.body.appendChild(dialog);
  }

  function openSettings() {
    if (!dialog) buildDialog();
    var c = current || { analytics: false, marketing: false };
    dialog.querySelector('[data-cat="analytics"]').checked = !!c.analytics;
    dialog.querySelector('[data-cat="marketing"]').checked = !!c.marketing;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function closeSettings() {
    if (dialog && dialog.open) dialog.close();
  }

  function onAction(e) {
    var btn = e.target.closest('[data-cc]');
    if (!btn) return;
    var action = btn.getAttribute('data-cc');
    if (action === 'settings') return openSettings();
    if (action === 'accept') decide(true, true);
    else if (action === 'reject') decide(false, false);
    else if (action === 'save') {
      decide(dialog.querySelector('[data-cat="analytics"]').checked,
             dialog.querySelector('[data-cat="marketing"]').checked);
    }
    closeSettings();
  }

  function init() {
    if (!current) buildBanner();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookie-settings]');
      if (!t) return;
      e.preventDefault();
      openSettings();
    });
  }

  window.akarConsent = { open: openSettings, get: function () { return current; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
