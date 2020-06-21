'use strict';

process.env.NODE_ENV = 'production';

// 抛出没有捕捉到的错误
process.on('unhandledRejection', err => {
    throw err;
});

require('../config/loadEnv');

const webpack = require('webpack');
const webpackConf = require('../config/webpack.config');

webpack(webpackConf).run((res, err) => {

});
