import './particles.js';
import './parallax.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Partículas Ambientales Optimizadas
  if (typeof ParticleEngine !== 'undefined') {
    new ParticleEngine('particles-canvas', {
      particleCount: 38,
      mouseRadius: 140,
      baseSpeed: 0.28,
      redRatio: 0.25,
      targetFPS: 60
    });
  }

  // 2. Inicializar Parallax 3D reactivo al cursor
  if (typeof ParallaxEngine !== 'undefined') {
    new ParallaxEngine('.parallax-layer');
  }

  // 3. Reloj minimalista HUD
  const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const hudTime = document.getElementById('hud-time');
  const hudDate = document.getElementById('hud-date');

  let lastD = -1;

  function updateHudClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    const d = now.getDate();

    if (hudTime) hudTime.innerHTML = `${h}:${m}<span class="sec">${s}</span>`;
    if (hudDate && d !== lastD) {
      lastD = d;
      hudDate.textContent = `${dias[now.getDay()]}, ${d} DE ${meses[now.getMonth()]} ${now.getFullYear()}`;
    }
  }
  updateHudClock();
  setInterval(updateHudClock, 1000);

  // 4. Botón Fullscreen
  const fsBtn = document.getElementById('btn-fullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });
  }
});
