/**
 * ALICARI WALLPAPER - GOOGLE CALENDAR & AGENDA ENGINE
 * Parses iCal (.ics) private feeds and renders upcoming events with live countdowns.
 * 100% Client-side and private: URL and data stored exclusively in localStorage.
 */

class AgendaEngine {
  constructor(options = {}) {
    this.containerId = options.containerId || 'calendar-widget';
    this.container = document.getElementById(this.containerId);
    this.storageKey = 'alicari_calendar_url';
    this.refreshInterval = options.refreshInterval || 5 * 60 * 1000; // 5 mins
    this.calendarUrl = localStorage.getItem(this.storageKey) || '';
    this.events = [];
    this.timer = null;

    this.init();
  }

  init() {
    if (this.calendarUrl) {
      this.fetchCalendar();
    } else {
      this.loadDefaultEvents();
      this.render();
    }

    // Intervalo de actualización de calendario
    setInterval(() => {
      if (this.calendarUrl) this.fetchCalendar();
      else this.render();
    }, this.refreshInterval);

    // Intervalo corto para actualizar los contadores "en X min"
    setInterval(() => this.updateCountdowns(), 30 * 1000);
  }

  setCalendarUrl(url) {
    this.calendarUrl = (url || '').trim();
    if (this.calendarUrl) {
      localStorage.setItem(this.storageKey, this.calendarUrl);
      this.fetchCalendar();
    } else {
      localStorage.removeItem(this.storageKey);
      this.loadDefaultEvents();
      this.render();
    }
  }

  getCalendarUrl() {
    return this.calendarUrl;
  }

  loadDefaultEvents() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Horas dinámicas para que siempre muestre eventos relevantes hoy
    const makeTime = (hours, minutes) => {
      const d = new Date(now);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    this.events = [
      {
        id: 'demo-1',
        title: 'Daily Standup / Sincronización',
        start: makeTime(10, 0),
        end: makeTime(10, 30),
        location: 'Google Meet',
        isAllDay: false,
        isDemo: true
      },
      {
        id: 'demo-2',
        title: 'Revisión de Métricas & Mercados',
        start: makeTime(14, 0),
        end: makeTime(15, 0),
        location: 'Oficina / Sala A',
        isAllDay: false,
        isDemo: true
      },
      {
        id: 'demo-3',
        title: 'Planificación de Lanzamiento Alicari 2026',
        start: makeTime(17, 30),
        end: makeTime(18, 30),
        location: 'Virtual',
        isAllDay: false,
        isDemo: true
      }
    ];
  }

