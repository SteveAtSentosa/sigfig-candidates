/* eslint no-console: 0 */
const ngrok = require('ngrok');
const chalk = require('chalk');
const clipboardy = require('clipboardy');

const connect = async () => {
  const url = await ngrok.connect({
    proto: 'http',
    addr: 8080,
  });

  await clipboardy.write(url);

  console.log(chalk.green('ngrok tunnel to http:://localhost:8080 is running...'));
  console.log(`Public URL - ${chalk.red(url)}. [Copied to clipboard]`);
};

connect();
