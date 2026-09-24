/**
 * ALICARI WALLPAPER - PARALLAX & TILT ENGINE
 * Ultra-smooth Lerped 3D cursor tilt & depth effect
 */

class ParallaxEngine {
  constructor(targetSelector = '.parallax-layer') {
    this.targets = document.querySelectorAll(targetSelector);
    if (!this.targets.length) return;

    this.mouse = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.bounds = { width: window.innerWidth, height: window.innerHeight };
    this.ease = 0.06; // Suavidad de interpolación
    this.isActive = true;

    this.init();
  }

  init() {
    window.addEventListener('resize', () => {
      this.bounds.width = window.innerWidth;
      this.bounds.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      // Normalizar coordenadas entre -1 y 1
      this.mouse.x = (e.clientX / this.bounds.width - 0.5) * 2;
      this.mouse.y = (e.clientY / this.bounds.height - 0.5) * 2;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = 0;
      this.mouse.y = 0;
    });

    this.render();
  }

  render() {
    if (!this.isActive) return;

    // Linear interpolation
    this.current.x += (this.mouse.x - this.current.x) * this.ease;
    this.current.y += (this.mouse.y - this.current.y) * this.ease;

    this.targets.forEach((el) => {
      const depth = parseFloat(el.getAttribute('data-depth') || '20');
      const rotate = parseFloat(el.getAttribute('data-rotate') || '8');
      
      const moveX = this.current.x * depth;
      const moveY = this.current.y * depth;
      const rotY = this.current.x * rotate;
      const rotX = -this.current.y * rotate;

      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    requestAnimationFrame(() => this.render());
  }
}
