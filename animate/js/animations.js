/**
 * ALICARI Interactive Edition - Master Choreographer
 * Orchestrates cinematic timelines, micro-interactions, kinetic typography and physics springs.
 */

export class AnimationManager {
  constructor() {
    this.anime = window.anime;
    if (!this.anime) {
      console.warn("Motion engine is not loaded.");
    }
  }

  // Preloader and Entrance Sequence
  playPreloader(onComplete) {
    if (!this.anime) {
      if (onComplete) onComplete();
      return;
    }

    const tl = this.anime.timeline({
      easing: 'easeInOutCubic',
      complete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Draw SVG Logo path
    tl.add({
      targets: '#preloader-logo-path',
      strokeDashoffset: [this.anime.setDashoffset, 0],
      duration: 1200,
      easing: 'easeInOutQuad'
    })
    // 2. Fill logo
    .add({
      targets: '#preloader-logo-path',
      fill: ['rgba(229, 9, 20, 0)', 'rgba(229, 9, 20, 1)'],
      duration: 600,
      easing: 'easeOutQuad'
    }, '-=400')
    // 3. Stagger reveal title letters
    .add({
      targets: '.preloader-title span',
      translateY: ['100%', '0%'],
      opacity: [0, 1],
      duration: 600,
      delay: this.anime.stagger(30),
      easing: 'easeOutExpo'
    }, '-=300')
    // 4. Progress bar counter
    .add({
      targets: '#preloader-bar',
      width: ['0%', '100%'],
      duration: 900,
      easing: 'easeInOutQuart'
    }, '-=500')
    // 5. Fade out and curtain lift
    .add({
      targets: '#preloader-content',
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 400,
      easing: 'easeInQuad'
    }, '+=100')
    .add({
      targets: '#preloader-screen',
      translateY: ['0%', '-100%'],
      duration: 850,
      easing: 'easeInOutExpo'
    }, '-=100');
  }

  // Hero Section Entrance
  playHeroEntrance() {
    if (!this.anime) return;

    const tl = this.anime.timeline({
      easing: 'easeOutExpo'
    });

    // Brand Badge
    tl.add({
      targets: '.hero-badge',
      translateY: [-20, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 700
    })
    // Kinetic Headline Words
    .add({
      targets: '.hero-title .word',
      translateY: [60, 0],
      opacity: [0, 1],
      rotateZ: [3, 0],
      duration: 900,
      delay: this.anime.stagger(50),
      easing: 'easeOutBack'
    }, '-=500')
    // Lead Description
    .add({
      targets: '.hero-description',
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=600')
    // Actions CTAs
    .add({
      targets: '.hero-actions .btn',
      translateY: [20, 0],
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      delay: this.anime.stagger(100)
    }, '-=500')
    // Numeric Metric Counters
    .add({
      targets: '.metric-card',
      translateY: [35, 0],
      opacity: [0, 1],
      duration: 800,
      delay: this.anime.stagger(100),
      complete: () => {
        this.animateCounters();
      }
    }, '-=400')
    // Floating Visual Showcase
    .add({
      targets: '.hero-showcase-panel',
      scale: [0.92, 1],
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      easing: 'easeOutElastic(1, .5)',
      complete: () => {
        this.startFloatingLoops();
      }
    }, '-=700');
  }

  // Live Metric Number Tickers
  animateCounters() {
    if (!this.anime) return;

    const counters = document.querySelectorAll('[data-counter-target]');
    counters.forEach(el => {
      const targetVal = parseFloat(el.getAttribute('data-counter-target'));
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      
      const obj = { val: 0 };
      this.anime({
        targets: obj,
        val: targetVal,
        round: targetVal % 1 === 0 ? 1 : 10,
        easing: 'easeOutExpo',
        duration: 2200,
        update: () => {
          el.textContent = `${prefix}${obj.val}${suffix}`;
        }
      });
    });
  }

  // Gentle Ambient Floating Animation for hero elements
  startFloatingLoops() {
    if (!this.anime) return;

    this.anime({
      targets: '.hero-float-card--1',
      translateY: [-10, 10],
      rotateZ: [-2, 2],
      duration: 4200,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    this.anime({
      targets: '.hero-float-card--2',
      translateY: [12, -12],
      rotateZ: [2, -1.5],
      duration: 4800,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    this.anime({
      targets: '.hero-ambient-glow',
      scale: [1, 1.25],
      opacity: [0.35, 0.65],
      duration: 3500,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad'
    });

    this.anime({
      targets: '.hero-monogram-glow',
      scale: [0.95, 1.25],
      opacity: [0.35, 0.7],
      duration: 3200,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    this.anime({
      targets: '.hero-monogram-svg',
      translateY: [-6, 6],
      duration: 4000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  // Filter Transition with Physics Stagger
  animateGalleryFilter(hiddenItems, visibleItems, onFinish) {
    if (!this.anime) {
      hiddenItems.forEach(el => el.style.display = 'none');
      visibleItems.forEach(el => el.style.display = '');
      if (onFinish) onFinish();
      return;
    }

    // 1. Animate out hidden items
    if (hiddenItems.length > 0) {
      this.anime({
        targets: hiddenItems,
        opacity: [1, 0],
        scale: [1, 0.85],
        duration: 250,
        easing: 'easeInQuad',
        complete: () => {
          hiddenItems.forEach(el => {
            el.style.display = 'none';
          });

          // 2. Animate in visible items
          visibleItems.forEach(el => {
            el.style.display = '';
            el.style.opacity = '0';
          });

          this.anime({
            targets: visibleItems,
            opacity: [0, 1],
            scale: [0.85, 1],
            translateY: [30, 0],
            duration: 550,
            delay: this.anime.stagger(45, { from: 'first' }),
            easing: 'easeOutQuart',
            complete: () => {
              if (onFinish) onFinish();
            }
          });
        }
      });
    } else {
      // Just animate in visible items
      visibleItems.forEach(el => {
        el.style.display = '';
        el.style.opacity = '0';
      });

      this.anime({
        targets: visibleItems,
        opacity: [0, 1],
        scale: [0.85, 1],
        translateY: [30, 0],
        duration: 550,
        delay: this.anime.stagger(45),
        easing: 'easeOutQuart',
        complete: () => {
          if (onFinish) onFinish();
        }
      });
    }
  }

  // Card Magnetic Spring on Hover
  animateCardHover(card, isEnter) {
    if (!this.anime) return;

    const img = card.querySelector('.project-card__image');
    const badge = card.querySelector('.project-card__badge');
    const overlay = card.querySelector('.project-card__overlay');

    if (isEnter) {
      this.anime({
        targets: img,
        scale: 1.08,
        duration: 600,
        easing: 'easeOutQuad'
      });
      if (badge) {
        this.anime({
          targets: badge,
          translateY: [6, 0],
          opacity: [0, 1],
          duration: 350,
          easing: 'easeOutQuad'
        });
      }
    } else {
      this.anime({
        targets: img,
        scale: 1,
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
  }

  // Open Lightbox with Elastic Spring
  openLightbox(modal, onComplete) {
    if (!this.anime) {
      modal.classList.add('is-active');
      if (onComplete) onComplete();
      return;
    }

    modal.classList.add('is-active');
    const backdrop = modal.querySelector('.lightbox-backdrop');
    const dialog = modal.querySelector('.lightbox-dialog');

    this.anime({
      targets: backdrop,
      opacity: [0, 1],
      duration: 350,
      easing: 'easeOutQuad'
    });

    this.anime({
      targets: dialog,
      opacity: [0, 1],
      scale: [0.88, 1],
      translateY: [40, 0],
      duration: 650,
      easing: 'easeOutElastic(1, .65)',
      complete: onComplete
    });
  }

  // Close Lightbox
  closeLightbox(modal, onComplete) {
    if (!this.anime) {
      modal.classList.remove('is-active');
      if (onComplete) onComplete();
      return;
    }

    const backdrop = modal.querySelector('.lightbox-backdrop');
    const dialog = modal.querySelector('.lightbox-dialog');

    this.anime({
      targets: backdrop,
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInQuad'
    });

    this.anime({
      targets: dialog,
      opacity: [1, 0],
      scale: [1, 0.9],
      translateY: [0, 30],
      duration: 280,
      easing: 'easeInQuad',
      complete: () => {
        modal.classList.remove('is-active');
        if (onComplete) onComplete();
      }
    });
  }

  // Contact Drawer Open
  openContactModal(modal, onComplete) {
    if (!this.anime) {
      modal.classList.add('is-active');
      if (onComplete) onComplete();
      return;
    }

    modal.classList.add('is-active');
    const backdrop = modal.querySelector('.contact-modal__backdrop');
    const panel = modal.querySelector('.contact-modal__panel');
    const fields = modal.querySelectorAll('.form-group');

    this.anime({
      targets: backdrop,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });

    this.anime({
      targets: panel,
      translateX: ['100%', '0%'],
      duration: 550,
      easing: 'easeOutCubic'
    });

    this.anime({
      targets: fields,
      translateX: [30, 0],
      opacity: [0, 1],
      duration: 450,
      delay: this.anime.stagger(40, { start: 200 }),
      easing: 'easeOutQuad',
      complete: onComplete
    });
  }

  // Contact Drawer Close
  closeContactModal(modal, onComplete) {
    if (!this.anime) {
      modal.classList.remove('is-active');
      if (onComplete) onComplete();
      return;
    }

    const backdrop = modal.querySelector('.contact-modal__backdrop');
    const panel = modal.querySelector('.contact-modal__panel');

    this.anime({
      targets: backdrop,
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInQuad'
    });

    this.anime({
      targets: panel,
      translateX: ['0%', '100%'],
      duration: 400,
      easing: 'easeInCubic',
      complete: () => {
        modal.classList.remove('is-active');
        if (onComplete) onComplete();
      }
    });
  }

  // Input Field Error Shake Animation
  shakeElement(el) {
    if (!this.anime) return;

    this.anime({
      targets: el,
      translateX: [-10, 10, -8, 8, -4, 4, 0],
      duration: 450,
      easing: 'easeInOutSine'
    });
  }

  // Kinetic Name Morph: agustín licari -> alicari
  playNameMorph(onComplete) {
    if (!this.anime) return;

    const fadeSegment = document.getElementById('morph-fade');
    const spaceSegment = document.getElementById('morph-space');
    const letterA = document.getElementById('morph-a');
    const licariSegment = document.getElementById('morph-licari');
    const resultBox = document.getElementById('name-morph-result');

    if (!fadeSegment || !spaceSegment || !letterA || !licariSegment) return;

    const tl = this.anime.timeline({
      easing: 'easeInOutCubic',
      complete: onComplete
    });

    // 1. Initial emphasis
    tl.add({
      targets: letterA,
      scale: [1, 1.2, 1],
      duration: 500,
      easing: 'easeOutElastic(1, .5)'
    })
    // 2. Dissolve "gustín" and collapse width
    .add({
      targets: fadeSegment,
      opacity: [1, 0],
      maxWidth: ['280px', '0px'],
      filter: ['blur(0px)', 'blur(10px)'],
      letterSpacing: ['0.02em', '-0.35em'],
      duration: 900,
      easing: 'easeInOutQuart'
    }, '-=200')
    // 3. Collapse space
    .add({
      targets: spaceSegment,
      width: ['0.25em', '0em'],
      duration: 700,
      easing: 'easeInOutQuart'
    }, '-=850')
    // 4. "licari" slides left and fuses with "a"
    .add({
      targets: licariSegment,
      translateX: [0, 0],
      duration: 300
    }, '-=400')
    // 5. Illuminate "a" in brand crimson and pop badge
    .add({
      targets: letterA,
      color: ['#ffffff', '#e50914'],
      scale: [1, 1.15, 1],
      duration: 650,
      easing: 'easeOutElastic(1, .6)',
      begin: () => {
        letterA.classList.add('is-active-brand');
      }
    }, '-=300')
    .add({
      targets: resultBox,
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.95, 1],
      duration: 650,
      easing: 'easeOutBack'
    }, '-=450');
  }

  // Reset Name Morph to initial "agustín licari"
  resetNameMorph() {
    if (!this.anime) return;

    const fadeSegment = document.getElementById('morph-fade');
    const spaceSegment = document.getElementById('morph-space');
    const letterA = document.getElementById('morph-a');
    const resultBox = document.getElementById('name-morph-result');

    letterA?.classList.remove('is-active-brand');

    this.anime({
      targets: [fadeSegment],
      opacity: 1,
      maxWidth: '280px',
      filter: 'blur(0px)',
      letterSpacing: '0.02em',
      duration: 450,
      easing: 'easeOutQuad'
    });

    this.anime({
      targets: [spaceSegment],
      width: '0.25em',
      duration: 450,
      easing: 'easeOutQuad'
    });

    this.anime({
      targets: [letterA],
      color: '#ffffff',
      scale: 1,
      duration: 350
    });

    this.anime({
      targets: [resultBox],
      opacity: 0,
      translateY: 20,
      duration: 350
    });
  }
}
