import './particles.js';
import './clock.js';
import './weather.js';
import './finance.js';
import './agenda.js';
import './carousel.js';
import './settings.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Partículas sutiles verticales de bajo consumo
  if (typeof ParticleEngine !== 'undefined') {
    new ParticleEngine('particles-canvas', {
      particleCount: 28,
      mouseRadius: 100,
      baseSpeed: 0.22,
      redRatio: 0.25,
      targetFPS: 60
    });
  }

  // 2. Reloj Polar en tiempo real optimizado
  if (typeof ClockEngine !== 'undefined') {
    new ClockEngine({
      timeId: 'clock-time',
      secondsId: 'clock-seconds',
      dateId: 'clock-date',
      greetingId: 'clock-greeting'
    });
  }

  // 3. SMN Weather Engine para Monte Grande, Buenos Aires con pronóstico
  if (typeof WeatherEngine !== 'undefined') {
    new WeatherEngine({
      containerId: 'weather-widget',
      latitude: -34.8167,
      longitude: -58.4667,
      cityName: 'MONTE GRANDE, BUENOS AIRES',
      stationName: 'ESTACIÓN SMN // EZEIZA / MONTE GRANDE'
    });
  }

  // 4. Google Calendar & Agenda Engine (Pantalla 1)
  let agendaInstance = null;
  if (typeof AgendaEngine !== 'undefined') {
    agendaInstance = new AgendaEngine({
      containerId: 'calendar-widget'
    });
    window.AgendaEngineInstance = agendaInstance;
  }

  // 5. Finance & Investment Engine (5 cajas con Criptos Own y Holdings)
  let financeInstance = null;
  if (typeof FinanceEngine !== 'undefined') {
    financeInstance = new FinanceEngine();
    window.FinanceEngineInstance = financeInstance;
  }

  // 6. Settings Modal Engine (Gestión de Criptos Own y Google Calendar URL)
  if (typeof SettingsEngine !== 'undefined') {
    const settingsInstance = new SettingsEngine({
      financeEngine: financeInstance,
      agendaEngine: agendaInstance
    });
    window.SettingsEngineInstance = settingsInstance;
  }

  // 7. Motor de Carrusel y Navegación entre Pantallas
  if (typeof CarouselEngine !== 'undefined') {
    window.CarouselEngineInstance = new CarouselEngine({
      viewportSelector: '.carousel-viewport',
      trackSelector: '.carousel-track',
      slideSelector: '.carousel-slide',
      tabSelector: '.carousel-tab-btn',
      dotSelector: '.carousel-dot',
      quickDockBtnSelector: '.quick-dock-btn',
      prevBtnId: 'btn-carousel-prev',
      nextBtnId: 'btn-carousel-next',
      sidePrevBtnId: 'btn-side-prev',
      sideNextBtnId: 'btn-side-next',
      quickDockToggleId: 'btn-quick-dock-switch',
      autoToggleId: 'btn-carousel-auto',
      statusLabelId: 'carousel-status-label',
      autoSlideInterval: 25000,
      autoEnabled: false
    });
  }
});
