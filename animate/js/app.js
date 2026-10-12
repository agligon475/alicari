/**
 * ALICARI Animate Edition - Main Application Orchestrator
 * Agustin Licari — 20 Años en Diseño Multimedia, UX/UI & Front-End
 */

import { PROJECTS_DATA, CATEGORIES } from './projects-data.js';
import { sound } from './sound-engine.js';
import { KineticCursor } from './cursor.js';
import { AnimationManager } from './animations.js';
import { KineticMesh } from './kinetic-mesh.js';
import { TimelineController } from './timeline.js';

class AlicariAnimateApp {
  constructor() {
    this.anim = new AnimationManager();
    this.cursor = null;
    this.mesh = null;
    this.timeline = null;

    this.currentCategory = 'all';
    this.activeProjectId = null;

    this.init();
  }

  init() {
    // 1. Initialize Canvas Mesh & Cursor
    this.mesh = new KineticMesh('kinetic-mesh-canvas');
    this.cursor = new KineticCursor();

    // 2. Render Components
    this.renderFilterBar();
    this.renderGalleryGrid();
    this.timeline = new TimelineController();

    // 3. Bind UI Events
    this.bindGlobalEvents();
    this.bindLightboxEvents();
    this.bindContactEvents();
    this.bindAudioToggle();

    // 4. Run Preloader sequence
    this.anim.playPreloader(() => {
      document.body.classList.remove('is-loading');
      this.anim.playHeroEntrance();
    });
  }

  // Render Category Filter Chips
  renderFilterBar() {
    const filterContainer = document.getElementById('gallery-filters');
    if (!filterContainer) return;

    filterContainer.innerHTML = CATEGORIES.map((cat, i) => `
      <button 
        class="filter-chip ${i === 0 ? 'is-active' : ''}" 
        data-category="${cat.id}"
        data-magnetic
      >
        <span class="filter-chip__text">${cat.label}</span>
      </button>
    `).join('');

    filterContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-category]');
      if (!chip) return;

      const catId = chip.getAttribute('data-category');
      if (catId === this.currentCategory) return;

