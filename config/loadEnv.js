'use strict';

// 环境变量校验
if (!process.env.NODE_ENV) {
    throw new Error('没能找到环境变量 NODE_ENV, 该变量必须声明');
}

// 自定义变量装载，会自动查找 ./.env
require('dotenv').config();

if (['production', 'buildDebug'].includes(process.env.NODE_ENV)) {
    // 配置browserslist的环境
    process.env.BROWSERSLIST_ENV = 'production';

} else {
    // 配置browserslist的环境
    process.env.BROWSERSLIST_ENV = 'development';
    // 开启devServer.disableHostCheck选项
    process.env.CLOSE_DEVSERVER_HOST_CHECK = true;
}
