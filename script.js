// ===== THEME MANAGEMENT - ALWAYS FOLLOW DEVICE THEME =====

function applyDeviceTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'dark' : 'white';
  document.documentElement.setAttribute('data-theme', theme);
  const themeSwitcher = document.getElementById('themeSwitcher');
  if (themeSwitcher) {
    themeSwitcher.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', function(e) {
  applyDeviceTheme();
});

document.addEventListener('DOMContentLoaded', applyDeviceTheme);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  applyDeviceTheme();
}

// ===== MOBILE NAVIGATION WITH ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  const body = document.body;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'nav-close';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Close menu');
  nav.appendChild(closeBtn);

  function openMenu() {
    nav.classList.add('open');
    burger.classList.add('active');
    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    nav.classList.remove('open');
    burger.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.dropdown-trigger i.open').forEach(i => i.classList.remove('open'));
  }

  if (burger) {
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  overlay.addEventListener('click', closeMenu);
  closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  nav.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && !target.closest('.dropdown-trigger')) {
      closeMenu();
    }
  });

  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const menu = this.parentElement.querySelector('.dropdown-menu');
      const icon = this.querySelector('i');
      if (menu) {
        menu.classList.toggle('open');
        if (icon) icon.classList.toggle('open');
      }
    });
  });

  const themeSwitcher = document.getElementById('themeSwitcher');
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'white' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      themeSwitcher.setAttribute('aria-label', newTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      localStorage.setItem('fawlux-theme', newTheme);
    });
  }
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible && elementBottom > 0) {
      element.classList.add('visible');
    } else if (elementBottom < 0 || elementTop > window.innerHeight) {
      element.classList.remove('visible');
    }
  });
};

window.addEventListener('load', fadeInOnScroll);
window.addEventListener('scroll', fadeInOnScroll);

// ===== LOADING SPINNER =====
window.addEventListener('load', function() {
  const spinner = document.getElementById('loading-spinner');
  setTimeout(() => {
    if (spinner) {
      spinner.classList.add('hidden');
    }
  }, 1000);
});

// ===== BACK TO TOP =====
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (backToTopButton) {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== PORTFOLIO SLIDERS =====
function initPortfolioSliders() {
  const sliders = document.querySelectorAll('.portfolio-slider');
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.portfolio-slide');
    const dots = slider.querySelectorAll('.dot');
    const prevArrow = slider.querySelector('.prev-arrow');
    const nextArrow = slider.querySelector('.next-arrow');
    if (!slides.length) return;
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 4000); }
    function stopAutoSlide() { clearInterval(autoSlideInterval); }

    if (nextArrow) {
      nextArrow.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
    }
    if (prevArrow) {
      prevArrow.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
    }
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => { stopAutoSlide(); showSlide(index); startAutoSlide(); });
    });

    startAutoSlide();
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoSlide();
    });
  });
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const prevTestimonial = document.querySelector('.prev-testimonial');
  const nextTestimonial = document.querySelector('.next-testimonial');
  if (!testimonialSlides.length) return;
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(n) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    currentTestimonial = (n + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides[currentTestimonial].classList.add('active');
    if (testimonialDots[currentTestimonial]) {
      testimonialDots[currentTestimonial].classList.add('active');
    }
  }

  function nextTestimonialSlide() { showTestimonial(currentTestimonial + 1); }
  function prevTestimonialSlide() { showTestimonial(currentTestimonial - 1); }

  function startTestimonialAutoSlide() { testimonialInterval = setInterval(nextTestimonialSlide, 5000); }
  function stopTestimonialAutoSlide() { clearInterval(testimonialInterval); }

  if (nextTestimonial) {
    nextTestimonial.addEventListener('click', () => { stopTestimonialAutoSlide(); nextTestimonialSlide(); startTestimonialAutoSlide(); });
  }
  if (prevTestimonial) {
    prevTestimonial.addEventListener('click', () => { stopTestimonialAutoSlide(); prevTestimonialSlide(); startTestimonialAutoSlide(); });
  }
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => { stopTestimonialAutoSlide(); showTestimonial(index); startTestimonialAutoSlide(); });
  });

  startTestimonialAutoSlide();
  const testimonialSlider = document.querySelector('.testimonials-slider');
  if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', stopTestimonialAutoSlide);
    testimonialSlider.addEventListener('mouseleave', startTestimonialAutoSlide);
  }
}

