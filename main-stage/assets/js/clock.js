/**
 * ALICARI WALLPAPER - POLAR CLOCK ENGINE
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
    // r=84 -> 2*PI*84 = 527.78
    // r=66 -> 2*PI*66 = 414.69
    // r=48 -> 2*PI*48 = 301.59
    this.cHours = 527.78;
    this.cMinutes = 414.69;
    this.cSeconds = 301.59;

    this.dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    this.meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];

    this.init();
  }

  init() {
    this.render();
  }

  pad(num) {
    return num.toString().padStart(2, '0');
  }

  render() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    // 1. Digital Display (Ubicado por fuera del reloj polar)
    if (this.timeEl) {
      this.timeEl.innerHTML = `${this.pad(hr)}<span class="clock-colon">:</span>${this.pad(min)}`;
    }
    if (this.secondsEl) {
      this.secondsEl.textContent = `:${this.pad(sec)}`;
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

    // 2. Polar Arcs Calculation (Movimiento continuo y suave)
    const secProgress = (sec + ms / 1000) / 60;
    const minProgress = (min + sec / 60) / 60;
    const hrProgress = ((hr % 24) + min / 60) / 24;

    if (this.ringSeconds) {
      const offsetSec = this.cSeconds * (1 - secProgress);
      this.ringSeconds.style.strokeDashoffset = offsetSec;
    }

    if (this.ringMinutes) {
      const offsetMin = this.cMinutes * (1 - minProgress);
      this.ringMinutes.style.strokeDashoffset = offsetMin;
    }

    if (this.ringHours) {
      const offsetHr = this.cHours * (1 - hrProgress);
      this.ringHours.style.strokeDashoffset = offsetHr;
    }

    requestAnimationFrame(() => this.render());
  }
}
