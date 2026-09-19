/* Standorte map: links the location chips, the map pins and the country
   shapes — hovering/focusing one highlights its counterpart. */
(() => {
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
  chips.forEach(c => c.addEventListener('click', () => select(c.dataset.loc)));
  pins.forEach((pin, loc) => {
    pin.addEventListener('click', () => select(loc));
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(loc); }
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
