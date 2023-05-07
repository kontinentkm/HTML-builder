const fs = require('fs');
const path = require('path');

const STYLES_FOLDER = 'styles';
const DIST_FOLDER = 'project-dist';
const OUTPUT_FILE = 'bundle.css';

const readDirAsync = async (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const isCssFile = (file) => {
  const extname = path.extname(file);
  return extname === '.css';
};

const mergeStyles = async () => {
  const stylesPath = path.join(__dirname, STYLES_FOLDER);
  const distPath = path.join(__dirname, DIST_FOLDER);
  const outputPath = path.join(distPath, OUTPUT_FILE);

  try {
    await fs.promises.mkdir(distPath);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  const files = await readDirAsync(stylesPath);

  const cssFiles = files.filter(isCssFile);

  const styles = await Promise.all(
    cssFiles.map(async (file) => {
      const filePath = path.join(stylesPath, file);
      const data = await readFileAsync(filePath);
      return data;
    })
  );

  const outputData = styles.join('\n');

  await writeFileAsync(outputPath, outputData);
};

mergeStyles();
