const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR  = './IMMAGINI ';
const OUTPUT_DIR = './IMMAGINI /ottimizzate';
const MAX_WIDTH  = 1200;
const QUALITY    = 85;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimizeImage(inputPath, outputDir) {
  ensureDir(outputDir);
  const ext      = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const outPath  = path.join(outputDir, baseName + '.webp');

  try {
    const meta    = await sharp(inputPath).metadata();
    const resized = meta.width > MAX_WIDTH
      ? sharp(inputPath).resize(MAX_WIDTH, null, { withoutEnlargement: true })
      : sharp(inputPath);

    await resized.webp({ quality: QUALITY }).toFile(outPath);

    const inKB  = Math.round(fs.statSync(inputPath).size / 1024);
    const outKB = Math.round(fs.statSync(outPath).size / 1024);
    const saved = Math.round((1 - outKB / inKB) * 100);
    console.log(`✓ ${baseName} | ${inKB}KB → ${outKB}KB (-${saved}%)`);
  } catch (e) {
    console.error(`✗ ${baseName}: ${e.message}`);
  }
}

async function walk(dir, outDir) {
  ensureDir(outDir);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullIn  = path.join(dir, entry.name);
    const fullOut = path.join(outDir, entry.name);
    if (entry.isDirectory() && entry.name !== 'ottimizzate' && !entry.name.includes('USARE') && !entry.name.includes('INFO') && !entry.name.includes('info')) {
      await walk(fullIn, fullOut);
    } else if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)) {
      await optimizeImage(fullIn, outDir);
    }
  }
}

walk(INPUT_DIR, OUTPUT_DIR).then(() => console.log('\n✅ Ottimizzazione completata!'));
