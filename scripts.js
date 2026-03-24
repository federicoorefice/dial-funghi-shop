/**
 * scripts.js — Dial Funghi Shop
 * Animazioni, carrello, logica UI
 */

if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   FOREST INTRO — Animazione Bosco -> Spazio
   Si vede su: reload, nuova tab, click Home
   ============================================================ */

function initForestIntro() {
  var introEl = document.getElementById('forest-intro');
  var logoEl  = document.getElementById('forest-logo');
  var video   = document.getElementById('intro-video');

  // Skip se non dobbiamo mostrare l'intro
  if (!window.SHOW_INTRO) {
    if (introEl) introEl.remove();
    return;
  }

  if (!introEl) return;

  var TOTAL_DURATION = 5000;

  // Blocca scroll durante intro
  document.body.style.overflow = 'hidden';
  document.body.classList.add('intro-playing');

  // Avvia il video (fallback se autoplay bloccato)
  if (video) {
    video.play().catch(function() {});
  }

  // Logo appare a 2s
  setTimeout(function() {
    if (logoEl) gsap.to(logoEl, { opacity: 1, duration: 0.8, ease: 'power2.out' });
  }, 2000);

  // A 3.5s il logo esce
  setTimeout(function() {
    if (logoEl) gsap.to(logoEl, { opacity: 0, duration: 0.5 });
  }, 3500);

  // 1s prima della fine: sfuma video
  setTimeout(function() {
    if (video) gsap.to(video, { opacity: 0, duration: 1.0, ease: 'power1.inOut' });
    var pc = document.getElementById('forest-particles');
    if (pc) gsap.to(pc, { opacity: 0, duration: 1.0, ease: 'power1.inOut' });
    gsap.to(introEl, { backgroundColor: '#0D0702', duration: 0.8 });
  }, TOTAL_DURATION - 1000);

  // A TOTAL_DURATION: slide-up e rimuovi
  setTimeout(function() {
    document.body.style.overflow = '';
    gsap.to(introEl, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: function() {
        introEl.remove();
        document.body.classList.remove('intro-playing');
      }
    });
  }, TOTAL_DURATION);
}

// Chiama initForestIntro appena il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
  initForestIntro();
});

/* ============================================================
   UTILS
   ============================================================ */

function formatPrice(price) {
  return '€' + price.toFixed(2).replace('.', ',');
}

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

/* ============================================================
   CART STATE (localStorage)
   ============================================================ */

const CART_KEY = 'dial_cart';
const CART_EXPIRY_DAYS = 7;
const FREE_SHIPPING = 30;
const SHIPPING_COST = 4.90;

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    // Support both old format (array) and new format (object with expiry)
    if (Array.isArray(data)) return data;
    if (data.expires && Date.now() > data.expires) {
      localStorage.removeItem(CART_KEY);
      return [];
    }
    return data.items || [];
  } catch { return []; }
}

function saveCart(cart) {
  const data = {
    items: cart,
    expires: Date.now() + (CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  };
  localStorage.setItem(CART_KEY, JSON.stringify(data));
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product) return;
  let cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, 99);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
      quantity: qty
    });
  }
  saveCart(cart);
  updateCartUI();
  showToast(`${product.name} aggiunto al carrello`);
  return product;
}

function removeFromCart(productId) {
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  updateCartUI();
}

function updateQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity = Math.max(0, item.quantity + delta);
  if (item.quantity === 0) cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  updateCartUI();
}

function getCartTotal() {
  return getCart().reduce((t, i) => t + i.price * i.quantity, 0);
}

function getCartCount() {
  return getCart().reduce((t, i) => t + i.quantity, 0);
}

/* ============================================================
   CART UI
   ============================================================ */

function updateCartUI() {
  const cart = getCart();
  const total = getCartTotal();
  const count = getCartCount();
  const shipping = total >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  // Count badge
  $$('#cartCount').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'flex';
  });

  // Shipping progress bar
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100);
  const fill = $('#shippingFill');
  const shippingText = $('#shippingText');
  if (fill) fill.style.width = progress + '%';
  if (shippingText) {
    if (total === 0) {
      shippingText.innerHTML = `Spedizione gratuita sopra €${FREE_SHIPPING}`;
    } else if (total >= FREE_SHIPPING) {
      shippingText.innerHTML = '🎉 <strong style="color:var(--color-green)">Spedizione gratuita!</strong>';
      if (fill) fill.style.background = 'var(--color-green)';
    } else {
      const remaining = (FREE_SHIPPING - total).toFixed(2).replace('.', ',');
      shippingText.innerHTML = `Ti mancano <strong>€${remaining}</strong> per la spedizione gratuita (soglia €${FREE_SHIPPING})`;
    }
  }

  // Items list
  const itemsEl = $('#cartItems');
  const footerEl = $('#cartFooter');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-sidebar__empty">
        <div style="font-size:3rem; opacity:0.25; margin-bottom:16px;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <p style="color:var(--color-text-muted)">Il carrello è vuoto</p>
        <a href="shop.html" class="btn btn--primary btn--sm" style="margin-top:12px;">Vai allo shop</a>
      </div>`;
    if (footerEl) footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item__img" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'72\\' height=\\'72\\'><rect width=\\'72\\' height=\\'72\\' fill=\\'%23F5ECD7\\'/></svg>'">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__weight">${item.weight}</div>
          <div class="cart-item__controls">
            <button class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Riduci quantità">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}', 1)" aria-label="Aumenta quantità">+</button>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
          <span class="cart-item__price">${formatPrice(item.price * item.quantity)}</span>
          <button class="cart-item__remove" onclick="removeFromCart('${item.id}')" aria-label="Rimuovi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>`).join('');
    if (footerEl) {
      footerEl.style.display = 'block';
      const subtotalEl = $('#cartSubtotal');
      const shippingEl = $('#cartShipping');
      const totalEl = $('#cartTotal');
      if (subtotalEl) subtotalEl.textContent = formatPrice(total);
      if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratuita' : formatPrice(shipping);
      if (totalEl) totalEl.textContent = formatPrice(grandTotal);
    }
  }
}

/* ============================================================
   CART SIDEBAR TOGGLE
   ============================================================ */

function openCart() {
  const overlay = $('#cartOverlay');
  const sidebar = $('#cartSidebar');
  if (overlay) overlay.classList.add('active');
  if (sidebar) sidebar.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const overlay = $('#cartOverlay');
  const sidebar = $('#cartSidebar');
  if (overlay) overlay.classList.remove('active');
  if (sidebar) sidebar.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   FLY TO CART ANIMATION
   ============================================================ */

function flyToCart(imgEl, productId) {
  if (!imgEl) { addToCart(productId); return; }
  const cartBtn = $('#cartToggle');
  if (!cartBtn) { addToCart(productId); return; }

  const srcRect = imgEl.getBoundingClientRect();
  const dstRect = cartBtn.getBoundingClientRect();

  const clone = document.createElement('img');
  clone.src = imgEl.src;
  clone.className = 'fly-item';
  clone.style.cssText = `
    width: ${srcRect.width}px;
    height: ${srcRect.height}px;
    left: ${srcRect.left}px;
    top: ${srcRect.top + window.scrollY}px;
    object-fit: contain;
    border-radius: 12px;
    opacity: 1;
    z-index: 9000;
    position: fixed;
    pointer-events: none;
  `;
  document.body.appendChild(clone);

  const dstX = dstRect.left + dstRect.width / 2 - srcRect.width / 2;
  const dstY = dstRect.top + dstRect.height / 2 - srcRect.height / 2;

  requestAnimationFrame(() => {
    clone.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    clone.style.left = dstX + 'px';
    clone.style.top = dstY + 'px';
    clone.style.width = '32px';
    clone.style.height = '32px';
    clone.style.opacity = '0.6';
    clone.style.transform = 'rotate(8deg) scale(0.5)';
  });

  setTimeout(() => {
    clone.remove();
    addToCart(productId);
    // Bounce cart button
    if (cartBtn) {
      cartBtn.style.transform = 'scale(1.2)';
      setTimeout(() => { cartBtn.style.transform = ''; }, 300);
    }
  }, 700);
}

/* ============================================================
   TOAST
   ============================================================ */

function showToast(message, type = 'success') {
  const container = $('#toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__dot"></span>${message}`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */

function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   SPLIT TEXT HERO ANIMATION
   ============================================================ */

function initHeroAnimation() {
  const words = $$('.hero__word-inner');
  if (!words.length) return;
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease';
      w.style.transform = 'translateY(0)';
      w.style.opacity = '1';
    }, 300 + i * 80);
  });
}

