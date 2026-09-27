import './particles.js';
import './clock.js';
import './weather.js';
import './finance.js';
import './agenda.js';
import './carousel.js';
import './settings.js';

function initVerticalStage() {
  // 1. Partículas sutiles verticales de bajo consumo
  try {
    if (typeof ParticleEngine !== 'undefined') {
      window.ParticleEngineInstance = new ParticleEngine('particles-canvas', {
        particleCount: 28,
        mouseRadius: 100,
        baseSpeed: 0.22,
        redRatio: 0.25,
        targetFPS: 60
      });
    }
  } catch (err) {
    console.error('[ALICARI] Error in ParticleEngine:', err);
  }

  // 2. Reloj Polar en tiempo real optimizado
  try {
    if (typeof ClockEngine !== 'undefined') {
      window.ClockEngineInstance = new ClockEngine({
        timeId: 'clock-time',
        secondsId: 'clock-seconds',
        dateId: 'clock-date',
        greetingId: 'clock-greeting'
      });
    }
  } catch (err) {
    console.error('[ALICARI] Error in ClockEngine:', err);
  }

  // 3. SMN Weather Engine para Monte Grande, Buenos Aires con pronóstico
  try {
    if (typeof WeatherEngine !== 'undefined') {
      window.WeatherEngineInstance = new WeatherEngine({
        containerId: 'weather-widget',
        latitude: -34.8167,
        longitude: -58.4667,
        cityName: 'MONTE GRANDE, BUENOS AIRES',
        stationName: 'ESTACIÓN SMN // EZEIZA / MONTE GRANDE'
      });
    }
  } catch (err) {
    console.error('[ALICARI] Error in WeatherEngine:', err);
  }

  // 4. Google Calendar & Agenda Engine (Pantalla 1)
  let agendaInstance = null;
  try {
    if (typeof AgendaEngine !== 'undefined') {
      agendaInstance = new AgendaEngine({
        containerId: 'calendar-widget'
      });
      window.AgendaEngineInstance = agendaInstance;
    }
  } catch (err) {
    console.error('[ALICARI] Error in AgendaEngine:', err);
  }

  // 5. Finance & Investment Engine (5 cajas con Criptos Own y Holdings)
  let financeInstance = null;
  try {
    if (typeof FinanceEngine !== 'undefined') {
      financeInstance = new FinanceEngine();
      window.FinanceEngineInstance = financeInstance;
    }
  } catch (err) {
    console.error('[ALICARI] Error in FinanceEngine:', err);
  }

  // 6. Settings Modal Engine (Gestión de Criptos Own y Google Calendar URL)
  try {
    if (typeof SettingsEngine !== 'undefined') {
      const settingsInstance = new SettingsEngine({
        financeEngine: financeInstance,
        agendaEngine: agendaInstance
      });
      window.SettingsEngineInstance = settingsInstance;
    }
  } catch (err) {
    console.error('[ALICARI] Error in SettingsEngine:', err);
  }

  // 7. Motor de Carrusel y Navegación entre Pantallas
  try {
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
  } catch (err) {
    console.error('[ALICARI] Error in CarouselEngine:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVerticalStage);
} else {
  initVerticalStage();
}

