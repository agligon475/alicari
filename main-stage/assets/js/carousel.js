/**
 * ALICARI WALLPAPER - CAROUSEL ENGINE
 * High-performance, gesture-friendly carousel navigation for Vertical Monitor Stage
 */

class CarouselEngine {
  constructor(options = {}) {
    this.viewport = document.querySelector(options.viewportSelector || '.carousel-viewport');
    this.track = document.querySelector(options.trackSelector || '.carousel-track');
    this.slides = document.querySelectorAll(options.slideSelector || '.carousel-slide');
    this.tabs = document.querySelectorAll(options.tabSelector || '.carousel-tab-btn');
    this.dots = document.querySelectorAll(options.dotSelector || '.carousel-dot');
    this.prevBtn = document.getElementById(options.prevBtnId || 'btn-carousel-prev');
    this.nextBtn = document.getElementById(options.nextBtnId || 'btn-carousel-next');
    this.autoToggleBtn = document.getElementById(options.autoToggleId || 'btn-carousel-auto');
    this.statusLabel = document.getElementById(options.statusLabelId || 'carousel-status-label');

    this.currentIndex = 0;
    this.totalSlides = this.slides.length || 2;
    this.autoSlideInterval = options.autoSlideInterval || 25000; // 25s
    this.autoTimer = null;
    this.isAutoEnabled = options.autoEnabled ?? false;

    // Gesture tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 45;

    this.slideTitles = [
      'PANTALLA 1/2 • TIEMPO Y CLIMA',
      'PANTALLA 2/2 • MERCADOS Y ACTIVOS'
    ];

    this.init();
  }

  init() {
    if (!this.track || !this.slides.length) return;

    // Bind tab clicks
    this.tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        this.goToSlide(idx);
        this.resetAutoTimer();
      });
    });

    // Bind dot clicks
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        this.goToSlide(idx);
        this.resetAutoTimer();
      });
    });

    // Bind arrow buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoTimer();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoTimer();
      });
    }

    // Bind auto rotation toggle
    if (this.autoToggleBtn) {
      this.autoToggleBtn.addEventListener('click', () => {
        this.toggleAutoSlide();
      });
    }

    // Keyboard navigation (ArrowLeft, ArrowRight, 1, 2)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.nextSlide();
        this.resetAutoTimer();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.prevSlide();
        this.resetAutoTimer();
      } else if (e.key === '1') {
        this.goToSlide(0);
        this.resetAutoTimer();
      } else if (e.key === '2') {
        this.goToSlide(1);
        this.resetAutoTimer();
      }
    });

    // Touch & Swipe gestures
    if (this.viewport) {
      this.viewport.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      this.viewport.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleGesture();
      }, { passive: true });
    }

    // Start auto slide if enabled
    if (this.isAutoEnabled) {
      this.startAutoTimer();
    }
    this.updateAutoButtonUI();

    this.updateUI();
  }

  handleGesture() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    // Only swipe if horizontal move is larger than vertical move
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.minSwipeDistance) {
      if (diffX > 0) {
        // Swiped left -> next
        this.nextSlide();
      } else {
        // Swiped right -> prev
        this.prevSlide();
      }
      this.resetAutoTimer();
    }
  }

  goToSlide(index) {
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;
    this.currentIndex = index;
    this.updateUI();
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  toggleAutoSlide() {
    this.isAutoEnabled = !this.isAutoEnabled;
    if (this.isAutoEnabled) {
      this.startAutoTimer();
    } else {
      this.stopAutoTimer();
    }
    this.updateAutoButtonUI();
  }

  startAutoTimer() {
    this.stopAutoTimer();
    this.autoTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideInterval);
  }

  stopAutoTimer() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  resetAutoTimer() {
    if (this.isAutoEnabled) {
      this.startAutoTimer();
    }
  }

  updateAutoButtonUI() {
    if (this.autoToggleBtn) {
      if (this.isAutoEnabled) {
        this.autoToggleBtn.classList.add('active');
        this.autoToggleBtn.setAttribute('title', 'Auto-rotación activada (cada 25s) — Clic para pausar');
      } else {
        this.autoToggleBtn.classList.remove('active');
        this.autoToggleBtn.setAttribute('title', 'Auto-rotación desactivada — Clic para activar');
      }
    }
  }

  updateUI() {
    // 1. Move track
    const offsetPercentage = this.currentIndex * 50; // Each slide is 50% width of the 200% track
    this.track.style.transform = `translate3d(-${offsetPercentage}%, 0, 0)`;

    // 2. Update slides active class for accessibility
    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.classList.add('is-active');
        slide.removeAttribute('aria-hidden');
      } else {
        slide.classList.remove('is-active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // 3. Update tabs
    this.tabs.forEach((tab, idx) => {
      if (idx === this.currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // 4. Update dots
    this.dots.forEach((dot, idx) => {
      if (idx === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 5. Update footer label
    if (this.statusLabel && this.slideTitles[this.currentIndex]) {
      this.statusLabel.textContent = this.slideTitles[this.currentIndex];
    }
  }
}

window.CarouselEngine = CarouselEngine;