/* ============================================================
   TICKER — popola con JS per garantire il loop
   ============================================================ */


/* ============================================================
   SCROLL REVEAL (Intersection Observer)
   ============================================================ */

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$('.reveal, .reveal--left, .reveal--right, .reveal--scale, .stagger-children').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   STAT COUNTER ANIMATION (unused — replaced by initCounterAnimation)
   ============================================================ */

/* ============================================================
   PARALLAX OCCASIONI (unused — replaced by GSAP initParallax below)
   ============================================================ */

/* ============================================================
   REVIEWS CAROUSEL (auto-play)
   ============================================================ */

function initCarousel() {
  const track = $('#reviewsTrack');
  const dots = $$('#carouselDots .carousel-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const cards = $$('.review-card', track);
  const visibleCount = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  const maxIndex = Math.max(0, cards.length - visibleCount);

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play every 4s
  let autoPlay = setInterval(() => {
    goTo(current >= maxIndex ? 0 : current + 1);
  }, 4000);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.parentElement.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current >= maxIndex ? 0 : current + 1), 4000);
  });
}

/* ============================================================
   RENDER FIOR DI FUNGHI GRID (home)
   ============================================================ */

const GUSTO_COLORS = {
  'porcini-speck':    '#7B4B2A',
  'tartufo-pecorino': '#4a3828',
  'paprika-bbq':      '#E8722A',
  'teriyaki-zenzero': '#2D5016'
};

function renderFFGrid() {
  const grid = $('#ffGrid');
  if (!grid || typeof FIOR_DI_FUNGHI === 'undefined') return;

  grid.innerHTML = FIOR_DI_FUNGHI.map(p => `
    <div class="ff-card" data-gusto="${p.id}" data-color="${GUSTO_COLORS[p.id] || '#E85320'}" onclick="window.location='product?id=${p.id}'">
      <div class="card-drip" aria-hidden="true">
        <svg class="card-drip__svg" viewBox="0 0 20 60">
          <path d="M10,0 Q14,20 14,35 Q14,50 10,55 Q6,50 6,35 Q6,20 10,0Z" fill="currentColor"/>
          <circle cx="10" cy="57" r="3" fill="currentColor"/>
        </svg>
      </div>
      <div class="ff-card__accent"></div>
      <img
        src="${p.image}"
        alt="${p.imageAlt}"
        class="ff-card__img"
        id="ff-img-${p.id}"
        onerror="this.style.opacity='0.5'"
      >
      <div class="ff-card__badges">
        ${p.badges.map(b => `<span class="badge ${badgeClass(b)}">${b}</span>`).join('')}
      </div>
      <h3 class="ff-card__name">${p.name}</h3>
      <p class="ff-card__desc">${p.shortDesc}</p>
      <div class="ff-card__footer">
        <span class="ff-card__price">${p.priceFormatted}</span>
        <button
          class="btn btn--primary btn--sm"
          onclick="event.stopPropagation(); flyToCart(document.getElementById('ff-img-${p.id}'), '${p.id}')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Aggiungi
        </button>
      </div>
    </div>`).join('');

  setTimeout(() => { initSauceDrip(); initColorTheme(); }, 100);
}

/* ============================================================
   RENDER GAMMA GRID (home — tabs)
   ============================================================ */

