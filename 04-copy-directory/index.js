const fs = require('fs');
const path = require('path');
const assetsPath = path.join(__dirname, 'files');
const distPathAssets = path.join(__dirname, 'files-copy');

async function copyFolderAsync(srcPath, destPath) {
  await fs.promises.rm(destPath, { recursive: true, force: true });
  await fs.promises.mkdir(destPath, { recursive: true });

  const files = await fs.promises.readdir(srcPath);

  for (const file of files) {
    const srcFilePath = path.join(srcPath, file);
    const destFilePath = path.join(destPath, file);
    const fileStat = await fs.promises.stat(srcFilePath);

    if (fileStat.isDirectory()) {
      await copyFolderAsync(srcFilePath, destFilePath);
    } else {
      await fs.promises.copyFile(srcFilePath, destFilePath);
    }
  }
};

copyFolderAsync(assetsPath, distPathAssets);

