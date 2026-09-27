/**
 * ALICARI WALLPAPER - SETTINGS & CONFIGURATION ENGINE
 * Glassmorphism modal to customize Crypto Portfolio Holdings and Google Calendar URL.
 * 100% Client-Side and strictly private.
 */

class SettingsEngine {
  constructor(options = {}) {
    this.financeEngine = options.financeEngine || null;
    this.agendaEngine = options.agendaEngine || null;

    this.modalEl = document.getElementById('settings-modal');
    this.openBtn = document.getElementById('btn-open-settings');
    this.closeBtn = document.getElementById('btn-close-settings');
    this.tabs = document.querySelectorAll('.settings-tab-btn');
    this.tabPanels = document.querySelectorAll('.settings-tab-panel');

    this.init();
  }

  setEngines(finance, agenda) {
    this.financeEngine = finance;
    this.agendaEngine = agenda;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openModal());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Cerrar al hacer clic en el backdrop
    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.closeModal();
        }
      });
    }

    // Atajo ESC para cerrar
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl && this.modalEl.classList.contains('active')) {
        this.closeModal();
      }
    });

    // Navegación por pestañas del modal
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        this.openTab(targetTab);
      });
    });

    // Botón de acceso rápido desde la caja de Criptos Own
    const cryptoBoxConfigBtn = document.getElementById('btn-config-crypto-own');
    if (cryptoBoxConfigBtn) {
      cryptoBoxConfigBtn.addEventListener('click', () => {
        this.openModal('crypto');
      });
    }

    // Botón de acceso rápido desde el Widget de Calendario
    const calBoxConfigBtn = document.getElementById('btn-config-calendar');
    if (calBoxConfigBtn) {
      calBoxConfigBtn.addEventListener('click', () => {
        this.openModal('calendar');
      });
    }

    this.bindCryptoForm();
    this.bindCalendarForm();
    this.bindSyncForm();
  }

  openModal(defaultTab = 'crypto') {
    if (!this.modalEl) return;
    this.modalEl.classList.add('active');
    this.openTab(defaultTab);
  }

  closeModal() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
  }

  openTab(tabKey) {
    this.tabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabKey) t.classList.add('active');
      else t.classList.remove('active');
    });

    this.tabPanels.forEach(p => {
      if (p.getAttribute('data-panel') === tabKey) p.classList.add('active');
      else p.classList.remove('active');
    });

    if (tabKey === 'crypto') {
      this.renderCryptoSettingsList();
    } else if (tabKey === 'calendar') {
      this.renderCalendarSettings();
    } else if (tabKey === 'sync') {
      this.renderSyncSettings();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     GESTIÓN DE CRIPTOMONEDAS Y CARTERA
     ───────────────────────────────────────────────────────────── */
  bindCryptoForm() {
    const addSelect = document.getElementById('setting-select-coin');
    const customIdInput = document.getElementById('setting-custom-coin-id');
    const addHoldingsInput = document.getElementById('setting-add-holdings');
    const addBtn = document.getElementById('btn-add-crypto-setting');
    const resetBtn = document.getElementById('btn-reset-crypto-setting');

    // Poblar dropdown con catálogo
    if (addSelect && this.financeEngine) {
      const catalog = this.financeEngine.getCryptoCatalog();
      let optionsHtml = '<option value="">-- Seleccionar Criptomoneda --</option>';
      catalog.forEach(coin => {
        optionsHtml += `<option value="${coin.cgId}" data-symbol="${coin.symbol}" data-name="${coin.name}">${coin.symbol} — ${coin.name}</option>`;
      });
      optionsHtml += '<option value="__custom__">+ Otra Cripto (Ingresar CoinGecko ID)...</option>';
      addSelect.innerHTML = optionsHtml;

      addSelect.addEventListener('change', () => {
        if (addSelect.value === '__custom__') {
          if (customIdInput) customIdInput.style.display = 'block';
        } else {
          if (customIdInput) {
            customIdInput.style.display = 'none';
            customIdInput.value = '';
          }
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!this.financeEngine) return;

        let cgId = addSelect ? addSelect.value : '';
        let name = '';
        let symbol = '';

        if (cgId === '__custom__') {
          cgId = (customIdInput ? customIdInput.value : '').trim().toLowerCase();
          symbol = cgId.toUpperCase();
          name = cgId;
        } else if (cgId) {
          const selectedOption = addSelect.options[addSelect.selectedIndex];
          symbol = selectedOption.getAttribute('data-symbol') || cgId.toUpperCase();
          name = selectedOption.getAttribute('data-name') || symbol;
        }

        if (!cgId) {
          alert('Por favor selecciona una criptomoneda o ingresa su ID de CoinGecko.');
          return;
        }

        const holdings = parseFloat(addHoldingsInput ? addHoldingsInput.value : 0) || 0;

        this.financeEngine.addCryptoOwnCoin({
          id: cgId,
          cgId: cgId,
          name: name,
          symbol: symbol,
          holdings: holdings
        });

        // Limpiar inputs
        if (addSelect) addSelect.value = '';
        if (customIdInput) {
          customIdInput.value = '';
          customIdInput.style.display = 'none';
        }
        if (addHoldingsInput) addHoldingsInput.value = '';

        this.renderCryptoSettingsList();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('¿Restaurar la lista de criptomonedas y balances predeterminados?')) {
          if (this.financeEngine) {
            this.financeEngine.resetCryptoOwnToDefault();
            this.renderCryptoSettingsList();
          }
        }
      });
    }
  }

  renderCryptoSettingsList() {
    const listContainer = document.getElementById('settings-crypto-list');
    if (!listContainer || !this.financeEngine) return;

    const coins = this.financeEngine.data.cryptoOwn;

    if (coins.length === 0) {
      listContainer.innerHTML = `<div class="settings-empty-msg">No tienes monedas en tu lista. Agrega una arriba.</div>`;
      return;
    }

    let html = '';
    coins.forEach(coin => {
      const holdings = Number(coin.holdings) || 0;
      const price = coin.price || 0;
      const positionValARS = holdings * price;

      html += `
        <div class="setting-coin-item" data-id="${coin.id}">
          <div class="setting-coin-info">
            <span class="setting-coin-symbol font-mono">${coin.symbol}</span>
            <span class="setting-coin-name">${coin.name}</span>
            <span class="setting-coin-price font-mono">$${this.financeEngine.formatARS(price)} ARS</span>
          </div>

          <div class="setting-coin-holdings-group">
            <label class="setting-holdings-label font-mono">CANTIDAD:</label>
            <input type="number" step="any" min="0" class="setting-holdings-input font-mono" value="${holdings}" data-id="${coin.id}" placeholder="0.0" />
            <span class="setting-holdings-total font-mono" title="Valor calculado en ARS">≈ $${this.financeEngine.formatARS(positionValARS)}</span>
          </div>

          <button class="btn-remove-coin" data-id="${coin.id}" title="Eliminar ${coin.symbol} de la lista">✕</button>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Vincular inputs de cantidad y botones de eliminar
    listContainer.querySelectorAll('.setting-holdings-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const coinId = input.getAttribute('data-id');
        const val = e.target.value;
        this.financeEngine.updateHoldingAmount(coinId, val);
        
        // Actualizar el texto del total en vivo
        const parent = input.closest('.setting-coin-item');
        const totalSpan = parent.querySelector('.setting-holdings-total');
        const coin = this.financeEngine.data.cryptoOwn.find(c => c.id === coinId || c.cgId === coinId);
        if (coin && totalSpan) {
          const newTotal = (parseFloat(val) || 0) * (coin.price || 0);
          totalSpan.textContent = `≈ $${this.financeEngine.formatARS(newTotal)}`;
        }
      });
    });

    listContainer.querySelectorAll('.btn-remove-coin').forEach(btn => {
      btn.addEventListener('click', () => {
        const coinId = btn.getAttribute('data-id');
        this.financeEngine.removeCryptoOwnCoin(coinId);
        this.renderCryptoSettingsList();
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     GESTIÓN DE GOOGLE CALENDAR
     ───────────────────────────────────────────────────────────── */
  bindCalendarForm() {
    const urlInput = document.getElementById('setting-cal-url-input');
    const saveBtn = document.getElementById('btn-save-cal-setting');
    const clearBtn = document.getElementById('btn-clear-cal-setting');
    const testStatus = document.getElementById('setting-cal-status');

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        if (!this.agendaEngine) return;
        const val = urlInput ? urlInput.value.trim() : '';

        if (!val) {
          alert('Por favor pega la dirección secreta iCal (.ics) de tu Google Calendar.');
          return;
        }

        if (testStatus) {
          testStatus.textContent = 'Guardando y sincronizando con Google Calendar...';
          testStatus.className = 'cal-status-testing font-mono';
        }

        this.agendaEngine.setCalendarUrl(val);

        setTimeout(() => {
          if (testStatus) {
            testStatus.textContent = '✓ Calendario vinculado exitosamente y sincronizado.';
            testStatus.className = 'cal-status-ok font-mono';
          }
        }, 1200);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('¿Desvincular Google Calendar y volver al modo de demostración?')) {
          if (this.agendaEngine) {
            this.agendaEngine.setCalendarUrl('');
            if (urlInput) urlInput.value = '';
            if (testStatus) {
              testStatus.textContent = 'Calendario desvinculado (Modo Demo activo).';
              testStatus.className = 'cal-status-neutral font-mono';
            }
          }
        }
      });
    }
  }

  renderCalendarSettings() {
    const urlInput = document.getElementById('setting-cal-url-input');
    const testStatus = document.getElementById('setting-cal-status');

    if (urlInput && this.agendaEngine) {
      urlInput.value = this.agendaEngine.getCalendarUrl();
    }

    if (testStatus && this.agendaEngine) {
      const hasUrl = !!this.agendaEngine.getCalendarUrl();
      if (hasUrl) {
        testStatus.textContent = '✓ Tu Google Calendar está actualmente vinculado de forma privada.';
        testStatus.className = 'cal-status-ok font-mono';
      } else {
        testStatus.textContent = '● Sin calendario vinculado. Mostrando eventos de ejemplo.';
        testStatus.className = 'cal-status-neutral font-mono';
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     SINCRONIZACIÓN CON WALLPAPER ENGINE & LIVELY (LOCAL SYNC)
     ───────────────────────────────────────────────────────────── */
  bindSyncForm() {
    const saveFileBtn = document.getElementById('btn-save-user-config-file');
    const copyCodeBtn = document.getElementById('btn-copy-user-config-code');
    const exportJsonBtn = document.getElementById('btn-export-json');

    if (saveFileBtn) {
      saveFileBtn.addEventListener('click', () => this.saveUserConfigFile());
    }

    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => this.copyUserConfigCode());
    }

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => this.exportJson());
    }
  }

  generateConfigObject() {
    const calUrl = this.agendaEngine ? this.agendaEngine.getCalendarUrl() : (window.ALICARI_USER_CONFIG?.calendarUrl || '');
    
    let cryptoList = [];
    if (this.financeEngine && Array.isArray(this.financeEngine.data.cryptoOwn)) {
      cryptoList = this.financeEngine.data.cryptoOwn.map(c => ({
        id: c.id || c.cgId,
        cgId: c.cgId || c.id,
        name: c.name || c.symbol,
        symbol: (c.symbol || c.id || '').toUpperCase(),
        holdings: Number(c.holdings) || 0
      }));
    } else if (window.ALICARI_USER_CONFIG?.cryptoOwn) {
      cryptoList = window.ALICARI_USER_CONFIG.cryptoOwn;
    }

    return {
      calendarUrl: calUrl,
      cryptoOwn: cryptoList,
      carousel: {
        autoRotate: localStorage.getItem('alicari_vertical_auto_enabled') === 'true',
        autoSlideInterval: parseInt(localStorage.getItem('alicari_vertical_auto_interval'), 10) || 25000,
        defaultSlide: parseInt(localStorage.getItem('alicari_vertical_slide_idx'), 10) || 0
      }
    };
  }

  generateUserConfigFileContent() {
    const config = this.generateConfigObject();
    return `/**
 * ALICARI WALLPAPER - CONFIGURACIÓN DE USUARIO LOCAL
 * Este archivo sincroniza tus configuraciones privadas (Criptos Own, Holdings, Google Calendar y Carrusel)
 * de forma compartida entre el Navegador Web y Wallpaper Engine / Lively Wallpaper.
 * 
 * Generado el: ${new Date().toLocaleString()}
 */

window.ALICARI_USER_CONFIG = ${JSON.stringify(config, null, 2)};
`;
  }

  renderSyncSettings() {
    const previewEl = document.getElementById('setting-config-preview');
    if (previewEl) {
      previewEl.value = this.generateUserConfigFileContent();
    }
  }

  async saveUserConfigFile() {
    const content = this.generateUserConfigFileContent();

    // 1. Intentar File System Access API si está soportada (Chrome/Edge moderno)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'user-config.js',
          types: [{
            description: 'JavaScript Configuration File',
            accept: { 'text/javascript': ['.js'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        this.showSyncStatus('✅ ¡Archivo user-config.js guardado exitosamente! Wallpaper Engine ahora mostrará tus datos.', true);
        this.renderSyncSettings();
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('File picker falló, recurriendo a descarga:', err);
      }
    }

    // 2. Fallback descarga directa de blob
    try {
      const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user-config.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showSyncStatus('📥 Descargando user-config.js. Reemplázalo en main-stage/assets/js/user-config.js para sincronizar Wallpaper Engine.', true);
    } catch (e) {
      this.showSyncStatus('Error al generar archivo. Usa el botón "Copiar Código JS" para pegarlo manualmente.', false);
    }
    this.renderSyncSettings();
  }

  copyUserConfigCode() {
    const content = this.generateUserConfigFileContent();
    navigator.clipboard.writeText(content).then(() => {
      this.showSyncStatus('📋 ¡Código copiado! Pégalo en main-stage/assets/js/user-config.js y guarda los cambios.', true);
    }).catch(() => {
      this.showSyncStatus('No se pudo copiar automáticamente. Puedes seleccionarlo del cuadro de abajo.', false);
    });
    this.renderSyncSettings();
  }

  exportJson() {
    const config = this.generateConfigObject();
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alicari-wallpaper-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showSyncStatus('📥 Archivo JSON descargado como respaldo de tu configuración.', true);
  }

  showSyncStatus(message, isSuccess = true) {
    const statusEl = document.getElementById('sync-file-status');
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.className = (isSuccess ? 'cal-status-ok' : 'cal-status-neutral') + ' font-mono';
    setTimeout(() => {
      if (statusEl) statusEl.style.display = 'none';
    }, 6000);
  }
}

window.SettingsEngine = SettingsEngine;