function renderGammaGrid(filter = 'tutti') {
  const grid = $('#gammaGrid');
  if (!grid || typeof ALL_PRODUCTS === 'undefined') return;

  const products = filter === 'tutti'
    ? ALL_PRODUCTS.slice(0, 8)
    : ALL_PRODUCTS.filter(p => p.category === filter).slice(0, 8);

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card" style="transition-delay:${i * 40}ms"
         data-gusto="${p.id}" data-color="${GUSTO_COLORS[p.id] || ''}"
         onclick="window.location='product?id=${p.id}'">
      ${GUSTO_COLORS[p.id] ? `<div class="card-drip" aria-hidden="true"><svg class="card-drip__svg" viewBox="0 0 20 60"><path d="M10,0 Q14,20 14,35 Q14,50 10,55 Q6,50 6,35 Q6,20 10,0Z" fill="currentColor"/><circle cx="10" cy="57" r="3" fill="currentColor"/></svg></div>` : ''}
      <div class="product-card__img-wrap">
        <img
          src="${p.image}"
          alt="${p.imageAlt}"
          class="product-card__img"
          id="gamma-img-${p.id}"
          onerror="this.style.opacity='0.4'"
        >
        <div class="product-card__badges">
          ${p.badges.slice(0,2).map(b => `<span class="badge ${badgeClass(b)}">${b}</span>`).join('')}
        </div>
        <button
          class="product-card__add-btn"
          onclick="event.stopPropagation(); flyToCart(document.getElementById('gamma-img-${p.id}'), '${p.id}')"
          aria-label="Aggiungi al carrello"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div class="product-card__body">
        <p class="product-card__brand">${p.brand === 'fior-di-funghi' ? 'Fior di Funghi' : 'Dial Funghi'}</p>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.shortDesc}</p>
        <div class="product-card__footer">
          <div>
            <span class="product-card__price">${p.priceFormatted}</span>
            <div class="product-card__weight">${p.weight}</div>
          </div>
        </div>
      </div>
    </div>`).join('');

  // Trigger appear animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $$('.product-card', grid).forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 40);
      });
    });
  });
}

/* ============================================================
   RENDER RECIPES PREVIEW (home — 3 ricette)
   ============================================================ */

function renderRecipesPreview() {
  const grid = $('#recipesPreview');
  if (!grid || typeof RECIPES === 'undefined') return;
  grid.innerHTML = RECIPES.slice(0, 3).map(r => `
    <div class="recipe-card reveal--scale">
      <img src="${r.image}" alt="${r.title}" class="recipe-card__img" loading="lazy" onerror="this.style.background='var(--color-bg-mid)'">
      <div class="recipe-card__body">
        <div class="recipe-card__meta">
          <span class="recipe-card__meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${r.time}
          </span>
          <span class="recipe-card__meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ${r.servings} persone
          </span>
        </div>
        <h3 class="recipe-card__title">${r.title}</h3>
        <p class="recipe-card__sub">${r.subtitle}</p>
      </div>
    </div>`).join('');

  // Re-observe new elements
  initRevealObserver();
}

/* ============================================================
   GAMMA TABS (home)
   ============================================================ */

function initGammaTabs() {
  $$('#gammaTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#gammaTabs .tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderGammaGrid(btn.dataset.filter);

      // Auto-scroll per portare i risultati in primo piano anche in home
      setTimeout(() => {
        const filtersEl = document.getElementById('gammaTabs');
        if (filtersEl) {
          const y = filtersEl.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    });
  });
}

/* ============================================================
   SHOP PAGE — Full grid con filtri
   ============================================================ */

function initShopPage() {
  const grid = $('#shopGrid');
  if (!grid) return;

  // Leggi categoria dall'URL
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get('cat') || 'tutti';

  function renderShop(filter) {
    const products = filter === 'tutti' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === filter);
    const countEl = $('#shopCount');
    if (countEl) countEl.textContent = `${products.length} prodotti`;

    grid.innerHTML = products.map((p, i) => `
      <div class="product-card" style="transition-delay:${i * 30}ms" onclick="window.location='product?id=${p.id}'">
        <div class="product-card__img-wrap">
          <img
            src="${p.image}"
            alt="${p.imageAlt}"
            class="product-card__img"
            id="shop-img-${p.id}"
            loading="lazy"
            onerror="this.style.opacity='0.4'"
          >
          <div class="product-card__badges">
            ${p.badges.slice(0,2).map(b => `<span class="badge ${badgeClass(b)}">${b}</span>`).join('')}
          </div>
          <button
            class="product-card__add-btn"
            onclick="event.stopPropagation(); flyToCart(document.getElementById('shop-img-${p.id}'), '${p.id}')"
            aria-label="Aggiungi al carrello"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div class="product-card__body">
          <p class="product-card__brand">${p.brand === 'fior-di-funghi' ? 'Fior di Funghi' : 'Dial Funghi'}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__desc">${p.shortDesc}</p>
          <div class="product-card__footer">
            <div>
              <span class="product-card__price">${p.priceFormatted}</span>
              <div class="product-card__weight">${p.weight}</div>
            </div>
          </div>
        </div>
      </div>`).join('');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        $$('.product-card', grid).forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 35);
        });
      });
    });
  }

  const banner = $('#shopGrid').previousElementSibling; // il div del banner FdF
  // helper per mostrare/nascondere il banner
  function setBannerVisibility(filter) {
    const bannerEl = document.querySelector('#shopGrid').closest('.container').querySelector('.reveal');
    if (!bannerEl) return;
    bannerEl.style.display = (filter === 'tutti' || filter === 'fior-di-funghi') ? '' : 'none';
  }

  // Set active tab
  $$('#shopTabs .tab-btn').forEach(btn => {
    const isActive = btn.dataset.filter === initialCat;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    btn.addEventListener('click', () => {
      $$('#shopTabs .tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      if (filter === 'promo') {
        renderShop('tutti');
        setBannerVisibility('tutti');
        setTimeout(() => {
          $('#promoSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }
      renderShop(filter);
      setBannerVisibility(filter);
      window.history.replaceState(null, '', filter === 'tutti' ? 'shop.html' : `shop.html?cat=${filter}`);

      // Scroll alla griglia prodotti dopo il filtro
      setTimeout(() => {
        const gridEl = document.querySelector('#shopGrid, .products-grid, [class*="product-grid"]');
        if (gridEl) {
          gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  });

  renderShop(initialCat);
  initPromoSection();
}

/* ============================================================
  PROMO SECTION — slider dinamico + add bundle
  ============================================================ */

function initPromoSection() {
  const section = $('#promoSection');
  const slider = $('#promoSlider');
  if (!section || !slider) return;
  if (typeof PROMOS === 'undefined' || !Array.isArray(PROMOS)) return;

  const promos = PROMOS.map(p => {
    const items = (p.items || []).map(id => getProductById(id)).filter(Boolean);
    const original = typeof p.originalTotal === 'number' ? p.originalTotal : items.reduce((t, it) => t + (it.price || 0), 0);
    const promoPrice = typeof p.promoPrice === 'number' ? p.promoPrice : original;
    const savings = Math.max(0, original - promoPrice);
    const pct = original > 0 ? Math.round((savings / original) * 1000) / 10 : 0; // 1 decimale
    return { ...p, itemsResolved: items, original, promoPrice, savings, pct };
  });

  slider.innerHTML = promos.map((p, idx) => {
    const hero = p.heroImage || (p.itemsResolved[0]?.image ?? '');
    const includes = p.itemsResolved.map(it => `<li><span>${it.fullName || it.name}</span> <em>${it.priceFormatted || formatPrice(it.price || 0)}</em></li>`).join('');
    return `
      <article class="promo-card reveal" data-index="${idx}">
        <div class="promo-card__top">
          <div class="promo-card__badge">${p.badge || 'Promo'}</div>
          <div class="promo-card__prices">
            <span class="promo-card__old">${formatPrice(p.original)}</span>
            <span class="promo-card__new">${formatPrice(p.promoPrice)}</span>
          </div>
        </div>

        <div class="promo-card__media">
          <img src="${hero}" alt="${p.title}" loading="lazy" onerror="this.style.opacity='0.4'">
          <div class="promo-card__shine" aria-hidden="true"></div>
        </div>

        <div class="promo-card__body">
          <h4 class="promo-card__title">${p.title}</h4>
          <p class="promo-card__sub">${p.subtitle || ''}</p>

          <div class="promo-card__save">
            Risparmi <strong>${formatPrice(p.savings)}</strong> <span class="promo-card__savepct">(-${p.pct}%)</span>
          </div>

          <button class="promo-accordion-btn" type="button" aria-expanded="false">
            Vedi prodotti inclusi
            <span class="promo-accordion-chevron">▾</span>
          </button>
          <div class="promo-accordion" style="max-height:0;">
            <ul class="promo-includes">
              ${includes}
            </ul>
          </div>

          <div class="promo-card__cta">
            <button class="btn btn--primary" onclick="addPromoToCart('${p.id}')">+ Aggiungi promo</button>
            <button class="btn btn--ghost" onclick="scrollToTopShop()">Continua shopping</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Osserva i nuovi elementi con reveal
  initRevealObserver();

  // Dots
  const dotsEl = $('#promoDots');
  if (dotsEl) {
    dotsEl.innerHTML = promos.map((_, i) => `<button class="promo-dot ${i === 0 ? 'active' : ''}" data-i="${i}" aria-label="Vai alla promo ${i + 1}"></button>`).join('');
  }

  const cards = $$('.promo-card', slider);
  const setActiveDot = (i) => {
    if (!dotsEl) return;
    $$('.promo-dot', dotsEl).forEach((d, di) => d.classList.toggle('active', di === i));
  };

  // Snap scrolling + active dot
  const updateActiveFromScroll = () => {
    const mid = slider.scrollLeft + slider.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const cx = c.offsetLeft + c.clientWidth / 2;
      const d = Math.abs(cx - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActiveDot(best);
  };
  slider.addEventListener('scroll', () => requestAnimationFrame(updateActiveFromScroll), { passive: true });

  // Prev/Next
  $('#promoPrev')?.addEventListener('click', () => {
    const active = $$('.promo-dot.active', dotsEl)[0];
    const i = active ? Number(active.dataset.i) : 0;
    const next = Math.max(0, i - 1);
    cards[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  });
  $('#promoNext')?.addEventListener('click', () => {
    const active = $$('.promo-dot.active', dotsEl)[0];
    const i = active ? Number(active.dataset.i) : 0;
    const next = Math.min(cards.length - 1, i + 1);
    cards[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  });

  // Dot click
  dotsEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('.promo-dot');
    if (!btn) return;
    const i = Number(btn.dataset.i);
    cards[i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  });

  // Accordion (per card) — clic su bottone o sull'intera card
  slider.addEventListener('click', (e) => {
    const ctaBtn = e.target.closest('.promo-card__cta .btn');
    if (ctaBtn) return;

    const accordionBtn = e.target.closest('.promo-accordion-btn');
    const card = e.target.closest('.promo-card');
    if (!card) return;

    const btn = accordionBtn || card.querySelector('.promo-accordion-btn');
    const body = card.querySelector('.promo-accordion');
    if (!btn || !body) return;

    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : '0';
    card.classList.toggle('promo-open', !isOpen);
  });

  // Autoplay leggero (si ferma se l'utente interagisce)
  let auto = setInterval(() => {
    const active = $$('.promo-dot.active', dotsEl)[0];
    const i = active ? Number(active.dataset.i) : 0;
    const next = (i + 1) % cards.length;
    cards[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, 6500);
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(evt => {
    slider.addEventListener(evt, () => { if (auto) { clearInterval(auto); auto = null; } }, { passive: true });
  });
}

function scrollToTopShop() {
  $('#shopFilters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Aggiunge una promo al carrello come singola riga scontata
function addPromoToCart(promoId) {
  if (typeof PROMOS === 'undefined') return;
  const promo = PROMOS.find(p => p.id === promoId);
  if (!promo) return;

  const items = (promo.items || []).map(id => getProductById(id)).filter(Boolean);
  const name = `PROMO: ${promo.title}`;
  const includes = items.map(i => i.name).join(' + ');
  const lineId = `promo:${promo.id}`;
  const image = promo.heroImage || items[0]?.image || '';
  const price = typeof promo.promoPrice === 'number' ? promo.promoPrice : items.reduce((t, it) => t + (it.price || 0), 0);

  let cart = getCart();
  const existing = cart.find(i => i.id === lineId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, 99);
  } else {
    cart.push({
      id: lineId,
      name: name,
      price: price,
      image: image,
      weight: includes || 'Bundle',
      quantity: 1
    });
  }
  saveCart(cart);
  updateCartUI();
  showToast(`${promo.title} aggiunta al carrello`);
  openCart();
}

/* ============================================================
   PRODUCT PAGE
   ============================================================ */

function injectProductSchema(product) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.fullName || product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand === 'fior-di-funghi' ? 'Fior di Funghi' : 'Dial Funghi'
    },
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Dial Funghi" }
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || typeof ALL_PRODUCTS === 'undefined') return;

  const product = getProductById(id);
  if (!product) {
    document.title = 'Prodotto non trovato — Dial Funghi';
    const main = $('#productMain');
    if (main) main.innerHTML = '<div class="empty-state"><h3>Prodotto non trovato</h3><a href="shop.html" class="btn btn--primary" style="margin-top:20px">Torna allo shop</a></div>';
    return;
  }

  // Aggiorna titolo e meta
  document.title = `${product.fullName} — Dial Funghi`;

  // Inject schema.org Product structured data
  injectProductSchema(product);

  // Immagine — con auto-crop se scheda tecnica (ratio > 1.4)
  const img = $('#productImage');
  if (img) {
    img.src = product.image;
    img.alt = product.imageAlt;
    img.addEventListener('load', function() {
      var ratio = this.naturalWidth / this.naturalHeight;
      if (ratio > 1.4) {
        // Scheda tecnica fronte+retro: mostra solo il fronte (sinistra)
        this.style.objectFit = 'cover';
        this.style.objectPosition = '12% center';
        this.style.width = '100%';
        this.style.height = '100%';
      }
    });
    if (img.complete && img.naturalWidth) img.dispatchEvent(new Event('load'));
  }

  // Testi
  const fields = {
    '#productBrand': product.brand === 'fior-di-funghi' ? 'Fior di Funghi' : 'Dial Funghi',
    '#productTitle': product.fullName,
    '#productTagline': product.tagline,
    '#productDesc': product.description,
    '#productPrice': product.priceFormatted,
    '#productWeight': product.weight,
  };
  for (const [sel, val] of Object.entries(fields)) {
    const el = $(sel);
    if (el) el.textContent = val;
  }

  // Badges
  const badgesEl = $('#productBadges');
  if (badgesEl) {
    badgesEl.innerHTML = product.badges.map(b => `<span class="badge ${badgeClass(b)}">${b}</span>`).join('');
  }

  // Quantità
  let qty = 1;
  const qtyVal = $('#productQtyVal');
  $('#productQtyMinus')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); if (qtyVal) qtyVal.textContent = qty; });
  $('#productQtyPlus')?.addEventListener('click', () => { qty = Math.min(99, qty + 1); if (qtyVal) qtyVal.textContent = qty; });

  // Add to cart
  $('#productAddBtn')?.addEventListener('click', () => {
    const imgEl = $('#productImage');
    flyToCart(imgEl, product.id);
  });

  // Accordion
  initAccordions();

  // Related products
  renderRelated(product);
}

