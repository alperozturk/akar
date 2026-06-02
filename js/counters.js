export function initCounters({ gsap, ST }) {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const obj = { v: 0 };
    ST.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => {
      gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = pre + Math.round(obj.v).toLocaleString('de-DE') + suf; } });
    }});
  });
}
