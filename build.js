const fs = require('fs');
const path = require('path');

// Function to copy directories recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Get all files and directories in source
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // If it's a directory, copy it recursively
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to update the Phaser script tag in HTML
function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js',
    'phaser.min.js'
  );
  fs.writeFileSync(filePath, content);
}

// Start build process
console.log('Starting build process...');

// 1. Clean up previous build if exists
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
  console.log('Cleaned up previous build.');
}

// 2. Create dist directory
fs.mkdirSync('dist', { recursive: true });
console.log('Created dist directory.');

// 3. Copy files and directories
fs.copyFileSync('index.html', 'dist/index.html');
console.log('Copied index.html');

copyDir('assets', 'dist/assets');
console.log('Copied assets directory.');

copyDir('js', 'dist/js');
console.log('Copied js directory.');

// 4. Copy Phaser library
const phaserSrc = path.join('node_modules', 'phaser', 'dist', 'phaser.min.js');
fs.copyFileSync(phaserSrc, 'dist/phaser.min.js');
console.log('Copied Phaser library.');

// 5. Update HTML file to use local Phaser
updateHtmlFile('dist/index.html');
console.log('Updated HTML to use local Phaser library.');

console.log('Build completed successfully! The bundled game is in the dist directory.'); 