function renderRelated(currentProduct) {
  const grid = $('#relatedGrid');
  if (!grid) return;
  const related = ALL_PRODUCTS
    .filter(p => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand))
    .slice(0, 4);

  grid.innerHTML = related.map(p => `
    <div class="product-card" onclick="window.location='product?id=${p.id}'">
      <div class="product-card__img-wrap">
        <img src="${p.image}" alt="${p.imageAlt}" class="product-card__img" loading="lazy" onerror="this.style.opacity='0.4'">
        <div class="product-card__badges">
          ${p.badges.slice(0,1).map(b => `<span class="badge ${badgeClass(b)}">${b}</span>`).join('')}
        </div>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <div class="product-card__footer">
          <span class="product-card__price">${p.priceFormatted}</span>
          <button class="btn btn--primary btn--sm" onclick="event.stopPropagation(); addToCart('${p.id}')">
            + Aggiungi
          </button>
        </div>
      </div>
    </div>`).join('');
}

/* ============================================================
   ACCORDION
   ============================================================ */

function initAccordions() {
  $$('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const body = item?.querySelector('.accordion-body');
      const isOpen = item?.classList.contains('open');

      // Chiudi tutti
      $$('.accordion-item.open').forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.accordion-body');
        if (b) b.style.maxHeight = '0';
      });

      // Apri questo se era chiuso
      if (!isOpen && body) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   RECIPES PAGE
   ============================================================ */

/* Render lista ricette nella griglia */
function renderRecipes(list) {
  const grid = document.querySelector('.recipes-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!list || list.length === 0) {
    grid.innerHTML = '<p class="no-results">Nessuna ricetta trovata per questo filtro.</p>';
    return;
  }

  list.forEach(r => {
    const hasImg = r.image && r.image.trim() !== '';
    const imgHTML = hasImg
      ? `<img src="${r.image}" alt="${r.title}" loading="lazy"
              style="width:100%;height:100%;object-fit:cover;"
              onerror="this.parentElement.dataset.gusto='${r.gusto}';this.remove();">`
      : '';

    const badges = [];
    if (r.vegetariano) badges.push('<span class="badge badge--veg">Vegetariano</span>');
    if (r.vegan)       badges.push('<span class="badge badge--vegan">Vegan</span>');
    if (r.glutenfree)  badges.push('<span class="badge badge--gf">Gluten Free</span>');

    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.dataset.gusto       = r.gusto;
    card.dataset.vegetariano = r.vegetariano;
    card.dataset.vegan       = r.vegan;
    card.dataset.glutenfree  = r.glutenfree;

    card.innerHTML = `
      <div class="recipe-card__img-wrap" data-gusto="${r.gusto}">${imgHTML}</div>
      <div class="recipe-card__body">
        <div class="recipe-card__meta">
          <span class="recipe-card__time">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${r.time}
          </span>
          <span class="recipe-card__diff">${r.difficulty}</span>
        </div>
        <h3 class="recipe-card__title">${r.title}</h3>
        <p class="recipe-card__sub">${r.subtitle}</p>
        <div class="recipe-card__badges">${badges.join('')}</div>
        <button class="recipe-card__btn"
                onclick="openRecipeModal('${r.id}')"
                aria-label="Leggi ricetta ${r.title}">
          Leggi la ricetta
        </button>
      </div>`;
    grid.appendChild(card);
  });
}

