// scripts/scan-icons.js
const fs = require('fs');
const path = require('path');

const SRC_DIRS = ['src', 'app']; // proje yapına göre ekle/çıkar
const FILE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const ICON_REGEX = /["'`]([a-zA-Z][a-zA-Z0-9_-]*:[a-zA-Z][a-zA-Z0-9:_/-]*)["'`]/g;
// ör: icon="mdi:home", icon="material-symbols:add-rounded"

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (FILE_EXTS.includes(path.extname(entry))) files.push(full);
  }
  return files;
}

function scan() {
  const icons = new Set();
  for (const root of SRC_DIRS) {
    for (const file of walk(root)) {
      const text = fs.readFileSync(file, 'utf8');
      let m;
      while ((m = ICON_REGEX.exec(text))) {
        icons.add(m[1]);
      }
    }
  }
  return Array.from(icons).sort();
}

function writeOutput(list) {
  const outPath = path.resolve('iconify.generated.json');
  fs.writeFileSync(outPath, JSON.stringify({ icons: list }, null, 2));
  console.log(`Found ${list.length} icons → ${outPath}`);
}

writeOutput(scan());