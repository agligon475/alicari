/**
 * ALICARI WALLPAPER - PARALLAX & TILT ENGINE (OPTIMIZED)
 * Ultra-smooth Lerped 3D cursor tilt with idle sleep to save desktop CPU
 */

class ParallaxEngine {
  constructor(targetSelector = '.parallax-layer') {
    this.targets = document.querySelectorAll(targetSelector);
    if (!this.targets.length) return;

    this.mouse = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.bounds = { width: window.innerWidth, height: window.innerHeight };
    this.ease = 0.08; // Suavidad de interpolación
    this.isActive = true;
    this.isRendering = false;
    this.rafId = null;

    this.init();
  }

  init() {
    window.addEventListener('resize', () => {
      this.bounds.width = window.innerWidth;
      this.bounds.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      // Normalizar coordenadas entre -1 y 1
      this.mouse.x = (e.clientX / this.bounds.width - 0.5) * 2;
      this.mouse.y = (e.clientY / this.bounds.height - 0.5) * 2;
      this.startRender();
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = 0;
      this.mouse.y = 0;
      this.startRender();
    }, { passive: true });

    // Initial render pass
    this.startRender();
  }

  startRender() {
    if (!this.isRendering && this.isActive) {
      this.isRendering = true;
      this.render();
    }
  }

  render() {
    if (!this.isActive || !this.isRendering) return;

    // Linear interpolation
    const dx = this.mouse.x - this.current.x;
    const dy = this.mouse.y - this.current.y;

    this.current.x += dx * this.ease;
    this.current.y += dy * this.ease;

    const tLen = this.targets.length;
    for (let i = 0; i < tLen; i++) {
      const el = this.targets[i];
      const depth = parseFloat(el.getAttribute('data-depth') || '20');
      const rotate = parseFloat(el.getAttribute('data-rotate') || '8');
      
      const moveX = (this.current.x * depth).toFixed(2);
      const moveY = (this.current.y * depth).toFixed(2);
      const rotY = (this.current.x * rotate).toFixed(2);
      const rotX = (-this.current.y * rotate).toFixed(2);

      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    // Si la posición convergió con el mouse (inactivo), pausar el ciclo de renderizado para consumir 0% CPU
    if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) {
      this.current.x = this.mouse.x;
      this.current.y = this.mouse.y;
      this.isRendering = false;
      this.rafId = null;
      return;
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    this.isActive = false;
    this.isRendering = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

window.ParallaxEngine = ParallaxEngine;