/* Logica filtri su .filter-btn */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      let filtered;
      if (typeof RECIPES === 'undefined') return;
      switch (f) {
        case 'tutti':       filtered = RECIPES; break;
        case 'vegetariano': filtered = RECIPES.filter(r => r.vegetariano); break;
        case 'vegan':       filtered = RECIPES.filter(r => r.vegan); break;
        case 'gluten-free': filtered = RECIPES.filter(r => r.glutenfree); break;
        default:            filtered = RECIPES.filter(r => r.gusto === f);
      }
      renderRecipes(filtered);
    });
  });
}

function initRecipesPage() {
  if (typeof RECIPES === 'undefined') return;
  renderRecipes(RECIPES);
  initFilters();
}

/* ============================================================
   RECIPE MODAL
   ============================================================ */

function openRecipeModal(id) {
  const recipe = typeof getRecipeById !== 'undefined' ? getRecipeById(id) : null;
  if (!recipe) return;

  const modal = $('#recipeModal');
  if (!modal) return;

  const product = recipe.productUsed && typeof getProductById !== 'undefined'
    ? getProductById(recipe.productUsed)
    : null;

  $('#recipeModalImg').src = recipe.image;
  $('#recipeModalImg').alt = recipe.title;
  $('#recipeModalTitle').textContent = recipe.title;
  $('#recipeModalSub').textContent = recipe.subtitle;
  $('#recipeModalTime').textContent = recipe.time;
  $('#recipeModalDiff').textContent = recipe.difficulty;
  $('#recipeModalServings').textContent = recipe.servings + ' persone';

  $('#recipeModalIngredients').innerHTML = recipe.ingredients
    .map(i => `<li style="padding:6px 0; border-bottom:1px solid var(--color-border); font-size:0.88rem;">${i}</li>`)
    .join('');

  $('#recipeModalSteps').innerHTML = recipe.steps
    .map((s, i) => `<li style="display:flex; gap:12px; margin-bottom:14px;"><span style="font-family:var(--font-label); color:var(--color-accent); font-size:0.7rem; min-width:24px; margin-top:2px;">${String(i+1).padStart(2,'0')}</span><span style="font-size:0.88rem; line-height:1.6;">${s}</span></li>`)
    .join('');

  const productBlock = $('#recipeModalProduct');
  if (productBlock && product) {
    productBlock.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; padding:16px; background:var(--color-surface-warm); border-radius:var(--radius-md); border:1px solid var(--color-border); margin-top:20px;">
        <img src="${product.image}" alt="${product.name}" style="width:56px; height:56px; object-fit:contain; border-radius:8px; background:white;">
        <div style="flex:1;">
          <p style="font-family:var(--font-label); font-size:0.62rem; color:var(--color-accent); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:4px;">Prodotto usato</p>
          <p style="font-family:var(--font-title); font-weight:700; font-size:0.95rem;">${product.name}</p>
        </div>
        <button class="btn btn--primary btn--sm" onclick="addToCart('${product.id}'); closeRecipeModal();">
          Aggiungi
        </button>
      </div>`;
    productBlock.style.display = 'block';
  } else if (productBlock) {
    productBlock.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  const modal = $('#recipeModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   CART PAGE
   ============================================================ */

function initCartPage() {
  const cartTable = $('#cartTable');
  if (!cartTable) return;

  function renderCartPage() {
    const cart = getCart();
    const total = getCartTotal();
    const shipping = total >= FREE_SHIPPING ? 0 : SHIPPING_COST;
    const grandTotal = total + shipping;

    if (cart.length === 0) {
      cartTable.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h3>Il carrello è vuoto</h3>
          <p>Inizia ad aggiungere qualcosa di buono!</p>
          <a href="shop.html" class="btn btn--primary" style="margin-top:20px">Vai allo shop</a>
        </div>`;
      return;
    }

    cartTable.innerHTML = `
      <div class="cart-table__header">
        <span>Prodotto</span>
        <span style="text-align:center;">Quantità</span>
        <span style="text-align:right;">Prezzo</span>
        <span style="text-align:right;">Totale</span>
        <span></span>
      </div>
      ${cart.map(item => `
        <div class="cart-row">
          <div class="cart-row__product">
            <img src="${item.image}" alt="${item.name}" class="cart-row__img" onerror="this.style.opacity='0.4'">
            <div>
              <p style="font-family:var(--font-title); font-weight:700; font-size:0.95rem;">${item.name}</p>
              <p style="font-size:0.78rem; color:var(--color-text-muted);">${item.weight}</p>
            </div>
          </div>
          <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
            <button class="qty-btn" onclick="updateQtyPage('${item.id}', -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQtyPage('${item.id}', 1)">+</button>
          </div>
          <div style="text-align:right; font-size:0.9rem; color:var(--color-text-muted);">${formatPrice(item.price)}</div>
          <div style="text-align:right; font-family:var(--font-label); font-size:1rem;">${formatPrice(item.price * item.quantity)}</div>
          <button onclick="removeFromCartPage('${item.id}')" style="color:var(--color-text-muted);" aria-label="Rimuovi">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`).join('')}`;

    // Shipping bar (cart page)
    const fillPage = $('#shippingFillPage');
    const textPage = $('#shippingTextPage');
    const progressPage = Math.min((total / FREE_SHIPPING) * 100, 100);
    if (fillPage) fillPage.style.width = progressPage + '%';
    if (textPage) {
      if (total === 0) {
        textPage.innerHTML = `Spedizione gratuita sopra €${FREE_SHIPPING} — aggiungi prodotti al carrello`;
      } else if (total >= FREE_SHIPPING) {
        textPage.innerHTML = '🎉 Spedizione gratuita!';
        if (fillPage) fillPage.style.background = 'var(--color-green)';
      } else {
        const rem = (FREE_SHIPPING - total).toFixed(2).replace('.', ',');
        textPage.innerHTML = `Ti mancano <strong>€${rem}</strong> per la spedizione gratuita (soglia €${FREE_SHIPPING})`;
      }
    }

    // Summary
    const summarySubEl = $('#summarySubtotal');
    const summaryShipEl = $('#summaryShipping');
    const summaryTotalEl = $('#summaryTotal');
    if (summarySubEl) summarySubEl.textContent = formatPrice(total);
    if (summaryShipEl) summaryShipEl.textContent = shipping === 0 ? 'Gratuita' : formatPrice(shipping);
    if (summaryTotalEl) summaryTotalEl.textContent = formatPrice(grandTotal);

    // Checkout button — apre Stripe Payment Link
    const checkoutBtn = $('#checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }
  }

  window.updateQtyPage = (id, delta) => { updateQty(id, delta); renderCartPage(); };
  window.removeFromCartPage = (id) => { removeFromCart(id); renderCartPage(); };

  renderCartPage();
}

