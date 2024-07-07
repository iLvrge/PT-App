const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build', 'static', 'js');
const version = process.argv[2] || '1.0.0';

// Read all files in the build/static/js directory
fs.readdir(buildDir, (err, files) => {
  if (err) {
    console.error('Error reading build directory:', err);
    return;
  }

  files.forEach(file => {
    const oldPath = path.join(buildDir, file);
    const newPath = path.join(buildDir, `${file}?v=${version}`);

    fs.rename(oldPath, newPath, err => {
      if (err) {
        console.error('Error renaming file:', err);
        return;
      }
      console.log(`Renamed ${file} to ${file}?v=${version}`);
    });
  });
});

// Update index.html to reference the new filenames
const indexPath = path.join(__dirname, 'build', 'index.html');
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  let updatedData = data;
  files.forEach(file => {
    const regex = new RegExp(file, 'g');
    updatedData = updatedData.replace(regex, `${file}?v=${version}`);
  });

  fs.writeFile(indexPath, updatedData, 'utf8', err => {
    if (err) {
      console.error('Error updating index.html:', err);
      return;
    }
    console.log('Updated index.html with versioned filenames');
  });
});
