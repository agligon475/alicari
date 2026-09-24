/**
 * ALICARI WALLPAPER - SMN WEATHER ENGINE
 * Weather dashboard inspired by Servicio Meteorológico Nacional (SMN)
 * Live Open-Meteo Integration with instant offline fallback
 */

class WeatherEngine {
  constructor(options = {}) {
    this.latitude = options.latitude || -34.6037; // Buenos Aires
    this.longitude = options.longitude || -58.3816;
    this.cityName = options.cityName || 'BUENOS AIRES (CABA)';
    this.stationName = options.stationName || 'ESTACIÓN METEOROLÓGICA SMN // OBS. CENTRAL';
    this.refreshInterval = options.refreshInterval || 10 * 60 * 1000; // 10 mins

    // Referencias DOM
    this.container = document.getElementById(options.containerId || 'weather-widget');
    this.tempEl = document.getElementById('weather-temp');
    this.stEl = document.getElementById('weather-st');
    this.conditionEl = document.getElementById('weather-condition');
    this.humidityEl = document.getElementById('weather-humidity');
    this.windEl = document.getElementById('weather-wind');
    this.pressureEl = document.getElementById('weather-pressure');
    this.visEl = document.getElementById('weather-visibility');
    this.iconContainer = document.getElementById('weather-icon');
    this.forecastContainer = document.getElementById('weather-forecast');
    this.lastUpdateEl = document.getElementById('weather-updated');

    this.init();
  }

  init() {
    this.fetchWeather();
    setInterval(() => this.fetchWeather(), this.refreshInterval);
  }

  // Mapeo WMO Weather Codes a SMN de Argentina
  getWeatherMeta(code, isDay = 1) {
    const meta = {
      0: { text: 'Cielo Despejado', icon: isDay ? 'sun' : 'moon' },
      1: { text: 'Mayormente Despejado', icon: isDay ? 'sun-cloud' : 'moon-cloud' },
      2: { text: 'Parcialmente Nublado', icon: 'cloud' },
      3: { text: 'Nublado / Cubierto', icon: 'clouds' },
      45: { text: 'Niebla / Neblina', icon: 'fog' },
      48: { text: 'Niebla con Escarcha', icon: 'fog' },
      51: { text: 'Llovizna Ligera', icon: 'drizzle' },
      53: { text: 'Llovizna Moderada', icon: 'drizzle' },
      55: { text: 'Llovizna Densa', icon: 'rain' },
      61: { text: 'Lluvia Débil', icon: 'rain' },
      63: { text: 'Lluvia Moderada', icon: 'rain' },
      65: { text: 'Lluvia Fuerte', icon: 'heavy-rain' },
      71: { text: 'Nevada Ligera', icon: 'snow' },
      73: { text: 'Nevada Moderada', icon: 'snow' },
      80: { text: 'Chubascos Aislados', icon: 'rain' },
      81: { text: 'Chubascos Fuertes', icon: 'heavy-rain' },
      95: { text: 'Tormenta Eléctrica', icon: 'thunder' },
      96: { text: 'Tormenta con Granizo', icon: 'thunder-hail' },
      99: { text: 'Tormenta Severa', icon: 'thunder-hail' }
    };

    return meta[code] || { text: 'Condición Normal', icon: 'sun-cloud' };
  }

  getWindDirection(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const idx = Math.round((deg % 360) / 22.5) % 16;
    return directions[idx];
  }