/* ============================================================
   CHECKOUT (Stripe Payment Links)
   ============================================================ */

function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  // Se il carrello ha un solo prodotto con link Stripe, usa quello
  if (cart.length === 1) {
    const product = getProductById(cart[0].id);
    if (product && product.stripePaymentLink && !product.stripePaymentLink.startsWith('STRIPE_LINK')) {
      window.location.href = product.stripePaymentLink;
      return;
    }
  }

  // Altrimenti usa il link generico o mostra messaggio
  showToast('Configura i Payment Links Stripe in products.js', 'success');
  // Per produzione: window.location.href = 'STRIPE_LINK_GENERALE';
}

/* ============================================================
   NEWSLETTER
   ============================================================ */

function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type=email]');
  if (input) input.value = '';
  showToast('Iscritto con successo! Benvenuto nella famiglia Dial.');
}

/* ============================================================
   HAMBURGER MOBILE MENU
   ============================================================ */

function initHamburger() {
  const btn = $('#hamburger');
  const nav = $('.navbar__nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.classList.toggle('active');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Close menu when a link is clicked
  nav.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   BADGE CLASS HELPER
   ============================================================ */

function badgeClass(badge) {
  const map = {
    'Gluten Free': 'badge--gf',
    'Vegan': 'badge--vegan',
    'Vegetariano': 'badge--veg',
    'Limited Edition': 'badge--limited',
    'Premium': 'badge--premium',
    'Top di gamma': 'badge--premium',
    'Regalo': 'badge--regalo',
    'Regalo Premium': 'badge--limited',
    'Bio': 'badge--bio',
    'Selezione curata': 'badge--regalo',
    'Cassetta Legno': 'badge--gold'
  };
  return map[badge] || 'badge--regalo';
}

/* ============================================================
   INIT — eseguito al DOM ready (UNICO blocco)
   ============================================================ */

function initCartUI() {
  updateCartUI();
  // Toggle cart
  $$('#cartToggle, #cartToggle2').forEach(btn => {
    btn?.addEventListener('click', openCart);
  });
  $('#cartOverlay')?.addEventListener('click', closeCart);
  $('#cartClose')?.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });
}

function initRecipeModalListeners() {
  const modal = $('#recipeModal');
  if (!modal) return;
  $('#recipeModalClose')?.addEventListener('click', closeRecipeModal);
  modal.querySelector('.recipe-modal__backdrop')?.addEventListener('click', closeRecipeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRecipeModal(); });
}

/* ============================================================
   REVIEWS SLIDER V2
   ============================================================ */
function initReviewsSlider() {
  const slider = document.getElementById('reviewsSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.reviews-slide');
  const dots   = document.querySelectorAll('#reviewsDots .reviews-nav__dot');
  let current  = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('reviewsPrev')?.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  document.getElementById('reviewsNext')?.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Swipe touch
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); startTimer(); }
  });

  startTimer();
}

/* ============================================================
   STORIA COUNTERS V2 — animazione numeri on scroll
   ============================================================ */
function initStoriaCounters() {
  const strip = document.getElementById('storiaNumbers');
  if (!strip) return;

  function animateValue(el, from, to, duration) {
    let start = null;
    const suffix = el.dataset.suffix || '';
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const val = Math.floor(p * (to - from) + from);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        strip.querySelectorAll('.storia-num-v2__value').forEach(el => {
          const target = parseInt(el.dataset.target || el.textContent, 10);
          const from   = target > 100 ? target - 200 : 0;
          animateValue(el, from, target, 1500);
        });
        observer.unobserve(strip);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(strip);
}

/* ============================================================
   EFFETTI PREMIUM V13
   ============================================================ */

/* ----- Effetto 1: LENIS SMOOTH SCROLL ----- */
function initLenis() {
  try {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window._lenis = lenis;
  } catch(e) { console.warn('Lenis init error:', e); }
}

/* ----- Effetto 2: CUSTOM CURSOR ----- */
function initCustomCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursor || !cursorDot) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let cursorVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
    if (!cursorVisible) {
      cursor.classList.add('visible');
      cursorDot.classList.add('visible');
      cursorVisible = true;
    }
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  function addHoverListeners() {
    document.querySelectorAll('a, button, .product-card, .recipe-card, .cert-card, .ff-card, .gusto-slide')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
  }
  addHoverListeners();
  // Re-run after dynamic content loads
  setTimeout(addHoverListeners, 1500);
}

/* ----- Effetto 3: MAGNETIC BUTTONS ----- */
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.btn--primary, .btn--outline, .btn--ghost, .magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, { x: x * 0.32, y: y * 0.32, duration: 0.4, ease: 'power2.out' });
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      }
    });
  });
}

/* ----- Effetto 5: BLUR SLIDER GUSTI ----- */
function initGustiSlider() {
  var slides = document.querySelectorAll('.gusti-slide-item');
  var textSlides = document.querySelectorAll('.gusto-slide');
  var dots = document.querySelectorAll('.gusto-dot');
  if (!slides.length) return;
  var current = 0;
  var total = slides.length;

  function getState(index, cur) {
    var diff = (index - cur + total) % total;
    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === total - 1) return 'prev';
    return 'far';
  }

  function updateSlider(newIndex) {
    current = ((newIndex % total) + total) % total;
    slides.forEach(function(slide, i) {
      slide.dataset.state = getState(i, current);
    });
    textSlides.forEach(function(text, i) {
      text.classList.toggle('active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  // Click su bottiglia
  slides.forEach(function(slide, i) {
    slide.addEventListener('click', function() { updateSlider(i); });
  });

  // Click su dot
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { updateSlider(i); });
  });

  // Swipe touch (mobile)
  var touchStartX = 0;
  var wrapper = document.querySelector('.gusti-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; });
    wrapper.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) updateSlider(current + (diff > 0 ? 1 : -1));
    });
  }

  // Inizializza
  updateSlider(0);
}

/* ----- B2: Decorative Particles per sezioni secondarie ----- */
function addDecorativeParticles(sectionSelector) {
  var section = document.querySelector(sectionSelector);
  if (!section) return;
  section.classList.add('particles-bg');
  for (var i = 0; i < 8; i++) {
    var dot = document.createElement('div');
    dot.className = 'decorative-dot';
    dot.style.cssText =
      'position:absolute;' +
      'width:' + (Math.random() * 6 + 4) + 'px;' +
      'height:' + (Math.random() * 6 + 4) + 'px;' +
      'border-radius:50%;' +
      'background:#E8722A;' +
      'opacity:' + (Math.random() * 0.3 + 0.05) + ';' +
      'top:' + (Math.random() * 100) + '%;' +
      'left:' + (Math.random() * 100) + '%;' +
      'pointer-events:none;' +
      'animation:floatDot ' + (Math.random() * 4 + 6) + 's ease-in-out infinite;' +
      'animation-delay:-' + (Math.random() * 8) + 's;';
    section.appendChild(dot);
  }
}

/* ----- B3: Parallax Bottiglie Hero ----- */
function initHeroBottleParallax() {
  if (window.innerWidth < 768) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var bottles = document.querySelectorAll('.hero-bottle');
  if (!bottles.length) return;
  var speeds = [40, -30, 35, -25];
  bottles.forEach(function(bottle, i) {
    gsap.to(bottle, {
      y: speeds[i % speeds.length],
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  });
}

/* ----- Effetto 6: LIQUID SPLASH CURSOR — RIMOSSO (Sprint 1 performance) ----- */

/* ----- Effetto 7: SAUCE DRIP ----- */
function initSauceDrip() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.product-card[data-gusto], .ff-card[data-gusto]').forEach(card => {
    const drip = card.querySelector('.card-drip');
    if (!drip) return;
    card.addEventListener('mouseenter', () => {
      gsap.fromTo(drip,
        { y: -65, opacity: 1 },
        { y: 0, duration: 0.65, ease: 'power2.in', opacity: 1 }
      );
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(drip, { y: -65, opacity: 0, duration: 0.3 });
    });
  });
}

