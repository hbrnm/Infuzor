// Baza de date Infuzor: categorii, ceaiuri, culori de infuzie, metode.

export const PURE_WATER_STATE = { r: 235, g: 245, b: 252, alphaTop: 0.07, alphaBottom: 0.13 };

export const TEA_CATEGORIES = {
  green: {
    id: 'green', name: 'Ceai Verde', accent: '#C8B878',
    liquorEnd: { r: 196, g: 186, b: 94, alphaTop: 0.42, alphaBottom: 0.72 },
    topBrands: [
      { name: 'Ippodo Tea Co.', origin: 'Kyoto, 1717', spec: 'Referința pentru Gyokuro și Sencha din Uji' },
      { name: 'Marukyu Koyamaen', origin: 'Uji, Japonia', spec: 'Producător multipremiat în Japonia' },
      { name: 'Lupicia', origin: 'Tokyo, Japonia', spec: 'Recolte proaspete Shincha și single-estate' }
    ]
  },
  white: {
    id: 'white', name: 'Ceai Alb', accent: '#E6D6B8',
    liquorEnd: { r: 236, g: 214, b: 168, alphaTop: 0.28, alphaBottom: 0.5 },
    topBrands: [
      { name: 'Pinpinxiang (品品香)', origin: 'Fuding, China', spec: 'Producător istoric de Baihao Yinzhen' },
      { name: 'Mei Leaf', origin: 'Londra, UK', spec: 'Silver Needle și White Peony maturat' },
      { name: 'Palais des Thés', origin: 'Paris, Franța', spec: 'Loturi Grands Crus culese manual' }
    ]
  },
  oolong: {
    id: 'oolong', name: 'Oolong', accent: '#E09F3E',
    liquorEnd: { r: 218, g: 146, b: 48, alphaTop: 0.48, alphaBottom: 0.8 },
    topBrands: [
      { name: 'Ten Ren’s Tea (天仁茗茶)', origin: 'Taiwan, 1953', spec: 'High Mountain Oolong (Alishan, Dong Ding)' },
      { name: 'Bamin Tea (八马茶业)', origin: 'Anxi, China', spec: 'Tieguanyin și Wuyi Yan Cha' },
      { name: 'Wang De Chuan', origin: 'Tainan, 1862', spec: 'Oolong-uri taiwaneze prăjite artizanal' }
    ]
  },
  black: {
    id: 'black', name: 'Ceai Negru', accent: '#C85A32',
    liquorEnd: { r: 184, g: 58, b: 24, alphaTop: 0.58, alphaBottom: 0.88 },
    topBrands: [
      { name: 'Mariage Frères', origin: 'Paris, 1854', spec: 'Darjeeling First Flush și blenduri iconice' },
      { name: 'Fortnum & Mason', origin: 'Londra, 1707', spec: 'Assam, Earl Grey și Ceylon' },
      { name: 'Vahdam India', origin: 'Darjeeling, India', spec: 'Loturi single-estate (Makaibari, Castleton)' }
    ]
  },
  puerh: {
    id: 'puerh', name: 'Pu-erh', accent: '#9E543C',
    liquorEnd: { r: 96, g: 30, b: 16, alphaTop: 0.74, alphaBottom: 0.95 },
    topBrands: [
      { name: 'Dayi (Menghai Tea Factory)', origin: 'Yunnan, 1940', spec: 'Standardul pentru Shou & Sheng (7572 / 7542)' },
      { name: 'White2Tea', origin: 'Yunnan / SUA', spec: 'Turte small-batch din arbori bătrâni (Gushu)' },
      { name: 'Xiaguan Tea Factory', origin: 'Dali, 1941', spec: 'Tuocha presat și maturat tradițional' }
    ]
  },
  herbal: {
    id: 'herbal', name: 'Infuzii', accent: '#D4A85A',
    liquorEnd: { r: 216, g: 156, b: 54, alphaTop: 0.45, alphaBottom: 0.76 },
    topBrands: [
      { name: 'Kusmi Tea', origin: 'Paris, 1867', spec: 'Blenduri botanice cu rooibos, fructe și flori' },
      { name: 'Ronnefeldt', origin: 'Frankfurt, 1823', spec: 'Mușețel întreg și rooibos Cederberg' },
      { name: 'Pukka Herbs', origin: 'Bristol, UK', spec: 'Infuzii organice formulate de fitoterapeuți' }
    ]
  }
};

