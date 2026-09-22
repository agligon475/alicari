/**
 * ALICARI 2027 - Dynamic Hero Background Canvas
 * Interactive particle node network with fluid motion, mouse parallax and red glow depth.
 */

export function initHeroBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 180
  };

  const particles = [];
  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 120);

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.isRed = Math.random() > 0.85; // 15% brand red accents
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 1.5;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      if (this.isRed) {
        ctx.fillStyle = `rgba(252, 34, 34, ${this.baseAlpha + 0.3})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fc2222';
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.baseAlpha})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          if (particles[i].isRed || particles[j].isRed) {
            ctx.strokeStyle = `rgba(252, 34, 34, ${alpha * 1.5})`;
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          }
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    drawConnections();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  const heroSection = document.getElementById('inicio');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    });
  }

  resize();
  initParticles();
  animate();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
