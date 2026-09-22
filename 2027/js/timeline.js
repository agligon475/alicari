/**
 * ALICARI 2027 - Interactive Career Timeline
 * Drag-to-scroll, arrow navigation, and milestone interactions.
 */

export function initTimeline() {
  const container = document.getElementById('timeline-container');
  const prevBtn = document.getElementById('timeline-prev-btn');
  const nextBtn = document.getElementById('timeline-next-btn');

  if (!container) return;

  // Arrow navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  // Mouse Drag to Scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}
