// Rasterize the SVG layouts with PNG-embedded portraits: librsvg may omit WebP images.
const fs = require('node:fs/promises');
const sharp = require('sharp');
(async () => {
  const portrait = await sharp('public/phone/portrait.webp').png().toBuffer();
  for (const name of ['cover', 'inside']) {
    const svg = (await fs.readFile(`public/phone/${name}.svg`, 'utf8'))
      .replace(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g, `data:image/png;base64,${portrait.toString('base64')}`);
    await sharp(Buffer.from(svg)).png().toFile(`public/phone/${name}.png`);
    console.log(`Rendered ${name}.png with portrait`);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
