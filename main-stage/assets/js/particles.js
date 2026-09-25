/**
 * ALICARI WALLPAPER ENGINE - PARTICLES ENGINE (OPTIMIZED)
 * High-performance, low-overhead Canvas 2D Particle System for Desktop & Web
 */

class ParticleEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    
    this.options = Object.assign({
      particleCount: 40,
      maxDistance: 110,
      mouseRadius: 140,
      baseSpeed: 0.3,
      redRatio: 0.25, // 25% partículas rojas alicari
      accentColor: '246, 0, 0',
      whiteColor: '246, 246, 246',
      targetFPS: 60
    }, options);

    this.particles = [];
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false
    };

    this.maxDistSq = this.options.maxDistance * this.options.maxDistance;
    this.mouseRadiusSq = this.options.mouseRadius * this.options.mouseRadius;
    this.animationFrameId = null;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.frameInterval = 1000 / this.options.targetFPS;

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
    // Dynamic cap based on screen resolution to prevent heavy loops on 4k/ultrawide
    const count = Math.min(this.options.particleCount, Math.floor((this.width * this.height) / 25000) + 15);
    
    for (let i = 0; i < count; i++) {
      const isRed = Math.random() < this.options.redRatio;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.baseSpeed,
        vy: (Math.random() - 0.65) * this.options.baseSpeed, // ligera deriva hacia arriba
        radius: isRed ? (Math.random() * 1.8 + 1.2) : (Math.random() * 1.2 + 0.8),
        color: isRed ? this.options.accentColor : this.options.whiteColor,
        alpha: Math.random() * 0.5 + 0.2,
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
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.isHovered = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
      this.mouse.isHovered = false;
    }, { passive: true });

    // Pausar renderizado cuando la ventana/pantalla esté oculta para ahorrar 100% de CPU/GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isRunning = false;
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      } else {
        if (!this.isRunning) {
          this.isRunning = true;
          this.lastFrameTime = performance.now();
          this.animate();
        }
      }
    });
  }

  animate(now = performance.now()) {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

    // Throttle frame rate if needed to save power on high-refresh-rate desktop displays
    const elapsed = now - this.lastFrameTime;
    if (elapsed < this.frameInterval - 1) return;
    this.lastFrameTime = now - (elapsed % this.frameInterval);

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Suavizado de posición del mouse
    if (this.mouse.isHovered) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;
    }

    const pLen = this.particles.length;

    // Actualizar y dibujar partículas
    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];

      // Movimiento
      p.x += p.vx;
      p.y += p.vy;

      // Pulsación sutil de brillo
      p.pulseVal += p.pulseSpeed;
      const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulseVal) * 0.12);

      // Wrap around bordes
      if (p.x < -10) p.x = this.width + 10;
      else if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      else if (p.y > this.height + 10) p.y = -10;

      // Interacción suave con mouse
      if (this.mouse.isHovered) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < this.mouseRadiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / this.options.mouseRadius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      // Dibujar partícula (sin shadowBlur pesado)
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
      this.ctx.fill();

      // Halo sutil para partículas rojas (usando arc más grande en lugar de shadowBlur que destruye fps)
      if (p.isRed) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.options.accentColor}, ${currentAlpha * 0.25})`;
        this.ctx.fill();
      }

      // Líneas de conexión optimizadas con check de distancia al cuadrado
      for (let j = i + 1; j < pLen; j++) {
        const p2 = this.particles[j];
        const distX = p.x - p2.x;
        const distY = p.y - p2.y;
        const distSq = distX * distX + distY * distY;

        if (distSq < this.maxDistSq) {
          const d = Math.sqrt(distSq);
          const lineAlpha = (1 - d / this.options.maxDistance) * 0.1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = p.isRed || p2.isRed 
            ? `rgba(${this.options.accentColor}, ${lineAlpha * 1.6})` 
            : `rgba(246, 246, 246, ${lineAlpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

window.ParticleEngine = ParticleEngine;


