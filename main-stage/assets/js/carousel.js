/**
 * ALICARI WALLPAPER - CAROUSEL ENGINE
 * High-performance, gesture & mouse-friendly carousel navigation for Vertical Monitor Stage
 * Supports Wallpaper Engine, Lively Wallpaper, Mouse Drag/Swipe, Mouse Wheel & Keyboard
 */

class CarouselEngine {
  constructor(options = {}) {
    this.viewport = document.querySelector(options.viewportSelector || '.carousel-viewport');
    this.track = document.querySelector(options.trackSelector || '.carousel-track');
    this.slides = document.querySelectorAll(options.slideSelector || '.carousel-slide');
    this.tabs = document.querySelectorAll(options.tabSelector || '.carousel-tab-btn');
    this.dots = document.querySelectorAll(options.dotSelector || '.carousel-dot');
    this.quickDockBtns = document.querySelectorAll(options.quickDockBtnSelector || '.quick-dock-btn');
    this.prevBtn = document.getElementById(options.prevBtnId || 'btn-carousel-prev');
    this.nextBtn = document.getElementById(options.nextBtnId || 'btn-carousel-next');
    this.sidePrevBtn = document.getElementById(options.sidePrevBtnId || 'btn-side-prev');
    this.sideNextBtn = document.getElementById(options.sideNextBtnId || 'btn-side-next');
    this.quickDockToggleBtn = document.getElementById(options.quickDockToggleId || 'btn-quick-dock-switch');
    this.autoToggleBtn = document.getElementById(options.autoToggleId || 'btn-carousel-auto');
    this.statusLabel = document.getElementById(options.statusLabelId || 'carousel-status-label');

    this.totalSlides = this.slides.length || 2;
    
    // Restore persistent index or default to 0
    const savedIndex = parseInt(localStorage.getItem('alicari_vertical_slide_idx'), 10);
    this.currentIndex = (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < this.totalSlides) ? savedIndex : 0;

    // Restore persistent auto-slide setting
    const savedAuto = localStorage.getItem('alicari_vertical_auto_enabled');
    this.isAutoEnabled = savedAuto !== null ? savedAuto === 'true' : (options.autoEnabled ?? false);
    
    this.autoSlideInterval = parseInt(localStorage.getItem('alicari_vertical_auto_interval'), 10) || options.autoSlideInterval || 25000;
    this.autoTimer = null;

    // Gesture & Drag tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 45;

    // Mouse Drag tracking
    this.isMouseDown = false;
    this.mouseStartX = 0;
    this.mouseStartY = 0;
    this.mouseDeltaX = 0;
    this.isDragging = false;

    // Wheel debounce
    this.isWheelThrottled = false;
    this.wheelThrottleTime = 400;

    this.slideTitles = [
      'PANTALLA 1/2 • TIEMPO Y AGENDA',
      'PANTALLA 2/2 • MERCADOS Y ACTIVOS'
    ];

    this.init();
  }