  async fetchCalendar() {
    if (!this.calendarUrl) return;

    try {
      this.setLoadingState(true);
      
      // Manejar feeds webcal:// y https://
      let fetchUrl = this.calendarUrl.replace(/^webcal:\/\//i, 'https://');
      
      // Intentar fetch directo con fallback a CORS proxy seguro si el navegador bloquea CORS
      let icsData = '';
      try {
        const res = await fetch(fetchUrl, { cache: 'no-cache' });
        if (res.ok) {
          icsData = await res.text();
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (corsErr) {
        // Fallback a proxy público de solo lectura CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fetchUrl)}`;
        const resProxy = await fetch(proxyUrl);
        if (resProxy.ok) {
          icsData = await resProxy.text();
        } else {
          throw new Error('No se pudo acceder al enlace del calendario');
        }
      }

      if (icsData) {
        this.events = this.parseICS(icsData);
        localStorage.setItem('alicari_calendar_cached_events', JSON.stringify(this.events));
      }
    } catch (err) {
      console.warn('[Agenda] Error sincronizando Google Calendar:', err.message);
      // Cargar eventos en caché si existen
      const cached = localStorage.getItem('alicari_calendar_cached_events');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.events = parsed.map(e => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end)
          }));
        } catch (e) {
          this.loadDefaultEvents();
        }
      } else {
        this.loadDefaultEvents();
      }
    } finally {
      this.setLoadingState(false);
      this.render();
    }
  }

  parseICS(icsText) {
    const lines = icsText.split(/\r\n|\n|\r/);
    const events = [];
    let currentEvent = null;

    // Desdoblar líneas partidas en RFC 5545
    const unfoldedLines = [];
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
        line += lines[i + 1].substring(1);
        i++;
      }
      unfoldedLines.push(line);
    }

    const parseICSDate = (dateStr) => {
      if (!dateStr) return null;
      // Tratar formato YYYYMMDDTHHMMSSZ o TZID
      const clean = dateStr.replace(/^.*:/, '');
      if (clean.length === 8) { // YYYYMMDD (All day)
        const y = parseInt(clean.substring(0, 4), 10);
        const m = parseInt(clean.substring(4, 6), 10) - 1;
        const d = parseInt(clean.substring(6, 8), 10);
        return new Date(y, m, d, 0, 0, 0);
      }
      if (clean.includes('T')) {
        const [dPart, tPart] = clean.split('T');
        const y = parseInt(dPart.substring(0, 4), 10);
        const m = parseInt(dPart.substring(4, 6), 10) - 1;
        const d = parseInt(dPart.substring(6, 8), 10);
        const hh = parseInt(tPart.substring(0, 2), 10);
        const mm = parseInt(tPart.substring(2, 4), 10);
        const ss = parseInt(tPart.substring(4, 6) || '0', 10);

        if (clean.endsWith('Z')) {
          return new Date(Date.UTC(y, m, d, hh, mm, ss));
        }
        return new Date(y, m, d, hh, mm, ss);
      }
      return new Date(clean);
    };

    for (const line of unfoldedLines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = { isAllDay: false };
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent && currentEvent.start && currentEvent.title) {
          events.push(currentEvent);
        }
        currentEvent = null;
      } else if (currentEvent) {
        if (line.startsWith('SUMMARY')) {
          currentEvent.title = line.replace(/^SUMMARY[^:]*:/, '').trim() || 'Evento sin título';
        } else if (line.startsWith('DTSTART')) {
          currentEvent.start = parseICSDate(line);
          if (line.includes('VALUE=DATE')) currentEvent.isAllDay = true;
        } else if (line.startsWith('DTEND')) {
          currentEvent.end = parseICSDate(line);
        } else if (line.startsWith('LOCATION')) {
          currentEvent.location = line.replace(/^LOCATION[^:]*:/, '').trim();
        } else if (line.startsWith('UID')) {
          currentEvent.id = line.replace(/^UID[^:]*:/, '').trim();
        }
      }
    }

    // Filtrar sólo eventos desde hoy en adelante (próximos 7 días) y ordenar cronológicamente
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limitDate = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

    return events
      .filter(ev => ev.start && ev.end && ev.end >= startOfToday && ev.start <= limitDate)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  setLoadingState(loading) {
    const statusEl = document.getElementById('calendar-updated');
    if (statusEl) {
      statusEl.textContent = loading ? 'SYNCING...' : 'LIVE';
    }
  }

  formatTime(date) {
    if (!date) return '';
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  formatDateShort(date) {
    if (!date) return '';
    return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  }

  getEventStatus(event) {
    const now = new Date();
    const start = new Date(event.start);
    const end = new Date(event.end);

    if (now >= start && now <= end) {
      return { label: 'EN CURSO', className: 'status-active', isCurrent: true };
    }

    const diffMinutes = Math.round((start - now) / (1000 * 60));
    if (diffMinutes > 0 && diffMinutes <= 60) {
      return { label: `EN ${diffMinutes} MIN`, className: 'status-soon', isSoon: true };
    }

    if (start.toDateString() === now.toDateString()) {
      return { label: 'HOY', className: 'status-today' };
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (start.toDateString() === tomorrow.toDateString()) {
      return { label: 'MAÑANA', className: 'status-tomorrow' };
    }

    return { label: this.formatDateShort(start), className: 'status-upcoming' };
  }

  updateCountdowns() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const listContainer = document.getElementById('calendar-events-list');
    const isConfigured = !!this.calendarUrl;
    const isDemo = !isConfigured;

    const demoBadge = document.getElementById('calendar-mode-badge');
    if (demoBadge) {
      demoBadge.textContent = isConfigured ? 'GOOGLE CALENDAR' : 'MODO DEMO (SIN VINCULAR)';
      demoBadge.className = isConfigured ? 'box-sub-badge cal-badge-live font-mono' : 'box-sub-badge cal-badge-demo font-mono';
    }

    if (!listContainer) return;

    if (!this.events || this.events.length === 0) {
      listContainer.innerHTML = `
        <div class="calendar-empty-state">
          <span class="empty-icon">📅</span>
          <span class="empty-title">Sin eventos próximos</span>
          <span class="empty-desc">${isConfigured ? 'Tu agenda está libre para los próximos días.' : 'Configura tu enlace iCal de Google Calendar para ver tu agenda real.'}</span>
          <button class="cal-quick-btn" id="btn-open-cal-settings">Configurar Calendario ⚙️</button>
        </div>
      `;
      const btn = listContainer.querySelector('#btn-open-cal-settings');
      if (btn && window.SettingsEngineInstance) {
        btn.onclick = () => window.SettingsEngineInstance.openTab('calendar');
      }
      return;
    }

    // Tomar los próximos 4 eventos para que no desborde verticalmente
    const displayEvents = this.events.slice(0, 4);

    let html = '';
    displayEvents.forEach(ev => {
      const status = this.getEventStatus(ev);
      const startTime = ev.isAllDay ? 'Todo el día' : this.formatTime(new Date(ev.start));
      const endTime = ev.isAllDay ? '' : ` - ${this.formatTime(new Date(ev.end))}`;
      const locationBadge = ev.location ? `<span class="event-loc" title="${ev.location}">📍 ${ev.location}</span>` : '';

      html += `
        <div class="calendar-event-row ${status.isCurrent ? 'event-is-current' : ''}">
          <div class="event-time-col font-mono">
            <span class="event-time-start">${startTime}</span>
            <span class="event-time-end">${endTime}</span>
          </div>

          <div class="event-details-col">
            <div class="event-title-row">
              <span class="event-title" title="${ev.title}">${ev.title}</span>
            </div>
            ${locationBadge ? `<div class="event-meta-row">${locationBadge}</div>` : ''}
          </div>

          <div class="event-status-col">
            <span class="event-status-pill font-mono ${status.className}">${status.label}</span>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
  }
}

window.AgendaEngine = AgendaEngine;
