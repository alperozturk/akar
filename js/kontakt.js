/* Kontaktformular: die Seite ist statisch (GitHub Pages), es gibt also keinen
   Server, der das Formular entgegennimmt. Ohne data-endpoint wird deshalb eine
   vorausgefüllte E-Mail an info@akar-gmbh.de geöffnet. Sobald ein Endpunkt
   (z. B. Formspree) in data-endpoint steht, wird stattdessen per fetch gesendet. */
(() => {
  const form = document.getElementById('kontakt-form');
  if (!form) return;

  const status = form.querySelector('.form__status');
  const button = form.querySelector('button[type="submit"]');
  const TO = 'info@akar-gmbh.de';

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
      anliegen: get('anliegen'), firma: get('firma'), name: get('name'),
      vorname: get('vorname'), telefon: get('telefon'), email: get('email'),
      plz: get('plz'), ort: get('ort'), nachricht: get('nachricht')
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
    return `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

    const values = collect();
    const endpoint = (form.dataset.endpoint || '').trim();

    if (!endpoint) {
      window.location.href = mailtoUrl(values);
      say('Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Nachricht. Bitte senden Sie sie dort ab.', 'ok');
      return;
    }

    button && (button.disabled = true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      say('Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns so schnell wie möglich.', 'ok');
    } catch (err) {
      say(`Senden fehlgeschlagen. Bitte schreiben Sie uns direkt an ${TO}.`, 'error');
    } finally {
      button && (button.disabled = false);
    }
  });
})();
