// 环境变量校验以及自定义变量装载
'use strict';

if (!process.env.NODE_ENV) {
    throw new Error('没能找到环境变量 NODE_ENV, 该变量必须声明');
}

require('dotenv').config();
