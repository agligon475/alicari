/**
 * ALICARI WALLPAPER - CLOCK & CALENDAR ENGINE
 * Real-time 24h clock, localized Spanish calendar, and day metrics
 */

class ClockEngine {
  constructor(options = {}) {
    this.timeEl = document.getElementById(options.timeId || 'clock-time');
    this.secondsEl = document.getElementById(options.secondsId || 'clock-seconds');
    this.dateEl = document.getElementById(options.dateId || 'clock-date');
    this.greetingEl = document.getElementById(options.greetingId || 'clock-greeting');
    this.dayProgressEl = document.getElementById(options.dayProgressId || 'day-progress-bar');
    this.dayPercentEl = document.getElementById(options.dayPercentId || 'day-progress-percent');
    
    this.dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    this.meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];

    this.init();
  }

  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  }

  pad(num) {
    return num.toString().padStart(2, '0');
  }

  update() {
    const now = new Date();
    const hours = this.pad(now.getHours());
    const minutes = this.pad(now.getMinutes());
    const seconds = this.pad(now.getSeconds());

    if (this.timeEl) {
      this.timeEl.innerHTML = `${hours}<span class="clock-colon">:</span>${minutes}`;
    }

    if (this.secondsEl) {
      this.secondsEl.textContent = seconds;
    }

    if (this.dateEl) {
      const dayName = this.dias[now.getDay()];
      const dayNum = this.pad(now.getDate());
      const monthName = this.meses[now.getMonth()];
      const year = now.getFullYear();
      this.dateEl.textContent = `${dayName}, ${dayNum} DE ${monthName} ${year}`;
    }

    if (this.greetingEl) {
      const h = now.getHours();
      let greeting = 'BUENAS NOCHES';
      if (h >= 6 && h < 12) greeting = 'BUENOS DÍAS';
      else if (h >= 12 && h < 20) greeting = 'BUENAS TARDES';
      this.greetingEl.textContent = greeting;
    }

    // Progreso del día actual (00:00 a 23:59)
    if (this.dayProgressEl || this.dayPercentEl) {
      const totalSecsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const pct = ((totalSecsToday / 86400) * 100).toFixed(1);
      
      if (this.dayProgressEl) {
        this.dayProgressEl.style.width = `${pct}%`;
      }
      if (this.dayPercentEl) {
        this.dayPercentEl.textContent = `${pct}%`;
      }
    }
  }
}
