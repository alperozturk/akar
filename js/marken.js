/* Marken subpage: brand directory pop-up. Each tile carries data-brand; the
   texts live here so the grid markup stays lean. Facts researched 08/2026 —
   for Hane, Softline and Nawras no public sources were verifiable,
   so their texts deliberately avoid founding years and owner claims. */
(() => {
  const BRANDS = {
    ulker: {
      name: 'Ülker',
      cat: 'SÜSSWAREN',
      meta: 'Istanbul, Türkei · seit 1944',
      logo: 'img/markenlogos/%C3%BClker-logo.webp',
      text: [
        'Ülker ist der größte Keks- und Schokoladenhersteller der Türkei — 1944 in Istanbul von Sabri Ülker gegründet und heute Teil der Yıldız Holding, zu der international auch Godiva und McVitie’s gehören.',
        'Kultprodukte wie Biskrem, Halley, Albeni und Çokokrem begleiten in der Türkei ganze Generationen und werden in über 100 Länder exportiert. Für viele Familien ist Ülker schlicht der Geschmack der Kindheit.',
        {
          heading: 'Untermarken von Ülker',
          items: [
            '8Kek', 'Albeni', 'Alpella', 'Altınbaşak', 'Bebe Bisküvi', 'Biskrem', 'Café Crown',
            'Çikolatalı Gofret', 'Çizi', 'Clip', 'Çokokrem', 'Çokomel', 'Çokonat', 'Çokoprens',
            'Dankek', 'Dido', 'Halley', 'Hanımeller', 'Haylayf', 'Hobby', 'İkram', 'Kremalı',
            'Laviva', 'Magma', "O'lala", 'Oneo', 'Peki', 'Probis', 'Rondo', 'Rulokat',
            'Saklıköy', 'Yıldız'
          ]
        }
      ]
    },
    redbull: {
      name: 'Red Bull',
      cat: 'ENERGY-DRINKS',
      meta: 'Fuschl am See, Österreich · seit 1984',
      logo: 'img/markenlogos/RedBullEnergyDrink-logo.svg.webp',
      text: [
        'Red Bull ist der meistverkaufte Energy-Drink der Welt — von Dietrich Mateschitz in Österreich nach dem Vorbild des thailändischen Krating Daeng entwickelt und seit 1987 auf dem Markt.',
        'Mit über 12 Milliarden verkauften Dosen pro Jahr und dem legendären Versprechen, Flügel zu verleihen, ist Red Bull aus keinem Kühlregal mehr wegzudenken.'
      ]
    },
    kizilay: {
      name: 'Kızılay',
      cat: 'ERFRISCHUNGSGETRÄNKE',
      meta: 'Afyonkarahisar, Türkei · seit 1926',
      logo: 'img/markenlogos/kizilay-logo.webp',
      text: [
        'Kızılay ist der Pionier des türkischen Mineralwassers: 1926 übertrug Atatürk die Quelle von Gazlıgöl bei Afyonkarahisar dem Türkischen Roten Halbmond, dessen Namen die Marke bis heute trägt.',
        'Das natürlich kohlensäurehaltige, mineralstoffreiche Wasser ist in der Türkei ein Klassiker zu jedem Essen — und die Erlöse fließen bis heute in die humanitäre Arbeit des Roten Halbmonds.'
      ]
    },
    yupo: {
      name: 'Yupo',
      cat: 'SÜSSWAREN',
      meta: 'Istanbul, Türkei · eine Marke von Ülker',
      logo: 'img/markenlogos/yupo-logo.webp',
      text: [
        'Yupo ist die bunte Süßwarenmarke von Ülker: Gummibärchen, Jelly-Würmer, Lutscher und Dragees in fröhlichen Farben und Fruchtgeschmäckern.',
        'Bei Kindern in der Türkei hat Yupo Kultstatus — und sorgt auch in europäischen Regalen für den Wow-Moment an der Süßwarentheke.'
      ]
    },
    colaturka: {
      name: 'Cola Turka',
      cat: 'COLA',
      meta: 'Istanbul, Türkei · seit 2003',
      logo: 'img/markenlogos/Colaturka-logo.webp',
      text: [
        'Cola Turka startete 2003 als selbstbewusste „türkische Cola“ — begleitet von einer legendären Werbekampagne mit Hollywood-Star Chevy Chase, die über Nacht Geschichte schrieb.',
        'Heute gehört die Marke zum japanischen Getränkekonzern DyDo Drinco, wird aber weiterhin in der Türkei produziert und bleibt für viele die Cola mit Heimatgefühl.'
      ]
    },
    dogadan: {
      name: 'Doğadan',
      cat: 'TEE & MATCHA',
      meta: 'Ankara, Türkei · seit 1975',
      logo: 'img/markenlogos/dogadan%26coca-cola_company_logo.webp',
      text: [
        'Doğadan ist die führende Kräuter- und Früchtetee-Marke der Türkei — 1975 in Ankara vom Apotheker Nevzat Karpuzcu gegründet, der die erste Teebeutelmaschine des Landes aus Deutschland importierte.',
        'Seit 2007 gehört Doğadan zur Coca-Cola Company. Ob Salbei, Linde oder Kirschtee: Doğadan bringt die türkische Teekultur in die Tasse.'
      ]
    },
    mis: {
      name: 'Mis',
      cat: 'MOLKEREIPRODUKTE',
      meta: 'Türkei · seit 1976',
      logo: 'img/markenlogos/mis-logo.png',
      text: [
        'Mis ist eine der traditionsreichsten Molkereimarken der Türkei: Seit 1976 steht der Name für Ayran, Milch, Joghurt und Käse in verlässlicher Qualität.',
        'Heute gehört Mis zur Yıldız Holding — und der cremig-frische Mis Ayran ist längst auch in Europa der Klassiker zu Grill und Kebap.'
      ]
    },
    hane: {
      name: 'Hane',
      cat: 'HÜLSENFRÜCHTE, EINGELEGTES & FEINKOST',
      meta: 'Türkei',
      logo: 'img/markenlogos/hane-logo-cutout.png',
      text: [
        'Hane steht für die Grundpfeiler der anatolischen Küche: sorgfältig ausgewählter Bulgur, Hülsenfrüchte und weitere Vorratsklassiker in geprüfter Qualität.',
        'Vom groben Bulgur für Pilav bis zu roten Linsen für die Suppe — Hane bringt ehrliche Zutaten in die Küche, so wie man sie von zu Hause kennt.'
      ]
    },
    camlica: {
      name: 'Çamlıca',
      cat: 'ERFRISCHUNGSGETRÄNKE',
      meta: 'Istanbul, Türkei · seit 1946',
      logo: 'img/markenlogos/caml%C4%B1ca-logo.svg',
      text: [
        'Çamlıca ist die Gazoz-Legende Istanbuls: 1946 in Kadıköy gegründet und nach dem gleichnamigen Stadtteil benannt, war sie die erste Gazoz-Produktion der Stadt.',
        'Die klare, feinperlige Zitronenlimonade war das Kultgetränk der 1950er- und 60er-Jahre — und schmeckt bis heute nach Sommer am Bosporus. Heute gehört die Marke zu DyDo Drinco.'
      ]
    },
    celebi: {
      name: 'Gourmet Çelebi',
      cat: 'FEINKOST',
      meta: 'Gaziantep, Türkei',
      logo: 'img/markenlogos/gourmet-celebi.webp',
      text: [
        'Gourmet Çelebi kommt aus Gaziantep — der Welthauptstadt der Pistazie — und hat sich ganz den berühmten Antep-Pistazien verschrieben.',
        'Die Pistaziencremes und -pasten entstehen ohne Zusatz- und Konservierungsstoffe und bringen das intensive Aroma Südostanatoliens aufs Frühstücksbrot und in die Patisserie.'
      ]
    },
    saka: {
      name: 'Saka',
      cat: 'QUELLWASSER',
      meta: 'Sakarya, Türkei · seit 2004',
      logo: 'img/markenlogos/Saka-logo.webp',
      text: [
        'Saka ist natürliches Quellwasser aus den geschützten Keremali-Bergen bei Hendek in der Provinz Sakarya — kalziumreich, natriumarm und angenehm weich im Geschmack.',
        'Seit 2016 gehört Saka zum japanischen Getränkekonzern DyDo Drinco und wird weit über die Türkei hinaus getrunken, unter anderem auch in Großbritannien.'
      ]
    },
    almarai: {
      name: 'Almarai',
      cat: 'SÄFTE',
      meta: 'Riad, Saudi-Arabien · seit 1977',
      logo: 'img/markenlogos/almarai.webp',
      text: [
        'Almarai aus Riad ist das größte vertikal integrierte Molkereiunternehmen der Welt und eine der wertvollsten FMCG-Marken des Nahen Ostens.',
        'Vom frischen Milchprodukt über Fruchtsäfte bis zu Backwaren: Almarai steht seit 1977 für das Versprechen „Qualität, der man vertraut“ — Tag für Tag, vom eigenen Betrieb bis ins Regal.'
      ]
    },
    softline: {
      name: 'Softline',
      cat: 'HYGIENE & PFLEGE',
      meta: 'Türkei',
      logo: 'img/markenlogos/Softline%20Fresher-Akar%20Logo-01.webp',
      text: [
        'Softline steht für praktische Feucht- und Hygienetücher „Made in Türkiye“ — von sanften Babytüchern ohne Alkohol und Parabene bis zu erfrischenden Reinigungstüchern für unterwegs.',
        'Hautfreundliche Rezepturen und ein fairer Preis machen Softline zum verlässlichen Alltagshelfer für die ganze Familie.'
      ]
    },
    beyti: {
      name: 'Beyti',
      cat: 'SÄFTE',
      meta: 'Ägypten · seit 1998',
      logo: 'img/markenlogos/Beyti%20Logo_2.0-01.webp',
      text: [
        'Beyti ist eine der bekanntesten Milch- und Saftmarken Ägyptens: Seit 1998 stehen H-Milch, Joghurt und fruchtige Säfte der Großmolkerei bei Alexandria in den Regalen des Nahen Ostens.',
        'Heute gehört Beyti vollständig zum saudischen Molkereiriesen Almarai — und bringt mit Sorten wie Guave und Mango den Geschmack des Orients ins Glas.'
      ]
    },
    bizim: {
      name: 'Bizim Mutfak',
      cat: 'SUPPEN & KOCHHILFEN',
      meta: 'Türkei',
      logo: 'img/markenlogos/bizim%20mutfak.webp',
      text: [
        'Bizim Mutfak — „unsere Küche“ — ist der Küchenhelfer der türkischen Familie: Fertigsuppen wie Yayla Çorbası, Bouillon, Würzmischungen und Saucen nach traditionellen Rezepten.',
        'Die Marke wurde unter der Yıldız Holding groß und gehört heute zum japanischen Lebensmittelkonzern Ajinomoto. Geblieben ist der vertraute Geschmack der türkischen Hausküche.'
      ]
    },
    tada: {
      name: 'Tada',
      cat: 'FEINKOST & KONSERVEN',
      meta: 'Gebze, Türkei · Marke seit 2010',
      logo: 'img/markenlogos/tada_tamtad%C4%B1nda_logo%20(1).webp',
      text: [
        'Tada — „tam tadında“, also „genau im richtigen Geschmack“ — ist die Feinkostmarke der UNIFO Gıda aus Gebze, einem türkischen Familienunternehmen mit Wurzeln im Jahr 1997.',
        'Die gefüllten Weinblätter nach Hausmacherart kommen ganz ohne Zusatzstoffe aus; dazu gibt es Dosengerichte und eine glutenfreie Linie — türkische Meze, fix und fertig serviert.'
      ]
    },
    nawras: {
      name: 'Nawras',
      cat: 'REIS',
      meta: 'Basmati-Spezialist',
      logo: 'img/markenlogos/nawras-logo.jpg',
      text: [
        'Nawras steht für feinsten, extra langkörnigen Basmati-Reis — locker, duftend und wie gemacht für Pilav, Biryani und die orientalische Küche.',
        'Sorgfältig ausgewählte Ernten und gleichbleibende Kornqualität machen Nawras zur ersten Wahl für alle, die beim Reis keine Kompromisse machen.'
      ]
    }
  };

  const modal = document.getElementById('brand-modal');
  if (!modal) return;

  const card = modal.querySelector('.brand-modal__card');
  const logo = document.getElementById('brand-modal-logo');
  const chip = document.getElementById('brand-modal-chip');
  const title = document.getElementById('brand-modal-title');
  const meta = document.getElementById('brand-modal-meta');
  const text = document.getElementById('brand-modal-text');
  const closeBtn = modal.querySelector('.brand-modal__close');
  let lastFocus = null;

  const open = (key) => {
    const b = BRANDS[key];
    if (!b) return;
    logo.src = b.logo;
    logo.alt = b.name + ' Logo';
    chip.textContent = b.cat;
    title.textContent = b.name;
    meta.textContent = b.meta;
    text.innerHTML = '';
    /* entries are plain paragraphs, or { heading, items } for a sub-brand list */
    b.text.forEach((t) => {
      if (typeof t === 'string') {
        const p = document.createElement('p');
        p.textContent = t;
        text.appendChild(p);
        return;
      }
      if (t.heading) {
        const h = document.createElement('p');
        h.className = 'brand-modal__list-head';
        h.textContent = t.heading;
        text.appendChild(h);
      }
      const ul = document.createElement('ul');
      ul.className = 'brand-modal__list';
      (t.items || []).forEach((name) => {
        const li = document.createElement('li');
        li.textContent = name;
        ul.appendChild(li);
      });
      text.appendChild(ul);
    });
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    card.scrollTop = 0;
    requestAnimationFrame(() => closeBtn.focus());
  };

  const shut = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll('.marken-tile[data-brand]').forEach((tile) => {
    tile.addEventListener('click', () => open(tile.dataset.brand));
  });
  modal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', shut);
  });

  // ESC closes; Tab stays inside the dialog while it is open
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') { shut(); return; }
    if (e.key !== 'Tab') return;
    const items = card.querySelectorAll('button, a');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
