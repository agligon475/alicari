/**
 * ALICARI WALLPAPER - FINANCE & INVESTMENT ENGINE (4 CAJAS SEPARADAS)
 * - Caja 1: DIVISAS (USD Blue, USD Oficial, EUR, BRL)
 * - Caja 2: CRIPTOMONEDAS (UNI, FET, NEAR, ARB, BTC, ETH, ALI)
 * - Caja 3: CEDEARS (NVDA, TECO2, TEM)
 * - Caja 4: SUGERENCIAS DE INVERSIÓN (NVDA, BTC/ETH, LECAPS, ALI)
 * 
 * Funcionalidad de ordenamiento independiente por caja:
 * - "▲ Más subieron" (mayor a menor % de variación)
 * - "▼ Más bajaron" (menor a mayor % de variación)
 */

class FinanceEngine {
  constructor() {
    this.refreshInterval = 20 * 1000; // 20 segundos
    this.timerEl = document.getElementById('finance-timer');
    this.countdown = 20;
    this.timerInterval = null;

    // Estado de ordenamiento por cada caja ('desc' = más subieron, 'asc' = más bajaron)
    this.sortState = {
      fiat: 'desc',
      crypto: 'desc',
      cedear: 'desc',
      insights: 'desc'
    };

    // Referencias a los contenedores DOM de cada caja
    this.containers = {
      fiat: document.getElementById('list-fiat'),
      crypto: document.getElementById('list-crypto'),
      cedear: document.getElementById('list-cedear'),
      insights: document.getElementById('list-insights')
    };

    // Estado de datos estructurados en Pesos Argentinos (ARS)
    this.data = {
      // 1. DIVISAS
      fiat: [
        { id: 'usd-blue', name: 'Dólar Blue', symbol: 'USD BLUE', buy: 1380, sell: 1400, change: 1.08, currency: 'ARS', trend: [1360, 1370, 1365, 1380, 1395, 1400] },
        { id: 'usd-oficial', name: 'Dólar Oficial', symbol: 'USD OFIC.', buy: 1010, 1050: 1050, sell: 1050, change: 0.24, currency: 'ARS', trend: [1030, 1035, 1040, 1045, 1048, 1050] },
        { id: 'eur', name: 'Euro', symbol: 'EUR', buy: 1120, sell: 1165, change: -0.45, currency: 'ARS', trend: [1175, 1170, 1168, 1162, 1165, 1165] },
        { id: 'brl', name: 'Real Brasileño', symbol: 'BRL', buy: 195, sell: 208, change: 0.85, currency: 'ARS', trend: [202, 203, 204, 205, 206, 208] }
      ],

      // 2. CRIPTOMONEDAS
      crypto: [
        { id: 'uniswap', cgId: 'uniswap', name: 'Uniswap', symbol: 'UNI', price: 11480, change: 11.85, currency: 'ARS', trend: [10100, 10350, 10600, 10900, 11200, 11480] },
        { id: 'fetch-ai', cgId: 'fetch-ai', name: 'Artificial Superintel.', symbol: 'FET', price: 2030, change: -7.42, currency: 'ARS', trend: [2240, 2200, 2150, 2110, 2070, 2030] },
        { id: 'near', cgId: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 7280, change: 4.15, currency: 'ARS', trend: [6900, 7000, 7120, 7080, 7210, 7280] },
        { id: 'arbitrum', cgId: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', price: 868, change: -2.10, currency: 'ARS', trend: [890, 885, 878, 882, 870, 868] },
        { id: 'bitcoin', cgId: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 89600000, change: 2.45, currency: 'ARS', trend: [86500000, 87200000, 88100000, 87900000, 88900000, 89600000] },
        { id: 'ethereum', cgId: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3710000, change: -1.35, currency: 'ARS', trend: [3820000, 3790000, 3750000, 3760000, 3730000, 3710000] },
        { id: 'ali-token', cgId: null, name: 'Alicari Protocol', symbol: 'ALI', price: 20790, change: 14.20, isCustom: true, currency: 'ARS', trend: [17800, 18400, 19100, 19800, 20200, 20790] }
      ],

      // 3. CEDEARS
      cedear: [
        { id: 'nvda', name: 'NVIDIA Corp', symbol: 'NVDA', price: 17450, change: 12.80, currency: 'ARS', trend: [15200, 15800, 16200, 16700, 17100, 17450] },
        { id: 'teco2', name: 'Telecom Argentina', symbol: 'TECO2', price: 1980, change: -6.85, currency: 'ARS', trend: [2140, 2100, 2070, 2030, 2000, 1980] },
        { id: 'tem', name: 'Tenaris CEDEAR', symbol: 'TEM', price: 32800, change: 3.25, currency: 'ARS', trend: [31500, 31800, 32100, 32400, 32600, 32800] }
      ],

      // 4. SUGERENCIAS DE INVERSIÓN
      insights: [
        { id: 'ins-nvda', title: 'NVDA CEDEAR', tag: 'IA / TECH', badge: 'COMPRA FUERTE', badgeClass: 'buy', score: 14.5, desc: 'Expansión en demanda de GPUs Blackwell & Data Centers. Cobertura CCL.', horizon: '6-12m', risk: 'Moderado' },
        { id: 'ins-ali', title: 'ALI PROTOCOL', tag: 'ECOSISTEMA', badge: 'STAKING 14.2%', badgeClass: 'buy', score: 14.2, desc: 'Gobernanza y recompensas directas en ecosistema digital Alicari.', horizon: 'Flexible', risk: 'Moderado' },
        { id: 'ins-btc', title: 'BTC & ETH', tag: 'CRIPTO', badge: 'ACUMULAR (DCA)', badgeClass: 'accumulate', score: 8.8, desc: 'Inflows institucionales vía ETFs al contado y ciclo post-halving.', horizon: 'Largo', risk: 'Alto' },
        { id: 'ins-lecap', title: 'LECAPS PESOS', tag: 'RENTA FIJA', badge: 'CARRY TRADE', badgeClass: 'hedge', score: 4.2, desc: 'Devengamiento de tasa efectiva mensual ante ancla fiscal y estabilidad.', horizon: '30-90d', risk: 'Bajo' }
      ]
    };

    this.init();
  }

  init() {
    this.bindSortButtons();
    this.fetchAll();
    this.startCountdown();
  }

  bindSortButtons() {
    const buttons = document.querySelectorAll('.sort-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const box = btn.getAttribute('data-box');
        const sort = btn.getAttribute('data-sort'); // 'desc' o 'asc'
        
        // Actualizar clase activa en este grupo de botones
        const parent = btn.parentElement;
        parent.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.sortState[box] = sort;
        this.renderBox(box);
      });
    });
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

  async fetchAll() {
    this.simulateOrganicMovements();

    try {
      // Fetch Dólar (DolarAPI)
      const fiatPromise = fetch('https://dolarapi.com/v1/dolares')
        .then(r => r.json())
        .then(dolares => {
          const blue = dolares.find(d => d.casa === 'blue');
          const oficial = dolares.find(d => d.casa === 'oficial');
          if (blue) this.updateFiatItem('usd-blue', blue.compra, blue.venta);
          if (oficial) this.updateFiatItem('usd-oficial', oficial.compra, oficial.venta);
        }).catch(err => console.warn('[Finance] DolarAPI:', err.message));

      // Fetch Criptos (CoinGecko en ARS)
      const cgIds = 'bitcoin,ethereum,uniswap,fetch-ai,near,arbitrum';
      const cryptoPromise = fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=ars&include_24hr_change=true`)
        .then(r => r.json())
        .then(prices => {
          this.data.crypto.forEach(item => {
            if (item.cgId && prices[item.cgId]) {
              const arsPrice = Math.round(prices[item.cgId].ars);
              const change24h = prices[item.cgId].ars_24h_change;
              if (arsPrice) item.price = arsPrice;
              if (change24h !== undefined) item.change = +change24h.toFixed(2);
              item.trend.push(item.price);
              if (item.trend.length > 8) item.trend.shift();
            }
          });
        }).catch(err => console.warn('[Finance] CoinGecko:', err.message));

      await Promise.allSettled([fiatPromise, cryptoPromise]);
    } catch (e) {
      console.warn('[Finance] Fallback activo.');
    } finally {
      this.renderAllBoxes();
    }
  }

  simulateOrganicMovements() {
    const ali = this.data.crypto.find(c => c.id === 'ali-token');
    if (ali) {
      const delta = (Math.random() - 0.45) * 120;
      ali.price = Math.max(15000, Math.round(ali.price + delta));
      ali.trend.push(ali.price);
      if (ali.trend.length > 8) ali.trend.shift();
    }
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

  generateSparkline(values, strokeColor) {
    if (!values || values.length < 2) return '';
    const width = 48;
    const height = 18;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) || 1;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return `
      <svg class="sparkline-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <polyline fill="none" stroke="${strokeColor}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
      </svg>
    `;
  }

  formatARS(num) {
    if (num >= 1000000) return num.toLocaleString('es-AR', { maximumFractionDigits: 0 });
    if (num >= 100) return num.toLocaleString('es-AR', { maximumFractionDigits: 0 });
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  renderAllBoxes() {
    this.renderBox('fiat');
    this.renderBox('crypto');
    this.renderBox('cedear');
    this.renderBox('insights');
  }

  renderBox(boxKey) {
    const container = this.containers[boxKey];
    if (!container) return;

    if (boxKey === 'insights') {
      this.renderInsightsBox(container);
      return;
    }

    let items = [...this.data[boxKey]];
    const sortOrder = this.sortState[boxKey];

    // Ordenar por variación porcentual
    items.sort((a, b) => {
      const chA = a.change || 0;
      const chB = b.change || 0;
      return sortOrder === 'desc' ? (chB - chA) : (chA - chB);
    });

    let html = '';
    items.forEach(item => {
      const change = item.change || 0;
      const isPositive = change >= 0;
      const sign = isPositive ? '+' : '';

      let alertClass = '';
      let alertBadge = '';
      let strokeColor = isPositive ? '#00e676' : '#f60000';

      if (change <= -6.0) {
        alertClass = 'row-alert-crash';
        alertBadge = '<span class="alert-tag alert-tag-crash">▼ -6%</span>';
        strokeColor = '#f60000';
      } else if (change >= 10.0) {
        alertClass = 'row-alert-moon';
        alertBadge = '<span class="alert-tag alert-tag-moon">▲ +10%</span>';
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
              <span>${isPositive ? '▲' : '▼'}</span> ${sign}${change.toFixed(2)}%
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderInsightsBox(container) {
    let items = [...this.data.insights];
    const sortOrder = this.sortState.insights;

    items.sort((a, b) => {
      return sortOrder === 'desc' ? (b.score - a.score) : (a.score - b.score);
    });

    let html = '';
    items.forEach(ins => {
      html += `
        <article class="insight-card-compact">
          <div class="insight-header-row">
            <span class="insight-target">${ins.title} <span class="insight-tag-mini">${ins.tag}</span></span>
            <span class="insight-badge ${ins.badgeClass}">${ins.badge}</span>
          </div>
          <p class="insight-desc-compact">${ins.desc}</p>
          <div class="insight-meta-row-compact font-mono">
            <span>Plazo: <strong>${ins.horizon}</strong></span>
            <span>Riesgo: <strong>${ins.risk}</strong></span>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  }
}
