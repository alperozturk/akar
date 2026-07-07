/* AKAR alternative frontend — vanilla motion, no dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- scroll reveals --- */
  var revealables = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px' });
    revealables.forEach(function (el) { revealIO.observe(el); });
  }

  /* --- counters (de-DE formatting, count up once visible) --- */
  var fmt = new Intl.NumberFormat('de-DE');
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = fmt.format(target) + suffix; return; }
    var start = null;
    var dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCounter);
  } else {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          runCounter(e.target);
          countIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  /* --- floater parallax: drift relative to viewport centre --- */
  var floaters = Array.prototype.slice.call(document.querySelectorAll('.floater[data-speed]'));
  if (!reduceMotion && floaters.length) {
    var ticking = false;
    function drift() {
      ticking = false;
      var vh = window.innerHeight;
      floaters.forEach(function (el) {
        var applied = parseFloat(el.dataset.applied) || 0;
        var r = el.getBoundingClientRect();
        if (r.bottom < -160 || r.top > vh + 160) return;
        // rect includes the current translate; subtract it to get the resting centre
        var centre = r.top + r.height / 2 - applied;
        var offset = (centre - vh / 2) * parseFloat(el.dataset.speed);
        el.dataset.applied = offset;
        el.style.translate = '0 ' + offset.toFixed(1) + 'px';
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(drift); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    drift();
  }
})();