  renderIcon(iconType) {
    const icons = {
      'sun': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="14" fill="#f60000" class="svg-glow-red" />
        <g stroke="#f6f6f6" stroke-width="2.5" stroke-linecap="round" class="svg-spin-slow">
          <line x1="32" y1="6" x2="32" y2="12" />
          <line x1="32" y1="52" x2="32" y2="58" />
          <line x1="6" y1="32" x2="12" y2="32" />
          <line x1="52" y1="32" x2="58" y2="32" />
          <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
          <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
          <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
          <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
        </g>
      </svg>`,
      'moon': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M42 38A18 18 0 1 1 26 14a15 15 0 0 0 16 24z" fill="#f6f6f6" />
        <circle cx="48" cy="18" r="1.5" fill="#f60000" />
        <circle cx="52" cy="28" r="1" fill="#f6f6f6" />
      </svg>`,
      'sun-cloud': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <circle cx="24" cy="24" r="10" fill="#f60000" />
        <path d="M22 46h24a10 10 0 0 0 2-19.8 12 12 0 0 0-23.2-3.2A10 10 0 0 0 22 46z" fill="#1c1c24" stroke="#f6f6f6" stroke-width="2" />
      </svg>`,
      'moon-cloud': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M28 22a9 9 0 0 1 8-5 9 9 0 0 0-8 12z" fill="#f60000" />
        <path d="M20 48h26a10 10 0 0 0 2-19.8 12 12 0 0 0-23.2-3.2A10 10 0 0 0 20 48z" fill="#1c1c24" stroke="#f6f6f6" stroke-width="2" />
      </svg>`,
      'cloud': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M18 46h28a11 11 0 0 0 2-21.8 14 14 0 0 0-27-3.2A11 11 0 0 0 18 46z" fill="#181820" stroke="#f6f6f6" stroke-width="2.2" />
      </svg>`,
      'clouds': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M26 36h22a9 9 0 0 0 1.6-17.8 11.5 11.5 0 0 0-22.2-2.6A9 9 0 0 0 26 36z" fill="#14141a" stroke="#8e8e93" stroke-width="1.8" />
        <path d="M16 50h28a10 10 0 0 0 1.8-19.8 13 13 0 0 0-25-3A10 10 0 0 0 16 50z" fill="#1e1e28" stroke="#f6f6f6" stroke-width="2" />
      </svg>`,
      'rain': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M16 38h32a10 10 0 0 0 1.8-19.8 13 13 0 0 0-25-3A10 10 0 0 0 16 38z" fill="#181820" stroke="#f6f6f6" stroke-width="2" />
        <line x1="22" y1="44" x2="18" y2="54" stroke="#f60000" stroke-width="2.5" stroke-linecap="round" />
        <line x1="32" y1="44" x2="28" y2="54" stroke="#f6f6f6" stroke-width="2.5" stroke-linecap="round" />
        <line x1="42" y1="44" x2="38" y2="54" stroke="#f60000" stroke-width="2.5" stroke-linecap="round" />
      </svg>`,
      'heavy-rain': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M16 36h32a10 10 0 0 0 1.8-19.8 13 13 0 0 0-25-3A10 10 0 0 0 16 36z" fill="#181820" stroke="#f6f6f6" stroke-width="2" />
        <line x1="20" y1="42" x2="14" y2="56" stroke="#f60000" stroke-width="2.5" stroke-linecap="round" />
        <line x1="30" y1="42" x2="24" y2="56" stroke="#f60000" stroke-width="2.5" stroke-linecap="round" />
        <line x1="40" y1="42" x2="34" y2="56" stroke="#f60000" stroke-width="2.5" stroke-linecap="round" />
        <line x1="50" y1="42" x2="44" y2="56" stroke="#f6f6f6" stroke-width="2.5" stroke-linecap="round" />
      </svg>`,
      'thunder': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M16 34h32a10 10 0 0 0 1.8-19.8 13 13 0 0 0-25-3A10 10 0 0 0 16 34z" fill="#181820" stroke="#f6f6f6" stroke-width="2" />
        <polygon points="34,36 24,48 31,48 27,60 41,45 33,45" fill="#f60000" />
      </svg>`,
      'fog': `<svg class="weather-svg" viewBox="0 0 64 64" fill="none">
        <path d="M18 30h28a9 9 0 0 0 1.6-17.8 12 12 0 0 0-23.2-3A9 9 0 0 0 18 30z" fill="#181820" stroke="#8e8e93" stroke-width="1.8" />
        <line x1="12" y1="38" x2="52" y2="38" stroke="#f6f6f6" stroke-width="2.2" stroke-linecap="round" />
        <line x1="16" y1="46" x2="48" y2="46" stroke="#f60000" stroke-width="2.2" stroke-linecap="round" />
        <line x1="20" y1="54" x2="44" y2="54" stroke="#f6f6f6" stroke-width="2.2" stroke-linecap="round" />
      </svg>`
    };

    return icons[iconType] || icons['sun-cloud'];
  }

  async fetchWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FArgentina%2FBuenos_Aires`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API Response Error');
      const data = await response.json();
      this.renderData(data);
    } catch (err) {
      console.warn('[SMN Weather] Usando datos de respaldo offline:', err.message);
      this.renderFallback();
    }
  }

