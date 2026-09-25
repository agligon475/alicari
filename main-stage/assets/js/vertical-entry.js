import './particles.js';
import './clock.js';
import './weather.js';
import './finance.js';
import './carousel.js';

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

  // 4. Finance & Investment Engine (5 cajas con ordenamiento independiente)
  if (typeof FinanceEngine !== 'undefined') {
    new FinanceEngine();
  }

  // 5. Motor de Carrusel y Navegación entre Pantallas
  if (typeof CarouselEngine !== 'undefined') {
    new CarouselEngine({
      viewportSelector: '.carousel-viewport',
      trackSelector: '.carousel-track',
      slideSelector: '.carousel-slide',
      tabSelector: '.carousel-tab-btn',
      dotSelector: '.carousel-dot',
      prevBtnId: 'btn-carousel-prev',
      nextBtnId: 'btn-carousel-next',
      autoToggleId: 'btn-carousel-auto',
      statusLabelId: 'carousel-status-label',
      autoSlideInterval: 25000,
      autoEnabled: false
    });
  }
});
