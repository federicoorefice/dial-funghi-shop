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
  // Skip su mobile sempre
  if (window.innerWidth < 768) {
    var el = document.getElementById('forest-intro');
    if (el) el.remove();
    return;
  }
  // Skip se non dobbiamo mostrare l'intro
  if (!window.SHOW_INTRO) {
    var el2 = document.getElementById('forest-intro');
    if (el2) el2.remove();
    return;
  }
  if (typeof THREE === 'undefined') {
    var el3 = document.getElementById('forest-intro');
    if (el3) el3.remove();
    return;
  }

  var introEl   = document.getElementById('forest-intro');
  var logoEl    = document.getElementById('forest-logo');
  var slideEls  = Array.from(document.querySelectorAll('.forest-slide'));
  var canvas    = document.getElementById('forest-particles');
  if (!introEl || !slideEls.length) return;

  // Blocca scroll durante intro
  document.body.style.overflow = 'hidden';

  var SLIDE_DURATION = 1200;  // ms per slide — LENTO
  var CROSSFADE      = 600;   // ms crossfade
  var TOTAL_DURATION = 6500;  // 4 foto x 1200ms + 2000ms finale + buffer
  var currentSlide   = 0;

  // Precarica tutte le immagini
  var preloadPromises = slideEls.map(function(slide) {
    return new Promise(function(res) {
      var img = new Image();
      img.onload = img.onerror = res;
      img.src = slide.dataset.src;
      slide.style.backgroundImage = "url('" + slide.dataset.src + "')";
    });
  });

  Promise.all(preloadPromises).then(function() {
    showSlide(0);
    var slideInterval = setInterval(function() {
      var prev = slideEls[currentSlide];
      currentSlide++;
      if (currentSlide < slideEls.length) {
        prev.classList.add('leaving');
        setTimeout(function() {
          prev.classList.remove('active', 'leaving');
        }, CROSSFADE);
        showSlide(currentSlide);
      } else {
        clearInterval(slideInterval);
      }
    }, SLIDE_DURATION);
  });

  function showSlide(n) {
    var slide = slideEls[n];
    if (!slide) return;
    slide.classList.add('active');
  }

  // --- Particelle Three.js sopra le foto ---
  if (canvas) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      70, window.innerWidth / window.innerHeight, 0.01, 100
    );
    camera.position.z = 4;

    var COUNT = 220, geo = new THREE.BufferGeometry();
    var pos = new Float32Array(COUNT * 3);
    for (var i = 0; i < COUNT * 3; i += 3) {
      pos[i]   = (Math.random() - 0.5) * 8;
      pos[i+1] = (Math.random() - 0.5) * 8;
      pos[i+2] = (Math.random() - 0.5) * 14;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    function makeCircleTex(r, g, b) {
      var sz = 48, c = document.createElement('canvas');
      c.width = c.height = sz;
      var ctx = c.getContext('2d');
      ctx.beginPath();
      ctx.arc(sz/2, sz/2, sz/2-2, 0, Math.PI*2);
      ctx.fillStyle = 'rgb(' + Math.round(r*255) + ',' + Math.round(g*255) + ',' + Math.round(b*255) + ')';
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    var mat = new THREE.PointsMaterial({
      size: 0.07, transparent: true, opacity: 0.55,
      alphaTest: 0.4, depthWrite: false,
      map: makeCircleTex(0.25, 0.55, 0.15)  // verde bosco all'inizio
    });
    var pts = new THREE.Points(geo, mat);
    scene.add(pts);

    var camZ = 4;
    var startTime = Date.now();

    (function animatePts() {
      var elapsed  = Date.now() - startTime;
      var progress = Math.min(elapsed / TOTAL_DURATION, 1);

      camZ -= 0.008;
      if (camZ < -6) camZ = 3;
      camera.position.z = camZ;
      pts.rotation.y += 0.0004;

      // Crossfade LENTO verde → arancio (50%→90% della durata)
      if (progress > 0.5) {
        var t = Math.min((progress - 0.5) / 0.4, 1);
        mat.color.setRGB(
          0.25 + t * 0.66,
          0.55 - t * 0.22,
          0.15 - t * 0.15
        );
        mat.opacity = 0.55 + t * 0.15;
      }

      renderer.render(scene, camera);
      if (elapsed < TOTAL_DURATION + 1000)
        requestAnimationFrame(animatePts);
      else renderer.dispose();
    })();
  }

  // Aggiungi classe per nascondere hero durante intro
  document.body.classList.add('intro-playing');

  // Logo appare a 2.5 secondi
  setTimeout(function() {
    gsap.to(logoEl, { opacity: 1, duration: 0.8, ease: 'power2.out' });
  }, 2500);

  // A 4s il logo esce
  setTimeout(function() {
    gsap.to(logoEl, { opacity: 0, duration: 0.5 });
  }, 4000);

  // A TOTAL_DURATION - 2000ms: fade dolce dell'ultima slide e particelle
  setTimeout(function() {
    var lastSlide = document.querySelector('.forest-slide.active');
    if (lastSlide) {
      gsap.to(lastSlide, { opacity: 0, duration: 1.5, ease: 'power1.inOut' });
    }
    gsap.to('#forest-particles', { opacity: 0, duration: 1.5, ease: 'power1.inOut' });
    gsap.to(logoEl, { opacity: 0, duration: 0.5, delay: 0.3 });
  }, TOTAL_DURATION - 2000);

  // A TOTAL_DURATION: slide-up LENTO dell'overlay
  setTimeout(function() {
    document.body.style.overflow = '';
    document.body.classList.remove('intro-playing');
    document.dispatchEvent(new Event('intro-finished'));
    gsap.to(introEl, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power1.inOut',
      onComplete: function() { introEl.remove(); }
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
  const target = parseInt(el.dataset.target) || 180;
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

const GUSTO_COLORS = {
  'porcini-speck':    '#7B4B2A',
  'tartufo-pecorino': '#4a3828',
  'paprika-bbq':      '#C8281E',
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
    initReviewsSlider();
    initStoriaCounters();
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

/* ----- Effetto 5: SCROLL PINNING GUSTI con bounce ----- */
let currentGustoIndex = 0;

function switchGusto(n) {
  if (n === currentGustoIndex) return;

  // Nascondi TUTTE le bottiglie immediatamente
  document.querySelectorAll('.gusto-bottle').forEach(function(bottle) {
    gsap.killTweensOf(bottle);
    bottle.classList.remove('active');
    gsap.set(bottle, { opacity: 0, y: 0, scale: 1, rotation: 0 });
  });

  // Mostra la bottiglia corretta con bounce
  var next = document.getElementById('gusto-img-' + n);
  if (!next) return;

  currentGustoIndex = n;
  next.classList.add('active');

  gsap.fromTo(next,
    { opacity: 0, y: -120 },
    { opacity: 1, y: 0,
      duration: 0.65, ease: 'bounce.out', delay: 0.1,
      clearProps: 'none' }
  );

  var slide = document.querySelector('.gusto-slide[data-img="' + n + '"]');
  if (slide && slide.dataset.color) {
    gsap.to(document.documentElement, {
      '--accent-gusto': slide.dataset.color, duration: 0.4
    });
  }
}

function initGustiScrollPin() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.gusto-slide').forEach((slide, i) => {
    ScrollTrigger.create({
      trigger: slide,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => switchGusto(i + 1),
      onEnterBack: () => switchGusto(i + 1)
    });
  });
  switchGusto(1);
}

/* ----- Effetto 6: LIQUID SPLASH CURSOR (canvas) ----- */
function initSplashCanvas() {
  const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
  if (isMobile) return;
  const canvas = document.getElementById('splashCanvas');
  if (!canvas) return;
  try {
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    let mx = 0, my = 0, pmx = 0, pmy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      const speed = Math.hypot(mx - pmx, my - pmy);
      if (speed > 8) {
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 - 1,
            life: 1,
            size: Math.random() * 5 + 2,
            hue: Math.random() > 0.5 ? '#E85320' : '#C8860A'
          });
        }
      }
      pmx = mx; pmy = my;
    });

    function renderSplash() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.04;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * 0.55;
        ctx.fillStyle   = p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(renderSplash);
    }
    renderSplash();
  } catch(e) { console.warn('Splash canvas error:', e); }
}

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

    (function animate() {
      requestAnimationFrame(animate);
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
    })();

    window.addEventListener('resize', () => {
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
    }, { passive: true });
  } catch(e) { console.warn('Three.js particles error:', e); }
}

