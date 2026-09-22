/**
 * ALICARI 2027 - Main Application Orchestrator
 * Coordinates design modules, scroll observer, navigation spies, and animated metrics.
 */

import { initHeroBackground } from './background-hero.js';
import { initGallery } from './gallery.js';
import { initLightbox } from './lightbox.js';
import { initTimeline } from './timeline.js';
import { initContact } from './contact.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Subsystems
  initHeroBackground();
  initGallery();
  initLightbox();
  initTimeline();
  initContact();

  // 2. Navigation Scroll Effect
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

  // 3. Navigation Spy
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
  }, { threshold: 0.3 });

  sections.forEach(s => navObserver.observe(s));

  // 4. Scroll Reveal Animations
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

  // 5. Animated Number Counters
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
      const duration = 1600;
      const stepTime = 20;
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
