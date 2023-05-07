const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, 'output.txt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Введите текст: ',
});

rl.prompt();

rl.on('line', (input) => {

  if (input === 'exit') {
    console.log('До свидания!');
    process.exit(0);
  }

  if (!fileName) {
    fs.writeFile(fileName, input, (err) => {
      if (err) throw err;
      fileExists = true;
      console.log(`Текст "${input}" успешно записан в файл ${fileName}`);
      rl.prompt();
    });
  } else {
    fs.appendFile(fileName, `\n${input}`, (err) => {
      if (err) throw err;
      console.log(`Текст "${input}" успешно добавлен в файл ${fileName}`);
      rl.prompt();
    });
  }
});

rl.on('SIGINT', () => {
  console.log('До свидания!');
  process.exit(0);
});
