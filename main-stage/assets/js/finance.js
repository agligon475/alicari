/**
 * ALICARI WALLPAPER - FINANCE & CRYPTO ENGINE
 * Activos en Pesos Argentinos (ARS):
 * - Criptos: UNI, FET, NEAR, ARB, BTC, ETH (+ ALI Token)
 * - CEDEARs: NVDA, TECO2, TEM
 * - Divisas: USD Blue, USD Oficial, EUR, BRL
 * 
 * SISTEMA DE ALERTAS VISUALES:
 * - Variación < -6%: Alerta ROJA (Fila completa en rojo pulsante con badge CRASH)
 * - Variación > +10%: Alerta VERDE (Fila completa en verde brillante con badge BOOM)
 */

class FinanceEngine {
  constructor(options = {}) {
    this.tableContainer = document.getElementById(options.containerId || 'finance-list');
    this.refreshInterval = 20 * 1000; // Exactamente 20 segundos
    this.lastUpdateEl = document.getElementById('finance-updated');
    this.timerEl = document.getElementById('finance-timer');
    this.activeTab = 'all'; // 'all', 'crypto', 'cedear', 'fiat'
    this.countdown = 20;
    this.timerInterval = null;

    // Dólar Blue de referencia para conversiones dinámicas a ARS
    this.usdPriceARS = 1400;

    // Estado inicial de datos estructurados en ARS
    this.data = {
      // ══════════════════════════════════════════════
      // 1. CRIPTOMONEDAS (EN PESOS ARGENTINOS)
      // ══════════════════════════════════════════════
      crypto: [
        { 
          id: 'bitcoin', 
          cgId: 'bitcoin',
          name: 'Bitcoin', 
          symbol: 'BTC', 
          price: 89600000, 
          change: 2.45, 
          currency: 'ARS',
          trend: [86500000, 87200000, 88100000, 87900000, 88900000, 89600000]
        },
        { 
          id: 'ethereum', 
          cgId: 'ethereum',
          name: 'Ethereum', 
          symbol: 'ETH', 
          price: 3710000, 
          change: -1.35, 
          currency: 'ARS',
          trend: [3820000, 3790000, 3750000, 3760000, 3730000, 3710000]
        },
        { 
          id: 'uniswap', 
          cgId: 'uniswap',
          name: 'Uniswap', 
          symbol: 'UNI', 
          price: 11480, 
          change: 11.85, // Dispara alerta verde > 10%
          currency: 'ARS',
          trend: [10100, 10350, 10600, 10900, 11200, 11480]
        },
        { 
          id: 'fetch-ai', 
          cgId: 'fetch-ai',
          name: 'Artificial Superintelligence', 
          symbol: 'FET', 
          price: 2030, 
          change: -7.42, // Dispara alerta roja < -6%
          currency: 'ARS',
          trend: [2240, 2200, 2150, 2110, 2070, 2030]
        },
        { 
          id: 'near', 
          cgId: 'near',
          name: 'NEAR Protocol', 
          symbol: 'NEAR', 
          price: 7280, 
          change: 4.15, 
          currency: 'ARS',
          trend: [6900, 7000, 7120, 7080, 7210, 7280]
        },
        { 
          id: 'arbitrum', 
          cgId: 'arbitrum',
          name: 'Arbitrum', 
          symbol: 'ARB', 
          price: 868, 
          change: -2.10, 
          currency: 'ARS',
          trend: [890, 885, 878, 882, 870, 868]
        },
        { 
          id: 'ali-token', 
          cgId: null,
          name: 'Alicari Protocol', 
          symbol: 'ALI', 
          price: 20790, 
          change: 14.20, // Dispara alerta verde > 10%
          isCustom: true,
          currency: 'ARS',
          trend: [17800, 18400, 19100, 19800, 20200, 20790]
        }
      ],

      // ══════════════════════════════════════════════
      // 2. CEDEARS & ACCIONES (EN PESOS ARGENTINOS)
      // ══════════════════════════════════════════════
      cedear: [
        { 
          id: 'nvda', 
          name: 'NVIDIA Corp', 
          symbol: 'NVDA', 
          price: 17450, 
          change: 12.80, // Dispara alerta verde > 10%
          currency: 'ARS',
          trend: [15200, 15800, 16200, 16700, 17100, 17450]
        },
        { 
          id: 'teco2', 
          name: 'Telecom Argentina', 
          symbol: 'TECO2', 
          price: 1980, 
          change: -6.85, // Dispara alerta roja < -6%
          currency: 'ARS',
          trend: [2140, 2100, 2070, 2030, 2000, 1980]
        },
        { 
          id: 'tem', 
          name: 'Tenaris / TEM CEDEAR', 
          symbol: 'TEM', 
          price: 32800, 
          change: 3.25, 
          currency: 'ARS',
          trend: [31500, 31800, 32100, 32400, 32600, 32800]
        }
      ],

      // ══════════════════════════════════════════════
      // 3. DIVISAS (EN PESOS ARGENTINOS)
      // ══════════════════════════════════════════════
      fiat: [
        { 
          id: 'usd-blue', 
          name: 'Dólar Blue', 
          symbol: 'USD BLUE', 
          buy: 1380, 
          sell: 1400, 
          change: 1.08, 
          currency: 'ARS', 
          trend: [1360, 1370, 1365, 1380, 1395, 1400] 
        },
        { 
          id: 'usd-oficial', 
          name: 'Dólar Oficial', 
          symbol: 'USD OFIC.', 
          buy: 1010, 
          sell: 1050, 
          change: 0.24, 
          currency: 'ARS', 
          trend: [1030, 1035, 1040, 1045, 1048, 1050] 
        },
        { 
          id: 'eur', 
          name: 'Euro', 
          symbol: 'EUR', 
          buy: 1120, 
          sell: 1165, 
          change: -0.45, 
          currency: 'ARS', 
          trend: [1175, 1170, 1168, 1162, 1165, 1165] 
        },
        { 
          id: 'brl', 
          name: 'Real Brasileño', 
          symbol: 'BRL', 
          buy: 195, 
          sell: 208, 
          change: 0.85, 
          currency: 'ARS', 
          trend: [202, 203, 204, 205, 206, 208] 
        }
      ]
    };

    this.init();
  }

