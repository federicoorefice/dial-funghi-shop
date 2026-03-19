/**
 * products.js — Dati centralizzati Dial Funghi Shop
 * Tutti i prodotti, categorie e helper functions
 */

/* ============================================================
   FIOR DI FUNGHI — Prodotti principali (locomotiva del sito)
   ============================================================ */

const FIOR_DI_FUNGHI = [
  {
    id: 'ffps-180-01',
    sku: 'FFPS-180-01',
    brand: 'fior-di-funghi',
    name: 'Porcini e Speck',
    fullName: 'Fior di Funghi — Porcini e Speck',
    tagline: 'Il bosco incontra la montagna.',
    description: 'La prima salsa ai funghi in formato squeeze. Porcini selezionati e speck trentino per un condimento intenso e versatile. Perfetta su bruschette, pasta, carni alla griglia e formaggi stagionati.',
    shortDesc: 'Porcini selezionati e speck trentino in formato squeeze.',
    price: 3.99,
    priceFormatted: '€3,99',
    weight: '180g',
    category: 'fior-di-funghi',
    badges: ['Gluten Free'],
    image: 'IMMAGINI /fior di funghi prodotti /flaconi shop /porcini e speck render .png',
    imageAlt: 'Fior di Funghi Porcini e Speck — salsa squeeze 180g',
    featured: true,
    inStock: true,
    /* Sostituisci STRIPE_LINK_FFPS con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_FFPS',
    ingredients: 'Funghi porcini, speck (carne di suino, sale, aromi naturali), olio extravergine di oliva, aceto di vino, sale, aglio.',
    allergens: 'Può contenere tracce di glutine.',
    usageIdeas: ['Pasta', 'Bruschette', 'Carni grigliate', 'Formaggi', 'Risotti'],
    nutritionPer100g: {
      energia: '180 kcal',
      grassi: '14g',
      carboidrati: '8g',
      proteine: '4g',
      sale: '1.8g'
    }
  },
  {
    id: 'fftap-180-01',
    sku: 'FFTAP-180-01',
    brand: 'fior-di-funghi',
    name: 'Tartufo e Pecorino',
    fullName: 'Fior di Funghi — Tartufo e Pecorino',
    tagline: 'Eleganza in formato squeeze.',
    description: 'L\'incontro tra il profumo inconfondibile del tartufo e la sapidità decisa del pecorino. Una salsa squeeze raffinata, pronta a trasformare ogni piatto in un\'esperienza gastronomica.',
    shortDesc: 'Tartufo pregiato e pecorino stagionato in formato squeeze.',
    price: 3.99,
    priceFormatted: '€3,99',
    weight: '180g',
    category: 'fior-di-funghi',
    badges: ['Gluten Free', 'Vegetariano'],
    image: 'IMMAGINI /fior di funghi prodotti /flaconi shop /tartufo e pecorino render.png',
    imageAlt: 'Fior di Funghi Tartufo e Pecorino — salsa squeeze 180g',
    featured: true,
    inStock: true,
    /* Sostituisci STRIPE_LINK_FFTAP con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_FFTAP',
    ingredients: 'Funghi (porcini, champignon), tartufo estivo (Tuber aestivum), pecorino stagionato, olio extravergine di oliva, sale.',
    allergens: 'Contiene latte. Senza glutine.',
    usageIdeas: ['Pasta', 'Uova', 'Crostini', 'Risotto', 'Pizza bianca'],
    nutritionPer100g: {
      energia: '195 kcal',
      grassi: '16g',
      carboidrati: '6g',
      proteine: '5g',
      sale: '2.0g'
    }
  },
  {
    id: 'ffpab-180-01',
    sku: 'FFPAB-180-01',
    brand: 'fior-di-funghi',
    name: 'Paprika e BBQ',
    fullName: 'Fior di Funghi — Paprika e BBQ',
    tagline: 'Il bosco va in griglieria.',
    description: 'Funghi porcini con paprika affumicata e note BBQ per un condimento audace e inaspettato. La scelta perfetta per chi ama i sapori decisi: sulle carni, negli hamburger, o come dip.',
    shortDesc: 'Funghi porcini con paprika affumicata e spezie BBQ.',
    price: 3.99,
    priceFormatted: '€3,99',
    weight: '180g',
    category: 'fior-di-funghi',
    badges: ['Gluten Free', 'Vegan'],
    image: 'IMMAGINI /fior di funghi prodotti /flaconi shop /bbq e paprika.png',
    imageAlt: 'Fior di Funghi Paprika e BBQ — salsa squeeze 180g',
    featured: true,
    inStock: true,
    /* Sostituisci STRIPE_LINK_FFPAB con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_FFPAB',
    ingredients: 'Funghi porcini, paprika affumicata, pomodoro, cipolla, olio di girasole, aceto di mele, zucchero di canna, sale, pepe nero.',
    allergens: 'Senza glutine. Senza lattosio.',
    usageIdeas: ['Hamburger', 'Carni grigliate', 'Patatine', 'Panini', 'Verdure arrosto'],
    nutritionPer100g: {
      energia: '165 kcal',
      grassi: '12g',
      carboidrati: '11g',
      proteine: '3g',
      sale: '1.9g'
    }
  },
  {
    id: 'fft-180-01',
    sku: 'FFT-180-01',
    brand: 'fior-di-funghi',
    name: 'Teriyaki e Zenzero',
    fullName: 'Fior di Funghi — Teriyaki e Zenzero',
    tagline: 'Il bosco viaggia in Oriente.',
    description: 'L\'unica salsa ai funghi porcini con anima fusion. Note umami del teriyaki, freschezza pungente dello zenzero e la profondità del fungo porcino. Un\'edizione limitata che ha già conquistato i food lover.',
    shortDesc: 'Porcini italiani con salsa teriyaki e zenzero fresco. Limited Edition.',
    price: 3.99,
    priceFormatted: '€3,99',
    weight: '180g',
    category: 'fior-di-funghi',
    badges: ['Gluten Free', 'Vegan', 'Limited Edition'],
    image: 'IMMAGINI /fior di funghi prodotti /flaconi shop /teriaky e zenzero render.png',
    imageAlt: 'Fior di Funghi Teriyaki e Zenzero — salsa squeeze 180g Limited Edition',
    featured: true,
    inStock: true,
    isLimitedEdition: true,
    /* Sostituisci STRIPE_LINK_FFT con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_FFT',
    ingredients: 'Funghi porcini, salsa di soia (acqua, soia, frumento, sale), zenzero, mirin, olio di sesamo, zucchero di canna, aglio.',
    allergens: 'Contiene soia e frumento (tracce). Verificare etichetta per versione GF certificata.',
    usageIdeas: ['Salmone', 'Pollo', 'Riso', 'Noodles', 'Verdure saltate', 'Marinature'],
    nutritionPer100g: {
      energia: '172 kcal',
      grassi: '11g',
      carboidrati: '13g',
      proteine: '4g',
      sale: '2.2g'
    }
  }
];

/* ============================================================
   ALTRI PRODOTTI DIAL — Gamma completa
   ============================================================ */

const ALTRI_PRODOTTI = [
  /* --- CONDIMENTI --- */
  {
    id: 'dial-grigliata-01',
    sku: 'DIAL-GRIG-01',
    brand: 'dial',
    name: 'Grigliata di Montagna',
    fullName: 'Preparato per Grigliata di Montagna',
    tagline: 'Il tocco di bosco che rende ogni grigliata irresistibile.',
    description: 'Blend di spezie essiccate con funghi porcini per condire carne, pesce, pasta e verdure. Trasforma qualsiasi piatto in un\'esperienza ricca di sapore.',
    shortDesc: 'Condimento multiuso spezie e porcini per carni, pesce, pasta e verdure.',
    price: 3.90,
    priceFormatted: '€3,90',
    weight: '50g',
    category: 'condimenti',
    badges: ['Vegan', 'Gluten Free'],
    image: 'IMMAGINI /altri prodotti dial /1 - CONDIMENTI/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 1 - GRIGLIATA DI MONTAGNA/PREPARATO grigliata di montagna .png',
    imageAlt: 'Preparato Grigliata di Montagna Dial Funghi',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_GRIG con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_GRIG',
    usageIdeas: ['Carne', 'Pesce', 'Pasta', 'Verdure']
  },
  {
    id: 'dial-pasta-porcini-01',
    sku: 'DIAL-PASPOR-01',
    brand: 'dial',
    name: 'Preparato Pasta ai Funghi Porcini',
    fullName: 'Preparato per Pasta con Funghi Porcini',
    tagline: 'Il blend essiccato che regala un gusto ricco e naturale alla tua pasta.',
    description: 'Condimento multiuso con spezie e funghi porcini. Il blend essiccato regala un gusto ricco e naturale a qualsiasi formato di pasta.',
    shortDesc: 'Blend essiccato di funghi porcini e spezie per pasta.',
    price: 3.90,
    priceFormatted: '€3,90',
    weight: '50g',
    category: 'condimenti',
    badges: ['Vegan', 'Gluten Free'],
    image: 'IMMAGINI /altri prodotti dial /1 - CONDIMENTI/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 2 - PREPARATO FUNGHI PORCINI/PREPARATO FUNGHI PORCINI RENDER.png',
    imageAlt: 'Preparato Pasta Funghi Porcini Dial Funghi',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_PASPOR con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_PASPOR',
    usageIdeas: ['Pasta', 'Risotto', 'Zuppe']
  },
  /* --- POLENTA --- */
  {
    id: 'dial-polenta-porcini-01',
    sku: 'DIAL-POLPOR-01',
    brand: 'dial',
    name: 'Polenta ai Funghi Porcini',
    fullName: 'Preparato per Polenta ai Funghi Porcini',
    tagline: 'Il profumo di bosco che rende il piatto caldo e avvolgente.',
    description: 'Polenta istantanea con farina di mais e porcini essiccati. Pronta in pochi minuti, porta il profumo del bosco direttamente in tavola.',
    shortDesc: 'Polenta istantanea con farina di mais e porcini essiccati.',
    price: 4.50,
    priceFormatted: '€4,50',
    weight: '300g',
    category: 'polenta',
    badges: ['Vegan', 'Gluten Free'],
    image: 'IMMAGINI /altri prodotti dial /2 - PREPARATO POLENTA/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 3 - PREPARATO POLENTA/RENDER DA USARE .png',
    imageAlt: 'Polenta ai Funghi Porcini Dial Funghi',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_POLPOR con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_POLPOR',
    usageIdeas: ['Piatto unico', 'Contorno', 'Crostini di polenta']
  },
  /* --- FUNGHI SECCHI --- */
  {
    id: 'dial-porcini-secchi-60g',
    sku: 'DIAL-PORS-60G',
    brand: 'dial',
    name: 'Porcini Secchi Speciali',
    fullName: 'Funghi Porcini Secchi Speciali',
    tagline: 'Aroma intenso, 100% naturali.',
    description: 'Fette di porcino selezionate con cura ed essiccate lentamente per conservare aroma e consistenza. Selezionati a mano da personale altamente qualificato.',
    shortDesc: 'Fette di porcino selezionate, essiccate lentamente. 100% naturali.',
    price: 4.90,
    priceFormatted: '€4,90',
    weight: '60g',
    category: 'funghi-secchi',
    badges: ['Vegan', 'Gluten Free', 'Bio'],
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 4  - FUNGHI PORCINI SACCHETTO/FUNGHI PORCINI SSECCHI SACCETTO RENDER .png',
    imageAlt: 'Porcini Secchi Speciali Dial Funghi 60g',
    featured: true,
    inStock: true,
    /* Sostituisci STRIPE_LINK_PORS60 con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_PORS60',
    usageIdeas: ['Risotto', 'Pasta', 'Sughi', 'Zuppe', 'Trifolato']
  },
  {
    id: 'dial-porcini-extra-50g',
    sku: 'DIAL-PORE-50G',
    brand: 'dial',
    name: 'Porcini Secchi Qualità Extra',
    fullName: 'Funghi Porcini Secchi Qualità Extra',
    tagline: 'Selezione premium, aroma intenso.',
    description: 'La selezione più pregiata di porcini secchi Dial. Ogni fetta è scelta a mano da personale specializzato per garantire il massimo aroma e la migliore consistenza.',
    shortDesc: 'Selezione premium di porcini secchi, 100% naturali. Formato 50g.',
    price: 6.90,
    priceFormatted: '€6,90',
    weight: '50g',
    category: 'funghi-secchi',
    badges: ['Vegan', 'Gluten Free', 'Bio', 'Premium'],
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 5  - FUNGHI PORCINI QUALITA EXTRA SACCHETTO/IMMAGINE FUNGHI SACC EXTRA RENDER.png',
    imageAlt: 'Porcini Secchi Qualità Extra Dial Funghi 50g',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_PORE50 con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_PORE50',
    usageIdeas: ['Risotto', 'Pasta', 'Sughi pregiati', 'Trifolato']
  },
  {
    id: 'dial-morchelle-20g',
    sku: 'DIAL-MORC-20G',
    brand: 'dial',
    name: 'Morchelle Secche',
    fullName: 'Morchelle Secche (Spugnole)',
    tagline: 'Sapore raffinato, 100% naturali.',
    description: 'Le morchelle (spugnole) sono tra i funghi più pregiati e ricercati. Sapore delicato e raffinato, ideale per piatti eleganti e preparazioni gourmet.',
    shortDesc: 'Spugnole essiccate, sapore raffinato. Funghi primaverili pregiati. 20g.',
    price: 8.90,
    priceFormatted: '€8,90',
    weight: '20g',
    category: 'funghi-secchi',
    badges: ['Vegan', 'Gluten Free'],
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 6  - FUNGHI MORCHELLE SACCHETTO/MORCHELLE SECCHE RENDER.png',
    imageAlt: 'Morchelle Secche Spugnole Dial Funghi 20g',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_MORC20 con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_MORC20',
    usageIdeas: ['Pasta', 'Risotto', 'Uova', 'Carni bianche', 'Salse fine dining']
  },
  {
    id: 'dial-finferli-50g',
    sku: 'DIAL-FINF-50G',
    brand: 'dial',
    name: 'Finferli Secchi',
    fullName: 'Finferli Secchi (Galletti)',
    tagline: 'Profumo delicato, 100% naturali.',
    description: 'I finferli (galletti) essiccati conservano il loro profumo delicato e fruttato. Raccolti dal bosco alla tavola, naturalmente.',
    shortDesc: 'Galletti essiccati, profumo delicato e fruttato. 50g.',
    price: 5.90,
    priceFormatted: '€5,90',
    weight: '50g',
    category: 'funghi-secchi',
    badges: ['Vegan', 'Gluten Free'],
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 7  - FUNGHI FINFERLI SACCHETTO/FINFERLI SECCHI RENDER.png',
    imageAlt: 'Finferli Secchi Galletti Dial Funghi 50g',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_FINF50 con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_FINF50',
    usageIdeas: ['Risotto', 'Pasta', 'Frittate', 'Zuppe', 'Saltati in padella']
  },
  {
    id: 'dial-shiitake-400g',
    sku: 'DIAL-SHIT-400G',
    brand: 'dial',
    name: 'Shiitake Secchi a Fette',
    fullName: 'Funghi Shiitake Secchi a Fette — Barattolo',
    tagline: 'Profumo intenso, gusto umami.',
    description: 'Funghi shiitake essiccati a fette in pratico barattolo richiudibile. 100% naturali, consistenza carnosa e gusto umami intenso. Formato famiglia da 400g.',
    shortDesc: 'Shiitake essiccati a fette, gusto umami. Barattolo richiudibile 400g.',
    price: 12.90,
    priceFormatted: '€12,90',
    weight: '400g',
    category: 'funghi-secchi',
    badges: ['Vegan', 'Gluten Free'],
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 8  - FUNGHI SHIITAKE BARATTOLO/BOX SHITAKE RENDER.png',
    imageAlt: 'Shiitake Secchi a Fette Barattolo Dial Funghi 400g',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_SHIT400 con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_SHIT400',
    usageIdeas: ['Cucina asiatica', 'Ramen', 'Saltati', 'Zuppe', 'Brodi']
  },
  /* --- BOX REGALO --- */
  {
    id: 'dial-box-estate',
    sku: 'DIAL-BOX-EST',
    brand: 'dial',
    name: 'Box Estate',
    fullName: 'Box Estate — Selezione Estiva',
    tagline: 'Estate in tavola: freschezza, griglia e sapori autentici.',
    description: 'Una selezione curata per l\'estate: Preparato Grigliata di Montagna, Bruschetta, Finferli Secchi, Polenta ai Finferli e Pomodori Secchi. Il regalo perfetto per chi ama i sapori estivi.',
    shortDesc: 'Selezione estiva: Grigliata di Montagna, Bruschetta, Finferli, Polenta Finferli, Pomodori Secchi.',
    price: 24.90,
    priceFormatted: '€24,90',
    weight: 'Box regalo',
    category: 'box',
    badges: ['Regalo', 'Selezione curata'],
    image: 'IMMAGINI /altri prodotti dial /4 - BOX/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 9  - BOX ESTATE/box estate .png',
    imageAlt: 'Box Estate Dial Funghi — selezione estiva regalo',
    featured: true,
    inStock: true,
    /* Sostituisci STRIPE_LINK_BOXEST con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_BOXEST',
    contents: ['Preparato Grigliata di Montagna', 'Preparato Bruschetta', 'Finferli Secchi', 'Polenta ai Finferli', 'Pomodori Secchi']
  },
  {
    id: 'dial-box-primavera',
    sku: 'DIAL-BOX-PRI',
    brand: 'dial',
    name: 'Box Primavera',
    fullName: 'Box Primavera — Quando il gusto rifiorisce',
    tagline: 'Quando il gusto rifiorisce: la primavera è servita.',
    description: 'La rinascita dei sapori primaverili in un\'unica box: Morchelle Secche, Preparato Aglio e Olio, Pepite del Bosco, Pesto alla Genovese e Polenta alla Trentina.',
    shortDesc: 'Selezione primaverile: Morchelle, Aglio e Olio, Pepite del Bosco, Pesto, Polenta Trentina.',
    price: 26.90,
    priceFormatted: '€26,90',
    weight: 'Box regalo',
    category: 'box',
    badges: ['Regalo', 'Selezione curata'],
    image: 'IMMAGINI /altri prodotti dial /4 - BOX/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 10  - BOX PRIMAVERA/BOX PRIMAVERA RENDER.png',
    imageAlt: 'Box Primavera Dial Funghi — selezione primaverile regalo',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_BOXPRI con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_BOXPRI',
    contents: ['Morchelle Secche', 'Preparato Aglio e Olio', 'Pepite del Bosco', 'Pesto alla Genovese', 'Polenta alla Trentina']
  },
  {
    id: 'dial-box-autunno',
    sku: 'DIAL-BOX-AUT',
    brand: 'dial',
    name: 'Box Autunno',
    fullName: 'Box Autunno — Calore, profumo, colore',
    tagline: 'Calore, profumo, colore: l\'autunno che scalda la cucina.',
    description: 'I sapori profondi dell\'autunno in una box: Peperoncino, Polenta Tirolese, selezione di funghi autunnali, Vin Brulé e Polenta ai Funghi Porcini.',
    shortDesc: 'Selezione autunnale: Peperoncino, Polenta Tirolese, Funghi, Vin Brulé, Polenta Porcini.',
    price: 26.90,
    priceFormatted: '€26,90',
    weight: 'Box regalo',
    category: 'box',
    badges: ['Regalo', 'Selezione curata'],
    image: 'IMMAGINI /altri prodotti dial /4 - BOX/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 11  - BOX AUTUNNO/BOX AUTUNNOP.png',
    imageAlt: 'Box Autunno Dial Funghi — selezione autunnale regalo',
    featured: false,
    inStock: true,
    /* Sostituisci STRIPE_LINK_BOXAUT con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_BOXAUT',
    contents: ['Peperoncino essiccato', 'Polenta alla Tirolese', 'Selezione funghi autunnali', 'Vin Brulé', 'Polenta ai Funghi Porcini']
  },
  {
    id: 'dial-box-inverno',
    sku: 'DIAL-BOX-INV',
    brand: 'dial',
    name: 'Box Inverno',
    fullName: 'Box Inverno — La nostra bandiera di montagna',
    tagline: 'L\'inverno più elegante: la nostra bandiera di montagna.',
    description: 'Il regalo premium per eccellenza. Una cassetta in legno con selezione trifecta dei funghi più pregiati: Morchelle, Porcini e Finferli secchi. Elegante, autentico, indimenticabile.',
    shortDesc: 'Cassetta in legno con Morchelle, Porcini e Finferli secchi. Il regalo premium.',
    price: 39.90,
    priceFormatted: '€39,90',
    weight: 'Cassetta legno',
    category: 'box',
    badges: ['Regalo Premium', 'Cassetta Legno', 'Top di gamma'],
    image: 'IMMAGINI /altri prodotti dial /4 - BOX/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 12  - BOX INVERNO_nuovo/BOX INVERNO.png',
    imageAlt: 'Box Inverno Dial Funghi — cassetta legno regalo premium',
    featured: true,
    inStock: true,
    /* Sostituisci STRIPE_LINK_BOXINV con il tuo URL da stripe.com/payment-links */
    stripePaymentLink: 'STRIPE_LINK_BOXINV',
    contents: ['Morchelle Secche', 'Porcini Secchi Qualità Extra', 'Finferli Secchi']
  }
];

/* ============================================================
   TUTTI I PRODOTTI — Array unico
   ============================================================ */

const ALL_PRODUCTS = [...FIOR_DI_FUNGHI, ...ALTRI_PRODOTTI];

/* ============================================================
   CATEGORIE
   ============================================================ */

const CATEGORIES = [
  { id: 'tutti',         label: 'Tutti',              count: ALL_PRODUCTS.length },
  { id: 'fior-di-funghi', label: 'Fior di Funghi',   count: FIOR_DI_FUNGHI.length },
  { id: 'funghi-secchi', label: 'Funghi Secchi',      count: ALTRI_PRODOTTI.filter(p => p.category === 'funghi-secchi').length },
  { id: 'condimenti',    label: 'Condimenti',          count: ALTRI_PRODOTTI.filter(p => p.category === 'condimenti').length },
  { id: 'polenta',       label: 'Polenta',             count: ALTRI_PRODOTTI.filter(p => p.category === 'polenta').length },
  { id: 'box',           label: 'Box Regalo',          count: ALTRI_PRODOTTI.filter(p => p.category === 'box').length }
];

/* ============================================================
   RICETTE — 16 ricette con filtri
   ============================================================ */

const RECIPES = [
  {
    id: 'risotto-porcini-speck',
    title: 'Risotto Porcini e Speck',
    subtitle: 'Il classico trentino in versione squeeze',
    image: 'IMMAGINI /fior di funghi prodotti /ricette /risotto porcini .png',
    time: '25 min',
    difficulty: 'Facile',
    servings: 2,
    tags: ['Primo', 'Trentino', 'Inverno'],
    productUsed: 'ffps-180-01',
    ingredients: ['320g riso Carnaroli', '2 cucchiai Fior di Funghi Porcini e Speck', '1 scalogno', '1/2 bicchiere vino bianco', 'brodo vegetale q.b.', 'burro', 'grana padano', 'erba cipollina'],
    steps: ['Soffriggere lo scalogno nel burro.', 'Tostare il riso 2 minuti.', 'Sfumare con il vino.', 'Aggiungere brodo a mestoli fino a cottura.', 'A fuoco spento mantecare con burro, grana e 2 cucchiai di Fior di Funghi.', 'Guarnire con erba cipollina.']
  },
  {
    id: 'pasta-tartufo-pecorino',
    title: 'Pasta Tartufo e Pecorino',
    subtitle: 'Pronta in 10 minuti, gourmet per sempre',
    image: 'IMMAGINI /fior di funghi prodotti /ricette /tartufo e pecorino .png',
    time: '10 min',
    difficulty: 'Facilissima',
    servings: 2,
    tags: ['Primo', 'Vegetariano', 'Veloce'],
    productUsed: 'fftap-180-01',
    ingredients: ['320g pasta (spaghetti o pici)', '3 cucchiai Fior di Funghi Tartufo e Pecorino', 'pecorino grattugiato', 'pepe nero', 'olio extravergine'],
    steps: ['Cuocere la pasta in abbondante acqua salata.', 'Scolare al dente conservando un mestolo di acqua di cottura.', 'In padella sciogliere Fior di Funghi con un filo d\'olio.', 'Mantecare la pasta con la salsa e acqua di cottura.', 'Servire con pecorino grattugiato e pepe nero.']
  },
  {
    id: 'panino-bbq',
    title: 'Smash Burger ai Funghi BBQ',
    subtitle: 'Street food con anima di bosco',
    image: 'IMMAGINI /fior di funghi prodotti /ricette /panino bbq.png',
    time: '15 min',
    difficulty: 'Facile',
    servings: 2,
    tags: ['Secondo', 'Vegan', 'Street Food'],
    productUsed: 'ffpab-180-01',
    ingredients: ['2 burger bun brioche', '2 hamburger (manzo o vegetale)', '2 cucchiai Fior di Funghi Paprika e BBQ', 'insalata iceberg', 'pomodoro', 'cipolla caramellata', 'cheddar'],
    steps: ['Cuocere l\'hamburger su piastra calda.', 'Tostare il bun tagliato.', 'Spalmare Fior di Funghi BBQ sul pane.', 'Comporre: bun, insalata, hamburger, cheddar, cipolla, pomodoro.', 'Chiudere e servire immediatamente.']
  },
  {
    id: 'salmone-teriyaki',
    title: 'Salmone al Teriyaki e Zenzero',
    subtitle: 'Fusion con porcini italiani',
    image: 'IMMAGINI /fior di funghi prodotti /ricette /teriaky zenzero e salmone .png',
    time: '20 min',
    difficulty: 'Facile',
    servings: 2,
    tags: ['Secondo', 'Pesce', 'Fusion', 'Limited Edition'],
    productUsed: 'fft-180-01',
    ingredients: ['2 filetti salmone', '3 cucchiai Fior di Funghi Teriyaki e Zenzero', 'riso basmati', 'sesamo', 'cipollotto', 'lime'],
    steps: ['Marinare il salmone con Fior di Funghi per 15 minuti.', 'Cuocere in padella calda 3 min per lato.', 'Servire sul riso basmati.', 'Guarnire con sesamo, cipollotto e spicchio di lime.']
  },
  {
    id: 'bruschette-porcini',
    title: 'Bruschette ai Porcini',
    subtitle: 'L\'antipasto che scompare in secondi',
    image: 'IMMAGINI /fior di funghi prodotti /foto hero tutti insieme i flaconi /flaconi hero insieme render.png',
    time: '5 min',
    difficulty: 'Facilissima',
    servings: 4,
    tags: ['Antipasto', 'Veloce', 'Vegetariano'],
    productUsed: 'ffps-180-01',
    ingredients: ['8 fette pane casereccio', '4 cucchiai Fior di Funghi Porcini e Speck', 'olio extravergine', 'aglio', 'prezzemolo'],
    steps: ['Tostare le fette di pane.', 'Sfregare con l\'aglio.', 'Distribuire Fior di Funghi generosamente.', 'Filo d\'olio e prezzemolo.', 'Servire calde.']
  },
  {
    id: 'uova-tartufo',
    title: 'Uova al Tartufo',
    subtitle: 'Colazione o brunch di lusso in 8 minuti',
    image: 'IMMAGINI /fior di funghi prodotti /flaconi shop /tartufo e pecorino render.png',
    time: '8 min',
    difficulty: 'Facilissima',
    servings: 1,
    tags: ['Colazione', 'Brunch', 'Vegetariano', 'Veloce'],
    productUsed: 'fftap-180-01',
    ingredients: ['2 uova', '1 cucchiaio Fior di Funghi Tartufo e Pecorino', 'burro', 'toast', 'erba cipollina'],
    steps: ['Sciogliere il burro in padella.', 'Cuocere le uova all\'occhio di bue.', 'A cottura ultimata aggiungere Fior di Funghi.', 'Servire con toast e erba cipollina.']
  },
  {
    id: 'risotto-porcini-secchi',
    title: 'Risotto ai Porcini Secchi',
    subtitle: 'Il classico intramontabile con i nostri porcini',
    image: 'IMMAGINI /fior di funghi prodotti /ricette /risotto porcini .png',
    time: '30 min',
    difficulty: 'Media',
    servings: 4,
    tags: ['Primo', 'Classico', 'Invernale'],
    productUsed: 'dial-porcini-secchi-60g',
    ingredients: ['30g Porcini Secchi Speciali Dial', '320g riso Carnaroli', 'brodo vegetale', 'scalogno', 'vino bianco secco', 'burro', 'grana padano'],
    steps: ['Ammollare i porcini in acqua tiepida 20 min.', 'Soffriggere lo scalogno.', 'Tostare il riso.', 'Aggiungere porcini strizzati e la loro acqua filtrata.', 'Portare a cottura con brodo.', 'Mantecare con burro e grana.']
  },
  {
    id: 'polenta-funghi',
    title: 'Polenta ai Funghi Porcini',
    subtitle: 'Il piatto della tradizione trentina',
    image: 'IMMAGINI /foto aziende dial /stabilimento/stabilimento 1.jpg',
    time: '15 min',
    difficulty: 'Facile',
    servings: 4,
    tags: ['Primo', 'Trentino', 'Invernale', 'Vegan'],
    productUsed: 'dial-polenta-porcini-01',
    ingredients: ['300g Polenta ai Funghi Porcini Dial', '1.2L acqua', 'sale', 'burro o olio EVO', 'funghi freschi (facoltativi)'],
    steps: ['Portare a bollore l\'acqua salata.', 'Versare la polenta a pioggia mescolando.', 'Cuocere 5-8 min mescolando continuamente.', 'Servire morbida o lasciar rapprendere.', 'Accompagnare con funghi trifolati.']
  },
  {
    id: 'pasta-finferli',
    title: 'Tagliatelle ai Finferli',
    subtitle: 'Il profumo dei boschi estivi in tavola',
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 7  - FUNGHI FINFERLI SACCHETTO/FINFERLI SECCHI RENDER.png',
    time: '25 min',
    difficulty: 'Facile',
    servings: 4,
    tags: ['Primo', 'Estate', 'Vegetariano'],
    productUsed: 'dial-finferli-50g',
    ingredients: ['20g Finferli Secchi Dial', '400g tagliatelle fresche', 'aglio', 'prezzemolo', 'olio EVO', 'vino bianco', 'panna (facoltativa)'],
    steps: ['Ammollare i finferli in acqua tiepida 20 min.', 'Soffriggere aglio in olio.', 'Aggiungere finferli e sfumare con vino.', 'Cuocere la pasta e saltare nella salsa.', 'Servire con prezzemolo fresco.']
  },
  {
    id: 'ramen-shiitake',
    title: 'Ramen ai Funghi Shiitake',
    subtitle: 'Umami profondo in stile Tokyo',
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 8  - FUNGHI SHIITAKE BARATTOLO/BOX SHITAKE RENDER.png',
    time: '30 min',
    difficulty: 'Media',
    servings: 2,
    tags: ['Primo', 'Fusion', 'Vegan'],
    productUsed: 'dial-shiitake-400g',
    ingredients: ['30g Shiitake Secchi Dial', 'noodles ramen', 'brodo dashi o vegetale', 'miso', 'cipollotto', 'uovo sodo', 'alga nori', 'zenzero'],
    steps: ['Ammollare gli shiitake 30 min e conservare il brodo.', 'Preparare il brodo con il liquido degli shiitake + dashi + miso.', 'Cuocere i noodles.', 'Comporre la ciotola: noodles, brodo, shiitake, uovo, cipollotto, nori.']
  },
  {
    id: 'crostini-morchelle',
    title: 'Crostini con Morchelle e Crema',
    subtitle: 'Fine dining in 15 minuti',
    image: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 6  - FUNGHI MORCHELLE SACCHETTO/MORCHELLE SECCHE RENDER.png',
    time: '15 min',
    difficulty: 'Facile',
    servings: 4,
    tags: ['Antipasto', 'Gourmet', 'Vegetariano'],
    productUsed: 'dial-morchelle-20g',
    ingredients: ['10g Morchelle Secche Dial', '8 crostini pane artigianale', 'panna fresca', 'burro', 'scalogno', 'timo', 'sale e pepe'],
    steps: ['Ammollare le morchelle 20 min.', 'Soffriggere lo scalogno nel burro.', 'Aggiungere morchelle e sfumare con acqua di ammollo.', 'Aggiungere panna e ridurre.', 'Distribuire sui crostini e guarnire con timo.']
  },
  {
    id: 'pollo-grigliata-montagna',
    title: 'Pollo alla Grigliata di Montagna',
    subtitle: 'Il tocco di bosco che fa la differenza',
    image: 'IMMAGINI /altri prodotti dial /1 - CONDIMENTI/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 1 - GRIGLIATA DI MONTAGNA/PREPARATO grigliata di montagna .png',
    time: '30 min',
    difficulty: 'Facile',
    servings: 4,
    tags: ['Secondo', 'Carne', 'Grigliata', 'Estate'],
    productUsed: 'dial-grigliata-01',
    ingredients: ['1kg petto di pollo', '2 cucchiaini Grigliata di Montagna Dial', 'olio EVO', 'succo di limone'],
    steps: ['Marinare il pollo con il preparato, olio e limone 30 min.', 'Grigliare a fuoco medio-alto 5-6 min per lato.', 'Lasciar riposare 5 min prima di servire.']
  },
  {
    id: 'spaghetti-porcini-preparato',
    title: 'Spaghetti ai Funghi Porcini',
    subtitle: 'Il condimento pronto che non ti tradisce mai',
    image: 'IMMAGINI /altri prodotti dial /1 - CONDIMENTI/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 2 - PREPARATO FUNGHI PORCINI/PREPARATO FUNGHI PORCINI RENDER.png',
    time: '15 min',
    difficulty: 'Facilissima',
    servings: 4,
    tags: ['Primo', 'Classico', 'Veloce'],
    productUsed: 'dial-pasta-porcini-01',
    ingredients: ['400g spaghetti', '1 bustina Preparato Pasta Porcini Dial', 'olio EVO', 'aglio', 'prezzemolo', 'acqua di cottura'],
    steps: ['Cuocere la pasta al dente.', 'In padella rosolare aglio in olio.', 'Sciogliere il preparato con acqua di cottura.', 'Saltare la pasta nella salsa.', 'Servire con prezzemolo fresco.']
  },
  {
    id: 'box-estate-picnic',
    title: 'Picnic da Box Estate',
    subtitle: 'Tutto il necessario per un picnic gourmet',
    image: 'IMMAGINI /altri prodotti dial /4 - BOX/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 9  - BOX ESTATE/box estate .png',
    time: '20 min',
    difficulty: 'Facile',
    servings: 4,
    tags: ['Antipasto', 'Estate', 'Picnic', 'Outdoor'],
    productUsed: 'dial-box-estate',
    ingredients: ['1 Box Estate Dial', 'pane casereccio', 'pomodori freschi', 'mozzarella', 'basilico', 'olio EVO'],
    steps: ['Preparare i crostini con il preparato per bruschetta.', 'Grigliare verdure con la grigliata di montagna.', 'Abbinare i finferli a un filo d\'olio su fettine di pane.', 'Completare con pomodori secchi come antipasto.']
  },
  {
    id: 'box-inverno-regalo',
    title: 'Cena delle Feste con Box Inverno',
    subtitle: 'Una cassetta, una serata indimenticabile',
    image: 'IMMAGINI /altri prodotti dial /4 - BOX/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 12  - BOX INVERNO_nuovo/BOX INVERNO.png',
    time: '45 min',
    difficulty: 'Media',
    servings: 6,
    tags: ['Primo', 'Secondo', 'Feste', 'Inverno', 'Gourmet'],
    productUsed: 'dial-box-inverno',
    ingredients: ['1 Box Inverno Dial (Morchelle + Porcini + Finferli)', 'pasta fresca all\'uovo', 'burro', 'grana padano', 'scalogno', 'vino bianco', 'brodo vegetale'],
    steps: ['Usare i porcini per un risotto mantecato.', 'Le morchelle per un sugo elegante con pasta fresca.', 'I finferli saltati come contorno.', 'Aprire la cassetta a tavola per l\'effetto scenografico.']
  },
  {
    id: 'tartare-bbq',
    title: 'Tartare di Manzo con Fior di Funghi BBQ',
    subtitle: 'Il twist che i food lover cercavano',
    image: 'IMMAGINI /fior di funghi prodotti /flaconi shop /bbq e paprika.png',
    time: '10 min',
    difficulty: 'Media',
    servings: 2,
    tags: ['Secondo', 'Carne', 'Gourmet', 'No cottura'],
    productUsed: 'ffpab-180-01',
    ingredients: ['300g manzo macinato fine', '1 cucchiaio Fior di Funghi Paprika BBQ', 'capperi', 'senape', 'tuorlo', 'erba cipollina', 'crostini'],
    steps: ['Condire la carne con tutti gli ingredienti e Fior di Funghi BBQ.', 'Modellare con coppapasta.', 'Guarnire con tuorlo e erba cipollina.', 'Servire con crostini caldi.']
  }
];

/* ============================================================
   CONFIGURAZIONE SPEDIZIONE
   ============================================================ */

const SHIPPING = {
  freeThreshold: 30,
  standardCost: 4.90,
  standardLabel: 'Spedizione standard',
  freeLabel: 'Spedizione gratuita',
  estimatedDays: '2-4 giorni lavorativi'
};

/* ============================================================
  PROMO — Bundle scontati (10–15% media, max 20%)
  ============================================================ */

const PROMOS = [
  {
    id: 'promo-starter-secchi',
    title: 'Salsa + Secchi Starter',
    subtitle: 'Perfetta per iniziare con i secchi',
    badge: 'Best entry',
    items: ['ffps-180-01', 'dial-porcini-secchi-60g'],
    originalTotal: 8.89,
    promoPrice: 7.99,
    heroImage: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 4  - FUNGHI PORCINI SACCHETTO/FUNGHI PORCINI SSECCHI SACCETTO RENDER .png'
  },
  {
    id: 'promo-polenta-veloce',
    title: 'Kit Polenta Veloce',
    subtitle: 'Cena pronta in pochi minuti',
    badge: 'Easy dinner',
    items: ['dial-polenta-porcini-01', 'ffps-180-01'],
    originalTotal: 8.49,
    promoPrice: 7.49,
    heroImage: 'IMMAGINI /altri prodotti dial /2 - PREPARATO POLENTA/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 3 - PREPARATO POLENTA/RENDER DA USARE .png'
  },
  {
    id: 'promo-bbq-night',
    title: 'BBQ Night',
    subtitle: 'Sapori decisi, zero compromessi',
    badge: 'Party',
    items: ['dial-grigliata-01', 'ffpab-180-01', 'ffps-180-01'],
    originalTotal: 11.88,
    promoPrice: 10.49,
    heroImage: 'IMMAGINI /altri prodotti dial /1 - CONDIMENTI/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 1 - GRIGLIATA DI MONTAGNA/PREPARATO grigliata di montagna .png'
  },
  {
    id: 'promo-degustazione-3',
    title: 'Degustazione 3 Gusti',
    subtitle: 'Scegli 3 salse tra i 4 gusti',
    badge: 'Mix & match',
    items: ['ffps-180-01', 'fftap-180-01', 'ffpab-180-01'],
    originalTotal: 11.97,
    promoPrice: 10.49,
    heroImage: 'IMMAGINI /fior di funghi prodotti /foto hero tutti insieme i flaconi /flaconi hero insieme render.png'
  },
  {
    id: 'promo-premium-trio',
    title: 'Premium Trio',
    subtitle: 'Un classico premium senza esagerare',
    badge: 'Premium',
    items: ['dial-porcini-extra-50g', 'dial-finferli-50g', 'fftap-180-01'],
    originalTotal: 16.79,
    promoPrice: 14.99,
    heroImage: 'IMMAGINI /altri prodotti dial /3 - FUNGHI SECCHI SACCHETTO e BARATTOLO/382025 - DIAL FUNGHI - SET IMMAGINI - PRODOTTO 5  - FUNGHI PORCINI QUALITA EXTRA SACCHETTO/IMMAGINE FUNGHI SACC EXTRA RENDER.png'
  }
];

/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

/**
 * Restituisce un prodotto per ID
 */
function getProductById(id) {
  return ALL_PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Restituisce i prodotti per categoria
 */
function getProductsByCategory(category) {
  if (category === 'tutti') return ALL_PRODUCTS;
  return ALL_PRODUCTS.filter(p => p.category === category);
}

/**
 * Restituisce i prodotti in evidenza
 */
function getFeaturedProducts(limit = 8) {
  return ALL_PRODUCTS.filter(p => p.featured).slice(0, limit);
}

/**
 * Restituisce una ricetta per ID
 */
function getRecipeById(id) {
  return RECIPES.find(r => r.id === id) || null;
}

/**
 * Filtra ricette per tag
 */
function getRecipesByTag(tag) {
  if (!tag || tag === 'Tutti') return RECIPES;
  return RECIPES.filter(r => r.tags.includes(tag));
}

/**
 * Calcola il totale del carrello
 */
function calculateCartTotal(cart) {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Calcola il costo di spedizione
 */
function calculateShipping(cartTotal) {
  return cartTotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.standardCost;
}

/**
 * Formatta un prezzo in euro
 */
function formatPrice(price) {
  return '€' + price.toFixed(2).replace('.', ',');
}

/**
 * Tutti i tag ricette unici
 */
function getAllRecipeTags() {
  const tags = new Set(['Tutti']);
  RECIPES.forEach(r => r.tags.forEach(t => tags.add(t)));
  return Array.from(tags);
}