      sound.playWhoosh();
      this.setCategory(catId, chip);
    });
  }

  // Filter projects by category with Anime.js physics
  setCategory(catId, activeChip) {
    this.currentCategory = catId;

    // Update active chip state
    const allChips = document.querySelectorAll('.filter-chip');
    allChips.forEach(c => c.classList.remove('is-active'));
    activeChip.classList.add('is-active');

    const allCards = Array.from(document.querySelectorAll('.project-card'));
    const hiddenItems = [];
    const visibleItems = [];

    allCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (catId === 'all' || cardCat === catId) {
        visibleItems.push(card);
      } else {
        hiddenItems.push(card);
      }
    });

    this.anim.animateGalleryFilter(hiddenItems, visibleItems, () => {
      // Re-trigger layout adjustments if needed
    });
  }

  // Render all 27 projects in high-performance grid
  renderGalleryGrid() {
    const galleryEl = document.getElementById('projects-grid');
    if (!galleryEl) return;

    galleryEl.innerHTML = PROJECTS_DATA.map(p => `
      <article 
        class="project-card" 
        data-id="${p.id}" 
        data-category="${p.category}"
        data-cursor="VER CASO"
      >
        <div class="project-card__media-wrap">
          <img 
            src="${p.thumbUrl}" 
            alt="${p.title}" 
            class="project-card__image" 
            loading="lazy" 
          />
          <div class="project-card__overlay">
            <span class="project-card__badge">${p.categoryLabel}</span>
            <div class="project-card__action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="project-card__info">
          <div class="project-card__meta">
            <span class="project-card__year">${p.year}</span>
            <span class="project-card__dot"></span>
            <span class="project-card__role">${p.role}</span>
          </div>
          <h3 class="project-card__title">${p.title}</h3>
        </div>
      </article>
    `).join('');

    // Attach card click handlers for Lightbox
    galleryEl.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;

      const id = parseInt(card.getAttribute('data-id'), 10);
      this.openProjectDetails(id);
    });

    // Card hover animations
    galleryEl.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => this.anim.animateCardHover(card, true));
      card.addEventListener('mouseleave', () => this.anim.animateCardHover(card, false));
    });
  }

  // Open Lightbox for project preview
  openProjectDetails(id) {
    const project = PROJECTS_DATA.find(p => p.id === id);
    if (!project) return;

    this.activeProjectId = id;
    sound.playChime();

    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lb-image');
    const title = document.getElementById('lb-title');
    const category = document.getElementById('lb-category');
    const role = document.getElementById('lb-role');
    const year = document.getElementById('lb-year');
    const desc = document.getElementById('lb-desc');
    const behanceBtn = document.getElementById('lb-behance-btn');
    const counter = document.getElementById('lb-counter');

    // Populate metadata
    img.src = project.fullUrl;
    img.alt = project.title;
    title.textContent = project.title;
    category.textContent = project.categoryLabel;
    role.textContent = project.role;
    year.textContent = project.year;
    desc.textContent = project.description;
    behanceBtn.href = project.behanceUrl;

    const currentIdx = PROJECTS_DATA.findIndex(p => p.id === id) + 1;
    counter.textContent = `${currentIdx.toString().padStart(2, '0')} / ${PROJECTS_DATA.length.toString().padStart(2, '0')}`;

    this.anim.openLightbox(modal);
  }

  // Lightbox Controls
  bindLightboxEvents() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('lb-close');
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    const backdrop = modal.querySelector('.lightbox-backdrop');

    const handleClose = () => {
      sound.playPop();
      this.anim.closeLightbox(modal);
    };

    closeBtn?.addEventListener('click', handleClose);
    backdrop?.addEventListener('click', handleClose);

    const stepProject = (direction) => {
      if (!this.activeProjectId) return;
      const currentIdx = PROJECTS_DATA.findIndex(p => p.id === this.activeProjectId);
      let nextIdx = currentIdx + direction;
      if (nextIdx < 0) nextIdx = PROJECTS_DATA.length - 1;
      if (nextIdx >= PROJECTS_DATA.length) nextIdx = 0;

      sound.playWhoosh();
      this.openProjectDetails(PROJECTS_DATA[nextIdx].id);
    };

    prevBtn?.addEventListener('click', () => stepProject(-1));
    nextBtn?.addEventListener('click', () => stepProject(1));

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-active')) return;

      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') stepProject(-1);
      if (e.key === 'ArrowRight') stepProject(1);
    });
  }

  // Contact Drawer Modal
  bindContactEvents() {
    const modal = document.getElementById('contact-modal');
    const triggers = document.querySelectorAll('.js-contact-trigger');
    const closeBtn = document.getElementById('contact-close');
    const backdrop = modal?.querySelector('.contact-modal__backdrop');
    const form = document.getElementById('kinetic-contact-form');
    const successMsg = document.getElementById('form-success-msg');

    const handleOpen = (e) => {
      if (e) e.preventDefault();
      sound.playChime();
      this.anim.openContactModal(modal);
    };

    const handleClose = () => {
      sound.playPop();
      this.anim.closeContactModal(modal);
    };

    triggers.forEach(t => t.addEventListener('click', handleOpen));
    closeBtn?.addEventListener('click', handleClose);
    backdrop?.addEventListener('click', handleClose);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const msgInput = form.querySelector('[name="message"]');

        let valid = true;

        if (!nameInput.value.trim()) {
          this.anim.shakeElement(nameInput.parentElement);
          valid = false;
        }

        if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
          this.anim.shakeElement(emailInput.parentElement);
          valid = false;
        }

        if (!msgInput.value.trim()) {
          this.anim.shakeElement(msgInput.parentElement);
          valid = false;
        }

        if (valid) {
          sound.playChime();
          const submitBtn = form.querySelector('.btn-submit');
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';

          setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            submitBtn.textContent = 'Enviado con éxito';
          }, 800);
        } else {
          sound.playPop();
        }
      });
    }
  }

  // Audio Toggle Switch
  bindAudioToggle() {
    const toggleBtn = document.getElementById('audio-toggle-btn');
    if (!toggleBtn) return;

    const updateLabel = () => {
      const isMuted = sound.isMuted();
      toggleBtn.classList.toggle('is-muted', isMuted);
      toggleBtn.setAttribute('aria-label', isMuted ? 'Activar sonido' : 'Silenciar sonido');
      const text = toggleBtn.querySelector('.audio-toggle__text');
      if (text) {
        text.textContent = isMuted ? 'MUTE' : 'AUDIO ON';
      }
    };

    updateLabel();

    toggleBtn.addEventListener('click', () => {
      sound.toggleMute();
      updateLabel();
    });
  }

  // Global Navigation & Scroll Events
  bindGlobalEvents() {
    const navbar = document.getElementById('site-nav');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu-drawer');

    // Sticky nav backdrop blur on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('is-scrolled');
      } else {
        navbar?.classList.remove('is-scrolled');
      }
    }, { passive: true });

    // Mobile Hamburger
    mobileToggle?.addEventListener('click', () => {
      sound.playClick();
      mobileMenu?.classList.toggle('is-open');
    });

    mobileMenu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
      });
    });

    // Sound clicks on all primary buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, .btn, .nav-link')) {
        sound.playClick();
      }
    });
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.alicariApp = new AlicariAnimateApp();
});
