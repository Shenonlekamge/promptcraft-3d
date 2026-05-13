import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 UPDATED PATH: Goes up one level, then into frontend/public/models
const modelsDir = path.join(__dirname, '../frontend/public/models');
const outputFile = path.join(__dirname, '../frontend/public/models/manifest.json');

const formatLabel = (filename) => {
  return filename
    .replace('.glb', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const generateManifest = () => {
  console.log(`🔍 Searching in: ${modelsDir}`);

  if (!fs.existsSync(modelsDir)) {
    console.error(`❌ ERROR: Could not find the folder at ${modelsDir}`);
    return;
  }

  const files = fs.readdirSync(modelsDir);
  const glbFiles = files.filter(file => file.endsWith('.glb'));

  const manifest = glbFiles.map(file => {
    const type = file.replace('.glb', '');
    let category = "General";
    if (type.toLowerCase().startsWith('bathroom')) category = "Bathroom";
    if (type.toLowerCase().startsWith('bed')) category = "Bedroom";
    if (type.toLowerCase().startsWith('bookcase')) category = "Storage";
    if (type.toLowerCase().startsWith('chair') || type.toLowerCase().startsWith('sofa')) category = "Seating";

    return {
      type: type,
      label: formatLabel(file),
      category: category
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
  console.log(`✅ Success! Generated manifest with ${manifest.length} assets.`);
  console.log(`📄 Manifest saved to: ${outputFile}`);
};

generateManifest();