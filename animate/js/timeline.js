/**
 * ALICARI Animate Edition - 20-Year Multimedia Timeline
 * Interactive progression tracking two decades of multimedia, UX/UI, branding & engineering.
 */

import { sound } from './sound-engine.js';

export const TIMELINE_ERAS = [
  {
    year: "2004 — 2008",
    title: "La Era de Oro del Multimedia & Flash",
    tagline: "ActionScript, Video Interactivo & Experimentación Pura",
    description: "Inicios en el diseño interactivo cuando no existían librerías prefabricadas. Animación frame a frame, interfaces cibernéticas, CD-ROMs interactivos, compresión de video pionera y dirección de arte sin ataduras comerciales.",
    skills: ["Macromedia Flash", "ActionScript 2.0/3.0", "After Effects", "Dirección de Arte", "Edición No Lineal"]
  },
  {
    year: "2009 — 2015",
    title: "Revolución Responsive & Identidad Transmedia",
    tagline: "Transición a Estándares Web, Branding & Mobile First",
    description: "Migración hacia HTML5, CSS3 semántico y la ruptura del viewport rígido. Expansión a sistemas de identidad corporativa, fotografía escénica/de producto, campañas de marketing y piezas de alta resolución para vía pública (DOOH).",
    skills: ["HTML5 / CSS3", "Branding & Manuales", "Fotografía Editorial", "Marketing Visual", "Grid Systems"]
  },
  {
    year: "2016 — 2021",
    title: "Madurez de Producto, UX Research & Design Systems",
    tagline: "Psicología de Usuario, Atomic Design & Prototipado Avanzado",
    description: "Evolución hacia la arquitectura de información rigurosa, entrevistas de usuario, pruebas de usabilidad y sistemas de diseño unificados en Figma. Soluciones de productos digitales y comercio electrónico de alto impacto.",
    skills: ["UX Research", "Figma Design Systems", "Arquitectura de Información", "Prototipado Interactivo", "UI Kits"]
  },
  {
    year: "2022 — 2026+",
    title: "Ecosistemas Cinéticos & Front-End de Próxima Generación",
    tagline: "Kinetic UI, WebGL, Audio Háptico & Rendimiento Extremo",
    description: "La culminación de 20 años de oficio: interfaces vivas que respiran mediante curvas de aceleración física, Web Audio procedimental, reactividad instantánea a 60fps y código limpio que honra la visión estética original.",
    skills: ["Kinetic Motion Systems", "Three.js / WebGL", "Modern JavaScript", "Web Audio API", "High-End UX"]
  }
];

export class TimelineController {
  constructor() {
    this.container = document.getElementById('timeline-interactive');
    this.activeIndex = 0;
    if (!this.container) return;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="timeline-nav">
        ${TIMELINE_ERAS.map((era, i) => `
          <button class="timeline-nav__pill ${i === this.activeIndex ? 'is-active' : ''}" data-era-index="${i}">
            <span class="timeline-nav__dot"></span>
            <span class="timeline-nav__year">${era.year}</span>
          </button>
        `).join('')}
      </div>

      <div class="timeline-stage" id="timeline-stage">
        ${this.renderEraCard(TIMELINE_ERAS[this.activeIndex])}
      </div>
    `;
  }

  renderEraCard(era) {
    return `
      <div class="era-card" id="era-card-content">
        <div class="era-card__header">
          <span class="era-card__badge">${era.year}</span>
          <span class="era-card__tagline">${era.tagline}</span>
        </div>
        <h3 class="era-card__title">${era.title}</h3>
        <p class="era-card__text">${era.description}</p>
        <div class="era-card__skills">
          ${era.skills.map(s => `<span class="era-skill-chip">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-era-index]');
      if (!btn) return;

      const idx = parseInt(btn.getAttribute('data-era-index'), 10);
      if (idx === this.activeIndex) return;

      this.setActiveEra(idx);
    });
  }

  setActiveEra(idx) {
    this.activeIndex = idx;
    sound.playWhoosh();

    // Update active pill
    const pills = this.container.querySelectorAll('.timeline-nav__pill');
    pills.forEach((p, i) => {
      p.classList.toggle('is-active', i === idx);
    });

    const stage = document.getElementById('timeline-stage');
    if (!stage) return;

    // Anime.js transition
    if (window.anime) {
      window.anime({
        targets: '#era-card-content',
        opacity: [1, 0],
        translateY: [0, -15],
        duration: 220,
        easing: 'easeInQuad',
        complete: () => {
          stage.innerHTML = this.renderEraCard(TIMELINE_ERAS[idx]);
          window.anime({
            targets: '#era-card-content',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 480,
            easing: 'easeOutQuart'
          });
        }
      });
    } else {
      stage.innerHTML = this.renderEraCard(TIMELINE_ERAS[idx]);
    }
  }
}
