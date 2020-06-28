'use strict';

process.env.NODE_ENV = 'production';

// 抛出没有捕捉到的错误
process.on('unhandledRejection', err => {
    throw err;
});

require('../config/loadEnv');

const webpack = require('webpack');
const chalk = require('chalk'); // 有颜色、格式的输出提示(转换为string)
const browserslist = require('browserslist'); // 用来校验是否配置了browserslist

const paths = require('../config/paths');
const webpackConf = require('../config/webpack.config');
const FileSizeReporter = require('./utils/fileSizeReporter');

const WARN_BUNDLE_GZIP_SIZE = 512 * 1024; // 打包后bundle文件大于512kb提示过大
const WARN_CHUNK_GZIP_SIZE = 1024 * 1024; // 打包后chunk文件大于1m提示过大

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

new Promise((resolve) => {
    resolve(FileSizeReporter.measureFileSizesBeforeBuild(paths.appBuild));  
}).then(previousFileSizes => {
    console.log('开始构建应用程序...\n');

    // 将webpack以module包的形式使用，webpack(config)可以得到webpack的编译程序(compiler)
    const compiler = webpack(webpackConf);

    /*
        Tip:
        通过node来运行webpack打包，而不是直接运行webpack进行打包，使得这个过程更可控
    */ 
    // 调用compiler.run调用一次webpack的打包服务，可以在里面处理打包结果
    compiler.run((err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const webpackMsg = stats.toJson({ all: false, warnings: true, errors: true });

        if (webpackMsg.errors.length > 0) {
            new Error(messages.errors.join('\n\n'));
            console.log(chalk.bgRed('构建失败.\n'));
        }

        if (webpackMsg.errors.length > 0) {
            console.warn(messages.warnings.join('\n\n'));
            console.log(chalk.bgYellow('构建出现警告.\n'));
        } else {
            console.log(chalk.green('构建完成.\n'));
        }

        console.log(chalk.green('构建结果:\n'));

        FileSizeReporter.printFileSizesAfterBuild(
            stats,
            previousFileSizes,
            paths.appBuild,
            WARN_BUNDLE_GZIP_SIZE,
            WARN_CHUNK_GZIP_SIZE
        );
        console.log();
    });
}).catch(err => {
    if (err && err.message) {
        console.log(err.message);
    }
    process.exit(1);
})



