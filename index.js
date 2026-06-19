document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SPA Hash Router
     ========================================================================== */
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.nav-links a.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a.mobile-nav-link');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  const routePage = () => {
    const hash = window.location.hash || '#home';
    let targetId = 'home-page';

    if (hash === '#shop') targetId = 'shop-page';
    else if (hash === '#about') targetId = 'about-page';
    else if (hash === '#contact') targetId = 'contact-page';

    // Toggle Active Page Class
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === targetId) {
        sec.classList.add('active');
      }
    });

    // Update Nav Links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      }
    });

    // Update Mobile Nav Links
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      }
    });

    // Close mobile hamburger menu if open
    if (hamburgerBtn && mobileMenuOverlay) {
      hamburgerBtn.classList.remove('open');
      mobileMenuOverlay.classList.remove('open');
    }

    // Reset scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle timeline filling if transitioning to about
    if (targetId === 'about-page') {
      setTimeout(updateTimelineFill, 300);
    }
  };

  window.addEventListener('hashchange', routePage);
  routePage(); // Run once on startup

  // Mega Menu Links Click Interceptor to Pre-filter Shop
  document.querySelectorAll('.mega-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const filterCat = item.getAttribute('data-filter');
      
      // Update check states in shop page sidebar
      document.querySelectorAll('.shop-sidebar input[name="category"]').forEach(cb => {
        if (cb.value === filterCat) {
          cb.checked = true;
        } else {
          cb.checked = false;
        }
      });
      
      // Trigger shop catalog update after routing
      setTimeout(() => {
        applyFiltersAndRender();
      }, 100);
    });
  });

  /* ==========================================================================
     2. Custom Glowing Soft Cursor
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    // Basic cursor follows mouse closely
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Glow circle lag delay (anti-gravity physics)
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;

    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Highlight expand state on hoverable elements
  const updateCursorListeners = () => {
    const clickables = document.querySelectorAll('a, button, input, textarea, select, .product-wishlist, .mega-menu-item, .custom-checkbox');
    clickables.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
      });
      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
      });
    });
  };
  updateCursorListeners();

  /* ==========================================================================
     3. Magnetic Header Cart Pill Hover
     ========================================================================== */
  const magneticWrap = document.getElementById('cart-magnetic-container');
  const magneticBtn = document.getElementById('cart-button');

  if (magneticWrap && magneticBtn) {
    magneticWrap.addEventListener('mousemove', (e) => {
      const rect = magneticWrap.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      magneticBtn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    });

    magneticWrap.addEventListener('mouseleave', () => {
      magneticBtn.style.transform = 'translate(0px, 0px)';
    });
  }

  /* ==========================================================================
     4. 3D Mouse Parallax on Hero Image
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const heroImgContainer = document.querySelector('.hero-image-container');

  if (heroSection && heroImgContainer) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const mouseXRatio = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseYRatio = (e.clientY - rect.top) / rect.height - 0.5;
      
      const tiltX = mouseYRatio * -15;
      const tiltY = mouseXRatio * 15;
      const translateX = mouseXRatio * 25;
      const translateY = mouseYRatio * 25;
      
      heroImgContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${translateX}px, ${translateY}px, 0)`;
      heroImgContainer.style.transition = 'transform 0.1s ease-out';
    });

    heroSection.addEventListener('mouseleave', () => {
      heroImgContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      heroImgContainer.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  /* ==========================================================================
     5. Advanced Product Catalog & Filtering (Shop Section)
     ========================================================================== */
  const products = [
    {
      id: 1,
      name: "Scented Soy Candle",
      price: 38.00,
      image: "assets/product_candle.png",
      altImage: "assets/product_candle_alt.png",
      category: "candles",
      rating: 4.9,
      status: "new",
      desc: "Hand-poured 100% natural soy wax candle, formulated with calming lavender and soothing organic chamomile oils. Complete with wood wick."
    },
    {
      id: 2,
      name: "Ethereal Body Lotion",
      price: 46.00,
      image: "assets/product_lotion.png",
      altImage: "assets/product_lotion_alt.png",
      category: "skincare",
      rating: 4.8,
      status: "popular",
      desc: "Intensely nourishing organic lotion enriched with pure squalane and jojoba extract. Fast-absorbing, leaving a soft satin finish."
    },
    {
      id: 3,
      name: "Zen Room Mist Spray",
      price: 32.00,
      image: "assets/product_spray.png",
      altImage: "assets/product_spray_alt.png",
      category: "wellness",
      rating: 4.7,
      status: "new",
      desc: "Create an instant meditation state with sandalwood, organic vetiver, and white sage leaf botanicals. Toxin-free room spray."
    },
    {
      id: 4,
      name: "Relaxing Bath Salts",
      price: 28.00,
      image: "assets/product_bath.png",
      altImage: "assets/product_bath_alt.png",
      category: "wellness",
      rating: 5.0,
      status: "sale",
      desc: "Mineral-rich Himalayan salts infused with botanical rose petals, clean dead sea salts, and calming organic ylang-ylang oil."
    },
    {
      id: 5,
      name: "Aura Ceramic Diffuser",
      price: 64.00,
      image: "assets/hero_product.png",
      altImage: "assets/hero_product.png",
      category: "diffusers",
      rating: 4.9,
      status: "popular",
      desc: "Premium ultrasonic ceramic diffusers. Radiates ambient scenting with soft warm mist filters and auto shut-off features."
    },
    {
      id: 6,
      name: "Botanical Face Serum",
      price: 52.00,
      image: "assets/product_lotion.png",
      altImage: "assets/product_lotion_alt.png",
      category: "skincare",
      rating: 4.9,
      status: "new",
      desc: "Concentrated floral elixir base restoring collagen production. Deep hydration with cold-pressed rosehip seed extract."
    },
    {
      id: 7,
      name: "Lavender Sleep Mist",
      price: 34.00,
      image: "assets/product_spray.png",
      altImage: "assets/product_spray_alt.png",
      category: "wellness",
      rating: 4.8,
      status: "sale",
      desc: "Calm room and linen spray. Blended with French lavender and sweet valerian root oils to promote deep sleep cycles."
    },
    {
      id: 8,
      name: "Pure Honey Body Scrub",
      price: 24.00,
      image: "assets/product_bath.png",
      altImage: "assets/product_bath_alt.png",
      category: "skincare",
      rating: 4.6,
      status: "new",
      desc: "Exfoliating bath blend crafted with raw forest honey and brown sugar bits. Leaves skin deeply soft and renewed."
    }
  ];

  let currentShopPage = 1;
  const itemsPerPage = 4;

  const skeletonGrid = document.getElementById('shop-skeleton-grid');
  const catalogGrid = document.getElementById('shop-catalog-grid');

  const renderProducts = (filteredList) => {
    // Show skeleton loaders first for a smooth animation feel
    skeletonGrid.style.display = 'grid';
    catalogGrid.style.display = 'none';

    setTimeout(() => {
      skeletonGrid.style.display = 'none';
      catalogGrid.style.display = 'grid';
      catalogGrid.innerHTML = '';

      if (filteredList.length === 0) {
        catalogGrid.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 4rem 0; color: var(--color-charcoal-light)">No products match your filter parameters.</div>`;
        return;
      }

      // Pagination slice
      const startIndex = (currentShopPage - 1) * itemsPerPage;
      const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

      paginatedList.forEach(prod => {
        const badgeHTML = prod.status ? `<span class="product-badge">${prod.status}</span>` : '';
        const prodCardHTML = `
          <div class="flip-card-container" data-product="${prod.id}">
            <div class="flip-card-inner">
              
              <!-- Front Side -->
              <div class="flip-card-front">
                ${badgeHTML}
                <button class="product-wishlist" aria-label="Add to wishlist" data-wishlist-id="${prod.id}">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <div class="product-img-box">
                  <img src="${prod.image}" alt="${prod.name}">
                </div>
                <div class="product-details">
                  <span class="product-cat">${prod.category}</span>
                  <span class="product-name">${prod.name}</span>
                  <div class="product-meta-row">
                    <span class="product-price">$${prod.price.toFixed(2)}</span>
                    <div class="product-rating">
                      <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <span>${prod.rating}</span>
                    </div>
                  </div>
                  <div class="add-cart-drawer">
                    <button class="btn-quick-view" data-product="${prod.id}">Quick View</button>
                    <button class="btn-add-cart" data-name="${prod.name}" data-price="${prod.price}" data-img="${prod.image}" data-desc="${prod.desc}">Add</button>
                  </div>
                </div>
              </div>

              <!-- Back Side (Flipped Angle) -->
              <div class="flip-card-back">
                <div class="back-img-box">
                  <img src="${prod.altImage}" alt="${prod.name} Alt Angle">
                  <div class="back-overlay-info">
                    <h3>${prod.name}</h3>
                    <p>${prod.desc.substring(0, 75)}...</p>
                    <button class="btn-view-details-back btn-quick-view" data-product="${prod.id}">Explore Details</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
        catalogGrid.insertAdjacentHTML('beforeend', prodCardHTML);
      });

      // Re-trigger bindings
      bindCartActions();
      bindQuickViewActions();
      bindWishlistActions();
      updateCursorListeners();

    }, 600); // 600ms skeleton loading duration
  };

  const applyFiltersAndRender = () => {
    // 1. Get Filters
    // Category checks
    const checkedCats = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    
    // Status checks
    const checkedStatus = Array.from(document.querySelectorAll('input[name="status"]:checked')).map(cb => cb.value);
    
    // Price limit
    const maxPrice = parseFloat(document.getElementById('price-range').value);

    // 2. Filter Products
    let results = products.filter(prod => {
      // Category filter
      if (checkedCats.length > 0 && !checkedCats.includes('all')) {
        if (!checkedCats.includes(prod.category)) return false;
      }
      // Status filter
      if (checkedStatus.length > 0) {
        if (!checkedStatus.includes(prod.status)) return false;
      }
      // Price limit
      if (prod.price > maxPrice) return false;

      return true;
    });

    // Update pagination buttons count
    const totalPages = Math.ceil(results.length / itemsPerPage);
    updatePaginationControls(totalPages);

    renderProducts(results);
  };

  const updatePaginationControls = (totalPages) => {
    const pagContainer = document.querySelector('.pagination-container');
    pagContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentShopPage ? 'active' : '';
      pagContainer.insertAdjacentHTML('beforeend', `
        <button class="pagination-pill ${activeClass}" data-page="${i}">${i}</button>
      `);
    }

    document.querySelectorAll('.pagination-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentShopPage = parseInt(btn.getAttribute('data-page'));
        applyFiltersAndRender();
      });
    });
  };

  // Bind Sidebar events
  const priceRange = document.getElementById('price-range');
  const priceValLabel = document.getElementById('price-val-label');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      priceValLabel.textContent = `$${priceRange.value}`;
      currentShopPage = 1;
      applyFiltersAndRender();
    });
  }

  document.querySelectorAll('.shop-sidebar input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Uncheck "All" if other categories are selected
      if (checkbox.name === 'category' && checkbox.value !== 'all') {
        const allCheck = document.getElementById('check-cat-all');
        if (allCheck) allCheck.checked = false;
      } else if (checkbox.name === 'category' && checkbox.value === 'all') {
        // Clear others if "All" is selected
        document.querySelectorAll('input[name="category"]').forEach(cb => {
          if (cb.value !== 'all') cb.checked = false;
        });
      }
      currentShopPage = 1;
      applyFiltersAndRender();
    });
  });

  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.shop-sidebar input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
      });
      priceRange.value = 100;
      priceValLabel.textContent = '$100';
      currentShopPage = 1;
      applyFiltersAndRender();
    });
  }

  // Initial load catalog
  applyFiltersAndRender();

  /* ==========================================================================
     6. Quick View Overlay Modals
     ========================================================================== */
  const modalOverlay = document.getElementById('quick-view-overlay');
  const modalImg = document.getElementById('modal-product-img');
  const modalCat = document.getElementById('modal-product-cat');
  const modalName = document.getElementById('modal-product-name');
  const modalPrice = document.getElementById('modal-product-price');
  const modalRating = document.getElementById('modal-product-rating');
  const modalDesc = document.getElementById('modal-product-desc');
  const qtyCount = document.getElementById('qty-count');

  let activeModalProduct = null;

  const bindQuickViewActions = () => {
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Avoid triggering card rotations or navigations
        
        const prodId = parseInt(btn.getAttribute('data-product'));
        const prod = products.find(p => p.id === prodId);

        if (prod) {
          activeModalProduct = prod;
          
          modalImg.src = prod.image;
          modalCat.textContent = prod.category;
          modalName.textContent = prod.name;
          modalPrice.textContent = `$${prod.price.toFixed(2)}`;
          modalRating.textContent = prod.rating;
          modalDesc.textContent = prod.desc;
          qtyCount.textContent = '1';

          modalOverlay.classList.add('show');
        }
      });
    });
  };

  const closeModal = () => {
    modalOverlay.classList.remove('show');
    activeModalProduct = null;
  };

  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Modal Quantity
  document.getElementById('qty-plus').addEventListener('click', () => {
    let count = parseInt(qtyCount.textContent);
    qtyCount.textContent = (count + 1).toString();
  });

  document.getElementById('qty-minus').addEventListener('click', () => {
    let count = parseInt(qtyCount.textContent);
    if (count > 1) {
      qtyCount.textContent = (count - 1).toString();
    }
  });

  // Modal Add to Cart Action
  document.getElementById('modal-add-to-cart-action').addEventListener('click', () => {
    if (activeModalProduct) {
      const count = parseInt(qtyCount.textContent);
      triggerCartAdd(activeModalProduct.name, activeModalProduct.price, count);
      closeModal();
    }
  });

  /* ==========================================================================
     7. Cart Interactions & Toast Notifications
     ========================================================================== */
  let cartTotalCount = 0;
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const toastMsg = document.getElementById('toast-message');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  let toastTimeout = null;

  const triggerCartAdd = (name, price, count = 1) => {
    cartTotalCount += count;
    cartBadgeCount.textContent = cartTotalCount;

    // Badge spring bounce animation
    cartBadgeCount.classList.remove('bump');
    void cartBadgeCount.offsetWidth;
    cartBadgeCount.classList.add('bump');

    // Trigger Toast
    toastTitle.textContent = `${name} Added`;
    toastDesc.textContent = `Successfully added ${count} item(s) to your bag ($${(price * count).toFixed(2)}).`;

    toastMsg.classList.remove('show');
    void toastMsg.offsetWidth;
    toastMsg.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3500);
  };

  const bindCartActions = () => {
    document.querySelectorAll('.btn-add-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        
        triggerCartAdd(name, price, 1);
      });
    });
  };
  bindCartActions();

  /* ==========================================================================
     8. Wishlist Fills
     ========================================================================== */
  const bindWishlistActions = () => {
    document.querySelectorAll('.product-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        btn.classList.toggle('active');
        btn.style.transform = 'scale(1.25)';
        setTimeout(() => btn.style.transform = '', 150);
      });
    });
  };
  bindWishlistActions();

  /* ==========================================================================
     9. Scroll Parallax and Journey Timeline filling
     ========================================================================== */
  const timelineSection = document.querySelector('.timeline-section');
  const timelineScrollFill = document.getElementById('timeline-scroll-fill');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const storyVideo = document.querySelector('.story-video-bg');

  const updateTimelineFill = () => {
    if (!timelineSection || !timelineScrollFill) return;

    const rect = timelineSection.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // Active fill calculations based on container scroll progress
    if (rect.top < viewHeight && rect.bottom > 0) {
      // 0 (section top hits screen bottom) to 1 (section bottom hits screen top)
      const scrollRange = viewHeight + rect.height;
      const progress = (viewHeight - rect.top) / scrollRange;
      
      // Clamp between 0% and 100%
      const fillPercentage = Math.max(0, Math.min(100, (progress - 0.2) * 1.5 * 100));
      timelineScrollFill.style.height = `${fillPercentage}%`;

      // Highlight milestones as marker dots cross line
      timelineItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < (viewHeight * 0.65)) {
          item.classList.add('active-marker');
        } else {
          item.classList.remove('active-marker');
        }
      });
    }

    // Parallax on story video
    const storyContainer = document.querySelector('.story-video-container');
    if (storyContainer && storyVideo) {
      const containerRect = storyContainer.getBoundingClientRect();
      if (containerRect.top < viewHeight && containerRect.bottom > 0) {
        const containerRange = viewHeight + containerRect.height;
        const progress = (viewHeight - containerRect.top) / containerRange;
        const bgOffset = -25 + (progress * 30);
        storyVideo.style.setProperty('--parallax-y', `${bgOffset}%`);
      }
    }
  };

  window.addEventListener('scroll', updateTimelineFill);

  // Play video trigger
  const playStoryBtn = document.getElementById('btn-play-story');
  if (playStoryBtn) {
    playStoryBtn.addEventListener('click', () => {
      toastTitle.textContent = "Atmospheric Ritual";
      toastDesc.textContent = "Connecting video player to custom visual loop...";
      toastMsg.classList.add('show');
      setTimeout(() => toastMsg.classList.remove('show'), 3000);
    });
  }

  /* ==========================================================================
     10. Animated Metrics Counters
     ========================================================================== */
  const metricsSection = document.getElementById('metrics-trigger-section');
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsTriggered = false;

  const countUpMetrics = () => {
    metricNumbers.forEach(elem => {
      const target = parseInt(elem.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;
      const increment = target / steps;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          elem.textContent = target.toLocaleString();
          clearInterval(counter);
        } else {
          elem.textContent = Math.floor(current).toLocaleString();
        }
      }, stepDuration);
    });
  };

  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsTriggered) {
          countUpMetrics();
          metricsTriggered = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(metricsSection);
  }

  /* ==========================================================================
     11. Neumorphic Inputs Validation checkmarks
     ========================================================================== */
  const formInputs = document.querySelectorAll('.neumorphic-input');
  
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      const wrapper = input.closest('.input-wrapper');
      if (input.checkValidity() && input.value.trim() !== '') {
        wrapper.classList.add('valid');
      } else {
        wrapper.classList.remove('valid');
      }
    });
  });

  const supportForm = document.getElementById('support-contact-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Toast confirmation
      toastTitle.textContent = "Message Dispatched";
      toastDesc.textContent = "Support request logged. An alchemist will email you shortly.";
      
      toastMsg.classList.remove('show');
      void toastMsg.offsetWidth;
      toastMsg.classList.add('show');

      supportForm.reset();
      document.querySelectorAll('.input-wrapper').forEach(wrap => {
        wrap.classList.remove('valid');
      });

      setTimeout(() => {
        toastMsg.classList.remove('show');
      }, 4000);
    });
  }

  /* ==========================================================================
     12. Accordions Toggles (FAQs & Sidebar Filters)
     ========================================================================== */
  const faqHeaderBtns = document.querySelectorAll('.faq-header-btn');
  faqHeaderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const content = btn.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.height = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.height = `${content.scrollHeight}px`;
      }
    });
  });

  const filterHeaderBtns = document.querySelectorAll('.filter-header-btn');
  filterHeaderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // Highlight 'Crafting Elegance' text in About Hero on view
  const headline = document.getElementById('about-hero-headline');
  if (headline && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          headline.classList.add('slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(headline);
  }

  /* ==========================================================================
     13. Mobile Overlays, Hamburgers, & Bottom Sheets
     ========================================================================== */
  if (hamburgerBtn && mobileMenuOverlay) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('open');
      mobileMenuOverlay.classList.toggle('open');
    });
  }

  const mobileFilterTrigger = document.getElementById('btn-mobile-filter-trigger');
  const shopSidebar = document.querySelector('.shop-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const closeSidebarBtn = document.getElementById('btn-close-sidebar');

  if (mobileFilterTrigger && shopSidebar && sidebarOverlay) {
    mobileFilterTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      shopSidebar.classList.add('open');
      sidebarOverlay.classList.add('show');
    });

    const closeSidebar = () => {
      shopSidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
    };

    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
      });
    }
    
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Auto-close filter bottom sheet on reset or click reset
    const resetBtnMobile = document.getElementById('btn-reset-filters');
    if (resetBtnMobile) {
      resetBtnMobile.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeSidebar();
        }
      });
    }
  }

});
