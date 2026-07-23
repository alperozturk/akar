/* TEMPORARY client preview tool: per-section background color switcher.
   Injects a swatch pill into every .section; the chosen color drives
   --section-bg, which both the section surface and its top wave read.
   Selections persist in localStorage. Delete this file (and its <script>
   tag in index.html) before launch. */
(() => {
  const STORAGE_KEY = 'akar-section-colors';

  /* light surface colors from the site palette (css/styles.css :root +
     section surfaces) — dark accents are omitted since text would drown */
  const PALETTE = [
    ['Lavendel',      '#E7E3F1'],
    ['Flieder hell',  '#f5f1fb'],
    ['Fast Weiß',     '#fcfbff'],
    ['Weiß',          '#ffffff'],
    ['Beige',         '#f5e8e3'],
    ['Lila pastell',  '#e7cded'],
    ['Mint',          '#c8e7e3'],
    ['Rosa pastell',  '#fea8c3'],
  ];

  const css = `
    .cs-pill {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 6;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, .72);
      box-shadow: 0 4px 14px -6px rgba(40, 28, 70, .35);
      backdrop-filter: blur(4px);
      opacity: .45;
      transition: opacity .2s ease;
    }
    .cs-pill:hover { opacity: 1; }
    .cs-dot {
      width: 16px;
      height: 16px;
      padding: 0;
      border-radius: 50%;
      border: 1px solid rgba(20, 20, 20, .18);
      transition: transform .15s ease;
    }
    .cs-dot:hover { transform: scale(1.25); }
    .cs-dot.is-active {
      border-color: #fe4686;
      box-shadow: 0 0 0 2px rgba(254, 70, 134, .35);
    }
    .cs-reset {
      width: 16px;
      height: 16px;
      padding: 0;
      line-height: 1;
      font-size: 12px;
      color: #5b5670;
      border-radius: 50%;
    }
    .cs-reset:hover { color: #fe4686; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  };
  const saved = load();
  const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  document.querySelectorAll('.section').forEach((section, i) => {
    const key = section.id || section.classList[0] || `section-${i}`;

    const apply = (color) => {
      if (color) section.style.setProperty('--section-bg', color);
      else section.style.removeProperty('--section-bg');
      pill.querySelectorAll('.cs-dot').forEach(d =>
        d.classList.toggle('is-active', d.dataset.color === (color || '')));
    };

    const pill = document.createElement('div');
    pill.className = 'cs-pill';
    pill.setAttribute('aria-hidden', 'true'); /* preview tool, not site UI */

    PALETTE.forEach(([name, color]) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cs-dot';
      dot.dataset.color = color;
      dot.title = name;
      dot.style.background = color;
      dot.addEventListener('click', () => {
        saved[key] = color;
        persist();
        apply(color);
      });
      pill.appendChild(dot);
    });

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'cs-reset';
    reset.title = 'Zurücksetzen';
    reset.textContent = '↺';
    reset.addEventListener('click', () => {
      delete saved[key];
      persist();
      apply(null);
    });
    pill.appendChild(reset);

    section.appendChild(pill);
    if (saved[key]) apply(saved[key]);
  });
})();
