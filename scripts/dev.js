'use strict';

process.env.NODE_ENV = 'development';

// 抛出没有捕捉到的错误
process.on('unhandledRejection', err => {
    throw err;
});

require('../config/loadEnv');

const fs = require('fs');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk'); // 有颜色、格式的输出提示(转换为string)
const browserslist = require('browserslist'); // 用来校验是否配置了browserslist

const paths = require('../config/paths');
const webpackConf = require('../config/webpack.config');
const webpackDevServerConf = require('../config/webpackDevServer.config');
const appName = require(paths.appPackageJson).name;
const useYarn = fs.existsSync(paths.yarnLockFile);

const clearConsole = require('./utils/clearConsole');
const formatWebpackMessages = require('./utils/formatWebpackMessages');
const printInstructions = require('./utils/printInstructions');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

/*
    Tip:
    对于babel、autoprefixer等兼容工具，配置browserslist能保证浏览器的适配，以及节省没必要的兼容代码
*/ 
// 对browserslist的检测和提示。
const current = browserslist.loadConfig({ path: paths.appRoot });
if (!current) {
    console.log(chalk.yellow(`尚未配置${chalk.underline(chalk.blue('browserslist'))}, 将使用默认配置：`));
    console.log(chalk.yellow('[> 0.5%, last 2 versions, Firefox ESR, not dead]\n'));
}


// 将webpack以module包的形式使用，webpack(config)可以得到webpack的编译程序(compiler)
const compiler = webpack(webpackConf);

/*
    Tip:
    通过node来启动webpack-dev-server，而不是直接运行webpack-dev-server启动服务，使得这个过程更可控
*/ 
// 将webpack-dev-server以module包的形式使用，能创建一个服务
const devServer = new webpackDevServer(compiler, webpackDevServerConf)
// 通过监听服务能获取到服务的变化，从而得以反馈到页面上
devServer.listen(DEFAULT_PORT, HOST, (err) => {
    if (err) {
        return console.log(err);
    }
    clearConsole();

    console.log(chalk.cyan('服务启动中...\n'));
});

let isFirstCompile = true;
compiler.hooks.done.tap('done', async stats => {
    clearConsole();

    // We have switched off the default webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We only construct the warnings and errors for speed:
    // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    // if (useTypeScript && statsData.errors.length === 0) {
    //   const delayedMsg = setTimeout(() => {
    //     console.log(
    //       chalk.yellow(
    //         'Files successfully emitted, waiting for typecheck results...'
    //       )
    //     );
    //   }, 100);

    //   const messages = await tsMessagesPromise;
    //   clearTimeout(delayedMsg);
    //   if (tscCompileOnError) {
    //     statsData.warnings.push(...messages.errors);
    //   } else {
    //     statsData.errors.push(...messages.errors);
    //   }
    //   statsData.warnings.push(...messages.warnings);

    //   // Push errors and warnings into compilation result
    //   // to show them after page refresh triggered by user.
    //   if (tscCompileOnError) {
    //     stats.compilation.warnings.push(...messages.errors);
    //   } else {
    //     stats.compilation.errors.push(...messages.errors);
    //   }
    //   stats.compilation.warnings.push(...messages.warnings);

    //   if (messages.errors.length > 0) {
    //     if (tscCompileOnError) {
    //       devSocket.warnings(messages.errors);
    //     } else {
    //       devSocket.errors(messages.errors);
    //     }
    //   } else if (messages.warnings.length > 0) {
    //     devSocket.warnings(messages.warnings);
    //   }

    //   if (isInteractive) {
    //     clearConsole();
    //   }
    // }

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      console.log(chalk.green('启动成功!'));
    }
    if (isSuccessful && ( isFirstCompile)) {
      printInstructions(appName, 'urls', useYarn);
    }
    isFirstCompile = false;

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n\n'));
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n\n'));

      // Teach some ESLint tricks.
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      );
    }
});