  renderData(data) {
    const cur = data.current;
    const meta = this.getWeatherMeta(cur.weather_code, cur.is_day);

    if (this.tempEl) this.tempEl.innerHTML = `${Math.round(cur.temperature_2m)}<span class="unit">°C</span>`;
    if (this.stEl) this.stEl.textContent = `ST ${Math.round(cur.apparent_temperature)}°`;
    if (this.conditionEl) this.conditionEl.textContent = meta.text;
    if (this.humidityEl) this.humidityEl.textContent = `${cur.relative_humidity_2m}%`;
    
    const windDir = this.getWindDirection(cur.wind_direction_10m);
    if (this.windEl) this.windEl.textContent = `${Math.round(cur.wind_speed_10m)} km/h ${windDir}`;
    if (this.pressureEl) this.pressureEl.textContent = `${Math.round(cur.surface_pressure)} hPa`;
    if (this.visEl) this.visEl.textContent = '10.0 km';

    if (this.iconContainer) {
      this.iconContainer.innerHTML = this.renderIcon(meta.icon);
    }

    if (this.lastUpdateEl) {
      const d = new Date();
      this.lastUpdateEl.textContent = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} HS`;
    }

    // Render pronóstico 3 días
    if (this.forecastContainer && data.daily) {
      this.renderForecast(data.daily);
    }
  }

  renderForecast(daily) {
    const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    let html = '';
    
    for (let i = 1; i <= 3 && i < daily.time.length; i++) {
      const date = new Date(daily.time[i] + 'T00:00:00');
      const dayLabel = dayNames[date.getDay()];
      const meta = this.getWeatherMeta(daily.weather_code[i], 1);
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]);

      html += `
        <div class="forecast-day-card">
          <span class="forecast-name">${dayLabel}</span>
          <div class="forecast-mini-icon">${this.renderIcon(meta.icon)}</div>
          <div class="forecast-temps">
            <span class="max-temp">${max}°</span>
            <span class="min-temp">${min}°</span>
          </div>
        </div>
      `;
    }

    this.forecastContainer.innerHTML = html;
  }

  renderFallback() {
    const mockData = {
      current: {
        temperature_2m: 22.4,
        apparent_temperature: 21.8,
        relative_humidity_2m: 64,
        weather_code: 1,
        is_day: 1,
        surface_pressure: 1013,
        wind_speed_10m: 14,
        wind_direction_10m: 80
      },
      daily: {
        time: [
          new Date().toISOString().split('T')[0],
          new Date(Date.now() + 86400000).toISOString().split('T')[0],
          new Date(Date.now() + 172800000).toISOString().split('T')[0],
          new Date(Date.now() + 259200000).toISOString().split('T')[0]
        ],
        weather_code: [1, 0, 2, 61],
        temperature_2m_max: [24, 26, 23, 20],
        temperature_2m_min: [15, 17, 16, 14]
      }
    };

    this.renderData(mockData);
  }
}
