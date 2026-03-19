/**
 * scripts.js — Dial Funghi Shop
 * Animazioni, carrello, logica UI
 */

if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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
const FREE_SHIPPING = 30;
const SHIPPING_COST = 4.90;

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
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
      shippingText.innerHTML = 'Aggiungi prodotti al carrello';
    } else if (total >= FREE_SHIPPING) {
      shippingText.innerHTML = '<strong style="color:var(--color-green)">Spedizione gratuita!</strong>';
      if (fill) fill.style.background = 'var(--color-green)';
    } else {
      const remaining = (FREE_SHIPPING - total).toFixed(2).replace('.', ',');
      shippingText.innerHTML = `Ti mancano <strong>€${remaining}</strong> per la spedizione gratuita`;
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

function initTickers() {
  const tracks = $$('.ticker__track');
  tracks.forEach(track => {
    const tpl = track.querySelector('template');
    if (!tpl) return;
    const content = tpl.innerHTML;
    // 4 copie per loop fluido
    track.innerHTML = content + content + content + content;
  });
}

/* ============================================================
   SCROLL REVEAL (Intersection Observer)
   ============================================================ */

function initScrollReveal() {
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
   STAT COUNTER ANIMATION
   ============================================================ */

function initStatCounter() {
  const el = $('#statCounter');
  if (!el) return;
  const target = parseInt(el.dataset.target) || 57;
  let current = 0;
  const duration = 1800;
  const startTime = performance.now();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        current = Math.round(eased * target);
        el.textContent = '+' + current;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  observer.observe(el);
}

/* ============================================================
   PARALLAX OCCASIONI
   ============================================================ */

function initParallax() {
  const el = $('#occasionsParallax');
  if (!el) return;
  window.addEventListener('scroll', () => {
    const rect = el.parentElement.getBoundingClientRect();
    const offset = rect.top * 0.3;
    el.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

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

function renderFFGrid() {
  const grid = $('#ffGrid');
  if (!grid || typeof FIOR_DI_FUNGHI === 'undefined') return;

  grid.innerHTML = FIOR_DI_FUNGHI.map(p => `
    <div class="ff-card" onclick="window.location='product.html?id=${p.id}'">
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
    <div class="product-card" style="transition-delay:${i * 40}ms" onclick="window.location='product.html?id=${p.id}'">
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
  initScrollReveal();
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
      <div class="product-card" style="transition-delay:${i * 30}ms" onclick="window.location='product.html?id=${p.id}'">
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
        // Mostra tutti i prodotti nella griglia e porta l'utente alla sezione promo
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
      
      // Auto-scroll per portare i risultati in primo piano
      setTimeout(() => {
        const filtersEl = document.getElementById('shopFilters');
        if (filtersEl) {
          // Calcoliamo la posizione tenendo conto della navbar (circa 80px)
          const y = filtersEl.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
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
  initScrollReveal();

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

  // Immagine
  const img = $('#productImage');
  if (img) { img.src = product.image; img.alt = product.imageAlt; }

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
    <div class="product-card" onclick="window.location='product.html?id=${p.id}'">
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

function initRecipesPage() {
  const grid = $('#recipesGrid');
  if (!grid || typeof RECIPES === 'undefined') return;

  let activeTag = 'Tutti';

  function renderRecipes(tag) {
    const filtered = tag === 'Tutti' ? RECIPES : RECIPES.filter(r => r.tags.includes(tag));
    grid.innerHTML = filtered.map(r => `
      <div class="recipe-card" data-id="${r.id}" onclick="openRecipeModal('${r.id}')">
        <img src="${r.image}" alt="${r.title}" class="recipe-card__img" loading="lazy" onerror="this.style.background='var(--color-bg-mid)'">
        <div class="recipe-card__body">
          <div class="recipe-card__meta">
            <span class="recipe-card__meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${r.time}
            </span>
            <span class="recipe-card__meta-item">${r.difficulty}</span>
            <span class="recipe-card__meta-item">${r.servings} pers.</span>
          </div>
          <h3 class="recipe-card__title">${r.title}</h3>
          <p class="recipe-card__sub">${r.subtitle}</p>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:12px;">
            ${r.tags.map(t => `<span class="tag" style="font-size:0.58rem; padding:3px 9px;">${t}</span>`).join('')}
          </div>
        </div>
      </div>`).join('');
  }

  // Render tag filters
  const tagsEl = $('#recipeTags');
  if (tagsEl && typeof getAllRecipeTags !== 'undefined') {
    const tags = getAllRecipeTags();
    tagsEl.innerHTML = tags.map(t => `
      <button class="tag ${t === 'Tutti' ? 'active' : ''}" data-tag="${t}">${t}</button>`).join('');
    tagsEl.addEventListener('click', e => {
      const btn = e.target.closest('.tag');
      if (!btn) return;
      $$('#recipeTags .tag').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      activeTag = btn.dataset.tag;
      renderRecipes(activeTag);
    });
  }

  renderRecipes('Tutti');
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
    const open = nav.style.display === 'flex';
    nav.style.display = open ? '' : 'flex';
    nav.style.flexDirection = open ? '' : 'column';
    nav.style.position = open ? '' : 'absolute';
    nav.style.top = open ? '' : '100%';
    nav.style.left = open ? '' : '0';
    nav.style.right = open ? '' : '0';
    nav.style.background = open ? '' : 'rgba(28,14,5,0.98)';
    nav.style.padding = open ? '' : '24px 24px';
    nav.style.gap = open ? '' : '20px';
    nav.style.backdropFilter = open ? '' : 'blur(20px)';
    nav.style.zIndex = open ? '' : '999';
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
   INIT — eseguito al DOM ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Globali sempre attivi
  initNavbar();
  initCartUI();
  initScrollReveal();
  initHamburger();

  // Pagina specifica — supporta sia /page.html che /page (server senza estensione)
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';

  if (page === 'index' || page === '' || path === '/') {
    initHeroAnimation();
    initTickers();
    renderFFGrid();
    renderGammaGrid();
    initGammaTabs();
    renderRecipesPreview();
    initStatCounter();
    initParallax();
    initCarousel();
  }

  if (page === 'shop') {
    initShopPage();
  }

  if (page === 'product') {
    initProductPage();
  }

  if (page === 'recipes') {
    initRecipesPage();
    initRecipeModalListeners();
  }

  if (page === 'cart') {
    initCartPage();
  }
});

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