/* ----- Effetto 8: THREE.JS PARTICLES HERO ----- */
function initHeroParticles() {
  const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
  if (isMobile) return;
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
    camera.position.z = 3;

    const COUNT = 350;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      var angle  = Math.random() * Math.PI * 2;
      var radius = Math.random() * 3.5 + 0.2;
      var depth  = (Math.random() - 0.5) * 20;
      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = depth;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    function makeCircleTexture() {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = '#E85320';
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }
    const mat = new THREE.PointsMaterial({
      map: makeCircleTexture(),
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      alphaTest: 0.4,
      depthWrite: false,
      sizeAttenuation: true
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      my = (e.clientY / window.innerHeight - 0.5) * 0.5;
    }, { passive: true });

    // Avvia/ferma RAF in base a visibilità hero
    var heroRafId = null;
    function heroAnimate() {
      heroRafId = requestAnimationFrame(heroAnimate);
      var positions = geo.attributes.position.array;
      for (var i = 0; i < COUNT; i++) {
        positions[i * 3 + 2] += 0.04;
        if (positions[i * 3 + 2] > 5) {
          var angle  = Math.random() * Math.PI * 2;
          var radius = Math.random() * 3.5 + 0.2;
          positions[i * 3]     = Math.cos(angle) * radius;
          positions[i * 3 + 1] = Math.sin(angle) * radius;
          positions[i * 3 + 2] = -12;
        }
      }
      geo.attributes.position.needsUpdate = true;
      camera.position.x += (mx - camera.position.x) * 0.02;
      camera.position.y += (-my - camera.position.y) * 0.02;
      renderer.render(scene, camera);
    }
    heroAnimate(); // parte subito — hero è sempre visibile all'inizio
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        if (!heroRafId) heroAnimate();
      } else {
        if (heroRafId) { cancelAnimationFrame(heroRafId); heroRafId = null; }
      }
    }, { threshold: 0 }).observe(canvas.closest('.hero') || canvas);

    window.addEventListener('resize', () => {
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
    }, { passive: true });
  } catch(e) { console.warn('Three.js particles error:', e); }
}

/* ----- Effetto 9: TEXT FADE IN (sostituzione scramble) ----- */
function initTextFadeIn() {
  if (typeof gsap === 'undefined') return;
  gsap.utils.toArray('[data-animate-text]').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    });
  });
}

/* ----- Effetto 11: PAGE LOADER ----- */
function initPageLoader() {
  const loader  = document.getElementById('page-loader');
  if (!loader) return;
  const logoEl  = loader.querySelector('.loader-logo');
  const barFill = loader.querySelector('.loader-bar__fill');

  if (logoEl) {
    requestAnimationFrame(() => {
      logoEl.style.opacity   = '1';
      logoEl.style.transform = 'translateY(0)';
    });
  }
  if (barFill) {
    setTimeout(() => { barFill.style.width = '100%'; }, 50);
  }

  setTimeout(() => {
    if (typeof gsap !== 'undefined') {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => { loader.style.display = 'none'; }
      });
    } else {
      loader.style.display = 'none';
    }
  }, 600);
}

/* ----- Effetto 12: PAGE TRANSITIONS ----- */
function initPageTransitions() {
  const overlay = document.getElementById('transition-overlay');
  if (!overlay || typeof gsap === 'undefined') return;

  // Solo se vengo da una navigazione interna (flag in sessionStorage)
  // faccio l'animazione d'entrata. Al primo caricamento diretto
  // l'overlay resta fuori schermo (translateY(100%) da CSS).
  if (sessionStorage.getItem('dial_transition') === '1') {
    sessionStorage.removeItem('dial_transition');
    gsap.fromTo(overlay, { yPercent: 0, y: 0 }, {
      yPercent: -100, y: 0, duration: 0.55,
      ease: 'power3.inOut', delay: 0.05
    });
  } else {
    // Prima visita o ricaricamento diretto: nascondi subito l'overlay
    gsap.set(overlay, { yPercent: -100, y: 0 });
  }

  // Intercept internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.target === '_blank') return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.setItem('dial_transition', '1');
      gsap.to(overlay, {
        yPercent: 0, y: 0,
        duration: 0.42,
        ease: 'power3.inOut',
        onComplete: () => { window.location.href = href; }
      });
    });
  });
}

/* ----- Effetto 14: COLOR THEME PER GUSTO ----- */
function initColorTheme() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.ff-card[data-color], .product-card[data-color]').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.documentElement.style.setProperty('--accent-gusto', card.dataset.color);
    });
    card.addEventListener('mouseleave', () => {
      document.documentElement.style.setProperty('--accent-gusto', '#E85320');
    });
  });
}

/* ----- Effetto 15: SCROLL PROGRESS BAR ----- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    bar.style.width = ((scrolled / maxScroll) * 100) + '%';
  }, { passive: true });
}

/* ============================================================
   V22 PREMIUM EFFECTS
   ============================================================ */

/* ----- Effetto V22-2: COUNTER ANIMATI ----- */
function initCounterAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.storia-num-v2__value, .why-stat__number').forEach(function(el) {
    var text = el.textContent.trim();
    var num = parseInt(text);
    if (isNaN(num)) return;
    var suf = text.replace(num.toString(), '');
    el.dataset.target = num;
    el.dataset.suffix = suf;
    el.textContent = '0' + suf;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.fromTo({ val: 0 }, { val: num }, {
          duration: 2, ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val) + suf;
          }
        });
      }
    });
  });
}