/* ----- Effetto 9: TEXT SCRAMBLE ----- */
function scrambleText(el) {
  const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!';
  const target = el.dataset.text || el.textContent;
  let iteration = 0;
  const interval = setInterval(() => {
    el.textContent = target.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (i < iteration) return target[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iteration >= target.length) clearInterval(interval);
    iteration += 1/3;
  }, 30);
}

function initScramble() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-scramble]').forEach(el => observer.observe(el));
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

/* ----- Effetto V23: GLOBAL SPOTLIGHT CURSOR (fixed full-page canvas) ----- */
function initSpotlight() {
  var spotCanvas = document.getElementById('global-spotlight');
  if (!spotCanvas || !window.matchMedia('(pointer: fine)').matches) return;
  var ctx = spotCanvas.getContext('2d');
  var mx = -999, my = -999;
  var targetOpacity = 0, currentOpacity = 0;

  function resizeSpot() {
    spotCanvas.width = window.innerWidth;
    spotCanvas.height = window.innerHeight;
  }
  resizeSpot();
  window.addEventListener('resize', resizeSpot, { passive: true });

  // Attivo solo sulle sezioni scure (hero, certificazioni, ricette)
  var darkSections = '.hero, .section-certificazioni, .section-recipes-preview, .section--dark';

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    // Controlla se il mouse è sopra una sezione scura
    var el = document.elementFromPoint(e.clientX, e.clientY);
    var inDark = el && el.closest(darkSections);
    targetOpacity = inDark ? 1 : 0;
  });

  function renderSpotlight() {
    currentOpacity += (targetOpacity - currentOpacity) * 0.08;
    spotCanvas.style.opacity = currentOpacity * 0.40;
    if (currentOpacity > 0.01) {
      ctx.clearRect(0, 0, spotCanvas.width, spotCanvas.height);
      ctx.fillStyle = 'rgba(5, 3, 1, 0.35)';
      ctx.fillRect(0, 0, spotCanvas.width, spotCanvas.height);
      ctx.globalCompositeOperation = 'destination-out';
      var grad = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
      grad.addColorStop(0,   'rgba(0,0,0,0.95)');
      grad.addColorStop(0.3, 'rgba(0,0,0,0.80)');
      grad.addColorStop(0.7, 'rgba(0,0,0,0.40)');
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mx, my, 320, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      // Glow arancio caldo sopra lo spotlight
      var glow = ctx.createRadialGradient(mx, my, 0, mx, my, 150);
      glow.addColorStop(0,   'rgba(232, 83, 32, 0.08)');
      glow.addColorStop(0.5, 'rgba(200, 134, 10, 0.04)');
      glow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mx, my, 120, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(renderSpotlight);
  }
  renderSpotlight();
}

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
function initScrollReveal() {
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

/* ----- Init all premium effects ----- */
document.addEventListener('DOMContentLoaded', () => {
  // Lenis (se CDN caricato)
  initLenis();

  // Cursor
  initCustomCursor();

  // Magnetic buttons
  initMagneticButtons();

  // Scroll progress bar
  initScrollProgress();

  // Text scramble
  initScramble();

  // Page loader
  initPageLoader();

  // Page transitions
  initPageTransitions();

  // Splash canvas
  initSplashCanvas();

  // Hero Three.js particles (solo index)
  const path2 = window.location.pathname;
  const page2 = path2.split('/').pop().replace('.html', '') || 'index';
  if (page2 === 'index' || page2 === '' || path2 === '/') {
    initHeroParticles();
    initGustiScrollPin();
    initSpotlight();
    initParallax();
    initCounterAnimation();
    initTextReveal();
    initHeroWordReveal();
    setTimeout(initColorTheme, 800);
  }

  // Effetti V26 (tutte le pagine)
  initTilt3D();
  initScrollReveal();

  // Sauce drip (su tutte le pagine)
  setTimeout(initSauceDrip, 800);
});
