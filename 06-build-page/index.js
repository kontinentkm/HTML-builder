const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distPath = path.join(__dirname, 'project-dist');
const distPathAssets = path.join(distPath, 'assets');
const outputPath = path.join(distPath, 'style.css');

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

const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFileAsync = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const replaceTags = async (template, components) => {
  let result = template;
  for (const componentName of components) {
    const componentPath = path.join(componentsPath, `${componentName}.html`);
    const componentContent = await readFileAsync(componentPath);
    result = result.split(`{{${componentName}}}`).join(componentContent);
  }
  return result;
};

async function copyFolderAsync(srcPath, destPath) {
  try {
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
  } catch (err) {
    console.error(`Error copying folder: ${err}`);
  }
};

const mergeStyles = async () => {

  const files = await readDirAsync(stylesPath);

  const styles = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(stylesPath, file);
      const data = await readFileAsync(filePath);
      return data;
    })
  );

  const outputData = styles.join('\n');

  await writeFileAsync(outputPath, outputData);
};


const buildHTML = async () => {

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  const template = await readFileAsync(templatePath);

  const tagRegex = /\{\{(.+?)\}\}/g;
  const components = [];
  let match;
  while ((match = tagRegex.exec(template))) {
    const componentName = match[1];
    if (!components.includes(componentName)) {
      components.push(componentName);
    }
  }

  const html = await replaceTags(template, components);

  const htmlPath = path.join(distPath, 'index.html');
  await writeFileAsync(htmlPath, html);

  await copyFolderAsync(assetsPath, distPathAssets);

  await mergeStyles();
};

buildHTML()
  .then(() => {
    console.log('project-dist folder build complete');
  })
  .catch((err) => {
    console.error(err);
  });
