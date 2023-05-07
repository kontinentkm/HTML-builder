const fs = require('fs');
const path = require('path');

const copyDir = async () => {
  await fs.promises.mkdir('04-copy-directory/files-copy', { recursive: true });

  const files = await fs.promises.readdir('04-copy-directory/files');

  for (const file of files) {
    const source = path.join('04-copy-directory/files', file);
    const destination = path.join('04-copy-directory/files-copy', file);
    await fs.promises.copyFile(source, destination);
  }
};

copyDir();

