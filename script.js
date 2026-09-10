// ===== THEME SWITCHER =====
const themeSwitcher = document.getElementById('themeSwitcher');
if (themeSwitcher) {
  themeSwitcher.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'white' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
  });
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('primary-nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
  });
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('fawlux-mini-cart')) || [];

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
  }
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="https://via.placeholder.com/60x60/1a1a1a/d4af37?text=${item.code}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>${item.code}</p>
        <button class="cart-item-remove" data-index="${index}">Remove</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem('fawlux-mini-cart', JSON.stringify(cart));
      renderCart();
      updateCartBadge();
      syncCartButtons();
    });
  });
}

function addToCart(code, name, quantity = 1) {
  const existing = cart.find(item => item.code === code);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ code, name, quantity });
  }
  localStorage.setItem('fawlux-mini-cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge();
  syncCartButtons();
}

function syncCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    const code = btn.dataset.code;
    const isInCart = cart.some(item => item.code === code);
    if (isInCart) {
      btn.innerHTML = '<i class="fa-solid fa-trash"></i> Remove';
      btn.classList.add('in-cart');
    } else {
      btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Cart';
      btn.classList.remove('in-cart');
    }
  });
}

// ===== PRODUCT CARD BUTTONS =====
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const code = btn.dataset.code;
    const card = btn.closest('.product-card');
    const name = card.dataset.name;

    const existing = cart.find(item => item.code === code);
    if (existing) {
      cart = cart.filter(item => item.code !== code);
      localStorage.setItem('fawlux-mini-cart', JSON.stringify(cart));
      renderCart();
      updateCartBadge();
      syncCartButtons();
    } else {
      addToCart(code, name, 1);
    }
  });
});

// ===== CART MODAL =====
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');

if (cartIcon) cartIcon.addEventListener('click', () => {
  cartModal.classList.add('open');
  renderCart();
});
if (cartClose) cartClose.addEventListener('click', () => {
  cartModal.classList.remove('open');
});
if (cartModal) cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('open');
});

// ===== CHECKOUT =====
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    let message = 'Hello FAWLUX! I\'d like to order:\n\n';
    cart.forEach(item => {
      message += `• ${item.name} (${item.code}) x${item.quantity}\n`;
    });
    window.open(`https://wa.me/2348079444199?text=${encodeURIComponent(message)}`, '_blank');
  });
}

// ===== SEARCH =====
const searchIcon = document.getElementById('searchIcon');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const products = [
  { name: 'Classic Kaftan', code: 'FL-MINI-001' },
  { name: 'Royal Agbada', code: 'FL-MINI-002' },
  { name: 'Premium Shirt', code: 'FL-MINI-003' },
];

if (searchIcon) searchIcon.addEventListener('click', () => {
  searchOverlay.classList.add('open');
  setTimeout(() => searchInput.focus(), 200);
});
if (searchClose) searchClose.addEventListener('click', () => {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
  searchResults.innerHTML = '';
});
if (searchOverlay) searchOverlay.addEventListener('click', (e) => {
  if (e.target === searchOverlay) {
    searchOverlay.classList.remove('open');
  }
});
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    const found = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query)
    );
    if (found.length === 0) {
      searchResults.innerHTML = `<div class="search-no-results">No products found for "${query}"</div>`;
      return;
    }
    searchResults.innerHTML = found.map(p => `
      <a href="#" class="search-result-item">
        <span>${p.name}</span>
        <span>${p.code}</span>
      </a>
    `).join('');
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('open');
    }
  });
}

// ===== INIT =====
updateCartBadge();
renderCart();
syncCartButtons();