'use strict';
const fs = require('fs');
const path = require('path');

// process.cwd() 获取node命令执行时所在的文件夹目录
// fs.realpathSync(path) 获取path的绝对路径
/*
    Tip:
    运行package.json里的指令 npm run xxx 以执行 node xxx，因为package.json在根目录
    即使config里文件的路径变了，也可以保证 rootDirectory 一定指向根目录
*/
const rootDirectory = fs.realpathSync(process.cwd());

// 相对路径转绝对路径方法
const resolveApp = relativePath => path.resolve(rootDirectory, relativePath);

const moduleFileExtensions = [
    'js',
    'ts'
];

// 获取模块文件路径，会匹配是否有 ${filePath}.${extension} 这样的文件，如 index.js，
// 找到则返回， 没找到就抛出异常
/*
    Tip:
    模块文件可能为js/ts/jsx/tsx等，如果由js变为了ts，则需要修改webpack配置文件
    通过动态查找的形式，能避免重复修改配置文件
*/
const resolveModule = (filePath) => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveApp(`${filePath}.${extension}`))
    );

    if (extension) {
        return resolveApp(`${filePath}.${extension}`);
    } else {
        throw new Error(`-----------\n没能找到 ${filePath}\n--------`);
    }
}

// 获取公共路径配置，开发模式没必要需配置公共路径，走本地和代理就可以
const getPublicPath = () => {
    let envPublicUrl = process.env.PUBLIC_URL;

    if (envPublicUrl) {
        let publicUrl = envPublicUrl.endsWith('/') ? envPublicUrl : envPublicUrl + '/';

        return process.env.NODE_ENV === 'development'
            ? '/'
            : publicUrl;
    }
    return '/';
}

module.exports = {
    moduleFileExtensions,
    appRoot: resolveApp('.'),
    appSrc: resolveApp('src'),
    appSrcIndex: resolveModule('src/index'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appBuild: resolveApp('build'),
    appDll: resolveApp('dll'),
    appPackageJson: resolveApp('package.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    appTsConfig: resolveApp('tsconfig.json'),
    publicPath: getPublicPath()
};
