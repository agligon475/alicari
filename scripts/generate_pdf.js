const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  // Find Edge executable
  const possiblePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
  ];

  let executablePath = possiblePaths.find(p => p && fs.existsSync(p));

  if (!executablePath) {
    throw new Error('No se encontró ejecutable de Microsoft Edge o Chrome en el sistema.');
  }

  console.log(`Usando navegador: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--disable-web-security',
      '--font-render-hinting=max'
    ]
  });

  const page = await browser.newPage();
  
  // High-DPI 16:9 Viewport
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2
  });

  const htmlPath = path.resolve(__dirname, '../ParishRobertson/index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  console.log(`Cargando página: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for Google Fonts to be fully loaded
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 1000));

  const outputPath = path.resolve(__dirname, '../ParishRobertson/Plan_Modernizacion_Colegio_Parish_Robertson_2026.pdf');

  console.log('Generando PDF en formato horizontal 16:9...');

  await page.pdf({
    path: outputPath,
    printBackground: true,
    preferCSSPageSize: true,
    landscape: false,
    width: '1920px',
    height: '1080px',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log(`PDF generado exitosamente en: ${outputPath}`);
}

generatePDF().catch(err => {
  console.error('Error generando PDF:', err);
  process.exit(1);
});
