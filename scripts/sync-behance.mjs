import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Parser from 'rss-parser';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BEHANCE_USERNAME = 'alicari';
const FEED_URL = `https://www.behance.net/feeds/user?username=${BEHANCE_USERNAME}`;
const PORTFOLIO_IMG_DIR = path.join(ROOT_DIR, 'public', 'images', 'portfolio');
const PROJECTS_JSON_PATH = path.join(ROOT_DIR, 'src', 'data', 'projects.json');

const CATEGORY_META = {
  uxui: 'Diseño UX/UI · Behance',
  webdesign: 'Diseño Web · Behance',
  branding: 'Branding · Behance',
  multimedia: 'Multimedia · Behance',
  fotografia: 'Fotografía · Behance',
  marketing: 'Marketing · Behance',
};

// Proyectos históricos del portafolio que quedan fuera del límite de 12 ítems del RSS de Behance
const HISTORICAL_PROJECTS = [
  {
    id: 'garzon-brasserie',
    title: 'Garzón brasserie',
    category: 'branding',
    meta: 'Branding · Behance',
    behanceUrl: 'https://www.behance.net/gallery/99329715/Garzon-brasserie',
    sourceImage: 'public/images/projects/project-12-garzon.jpg',
  },
  {
    id: 'keeper-confianza-en-cada-detalle',
    title: 'KEEPER | Confianza en cada detalle',
    category: 'branding',
    meta: 'Branding · Behance',
    behanceUrl: 'https://www.behance.net/gallery/99328887/KEEPER-Packaging-Identidad',
    sourceImage: 'public/images/projects/project-13-keeper.jpg',
  },
  {
    id: 'el-extratonauta',
    title: 'EL EXTRATONAUTA',
    category: 'marketing',
    meta: 'Editorial · Behance',
    behanceUrl: 'https://www.behance.net/gallery/99328229/El-Extratonauta-Diseno-de-personaje-editorial',
    sourceImage: 'public/images/projects/project-14-extratonauta.jpg',
  },
  {
    id: 'las-empanadas-de-mama-isa',
    title: 'Las Empanadas de Mama Isa',
    category: 'branding',
    meta: 'Branding · Behance',
    behanceUrl: 'https://www.behance.net/gallery/99327571/Las-Empanadas-de-Mama-Isa-Carteleria-Branding',
    sourceImage: 'public/images/projects/project-15-mamaisa.jpg',
  },
  {
    id: 'sesion-fotografica-book-de-fotos',
    title: 'Sesión Fotográfica / Book de Fotos',
    category: 'fotografia',
    meta: 'Fotografía · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-16-book.jpg',
  },
  {
    id: 'la-perra-que-los-pario-recital-en-vivo',
    title: 'La Perra que los Parió / Recital en Vivo',
    category: 'fotografia',
    meta: 'Fotografía · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-17-laperra.jpg',
  },
  {
    id: 'banda-en-vivo-show-acustico',
    title: 'Banda en Vivo / Show Acústico',
    category: 'fotografia',
    meta: 'Fotografía · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-18-banda.jpg',
  },
  {
    id: 'danza-teatro-obras-escenicas',
    title: 'Danza Teatro / Obras Escénicas',
    category: 'fotografia',
    meta: 'Fotografía · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-19-danza.jpg',
  },
  {
    id: 'charles-leeray-nomeolvides',
    title: 'Charles Leeray @nomeolvides',
    category: 'multimedia',
    meta: 'Audiovisual · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-20-charles.jpg',
  },
  {
    id: 'fotografia-gastronomica-platos-cocktails',
    title: 'Fotografía Gastronómica / Platos & Cocktails',
    category: 'fotografia',
    meta: 'Fotografía · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-21.jpg',
  },
  {
    id: 'afiches-grafica-cultural',
    title: 'Afiches & Gráfica Cultural',
    category: 'marketing',
    meta: 'Gráfica · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-22.jpg',
  },
  {
    id: 'diseno-de-locales-puntos-de-venta',
    title: 'Diseño de Locales & Puntos de Venta',
    category: 'branding',
    meta: 'Espacios · Behance',
    behanceUrl: 'https://www.behance.net/alicari',
    sourceImage: 'public/images/projects/project-23.jpg',
  },
];

