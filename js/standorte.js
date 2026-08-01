/* Standorte map: links the location chips, the map pins and the country
   shapes — hovering/focusing one highlights its counterpart. */
(() => {
  const map = document.querySelector('.footprint__map');
  if (!map) return;

  const pins = new Map(
    [...map.querySelectorAll('.pin[data-loc]')].map(p => [p.dataset.loc, p])
  );
  const chips = [...document.querySelectorAll('.loc-chip[data-loc]')];

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
