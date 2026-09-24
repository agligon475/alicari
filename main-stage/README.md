# ALICARI — Interactive Dual-Monitor Wallpaper System

Fondo de pantalla interactivo modular desarrollado en **HTML5, CSS3 y Vanilla JavaScript** optimizado para **Wallpaper Engine** y **Lively Wallpaper** en configuraciones de doble monitor (Horizontal + Vertical).

---

## 🖥️ Arquitectura de Pantallas

```
main-stage/
│
├── index.html              # Monitor 1 (Horizontal - 16:9 / Ultra-Wide)
├── vertical.html           # Monitor 2 (Vertical - 9:16 Portrait / 1080x1920)
├── README.md               # Documentación y configuración
│
└── assets/
    ├── css/
    │   ├── base.css        # Tokens, reset, paleta corporativa, glassmorphism
    │   ├── horizontal.css  # Estilos específicos de Monitor 1 (Hero & HUD)
    │   └── vertical.css    # Estilos de Monitor 2 (Dashboard modular)
    │
    ├── js/
    │   ├── particles.js    # Motor Canvas 2D de micropartículas interactivo (60 FPS)
    │   ├── parallax.js     # Motor 3D de inclinación suave reactivo al cursor
    │   ├── clock.js        # Reloj 24h, fecha en español y barra de progreso del día
    │   ├── weather.js      # Widget meteorológico estilo SMN (Open-Meteo + Fallback)
    │   └── finance.js      # Cotizaciones Divisas & Criptos con Sparklines SVG
    │
    └── images/
        ├── logo-alicari.svg # Logotipo horizontal con 'a' roja #f60000 y 'licari' #f6f6f6
        └── logo-icon.svg    # Isotipo 'a' con resplandor neón
```

---

## 🎨 Paleta y Diseño

- **Fondo:** Negro profundo corporativo (`#010101`) con patrón de líneas diagonales en sutil textura de fibra de carbono.
- **Acento:** Rojo vibrante de marca (`#f60000`).
- **Tipografías y Detalles:** Blanco puro (`#f6f6f6`) y grises técnicos (`#8e8e93`).
- **Glassmorphism:** Paneles traslúcidos con `backdrop-filter: blur(18px)`, bordes de luz tenue y sombras volumétricas.

---

## ⚙️ Características por Monitor

### 1. Monitor 1 (Horizontal — `index.html`):
- **Logotipo Centrado:** Identidad oficial `alicari` con resplandor pulsante y efecto **Parallax 3D suave** al mover el cursor.
- **Partículas Ambientales:** Micropartículas flotantes rojas y blancas con interacción elástica ante el cursor.
- **HUD Periférico Minimalista:** Reloj sutil, ecualizador visual rítmico y selector de pantalla completa.

### 2. Monitor 2 (Vertical — `vertical.html`):
- **Bloque Superior (Reloj & Fecha):** Reloj 24h con segundero neón, fecha en español (`JUEVES, 24 DE SEPTIEMBRE 2026`) y barra de progreso porcentual del día.
- **Bloque Central (Clima SMN):** Inspirado en el Servicio Meteorológico Nacional (SMN de Argentina). Muestra temperatura, sensación térmica, estado, viento, humedad, presión, visibilidad y pronóstico a 3 días con iconos vectoriales animados.
- **Bloque Inferior (Mercados, Criptomonedas y CEDEARs en ARS):**
  - **Criptos (en ARS):** UNI, FET, NEAR, ARB, BTC, ETH y ALI Token.
  - **CEDEARs (en ARS):** NVDA, TECO2, TEM.
  - **Divisas (en ARS):** Dólar Blue, Dólar Oficial, Euro, Real Brasileño.
  - **🚨 Sistema de Alertas Visuales:**
    - **Caídas > -6%:** Filas completas iluminadas en **Rojo pulsante** con badge `▼ CAÍDA -6%`.
    - **Subas > +10%:** Filas completas iluminadas en **Verde brillante** con badge `▲ SUBA +10%`.
  - Gráficos **Sparkline SVG** en tiempo real y selector de pestañas (`TODOS`, `CRIPTOS`, `CEDEARS`, `DIVISAS`).

---

## 🚀 Cómo Usar / Probar

### Probar Localmente
Puedes abrir `index.html` o `vertical.html` directamente en cualquier navegador moderno o servir la carpeta con cualquier servidor local (por ejemplo `npx serve .` o Live Server).

### Configuración en Wallpaper Engine
1. Abre **Wallpaper Engine**.
2. Haz clic en **Wallpaper Editor** (Editor de fondos de pantalla).
3. Selecciona **Create Wallpaper** (Crear Fondo) y elige **Web Wallpaper** (Fondo Web).
4. Para tu Monitor 1, selecciona el archivo `main-stage/index.html`.
5. Para tu Monitor 2, selecciona el archivo `main-stage/vertical.html`.
6. ¡Listo! Disfruta de un fondo interactivo fluido con mínimo impacto de CPU/GPU.

### Configuración en Lively Wallpaper
1. Abre **Lively Wallpaper**.
2. Haz clic en el botón **+ (Add Wallpaper)**.
3. Elige **Browse** y selecciona `main-stage/index.html` (para la pantalla 1) y `main-stage/vertical.html` (para la pantalla 2).
