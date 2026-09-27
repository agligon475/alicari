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
- **Navegabilidad Total como Wallpaper Interactivo:**
  - **🖱️ Rueda del Mouse (Wheel):** Gira la rueda del mouse (o Shift+Rueda / Rueda Horizontal) sobre cualquier área libre para cambiar fluidamente de pantalla.
  - **👆 Arrastre con Mouse (Drag / Swipe):** Haz clic sostenido y arrastra hacia la izquierda/derecha para deslizar entre pantallas con inercia.
  - **⚡ Dock Rápido Flotante (Quick-Dock):** Barra HUD inferior con accesos directos `01 TIEMPO & AGENDA`, botón de swap `⇄` y `02 MERCADOS`.
  - **‹ › Flechas Laterales Flotantes:** Botones laterales translúcidos al borde de la pantalla que se iluminan al pasar el cursor para cambio instantáneo.
  - **🖱️ Doble Clic:** Haz doble clic en cualquier espacio libre del fondo para alternar pantallas.
  - **🔄 Auto-Rotación Persistente:** Botón `AUTO` con guardado en `localStorage` y soporte para propiedades nativas de Wallpaper Engine (`autoRotate`, `autoSlideInterval`).
  - **⌨️ Teclas Directas:** `1` (Tiempo/Clima/Agenda), `2` (Mercados), Flechas Izq/Der/Arriba/Abajo, Espacio (Auto-rotar).
- **Cajas Superiores (20% Viewport):**
  - **Reloj Polar Concéntrico:** Arcos radiales dinámicos para Horas, Minutos y Segundos (en rojo neón `#f60000`) con números exteriores `00, 06, 12, 18` y lectura digital integrada.
  - **Clima SMN (Monte Grande, Buenos Aires, Argentina):** Temperatura real, ST, estado, icono animado, humedad, viento, presión y visibilidad.
- **Cajas Medias & Inferiores:**
  - **Google Calendar / Agenda en vivo:** Próximos compromisos con sincronización iCal privada.
  - **Criptos Own:** Con holdings, cantidades y valoración en tiempo real.
  - **Divisas, Criptos Global, CEDEARs e Inversiones.**

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
6. En las opciones del fondo en Wallpaper Engine, asegúrate de activar **Mouse interaction** (Interacción con el ratón).
7. ¡Listo! Disfruta de un fondo interactivo fluido con mínimo impacto de CPU/GPU.

### Configuración en Lively Wallpaper
1. Abre **Lively Wallpaper**.
2. Haz clic en el botón **+ (Add Wallpaper)**.
3. Elige **Browse** y selecciona `main-stage/index.html` (para la pantalla 1) y `main-stage/vertical.html` (para la pantalla 2).
4. Asegúrate de tener habilitada la interacción de mouse en la configuración de Lively.