function decodeHtmlEntities(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function slugify(text = '') {
  return decodeHtmlEntities(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractImageUrl(item) {
  const html = item['content:encoded'] || item.content || item.description || '';
  const match = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  if (match && match[1]) {
    return match[1];
  }
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  return null;
}

function inferCategory(title = '', description = '', categories = []) {
  const combined = `${title} ${description} ${categories.join(' ')}`.toLowerCase();
  const titleLower = title.toLowerCase();

  if (/\b(ux|ui|ux\/ui|uxui|simpath|interfaz|app)\b/i.test(combined)) {
    return 'uxui';
  }
  if (/^(branding|brand|identidad|manual de marca)/i.test(titleLower)) {
    return 'branding';
  }
  if (/\b(web\s*design|web\s+zona|diseño\s+web|landing|ecommerce)\b/i.test(combined) || /^web\b/i.test(titleLower)) {
    return 'webdesign';
  }
  if (/\b(branding|marca|logotipo|logo|guideline|identidad|packaging)\b/i.test(combined)) {
    return 'branding';
  }
  if (/\b(video|videoclip|motion|audiovisual|shots|reel|animaci)\b/i.test(combined)) {
    return 'multimedia';
  }
  if (/\b(foto|fotograf|photo|book|recital|escenic|gastronom)\b/i.test(combined)) {
    return 'fotografia';
  }
  if (/\b(social\s*media|ad\b|ads\b|marketing|editorial|afiche|campana|campaña)\b/i.test(combined)) {
    return 'marketing';
  }

  return 'branding';
}

async function processImageBuffer(inputBufferOrPath, destPath) {
  await sharp(inputBufferOrPath)
    .resize(800, 600, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 85 })
    .toFile(destPath);
}

async function downloadAndProcessImage(imageUrl, destPath) {
  const response = await fetch(imageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al descargar imagen: ${imageUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await processImageBuffer(buffer, destPath);
}

async function loadExistingProjects() {
  try {
    if (!existsSync(PROJECTS_JSON_PATH)) return [];
    const raw = await fs.readFile(PROJECTS_JSON_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('⚠️ No se pudo leer src/data/projects.json existente, se creará uno nuevo.', err.message);
    return [];
  }
}

async function syncBehancePortfolio() {
  console.log(`🔄 Sincronizando portafolio de Behance (@${BEHANCE_USERNAME})...`);

  await fs.mkdir(PORTFOLIO_IMG_DIR, { recursive: true });
  await fs.mkdir(path.dirname(PROJECTS_JSON_PATH), { recursive: true });

  const existingProjects = await loadExistingProjects();
  const existingById = new Map(existingProjects.map((p) => [p.id, p]));
  const existingByUrl = new Map(
    existingProjects
      .filter((p) => p.behanceUrl && p.behanceUrl !== 'https://www.behance.net/alicari')
      .map((p) => [p.behanceUrl.toLowerCase(), p])
  );

  const parser = new Parser({
    customFields: {
      item: [['content:encoded', 'content:encoded']],
    },
  });

  const feed = await parser.parseURL(FEED_URL);
  console.log(`📥 Proyectos encontrados en el feed RSS: ${feed.items.length}`);

  const syncedProjects = [];
  const syncedIds = new Set();
  const syncedUrls = new Set();

  for (const item of feed.items) {
    const cleanTitle = decodeHtmlEntities(item.title || 'Proyecto sin título');
    const behanceUrl = (item.link || item.guid || '').trim();
    const existingMatch = existingByUrl.get(behanceUrl.toLowerCase());

    const slug = existingMatch?.id || slugify(cleanTitle);
    const imageFileName = `${slug}.webp`;
    const localImagePath = path.join(PORTFOLIO_IMG_DIR, imageFileName);
    const publicImageUrl = `/images/portfolio/${imageFileName}`;

    const remoteImageUrl = extractImageUrl(item);

    if (!existsSync(localImagePath)) {
      if (remoteImageUrl) {
        try {
          console.log(`⬇️ Descargando y optimizando portada: ${imageFileName}`);
          await downloadAndProcessImage(remoteImageUrl, localImagePath);
        } catch (err) {
          console.error(`❌ Error procesando imagen para "${cleanTitle}":`, err.message);
        }
      } else {
        console.warn(`⚠️ No se encontró miniatura en el RSS para "${cleanTitle}"`);
      }
    } else {
      console.log(`✅ Imagen ya existente: ${imageFileName}`);
    }

    const snippet = decodeHtmlEntities(item['content:encodedSnippet'] || item.contentSnippet || '');
    const rssCategories = Array.isArray(item.categories) ? item.categories : [];
    const category = existingMatch?.category || existingById.get(slug)?.category || inferCategory(cleanTitle, snippet, rssCategories);
    const meta = existingMatch?.meta || CATEGORY_META[category] || 'Portfolio · Behance';

    const projectData = {
      id: slug,
      title: cleanTitle,
      category,
      meta,
      imageUrl: publicImageUrl,
      behanceUrl,
    };

    syncedProjects.push(projectData);
    syncedIds.add(slug);
    if (behanceUrl) {
      syncedUrls.add(behanceUrl.toLowerCase());
    }
  }

  // Preservar proyectos existentes en projects.json que ya no están en los últimos 12 del RSS
  for (const existing of existingProjects) {
    const urlLower = (existing.behanceUrl || '').toLowerCase();
    const isGenericProfileUrl = urlLower === 'https://www.behance.net/alicari';
    if (!syncedIds.has(existing.id) && (isGenericProfileUrl || !urlLower || !syncedUrls.has(urlLower))) {
      syncedProjects.push(existing);
      syncedIds.add(existing.id);
      if (urlLower && !isGenericProfileUrl) syncedUrls.add(urlLower);
    }
  }

  // Asegurar que los proyectos históricos del sitio también estén optimizados en WebP e incluidos
  for (const hist of HISTORICAL_PROJECTS) {
    const urlLower = hist.behanceUrl.toLowerCase();
    const isGenericProfileUrl = urlLower === 'https://www.behance.net/alicari';
    if (syncedIds.has(hist.id) || (!isGenericProfileUrl && syncedUrls.has(urlLower))) {
      continue;
    }

    const imageFileName = `${hist.id}.webp`;
    const localImagePath = path.join(PORTFOLIO_IMG_DIR, imageFileName);
    const publicImageUrl = `/images/portfolio/${imageFileName}`;
    const sourcePath = path.join(ROOT_DIR, hist.sourceImage);

    if (!existsSync(localImagePath) && existsSync(sourcePath)) {
      try {
        console.log(`🖼️ Optimizando proyecto histórico a WebP: ${imageFileName}`);
        await processImageBuffer(sourcePath, localImagePath);
      } catch (err) {
        console.error(`❌ Error optimizando imagen histórica "${hist.title}":`, err.message);
      }
    }

    syncedProjects.push({
      id: hist.id,
      title: hist.title,
      category: hist.category,
      meta: hist.meta,
      imageUrl: publicImageUrl,
      behanceUrl: hist.behanceUrl,
    });
    syncedIds.add(hist.id);
  }

  await fs.writeFile(PROJECTS_JSON_PATH, JSON.stringify(syncedProjects, null, 2) + '\n', 'utf-8');
  console.log(`✨ Sincronización completada. Total de proyectos en src/data/projects.json: ${syncedProjects.length}`);
}

syncBehancePortfolio().catch((err) => {
  console.error('❌ Error fatal en sync-behance:', err);
  process.exit(1);
});
