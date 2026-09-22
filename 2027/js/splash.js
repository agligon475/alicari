/**
 * ALICARI 2027 - Experiential Splash Screen & Portal Gateway
 * Manages intro animation, canvas ripple, sound initialization and seamless transition.
 */

import { sound } from './sound-fx.js';

export function initSplash() {
  const splash = document.getElementById('splash-portal');
  const enterBtn = document.getElementById('splash-enter-btn');
  const canvas = document.getElementById('splash-canvas');

  if (!splash || !enterBtn) return;

  // Simple particle ring canvas for the portal
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const dots = [];
    for (let i = 0; i < 40; i++) {
      dots.push({
        angle: (i / 40) * Math.PI * 2,
        radius: 120 + Math.random() * 40,
        speed: 0.005 + Math.random() * 0.005,
        size: Math.random() * 2 + 1
      });
    }

    let reqId;
    function render() {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      dots.forEach(d => {
        d.angle += d.speed;
        const x = cx + Math.cos(d.angle) * d.radius;
        const y = cy + Math.sin(d.angle) * d.radius;

        ctx.beginPath();
        ctx.arc(x, y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(252, 34, 34, 0.4)';
        ctx.fill();
      });

      reqId = requestAnimationFrame(render);
    }
    render();
  }

  function enterExperience() {
    sound.init();
    sound.playChime(440, 0.6, 'sine');
    
    splash.classList.add('is-dismissed');
    document.body.classList.remove('portal-locked');

    setTimeout(() => {
      splash.style.display = 'none';
    }, 900);
  }

  enterBtn.addEventListener('click', enterExperience);
}
