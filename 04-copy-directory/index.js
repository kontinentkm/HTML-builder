const fs = require('fs');
const path = require('path');
const filesСopyFolder = path.join(__dirname, 'files-copy');


const copyDir = async () => {
  await fs.promises.rm(filesСopyFolder, { recursive: true, force: true });
  await fs.promises.mkdir(filesСopyFolder, { recursive: true });

  const files = await fs.promises.readdir('04-copy-directory/files');

  for (const file of files) {
    const source = path.join('04-copy-directory/files', file);
    const destination = path.join(filesСopyFolder, file);
    await fs.promises.copyFile(source, destination);
  }
};

copyDir();

