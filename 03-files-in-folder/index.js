const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;

      if (stats.isFile()) {
        const ext = path.extname(file);
        const size = stats.size / 1024;
        console.log(`${file} - ${ext.slice(1)} - ${size.toFixed(3)}kb`);
      }
    });
  });
});