/* ----- Effetto V22-3: PARALLAX MULTI-LAYER CHI SIAMO ----- */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var storia = document.getElementById('storia');
  if (!storia) return;
  // Immagini si muovono più lentamente
  gsap.utils.toArray('.storia-v2__img img').forEach(function(img) {
    gsap.to(img, {
      yPercent: -15, ease: 'none',
      scrollTrigger: { trigger: storia, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  });
  // Testo leggero movimento opposto
  gsap.utils.toArray('.storia-v2__text').forEach(function(txt) {
    gsap.to(txt, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: storia, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
}

/* ----- Effetto V22-4: CLIP-PATH TEXT REVEAL ----- */
function initTextReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('h2:not(.no-reveal):not(.hero__headline)').forEach(function(el) {
    if (el.querySelector('.reveal-inner')) return; // già wrappato
    var inner = document.createElement('span');
    inner.className = 'reveal-inner';
    inner.innerHTML = el.innerHTML;
    el.innerHTML = '';
    el.classList.add('reveal-text');
    el.appendChild(inner);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function() {
        gsap.to(inner, { y: 0, duration: 0.8, ease: 'power3.out' });
      }
    });
  });
}

/* ----- Effetto V23: GLOBAL SPOTLIGHT — RIMOSSO (Sprint 1 performance) ----- */

/* ----- Effetto V26-A: TILT 3D CARD ----- */
function initTilt3D() {
  if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.product-card, .recipe-card').forEach(function(card) {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.15s ease';
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / (rect.width / 2);
      var dy = (e.clientY - cy) / (rect.height / 2);
      var rotY = dx * 8;
      var rotX = -dy * 8;
      card.style.transform = 'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(8px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
    });
    card.addEventListener('mouseenter', function() {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ----- Effetto V26-B: SCROLL REVEAL STAGGERED ----- */
function initScrollRevealGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  // Stagger per gruppi di card
  document.querySelectorAll('.products-grid, .recipes-grid').forEach(function(grid) {
    gsap.fromTo(grid.children,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
      }
    );
  });
  // Singoli elementi
  document.querySelectorAll('.cert-card, .stat-item, .feature-item').forEach(function(el) {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });
}

/* ----- Effetto V26-C: HERO WORD SPLIT REVEAL ----- */
function initHeroWordReveal() {
  if (typeof gsap === 'undefined') return;
  var heroTitle = document.querySelector('.hero__headline');
  if (!heroTitle) return;
  var wordInners = heroTitle.querySelectorAll('.hero__word-inner');
  if (!wordInners.length) return;

  function revealWords() {
    wordInners.forEach(function(w, i) {
      setTimeout(function() {
        w.style.transition = 'opacity 0.75s cubic-bezier(0.33,1,0.68,1), transform 0.75s cubic-bezier(0.33,1,0.68,1)';
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }

  // Nascondi con CSS puro, non GSAP
  wordInners.forEach(function(w) {
    w.style.opacity = '0';
    w.style.transform = 'translateY(110%)';
  });
  if (window.SHOW_INTRO) {
    var pollIntro = setInterval(function() {
      if (!document.getElementById('forest-intro') && !document.body.classList.contains('intro-playing')) {
        clearInterval(pollIntro);
        setTimeout(revealWords, 300);
      }
    }, 150);
    setTimeout(function() { clearInterval(pollIntro); revealWords(); }, 10000);
  } else {
    setTimeout(revealWords, 300);
  }
}

/* ----- Effetto V27: GUSTI PARTICLES — RIMOSSO, sostituito con CSS (Sprint 1) ----- */

/* ----- UNICO DOMContentLoaded — tutto inizializzato qui ----- */
document.addEventListener('DOMContentLoaded', () => {
  // ---- Globali sempre attivi ----
  initNavbar();
  initCartUI();
  initRevealObserver();
  initHamburger();
  initLenis();
  initCustomCursor();
  initMagneticButtons();
  initScrollProgress();
  initTextFadeIn();
  initPageLoader();
  initPageTransitions();
  initTilt3D();

  // Pagina specifica
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  const isIndex = (page === 'index' || page === '' || path === '/');

  // Funzioni che NON dipendono dai dati prodotto — esegui subito
  if (isIndex) {
    initHeroAnimation();
    initCarousel();
    initReviewsSlider();
    initStoriaCounters();
    initHeroParticles();
    initGustiSlider();
    initHeroBottleParallax();
    addDecorativeParticles('#storia');
    addDecorativeParticles('.section-certificazioni');
    initParallax();
    initCounterAnimation();
    initTextReveal();
    initHeroWordReveal();
    initScrollRevealGSAP();
    setTimeout(initColorTheme, 800);
    setTimeout(initSauceDrip, 800);
  }

  if (page === 'shop') {
    initScrollRevealGSAP();
    setTimeout(initSauceDrip, 800);
  }

  if (page === 'recipes') {
    initRecipeModalListeners();
    initScrollRevealGSAP();
  }

  // Funzioni che DIPENDONO dai dati prodotto — attendi caricamento JSON
  const waitData = window.dataReady || Promise.resolve();
  waitData.then(() => {
    if (isIndex) {
      renderFFGrid();
      renderGammaGrid();
      initGammaTabs();
      renderRecipesPreview();
    }
    if (page === 'shop') {
      initShopPage();
    }
    if (page === 'product') {
      initProductPage();
    }
    if (page === 'recipes') {
      initRecipesPage();
    }
    if (page === 'cart') {
      initCartPage();
    }
  });
});

function initSporeCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  let lastSporeTime = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSporeTime < 60) return;
    lastSporeTime = now;
    const spore = document.createElement('div');
    spore.style.cssText = `
      position:fixed; border-radius:50%; background:#E8722A;
      opacity:0.75; pointer-events:none; z-index:9999;
      width:${Math.random()*5+4}px; height:${Math.random()*5+4}px;
      left:${e.clientX}px; top:${e.clientY}px;
      transform:translate(-50%,-50%);
      transition:opacity 0.7s ease, transform 0.7s ease;
    `;
    document.body.appendChild(spore);
    requestAnimationFrame(() => {
      spore.style.opacity = '0';
      spore.style.transform = `translate(
        calc(-50% + ${(Math.random()-0.5)*20}px),
        calc(-50% + ${-Math.random()*18-5}px)
      ) scale(0.2)`;
    });
    setTimeout(() => spore.remove(), 750);
  });
}
document.addEventListener('DOMContentLoaded', initSporeCursor);

/* ----- Task 10: Sticky Scroll Gusti (scroll-jacking) ----- */
function initStickyGusti() {
  var section = document.getElementById('gusti') ||
                document.querySelector('.gusti-section, [class*="gusti"]');
  if (!section) { console.warn('Sezione gusti non trovata'); return; }

  var current = 0;
  var total = 4;
  var locked = false;
  var transitioning = false;

  function lockScroll() {
    locked = true;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function unlockScroll() {
    locked = false;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function goToGusto(index) {
    if (transitioning) return;
    transitioning = true;
    current = Math.max(0, Math.min(total - 1, index));

    document.querySelectorAll('.gusto-slide')
      .forEach(function(el, i) { el.classList.toggle('active', i === current); });

    document.querySelectorAll('.gusti-slide-item')
      .forEach(function(el, i) {
        var diff = (i - current + total) % total;
        el.dataset.state = diff === 0 ? 'active'
          : diff === 1 ? 'next'
          : diff === total - 1 ? 'prev'
          : 'far';
      });

    document.querySelectorAll('.gusto-dot')
      .forEach(function(d, i) { d.classList.toggle('active', i === current); });

    setTimeout(function() { transitioning = false; }, 550);
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.75 && !locked) {
        lockScroll();
      }
    });
  }, { threshold: [0, 0.75, 1] });

  io.observe(section);

  window.addEventListener('wheel', function(e) {
    if (!locked) return;
    e.preventDefault();
    if (transitioning) return;

    if (e.deltaY > 30) {
      if (current < total - 1) { goToGusto(current + 1); }
      else { unlockScroll(); window.scrollBy({ top: 200, behavior: 'smooth' }); }
    } else if (e.deltaY < -30) {
      if (current > 0) { goToGusto(current - 1); }
      else { unlockScroll(); window.scrollBy({ top: -200, behavior: 'smooth' }); }
    }
  }, { passive: false });

  // Touch support for mobile
  var ty = 0;
  section.addEventListener('touchstart', function(e) { ty = e.touches[0].clientY; }, { passive: true });
  section.addEventListener('touchend', function(e) {
    if (!locked) return;
    var dy = ty - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 40) return;
    if (dy > 0) {
      if (current < total - 1) goToGusto(current + 1); else unlockScroll();
    } else {
      if (current > 0) goToGusto(current - 1); else unlockScroll();
    }
  }, { passive: true });

  goToGusto(0);
}

document.addEventListener('DOMContentLoaded', initStickyGusti);

/* ----- Flip card click support (mobile) ----- */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.cert-card').forEach(function(card) {
    card.addEventListener('click', function() { card.classList.toggle('flipped'); });
  });
});
