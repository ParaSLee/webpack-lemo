const address = require('address');
const chalk = require('chalk');

module.exports = function printInstructions(appName, urls, useYarn) {
    console.log();
    console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
    console.log();
  
    // if (urls.lanUrlForTerminal) {
      console.log(
        // `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
        `  ${chalk.bold('Local:')}            localhost:3000`
      );
      console.log(
        `  ${chalk.bold('On Your Network:')}  ${address.ip()}`
      );
    // } else {
    // //   console.log(`  ${urls.localUrlForTerminal}`);
    //   console.log(`  localhost:3000`);
    // }
  
    console.log();
    console.log('Note that the development build is not optimized.');
    console.log(
        `To create a production build, use ` +
          `${chalk.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`
      );
    console.log();
}