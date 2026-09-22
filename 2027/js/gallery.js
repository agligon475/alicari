/**
 * ALICARI 2027 - Dynamic Gallery & Category Filter
 * Renders portfolio cards, handles smooth filter transitions, 3D tilt effects, and preview triggers.
 */

import { PROJECTS_DATA } from './projects-data.js';
import { openLightbox } from './lightbox.js';

export function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  let currentCategory = 'all';

  // Compute category counts
  function updateCounts() {
    const counts = {
      all: PROJECTS_DATA.length,
      uxui: 0,
      webdesign: 0,
      branding: 0,
      multimedia: 0,
      fotografia: 0,
      marketing: 0
    };

    PROJECTS_DATA.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    filterBtns.forEach(btn => {
      const cat = btn.dataset.filter;
      const countSpan = btn.querySelector('.filter-btn__count');
      if (countSpan && counts[cat] !== undefined) {
        countSpan.textContent = counts[cat];
      }
    });
  }

  // Render cards
  function renderProjects(filter = 'all') {
    const filtered = filter === 'all' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    grid.innerHTML = filtered.map((project, idx) => `
      <article class="project-card reveal-on-scroll is-revealed" data-id="${project.id}" data-category="${project.category}">
        <div class="project-card__media-wrap">
          <span class="project-card__badge">${project.categoryName}</span>
          <img 
            src="${project.thumbUrl}" 
            alt="${project.title}" 
            class="project-card__img" 
            loading="lazy"
          />
          <div class="project-card__overlay"></div>
          
          <div class="project-card__actions-overlay">
            <button class="card-action-btn js-preview-trigger" data-id="${project.id}" aria-label="Vista previa de ${project.title}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
            <a href="${project.behanceUrl}" target="_blank" rel="noopener noreferrer" class="card-action-btn" aria-label="Ver en Behance">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="project-card__content">
          <span class="project-card__meta">${project.meta}</span>
          <h3 class="project-card__title">${project.title}</h3>
        </div>
      </article>
    `).join('');

    attachCardInteractions();
  }

  // 3D Card Tilt Interaction
  function attachCardInteractions() {
    const cards = grid.querySelectorAll('.project-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });

      // Quick preview click
      const previewBtn = card.querySelector('.js-preview-trigger');
      if (previewBtn) {
        previewBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = parseInt(previewBtn.dataset.id, 10);
          openLightbox(id);
        });
      }
    });
  }

  // Filter button handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (filter === currentCategory) return;

      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      currentCategory = filter;
      renderProjects(filter);
    });
  });

  updateCounts();
  renderProjects('all');
}
