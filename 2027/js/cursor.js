/**
 * ALICARI 2027 - Dynamic Experiential Cursor
 * Follower ring with inertia lerp, magnetic attraction, and contextual state morphing.
 */

export function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on mobile/touch

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);

  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  cursorRing.innerHTML = '<span class="cursor-text"></span>';
  document.body.appendChild(cursorRing);

  const cursorText = cursorRing.querySelector('.cursor-text');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function animate() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Contextual Hover States
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target) {
      const mode = target.dataset.cursor;
      cursorRing.classList.add(`is-${mode}`);
      if (cursorText) {
        if (mode === 'view') cursorText.textContent = 'VER';
        else if (mode === 'drag') cursorText.textContent = 'ARRASTRAR';
        else if (mode === 'explore') cursorText.textContent = 'EXPLORAR';
        else if (mode === 'close') cursorText.textContent = '✕';
        else cursorText.textContent = '';
      }
    } else if (e.target.closest('a, button, input, select, textarea, .filter-btn')) {
      cursorRing.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target) {
      const mode = target.dataset.cursor;
      cursorRing.classList.remove(`is-${mode}`);
      if (cursorText) cursorText.textContent = '';
    } else if (e.target.closest('a, button, input, select, textarea, .filter-btn')) {
      cursorRing.classList.remove('is-hover');
    }
  });
}
