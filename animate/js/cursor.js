/**
 * ALICARI Interactive Edition - Magnetic Kinetic Cursor
 * Physics-based inertia cursor with magnetic snaps and interactive states.
 */

export class KineticCursor {
  constructor() {
    this.cursor = document.getElementById('kinetic-cursor');
    this.follower = document.getElementById('cursor-follower');
    this.badge = document.getElementById('cursor-badge');
    
    this.pos = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.active = false;
    this.isHovering = false;
    this.magneticEl = null;

    if (!this.cursor || !this.follower) return;

    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.cursor.style.display = 'none';
      this.follower.style.display = 'none';
      return;
    }

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.active = true;
      this.target.x = e.clientX;
      this.target.y = e.clientY;

      if (this.magneticEl) {
        const rect = this.magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.35;
        const dy = (e.clientY - centerY) * 0.35;
        
        if (window.anime) {
          window.anime({
            targets: this.magneticEl,
            translateX: dx,
            translateY: dy,
            duration: 250,
            easing: 'easeOutQuad'
          });
        }
      }
    });

    document.addEventListener('mouseleave', () => {
      this.active = false;
      this.cursor.style.opacity = '0';
      this.follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.active = true;
      this.cursor.style.opacity = '1';
      this.follower.style.opacity = '1';
    });

    // Magnetic and hover delegate
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      const clickable = e.target.closest('a, button, .project-card, .filter-chip, .clickable');

      if (target) {
        const text = target.getAttribute('data-cursor');
        this.setLabel(text);
        this.cursor.classList.add('is-expanded');
        this.follower.classList.add('is-expanded');
      } else if (clickable) {
        this.cursor.classList.add('is-hovering');
        this.follower.classList.add('is-hovering');
        this.setLabel('');
      }

      const magnetic = e.target.closest('[data-magnetic]');
      if (magnetic) {
        this.magneticEl = magnetic;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor]');
      const clickable = e.target.closest('a, button, .project-card, .filter-chip, .clickable');

      if (target || clickable) {
        this.cursor.classList.remove('is-expanded', 'is-hovering');
        this.follower.classList.remove('is-expanded', 'is-hovering');
        this.setLabel('');
      }

      const magnetic = e.target.closest('[data-magnetic]');
      if (magnetic && this.magneticEl === magnetic) {
        if (window.anime) {
          window.anime({
            targets: this.magneticEl,
            translateX: 0,
            translateY: 0,
            duration: 600,
            easing: 'easeOutElastic(1, .4)'
          });
        }
        this.magneticEl = null;
      }
    });

    document.addEventListener('mousedown', () => {
      this.cursor.classList.add('is-pressed');
      this.follower.classList.add('is-pressed');
    });

    document.addEventListener('mouseup', () => {
      this.cursor.classList.remove('is-pressed');
      this.follower.classList.remove('is-pressed');
    });
  }

  setLabel(text) {
    if (!this.badge) return;
    if (text) {
      this.badge.textContent = text;
      this.badge.style.opacity = '1';
    } else {
      this.badge.textContent = '';
      this.badge.style.opacity = '0';
    }
  }

  render() {
    if (this.active) {
      // Elastic lerp for follower
      this.pos.x += (this.target.x - this.pos.x) * 0.16;
      this.pos.y += (this.target.y - this.pos.y) * 0.16;

      this.cursor.style.transform = `translate3d(${this.target.x}px, ${this.target.y}px, 0)`;
      this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    }

    requestAnimationFrame(() => this.render());
  }
}
