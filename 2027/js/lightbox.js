/**
 * ALICARI 2027 - Fullscreen Lightbox Viewer
 * Interactive lightbox with keyboard controls, image preloading, and smooth transitions.
 */

import { PROJECTS_DATA } from './projects-data.js';

let currentIndex = 0;
let lightboxEl = null;
let imgEl = null;
let titleEl = null;
let metaEl = null;
let counterEl = null;

export function initLightbox() {
  lightboxEl = document.getElementById('lightbox');
  if (!lightboxEl) return;

  imgEl = document.getElementById('lightbox-img');
  titleEl = document.getElementById('lightbox-title');
  metaEl = document.getElementById('lightbox-meta');
  counterEl = document.getElementById('lightbox-counter');

  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Click backdrop to close
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl || e.target.classList.contains('lightbox__stage')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('is-open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
}

export function openLightbox(projectId) {
  if (!lightboxEl) initLightbox();

  const index = PROJECTS_DATA.findIndex(p => p.id === projectId);
  if (index === -1) return;

  currentIndex = index;
  updateLightboxContent();
  lightboxEl.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.remove('is-open');
  document.body.style.overflow = '';
}

function prevImage() {
  currentIndex = (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
  updateLightboxContent();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % PROJECTS_DATA.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const project = PROJECTS_DATA[currentIndex];
  if (!project) return;

  imgEl.style.opacity = '0';
  imgEl.style.transform = 'scale(0.96)';

  setTimeout(() => {
    imgEl.src = project.fullUrl;
    imgEl.alt = project.title;
    titleEl.textContent = project.title;
    metaEl.textContent = `${project.meta} · ${project.description}`;
    counterEl.textContent = `${currentIndex + 1} / ${PROJECTS_DATA.length}`;

    imgEl.onload = () => {
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1)';
    };
  }, 120);

  // Preload adjacent images
  const nextIdx = (currentIndex + 1) % PROJECTS_DATA.length;
  const prevIdx = (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
  new Image().src = PROJECTS_DATA[nextIdx].fullUrl;
  new Image().src = PROJECTS_DATA[prevIdx].fullUrl;
}
