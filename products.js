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
    usage: 'Scalda 2 min in padella o usa direttamente su pasta, risotto, hamburger e bruschette. Ottima anche fredda su formaggi stagionati. Agitare prima dell\'uso.',
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
    usage: 'Spalmala su crostini e bruschette. Su pasta: aggiungi a fine cottura con una noce di burro. Su uova strapazzate a fuoco spento. Perfetta anche per farcire tartine e pizzette bianche. Agitare prima dell\'uso.',
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
    usage: 'Perfetta su carni alla griglia durante e dopo la cottura. Su hamburger, patatine, hot dog. Mix con maionese per una salsa BBQ cremosa. Agitare prima dell\'uso.',
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
    usage: 'Marina pollo, salmone o tofu per 30 min prima della cottura. In wok: aggiungi negli ultimi 2 min. Su riso: versa calda subito prima di servire. Ottima anche come dip per ravioli al vapore. Agitare prima dell\'uso.',
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
   RICETTE — 12 ricette Fior di Funghi (3 per gusto)
   ============================================================ */

const RECIPES = [
  /* ── PORCINI E SPECK ── */
  {
    id: 'porcini-speck-risotto',
    title: 'Risotto cremoso al fungo',
    subtitle: 'Il classico trentino in versione squeeze',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_7ep7wg7ep7wg7ep7.png',
    time: '25 min',
    difficulty: 'Facile',
    servings: 2,
    gusto: 'porcini-speck',
    vegetariano: false,
    vegan: false,
    glutenfree: true,
    tags: ['Porcini e Speck'],
    productUsed: 'ffps-180-01',
    ingredients: ['320g riso Carnaroli', '2 cucchiai Fior di Funghi Porcini e Speck', '50g speck a julienne', '1 scalogno', '½ bicchiere vino bianco', 'brodo vegetale q.b.', 'burro', 'grana padano', 'erba cipollina'],
    steps: ['Soffriggere lo scalogno nel burro.', 'Tostare il riso 2 minuti.', 'Sfumare con il vino.', 'Aggiungere brodo a mestoli fino a cottura.', 'A fuoco spento mantecare con burro, grana e 2 cucchiai di Fior di Funghi Porcini e Speck.', 'Guarnire con speck croccante ed erba cipollina.']
  },
  {
    id: 'porcini-speck-burger',
    title: 'Burger gourmet con fungo',
    subtitle: 'Street food con anima di bosco',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_3e5yjg3e5yjg3e5y.png',
    time: '15 min',
    difficulty: 'Facile',
    servings: 2,
    gusto: 'porcini-speck',
    vegetariano: false,
    vegan: false,
    glutenfree: true,
    tags: ['Porcini e Speck'],
    productUsed: 'ffps-180-01',
    ingredients: ['2 burger bun brioche', '2 hamburger di manzo', '2 cucchiai Fior di Funghi Porcini e Speck', 'insalata iceberg', 'pomodoro', 'cipolla caramellata', 'cheddar'],
    steps: ['Cuocere l\'hamburger su piastra calda.', 'Tostare il bun tagliato a metà.', 'Spalmare Fior di Funghi Porcini e Speck generosamente sul pane.', 'Comporre: bun, insalata, hamburger, cheddar, cipolla, pomodoro.', 'Chiudere e servire immediatamente.']
  },
  {
    id: 'porcini-speck-bruschette',
    title: 'Bruschette autunnali',
    subtitle: 'L\'antipasto che scompare in secondi',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_hdanb0hdanb0hdan.png',
    time: '5 min',
    difficulty: 'Facilissima',
    servings: 4,
    gusto: 'porcini-speck',
    vegetariano: false,
    vegan: false,
    glutenfree: false,
    tags: ['Porcini e Speck'],
    productUsed: 'ffps-180-01',
    ingredients: ['8 fette pane casereccio', '4 cucchiai Fior di Funghi Porcini e Speck', '4 fette speck', 'olio extravergine', 'aglio', 'prezzemolo'],
    steps: ['Tostare le fette di pane.', 'Sfregare ogni fetta con aglio.', 'Distribuire Fior di Funghi generosamente.', 'Aggiungere lo speck.', 'Filo d\'olio e prezzemolo fresco. Servire calde.']
  },
  /* ── TARTUFO E PECORINO ── */
  {
    id: 'tartufo-pecorino-uova',
    title: 'Uova strapazzate al tartufo',
    subtitle: 'Brunch di lusso in 8 minuti',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_y3e4lqy3e4lqy3e4.png',
    time: '8 min',
    difficulty: 'Facilissima',
    servings: 1,
    gusto: 'tartufo-pecorino',
    vegetariano: true,
    vegan: false,
    glutenfree: true,
    tags: ['Tartufo e Pecorino'],
    productUsed: 'fftap-180-01',
    ingredients: ['2 uova', '1 cucchiaio Fior di Funghi Tartufo e Pecorino', 'burro', 'toast', 'erba cipollina'],
    steps: ['Sciogliere il burro in padella a fuoco medio-basso.', 'Sbattere le uova e versarle in padella.', 'Mescolare dolcemente fino a cottura morbida.', 'A fuoco spento aggiungere Fior di Funghi Tartufo e Pecorino.', 'Servire con toast ed erba cipollina.']
  },
  {
    id: 'tartufo-pecorino-toast',
    title: 'Toast gourmet',
    subtitle: 'Prosciutto, fichi e tartufo — combo perfetta',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_1wtxiy1wtxiy1wtx.png',
    time: '5 min',
    difficulty: 'Facilissima',
    servings: 2,
    gusto: 'tartufo-pecorino',
    vegetariano: false,
    vegan: false,
    glutenfree: false,
    tags: ['Tartufo e Pecorino'],
    productUsed: 'fftap-180-01',
    ingredients: ['4 fette pane in cassetta', '2 cucchiai Fior di Funghi Tartufo e Pecorino', '4 fette prosciutto crudo', 'marmellata di fichi', 'rucola'],
    steps: ['Tostare le fette di pane.', 'Spalmare Fior di Funghi su ogni fetta.', 'Aggiungere il prosciutto crudo.', 'Un cucchiaino di marmellata di fichi.', 'Completare con rucola fresca.']
  },
  {
    id: 'tartufo-pecorino-tagliolini',
    title: 'Tagliolini al tartufo',
    subtitle: 'Pronto in 10 minuti, gourmet per sempre',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_b0t32pb0t32pb0t3.png',
    time: '10 min',
    difficulty: 'Facilissima',
    servings: 2,
    gusto: 'tartufo-pecorino',
    vegetariano: true,
    vegan: false,
    glutenfree: false,
    tags: ['Tartufo e Pecorino'],
    productUsed: 'fftap-180-01',
    ingredients: ['320g tagliolini freschi', '3 cucchiai Fior di Funghi Tartufo e Pecorino', 'burro', 'pecorino grattugiato', 'pepe nero'],
    steps: ['Cuocere i tagliolini in abbondante acqua salata.', 'Scolare al dente conservando un mestolo di acqua di cottura.', 'Mantecare con burro e Fior di Funghi Tartufo e Pecorino.', 'Aggiungere acqua di cottura per cremosità.', 'Servire con pecorino grattugiato e pepe nero macinato fresco.']
  },
  /* ── PAPRIKA E BBQ ── */
  {
    id: 'paprika-bbq-costine',
    title: 'Costine BBQ',
    subtitle: 'Il twist gourmet che i carnivori cercavano',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_7x0iwd7x0iwd7x0i.png',
    time: '60 min',
    difficulty: 'Media',
    servings: 4,
    gusto: 'paprika-bbq',
    vegetariano: false,
    vegan: false,
    glutenfree: true,
    tags: ['Paprika e BBQ'],
    productUsed: 'ffpab-180-01',
    ingredients: ['1kg costine di maiale', '3 cucchiai Fior di Funghi Paprika e BBQ', 'paprika affumicata', 'aglio in polvere', 'sale', 'pepe'],
    steps: ['Marinare le costine con Fior di Funghi BBQ per 1 ora.', 'Cuocere in forno a 180°C per 45 minuti.', 'Grigliare a fuoco alto gli ultimi 5 min per la crosticina caramellata.', 'Spennellare con altra salsa a fine cottura e servire subito.']
  },
  {
    id: 'paprika-bbq-patatine',
    title: 'Patatine al forno',
    subtitle: 'Croccanti fuori, morbide dentro',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_vktq7bvktq7bvktq.png',
    time: '35 min',
    difficulty: 'Facile',
    servings: 4,
    gusto: 'paprika-bbq',
    vegetariano: true,
    vegan: true,
    glutenfree: true,
    tags: ['Paprika e BBQ'],
    productUsed: 'ffpab-180-01',
    ingredients: ['800g patate', '2 cucchiai Fior di Funghi Paprika e BBQ', 'olio EVO', 'rosmarino fresco', 'sale grosso'],
    steps: ['Tagliare le patate a spicchi con la buccia.', 'Condire con Fior di Funghi BBQ, olio e rosmarino.', 'Distribuire su teglia con carta forno.', 'Cuocere a 200°C per 30 min girando a metà cottura.']
  },
  {
    id: 'paprika-bbq-hotdog',
    title: 'Hot dog gourmet',
    subtitle: 'Street food con anima di bosco',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_jm0zbtjm0zbtjm0z.png',
    time: '10 min',
    difficulty: 'Facilissima',
    servings: 2,
    gusto: 'paprika-bbq',
    vegetariano: false,
    vegan: false,
    glutenfree: false,
    tags: ['Paprika e BBQ'],
    productUsed: 'ffpab-180-01',
    ingredients: ['2 panini per hot dog', '2 salsicce', '2 cucchiai Fior di Funghi Paprika e BBQ', 'cipolla crispy', 'senape', 'cetrioli sott\'aceto'],
    steps: ['Cuocere le salsicce alla griglia o in padella.', 'Tostare leggermente il panino.', 'Inserire la salsiccia.', 'Aggiungere Fior di Funghi BBQ generosamente.', 'Completare con cipolla crispy e fettine di cetriolo.']
  },
  /* ── TERIYAKI E ZENZERO ── */
  {
    id: 'teriyaki-salmone',
    title: 'Salmone alla brace',
    subtitle: 'Fusion con porcini italiani',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_jevjlbjevjlbjevj.png',
    time: '20 min',
    difficulty: 'Facile',
    servings: 2,
    gusto: 'teriyaki-zenzero',
    vegetariano: false,
    vegan: false,
    glutenfree: false,
    tags: ['Teriyaki e Zenzero'],
    productUsed: 'fft-180-01',
    ingredients: ['2 filetti salmone', '3 cucchiai Fior di Funghi Teriyaki e Zenzero', 'riso basmati', 'sesamo tostato', 'cipollotto', 'lime'],
    steps: ['Marinare il salmone con Fior di Funghi per 15 minuti.', 'Cuocere su griglia calda 3 min per lato.', 'Servire sul riso basmati cotto.', 'Guarnire con sesamo, cipollotto a rondelle e spicchio di lime.']
  },
  {
    id: 'teriyaki-pollo-bowl',
    title: 'Bowl di pollo teriyaki',
    subtitle: 'Il comfort bowl che conquista tutti',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_q7qbs9q7qbs9q7qb.png',
    time: '25 min',
    difficulty: 'Facile',
    servings: 2,
    gusto: 'teriyaki-zenzero',
    vegetariano: false,
    vegan: false,
    glutenfree: false,
    tags: ['Teriyaki e Zenzero'],
    productUsed: 'fft-180-01',
    ingredients: ['400g petto di pollo', '3 cucchiai Fior di Funghi Teriyaki e Zenzero', 'riso basmati', 'avocado', 'edamame', 'sesamo', 'cipollotto'],
    steps: ['Marinare il pollo con Fior di Funghi per 20 minuti.', 'Cuocere in padella calda 5-6 min per lato.', 'Affettare a striscioline.', 'Comporre la bowl: riso, pollo, avocado a fette, edamame.', 'Guarnire con sesamo tostato e cipollotto.']
  },
  {
    id: 'teriyaki-wok-verdure',
    title: 'Wok di verdure fusion',
    subtitle: 'Il piatto vegan che sorprende tutti',
    image: 'IMMAGINI /fior di funghi prodotti /ricetta copia /Gemini_Generated_Image_6oi92p6oi92p6oi9.png',
    time: '15 min',
    difficulty: 'Facile',
    servings: 2,
    gusto: 'teriyaki-zenzero',
    vegetariano: true,
    vegan: true,
    glutenfree: false,
    tags: ['Teriyaki e Zenzero'],
    productUsed: 'fft-180-01',
    ingredients: ['200g tofu sodo', '2 cucchiai Fior di Funghi Teriyaki e Zenzero', 'broccoli', 'carote', 'peperone rosso', 'cipollotto', 'olio di sesamo', 'riso basmati'],
    steps: ['Tagliare tofu e verdure a pezzi uniformi.', 'Scaldare il wok al massimo con olio di sesamo.', 'Saltare le verdure 3-4 minuti a fuoco vivo.', 'Aggiungere il tofu e Fior di Funghi Teriyaki.', 'Saltare altri 2 minuti. Servire sul riso con sesamo.']
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
 * Filtri ricette — fissi, basati su gusto e dieta
 */
function getAllRecipeTags() {
  return [
    { label: 'Tutti',             value: 'tutti' },
    { label: 'Porcini e Speck',   value: 'porcini-speck' },
    { label: 'Tartufo e Pecorino',value: 'tartufo-pecorino' },
    { label: 'Paprika e BBQ',     value: 'paprika-bbq' },
    { label: 'Teriyaki e Zenzero',value: 'teriyaki-zenzero' },
    { label: 'Vegetariano',       value: 'vegetariano' },
    { label: 'Vegan',             value: 'vegan' },
    { label: 'Gluten Free',       value: 'gluten-free' }
  ];
}
