/*
Tooplate 2160 Exhibit Studio
https://www.tooplate.com/view/2160-exhibit-studio
Free HTML CSS Template
*/

(function () {
      'use strict';

      /* ─────────────────────────────────────────────────────────────
         HAMBURGER MENU
         ───────────────────────────────────────────────────────────── */
      var hamburger  = document.getElementById('js-hamburger');
      var mobileMenu = document.getElementById('js-mobile-menu');

      if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
          var isOpen = mobileMenu.classList.toggle('is-open');
          hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          hamburger.setAttribute('aria-label',    isOpen ? 'Close menu' : 'Open menu');
          mobileMenu.setAttribute('aria-hidden',  isOpen ? 'false' : 'true');
        });

        /* Close mobile menu when a link inside it is clicked */
        mobileMenu.addEventListener('click', function (e) {
          if (e.target.tagName === 'A') {
            mobileMenu.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
            mobileMenu.setAttribute('aria-hidden', 'true');
          }
        });
      }

      /* ─────────────────────────────────────────────────────────────
         COLLECT ALL GALLERY ITEMS
         items is rebuilt when the filter changes, so the lightbox
         counter and navigation always reflect the visible set.
         ───────────────────────────────────────────────────────────── */
      const gallery    = document.getElementById('js-gallery');
      const lightbox   = document.getElementById('js-lightbox');
      const lbImage    = document.getElementById('js-lb-image');
      const lbCounter  = document.getElementById('js-lb-counter');
      const lbTitle    = document.getElementById('js-lb-title');
      const lbMeta     = document.getElementById('js-lb-meta');
      const lbClose    = document.getElementById('js-lb-close');
      const lbPrev     = document.getElementById('js-lb-prev');
      const lbNext     = document.getElementById('js-lb-next');
      const photoCount = document.getElementById('js-photo-count');

      if (gallery) {
        let visibleItems  = [];   // Currently visible gallery items
        let currentIndex  = 0;   // Active index in the lightbox

        /* ─────────────────────────────────────────────────────────────
           BUILD VISIBLE ITEM LIST
           ───────────────────────────────────────────────────────────── */
        function buildVisibleList (filter) {
          const all = Array.from(gallery.querySelectorAll('.gallery__item'));
          visibleItems = filter === 'all'
            ? all
            : all.filter(el => el.dataset.category === filter);

          /* Update the hero photo count to reflect the filter */
          if (photoCount) {
            photoCount.textContent = visibleItems.length + ' Proyecto' +
              (visibleItems.length === 1 ? '' : 's');
          }
        }

        /* ─────────────────────────────────────────────────────────────
           OPEN LIGHTBOX
           ───────────────────────────────────────────────────────────── */
        function openLightbox (index) {
          currentIndex = index;
          updateLightbox();
          lightbox.classList.add('is-open');
          document.body.style.overflow = 'hidden';   /* Prevent page scroll */
          lbClose.focus();
        }

        /* ─────────────────────────────────────────────────────────────
           CLOSE LIGHTBOX
           ───────────────────────────────────────────────────────────── */
        function closeLightbox () {
          lightbox.classList.remove('is-open');
          document.body.style.overflow = '';
        }

        /* ─────────────────────────────────────────────────────────────
           UPDATE LIGHTBOX CONTENT  (called on open + navigation)
           ───────────────────────────────────────────────────────────── */
        function updateLightbox () {
          const item = visibleItems[currentIndex];
          if (!item) return;

          const fullSrc = item.dataset.full || item.querySelector('.gallery__image').src;
          const title   = item.dataset.title || '';
          const meta    = item.dataset.meta  || '';

          /* Fade out → swap src → fade in */
          lbImage.classList.add('is-loading');

          const img = new Image();
          img.onload = function () {
            lbImage.src = fullSrc;
            lbImage.alt = title;
            lbImage.classList.remove('is-loading');
          };
          img.src = fullSrc;

          lbTitle.textContent   = title;
          lbMeta.textContent    = meta;
          lbCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;

          /* Hide prev/next buttons at the ends */
          if (lbPrev) lbPrev.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
          if (lbNext) lbNext.style.visibility = currentIndex === visibleItems.length - 1 ? 'hidden' : 'visible';
        }

        /* ─────────────────────────────────────────────────────────────
           NAVIGATE
           ───────────────────────────────────────────────────────────── */
        function goTo (delta) {
          const next = currentIndex + delta;
          if (next >= 0 && next < visibleItems.length) {
            currentIndex = next;
            updateLightbox();
          }
        }

        /* ─────────────────────────────────────────────────────────────
           GALLERY CLICK DELEGATION
           ───────────────────────────────────────────────────────────── */
        gallery.addEventListener('click', function (e) {
          const expandIcon = e.target.closest('.gallery__expand-icon');
          if (expandIcon) {
            e.preventDefault();
            e.stopPropagation();
            const item = expandIcon.closest('.gallery__item');
            if (item) {
              const index = visibleItems.indexOf(item);
              if (index !== -1) openLightbox(index);
            }
          }
        });

        /* ─────────────────────────────────────────────────────────────
           LIGHTBOX CONTROLS
           ───────────────────────────────────────────────────────────── */
        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lbPrev) lbPrev.addEventListener ('click', function () { goTo(-1); });
        if (lbNext) lbNext.addEventListener ('click', function () { goTo(+1); });

        /* Click the backdrop (outside the image) to close */
        if (lightbox) {
          lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__stage')) {
              closeLightbox();
            }
          });
        }

        /* Keyboard navigation */
        document.addEventListener('keydown', function (e) {
          if (!lightbox || !lightbox.classList.contains('is-open')) return;
          if (e.key === 'Escape')      closeLightbox();
          if (e.key === 'ArrowLeft')   goTo(-1);
          if (e.key === 'ArrowRight')  goTo(+1);
        });

        /* ─────────────────────────────────────────────────────────────
           FILTER LOGIC
           ───────────────────────────────────────────────────────────── */
        const filterBar  = document.querySelector('.gallery-filter');
        const filterBtns = filterBar ? filterBar.querySelectorAll('.filter__btn') : [];

        filterBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {

            /* Update active class */
            filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');

            const filter = btn.dataset.filter || 'all';

            /* Show / hide items */
            const allItems = Array.from(gallery.querySelectorAll('.gallery__item'));
            allItems.forEach(function (item) {
              if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            });

            /* Rebuild visible list for lightbox navigation */
            buildVisibleList(filter);
          });
        });

        /* Shuffle gallery items on load */
        const allItems = Array.from(gallery.querySelectorAll('.gallery__item'));
        for (let i = allItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = allItems[i];
          allItems[i] = allItems[j];
          allItems[j] = temp;
        }
        allItems.forEach(item => gallery.appendChild(item));

        /* Initialize gallery list */
        buildVisibleList('all');
      }

      


      /* ─────────────────────────────────────────────────────────────
         CONTACT MODAL LOGIC
         ───────────────────────────────────────────────────────────── */
      const contactModal = document.getElementById('js-contact-modal');
      const modalBackdrop = document.getElementById('js-modal-backdrop');
      const modalClose = document.getElementById('js-modal-close');
      const contactTriggers = document.querySelectorAll('.js-contact-trigger');

      if (contactModal) {
        function openContactModal(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          contactModal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          if (modalClose) modalClose.focus();
        }

        function closeContactModal() {
          contactModal.classList.remove('is-open');
          document.body.style.overflow = '';
        }

        contactTriggers.forEach(function (trigger) {
          trigger.addEventListener('click', openContactModal);
        });

        if (modalClose) modalClose.addEventListener('click', closeContactModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeContactModal);

        /* Close modal on Escape key */
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && contactModal.classList.contains('is-open')) {
            closeContactModal();
          }
        });
      }

      /* ─────────────────────────────────────────────────────────────
         CONTACT FORM — client-side validation
         ─────────────────────────────────────────────────────────────
         This form validates on the client side only. To actually send
         messages you need a backend service such as:
           • Formspree  — set action="https://formspree.io/f/YOUR_ID"
           • Netlify Forms — add data-netlify="true" to the <form>
           • EmailJS   — call emailjs.sendForm() in the submit handler
         ───────────────────────────────────────────────────────────── */
      var form       = document.getElementById('js-contact-form');
      var submitBtn  = document.getElementById('js-submit-btn');
      var successMsg = document.getElementById('js-success');
      var errorMsg   = document.getElementById('js-error');

      if (form) {
        /* Helper: validate a single field */
        function validateField (input, errorEl) {
          var valid = input.validity.valid;
          if (!valid) {
            input.classList.add('is-invalid');
            errorEl.classList.add('is-visible');
          } else {
            input.classList.remove('is-invalid');
            errorEl.classList.remove('is-visible');
          }
          return valid;
        }

        /* Live validation on blur */
        var nameInput    = document.getElementById('field-name');
        var emailInput   = document.getElementById('field-email');
        var messageInput = document.getElementById('field-message');

        if (nameInput) nameInput.addEventListener   ('blur', function () { validateField(nameInput,    document.getElementById('err-name'));    });
        if (emailInput) emailInput.addEventListener  ('blur', function () { validateField(emailInput,   document.getElementById('err-email'));   });
        if (messageInput) messageInput.addEventListener('blur', function () { validateField(messageInput, document.getElementById('err-message')); });

        /* Clear errors on input after they've been shown */
        [nameInput, emailInput, messageInput].forEach(function (el) {
          if (el) {
            el.addEventListener('input', function () {
              if (el.classList.contains('is-invalid') && el.validity.valid) {
                el.classList.remove('is-invalid');
                var errId = 'err-' + el.id.replace('field-', '');
                var errEl = document.getElementById(errId);
                if (errEl) errEl.classList.remove('is-visible');
              }
            });
          }
        });

        /* Submit handler */
        form.addEventListener('submit', function (e) {
          e.preventDefault();

          /* Validate all required fields */
          var n = validateField(nameInput,    document.getElementById('err-name'));
          var em = validateField(emailInput,  document.getElementById('err-email'));
          var m = validateField(messageInput, document.getElementById('err-message'));

          if (!n || !em || !m) return;

          /* Simulate a successful send for the template demo */
          if (submitBtn) {
            submitBtn.disabled     = true;
            submitBtn.textContent  = 'Sending…';
          }
          if (successMsg) successMsg.style.display = 'none';
          if (errorMsg) errorMsg.style.display   = 'none';

          setTimeout(function () {
            if (submitBtn) {
              submitBtn.disabled    = false;
              submitBtn.textContent = 'Send message';
            }
            if (successMsg) {
              successMsg.classList.add('is-success');
              successMsg.style.display = '';
            }
            form.reset();
          }, 1200);
        });
      }


      /* ─────────────────────────────────────────────────────────────
         STATS ANIMATION (scroll-triggered & count-up)
         ───────────────────────────────────────────────────────────── */
      const statsSection = document.querySelector('.about-stats');
      const statNumbers  = document.querySelectorAll('.about-stat__number');

      if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Add visibility class for CSS staggered animations
              statsSection.classList.add('is-visible');
              
              // Run count-up animation for each number
              statNumbers.forEach(statEl => {
                animateCountUp(statEl);
              });
              
              // Unobserve after firing once
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15
        });

        statsObserver.observe(statsSection);

        // Helper to animate stats count-up
        function animateCountUp(el) {
          const rawText = el.textContent.trim();
          const match = rawText.match(/^([^\d]*?)(\d+)([^\d]*)$/);
          if (!match) return;

          const prefix = match[1] || '';
          const targetVal = parseInt(match[2], 10);
          const suffix = match[3] || '';

          const duration = 1500; // 1.5s
          let startTime = null;
          const easeOutQuad = t => t * (2 - t);

          function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = easeOutQuad(progress);
            const currentVal = Math.floor(easedProgress * targetVal);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = rawText;
            }
          }

          el.textContent = `${prefix}0${suffix}`;
          requestAnimationFrame(updateCounter);
        }
      }

    /* ─────────────────────────────────────────────────────────────
       SPLASH SCREEN & PARTICLES
       ───────────────────────────────────────────────────────────── */
    const splashScreen = document.getElementById('js-splash-screen');
    const splashBtn    = document.getElementById('js-splash-btn');
    const canvas       = document.getElementById('js-splash-canvas');

    if (splashScreen && splashBtn) {
      if (sessionStorage.getItem('splashDismissed') === 'true') {
        splashScreen.style.display = 'none';
      } else {
        // Initialize particle system if canvas exists
        if (canvas) {
          const ctx = canvas.getContext('2d');
          let animationFrameId = null;
          let particles = [];

          function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
          }

          function initParticles() {
            const width = canvas.width;
            const height = canvas.height;
            // Responsive count based on window dimensions to keep performance high
            const particleCount = Math.min(100, Math.floor((width * height) / 15000));
            particles = [];

            for (let i = 0; i < particleCount; i++) {
              const isRed = Math.random() < 0.08; // 8% brand-red (#fc2222) particles
              const redColor = '252, 34, 34';
              const whiteColor = '255, 255, 255';
              
              particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.5 + Math.random() * 2, // sizes 0.5px to 2.5px
                vx: (Math.random() - 0.5) * 0.3, // slow float
                vy: (Math.random() - 0.5) * 0.3,
                baseColor: isRed ? redColor : whiteColor,
                alpha: 0.15 + Math.random() * 0.65 // opacities 0.15 to 0.8
              });
            }
          }

          function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const len = particles.length;
            for (let i = 0; i < len; i++) {
              const p = particles[i];
              
              // Move particle
              p.x += p.vx;
              p.y += p.vy;

              // Boundary check (wrap around)
              if (p.x < 0) p.x = canvas.width;
              if (p.x > canvas.width) p.x = 0;
              if (p.y < 0) p.y = canvas.height;
              if (p.y > canvas.height) p.y = 0;

              // Draw
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${p.baseColor}, ${p.alpha})`;
              ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
          }

          // Initial setup
          window.addEventListener('resize', resizeCanvas);
          resizeCanvas();
          animate();

          // Cleanup event listener and cancel loop on click
          splashBtn.addEventListener('click', function () {
            splashScreen.classList.add('is-hidden');
            sessionStorage.setItem('splashDismissed', 'true');
            
            // Clean up resize listener immediately
            window.removeEventListener('resize', resizeCanvas);

            // Wait for transition to complete, then cancel animation and hide display
            splashScreen.addEventListener('transitionend', function onTransitionEnd(e) {
              if (e.propertyName === 'opacity') {
                splashScreen.style.display = 'none';
                cancelAnimationFrame(animationFrameId);
                splashScreen.removeEventListener('transitionend', onTransitionEnd);
              }
            });
          });
        } else {
          // Fallback click listener if canvas is missing
        splashBtn.addEventListener('click', function () {
          splashScreen.classList.add('is-hidden');
          sessionStorage.setItem('splashDismissed', 'true');
        });
      }
    }
  }

    /* ─────────────────────────────────────────────────────────────
       NAVBAR TRANSPARENT TO SOLID SCROLL EFFECT
       ───────────────────────────────────────────────────────────── */
    var siteNav = document.querySelector('.site-nav');
    if (siteNav) {
      var handleScroll = function () {
        if (window.scrollY > 50) {
          siteNav.classList.add('site-nav--scrolled');
        } else {
          siteNav.classList.remove('site-nav--scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    /* ─────────────────────────────────────────────────────────────
       TIMELINE SCROLL NAVIGATION
       ───────────────────────────────────────────────────────────── */
    var timelineWrapper = document.getElementById('js-timeline-wrapper');
    var timelinePrev = document.getElementById('js-timeline-prev');
    var timelineNext = document.getElementById('js-timeline-next');

    if (timelineWrapper && timelinePrev && timelineNext) {
      timelinePrev.addEventListener('click', function () {
        timelineWrapper.scrollBy({ left: -340, behavior: 'smooth' });
      });
      timelineNext.addEventListener('click', function () {
        timelineWrapper.scrollBy({ left: 340, behavior: 'smooth' });
      });

      var updateNavButtons = function () {
        var scrollLeft = timelineWrapper.scrollLeft;
        var maxScrollLeft = timelineWrapper.scrollWidth - timelineWrapper.clientWidth;
        
        timelinePrev.style.opacity = scrollLeft <= 10 ? '0.3' : '1';
        timelinePrev.style.pointerEvents = scrollLeft <= 10 ? 'none' : 'all';

        timelineNext.style.opacity = scrollLeft >= maxScrollLeft - 10 ? '0.3' : '1';
        timelineNext.style.pointerEvents = scrollLeft >= maxScrollLeft - 10 ? 'none' : 'all';
      };

      timelineWrapper.addEventListener('scroll', updateNavButtons);
      
      var detailsElement = timelineWrapper.closest('details');
      if (detailsElement) {
        detailsElement.addEventListener('toggle', function() {
          if (detailsElement.open) {
            setTimeout(updateNavButtons, 50);
          }
        });
      }
      // Initialize state
      setTimeout(updateNavButtons, 100);
    }

  })();