  init() {
    this.bindTabs();
    this.fetchAll();
    this.startCountdown();
  }

  startCountdown() {
    this.countdown = 20;
    this.updateTimerDisplay();

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.countdown--;
      this.updateTimerDisplay();

      if (this.countdown <= 0) {
        this.countdown = 20;
        this.fetchAll();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (this.timerEl) {
      this.timerEl.textContent = `${this.countdown}s`;
    }
  }

  bindTabs() {
    const tabs = document.querySelectorAll('.finance-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.getAttribute('data-tab');
        this.render();
      });
    });
  }

  async fetchAll() {
    // 1. Simulación viva de microfluctuaciones de mercado para que nunca se congele
    this.simulateOrganicMovements();

    try {
      // 2. Fetch Dólar y Divisas reales (DolarAPI)
      const fiatPromise = fetch('https://dolarapi.com/v1/dolares')
        .then(r => r.json())
        .then(dolares => {
          const blue = dolares.find(d => d.casa === 'blue');
          const oficial = dolares.find(d => d.casa === 'oficial');
          if (blue) {
            this.usdPriceARS = blue.venta || 1400;
            this.updateFiatItem('usd-blue', blue.compra, blue.venta);
          }
          if (oficial) {
            this.updateFiatItem('usd-oficial', oficial.compra, oficial.venta);
          }
        }).catch(err => console.warn('[Finance] DolarAPI offline/rate-limited:', err.message));

      // 3. Fetch Criptomonedas (CoinGecko en ARS)
      // UNI, FET, NEAR, ARB, BTC, ETH
      const cgIds = 'bitcoin,ethereum,uniswap,fetch-ai,near,arbitrum';
      const cryptoPromise = fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=ars&include_24hr_change=true`)
        .then(r => r.json())
        .then(prices => {
          this.data.crypto.forEach(item => {
            if (item.cgId && prices[item.cgId]) {
              const arsPrice = Math.round(prices[item.cgId].ars);
              const change24h = prices[item.cgId].ars_24h_change;
              if (arsPrice) item.price = arsPrice;
              if (change24h !== undefined && change24h !== null) {
                item.change = +change24h.toFixed(2);
              }
              item.trend.push(item.price);
              if (item.trend.length > 8) item.trend.shift();
            }
          });
        }).catch(err => console.warn('[Finance] CoinGecko offline/rate-limited:', err.message));

      await Promise.allSettled([fiatPromise, cryptoPromise]);
    } catch (e) {
      console.warn('[Finance] Fallback activo.');
    } finally {
      this.render();
      if (this.lastUpdateEl) {
        const d = new Date();
        this.lastUpdateEl.textContent = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
      }
    }
  }

  simulateOrganicMovements() {
    // ALI Token
    const ali = this.data.crypto.find(c => c.id === 'ali-token');
    if (ali) {
      const delta = (Math.random() - 0.45) * 120;
      ali.price = Math.max(15000, Math.round(ali.price + delta));
      ali.trend.push(ali.price);
      if (ali.trend.length > 8) ali.trend.shift();
    }

    // Micro fluctuación en CEDEARs para realismo
    this.data.cedear.forEach(ced => {
      const delta = (Math.random() - 0.5) * (ced.price * 0.003);
      ced.price = Math.round(ced.price + delta);
      ced.trend.push(ced.price);
      if (ced.trend.length > 8) ced.trend.shift();
    });
  }

  updateFiatItem(id, buy, sell) {
    const item = this.data.fiat.find(f => f.id === id);
    if (item && buy && sell) {
      item.buy = buy;
      item.sell = sell;
      item.trend.push(sell);
      if (item.trend.length > 8) item.trend.shift();
    }
  }

  // Genera un gráfico SVG Sparkline minimalista con el color de alerta o tendencia
  generateSparkline(values, strokeColor) {
    if (!values || values.length < 2) return '';
    const width = 56;
    const height = 20;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) || 1;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return `
      <svg class="sparkline-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <polyline
          fill="none"
          stroke="${strokeColor}"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="${points}"
        />
      </svg>
    `;
  }

  formatARS(num) {
    if (num >= 1000000) {
      return num.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    if (num >= 100) {
      return num.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  render() {
    if (!this.tableContainer) return;

    let itemsToRender = [];
    if (this.activeTab === 'all') {
      itemsToRender = [...this.data.crypto, ...this.data.cedear, ...this.data.fiat];
    } else if (this.activeTab === 'crypto') {
      itemsToRender = this.data.crypto;
    } else if (this.activeTab === 'cedear') {
      itemsToRender = this.data.cedear;
    } else if (this.activeTab === 'fiat') {
      itemsToRender = this.data.fiat;
    }

    let html = '';

    itemsToRender.forEach(item => {
      const change = item.change || 0;
      const isPositive = change >= 0;
      const sign = isPositive ? '+' : '';

      // ══════════════════════════════════════════════════════════════
      // SISTEMA DE ALERTAS:
      // - Baja > 6%  (<= -6.00%) -> ALERTA ROJA (Fila completa en rojo)
      // - Suba > 10% (>= +10.00%) -> ALERTA VERDE (Fila completa en verde)
      // ══════════════════════════════════════════════════════════════
      let alertClass = '';
      let alertBadge = '';
      let strokeColor = isPositive ? '#00e676' : '#f60000';

      if (change <= -6.0) {
        alertClass = 'row-alert-crash';
        alertBadge = '<span class="alert-tag alert-tag-crash">▼ CAÍDA -6%</span>';
        strokeColor = '#f60000';
      } else if (change >= 10.0) {
        alertClass = 'row-alert-moon';
        alertBadge = '<span class="alert-tag alert-tag-moon">▲ SUBA +10%</span>';
        strokeColor = '#00e676';
      }

      const spark = this.generateSparkline(item.trend, strokeColor);
      const isCustomBadge = item.isCustom ? '<span class="custom-badge">OFICIAL</span>' : '';

      const priceFormatted = item.sell 
        ? `$${this.formatARS(item.sell)} <span class="sub-price">/ $${this.formatARS(item.buy)}</span>`
        : `$${this.formatARS(item.price)} <span class="sub-cur">ARS</span>`;

      html += `
        <div class="finance-row ${alertClass} ${item.isCustom ? 'is-featured' : ''}">
          <div class="fin-col fin-asset">
            <div class="fin-symbol-box">
              <span class="fin-symbol">${item.symbol}</span>
              ${isCustomBadge}
              ${alertBadge}
            </div>
            <span class="fin-name">${item.name}</span>
          </div>

          <div class="fin-col fin-chart">
            ${spark}
          </div>

          <div class="fin-col fin-price">
            <div class="fin-val font-mono">${priceFormatted}</div>
            <div class="fin-change ${isPositive ? 'val-positive' : 'val-negative'} font-mono">
              <span class="arrow">${isPositive ? '▲' : '▼'}</span> ${sign}${change.toFixed(2)}%
            </div>
          </div>
        </div>
      `;
    });

    this.tableContainer.innerHTML = html;
  }
}
