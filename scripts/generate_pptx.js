const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 13.33 x 7.5 inches
  pptx.author = 'Agustín Licari (ALICARI)';
  pptx.company = 'Colegio Parish Robertson & ALICARI';
  pptx.title = 'Plan de Modernización de Admisiones & Ecosistema Digital — Colegio Parish Robertson';
  pptx.subject = 'Propuesta Integral de Identidad, Preprensa, Landing Page y Automatización';

  // Palette constants
  const COLORS = {
    bgPage: 'F8FAFC',
    bgCard: 'FFFFFF',
    greenDeep: '0B291B',
    greenPrimary: '004D2C',
    greenMedium: '064E3B',
    greenLight: '059669',
    greenSoft: 'ECFDF5',
    navyDark: '0F172A',
    navyPrimary: '1E3A8A',
    navyAccent: '2563EB',
    navySoft: 'EFF6FF',
    skyPrimary: '0284C7',
    skySoft: 'F0F9FF',
    carminePrimary: 'B91C1C',
    carmineSoft: 'FEF2F2',
    amberPrimary: 'D97706',
    amberSoft: 'FEF3C7',
    textMain: '0F172A',
    textMuted: '475569',
    textDim: '64748B',
    borderSubtle: 'E2E8F0',
    white: 'FFFFFF'
  };

  const FONT_FAMILY = 'Calibri';

  const logoSchoolPath = path.resolve(__dirname, '../ParishRobertson/logo-parish-robertson.png');
  const isologoAlicariPath = path.resolve(__dirname, '../ParishRobertson/isologo-alicari.png');

  // Helper to add standard topbar & bottombar
  function addSlideLayout(slide, slideNumber, totalSlides = 9) {
    // Background fill
    slide.background = { color: COLORS.bgPage };

    // Top Header Bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.65,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    // School Logo
    if (fs.existsSync(logoSchoolPath)) {
      slide.addImage({
        path: logoSchoolPath,
        x: 0.5,
        y: 0.12,
        w: 0.4,
        h: 0.4
      });
    }

    // Top Header Text
    slide.addText([
      { text: 'COLEGIO ', options: { bold: false, color: COLORS.textDim, fontSize: 10 } },
      { text: 'PARISH ROBERTSON', options: { bold: true, color: COLORS.greenDeep, fontSize: 10 } },
      { text: '  •  MONTE GRANDE', options: { color: COLORS.textDim, fontSize: 10 } }
    ], {
      x: 1.0,
      y: 0.12,
      w: 6.0,
      h: 0.4,
      fontFace: FONT_FAMILY,
      valign: 'middle'
    });

    // Topbar Center Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.2,
      y: 0.14,
      w: 4.1,
      h: 0.36,
      rectRadius: 0.18,
      fill: { color: COLORS.navySoft },
      line: { color: 'BFDBFE', width: 1 }
    });
    slide.addText('VIRTUTIS GLORIA MERCES  •  SINCE 1963', {
      x: 5.2,
      y: 0.14,
      w: 4.1,
      h: 0.36,
      fontFace: FONT_FAMILY,
      fontSize: 8.5,
      bold: true,
      color: COLORS.navyPrimary,
      align: 'center',
      valign: 'middle'
    });

    // Topbar Slide Counter
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 11.5,
      y: 0.15,
      w: 1.3,
      h: 0.34,
      rectRadius: 0.17,
      fill: { color: 'F1F5F9' },
      line: { color: COLORS.borderSubtle, width: 1 }
    });
    slide.addText(`Slide ${slideNumber} de ${totalSlides}`, {
      x: 11.5,
      y: 0.15,
      w: 1.3,
      h: 0.34,
      fontFace: FONT_FAMILY,
      fontSize: 8.5,
      bold: true,
      color: COLORS.textMuted,
      align: 'center',
      valign: 'middle'
    });

    // Bottom Footer Bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 7.05,
      w: 13.33,
      h: 0.45,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText('Plan de Modernización de Admisiones & Ecosistema Digital  |  Agustín Licari (ALICARI)', {
      x: 0.5,
      y: 7.08,
      w: 8.5,
      h: 0.38,
      fontFace: FONT_FAMILY,
      fontSize: 8.5,
      color: COLORS.textDim,
      valign: 'middle'
    });

    // Progress Bar Indicator in bottombar
    const progressWidth = (slideNumber / totalSlides) * 3.5;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.3,
      y: 7.2,
      w: 3.5,
      h: 0.12,
      rectRadius: 0.06,
      fill: { color: 'E2E8F0' },
      line: { type: 'none' }
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.3,
      y: 7.2,
      w: Math.max(0.2, progressWidth),
      h: 0.12,
      rectRadius: 0.06,
      fill: { color: COLORS.greenPrimary },
      line: { type: 'none' }
    });
  }

  // Header helper for content slides
  function addSlideHeader(slide, tag, title, subtitle) {
    slide.addText(tag.toUpperCase(), {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.25,
      fontFace: FONT_FAMILY,
      fontSize: 9,
      bold: true,
      color: COLORS.skyPrimary
    });

    slide.addText(title, {
      x: 0.6,
      y: 1.1,
      w: 12.0,
      h: 0.5,
      fontFace: FONT_FAMILY,
      fontSize: 18,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText(subtitle, {
      x: 0.6,
      y: 1.6,
      w: 12.0,
      h: 0.35,
      fontFace: FONT_FAMILY,
      fontSize: 10.5,
      color: COLORS.textMuted
    });
  }

  // ==========================================
  // SLIDE 1: PORTADA INSTITUCIONAL
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 1);

    // Hero Shield + Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.2,
      w: 6.2,
      h: 0.55,
      rectRadius: 0.27,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    if (fs.existsSync(logoSchoolPath)) {
      slide.addImage({
        path: logoSchoolPath,
        x: 0.95,
        y: 1.28,
        w: 0.38,
        h: 0.38
      });
    }

    slide.addText('VIRTUTIS GLORIA MERCES • SINCE 1963  •  Monte Grande', {
      x: 1.45,
      y: 1.2,
      w: 5.4,
      h: 0.55,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      bold: true,
      color: COLORS.greenPrimary,
      valign: 'middle'
    });

    // Main Title
    slide.addText('Plan de Modernización de Admisiones:\nIdentidad, Optimización Gráfica y Automatización Digital', {
      x: 0.8,
      y: 1.95,
      w: 11.5,
      h: 1.4,
      fontFace: FONT_FAMILY,
      fontSize: 24,
      bold: true,
      color: COLORS.greenDeep,
      lineSpacing: 32
    });

    // Hero Subtitle
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: 3.5,
      w: 0.08,
      h: 0.45,
      fill: { color: COLORS.skyPrimary },
      line: { type: 'none' }
    });
    slide.addText('Campaña de Matriculación Ciclo Lectivo  |  Colegio Parish Robertson (Monte Grande)', {
      x: 1.0,
      y: 3.45,
      w: 11.0,
      h: 0.5,
      fontFace: FONT_FAMILY,
      fontSize: 12.5,
      color: COLORS.textMuted
    });

    // 3 Highlight Pills
    const pills = [
      { text: 'Ahorro Inmediato del 50% en Papel', color: COLORS.greenLight },
      { text: 'Landing Page de Conversión Pura', color: COLORS.skyPrimary },
      { text: 'Sincronización Drive Institucional', color: COLORS.carminePrimary }
    ];
    pills.forEach((p, idx) => {
      const px = 0.8 + idx * 3.9;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: px,
        y: 4.15,
        w: 3.75,
        h: 0.45,
        rectRadius: 0.22,
        fill: { color: COLORS.white },
        line: { color: COLORS.borderSubtle, width: 1 }
      });
      slide.addShape(pptx.shapes.OVAL, {
        x: px + 0.18,
        y: 4.31,
        w: 0.13,
        h: 0.13,
        fill: { color: p.color },
        line: { type: 'none' }
      });
      slide.addText(p.text, {
        x: px + 0.38,
        y: 4.15,
        w: 3.25,
        h: 0.45,
        fontFace: FONT_FAMILY,
        fontSize: 9.5,
        bold: true,
        color: COLORS.textMain,
        valign: 'middle'
      });
    });

    // Presenter Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.85,
      w: 11.6,
      h: 1.65,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    // Left green accent border on presenter card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.85,
      w: 0.12,
      h: 1.65,
      rectRadius: 0.06,
      fill: { color: COLORS.greenPrimary },
      line: { type: 'none' }
    });

    if (fs.existsSync(isologoAlicariPath)) {
      slide.addImage({
        path: isologoAlicariPath,
        x: 1.2,
        y: 5.2,
        w: 0.9,
        h: 0.9
      });
    }

    slide.addText([
      { text: 'Agustín Licari  |  alicari\n', options: { fontSize: 13.5, bold: true, color: COLORS.greenDeep } },
      { text: 'Project Manager & Lead Designer  |  Identidad Visual, UX/UI & Desarrollo Web\n', options: { fontSize: 9.5, color: COLORS.textDim } },
      { text: 'Portfolio Web Oficial: https://alicari.com.ar', options: { fontSize: 9, color: COLORS.skyPrimary, bold: true } }
    ], {
      x: 2.3,
      y: 5.05,
      w: 9.5,
      h: 1.25,
      fontFace: FONT_FAMILY,
      valign: 'middle'
    });
  }

  // ==========================================
  // SLIDE 2: DIAGNÓSTICO DEL MATERIAL
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 2);
    addSlideHeader(slide, 'Diagnóstico y Relevamiento Inicial', '01. Diagnóstico del Material y Flujo Actual', 'Auditoría sobre el stock impreso y la operatoria cotidiana del proceso de admisión.');

    // Card A (Red)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 2.05,
      w: 5.6,
      h: 4.65,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: 2.05,
      w: 5.6,
      h: 0.08,
      fill: { color: COLORS.carminePrimary },
      line: { type: 'none' }
    });

    // Badge Card A
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1,
      y: 2.3,
      w: 2.0,
      h: 0.35,
      rectRadius: 0.08,
      fill: { color: COLORS.carmineSoft },
      line: { color: 'FECACA', width: 1 }
    });
    slide.addText('HALLAZGO CRÍTICO A', {
      x: 1.1,
      y: 2.3,
      w: 2.0,
      h: 0.35,
      fontFace: FONT_FAMILY,
      fontSize: 8,
      bold: true,
      color: COLORS.carminePrimary,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Anacronía & Desperdicio en Stock', {
      x: 1.1,
      y: 2.75,
      w: 5.0,
      h: 0.45,
      fontFace: FONT_FAMILY,
      fontSize: 14.5,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText('Coexistencia en stock de folletos con sellos de "50 Años" (2013) y "60 Años" (2023), provocando vencimiento prematuro de piezas y gasto innecesario. Dispersión visual y tipográfica.', {
      x: 1.1,
      y: 3.25,
      w: 5.0,
      h: 1.1,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      color: COLORS.textMuted
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 1.1,
      y: 4.45,
      w: 5.0,
      h: 0,
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText([
      { text: '❌ Vencimiento prematuro: ', options: { bold: true, color: COLORS.carminePrimary } },
      { text: 'Los lotes quedan inutilizables apenas concluye el año festivo, obligando a descartar papel nuevo.\n\n', options: { color: COLORS.textMain } },
      { text: '❌ Dispersión visual: ', options: { bold: true, color: COLORS.carminePrimary } },
      { text: 'Falta de un criterio unificado tipográfico y de sellos que erosiona el valor de marca institucional.', options: { color: COLORS.textMain } }
    ], {
      x: 1.1,
      y: 4.6,
      w: 5.0,
      h: 1.8,
      fontFace: FONT_FAMILY,
      fontSize: 9.5
    });

    // Card B (Amber)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8,
      y: 2.05,
      w: 5.6,
      h: 4.65,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 6.8,
      y: 2.05,
      w: 5.6,
      h: 0.08,
      fill: { color: COLORS.amberPrimary },
      line: { type: 'none' }
    });

    // Badge Card B
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.1,
      y: 2.3,
      w: 2.0,
      h: 0.35,
      rectRadius: 0.08,
      fill: { color: COLORS.amberSoft },
      line: { color: 'FDE68A', width: 1 }
    });
    slide.addText('HALLAZGO CRÍTICO B', {
      x: 7.1,
      y: 2.3,
      w: 2.0,
      h: 0.35,
      fontFace: FONT_FAMILY,
      fontSize: 8,
      bold: true,
      color: COLORS.amberPrimary,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Ineficiencia de Formato & Fricción', {
      x: 7.1,
      y: 2.75,
      w: 5.0,
      h: 0.45,
      fontFace: FONT_FAMILY,
      fontSize: 14.5,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText('Uso de hojas A4 completas a dos tintas donde 1/3 de la superficie está desaprovechada en líneas manuscritas de "Observaciones". Quiebre cromático frente al uniforme escolar (azul, celeste y rojo). Proceso 100% analógico.', {
      x: 7.1,
      y: 3.25,
      w: 5.0,
      h: 1.1,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      color: COLORS.textMuted
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 7.1,
      y: 4.45,
      w: 5.0,
      h: 0,
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText([
      { text: '⚠️ 1/3 desaprovechado: ', options: { bold: true, color: COLORS.amberPrimary } },
      { text: 'Espacio para líneas manuscritas que raramente se completan.\n\n', options: { color: COLORS.textMain } },
      { text: '⚠️ Quiebre cromático: ', options: { bold: true, color: COLORS.amberPrimary } },
      { text: 'No se integran los tonos azul marino, celeste y rojo del uniforme.\n\n', options: { color: COLORS.textMain } },
      { text: '⚠️ Registro analógico: ', options: { bold: true, color: COLORS.amberPrimary } },
      { text: 'Pérdida de trazabilidad al no digitalizar la consulta en secretaría.', options: { color: COLORS.textMain } }
    ], {
      x: 7.1,
      y: 4.6,
      w: 5.0,
      h: 1.9,
      fontFace: FONT_FAMILY,
      fontSize: 9.5
    });
  }

  // ==========================================
  // SLIDE 3: REINGENIERÍA GRÁFICA & AHORRO 50%
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 3);
    addSlideHeader(slide, 'Optimización de Recursos & Formato', '02. Reingeniería Gráfica & Ahorro Directo del 50%', 'Solución de preprensa inteligente y transformación hacia piezas gráficas perdurables y conectadas.');

    const metricCards = [
      {
        tag: 'AHORRO DIRECTO',
        hero: '-50%',
        heroColor: COLORS.greenLight,
        title: 'Formato 1/2 A4 Vertical (105 × 297 mm)',
        desc: 'Rinde el doble por pliego A4, recortando a la mitad el gasto en papel y tirada de imprenta, concentrando el contenido esencial con tipografía jerárquica y lectura dinámica.',
        footerLeft: 'Pliego A4 = 2 Folletos listos',
        footerRight: 'Cero desperdicio',
        footerRightColor: COLORS.skyPrimary
      },
      {
        tag: 'ATEMPORALIDAD',
        hero: 'Since 1963',
        heroColor: COLORS.greenDeep,
        title: 'Sello Histórico y Permanente',
        desc: 'Reemplazo definitivo de aniversarios cerrados por una marca temporal permanente que protege la inversión y nunca caduca a lo largo de los ciclos lectivos.',
        footerLeft: 'Protección de inversión',
        footerRight: 'No vence',
        footerRightColor: COLORS.greenLight
      },
      {
        tag: 'ENFOQUE PHYGITAL',
        hero: 'QR Dinámico',
        heroColor: '6366F1',
        title: 'Puente Directo a la Conversión',
        desc: 'El papel actúa como puente inmediato a la landing page institucional, segmentado por nivel (Maternal/Inicial, Primaria y Secundaria).',
        footerLeft: 'Papel → Teléfono en 2 seg',
        footerRight: 'Conversión Pura',
        footerRightColor: '4F46E5'
      }
    ];

    metricCards.forEach((c, idx) => {
      const cx = 0.8 + idx * 3.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cx,
        y: 2.1,
        w: 3.75,
        h: 4.6,
        rectRadius: 0.15,
        fill: { color: COLORS.white },
        line: { color: COLORS.borderSubtle, width: 1 }
      });

      slide.addText(c.tag, {
        x: cx + 0.3,
        y: 2.3,
        w: 3.15,
        h: 0.3,
        fontFace: FONT_FAMILY,
        fontSize: 8.5,
        bold: true,
        color: COLORS.textDim
      });

      slide.addText(c.hero, {
        x: cx + 0.3,
        y: 2.65,
        w: 3.15,
        h: 0.8,
        fontFace: FONT_FAMILY,
        fontSize: 24,
        bold: true,
        color: c.heroColor
      });

      slide.addText(c.title, {
        x: cx + 0.3,
        y: 3.5,
        w: 3.15,
        h: 0.55,
        fontFace: FONT_FAMILY,
        fontSize: 12.5,
        bold: true,
        color: COLORS.greenDeep
      });

      slide.addText(c.desc, {
        x: cx + 0.3,
        y: 4.15,
        w: 3.15,
        h: 1.5,
        fontFace: FONT_FAMILY,
        fontSize: 9.5,
        color: COLORS.textMuted
      });

      slide.addShape(pptx.shapes.LINE, {
        x: cx + 0.3,
        y: 5.9,
        w: 3.15,
        h: 0,
        line: { color: COLORS.borderSubtle, width: 1 }
      });

      slide.addText(c.footerLeft, {
        x: cx + 0.3,
        y: 6.0,
        w: 1.8,
        h: 0.4,
        fontFace: FONT_FAMILY,
        fontSize: 8.5,
        color: COLORS.textDim
      });

      slide.addText(c.footerRight, {
        x: cx + 1.8,
        y: 6.0,
        w: 1.65,
        h: 0.4,
        fontFace: FONT_FAMILY,
        fontSize: 8.5,
        bold: true,
        color: c.footerRightColor,
        align: 'right'
      });
    });
  }

  // ==========================================
  // SLIDE 4: LANDING PAGE MOBILE-FIRST
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 4);
    addSlideHeader(slide, 'Captación de Familias y Conversión Directa', '03. Landing Page de Admisiones Mobile-First', 'Arquitectura orientada a la acción inmediata sin distracciones ni fugas hacia chats informales.');

    // Block 1
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 2.1,
      w: 5.6,
      h: 4.6,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1,
      y: 2.35,
      w: 2.6,
      h: 0.32,
      rectRadius: 0.08,
      fill: { color: COLORS.carmineSoft },
      line: { color: 'FECACA', width: 1 }
    });
    slide.addText('TÚNEL DE CONVERSIÓN PURO', {
      x: 1.1,
      y: 2.35,
      w: 2.6,
      h: 0.32,
      fontFace: FONT_FAMILY,
      fontSize: 8,
      bold: true,
      color: COLORS.carminePrimary,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Cero Dispersión & Foco Absoluto', {
      x: 1.1,
      y: 2.8,
      w: 5.0,
      h: 0.4,
      fontFace: FONT_FAMILY,
      fontSize: 14.5,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText('Se eliminan botones distractores y enlaces externos para concentrar toda la atención en el objetivo único de conversión institucional.', {
      x: 1.1,
      y: 3.25,
      w: 5.0,
      h: 0.8,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      color: COLORS.textMuted
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 1.1,
      y: 4.15,
      w: 5.0,
      h: 0,
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText([
      { text: '✓  100% Tráfico al Formulario: ', options: { bold: true, color: COLORS.greenLight } },
      { text: 'Sin salidas secundarias ni chats abiertos sin calificar.\n\n', options: { color: COLORS.textMain } },
      { text: '✓  Sección FAQ Dinámica: ', options: { bold: true, color: COLORS.greenLight } },
      { text: 'Horarios de doble jornada, aranceles y comedor escolar.\n\n', options: { color: COLORS.textMain } },
      { text: '✓  Carga Ultrarrápida: ', options: { bold: true, color: COLORS.greenLight } },
      { text: 'Optimizada para dispositivos móviles y redes 4G/5G.', options: { color: COLORS.textMain } }
    ], {
      x: 1.1,
      y: 4.35,
      w: 5.0,
      h: 2.1,
      fontFace: FONT_FAMILY,
      fontSize: 9.5
    });

    // Block 2
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8,
      y: 2.1,
      w: 5.6,
      h: 4.6,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.1,
      y: 2.35,
      w: 2.2,
      h: 0.32,
      rectRadius: 0.08,
      fill: { color: COLORS.greenSoft },
      line: { color: 'A7F3D0', width: 1 }
    });
    slide.addText('CAPTACIÓN INMEDIATA', {
      x: 7.1,
      y: 2.35,
      w: 2.2,
      h: 0.32,
      fontFace: FONT_FAMILY,
      fontSize: 8,
      bold: true,
      color: COLORS.greenMedium,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Formulario Ágil en 3 Campos', {
      x: 7.1,
      y: 2.8,
      w: 5.0,
      h: 0.4,
      fontFace: FONT_FAMILY,
      fontSize: 14.5,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText('Formulario ágil en 3 campos clave (Nombre del tutor, Teléfono/Contacto y Nivel de interés). La misma interfaz estandariza consultas presenciales y telefónicas en secretaría.', {
      x: 7.1,
      y: 3.25,
      w: 5.0,
      h: 0.8,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      color: COLORS.textMuted
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 7.1,
      y: 4.15,
      w: 5.0,
      h: 0,
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText([
      { text: '⚡  3 Campos Clave: ', options: { bold: true, color: COLORS.skyPrimary } },
      { text: 'Nombre del tutor, Teléfono/Contacto y Nivel de interés.\n\n', options: { color: COLORS.textMain } },
      { text: '✉️  Dossier por Email: ', options: { bold: true, color: COLORS.greenLight } },
      { text: 'Envío inmediato automatizado tras enviar el formulario.\n\n', options: { color: COLORS.textMain } },
      { text: '🏛️  Uso en Secretaría: ', options: { bold: true, color: COLORS.amberPrimary } },
      { text: 'Carga unificada de consultas presenciales y telefónicas.', options: { color: COLORS.textMain } }
    ], {
      x: 7.1,
      y: 4.35,
      w: 5.0,
      h: 2.1,
      fontFace: FONT_FAMILY,
      fontSize: 9.5
    });
  }

  // ==========================================
  // SLIDE 5: BASE DE DATOS & AUTOMATIZACIONES
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 5);
    addSlideHeader(slide, 'Gestión Centralizada y CRM Liviano', '04. Base de Datos Centralizada y Automatizaciones', 'Control total del pipeline de admisiones en el entorno Google de la institución, sin licencias extras.');

    const modules = [
      {
        num: '1',
        title: 'Google Sheets en Drive Institucional',
        desc: 'Cada lead web o relevamiento de recepción ingresa al instante a una hoja oficial en el Drive del colegio, sin licencias costosas ni curvas complejas de aprendizaje.',
        bannerText: '📊 Datos seguros bajo dominio @parishrobertson',
        bannerBg: COLORS.greenSoft,
        bannerColor: COLORS.greenMedium,
        bannerBorder: 'A7F3D0'
      },
      {
        num: '2',
        title: 'Dashboard Web Interno',
        desc: 'Panel alojado en el dominio institucional con pipeline de estados para secretaría:\n\n• Nuevo Contacto\n• Llamado\n• Visita Agendada\n• Matriculado',
        bannerText: '🔄 Trazabilidad 100% en tiempo real',
        bannerBg: COLORS.navySoft,
        bannerColor: COLORS.navyPrimary,
        bannerBorder: 'BFDBFE'
      },
      {
        num: '3',
        title: 'Email Automatizado & Canal Flexible',
        desc: 'Disparo automático inmediato de correo con el Dossier Informativo en PDF al completar el formulario; integración con canal de WhatsApp disponible a criterio del colegio.',
        bannerText: '✉️ Dossier PDF + WhatsApp opcional',
        bannerBg: COLORS.skySoft,
        bannerColor: COLORS.skyPrimary,
        bannerBorder: 'BAE6FD'
      }
    ];

    modules.forEach((m, idx) => {
      const mx = 0.8 + idx * 3.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: mx,
        y: 2.1,
        w: 3.75,
        h: 4.6,
        rectRadius: 0.15,
        fill: { color: COLORS.white },
        line: { color: COLORS.borderSubtle, width: 1 }
      });

      // Module number badge
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: mx + 0.3,
        y: 2.35,
        w: 0.45,
        h: 0.45,
        rectRadius: 0.08,
        fill: { color: COLORS.greenPrimary },
        line: { type: 'none' }
      });
      slide.addText(m.num, {
        x: mx + 0.3,
        y: 2.35,
        w: 0.45,
        h: 0.45,
        fontFace: FONT_FAMILY,
        fontSize: 12,
        bold: true,
        color: COLORS.white,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(m.title, {
        x: mx + 0.3,
        y: 2.95,
        w: 3.15,
        h: 0.6,
        fontFace: FONT_FAMILY,
        fontSize: 12.5,
        bold: true,
        color: COLORS.greenDeep
      });

      slide.addText(m.desc, {
        x: mx + 0.3,
        y: 3.65,
        w: 3.15,
        h: 2.0,
        fontFace: FONT_FAMILY,
        fontSize: 9.5,
        color: COLORS.textMuted
      });

      // Bottom banner inside card
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: mx + 0.3,
        y: 5.85,
        w: 3.15,
        h: 0.55,
        rectRadius: 0.08,
        fill: { color: m.bannerBg },
        line: { color: m.bannerBorder, width: 1 }
      });
      slide.addText(m.bannerText, {
        x: mx + 0.35,
        y: 5.85,
        w: 3.05,
        h: 0.55,
        fontFace: FONT_FAMILY,
        fontSize: 8.5,
        bold: true,
        color: m.bannerColor,
        valign: 'middle'
      });
    });
  }

  // ==========================================
  // SLIDE 6: REDISEÑO WEB & OPTIMIZACIÓN AEO
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 6);
    addSlideHeader(slide, 'Ecosistema Institucional & IA', '05. Modernización Web Integral & AEO (Módulo Transversal)', 'Posicionamiento estratégico en motores de búsqueda tradicionales y en la nueva generación de IA generativa.');

    // Card Left: Actual Diagnostic
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 2.1,
      w: 5.6,
      h: 4.6,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: 2.1,
      w: 5.6,
      h: 0.08,
      fill: { color: COLORS.amberPrimary },
      line: { type: 'none' }
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1,
      y: 2.35,
      w: 2.8,
      h: 0.32,
      rectRadius: 0.08,
      fill: { color: COLORS.amberSoft },
      line: { color: 'FDE68A', width: 1 }
    });
    slide.addText('DIAGNÓSTICO PARISHROBERTSON.COM.AR', {
      x: 1.1,
      y: 2.35,
      w: 2.8,
      h: 0.32,
      fontFace: FONT_FAMILY,
      fontSize: 7.5,
      bold: true,
      color: COLORS.amberPrimary,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Sitio Actual: Invisible para Motores de IA', {
      x: 1.1,
      y: 2.8,
      w: 5.0,
      h: 0.4,
      fontFace: FONT_FAMILY,
      fontSize: 14.5,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText('Carencia de estructura mobile-first y arquitectura invisible para motores de respuesta de IA (Search Generative Experience de Google, Perplexity, ChatGPT). Tiempos lentos y falta de metadatos educativos estructurados.', {
      x: 1.1,
      y: 3.25,
      w: 5.0,
      h: 1.1,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      color: COLORS.textMuted
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 1.1,
      y: 4.45,
      w: 5.0,
      h: 0,
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText([
      { text: '⚠️ Sin marcado Schema.org: ', options: { bold: true, color: COLORS.amberPrimary } },
      { text: 'Los motores de IA no pueden indexar niveles, horarios ni propuesta bilingüe estructurada.\n\n', options: { color: COLORS.textMain } },
      { text: '⚠️ Carga lenta en móviles: ', options: { bold: true, color: COLORS.amberPrimary } },
      { text: 'Fricción técnica que penaliza el posicionamiento en Monte Grande y Canning.', options: { color: COLORS.textMain } }
    ], {
      x: 1.1,
      y: 4.65,
      w: 5.0,
      h: 1.8,
      fontFace: FONT_FAMILY,
      fontSize: 9.5
    });

    // Card Right: Future Solution
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8,
      y: 2.1,
      w: 5.6,
      h: 4.6,
      rectRadius: 0.15,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 6.8,
      y: 2.1,
      w: 5.6,
      h: 0.08,
      fill: { color: COLORS.greenPrimary },
      line: { type: 'none' }
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.1,
      y: 2.35,
      w: 2.3,
      h: 0.32,
      rectRadius: 0.08,
      fill: { color: COLORS.navySoft },
      line: { color: 'BFDBFE', width: 1 }
    });
    slide.addText('SOLUCIÓN AEO & SEO 2026', {
      x: 7.1,
      y: 2.35,
      w: 2.3,
      h: 0.32,
      fontFace: FONT_FAMILY,
      fontSize: 7.5,
      bold: true,
      color: COLORS.navyPrimary,
      align: 'center',
      valign: 'middle'
    });

    slide.addText('Rediseño Institucional AEO/SEO', {
      x: 7.1,
      y: 2.8,
      w: 5.0,
      h: 0.4,
      fontFace: FONT_FAMILY,
      fontSize: 14.5,
      bold: true,
      color: COLORS.greenDeep
    });

    slide.addText('Implementación de marcado de datos Schema.org (EducationalOrganization), arquitectura por niveles, velocidad optimizada y contenido semántico estructurado para consultas por voz e IA en Monte Grande/Canning/Ezeiza.', {
      x: 7.1,
      y: 3.25,
      w: 5.0,
      h: 1.1,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      color: COLORS.textMuted
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 7.1,
      y: 4.45,
      w: 5.0,
      h: 0,
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText([
      { text: '✓ Optimizado para ChatGPT y Google SGE: ', options: { bold: true, color: COLORS.navyPrimary } },
      { text: 'Respuestas precisas cuando las familias consultan por colegios en la zona sur.\n\n', options: { color: COLORS.textMain } },
      { text: '✓ Experiencia Fluida: ', options: { bold: true, color: COLORS.navyPrimary } },
      { text: 'Navegación institucional moderna con estética alineada a los valores del colegio.', options: { color: COLORS.textMain } }
    ], {
      x: 7.1,
      y: 4.65,
      w: 5.0,
      h: 1.8,
      fontFace: FONT_FAMILY,
      fontSize: 9.5
    });
  }

  // ==========================================
  // SLIDE 7: CRONOGRAMA EN DOS VÍAS
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 7);
    addSlideHeader(slide, 'Planificación Temporal en Paralelo', '06. Plan de Trabajo en Dos Vías (Octubre – Enero)', 'Dos líneas de tiempo simultáneas con Kickoff a partir del 10 de octubre: prioridad operativa de admisiones y desarrollo web continuo.');

    // Track A Container
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 2.1,
      w: 11.7,
      h: 2.25,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText('●  TRACK A — CAMPAÑA DE ADMISIONES  (PRIORIDAD OPERATIVA INMEDIATA)', {
      x: 1.1,
      y: 2.2,
      w: 11.0,
      h: 0.3,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      bold: true,
      color: COLORS.greenLight
    });

    const trackARows = [
      ['10 al 24 Oct', 'Identidad & Preprensa: Paleta unificada, sello "Since 1963", diseño 1/2 A4 y arquitectura Landing Page.'],
      ['25 Oct – 10 Nov', 'Producción & Conexión: Impresión de folletería 1/2 A4, maquetación mobile-first y conexión Google Sheets.'],
      ['11 al 30 Nov', 'Lanzamiento & Despliegue: Salida online de la landing, distribución física y despliegue del Dashboard interno.'],
      ['Dic – Ene', 'Conversión & Guardias: Gestión del embudo de entrevistas, conversión y guardias para vacantes remanentes.']
    ];

    slide.addTable(
      trackARows.map(r => [
        { text: r[0], options: { bold: true, color: COLORS.greenDeep, fontSize: 8.5, fill: { color: COLORS.greenSoft } } },
        { text: r[1], options: { color: COLORS.textMain, fontSize: 8.5 } }
      ]),
      {
        x: 1.1,
        y: 2.55,
        w: 11.1,
        colW: [1.8, 9.3],
        rowH: [0.38, 0.38, 0.38, 0.38],
        fontFace: FONT_FAMILY,
        border: { pt: 0.5, color: COLORS.borderSubtle }
      }
    );

    // Track B Container
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.5,
      w: 11.7,
      h: 2.25,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText('●  TRACK B — REDISEÑO WEB INSTITUCIONAL & AEO  (DESARROLLO INDEPENDIENTE A LA PAR)', {
      x: 1.1,
      y: 4.6,
      w: 11.0,
      h: 0.3,
      fontFace: FONT_FAMILY,
      fontSize: 9.5,
      bold: true,
      color: COLORS.navyPrimary
    });

    const trackBRows = [
      ['Octubre', 'Auditoría & Arquitectura: Auditoría AEO/SEO, arquitectura de información y jerarquía de contenidos.'],
      ['Noviembre', 'Maquetación & Schema: Maquetación frontend responsive y marcado estructurado Schema.org.'],
      ['Diciembre', 'Contenidos & Optimización: Carga de contenidos, optimización semántica para IA y pruebas Core Web Vitals.'],
      ['Enero', 'Puesta Online & Dominios: Puesta online del nuevo sitio institucional y vinculación integral de dominios.']
    ];

    slide.addTable(
      trackBRows.map(r => [
        { text: r[0], options: { bold: true, color: COLORS.navyPrimary, fontSize: 8.5, fill: { color: COLORS.navySoft } } },
        { text: r[1], options: { color: COLORS.textMain, fontSize: 8.5 } }
      ]),
      {
        x: 1.1,
        y: 4.95,
        w: 11.1,
        colW: [1.8, 9.3],
        rowH: [0.38, 0.38, 0.38, 0.38],
        fontFace: FONT_FAMILY,
        border: { pt: 0.5, color: COLORS.borderSubtle }
      }
    );
  }

  // ==========================================
  // SLIDE 8: PRESUPUESTO & PAGOS
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 8);
    addSlideHeader(slide, 'Propuesta Económica & Financiación', '07. Estimación Presupuestaria & Modalidad de Inversión', 'Estructura modular por entregables y esquema financiero escalonado por hitos de avance.');

    // Budget Table
    slide.addTable([
      [
        { text: 'Módulo de Trabajo', options: { bold: true, color: COLORS.white, fill: { color: COLORS.greenDeep }, fontSize: 9.5 } },
        { text: 'Inversión (ARS)', options: { bold: true, color: COLORS.white, fill: { color: COLORS.greenDeep }, fontSize: 9.5, align: 'center' } },
        { text: 'Referencia (USD)', options: { bold: true, color: COLORS.white, fill: { color: COLORS.greenDeep }, fontSize: 9.5, align: 'center' } }
      ],
      [
        {
          text: '1. Núcleo Admisiones (Identidad 1/2 A4, Landing pura, Sheets, Dashboard y Automatización)\nNormalización gráfica, piezas 1/2 A4, landing mobile-first, CRM Sheets, pipeline de secretaría y confirmación por email.',
          options: { fontSize: 8.5, color: COLORS.textMain, fill: { color: COLORS.greenSoft } }
        },
        { text: '$1.650.000 ARS', options: { bold: true, fontSize: 11, color: COLORS.greenPrimary, align: 'center', valign: 'middle', fill: { color: COLORS.greenSoft } } },
        { text: 'USD 1.068', options: { bold: true, fontSize: 10, color: COLORS.textMuted, align: 'center', valign: 'middle', fill: { color: COLORS.greenSoft } } }
      ],
      [
        {
          text: '2. Módulo Independiente (Sitio Institucional Completo + Optimización AEO/SEO)\nRediseño web general parishrobertson.com.ar, arquitectura por niveles, Schema.org y posicionamiento en motores de IA.',
          options: { fontSize: 8.5, color: COLORS.textMain }
        },
        { text: '$1.475.000 ARS', options: { bold: true, fontSize: 11, color: COLORS.greenPrimary, align: 'center', valign: 'middle' } },
        { text: 'USD 955', options: { bold: true, fontSize: 10, color: COLORS.textMuted, align: 'center', valign: 'middle' } }
      ],
      [
        {
          text: '🚀 Implementación Integral Llave en Mano (Ambos Módulos)\nCampaña de admisiones completa + Rediseño institucional integral AEO/SEO.',
          options: { bold: true, fontSize: 9.5, color: COLORS.white, fill: { color: COLORS.navyDark } }
        },
        { text: '$3.125.000 ARS', options: { bold: true, fontSize: 12, color: '38BDF8', align: 'center', valign: 'middle', fill: { color: COLORS.navyDark } } },
        { text: 'USD 2.023', options: { bold: true, fontSize: 11, color: COLORS.white, align: 'center', valign: 'middle', fill: { color: COLORS.navyDark } } }
      ]
    ], {
      x: 0.8,
      y: 2.05,
      w: 11.7,
      colW: [7.2, 2.5, 2.0],
      rowH: [0.35, 0.75, 0.75, 0.75],
      fontFace: FONT_FAMILY,
      border: { pt: 0.5, color: COLORS.borderSubtle }
    });

    // Payment Milestones Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.85,
      w: 11.7,
      h: 1.9,
      rectRadius: 0.12,
      fill: { color: COLORS.white },
      line: { color: COLORS.borderSubtle, width: 1 }
    });

    slide.addText('💳  ESQUEMA DE PAGOS ESTRUCTURADO POR HITOS DE AVANCE  (KICKOFF: 10 DE OCTUBRE)', {
      x: 1.1,
      y: 4.95,
      w: 11.0,
      h: 0.3,
      fontFace: FONT_FAMILY,
      fontSize: 9,
      bold: true,
      color: COLORS.greenDeep
    });

    const milestones = [
      {
        title: 'Hito 1 • Launcher / Kickoff',
        desc: 'Previo al 10 de Octubre:\nPago inicial para activación de recursos y reserva del equipo (60%).',
        color: COLORS.greenMedium,
        bg: COLORS.greenSoft
      },
      {
        title: 'Hito 2 • Noviembre (Etapa 2/3)',
        desc: '20% del total:\nContra entrega de originales de imprenta 1/2 A4 y salida online de la Landing.',
        color: COLORS.skyPrimary,
        bg: COLORS.skySoft
      },
      {
        title: 'Hito 3 • Diciembre (Etapa 4)',
        desc: '20% del total:\nContra despliegue del Dashboard interno, automatizaciones y seguimiento.',
        color: COLORS.navyPrimary,
        bg: COLORS.navySoft
      }
    ];

    milestones.forEach((m, idx) => {
      const mx = 1.1 + idx * 3.75;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: mx,
        y: 5.3,
        w: 3.55,
        h: 0.95,
        rectRadius: 0.08,
        fill: { color: m.bg },
        line: { color: COLORS.borderSubtle, width: 1 }
      });

      slide.addText(m.title, {
        x: mx + 0.15,
        y: 5.35,
        w: 3.25,
        h: 0.25,
        fontFace: FONT_FAMILY,
        fontSize: 8.5,
        bold: true,
        color: m.color
      });

      slide.addText(m.desc, {
        x: mx + 0.15,
        y: 5.6,
        w: 3.25,
        h: 0.6,
        fontFace: FONT_FAMILY,
        fontSize: 7.5,
        color: COLORS.textMuted
      });
    });

    slide.addText('📌 Nota Operativa: Tipo de cambio de referencia: $1.545 ARS / USD. Los costos directos de imprenta e insumos físicos corren por cuenta de la escuela.', {
      x: 1.1,
      y: 6.35,
      w: 11.0,
      h: 0.3,
      fontFace: FONT_FAMILY,
      fontSize: 7.5,
      color: COLORS.textDim
    });
  }

  // ==========================================
  // SLIDE 9: PRÓXIMOS PASOS (KICKOFF)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideLayout(slide, 9);
    addSlideHeader(slide, 'Kickoff Inmediato • 10 de Octubre', '08. Próximos Pasos para la Puesta en Marcha', 'Acciones inmediatas para coordinar el inicio formal de las tareas según el cronograma acordado.');

    const steps = [
      {
        num: '1',
        title: 'Aprobación y Formalización',
        desc: 'Validación de partidas presupuestarias y firma de acuerdo para inicio formal el 10 de octubre.',
        action: '→ Validación del acuerdo',
        color: COLORS.skyPrimary
      },
      {
        num: '2',
        title: 'Relevamiento Técnico',
        desc: 'Entrega de accesos a hosting/dominio del colegio y asignación de carpeta en el Google Drive institucional.',
        action: '→ Setup de accesos',
        color: COLORS.greenLight
      },
      {
        num: '3',
        title: 'Primeros Entregables',
        desc: 'Presentación de muestras gráficas 1/2 A4 vertical y prototipo de pantalla para validación directiva.',
        action: '→ Validación de diseño',
        color: COLORS.amberPrimary
      }
    ];

    steps.forEach((s, idx) => {
      const sx = 0.8 + idx * 3.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: sx,
        y: 2.1,
        w: 3.75,
        h: 3.2,
        rectRadius: 0.15,
        fill: { color: COLORS.white },
        line: { color: COLORS.borderSubtle, width: 1 }
      });

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: sx + 0.3,
        y: 2.35,
        w: 0.45,
        h: 0.45,
        rectRadius: 0.08,
        fill: { color: COLORS.greenPrimary },
        line: { type: 'none' }
      });
      slide.addText(s.num, {
        x: sx + 0.3,
        y: 2.35,
        w: 0.45,
        h: 0.45,
        fontFace: FONT_FAMILY,
        fontSize: 13,
        bold: true,
        color: COLORS.white,
        align: 'center',
        valign: 'middle'
      });

      slide.addText(s.title, {
        x: sx + 0.3,
        y: 2.95,
        w: 3.15,
        h: 0.5,
        fontFace: FONT_FAMILY,
        fontSize: 12.5,
        bold: true,
        color: COLORS.greenDeep
      });

      slide.addText(s.desc, {
        x: sx + 0.3,
        y: 3.5,
        w: 3.15,
        h: 1.1,
        fontFace: FONT_FAMILY,
        fontSize: 9.5,
        color: COLORS.textMuted
      });

      slide.addText(s.action, {
        x: sx + 0.3,
        y: 4.75,
        w: 3.15,
        h: 0.35,
        fontFace: FONT_FAMILY,
        fontSize: 9,
        bold: true,
        color: s.color
      });
    });

    // Final Callout Banner
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 5.5,
      w: 11.7,
      h: 1.25,
      rectRadius: 0.15,
      fill: { color: COLORS.greenDeep },
      line: { type: 'none' }
    });

    slide.addText([
      { text: 'Transformemos juntos el proceso de admisiones del Colegio Parish Robertson.\n', options: { fontSize: 13, bold: true, color: COLORS.white } },
      { text: 'Muchas gracias por su confianza e interés en innovar y potenciar la captación institucional para el próximo ciclo lectivo.', options: { fontSize: 9.5, color: 'E0F2FE' } }
    ], {
      x: 1.2,
      y: 5.55,
      w: 10.9,
      h: 1.15,
      fontFace: FONT_FAMILY,
      valign: 'middle'
    });
  }

  const outputPath = path.resolve(__dirname, '../ParishRobertson/Plan_Modernizacion_Colegio_Parish_Robertson_2026.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`PPTX generado con éxito en: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error generando PPTX:', err);
  process.exit(1);
});
