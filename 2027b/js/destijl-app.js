/**
 * ALICARI 2027b - De Stijl Application Controller
 * Handles interactive grid rendering, orthogonal filtering, modals, audio fx and navigation.
 */

import { PROJECTS_DATA } from './projects-data.js';
import { sound } from './sound-fx.js';

class DeStijlApp {
  constructor() {
    this.projects = PROJECTS_DATA;
    this.currentFilter = 'all';
    this.modal = null;
    this.gridContainer = null;
    
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.gridContainer = document.getElementById('portfolio-grid');
      this.modal = document.getElementById('project-modal');

      this.renderProjects(this.projects);
      this.setupFilters();
      this.setupSoundToggle();
      this.setupNavigation();
      this.setupInteractiveMatrix();
      this.setupModal();
      this.setupContactForm();
      this.setupScrollObserver();
    });
  }

  /* ── 1. Render Portfolio Cards ────────────────────────────────────────── */
  renderProjects(projects) {
    if (!this.gridContainer) return;

    this.gridContainer.innerHTML = '';

    projects.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'destijl-card';
      card.dataset.category = item.category;

      const indexStr = String(index + 1).padStart(2, '0');

      card.innerHTML = `
        <div class="card-media-wrap">
          <span class="card-index-tag">${indexStr}</span>
          <span class="card-category-badge">${item.categoryName}</span>
          <img src="${item.thumbUrl}" alt="${item.title}" class="card-img" loading="lazy" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.description}</p>
          <div class="card-footer-actions">
            <button class="card-action-btn js-open-modal" data-id="${item.id}">
              <span>Explorar</span>
              <span>+</span>
            </button>
            <a href="${item.behanceUrl}" target="_blank" rel="noopener noreferrer" class="card-action-btn btn-behance">
              <span>Behance</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      `;

      // Event listener for opening modal
      const openBtn = card.querySelector('.js-open-modal');
      const img = card.querySelector('.card-img');

      const openHandler = () => {
        sound.playOpen();
        this.openModal(item);
      };

      openBtn.addEventListener('click', openHandler);
      img.addEventListener('click', openHandler);

      this.gridContainer.appendChild(card);
    });
  }

  /* ── 2. Category Filter Tabs ──────────────────────────────────────────── */
  setupFilters() {
    const filterButtons = document.querySelectorAll('.js-filter-btn');

    // Update filter counts dynamically
    const counts = {
      all: this.projects.length,
      uxui: this.projects.filter(p => p.category === 'uxui').length,
      branding: this.projects.filter(p => p.category === 'branding').length,
      multimedia: this.projects.filter(p => p.category === 'multimedia').length,
      editorial: this.projects.filter(p => p.category === 'editorial').length,
    };

    filterButtons.forEach(btn => {
      const cat = btn.dataset.filter;
      const countEl = btn.querySelector('.filter-count');
      if (countEl && counts[cat] !== undefined) {
        countEl.textContent = counts[cat];
      }

      btn.addEventListener('click', () => {
        sound.playSelect();

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentFilter = cat;

        const filtered = cat === 'all'
          ? this.projects
          : this.projects.filter(p => p.category === cat);

        this.renderProjects(filtered);
      });
    });
  }

  /* ── 3. Interactive De Stijl Matrix in Hero ────────────────────────────── */
  setupInteractiveMatrix() {
    const cells = document.querySelectorAll('.js-matrix-cell');
    const colors = ['var(--destijl-white-surface)', 'var(--destijl-red)', 'var(--destijl-black)', 'var(--destijl-gray-faint)'];

    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        sound.playPop();
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        cell.style.background = randomColor;
      });

      cell.addEventListener('mouseenter', () => {
        sound.playTick(900, 0.02);
      });
    });
  }

  /* ── 4. Project Lightbox Modal ────────────────────────────────────────── */
  setupModal() {
    if (!this.modal) return;

    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('project-modal');

    const closeModal = () => {
      sound.playClose();
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  openModal(project) {
    if (!this.modal) return;

    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalImg = document.getElementById('modal-img');
    const modalDesc = document.getElementById('modal-desc');
    const modalBehance = document.getElementById('modal-behance');

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalCategory) modalCategory.textContent = project.categoryName;
    if (modalImg) {
      modalImg.src = project.fullUrl || project.thumbUrl;
      modalImg.alt = project.title;
    }
    if (modalDesc) modalDesc.textContent = project.description;
    if (modalBehance) modalBehance.href = project.behanceUrl;

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* ── 5. Sound Engine Toggle ───────────────────────────────────────────── */
  setupSoundToggle() {
    const soundBtn = document.getElementById('sound-toggle');
    const soundStatus = document.getElementById('sound-status');

    const updateState = (isEnabled) => {
      if (soundBtn) {
        soundBtn.classList.toggle('sound-on', isEnabled);
      }
      if (soundStatus) {
        soundStatus.textContent = isEnabled ? 'ON' : 'OFF';
      }
    };

    updateState(sound.enabled);

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const newState = sound.toggle();
        updateState(newState);
      });
    }
  }

  /* ── 6. Navigation & Mobile Drawer ────────────────────────────────────── */
  setupNavigation() {
    const hamburger = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const navBar = document.querySelector('.destijl-nav');

    // Scroll state for fixed navbar shadow
    window.addEventListener('scroll', () => {
      if (navBar) {
        navBar.classList.toggle('scrolled', window.scrollY > 30);
      }
    });

    if (hamburger && drawer) {
      hamburger.addEventListener('click', () => {
        sound.playSelect();
        drawer.classList.toggle('open');
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          drawer.classList.remove('open');
        });
      });
    }
  }

  /* ── 7. Contact Form Handler ──────────────────────────────────────────── */
  setupContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        sound.playTick(300, 0.08);
        if (statusMsg) {
          statusMsg.className = 'form-status error';
          statusMsg.textContent = 'Por favor completa todos los campos requeridos.';
        }
        return;
      }

      sound.playChime(660, 0.4, 'triangle');
      if (statusMsg) {
        statusMsg.className = 'form-status success';
        statusMsg.textContent = '¡Gracias por tu mensaje! Me pondré en contacto a la brevedad.';
      }

      form.reset();
    });
  }

  /* ── 8. Active Scroll Observer ────────────────────────────────────────── */
  setupScrollObserver() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.35
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

// Instantiate App
new DeStijlApp();
