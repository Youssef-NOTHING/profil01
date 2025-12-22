// Simple animation on scroll (optional)
window.addEventListener('scroll', () => {
  document.querySelectorAll('section').forEach(section => {
    const position = section.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      section.style.opacity = 1;
      section.style.transform = 'translateY(0)';
    }
  });
});

// Global filter function used by inline onclick handlers
window.filterProjects = function (category) {
  const cat = (category || 'all').toLowerCase();
  const projectsSection = document.getElementById('projects');

  // If projects aren't on this page, redirect to business page with category preserved
  if (!projectsSection) {
    const q = cat && cat !== 'all' ? `?category=${encodeURIComponent(cat)}` : '';
    window.location.href = `business.html${q}#projects`;
    return;
  }

  const cards = document.querySelectorAll('.project-card');

  // Toggle active state on buttons
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.filter-btn[onclick*="${category}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Filter cards
  cards.forEach(card => {
    const data = (card.getAttribute('data-category') || '').toLowerCase();
    const show = cat === 'all' || data.includes(cat);
    card.style.display = show ? '' : 'none';
  });

  // Optional: scroll to projects section
  const projects = document.getElementById('projects');
  if (projects) projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Fullscreen toggle for project media containers
window.toggleFullscreen = function (button) {
  const media = button && button.closest('.project-media');
  if (!media) return;

  if (!document.fullscreenElement && media.requestFullscreen) {
    media.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};

// Enable click-to-play/pause on videos and keep overlay unobtrusive
window.addEventListener('DOMContentLoaded', () => {
  // Theme setup: saved preference or system default
  const root = document.documentElement;
  const THEME_KEY = 'theme.mode.v1';
  function applyTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      const toggle = document.getElementById('themeToggle');
      if (toggle) toggle.textContent = '☀️';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      const toggle = document.getElementById('themeToggle');
      if (toggle) toggle.textContent = '🌙';
    }
  }
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  } catch {}
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch {}
    });
  }
  // React to system theme changes if user hasn't set a preference
  try {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', (e) => {
      const saved = localStorage.getItem(THEME_KEY);
      if (!saved) applyTheme(e.matches ? 'dark' : 'light');
    });
  } catch {}
  // If a category is provided via URL, apply the filter on load (business page)
  try {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      window.filterProjects(categoryParam);
    }
  } catch {}
  // --- Product Store & Dynamic Pricing ---
  const PRODUCTS_KEY = 'products.v1';
  function loadProducts() {
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: 'landing-page',
        name: 'Landing Page',
        price: 100,
        icon: '🚀',
        subtitle: 'One-page conversion machine',
        badge: 'Starter',
        featured: false,
        guarantee: '✔ 14-day support included',
        features: ['Conversion-focused layout','Mobile-first performance','Basic analytics setup']
      },
      {
        id: 'brand-kit',
        name: 'Brand Kit',
        price: 50,
        icon: '🎨',
        subtitle: 'Logo, templates, and guide',
        badge: 'Most Popular',
        featured: true,
        guarantee: '✔ Consistent visuals across touchpoints',
        features: ['Logo + color + type','Social templates','Usage guide PDF']
      },
      {
        id: 'content-sprint',
        name: 'Content Sprint',
        price: 10,
        icon: '🎬',
        subtitle: 'Short-form edits that sell',
        badge: 'Fast Results',
        featured: false,
        guarantee: '✔ Ready for IG/Reels/TikTok',
        features: ['3–5 edited reels','Hooks + captions','Export for platforms']
      }
    ];
  }
  function saveProducts(products) {
    try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); } catch {}
  }

  function renderPricingGrid() {
    const grid = document.querySelector('.pricing-grid');
    if (!grid) return;
    const products = loadProducts();
    grid.innerHTML = products.map(p => {
      const ribbon = p.featured ? '<span class="popular-ribbon">Most Popular</span>' : (p.badge ? `<span class="plan-badge">${p.badge}</span>` : '');
      const featureList = (p.features || []).map(f => `<li>${f}</li>`).join('');
      return `
        <div class="pricing-card${p.featured ? ' featured' : ''}">
          ${ribbon}
          <div class="plan-header">
            <div class="plan-icon">${p.icon || '⭐'}</div>
            <div class="plan-title">
              <h3>${p.name}</h3>
              <p class="plan-subtitle">${p.subtitle || ''}</p>
            </div>
          </div>
          <div class="price-line"><span class="price">$${p.price}</span><span class="price-note">one-time</span></div>
          <ul class="feature-list">${featureList}</ul>
          ${p.guarantee ? `<div class="guarantee">${p.guarantee}</div>` : ''}
          <div class="pricing-actions">
            <button class="btn btn-primary add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
            <a class="btn btn-secondary" href="mailto:youssefboukhmiss44@gmail.com?subject=${encodeURIComponent(p.name + ' Details')}&body=${encodeURIComponent('Hi Youssef,\n\nCould you share more details on ' + p.name + '?')}">Details</a>
          </div>
        </div>`;
    }).join('');
  }

  renderPricingGrid();

  // Mobile nav toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  document.querySelectorAll('.project-media').forEach(media => {
    const video = media.querySelector('video');
    const overlay = media.querySelector('.play-overlay');
    const playIcon = media.querySelector('.play-icon');

    if (video) {
      // Click on media toggles play/pause (except fullscreen button)
      media.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('fullscreen-btn')) return;
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      // Play icon explicitly toggles play/pause
      if (playIcon) {
        playIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
      }

      // Hide overlay while playing; restore default when paused
      if (overlay) {
        video.addEventListener('play', () => {
          overlay.style.opacity = 0;
        });
        video.addEventListener('pause', () => {
          overlay.style.opacity = '';
        });
      }
    }
  });

  // --- Cart Logic ---
  const MESSAGE_EMAIL = window.MESSAGE_EMAIL || 'youssefboukhmiss44@gmail.com';
  const WEBHOOK_URL = window.MESSAGE_WEBHOOK_URL || '';
  const STORAGE_KEY = 'cart.items.v1';

  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const confirmBtn = document.getElementById('confirmPurchaseBtn');

  let cart = [];

  function loadCart() {
    try {
      cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function formatCurrency(n) {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
    } catch {
      return `$${n.toFixed(2)}`;
    }
  }

  function updateCartUI() {
    // Count
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) cartCountEl.textContent = String(count);

    // Items
    if (cartItemsEl && cartEmptyEl) {
      cartItemsEl.innerHTML = '';
      if (cart.length === 0) {
        cartEmptyEl.style.display = 'block';
      } else {
        cartEmptyEl.style.display = 'none';
        cart.forEach(item => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <div class="cart-item-info">
              <strong>${item.name}</strong>
              <span>${formatCurrency(item.price)}</span>
            </div>
            <div class="cart-item-actions">
              <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="qty">${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
              <button class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove">✕</button>
            </div>`;
          cartItemsEl.appendChild(li);
        });
      }
    }

    // Total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(total);
  }

  function addItem(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price: Number(price), qty: 1 });
    }
    saveCart();
    updateCartUI();
    openCart();
  }

  function changeQty(id, delta) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      saveCart();
      updateCartUI();
    }
  }

  function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
  }

  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  function buildMessage() {
    const lines = [];
    lines.push('New order confirmed:');
    cart.forEach(i => lines.push(`- ${i.name} x${i.qty} @ $${i.price}`));
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    lines.push(`Total: $${total.toFixed(2)}`);
    lines.push('Customer email (optional): ');
    return lines.join('\n');
  }

  async function notifyOwner() {
    const subject = encodeURIComponent('New Order Confirmation');
    const body = encodeURIComponent(buildMessage());

    // Try webhook first if provided
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: 'New Order Confirmation', message: buildMessage(), items: cart })
        });
      } catch (e) {
        // swallow; fallback to mailto below
      }
    }

    // Fallback to mailto (opens client)
    window.location.href = `mailto:${MESSAGE_EMAIL}?subject=${subject}&body=${body}`;
  }

  function handleConfirm() {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    notifyOwner();
    alert('Thank you! We sent the order details.');
  }

  // Wire up events
  loadCart();
  updateCartUI();

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price'));
      addItem(id, name, price);
    });
  });

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const id = target.getAttribute('data-id');
      const action = target.getAttribute('data-action');
      if (!id || !action) return;
      if (action === 'inc') changeQty(id, 1);
      if (action === 'dec') changeQty(id, -1);
      if (action === 'remove') removeItem(id);
    });
  }

});