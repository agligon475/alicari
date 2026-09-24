/**
 * ALICARI WALLPAPER - POLAR CLOCK ENGINE
 * Concentric Polar coordinate clock with smooth real-time arcs & digital center display
 */

class ClockEngine {
  constructor(options = {}) {
    this.timeEl = document.getElementById(options.timeId || 'clock-time');
    this.secondsEl = document.getElementById(options.secondsId || 'clock-seconds');
    this.dateEl = document.getElementById(options.dateId || 'clock-date');
    this.greetingEl = document.getElementById(options.greetingId || 'clock-greeting');
    
    // Polar Rings SVG Arcs
    this.ringHours = document.getElementById('polar-ring-hours');
    this.ringMinutes = document.getElementById('polar-ring-minutes');
    this.ringSeconds = document.getElementById('polar-ring-seconds');

    // Circumferences
    // r=80 -> 2*PI*80 = 502.65
    // r=62 -> 2*PI*62 = 389.56
    // r=44 -> 2*PI*44 = 276.46
    this.cHours = 502.65;
    this.cMinutes = 389.56;
    this.cSeconds = 276.46;

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

    // 1. Digital Display
    if (this.timeEl) {
      this.timeEl.innerHTML = `${this.pad(hr)}<span class="clock-colon">:</span>${this.pad(min)}`;
    }
    if (this.secondsEl) {
      this.secondsEl.textContent = this.pad(sec);
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

    // 2. Polar Arcs Calculation (Valores fluidos continuos)
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
