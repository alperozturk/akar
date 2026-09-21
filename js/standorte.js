/* Standorte map: links the location chips, the map pins and the country
   shapes — hovering/focusing one highlights its counterpart. Clicking a pin
   also opens a small contact popup for that location. */

(() => {
/* Contact details per map location. kontakt.html is the source of truth —
   keep both in sync when an address or number changes. A location without
   entries (no partner listed on the contact page) points to the headquarters. */
const HQ_CONTACT = {
  name: 'Akar GmbH', note: 'Hauptsitz',
  addr: ['Am Logistik Park 3', '85416 Langenbach', 'Deutschland'],
  tel: ['+49 8761 722 635 0'], fax: '+49 8761 722 635 93', mail: 'info@akar-gmbh.de',
};
const LOC_CONTACTS = {
  langenbach: { city: 'Langenbach (München)', entries: [
    HQ_CONTACT,
    { name: 'Akar Bayern GmbH', addr: ['Am Logistik Park 3', '85416 Langenbach', 'Deutschland'],
      tel: ['+49 8761 722 635 10'], fax: '+49 8761 722 635 96' },
  ] },
  bochum: { city: 'Bochum', entries: [
    { name: 'Akar NRW GmbH', addr: ['Bergmannstr. 43a', '44809 Bochum', 'Deutschland'],
      tel: ['+49 234 584 014 0'], fax: '+49 234 584 014 29' },
  ] },
  mannheim: { city: 'Mannheim', entries: [
    { name: 'AKSA Handels GmbH', addr: ['Wattstraße 25', '68199 Mannheim', 'Deutschland'],
      tel: ['+49 621 819 020 70'], fax: '+49 6241 97 38 67' },
  ] },
  stuttgart: { city: 'Stuttgart', entries: [
    { name: 'Eroglu GmbH', addr: ['Hofener Weg 15', '71686 Remseck am Neckar', 'Deutschland'],
      tel: ['+49 7146 99 22 990'], fax: '+49 7154 99 22 991' },
  ] },
  hannover: { city: 'Hannover', entries: [
    { name: 'Fedek GmbH', addr: ['Gretelriede 71', '30419 Hannover', 'Deutschland'],
      tel: ['+49 511 53 44 390'], fax: '+49 511 53 44 391' },
  ] },
  koeln: { city: 'Köln', entries: [
    { name: 'Lider Süsswaren GmbH', addr: ['Charlottenstr. 72–78', '51149 Köln', 'Deutschland'],
      tel: ['+49 220 318 383 27'], fax: '+49 220 318 383 17' },
  ] },
  berlin: { city: 'Berlin', entries: [
    { name: 'Pascha Süsswaren e.K.', addr: ['Holzhauser Straße 180', '13509 Berlin', 'Deutschland'],
      tel: ['+49 30 473 055 15'], fax: '+49 30 473 055 14' },
  ] },
  hamburg: { city: 'Hamburg', entries: [] },
  appenweier: { city: 'Appenweier', entries: [
    { name: 'Akar France GmbH', addr: ['Ludwig-Winter-Straße 11', '77767 Appenweier', 'Deutschland'],
      tel: ['+49 7805 913 972 5'], fax: '+49 7805 913 972 7' },
  ] },
  paris: { city: 'Paris', entries: [
    { name: 'Akar Nord France', addr: ['51 Rue du Commandant Rolland', '93350 Le Bourget', 'Frankreich'],
      tel: ['+33 972 845 724'] },
    { name: 'Firat Food', addr: ['75 Avenue du Bois de la Pie', 'Zone Paris Nord 2', '95700 Roissy-en-France', 'Frankreich'],
      tel: ['+33 149 987 979'], fax: '+33 149 987 980' },
  ] },
  lyon: { city: 'Lyon', entries: [
    { name: 'Akar Sud France', addr: ['70 Rue de la Juffarde', '01360 Balan', 'Frankreich'],
      tel: ['+33 474 98 37 53'], fax: '+33 981 709 385' },
  ] },
  bruessel: { city: 'Brüssel', entries: [
    { name: 'Akar Benelux B.V.', addr: ['Industriestraat 3', '1910 Kampenhout', 'Belgien'],
      tel: ['+32 471 66 12 62', '+32 470 64 60 93'], mail: 'infoBE@akar-group.com' },
    { name: 'Ilhan Food S.A.', addr: ['Rue Saint Laurent 7', '7170 Manage', 'Belgien'],
      tel: ['+32 161 669 13'], fax: '+32 161 669 13 99' },
  ] },
  zoeterwoude: { city: 'Zoeterwoude', entries: [
    { name: 'Akar Benelux B.V.', addr: ['Produktieweg 16', '2382 PB Zoeterwoude', 'Niederlande'],
      tel: ['+31 715 238 609'], fax: '+31 715 416 028' },
  ] },
  wien: { city: 'Wien', entries: [
    { name: 'MMS Akar Handels GmbH', addr: ['Schemmerlstraße 66', '1110 Wien', 'Österreich'],
      tel: ['+43 176 748 86'] },
  ] },
  waedenswil: { city: 'Wädenswil', entries: [] },
  goeteborg: { city: 'Göteborg', entries: [
    { name: 'Turk Food Sweden AB', addr: ['Grönsaksgatan 9', '411 04 Göteborg', 'Schweden'],
      tel: ['+46 762 768 786'], fax: '+46 315 287 15' },
  ] },
};

  /* country accordion: one panel per country, cities appear on click */
  document.querySelectorAll('.standorte__group').forEach(group => {
    const toggle = group.querySelector('.standorte__toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const open = group.hasAttribute('data-open');
      group.toggleAttribute('data-open', !open);
      toggle.setAttribute('aria-expanded', String(!open));
    });
  });

  /* two map variants live in the markup (dark amCharts / light iStock);
     bind to whichever one is not hidden */
  const map = document.querySelector('.footprint__map:not([hidden])');
  if (!map) return;

  const pins = new Map(
    [...map.querySelectorAll('.pin[data-loc]')].map(p => [p.dataset.loc, p])
  );
  const chips = [...document.querySelectorAll('.loc-chip[data-loc]')];

  /* clicking a chip or a pin selects that location: its pin gets the white
     ring, its chip stays filled. Exactly one location is selected at a time —
     the headquarters on load, until another one is clicked. */
  let selected = null;
  const select = (loc) => {
    selected = loc;
    pins.forEach((pin, l) => pin.classList.toggle('is-selected', l === selected));
    chips.forEach(c => {
      const on = c.dataset.loc === selected;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-pressed', String(on));
    });
  };

  /* ---- contact popup: one shared card inside the map, filled per location.
     It lives next to the pins container (not inside it) so the pins' child
     order — and with it their nth-child styling — stays untouched. ---- */
  const esc = (t) => t.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const telHref = (t) => 'tel:' + t.replace(/[^+\d]/g, '');
  const entryHtml = (e) => `
    <div class="pin-pop__entry">
      <strong class="pin-pop__name">${esc(e.name)}${e.note ? ` <small>${esc(e.note)}</small>` : ''}</strong>
      <address class="pin-pop__addr">${e.addr.map(esc).join('<br>')}</address>
      <div class="pin-pop__links">
        ${(e.tel || []).map(t => `<a href="${telHref(t)}"><span>Tel</span>${esc(t)}</a>`).join('')}
        ${e.fax ? `<span class="pin-pop__fax"><span>Fax</span>${esc(e.fax)}</span>` : ''}
        ${e.mail ? `<a href="mailto:${esc(e.mail)}"><span>E-Mail</span>${esc(e.mail)}</a>` : ''}
      </div>
    </div>`;
  const popHtml = (loc) => {
    const data = LOC_CONTACTS[loc];
    if (!data) return '';
    const body = data.entries.length
      ? data.entries.map(entryHtml).join('')
      : `<div class="pin-pop__entry">
          <p class="pin-pop__hint">Für diesen Standort erreichen Sie uns über den Hauptsitz.</p>
          <div class="pin-pop__links">
            <a href="${telHref(HQ_CONTACT.tel[0])}"><span>Tel</span>${esc(HQ_CONTACT.tel[0])}</a>
            <a href="mailto:${esc(HQ_CONTACT.mail)}"><span>E-Mail</span>${esc(HQ_CONTACT.mail)}</a>
          </div>
        </div>`;
    return `<p class="pin-pop__city">${esc(data.city)}</p>${body}`;
  };

  const pop = document.createElement('div');
  pop.className = 'pin-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', 'Kontaktdaten des Standorts');
  pop.tabIndex = -1;
  pop.innerHTML = `<button type="button" class="pin-pop__close" aria-label="Schließen">&times;</button><div class="pin-pop__body"></div>`;
  map.appendChild(pop);
  const popBody = pop.querySelector('.pin-pop__body');
  let openLoc = null;

  /* anchor the card to its pin: centred above it, flipped below when there is
     no room under the fixed header, and kept inside the map's width */
  const placePop = () => {
    const pin = pins.get(openLoc);
    if (!pin) return;
    const m = map.getBoundingClientRect();
    const d = (pin.querySelector('b') || pin).getBoundingClientRect();
    const x = d.left + d.width / 2 - m.left;
    const y = d.top + d.height / 2 - m.top;
    const w = pop.offsetWidth, h = pop.offsetHeight, gap = 16;
    const left = w >= m.width ? (m.width - w) / 2 : Math.min(Math.max(x - w / 2, 0), m.width - w);
    const roomAbove = d.top - 90;                      /* fixed header */
    const roomBelow = window.innerHeight - d.bottom;
    const below = roomAbove < h + gap && roomBelow > roomAbove;
    pop.classList.toggle('pin-pop--below', below);
    pop.style.left = left + 'px';
    pop.style.top = (below ? y + gap : y - gap - h) + 'px';
    pop.style.setProperty('--arrow-x', Math.min(Math.max(x - left, 20), w - 20) + 'px');
  };
  const closePop = (refocus) => {
    if (!openLoc) return;
    const pin = pins.get(openLoc);
    openLoc = null;
    pop.classList.remove('is-open');
    map.classList.remove('has-pop');
    if (pin) { pin.classList.remove('is-open'); pin.setAttribute('aria-expanded', 'false'); }
    if (refocus && pin) pin.focus();
  };
  const openPop = (loc, viaKeyboard) => {
    const html = popHtml(loc);
    if (!html) return;
    closePop(false);
    openLoc = loc;
    popBody.innerHTML = html;
    const pin = pins.get(loc);
    pin.classList.add('is-open');
    pin.setAttribute('aria-expanded', 'true');
    placePop();
    pop.classList.add('is-open');
    map.classList.add('has-pop');
    if (viaKeyboard) pop.focus({ preventScroll: true });
  };
  const togglePop = (loc, viaKeyboard) => (openLoc === loc ? closePop(viaKeyboard) : openPop(loc, viaKeyboard));

  pop.querySelector('.pin-pop__close').addEventListener('click', () => closePop(true));
  document.addEventListener('click', (e) => {
    if (openLoc && !pop.contains(e.target) && !e.target.closest('.pin')) closePop(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openLoc) closePop(pop.contains(document.activeElement));
  });
  window.addEventListener('resize', placePop);

  chips.forEach(c => c.addEventListener('click', () => select(c.dataset.loc)));
  pins.forEach((pin, loc) => {
    pin.setAttribute('role', 'button');
    pin.setAttribute('aria-haspopup', 'dialog');
    pin.setAttribute('aria-expanded', 'false');
    pin.addEventListener('click', () => { select(loc); togglePop(loc, false); });
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(loc); togglePop(loc, true); }
    });
  });
  const hq = map.querySelector('.pin--hq[data-loc]');
  if (hq) select(hq.dataset.loc);

  const set = (loc, on) => {
    const pin = pins.get(loc);
    if (pin) pin.classList.toggle('is-hot', on);
    chips.forEach(c => {
      if (c.dataset.loc === loc) c.classList.toggle('is-hot', on);
    });
  };

  const wire = (el, loc) => {
    ['mouseenter', 'focus'].forEach(ev => el.addEventListener(ev, () => set(loc, true)));
    ['mouseleave', 'blur'].forEach(ev => el.addEventListener(ev, () => set(loc, false)));
  };
  chips.forEach(c => wire(c, c.dataset.loc));
  pins.forEach((pin, loc) => wire(pin, loc));

  /* country group hover tints its land shape on the map */
  document.querySelectorAll('.standorte__group[data-cc]').forEach(group => {
    const land = map.querySelector(`.eumap__land[data-cc="${group.dataset.cc}"]`);
    if (!land) return;
    group.addEventListener('mouseenter', () => land.classList.add('is-hot'));
    group.addEventListener('mouseleave', () => land.classList.remove('is-hot'));
  });
})();
