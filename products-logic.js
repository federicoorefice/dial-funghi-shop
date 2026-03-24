/**
 * products-logic.js — Carica dati prodotto e ricette da JSON
 * Espone le stesse variabili globali per retrocompatibilita con scripts.js
 */

// Variabili globali — inizializzate vuote, popolate da fetch
let ALL_PRODUCTS = [];
let FIOR_DI_FUNGHI = [];
let ALTRI_PRODOTTI = [];
let CATEGORIES = [];
let RECIPES = [];
let SHIPPING = { freeThreshold: 30, standardCost: 4.90, standardLabel: 'Spedizione standard', freeLabel: 'Spedizione gratuita', estimatedDays: '2-4 giorni lavorativi' };
let PROMOS = [];

// Promise globale per sapere quando i dati sono pronti
const dataReady = (async () => {
  try {
    const [prodRes, recRes] = await Promise.all([
      fetch('./products-data.json'),
      fetch('./recipes-data.json')
    ]);

    if (!prodRes.ok) throw new Error('Errore caricamento products-data.json');
    if (!recRes.ok) throw new Error('Errore caricamento recipes-data.json');

    const prodData = await prodRes.json();
    const recData = await recRes.json();

    ALL_PRODUCTS = prodData.products || [];
    FIOR_DI_FUNGHI = ALL_PRODUCTS.filter(p => p.brand === 'fior-di-funghi');
    ALTRI_PRODOTTI = ALL_PRODUCTS.filter(p => p.brand !== 'fior-di-funghi');
    CATEGORIES = prodData.categories || [];
    SHIPPING = prodData.shipping || SHIPPING;
    PROMOS = prodData.promos || [];
    RECIPES = recData.recipes || [];

    // Aggiorna i conteggi delle categorie (dinamici)
    CATEGORIES.forEach(cat => {
      if (cat.id === 'tutti') {
        cat.count = ALL_PRODUCTS.length;
      } else {
        cat.count = ALL_PRODUCTS.filter(p => p.category === cat.id).length;
      }
    });

    // Esporta su window per retrocompatibilita
    window.ALL_PRODUCTS = ALL_PRODUCTS;
    window.FIOR_DI_FUNGHI = FIOR_DI_FUNGHI;
    window.ALTRI_PRODOTTI = ALTRI_PRODOTTI;
    window.CATEGORIES = CATEGORIES;
    window.RECIPES = RECIPES;
    window.SHIPPING = SHIPPING;
    window.PROMOS = PROMOS;

    console.log('[products-logic] Dati caricati:', ALL_PRODUCTS.length, 'prodotti,', RECIPES.length, 'ricette');
  } catch (e) {
    console.error('[products-logic] Errore caricamento dati:', e);
  }
})();

// Esporta dataReady su window per uso in scripts.js
window.dataReady = dataReady;

/* ============================================================
   HELPER FUNCTIONS — stesse di products.js
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
  return '\u20AC' + price.toFixed(2).replace('.', ',');
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

// Esporta helper functions su window per retrocompatibilita
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getFeaturedProducts = getFeaturedProducts;
window.getRecipeById = getRecipeById;
window.getRecipesByTag = getRecipesByTag;
window.calculateCartTotal = calculateCartTotal;
window.calculateShipping = calculateShipping;
window.formatPrice = formatPrice;
window.getAllRecipeTags = getAllRecipeTags;
