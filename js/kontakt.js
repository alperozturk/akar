/* Kontaktformular: die Seite ist statisch (GitHub Pages), den Versand übernimmt
   Forminit (https://forminit.com, Public-Modus — kein API-Key im Client). Die
   Formular-ID steht in data-forminit-id, das SDK wird in kontakt.html geladen.
   Ist das SDK nicht verfügbar (z. B. geblockt), öffnet sich ersatzweise eine
   vorausgefüllte E-Mail an FALLBACK_TO. */
/* Einstieg über „Kunde werden" / „Lieferant werden" (Menü „Für Händler &
   Kunden"): kontakt.html?anliegen=kunde|lieferant tauscht Eyebrow, Headline
   und Lead des Seitenkopfs und wählt das passende Anliegen im Formular vor.
   Ohne (oder mit unbekanntem) Parameter bleibt der Standard aus dem HTML. */
(() => {
  const INTENTS = {
    kunde: {
      title: 'Kunde werden - AKAR GmbH',
      eyebrow: 'KUNDE WERDEN',
      headline: 'Werden Sie <span class="pink">AKAR-Kunde.</span>',
      lead: 'Sie führen einen Supermarkt, einen Großhandel oder einen Gastronomiebetrieb und möchten unser Sortiment beziehen? Schreiben Sie uns kurz, wer Sie sind und was Sie suchen. Unser Vertrieb meldet sich zeitnah mit allen Informationen bei Ihnen.'
    },
    lieferant: {
      title: 'Lieferant werden - AKAR GmbH',
      eyebrow: 'LIEFERANT WERDEN',
      headline: 'Werden Sie <span class="pink">AKAR-Lieferant.</span>',
      lead: 'Sie sind Hersteller oder Markeninhaber und suchen einen starken Vertriebspartner für Europa? Stellen Sie uns Ihr Unternehmen und Ihre Produkte vor. Unser Einkauf prüft Ihre Anfrage und meldet sich bei Ihnen.'
    }
  };
  const key = (new URLSearchParams(window.location.search).get('anliegen') || '').toLowerCase();
  const intent = Object.prototype.hasOwnProperty.call(INTENTS, key) ? INTENTS[key] : null;
  if (!intent) return;

  const head = document.querySelector('.kontakt-hero .section-head');
  if (head) {
    const eyebrow = head.querySelector('.eyebrow');
    const headline = head.querySelector('h1');
    const lead = head.querySelector('.lead');
    if (eyebrow) eyebrow.textContent = intent.eyebrow;
    if (headline) headline.innerHTML = intent.headline;
    if (lead) lead.textContent = intent.lead;
  }
  document.title = intent.title;

  /* defaultSelected (not just .selected), so form.reset() keeps the choice */
  const select = document.getElementById('f-anliegen');
  const option = select && select.querySelector(`option[data-intent="${key}"]`);
  if (option) {
    [...select.options].forEach(o => { o.defaultSelected = o === option; });
    option.selected = true;
  }
})();

(() => {
  const form = document.getElementById('kontakt-form');
  if (!form) return;

  const status = form.querySelector('.form__status');
  const button = form.querySelector('button[type="submit"]');
  /* address shown to visitors in error messages */
  const CONTACT = 'info@akar-gmbh.de';
  /* TEMPORARY (pre-launch): the e-mail fallback goes to the developer inbox so
     no test submission reaches AKAR. Set back to CONTACT at launch — together
     with the form's action attribute in kontakt.html and the notification
     recipient in the Forminit dashboard. */
  const FALLBACK_TO = 'mail@alperozturk.com';

  const say = (msg, kind) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.kind = kind || '';
    status.hidden = false;
  };

  const collect = () => {
    const d = new FormData(form);
    const get = k => String(d.get(k) || '').trim();
    return {
      anliegen: get('fi-select-anliegen'), firma: get('fi-sender-company'), name: get('fi-sender-lastName'),
      vorname: get('fi-sender-firstName'), telefon: get('fi-text-telefon'), email: get('fi-sender-email'),
      plz: get('fi-sender-postcode'), ort: get('fi-sender-city'), nachricht: get('fi-text-nachricht')
    };
  };

  const mailtoUrl = v => {
    const subject = `[${v.anliegen}] Kontaktanfrage von ${[v.vorname, v.name].filter(Boolean).join(' ')}`;
    const body = [
      `Anliegen: ${v.anliegen}`,
      v.firma && `Firma: ${v.firma}`,
      `Name: ${[v.vorname, v.name].filter(Boolean).join(' ')}`,
      v.telefon && `Telefon: ${v.telefon}`,
      `E-Mail: ${v.email}`,
      `PLZ/Ort: ${v.plz} ${v.ort}`,
      '',
      v.nachricht,
      '',
      'Ich erkläre mich mit der Datenschutzerklärung einverstanden.'
    ].filter(l => l !== undefined && l !== false).join('\n');
    return `mailto:${FALLBACK_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  /* native validation, but with our own inline styling via .is-invalid */
  const validate = () => {
    let first = null;
    form.querySelectorAll('[required]').forEach(el => {
      const ok = el.checkValidity();
      el.classList.toggle('is-invalid', !ok);
      if (!ok && !first) first = el;
    });
    return first;
  };
  form.querySelectorAll('[required]').forEach(el => {
    el.addEventListener('input', () => el.classList.toggle('is-invalid', !el.checkValidity()));
    el.addEventListener('change', () => el.classList.toggle('is-invalid', !el.checkValidity()));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = validate();
    if (bad) {
      say('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
      bad.focus();
      return;
    }

    const formId = (form.dataset.forminitId || '').trim();
    if (!formId || typeof window.Forminit !== 'function') {
      window.location.href = mailtoUrl(collect());
      say('Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Nachricht. Bitte senden Sie sie dort ab.', 'ok');
      return;
    }

    /* optional fields left empty are dropped, so Forminit never has to
       validate an empty block */
    const payload = new FormData(form);
    [...payload.entries()].forEach(([k, v]) => {
      if (typeof v === 'string' && !v.trim()) payload.delete(k);
    });

    button && (button.disabled = true);
    try {
      const { error } = await new window.Forminit().submit(formId, payload);
      if (error) {
        console.error('Forminit:', error);
        const hint = /EMAIL/i.test(error.error || '') ? 'Bitte prüfen Sie Ihre E-Mail-Adresse. ' : '';
        say(`Senden fehlgeschlagen. ${hint}Sie erreichen uns auch direkt unter ${CONTACT}.`, 'error');
        return;
      }
      form.reset();
      say('Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns so schnell wie möglich.', 'ok');
    } catch (err) {
      console.error('Forminit:', err);
      say(`Senden fehlgeschlagen. Bitte schreiben Sie uns direkt an ${CONTACT}.`, 'error');
    } finally {
      button && (button.disabled = false);
    }
  });
})();