// ===== GOOGLE BUSINESS INTEGRATION =====
function initGoogleBusiness() {
  const contactTopRow = document.querySelector('.contact-top-row');
  if (contactTopRow && window.location.pathname.includes('contact.html')) {
    const businessHoursHTML = `
      <div class="business-hours">
        <h4>Business Hours</h4>
        <ul class="hours-list">
          <li><span>Monday - Friday</span> <span>9:00 AM - 7:00 PM</span></li>
          <li><span>Saturday</span> <span>9:00 AM - 6:00 PM</span></li>
          <li class="closed"><span>Sunday</span> <span>Closed</span></li>
        </ul>
      </div>
    `;
    const contactCard = contactTopRow.querySelector('.contact-card:last-child');
    if (contactCard) {
      contactCard.insertAdjacentHTML('beforeend', businessHoursHTML);
    }
  }
}

// ===== PRODUCT SLIDER =====
function initProductSliders() {
  const sliders = document.querySelectorAll('.product-slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = track.querySelectorAll('.product-card');
    const dotsContainer = slider.parentElement.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.prev-slide');
    const nextBtn = slider.querySelector('.next-slide');

    if (!slides.length) return;

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = slides.length;
    let maxIndex = Math.max(0, totalSlides - slidesPerView);

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      const totalDots = Math.ceil(totalSlides / slidesPerView);
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToSlide(i * slidesPerView));
        dotsContainer.appendChild(dot);
      }
    }

    function getSlidesPerView() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    }

    function updateSlides() {
      slidesPerView = getSlidesPerView();
      maxIndex = Math.max(0, totalSlides - slidesPerView);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateSlider();
    }

    function updateSlider() {
      const slideWidth = slides[0].offsetWidth + 20;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i >= currentIndex && i < currentIndex + slidesPerView);
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        const activeDot = Math.floor(currentIndex / slidesPerView);
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeDot);
        });
      }
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
    }

    function nextSlide() {
      if (currentIndex + slidesPerView < totalSlides) {
        goToSlide(currentIndex + slidesPerView);
      } else {
        goToSlide(0);
      }
    }

    function prevSlide() {
      if (currentIndex - slidesPerView >= 0) {
        goToSlide(currentIndex - slidesPerView);
      } else {
        goToSlide(maxIndex);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateSlides, 200);
    });

    setTimeout(updateSlides, 100);
  });
}

// ===== CART FUNCTIONALITY =====
let cart = JSON.parse(localStorage.getItem('fawlux-cart')) || [];

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
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>${item.code}</p>
        <div class="cart-item-quantity">
          <button class="qty-btn cart-qty-minus" data-index="${index}">−</button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn cart-qty-plus" data-index="${index}">+</button>
          <button class="cart-item-remove" data-index="${index}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  // Quantity buttons in cart
  document.querySelectorAll('.cart-qty-minus').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('fawlux-cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
        syncCartButtons();
      }
    });
  });

  document.querySelectorAll('.cart-qty-plus').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      cart[index].quantity += 1;
      localStorage.setItem('fawlux-cart', JSON.stringify(cart));
      renderCart();
      updateCartBadge();
      syncCartButtons();
    });
  });

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      const removedItem = cart[index];
      cart.splice(index, 1);
      localStorage.setItem('fawlux-cart', JSON.stringify(cart));
      renderCart();
      updateCartBadge();
      syncCartButtons();
    });
  });
}

function addToCart(productCode, productName, productImage, quantity) {
  const existing = cart.find(item => item.code === productCode);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ code: productCode, name: productName, image: productImage, quantity: quantity });
  }
  localStorage.setItem('fawlux-cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge();
  syncCartButtons();
}

function syncCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    const code = btn.dataset.code;
    const isInCart = cart.some(item => item.code === code);
    if (isInCart) {
      btn.innerHTML = '<i class="fa-solid fa-trash"></i> Remove from Cart';
      btn.classList.add('in-cart');
    } else {
      btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Cart';
      btn.classList.remove('in-cart');
    }
  });
}

