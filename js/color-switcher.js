/* TEMPORARY client preview tool: per-section background color switcher.
   Injects a swatch pill into every .section and into the footer; the chosen
   color drives --section-bg, which both the section surface and its top wave
   read. Besides the ten preset swatches the pill carries a "hex" button that
   opens a small input for any other color. Selections persist in localStorage.
   Delete this file (and its <script> tag in index.html) before launch. */
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
    ['Puder',         '#F3DBD6'],
    ['Rosé hell',     '#f2e6e8'],
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
      justify-content: center;
      /* with the hex field open the row is wider than a phone screen, so let
         it wrap onto a second line instead of hanging off both edges */
      flex-wrap: wrap;
      /* max-content keeps the row from wrapping against the shrink-to-fit
         width an absolutely positioned box would otherwise get */
      width: max-content;
      max-width: calc(100vw - 24px);
      gap: 7px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, .72);
      box-shadow: 0 4px 14px -6px rgba(40, 28, 70, .35);
      backdrop-filter: blur(4px);
      opacity: .45;
      transition: opacity .2s ease;
    }
    .cs-pill:hover,
    .cs-pill.is-editing { opacity: 1; }
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
    /* "hex" opens the free-color input; it lights up like a dot while the
       section is showing a color that is not one of the ten presets */
    .cs-hex {
      padding: 1px 6px;
      line-height: 1.4;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: #5b5670;
      border: 1px solid rgba(20, 20, 20, .18);
      border-radius: 999px;
    }
    .cs-hex:hover { color: #fe4686; }
    .cs-hex.is-active {
      color: #fe4686;
      border-color: #fe4686;
      box-shadow: 0 0 0 2px rgba(254, 70, 134, .35);
    }
    .cs-hex-field { display: none; align-items: center; gap: 5px; }
    .cs-pill.is-editing .cs-hex-field { display: flex; }
    .cs-hex-preview {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid rgba(20, 20, 20, .18);
      flex: none;
    }
    .cs-hex-input {
      width: 82px;
      padding: 2px 7px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      letter-spacing: .02em;
      color: #2a2340;
      background: #fff;
      border: 1px solid rgba(20, 20, 20, .18);
      border-radius: 999px;
    }
    .cs-hex-input:focus { outline: 2px solid rgba(254, 70, 134, .45); outline-offset: 1px; }
    .cs-hex-input.is-invalid { border-color: #fe4686; color: #fe4686; }
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

  /* accepts "a1b2c3", "#a1b2c3", "#abc" — returns "#a1b2c3" or null */
  const normalizeHex = (raw) => {
    const v = raw.trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(v)) return '#' + v.split('').map(c => c + c).join('').toLowerCase();
    if (/^[0-9a-f]{6}$/i.test(v)) return '#' + v.toLowerCase();
    return null;
  };
  const isPreset = (color) =>
    PALETTE.some(([, c]) => c.toLowerCase() === String(color).toLowerCase());

  const buildPill = (el, key) => {
    /* the footer paints its own background rather than reading --section-bg,
       so it needs the color written straight onto the element as well */
    const paintsOwnBg = el.classList.contains('footer');

    /* fromInput: the color is being typed, so leave the field alone —
       every other path (dot, reset, restore) writes the value back into it */
    const apply = (color, fromInput = false) => {
      if (color) {
        el.style.setProperty('--section-bg', color);
        if (paintsOwnBg) el.style.background = color;
      } else {
        el.style.removeProperty('--section-bg');
        if (paintsOwnBg) el.style.removeProperty('background');
      }
      /* the presets are written in mixed case, a typed hex arrives lowercased */
      const current = (color || '').toLowerCase();
      pill.querySelectorAll('.cs-dot').forEach(d =>
        d.classList.toggle('is-active', d.dataset.color.toLowerCase() === current));
      hexBtn.classList.toggle('is-active', !!color && !isPreset(color));
      hexPreview.style.background = color || 'transparent';
      if (!fromInput) {
        hexInput.value = color || '';
        hexInput.classList.remove('is-invalid');
      }
    };

    const pill = document.createElement('div');
    pill.className = 'cs-pill';
    /* preview tool, not site UI — but it must stay reachable, so it is not
       aria-hidden: a focused input inside an aria-hidden subtree is invalid */
    pill.dataset.previewTool = 'section-colors';

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

    const hexBtn = document.createElement('button');
    hexBtn.type = 'button';
    hexBtn.className = 'cs-hex';
    hexBtn.title = 'Eigener Farbwert';
    hexBtn.textContent = 'hex';
    pill.appendChild(hexBtn);

    const field = document.createElement('span');
    field.className = 'cs-hex-field';

    const hexPreview = document.createElement('span');
    hexPreview.className = 'cs-hex-preview';

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'cs-hex-input';
    hexInput.placeholder = '#f5e8e3';
    hexInput.spellcheck = false;
    hexInput.autocomplete = 'off';
    hexInput.maxLength = 7;
    hexInput.setAttribute('aria-label', 'Hex-Farbwert');

    field.append(hexPreview, hexInput);
    pill.appendChild(field);

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'cs-reset';
    reset.title = 'Zurücksetzen';
    reset.textContent = '↺';
    reset.addEventListener('click', () => {
      delete saved[key];
      persist();
      apply(null);
      closeField();
    });
    pill.appendChild(reset);

    const closeField = () => {
      pill.classList.remove('is-editing');
      hexInput.classList.remove('is-invalid');
      hexInput.value = saved[key] || '';
    };
    const openField = () => {
      pill.classList.add('is-editing');
      hexInput.value = saved[key] || '';
      hexInput.focus();
      hexInput.select();
    };

    hexBtn.addEventListener('click', () => {
      if (pill.classList.contains('is-editing')) closeField();
      else openField();
    });

    /* live preview on every keystroke that spells a complete color */
    hexInput.addEventListener('input', () => {
      const color = normalizeHex(hexInput.value);
      if (!hexInput.value.trim()) {
        hexInput.classList.remove('is-invalid');
        return;
      }
      hexInput.classList.toggle('is-invalid', !color);
      if (!color) return;
      saved[key] = color;
      persist();
      apply(color, true);
    });

    hexInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); closeField(); hexBtn.focus(); }
      if (e.key === 'Escape') { e.preventDefault(); closeField(); hexBtn.focus(); }
    });

    /* clicking anywhere outside the pill puts the input away again */
    document.addEventListener('click', (e) => {
      if (pill.classList.contains('is-editing') && !pill.contains(e.target)) closeField();
    });

    el.appendChild(pill);
    apply(saved[key] || null);
  };

  const targets = [...document.querySelectorAll('.section, .trustbar, .footer')];
  targets.forEach((el, i) => buildPill(el, el.id || el.classList[0] || `section-${i}`));
})();
