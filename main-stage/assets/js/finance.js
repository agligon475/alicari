/**
 * ALICARI WALLPAPER - FINANCE & CRYPTO ENGINE
 * Live currency exchange rates (USD, EUR, BRL) & Crypto assets (BTC, ETH, USDT, ALI Token)
 * Built-in dynamic SVG Sparklines and offline fallback
 */

class FinanceEngine {
  constructor(options = {}) {
    this.tableContainer = document.getElementById(options.containerId || 'finance-list');
    this.refreshInterval = options.refreshInterval || 45 * 1000; // 45s
    this.lastUpdateEl = document.getElementById('finance-updated');
    this.activeTab = 'all'; // 'all', 'fiat', 'crypto'

    // Estado de datos
    this.data = {
      fiat: [
        { id: 'usd-blue', name: 'Dólar Blue', symbol: 'USD BLUE', buy: 1380, sell: 1400, change: 1.08, currency: 'ARS', trend: [1360, 1370, 1365, 1380, 1395, 1390, 1400] },
        { id: 'usd-oficial', name: 'Dólar Oficial', symbol: 'USD OFICIAL', buy: 1010, sell: 1050, change: 0.24, currency: 'ARS', trend: [1030, 1035, 1040, 1042, 1045, 1048, 1050] },
        { id: 'eur', name: 'Euro', symbol: 'EUR / ARS', buy: 1120, sell: 1165, change: -0.45, currency: 'ARS', trend: [1175, 1170, 1168, 1162, 1165, 1160, 1165] },
        { id: 'brl', name: 'Real Brasileño', symbol: 'BRL / ARS', buy: 195, sell: 208, change: 0.85, currency: 'ARS', trend: [202, 203, 204, 205, 206, 207, 208] }
      ],
      crypto: [
        { id: 'ali-token', name: 'Alicari Protocol', symbol: 'ALI / USD', price: 14.85, change: 5.82, isCustom: true, currency: 'USD', trend: [13.2, 13.6, 13.9, 14.1, 14.4, 14.2, 14.85] },
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC / USD', price: 63850, change: 2.15, currency: 'USD', trend: [62100, 62500, 63000, 62800, 63400, 63100, 63850] },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH / USD', price: 2640, change: -1.12, currency: 'USD', trend: [2710, 2690, 2670, 2680, 2650, 2630, 2640] },
        { id: 'tether', name: 'Tether USDT', symbol: 'USDT / USD', price: 1.00, change: 0.02, currency: 'USD', trend: [1.00, 1.001, 0.999, 1.00, 1.001, 1.00, 1.00] }
      ]
    };

    this.init();
  }

  init() {
    this.bindTabs();
    this.fetchAll();
    setInterval(() => this.fetchAll(), this.refreshInterval);
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
    // Simular pequeña variación orgánica en ALI Token
    const ali = this.data.crypto.find(c => c.id === 'ali-token');
    if (ali) {
      const delta = (Math.random() - 0.48) * 0.15;
      ali.price = +(ali.price + delta).toFixed(2);
      ali.trend.push(ali.price);
      if (ali.trend.length > 8) ali.trend.shift();
    }

    try {
      // 1. Fetch Dólares y Divisas
      const fiatPromise = fetch('https://dolarapi.com/v1/dolares')
        .then(r => r.json())
        .then(dolares => {
          const blue = dolares.find(d => d.casa === 'blue');
          const oficial = dolares.find(d => d.casa === 'oficial');
          if (blue) {
            this.updateFiatItem('usd-blue', blue.compra, blue.venta);
          }
          if (oficial) {
            this.updateFiatItem('usd-oficial', oficial.compra, oficial.venta);
          }
        }).catch(err => console.warn('[Finance] DolarAPI no disponible:', err.message));

      // 2. Fetch Criptomonedas (CoinGecko Simple Price)
      const cryptoPromise = fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd&include_24hr_change=true')
        .then(r => r.json())
        .then(cryptos => {
          if (cryptos.bitcoin) {
            this.updateCryptoItem('bitcoin', cryptos.bitcoin.usd, cryptos.bitcoin.usd_24h_change);
          }
          if (cryptos.ethereum) {
            this.updateCryptoItem('ethereum', cryptos.ethereum.usd, cryptos.ethereum.usd_24h_change);
          }
          if (cryptos.tether) {
            this.updateCryptoItem('tether', cryptos.tether.usd, cryptos.tether.usd_24h_change);
          }
        }).catch(err => console.warn('[Finance] CoinGecko no disponible:', err.message));

      await Promise.allSettled([fiatPromise, cryptoPromise]);
    } catch (e) {
      console.warn('[Finance] Fallback activado.');
    } finally {
      this.render();
      if (this.lastUpdateEl) {
        const d = new Date();
        this.lastUpdateEl.textContent = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
      }
    }
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

  updateCryptoItem(id, price, change) {
    const item = this.data.crypto.find(c => c.id === id);
    if (item && price) {
      item.price = price;
      if (change !== undefined && change !== null) {
        item.change = +change.toFixed(2);
      }
      item.trend.push(price);
      if (item.trend.length > 8) item.trend.shift();
    }
  }

  // Genera un gráfico SVG Sparkline minimalista y suave
  generateSparkline(values, isPositive) {
    if (!values || values.length < 2) return '';
    const width = 64;
    const height = 22;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) || 1;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#00e676' : '#f60000';

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

  formatNumber(num, isCurrency = false, currency = 'USD') {
    if (num >= 1000) {
      return num.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  render() {
    if (!this.tableContainer) return;

    let itemsToRender = [];
    if (this.activeTab === 'all') {
      itemsToRender = [...this.data.crypto, ...this.data.fiat];
    } else if (this.activeTab === 'fiat') {
      itemsToRender = this.data.fiat;
    } else if (this.activeTab === 'crypto') {
      itemsToRender = this.data.crypto;
    }

    let html = '';

    itemsToRender.forEach(item => {
      const isPositive = item.change >= 0;
      const changeClass = isPositive ? 'val-positive' : 'val-negative';
      const sign = isPositive ? '+' : '';
      const spark = this.generateSparkline(item.trend, isPositive);

      const isCustomBadge = item.isCustom ? '<span class="custom-badge">OFICIAL</span>' : '';
      const priceFormatted = item.sell 
        ? `$${this.formatNumber(item.sell)} <span class="sub-price">/ $${this.formatNumber(item.buy)}</span>`
        : `$${this.formatNumber(item.price)} <span class="sub-cur">${item.currency}</span>`;

      html += `
        <div class="finance-row ${item.isCustom ? 'is-featured' : ''}">
          <div class="fin-col fin-asset">
            <div class="fin-symbol-box">
              <span class="fin-symbol">${item.symbol}</span>
              ${isCustomBadge}
            </div>
            <span class="fin-name">${item.name}</span>
          </div>

          <div class="fin-col fin-chart">
            ${spark}
          </div>

          <div class="fin-col fin-price">
            <div class="fin-val font-mono">${priceFormatted}</div>
            <div class="fin-change ${changeClass} font-mono">
              <span class="arrow">${isPositive ? '▲' : '▼'}</span> ${sign}${item.change.toFixed(2)}%
            </div>
          </div>
        </div>
      `;
    });

    this.tableContainer.innerHTML = html;
  }
}
