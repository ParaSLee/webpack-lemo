'use strict';

process.env.NODE_ENV = 'development';

// 抛出没有捕捉到的错误
process.on('unhandledRejection', err => {
    throw err;
});

require('../config/loadEnv');

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk'); // 有颜色、格式的输出提示(转换为string)
const browserslist = require('browserslist'); // 用来校验是否配置了browserslist

const paths = require('../config/paths');
const webpackConf = require('../config/webpack.config');
const webpackDevServerConf = require('../config/webpackDevServer.config');

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
devServer.listen(DEFAULT_PORT);