// Culori naturale per ceai (au prioritate față de culoarea categoriei).
export const SPECIFIC_TEA_LIQUORS = {
  sencha: { r: 192, g: 188, b: 88, alphaTop: 0.42, alphaBottom: 0.7, label: 'Galben-verzui luminos' },
  gyokuro: { r: 176, g: 184, b: 76, alphaTop: 0.48, alphaBottom: 0.76, label: 'Jad pal uleios' },
  jasmine_pearls: { r: 222, g: 198, b: 124, alphaTop: 0.34, alphaBottom: 0.6, label: 'Auriu deschis floral' },
  green_bag: { r: 200, g: 188, b: 96, alphaTop: 0.38, alphaBottom: 0.66, label: 'Galben-verzui' },
  silver_needle: { r: 238, g: 218, b: 176, alphaTop: 0.25, alphaBottom: 0.46, label: 'Șampanie translucidă' },
  tieguanyin: { r: 226, g: 186, b: 84, alphaTop: 0.4, alphaBottom: 0.68, label: 'Auriu-orhidee limpede' },
  dahongpao: { r: 198, g: 102, b: 32, alphaTop: 0.56, alphaBottom: 0.84, label: 'Chihlimbar arămiu' },
  darjeeling: { r: 218, g: 138, b: 46, alphaTop: 0.46, alphaBottom: 0.74, label: 'Muscatel auriu-portocaliu' },
  earl_grey: { r: 176, g: 52, b: 22, alphaTop: 0.62, alphaBottom: 0.88, label: 'Roșu-cupru malțos' },
  black_bag: { r: 170, g: 60, b: 26, alphaTop: 0.6, alphaBottom: 0.86, label: 'Roșu-arămiu' },
  shou_puerh: { r: 88, g: 26, b: 14, alphaTop: 0.78, alphaBottom: 0.96, label: 'Mahon închis catifelat' },
  herbal_calm: { r: 224, g: 162, b: 52, alphaTop: 0.44, alphaBottom: 0.74, label: 'Miere aurie caldă' },
  fruit_bag: { r: 170, g: 40, b: 70, alphaTop: 0.5, alphaBottom: 0.8, label: 'Rubiniu de fructe' },
  yerba_mate: { r: 150, g: 160, b: 60, alphaTop: 0.5, alphaBottom: 0.8, label: 'Verde-oliv' }
};

