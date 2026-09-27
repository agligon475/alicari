/**
 * ALICARI WALLPAPER - CONFIGURACIÓN DE USUARIO LOCAL
 * Este archivo sincroniza tus configuraciones privadas (Criptos Own, Holdings, Google Calendar y Carrusel)
 * de forma compartida entre el Navegador Web y Wallpaper Engine / Lively Wallpaper.
 * 
 * Puedes editar este archivo directamente con cualquier editor de texto o guardarlo
 * desde el botón 'Exportar / Guardar Archivo' del panel de Ajustes en el navegador.
 */

window.ALICARI_USER_CONFIG = {
  // Enlace iCal (.ics) privado de Google Calendar
  calendarUrl: "",

  // Lista personalizada de Criptomonedas y Cantidades (Holdings)
  cryptoOwn: [
    { id: "bitcoin", cgId: "bitcoin", name: "Bitcoin", symbol: "BTC", holdings: 0.25 },
    { id: "ethereum", cgId: "ethereum", name: "Ethereum", symbol: "ETH", holdings: 1.5 },
    { id: "solana", cgId: "solana", name: "Solana", symbol: "SOL", holdings: 12.0 },
    { id: "uniswap", cgId: "uniswap", name: "Uniswap", symbol: "UNI", holdings: 50.0 },
    { id: "near", cgId: "near", name: "NEAR Protocol", symbol: "NEAR", holdings: 120.0 },
    { id: "arbitrum", cgId: "arbitrum", name: "Arbitrum", symbol: "ARB", holdings: 450.0 },
    { id: "fetch-ai", cgId: "fetch-ai", name: "Artificial Superintel.", symbol: "FET", holdings: 200.0 },
    { id: "render-token", cgId: "render-token", name: "Render Token", symbol: "RENDER", holdings: 60.0 }
  ],

  // Ajustes de Carrusel y Wallpaper
  carousel: {
    autoRotate: false,
    autoSlideInterval: 25000,
    defaultSlide: 0
  }
};
