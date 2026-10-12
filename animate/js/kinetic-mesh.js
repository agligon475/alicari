/**
 * ALICARI Animate Edition - Interactive Kinetic Mesh & Ambient Canvas
 * Generates an interactive floating constellation that shifts with mouse physics.
 */

export class KineticMesh {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.count = 42;
    this.mouse = { x: -1000, y: -1000, radius: 180 };
    this.width = 0;
    this.height = 0;

    this.resize();
    this.initPoints();
    this.bindEvents();
    this.render();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initPoints() {
    this.points = [];
    const count = window.innerWidth < 768 ? 24 : this.count;

    for (let i = 0; i < count; i++) {
      this.points.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: Math.random() * this.width,
        originY: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.45 + 0.15,
        color: i % 3 === 0 ? 'rgba(229, 9, 20, ' : 'rgba(255, 255, 255, '
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initPoints();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw points
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 3;
        p.y -= Math.sin(angle) * force * 3;
      }

      // Draw point
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color}${p.alpha})`;
      this.ctx.fill();

      // Connect neighbors
      for (let j = i + 1; j < this.points.length; j++) {
        const p2 = this.points[j];
        const distP = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (distP < 130) {
          const lineAlpha = (1 - distP / 130) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 0.75;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.render());
  }
}