export const INITIAL_TEAS = [
  {
    id: 'sencha', name: 'Sencha', origin: 'Shizuoka, Japonia', category: 'green', caffeine: '30 mg', bestTime: 'Dimineața',
    flavorProfile: ['Umami marin', 'Vegetal proaspăt', 'Citrice'],
    waterTempGuide: '75°C — Lasă apa fiartă 4–5 minute în vasul descoperit sau toarn-o de două ori dintr-un vas în altul.',
    warning: 'Peste 80°C catechinele se extrag agresiv și acoperă dulceața L-teaninei.',
    western: { temp: 75, gramsPer100ml: 1.2, steeps: [90, 60, 120] },
    gongfu: { temp: 72, gramsPer100ml: 3.5, steeps: [60, 25, 45, 75] },
    steps: ['Preîncălzește ceainicul și ceașca, apoi golește apa.', 'Răcește apa la 75°C înainte de a o turna peste frunze.', 'Toarnă pe marginea vasului, nu direct peste frunze.', 'Scurge până la ultima picătură pentru a opri infuzarea.']
  },
  {
    id: 'gyokuro', name: 'Gyokuro Imperial', origin: 'Uji, Japonia', category: 'green', caffeine: '45 mg', bestTime: 'Concentrare',
    flavorProfile: ['Umami dens', 'Alge Nori', 'Textură catifelată'],
    waterTempGuide: '55–60°C — Transvazează apa fiartă de 3–4 ori în cești reci sau așteaptă 8 minute după fierbere.',
    warning: 'Umbrit 21 de zile înainte de recoltare. Cere temperatură joasă pentru a extrage doar umami-ul.',
    western: { temp: 60, gramsPer100ml: 2.0, steeps: [120, 45, 90] },
    gongfu: { temp: 55, gramsPer100ml: 5.0, steeps: [90, 30, 60, 120] },
    steps: ['Adu apa la 55–60°C (vasul trebuie să fie plăcut cald la atingere).', 'Folosește un raport ridicat de frunze și apă puțină.', 'La a doua infuzie, redu timpul la 30–45 secunde.']
  },
  {
    id: 'jasmine_pearls', name: 'Jasmine Dragon Pearls', origin: 'Fujian, China', category: 'green', caffeine: '25 mg', bestTime: 'După-amiaza',
    flavorProfile: ['Iasomie proaspătă', 'Miere', 'Muguri dulci'],
    waterTempGuide: '80°C — 3 minute de răcire după fierbere.',
    warning: 'Apa clocotită evaporă uleiurile volatile de iasomie.',
    western: { temp: 80, gramsPer100ml: 1.2, steeps: [150, 180, 210] },
    gongfu: { temp: 80, gramsPer100ml: 4.0, steeps: [30, 25, 40, 60] },
    steps: ['Cântărește 12–15 perle pentru o ceașcă de 250 ml.', 'Toarnă apa la 80°C și acoperă vasul pentru a reține parfumul.', 'Perlele se desfac în muguri întregi și suportă 3–4 infuzii.']
  },
  {
    id: 'green_bag', name: 'Ceai verde la plic', origin: 'Plic standard', category: 'green', caffeine: '25 mg', bestTime: 'Dimineața',
    flavorProfile: ['Vegetal', 'Ușor astringent', 'Curat'],
    waterTempGuide: '80°C — Lasă apa fiartă 2–3 minute.',
    warning: 'Apa clocotită și timpul lung fac ceaiul verde la plic amar.',
    western: { temp: 80, gramsPer100ml: 0.8, steeps: [150, 120] },
    gongfu: { temp: 80, gramsPer100ml: 2.0, steeps: [45, 40, 60] },
    steps: ['Pune plicul în cană.', 'Toarnă apa la 80°C.', 'Scoate plicul la final, fără să-l storci.']
  },
  {
    id: 'silver_needle', name: 'Baihao Yinzhen', origin: 'Fuding, China', category: 'white', caffeine: '20 mg', bestTime: 'Oricând',
    flavorProfile: ['Pepene galben', 'Nectar floral', 'Mătăsos'],
    waterTempGuide: '80–85°C — Lasă apa fiartă 2–3 minute la odihnă.',
    warning: 'Nu presa mugurii cu lingurița; lasă-i să se hidrateze și să coboare natural.',
    western: { temp: 82, gramsPer100ml: 1.5, steeps: [180, 210, 240] },
    gongfu: { temp: 85, gramsPer100ml: 4.0, steeps: [45, 40, 60, 90] },
    steps: ['Folosește 2 lingurițe cu vârf (mugurii sunt ușori și voluminoși).', 'Toarnă apa la 82°C circular pentru a umezi toți mugurii.', 'Lichidul este foarte pal, dar dens și dulce.']
  },
  {
    id: 'tieguanyin', name: 'Tieguanyin', origin: 'Anxi, China', category: 'oolong', caffeine: '35 mg', bestTime: 'După prânz',
    flavorProfile: ['Orhidee', 'Unt proaspăt', 'Mineral'],
    waterTempGuide: '92–95°C — Apă fiartă lăsată 60 secunde la odihnă.',
    warning: 'O clătire de 5 secunde cu apă fierbinte înainte de prima infuzie deschide biluțele rulate.',
    western: { temp: 92, gramsPer100ml: 1.2, steeps: [150, 180, 210, 240] },
    gongfu: { temp: 95, gramsPer100ml: 5.0, steeps: [20, 15, 25, 40, 60] },
    steps: ['Clătește biluțele 5 secunde cu apă fierbinte și aruncă lichidul.', 'Lasă loc în infuzor — frunzele se măresc de 4 ori.', 'Reinfuzează de până la 5 ori.']
  },
  {
    id: 'dahongpao', name: 'Da Hong Pao', origin: 'Munții Wuyi, China', category: 'oolong', caffeine: '40 mg', bestTime: 'Dimineața',
    flavorProfile: ['Piersică coaptă', 'Cacao neagră', 'Mineralitate'],
    waterTempGuide: '95–98°C — Apă aproape de clocot (30 secunde după oprire).',
    warning: 'În stil Gongfu, primele două infuzii sunt foarte scurte (15 secunde).',
    western: { temp: 95, gramsPer100ml: 1.3, steeps: [150, 180, 240] },
    gongfu: { temp: 98, gramsPer100ml: 5.0, steeps: [15, 15, 25, 40, 60] },
    steps: ['Încălzește bine vasul înainte de a pune frunzele uscate.', 'Toarnă apa la 95–98°C pentru a extrage notele minerale.', 'Scurge complet după fiecare infuzie.']
  },
  {
    id: 'darjeeling', name: 'Darjeeling First Flush', origin: 'Himalaya, India', category: 'black', caffeine: '45 mg', bestTime: 'Dimineața',
    flavorProfile: ['Struguri Muscat', 'Flori de câmp', 'Vibrant'],
    waterTempGuide: '90°C — Lasă apa 1–2 minute după fierbere.',
    warning: 'Nu depăși 3 minute — devine astringent dacă e tratat ca un ceai negru obișnuit.',
    western: { temp: 90, gramsPer100ml: 1.0, steeps: [165, 195] },
    gongfu: { temp: 90, gramsPer100ml: 3.5, steeps: [25, 35, 50] },
    steps: ['Folosește apă la 90°C, nu clocotită.', 'Servește-l simplu, fără lapte sau îndulcitori.', 'Scoate frunzele exact la finalul cronometrului.']
  },
  {
    id: 'earl_grey', name: 'Assam / Earl Grey', origin: 'Assam & Calabria', category: 'black', caffeine: '50 mg', bestTime: 'Dimineața devreme',
    flavorProfile: ['Malț dens', 'Bergamotă', 'Miere neagră'],
    waterTempGuide: '96°C — Apă proaspăt fiartă (20 secunde după oprire).',
    warning: 'Pentru un ceai mai tare pune mai multe frunze, nu prelungi timpul peste 4 minute.',
    western: { temp: 96, gramsPer100ml: 1.2, steeps: [180, 210] },
    gongfu: { temp: 95, gramsPer100ml: 4.0, steeps: [20, 30, 45] },
    steps: ['Toarnă apa la 96°C peste frunze.', 'Acoperă ceașca pentru a păstra uleiul de bergamotă.', 'Oprește infuzarea la 3 minute.']
  },
  {
    id: 'black_bag', name: 'Ceai negru la plic', origin: 'Plic standard', category: 'black', caffeine: '45 mg', bestTime: 'Dimineața',
    flavorProfile: ['Malț', 'Tanin', 'Robust'],
    waterTempGuide: '96°C — Apă proaspăt fiartă.',
    warning: 'Peste 4 minute devine amar; nu storci plicul.',
    western: { temp: 96, gramsPer100ml: 0.8, steeps: [180, 150] },
    gongfu: { temp: 95, gramsPer100ml: 2.2, steeps: [40, 45, 60] },
    steps: ['Pune plicul în cană.', 'Toarnă apa la 96°C.', 'Scoate plicul la 3 minute.']
  },
  {
    id: 'shou_puerh', name: 'Shou Pu-erh Imperial', origin: 'Yunnan, China', category: 'puerh', caffeine: '35 mg', bestTime: 'După masă',
    flavorProfile: ['Lemn nobil', 'Curmale', 'Pământiu fin'],
    waterTempGuide: '99–100°C — Apă clocotită.',
    warning: 'Clătirea de 5 secunde cu apă clocotită este obligatorie înainte de prima infuzie.',
    western: { temp: 99, gramsPer100ml: 1.4, steeps: [180, 210, 240, 300] },
    gongfu: { temp: 100, gramsPer100ml: 5.0, steeps: [15, 15, 20, 30, 45, 60] },
    steps: ['Clătește frunzele 5 secunde cu apă clocotită și aruncă prima apă.', 'Toarnă din nou apă la 100°C pentru infuzia 1.', 'Rezistă la 6–10 infuzii succesive.']
  },
  {
    id: 'herbal_calm', name: 'Mușețel & Rooibos', origin: 'Infuzie botanică', category: 'herbal', caffeine: '0 mg', bestTime: 'Seara',
    flavorProfile: ['Miere florală', 'Măr copt', 'Vanilie'],
    waterTempGuide: '100°C — Apă clocotită.',
    warning: 'Acoperă ceașca în timpul infuzării pentru a nu pierde uleiurile volatile.',
    western: { temp: 100, gramsPer100ml: 1.5, steeps: [300, 360] },
    gongfu: { temp: 100, gramsPer100ml: 4.0, steeps: [60, 90, 120] },
    steps: ['Toarnă apă la 100°C peste plante.', 'Acoperă vasul timp de 5 minute.', 'Nu devine amar chiar dacă e lăsat mai mult.']
  },
  {
    id: 'fruit_bag', name: 'Fructe / plante la plic', origin: 'Plic standard', category: 'herbal', caffeine: '0 mg', bestTime: 'Oricând',
    flavorProfile: ['Fructat', 'Acrișor', 'Aromat'],
    waterTempGuide: '100°C — Apă clocotită.',
    warning: 'Ceaiurile de fructe nu se amărăsc; poți lăsa plicul mai mult pentru gust intens.',
    western: { temp: 100, gramsPer100ml: 0.8, steeps: [360, 240] },
    gongfu: { temp: 100, gramsPer100ml: 2.5, steeps: [90, 120, 150] },
    steps: ['Pune plicul în cană.', 'Toarnă apa clocotită.', 'Acoperă și lasă 5–6 minute.']
  },
  {
    id: 'yerba_mate', name: 'Yerba Mate', origin: 'Argentina / Brazilia', category: 'herbal', caffeine: '80 mg', bestTime: 'Dimineața / Concentrare',
    flavorProfile: ['Ierbos', 'Fumuriu', 'Amărui'],
    waterTempGuide: '75–80°C — Niciodată apă clocotită; lasă apa 3–4 minute după fierbere.',
    warning: 'Apa peste 80°C arde frunzele și face mate-ul foarte amar. Conține cofeină (mateină).',
    western: { temp: 78, gramsPer100ml: 2.0, steeps: [300, 240] },
    gongfu: { temp: 75, gramsPer100ml: 6.0, steeps: [30, 30, 40, 50, 60] },
    steps: ['Umple vasul cu frunze și clatină-l pentru a scutura praful fin.', 'Toarnă apa la 75–80°C pe marginea vasului, nu direct peste frunze.', 'Gongfu / cuia: reumple cu apă la 75°C de mai multe ori.']
  }
];

