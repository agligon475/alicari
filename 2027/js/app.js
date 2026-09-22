/**
 * ALICARI 2027 - Main Application Master Coordinator
 * Connects 3D WebGL GLSL hills, splash portal, audio feedback, cursor, and interactive journeys.
 */

import { initSplash } from './splash.js';
import { initGLSLHills } from './glsl-hills-canvas.js';
import { initGallery } from './gallery.js';
import { initLightbox } from './lightbox.js';
import { initTimeline } from './timeline.js';
import { initContact } from './contact.js';
import { initCustomCursor } from './cursor.js';
import { sound } from './sound-fx.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Subsystems
  initSplash();
  initGLSLHills('glsl-hills-canvas');
  initGallery();
  initLightbox();
  initTimeline();
  initContact();
  initCustomCursor();

  // 2. Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    const updateIcon = (active) => {
      soundToggleBtn.innerHTML = active 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      soundToggleBtn.title = active ? 'Silenciar audio' : 'Activar audio interactivo';
    };

    updateIcon(sound.enabled);

    soundToggleBtn.addEventListener('click', () => {
      const active = sound.toggle();
      updateIcon(active);
    });
  }

  // 3. Navigation Scroll Effect
  const nav = document.getElementById('site-nav');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Hamburger Toggle
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. Navigation Spy
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(s => navObserver.observe(s));

  // 5. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Animated Number Counters
  const statNumbers = document.querySelectorAll('.stat-item__number');
  let statsCounted = false;

  const statsSection = document.getElementById('metricas');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
      }
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target, 10);
      const prefix = stat.dataset.prefix || '';
      const suffix = stat.dataset.suffix || '';
      const duration = 1800;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.innerHTML = `${prefix}${Math.floor(current)}${suffix}`;
      }, stepTime);
    });
  }
});