  init() {
    if (!this.track || !this.slides.length) return;

    // 1. Bind tab clicks in header
    this.tabs.forEach((tab, idx) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goToSlide(idx);
        this.resetAutoTimer();
      });
    });

    // 2. Bind dot clicks in footer
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goToSlide(idx);
        this.resetAutoTimer();
      });
    });

    // 3. Bind quick dock buttons
    this.quickDockBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetSlide = btn.getAttribute('data-slide');
        if (targetSlide !== null) {
          this.goToSlide(parseInt(targetSlide, 10));
          this.resetAutoTimer();
        }
      });
    });

    if (this.quickDockToggleBtn) {
      this.quickDockToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextSlide();
        this.resetAutoTimer();
      });
    }

    // 4. Bind header arrow buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevSlide();
        this.resetAutoTimer();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextSlide();
        this.resetAutoTimer();
      });
    }

    // 5. Bind floating side navigation buttons
    if (this.sidePrevBtn) {
      this.sidePrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevSlide();
        this.resetAutoTimer();
      });
    }

    if (this.sideNextBtn) {
      this.sideNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextSlide();
        this.resetAutoTimer();
      });
    }

    // 6. Bind auto rotation toggle
    if (this.autoToggleBtn) {
      this.autoToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleAutoSlide();
      });
    }

    // 7. Double-click on background to switch screens
    const stage = document.querySelector('.stage-vertical');
    if (stage) {
      stage.addEventListener('dblclick', (e) => {
        // Only if not double clicking on a button, input, or link
        if (!e.target.closest('button, input, select, textarea, a, .settings-modal-backdrop')) {
          this.nextSlide();
          this.resetAutoTimer();
        }
      });
    }

    // 8. Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in settings inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        this.nextSlide();
        this.resetAutoTimer();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        this.prevSlide();
        this.resetAutoTimer();
      } else if (e.key === '1') {
        this.goToSlide(0);
        this.resetAutoTimer();
      } else if (e.key === '2') {
        this.goToSlide(1);
        this.resetAutoTimer();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.toggleAutoSlide();
      }
    });

    // 9. Touch & Swipe gestures (for touch monitors / tablets)
    if (this.viewport) {
      this.viewport.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      this.viewport.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleTouchGesture();
      }, { passive: true });
    }

    // 10. Mouse Drag & Swipe support (Wallpaper / Desktop Mouse gestures)
    this.bindMouseDrag();

    // 11. Mouse Wheel Navigation (Scroll wheel to navigate between slides)
    this.bindMouseWheel();

    // 12. Wallpaper Engine & Lively Wallpaper Hooks
    this.bindWallpaperEngineProps();

    // 13. Initialize auto slide if enabled
    if (this.isAutoEnabled) {
      this.startAutoTimer();
    }
    this.updateAutoButtonUI();

    // 14. Initial render
    this.updateUI();
  }

  bindMouseDrag() {
    if (!this.viewport) return;

    this.viewport.addEventListener('mousedown', (e) => {
      // Ignore right click, middle click or clicks on interactive controls
      if (e.button !== 0) return;
      if (e.target.closest('button, input, select, textarea, a, .settings-modal-card')) return;

      this.isMouseDown = true;
      this.isDragging = false;
      this.mouseStartX = e.clientX;
      this.mouseStartY = e.clientY;
      this.mouseDeltaX = 0;
      this.track.style.transition = 'none'; // Instant response while dragging
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;

      const diffX = e.clientX - this.mouseStartX;
      const diffY = e.clientY - this.mouseStartY;

      // Only start drag if horizontal movement is dominant
      if (!this.isDragging && Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
        this.isDragging = true;
        this.viewport.classList.add('is-dragging');
      }

      if (this.isDragging) {
        this.mouseDeltaX = diffX;
        const currentBase = this.currentIndex * 50;
        // Dampen drag at the edges
        const viewportWidth = this.viewport.clientWidth || 1080;
        const dragPercent = (diffX / viewportWidth) * 50;
        this.track.style.transform = `translate3d(calc(-${currentBase}% + ${dragPercent}%), 0, 0)`;
      }
    });

    const endDrag = () => {
      if (!this.isMouseDown) return;
      this.isMouseDown = false;
      this.viewport.classList.remove('is-dragging');
      this.track.style.transition = ''; // Restore smooth transition

      if (this.isDragging) {
        this.isDragging = false;
        if (this.mouseDeltaX < -this.minSwipeDistance) {
          // Dragged left -> next slide
          this.nextSlide();
        } else if (this.mouseDeltaX > this.minSwipeDistance) {
          // Dragged right -> prev slide
          this.prevSlide();
        } else {
          // Snap back
          this.updateUI();
        }
        this.resetAutoTimer();
      }
    };

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('mouseleave', endDrag);
  }

  bindMouseWheel() {
    window.addEventListener('wheel', (e) => {
      if (this.isWheelThrottled) return;

      // Check if mouse is over a scrollable inner element that still has vertical scroll room
      const scrollable = e.target.closest('.slide-clock-weather, .calendar-events-container, .quad-list-container, .settings-crypto-scroll-list');
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 2 && e.deltaY < 0;
        const atBottom = (scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2) && e.deltaY > 0;
        const isHorizontalWheel = Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 25;

        // If not at edges and not horizontal wheel or shift key, let normal content scroll
        if (!atTop && !atBottom && !isHorizontalWheel && !e.shiftKey) {
          return;
        }
      }

      // Check for horizontal scroll or shift + wheel or wheel at boundaries/empty stage
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 28) {
        this.isWheelThrottled = true;
        if (delta > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
        this.resetAutoTimer();

        setTimeout(() => {
          this.isWheelThrottled = false;
        }, this.wheelThrottleTime);
      }
    }, { passive: true });
  }

  bindWallpaperEngineProps() {
    // Wallpaper Engine API compatibility
    window.wallpaperPropertyListener = {
      applyUserProperties: (properties) => {
        if (properties.autoRotate) {
          this.isAutoEnabled = properties.autoRotate.value;
          if (this.isAutoEnabled) this.startAutoTimer();
          else this.stopAutoTimer();
          this.updateAutoButtonUI();
        }
        if (properties.autoSlideInterval) {
          this.autoSlideInterval = properties.autoSlideInterval.value * 1000;
          this.resetAutoTimer();
        }
        if (properties.defaultSlide) {
          this.goToSlide(properties.defaultSlide.value);
        }
      }
    };

    // Lively Wallpaper property listener
    window.livelyPropertyListener = (name, val) => {
      if (name === 'autoRotate') {
        this.isAutoEnabled = val;
        if (this.isAutoEnabled) this.startAutoTimer();
        else this.stopAutoTimer();
        this.updateAutoButtonUI();
      }
    };
  }

  handleTouchGesture() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.minSwipeDistance) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
      this.resetAutoTimer();
    }
  }

  goToSlide(index) {
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;
    this.currentIndex = index;

    // Persist active slide
    try {
      localStorage.setItem('alicari_vertical_slide_idx', this.currentIndex.toString());
    } catch (_) {}

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
    try {
      localStorage.setItem('alicari_vertical_auto_enabled', this.isAutoEnabled ? 'true' : 'false');
    } catch (_) {}

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
        this.autoToggleBtn.setAttribute('title', `Auto-rotación activa (${Math.round(this.autoSlideInterval / 1000)}s) — Clic para pausar`);
      } else {
        this.autoToggleBtn.classList.remove('active');
        this.autoToggleBtn.setAttribute('title', 'Auto-rotación desactivada — Clic para activar');
      }
    }
  }

  updateUI() {
    // 1. Move track
    const offsetPercentage = this.currentIndex * 50;
    this.track.style.transform = `translate3d(-${offsetPercentage}%, 0, 0)`;

    // 2. Update slides active class
    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.classList.add('is-active');
        slide.removeAttribute('aria-hidden');
      } else {
        slide.classList.remove('is-active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // 3. Update tabs in header
    this.tabs.forEach((tab, idx) => {
      if (idx === this.currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // 4. Update quick dock buttons
    this.quickDockBtns.forEach((btn) => {
      const slideIdx = parseInt(btn.getAttribute('data-slide'), 10);
      if (slideIdx === this.currentIndex) {
        btn.classList.add('active');
      } else if (!isNaN(slideIdx)) {
        btn.classList.remove('active');
      }
    });

    // 5. Update dots in footer
    this.dots.forEach((dot, idx) => {
      if (idx === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 6. Update footer status label
    if (this.statusLabel && this.slideTitles[this.currentIndex]) {
      this.statusLabel.textContent = this.slideTitles[this.currentIndex];
    }
  }
}

window.CarouselEngine = CarouselEngine;


