/**
 * ALICARI WALLPAPER - FINANCE & INVESTMENT ENGINE (5 CAJAS SEPARADAS)
 * 1. DIVISAS (USD Blue, Oficial, MEP, CCL, Tarjeta, EUR, BRL)
 * 2. CRIPTOS OWN (BTC, ETH, SOL, NEAR, UNI, ARB, FET, RENDER, BNB, AVAX)
 * 3. CRIPTOS GLOBAL (Las 10 criptos con mayor variación 24h - Top Subas o Bajas)
 * 4. CEDEARS (NVDA, AAPL, MSFT, GOOGL, TSLA, MELI, SPY, TECO2, TEM, VIST)
 * 5. INVERSIONES (Tesis reales de mercado: NVDA, LECAPS, BTC/ETH, SPY, ENERGÍA)
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
      cryptoOwn: 'desc',
      cryptoGlobal: 'desc',
      cedear: 'desc',
      insights: 'desc'
    };

    // Referencias a los contenedores DOM de cada una de las 5 cajas
    this.containers = {
      fiat: document.getElementById('list-fiat'),
      cryptoOwn: document.getElementById('list-crypto-own'),
      cryptoGlobal: document.getElementById('list-crypto-global'),
      cedear: document.getElementById('list-cedear'),
      insights: document.getElementById('list-insights')
    };

    // Estado de datos estructurados
    this.data = {
      // 1. DIVISAS
      fiat: [
        { id: 'usd-blue', name: 'Dólar Blue', symbol: 'USD BLUE', buy: 1380, sell: 1400, change: 1.08, currency: 'ARS', trend: [1360, 1370, 1365, 1380, 1395, 1400] },
        { id: 'usd-oficial', name: 'Dólar Oficial', symbol: 'USD OFIC.', buy: 1010, sell: 1050, change: 0.24, currency: 'ARS', trend: [1030, 1035, 1040, 1045, 1048, 1050] },
        { id: 'usd-mep', name: 'Dólar MEP', symbol: 'USD MEP', buy: 1345, sell: 1355, change: -0.65, currency: 'ARS', trend: [1370, 1365, 1360, 1358, 1352, 1355] },
        { id: 'usd-ccl', name: 'Dólar CCL', symbol: 'USD CCL', buy: 1375, sell: 1390, change: 0.72, currency: 'ARS', trend: [1365, 1370, 1380, 1378, 1385, 1390] },
        { id: 'usd-tarjeta', name: 'Dólar Tarjeta', symbol: 'USD TARJ.', buy: 1640, sell: 1680, change: 0.15, currency: 'ARS', trend: [1660, 1665, 1670, 1675, 1678, 1680] },
        { id: 'eur', name: 'Euro', symbol: 'EUR', buy: 1120, sell: 1165, change: -0.45, currency: 'ARS', trend: [1175, 1170, 1168, 1162, 1165, 1165] },
        { id: 'brl', name: 'Real Brasileño', symbol: 'BRL', buy: 195, sell: 208, change: 0.85, currency: 'ARS', trend: [202, 203, 204, 205, 206, 208] }
      ],

      // 2. CRIPTOS OWN (Cartera / Activos seleccionados)
      cryptoOwn: [
        { id: 'bitcoin', cgId: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 92450000, change: 3.45, currency: 'ARS', trend: [88500000, 89200000, 90100000, 91200000, 91900000, 92450000] },
        { id: 'ethereum', cgId: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3820000, change: -1.15, currency: 'ARS', trend: [3890000, 3860000, 3840000, 3850000, 3830000, 3820000] },
        { id: 'solana', cgId: 'solana', name: 'Solana', symbol: 'SOL', price: 195000, change: 8.75, currency: 'ARS', trend: [175000, 179000, 184000, 188000, 191000, 195000] },
        { id: 'uniswap', cgId: 'uniswap', name: 'Uniswap', symbol: 'UNI', price: 11480, change: 11.85, currency: 'ARS', trend: [10100, 10350, 10600, 10900, 11200, 11480] },
        { id: 'near', cgId: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 7280, change: 4.15, currency: 'ARS', trend: [6900, 7000, 7120, 7080, 7210, 7280] },
        { id: 'arbitrum', cgId: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', price: 868, change: -2.10, currency: 'ARS', trend: [890, 885, 878, 882, 870, 868] },
        { id: 'fetch-ai', cgId: 'fetch-ai', name: 'Artificial Superintel.', symbol: 'FET', price: 2030, change: 6.42, currency: 'ARS', trend: [1890, 1920, 1960, 1990, 2010, 2030] },
        { id: 'render-token', cgId: 'render-token', name: 'Render Token', symbol: 'RENDER', price: 8950, change: 14.80, currency: 'ARS', trend: [7700, 7950, 8200, 8500, 8750, 8950] }
      ],

      // 3. CRIPTOS GLOBAL (Top 10 Movers del mercado cripto)
      cryptoGlobal: [
        { id: 'sui', name: 'Sui Network', symbol: 'SUI', priceUSD: 3.42, change: 28.40, rank: 1, trend: [2.65, 2.78, 2.95, 3.12, 3.30, 3.42] },
        { id: 'pepe', name: 'Pepe', symbol: 'PEPE', priceUSD: 0.0000185, change: 24.15, rank: 2, trend: [0.0000148, 0.0000155, 0.0000168, 0.0000174, 0.0000185] },
        { id: 'tia', name: 'Celestia', symbol: 'TIA', priceUSD: 7.85, change: 19.80, rank: 3, trend: [6.50, 6.75, 7.10, 7.45, 7.68, 7.85] },
        { id: 'inj', name: 'Injective', symbol: 'INJ', priceUSD: 24.60, change: 17.20, rank: 4, trend: [20.90, 21.40, 22.50, 23.20, 24.10, 24.60] },
        { id: 'render-token', name: 'Render', symbol: 'RENDER', priceUSD: 6.55, change: 15.60, rank: 5, trend: [5.60, 5.80, 6.05, 6.25, 6.40, 6.55] },
        { id: 'bittensor', name: 'Bittensor (TAO)', symbol: 'TAO', priceUSD: 540.00, change: 14.80, rank: 6, trend: [468, 485, 502, 520, 532, 540] },
        { id: 'fetch-ai', name: 'FET / ASI', symbol: 'FET', priceUSD: 1.48, change: 12.30, rank: 7, trend: [1.31, 1.35, 1.39, 1.42, 1.45, 1.48] },
        { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', priceUSD: 8.40, change: 11.85, rank: 8, trend: [7.48, 7.65, 7.88, 8.10, 8.25, 8.40] },
        { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', priceUSD: 5.32, change: 9.50, rank: 9, trend: [4.85, 4.95, 5.08, 5.15, 5.24, 5.32] },
        { id: 'solana', name: 'Solana', symbol: 'SOL', priceUSD: 142.50, change: 8.40, rank: 10, trend: [131, 134, 137, 139, 141, 142.5] },
        // Pool de caídas para ordenamiento descendente/ascendente
        { id: 'starknet', name: 'Starknet', symbol: 'STRK', priceUSD: 0.44, change: -14.20, rank: 11, trend: [0.52, 0.50, 0.48, 0.46, 0.45, 0.44] },
        { id: 'worldcoin-wld', name: 'Worldcoin', symbol: 'WLD', priceUSD: 1.95, change: -11.50, rank: 12, trend: [2.22, 2.15, 2.08, 2.02, 1.98, 1.95] },
        { id: 'dydx', name: 'dYdX', symbol: 'DYDX', priceUSD: 1.12, change: -9.80, rank: 13, trend: [1.25, 1.22, 1.18, 1.15, 1.14, 1.12] },
        { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', priceUSD: 0.63, change: -8.20, rank: 14, trend: [0.69, 0.67, 0.66, 0.65, 0.64, 0.63] },
        { id: 'optimism', name: 'Optimism', symbol: 'OP', priceUSD: 1.45, change: -7.40, rank: 15, trend: [1.58, 1.55, 1.51, 1.48, 1.46, 1.45] }
      ],

      // 4. CEDEARS
      cedear: [
        { id: 'nvda', name: 'NVIDIA Corp', symbol: 'NVDA', price: 17450, change: 12.80, currency: 'ARS', trend: [15200, 15800, 16200, 16700, 17100, 17450] },
        { id: 'aapl', name: 'Apple Inc', symbol: 'AAPL', price: 19800, change: 2.45, currency: 'ARS', trend: [19200, 19350, 19500, 19620, 19740, 19800] },
        { id: 'msft', name: 'Microsoft Corp', symbol: 'MSFT', price: 21500, change: 1.90, currency: 'ARS', trend: [21000, 21150, 21250, 21380, 21450, 21500] },
        { id: 'googl', name: 'Alphabet Google', symbol: 'GOOGL', price: 14200, change: -1.35, currency: 'ARS', trend: [14500, 14420, 14350, 14300, 14250, 14200] },
        { id: 'tsla', name: 'Tesla Inc', symbol: 'TSLA', price: 16800, change: -4.20, currency: 'ARS', trend: [17600, 17400, 17200, 17050, 16920, 16800] },
        { id: 'meli', name: 'MercadoLibre', symbol: 'MELI', price: 34500, change: 5.60, currency: 'ARS', trend: [32500, 32900, 33400, 33800, 34200, 34500] },
        { id: 'spy', name: 'SPDR S&P 500', symbol: 'SPY', price: 28900, change: 1.40, currency: 'ARS', trend: [28400, 28550, 28680, 28750, 28820, 28900] },
        { id: 'vist', name: 'Vista Energy', symbol: 'VIST', price: 27800, change: 6.90, currency: 'ARS', trend: [25900, 26300, 26800, 27100, 27500, 27800] },
        { id: 'tem', name: 'Tenaris CEDEAR', symbol: 'TEM', price: 32800, change: 3.25, currency: 'ARS', trend: [31500, 31800, 32100, 32400, 32600, 32800] },
        { id: 'teco2', name: 'Telecom Arg', symbol: 'TECO2', price: 1980, change: -6.85, currency: 'ARS', trend: [2140, 2100, 2070, 2030, 2000, 1980] }
      ],

      // 5. SUGERENCIAS DE INVERSIÓN (Estrategias reales de mercado)
      insights: [
        { id: 'ins-nvda', title: 'NVDA CEDEAR', tag: 'IA / TECH', badge: 'COMPRA FUERTE', badgeClass: 'buy', score: 14.5, desc: 'Expansión en demanda de GPUs Blackwell & Data Centers. Cobertura CCL contra devaluación.', horizon: '6-12m', risk: 'Moderado' },
        { id: 'ins-lecap', title: 'LECAPS PESOS', tag: 'RENTA FIJA', badge: 'CARRY TRADE', badgeClass: 'hedge', score: 12.8, desc: 'Devengamiento de tasa efectiva mensual (TEM) ante superávit fiscal y estabilidad cambiaria.', horizon: '30-90d', risk: 'Bajo' },
        { id: 'ins-btc', title: 'BTC & ETH (DCA)', tag: 'CRIPTOASSET', badge: 'ACUMULAR', badgeClass: 'accumulate', score: 11.2, desc: 'Flujos institucionales continuos vía ETFs al contado y ciclo post-halving de 4 años.', horizon: 'Largo plazo', risk: 'Alto' },
        { id: 'ins-spy', title: 'CEDEAR SPY', tag: 'INDEX / USA', badge: 'CORE PORTFOLIO', badgeClass: 'buy', score: 9.6, desc: 'Diversificación en las 500 mayores compañías norteamericanas con cobertura en dólares.', horizon: '1-3 años', risk: 'Bajo/Medio' },
        { id: 'ins-energy', title: 'YPF & VISTA', tag: 'ENERGÍA', badge: 'CRECIMIENTO', badgeClass: 'buy', score: 8.4, desc: 'Aceleración en exportaciones de crudo no convencional en cuenca Vaca Muerta.', horizon: '6-18m', risk: 'Moderado' }
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
      btn.addEventListener('click', () => {
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
      // 1. Fetch Dólar (DolarAPI)
      const fiatPromise = fetch('https://dolarapi.com/v1/dolares')
        .then(r => r.json())
        .then(dolares => {
          const blue = dolares.find(d => d.casa === 'blue');
          const oficial = dolares.find(d => d.casa === 'oficial');
          const mep = dolares.find(d => d.casa === 'bolsa' || d.casa === 'mep');
          const ccl = dolares.find(d => d.casa === 'contadoconliqui' || d.casa === 'ccl');
          const tarjeta = dolares.find(d => d.casa === 'tarjeta');
          
          if (blue) this.updateFiatItem('usd-blue', blue.compra, blue.venta);
          if (oficial) this.updateFiatItem('usd-oficial', oficial.compra, oficial.venta);
          if (mep) this.updateFiatItem('usd-mep', mep.compra, mep.venta);
          if (ccl) this.updateFiatItem('usd-ccl', ccl.compra, ccl.venta);
          if (tarjeta) this.updateFiatItem('usd-tarjeta', tarjeta.compra, tarjeta.venta);
        }).catch(err => console.warn('[Finance] DolarAPI:', err.message));

      // 2. Fetch Criptos Own (CoinGecko en ARS)
      const cgIds = 'bitcoin,ethereum,solana,near,uniswap,arbitrum,fetch-ai,render-token';
      const cryptoPromise = fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=ars,usd&include_24hr_change=true`)
        .then(r => r.json())
        .then(prices => {
          this.data.cryptoOwn.forEach(item => {
            if (item.cgId && prices[item.cgId]) {
              const arsPrice = Math.round(prices[item.cgId].ars);
              const change24h = prices[item.cgId].ars_24h_change;
              if (arsPrice) item.price = arsPrice;
              if (change24h !== undefined) item.change = +change24h.toFixed(2);
              item.trend.push(item.price);
              if (item.trend.length > 8) item.trend.shift();
            }
          });
        }).catch(err => console.warn('[Finance] CoinGecko Own:', err.message));

      // 3. Fetch Criptos Global Markets Top Movers
      const globalPromise = fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`)
        .then(r => r.json())
        .then(coins => {
          if (Array.isArray(coins) && coins.length >= 10) {
            this.data.cryptoGlobal = coins.map((c, idx) => ({
              id: c.id,
              name: c.name,
              symbol: c.symbol.toUpperCase(),
              priceUSD: c.current_price,
              change: +(c.price_change_percentage_24h || 0).toFixed(2),
              rank: idx + 1,
              trend: [
                c.current_price * 0.96,
                c.current_price * 0.98,
                c.current_price * 0.97,
                c.current_price * 1.01,
                c.current_price
              ]
            }));
          }
        }).catch(err => console.warn('[Finance] CoinGecko Global:', err.message));

      await Promise.allSettled([fiatPromise, cryptoPromise, globalPromise]);
    } catch (e) {
      console.warn('[Finance] Fallback activo.');
    } finally {
      this.renderAllBoxes();
    }
  }

  simulateOrganicMovements() {
    // Micro-movimientos para CEDEARs
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
    const width = 46;
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

  formatUSD(num) {
    if (num < 0.0001) return num.toFixed(7);
    if (num < 0.01) return num.toFixed(5);
    if (num < 1) return num.toFixed(3);
    if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num.toFixed(2);
  }

  renderAllBoxes() {
    this.renderBox('fiat');
    this.renderBox('cryptoOwn');
    this.renderBox('cryptoGlobal');
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

    if (boxKey === 'cryptoGlobal') {
      this.renderCryptoGlobalBox(container);
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
      const priceFormatted = item.sell 
        ? `$${this.formatARS(item.sell)} <span class="sub-price">/ $${this.formatARS(item.buy)}</span>`
        : `$${this.formatARS(item.price)} <span class="sub-cur">ARS</span>`;

      html += `
        <div class="finance-row ${alertClass}">
          <div class="fin-col fin-asset">
            <div class="fin-symbol-box">
              <span class="fin-symbol">${item.symbol}</span>
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

  renderCryptoGlobalBox(container) {
    let items = [...this.data.cryptoGlobal];
    const sortOrder = this.sortState.cryptoGlobal;

    // Ordenar por variación porcentual (Top subas o Top bajas)
    items.sort((a, b) => {
      const chA = a.change || 0;
      const chB = b.change || 0;
      return sortOrder === 'desc' ? (chB - chA) : (chA - chB);
    });

    // Tomar estrictamente las 10 criptomonedas del ranking
    const top10 = items.slice(0, 10);

    let html = `
      <div class="global-crypto-grid-2col">
    `;

    top10.forEach((coin, index) => {
      const change = coin.change || 0;
      const isPositive = change >= 0;
      const sign = isPositive ? '+' : '';
      const strokeColor = isPositive ? '#00e676' : '#f60000';
      const spark = this.generateSparkline(coin.trend, strokeColor);

      html += `
        <div class="finance-row global-row">
          <div class="fin-col fin-asset">
            <div class="fin-symbol-box">
              <span class="global-rank font-mono">#${index + 1}</span>
              <span class="fin-symbol">${coin.symbol}</span>
            </div>
            <span class="fin-name">${coin.name}</span>
          </div>

          <div class="fin-col fin-chart">
            ${spark}
          </div>

          <div class="fin-col fin-price">
            <div class="fin-val font-mono">$${this.formatUSD(coin.priceUSD)} <span class="sub-cur">USD</span></div>
            <div class="fin-change ${isPositive ? 'val-positive' : 'val-negative'} font-mono">
              <span>${isPositive ? '▲' : '▼'}</span> ${sign}${change.toFixed(2)}%
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
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
