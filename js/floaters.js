/* Floating snacks decorate the empty parts of a section. They sit behind the
   copy (z-index 0), but sitting *behind* a headline still makes it hard to
   read — so a floater fades out whenever its current box would touch any text
   and fades back in once it drifts clear. Positions are set inline in the
   markup; this only decides when a floater is allowed to be visible. */

const TEXT_SEL = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'li', 'blockquote', 'figcaption',
  '.btn', '.eyebrow', '.chip', '.seal__text',
  '.stat__num', '.stat__label', '.cust-stat__num', '.cust-stat__label',
  'label', 'input', 'textarea'
].join(',');

/* the fixed header and the closed mobile menu are not part of the page flow a
   floater drifts through */
const SKIP_INSIDE = '.site-header, .mobile-menu, .cursor, .floater';

const HIDE_PAD = 6;   // touching this close counts as blocking the text
const SHOW_PAD = 34;  // must drift this far clear again — beyond the bob range,
                      // so a floater parked at the edge can't flicker
const BIN = 400;      // px, vertical buckets for the overlap lookup
const FRAME_MS = 66;  // ~15fps is plenty for a .3s fade

export function initFloaters() {
  const floaters = Array.from(document.querySelectorAll('.floater'));
  if (!floaters.length) return;

  const visible = new Set(floaters);
  if ('IntersectionObserver' in window) {
    visible.clear();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle('is-paused', !e.isIntersecting);
        if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
    }, { rootMargin: '80px' });
    floaters.forEach((el) => io.observe(el));
  }

  /* text boxes in document coordinates, bucketed by vertical band */
  let bins = new Map();
  function measure() {
    bins = new Map();
    document.querySelectorAll(TEXT_SEL).forEach((el) => {
      if (el.closest(SKIP_INSIDE)) return;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      const box = {
        top: r.top + window.scrollY, bottom: r.bottom + window.scrollY,
        left: r.left + window.scrollX, right: r.right + window.scrollX
      };
      const first = Math.floor(box.top / BIN);
      const last = Math.floor(box.bottom / BIN);
      for (let b = first; b <= last; b++) {
        if (!bins.has(b)) bins.set(b, []);
        bins.get(b).push(box);
      }
    });
  }

  function hits(rect, pad) {
    const top = rect.top + window.scrollY - pad;
    const bottom = rect.bottom + window.scrollY + pad;
    const left = rect.left + window.scrollX - pad;
    const right = rect.right + window.scrollX + pad;
    for (let b = Math.floor(top / BIN); b <= Math.floor(bottom / BIN); b++) {
      const boxes = bins.get(b);
      if (!boxes) continue;
      for (const box of boxes) {
        if (box.left < right && box.right > left && box.top < bottom && box.bottom > top) return true;
      }
    }
    return false;
  }

  let last = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (now - last < FRAME_MS) return;
    last = now;
    visible.forEach((el) => {
      const blocked = el.classList.contains('is-blocked');
      el.classList.toggle('is-blocked', hits(el.getBoundingClientRect(), blocked ? SHOW_PAD : HIDE_PAD));
    });
  }

  measure();
  requestAnimationFrame(tick);

  /* reveal animations and late-loading images move the copy around, so take
     the measurements again once things have settled */
  window.addEventListener('load', () => setTimeout(measure, 400));
  setTimeout(measure, 1200);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  }, { passive: true });

  /* sections grow and shrink as reveals fire while scrolling */
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(measure, 250);
  }, { passive: true });
}