// ===== PRODUCT DETAILS MODAL =====
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('productDetailsModal');
  const closeBtn = document.getElementById('productDetailsClose');
  const detailsImage = document.getElementById('detailsImage');
  const detailsName = document.getElementById('detailsName');
  const detailsCode = document.getElementById('detailsCode');
  const detailsDescription = document.getElementById('detailsDescription');
  const qtyNumber = document.getElementById('qtyNumber');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const addToCartBtn = document.getElementById('detailsAddToCart');
  let currentProduct = null;
  let currentQty = 1;

  // Open modal when clicking a product card
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't open if clicking on the add-to-cart button
      if (e.target.closest('.add-to-cart')) return;
      
      const code = this.dataset.code;
      const name = this.dataset.name;
      const image = this.dataset.image;
      const description = this.dataset.description || 'Premium handcrafted piece.';
      
      currentProduct = { code, name, image, description };
      currentQty = 1;
      qtyNumber.textContent = currentQty;
      detailsImage.src = image;
      detailsImage.alt = name;
      detailsName.textContent = name;
      detailsCode.textContent = code;
      detailsDescription.textContent = description;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Quantity controls
  if (qtyMinus) {
    qtyMinus.addEventListener('click', function() {
      if (currentQty > 1) {
        currentQty -= 1;
        qtyNumber.textContent = currentQty;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function() {
      currentQty += 1;
      qtyNumber.textContent = currentQty;
    });
  }

  // Add to cart from details modal
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      if (currentProduct) {
        addToCart(currentProduct.code, currentProduct.name, currentProduct.image, currentQty);
        closeModal();
      }
    });
  }
});

// ===== CART EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
  // Add/Remove to cart buttons (toggle)
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.product-card');
      const code = this.dataset.code;
      const name = card.dataset.name;
      const image = card.dataset.image;
      
      // Check if product is already in cart
      const existing = cart.find(item => item.code === code);
      if (existing) {
        // Remove from cart
        cart = cart.filter(item => item.code !== code);
        localStorage.setItem('fawlux-cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
        syncCartButtons();
      } else {
        // Add to cart with quantity 1
        addToCart(code, name, image, 1);
      }
    });
  });

  const cartIcon = document.getElementById('cartIcon');
  const cartModal = document.getElementById('cartModal');
  const cartClose = document.getElementById('cartClose');

  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', () => {
      cartModal.classList.toggle('open');
      renderCart();
    });
  }

  if (cartClose && cartModal) {
    cartClose.addEventListener('click', () => {
      cartModal.classList.remove('open');
    });
  }

  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove('open');
      }
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) return;
      let message = 'Hello FAWLUX! I\'d like to order:\n\n';
      cart.forEach(item => {
        message += `• ${item.name} (${item.code}) x${item.quantity}\n`;
      });
      message += '\n\nPlease let me know the total cost and delivery options.';
      const phone = '2348079444199';
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }

  syncCartButtons();
  updateCartBadge();
  renderCart();
});

// ===== COLLECTION SLIDER (2 Products) =====
function initCollectionSliders() {
  const sliders = document.querySelectorAll('.collection-slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.collection-slider-track');
    const slides = track.querySelectorAll('.product-card');
    const dotsContainer = slider.parentElement.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.prev-slide');
    const nextBtn = slider.querySelector('.next-slide');

    if (!slides.length) return;

    let currentIndex = 0;
    let totalSlides = slides.length;
    let maxIndex = totalSlides - 1;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const slideWidth = slides[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
    }

    function nextSlide() {
      if (currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(maxIndex);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateSlider, 200);
    });

    setTimeout(updateSlider, 100);
  });
}

// ===== HERO SLIDER =====
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');
  let currentSlide = 0;
  let slideInterval;
  const autoPlayDelay = 5000;

  if (!slides.length) return;

  slides.forEach(slide => {
    slide.style.animation = 'none';
    slide.style.opacity = '';
    slide.style.zIndex = '';
  });

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      stopAutoPlay();
      showSlide(index);
      startAutoPlay();
    });
  });

  const slider = document.querySelector('.hero-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    }
  });

  showSlide(0);
  startAutoPlay();
});

// ===== INITIALIZE ALL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  initPortfolioSliders();
  initTestimonialsSlider();
  initGoogleBusiness();
  initProductSliders();
  initCollectionSliders();

  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    setTimeout(() => {
      spinner.classList.add('hidden');
    }, 1000);
  }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Script error:', e.error);
});