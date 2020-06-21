'use strict';

process.env.NODE_ENV = 'development';

// 抛出没有捕捉到的错误
process.on('unhandledRejection', err => {
    throw err;
});

require('../config/loadEnv');