export const VOLUME_PRESETS = [100, 150, 250, 350, 500, 1000];

export const BREW_METHODS = {
  western: { id: 'western', label: 'Metoda Vestică', shortSub: 'Ceașcă / Ceainic', defaultVol: 250,
    description: 'Infuzie clasică în vas mare, cu raport moderat de frunze și decantare completă.' },
  gongfu: { id: 'gongfu', label: 'Metoda Gongfu', shortSub: 'Gaiwan / Yixing', defaultVol: 100,
    description: 'Raport ridicat de frunze în vas mic, cu infuzii scurte și succesive.' },
  grandpa: { id: 'grandpa', label: 'Grandpa Style', shortSub: 'Fără sită (Top-up)', defaultVol: 350,
    description: 'Frunze direct în pahar înalt. Când rămâne o treime de lichid, completezi cu apă fierbinte.' },
  coldbrew: { id: 'coldbrew', label: 'Iced / Flash Chill', shortSub: 'Gheață sau maceră la rece', defaultVol: 350,
    description: 'Concentrat infuzat în jumătate din apă și turnat peste gheață, sau macerat la rece 6h.' }
};

export function computeMethodSpecs(tea, methodId) {
  if (methodId === 'western') {
    return { ...tea.western, methodNote: tea.waterTempGuide, customSteps: tea.steps };
  }
  if (methodId === 'gongfu') {
    return {
      ...tea.gongfu,
      methodNote: `${tea.gongfu.temp}°C — Infuzii scurte în gaiwan. Scurge până la ultima picătură între runde.`,
      customSteps: [
        'Preîncălzește gaiwan-ul și ceașca de decantare cu apă fierbinte.',
        'Clătește frunzele 3–5 secunde și aruncă prima apă.',
        `Toarnă apa la ${tea.gongfu.temp}°C pe marginea vasului și decantează imediat la semnal.`
      ]
    };
  }
  if (methodId === 'grandpa') {
    const temp = Math.max(75, tea.western.temp - 3);
    const base = Math.round(tea.western.steeps[0] * 1.15);
    return {
      temp, gramsPer100ml: +(tea.western.gramsPer100ml * 0.78).toFixed(2),
      steeps: [base, base + 30, base + 60],
      methodNote: `${temp}°C — Nu scoate frunzele. Cronometrul arată când frunzele s-au așezat și poți bea.`,
      customSteps: [
        'Pune frunzele direct într-un pahar înalt de sticlă, fără infuzor.',
        `Toarnă apă la ${temp}°C. La final frunzele se așază la bază și poți bea.`,
        'Când ai băut 2/3 din pahar, completează cu apă fierbinte peste aceleași frunze.'
      ]
    };
  }
  const temp = tea.category === 'green' || tea.category === 'white' ? 75 : 92;
  const flash = Math.round(tea.western.steeps[0] * 0.85);
  return {
    temp, gramsPer100ml: +(tea.western.gramsPer100ml * 1.75).toFixed(2),
    steeps: [flash, flash + 30],
    methodNote: `Flash Chill: 50% apă caldă (${temp}°C) + 50% gheață în pahar, sau 6h la frigider în apă rece.`,
    customSteps: [
      'Cântărește doza suplimentară de frunze (compensează diluția gheții).',
      `Infuzează în jumătate din volumul de apă la ${temp}°C pe durata cronometrului.`,
      'Scurge concentratul fierbinte peste un pahar plin cu cuburi mari de gheață.'
    ]
  };
}

export function interpolateLiquor(water, target, progress) {
  const p = Math.max(0, Math.min(1, progress));
  const cc = Math.pow(p, 0.88), dc = Math.pow(p, 0.95);
  const mix = (a, b, k) => a + (b - a) * k;
  const r = Math.round(mix(water.r, target.r, cc));
  const g = Math.round(mix(water.g, target.g, cc));
  const b = Math.round(mix(water.b, target.b, cc));
  const alphaTop = +mix(water.alphaTop, target.alphaTop, dc).toFixed(3);
  const alphaBottom = +mix(water.alphaBottom, target.alphaBottom, dc).toFixed(3);
  return {
    r, g, b,
    topRgba: `rgba(${r}, ${g}, ${b}, ${alphaTop})`,
    bottomRgba: `rgba(${r}, ${g}, ${b}, ${alphaBottom})`,
    solidRgb: `rgb(${r}, ${g}, ${b})`
  };
}

export function formatTime(total) {
  const m = Math.floor(total / 60), s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
