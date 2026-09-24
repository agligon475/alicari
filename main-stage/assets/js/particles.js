/**
 * ALICARI WALLPAPER ENGINE - PARTICLES ENGINE
 * Optimized Canvas 2D Particle System for 60fps Ambient Backgrounds
 */

class ParticleEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.options = Object.assign({
      particleCount: 65,
      maxDistance: 120,
      mouseRadius: 160,
      baseSpeed: 0.35,
      redRatio: 0.25, // 25% partículas rojas alicari
      accentColor: '246, 0, 0',
      whiteColor: '246, 246, 246'
    }, options);

    this.particles = [];
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false
    };

    this.animationFrameId = null;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(this.options.particleCount, Math.floor((this.width * this.height) / 18000));
    
    for (let i = 0; i < count; i++) {
      const isRed = Math.random() < this.options.redRatio;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.baseSpeed,
        vy: (Math.random() - 0.7) * this.options.baseSpeed, // ligere deriva hacia arriba
        radius: isRed ? (Math.random() * 2 + 1.2) : (Math.random() * 1.5 + 0.8),
        color: isRed ? this.options.accentColor : this.options.whiteColor,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI,
        isRed: isRed
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.isHovered = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
      this.mouse.isHovered = false;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Suavizado de posición del mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

    // Actualizar y dibujar partículas
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Movimiento
      p.x += p.vx;
      p.y += p.vy;

      // Pulsación sutil de brillo
      p.pulseVal += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.15;

      // Wrap around bordes
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      // Interacción suave con mouse (repulsión elástica)
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.options.mouseRadius && dist > 0) {
        const force = (1 - dist / this.options.mouseRadius) * 1.5;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      // Dibujar partícula
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.1, currentAlpha)})`;
      
      if (p.isRed) {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `rgba(${this.options.accentColor}, 0.8)`;
      } else {
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fill();

      // Líneas de conexión tenues
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const distX = p.x - p2.x;
        const distY = p.y - p2.y;
        const d = Math.sqrt(distX * distX + distY * distY);

        if (d < this.options.maxDistance) {
          const lineAlpha = (1 - d / this.options.maxDistance) * 0.12;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.shadowBlur = 0;
          this.ctx.strokeStyle = p.isRed || p2.isRed 
            ? `rgba(${this.options.accentColor}, ${lineAlpha * 1.5})` 
            : `rgba(246, 246, 246, ${lineAlpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
