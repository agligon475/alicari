/**
 * ALICARI WALLPAPER - POLAR CLOCK ENGINE (OPTIMIZED)
 * Concentric Polar coordinate clock with outer dial numerals & external digital readout
 */

class ClockEngine {
  constructor(options = {}) {
    this.timeEl = document.getElementById(options.timeId || 'clock-time');
    this.secondsEl = document.getElementById(options.secondsId || 'clock-seconds');
    this.dateEl = document.getElementById(options.dateId || 'clock-date');
    this.greetingEl = document.getElementById(options.greetingId || 'clock-greeting');
    
    // Polar Rings SVG Arcs (viewBox 0 0 240 240, Center 120,120)
    this.ringHours = document.getElementById('polar-ring-hours');
    this.ringMinutes = document.getElementById('polar-ring-minutes');
    this.ringSeconds = document.getElementById('polar-ring-seconds');

    // Circumferences
    this.cHours = 527.78;
    this.cMinutes = 414.69;
    this.cSeconds = 301.59;

    this.dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    this.meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];

    this.lastSec = -1;
    this.lastMin = -1;
    this.isRunning = true;
    this.rafId = null;

    this.init();
  }

  init() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isRunning = false;
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      } else {
        if (!this.isRunning) {
          this.isRunning = true;
          this.render();
        }
      }
    });

    this.render();
  }

  pad(num) {
    return num < 10 ? '0' + num : '' + num;
  }

  render() {
    if (!this.isRunning) return;

    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    // Actualizar texto sólo cuando cambia el segundo para evitar recalcular DOM innecesariamente
    if (sec !== this.lastSec) {
      this.lastSec = sec;
      
      if (this.secondsEl) {
        this.secondsEl.textContent = `:${this.pad(sec)}`;
      }

      if (min !== this.lastMin) {
        this.lastMin = min;
        if (this.timeEl) {
          this.timeEl.innerHTML = `${this.pad(hr)}<span class="clock-colon">:</span>${this.pad(min)}`;
        }
        if (this.dateEl) {
          const dayName = this.dias[now.getDay()];
          const dayNum = this.pad(now.getDate());
          const monthName = this.meses[now.getMonth()].slice(0, 3);
          this.dateEl.textContent = `${dayName.slice(0, 3)} ${dayNum} ${monthName} ${now.getFullYear()}`;
        }
        if (this.greetingEl) {
          let greeting = 'BUENAS NOCHES';
          if (hr >= 6 && hr < 12) greeting = 'BUENOS DÍAS';
          else if (hr >= 12 && hr < 20) greeting = 'BUENAS TARDES';
          this.greetingEl.textContent = greeting;
        }
      }
    }

    // Polar Arcs Calculation (Suave con ms)
    if (this.ringSeconds || this.ringMinutes || this.ringHours) {
      const secProgress = (sec + ms / 1000) / 60;
      const minProgress = (min + sec / 60) / 60;
      const hrProgress = ((hr % 24) + min / 60) / 24;

      if (this.ringSeconds) {
        this.ringSeconds.style.strokeDashoffset = (this.cSeconds * (1 - secProgress)).toFixed(1);
      }
      if (this.ringMinutes) {
        this.ringMinutes.style.strokeDashoffset = (this.cMinutes * (1 - minProgress)).toFixed(1);
      }
      if (this.ringHours) {
        this.ringHours.style.strokeDashoffset = (this.cHours * (1 - hrProgress)).toFixed(1);
      }
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

window.ClockEngine = ClockEngine;


