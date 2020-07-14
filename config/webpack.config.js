'use strict';
const path = require('path');
const paths = require('./paths');
// 打包完成后，动态生成html文件，会自动引入打包生成的各项文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次打包的时候清理一次build文件夹下的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProdution = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    mode: isProdution
        ? 'production'
        : isDevelopment && 'development',
    // 打包时如果出错则中断
    bail: isProdution,
    devtool: isProdution
        ? 'hidden-source-map'
        : isDevelopment && 'cheap-module-source-map',
    entry: {
        main: paths.appSrcIndex
    },
    output: {
        path: isProdution ? paths.appBuild : undefined,
        filename: isProdution
            ? 'static/js/[name].[contenthash:8].js'
            : isDevelopment && 'static/js/[name].js',
        // 未在entry中配置的内容，文件名会走chunkFilename，如使用[代码分割/动态引入]
        chunkFilename: isProdution
            ? 'static/js/[name].[contenthash:8].chunk.js'
            : isDevelopment && 'static/js/[name].chunk.js',
        sourceMapFilename: isProdution
            ? 'static/js/[name].[contenthash:8].js.map'
            : isDevelopment && 'static/js/[file].map',
        publicPath: paths.publicPath,
        // 处理异步加载的模块的crossorigin值，anonymous在出现跨域加载脚本时，不带上用户信息
        crossOriginLoading: 'anonymous',
        // 当开启sourcemap后，为了能在sources里找到相应的文件以及位置
        devtoolModuleFilenameTemplate: isProdution
            ? info =>
                path
                .relative(paths.appSrc, info.absoluteResourcePath)
                .replace(/\\/g, '/')
            : isDevelopment &&
                (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    resolve: {
        // 告诉 webpack 解析模块时应该搜索的目录。默认值就是['node_modules']
        // 写出来方便之后扩展
        modules: ['node_modules'],
        // 在引入模块时如果没添加后缀，默认查找extensions中的后缀，如：import App from '../app' => import App from '../app.js(.ts)'
        extensions: paths.moduleFileExtensions
            .map(ext => `.${ext}`)
            // 如果没有用ts，就在进行后缀查找时，删除对.ts的查询
            .filter(ext => paths.appTsConfig || !ext.includes('ts')),
        alias: {
            // 默认添加 @ 指向 src目录
            '@': path.resolve(paths.appSrc)
        }
    },
    module: {
        // 告诉webpack不必解析的内容，对于非模块化的库文件没必要进行解析，默认把jquery加上
        noParse: /jquery/,
        rules: [
            // isDevelopment ? {
            //     test: /\.(js|mjs|jsx|ts|tsx)$/,
            //     enforce: 'pre',
            //     use: [{
            //         loader: 'eslint-loader'
            //     }]
            // } : {},
            {
                oneOf: [
                    {
                        test: /\.(bmp|jpe?g|gif|png|woff2?|eot|ttf|svg)/,
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 1000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        }
                    },

                    // 其他没有被匹配到的文件做兜底处理
                    {
                        loader: require.resolve('file-loader'),
                        exclude: /\.(js|ts|html|json)$/,
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign({}, {
                // 模板文件为 public/index.html
                template: paths.appHtml
            }, isProdution ? {
                // 当为开发模式时，启动html-minifier-terser压缩进行压缩，配置详细查看
                // https://github.com/DanielRuf/html-minifier-terser
                minify: {
                    collapseWhitespace: true, // 删除空格
                    removeComments: true, // 删除注释
                    removeRedundantAttributes: true, // 删除冗余attribute，如 input的type默认为text，因此type='text'的内容会被删除
                    removeEmptyAttributes: true, // 删除值为空的attribute
                    removeScriptTypeAttributes: true, // 移除script标签的 type="text/javascript" 属性
                    removeStyleLinkTypeAttributes: true, // 移除link标签的 type="text/css" 属性
                    useShortDoctype: true, // 强制使用<!DOCTYPE html>
                    keepClosingSlash: true, // 能自闭合的标签 自闭合处理
                    minifyCSS: true, // 使用 clean-css 压缩<style>中的css代码
                    minifyJS: true, // 使用 terser 压缩<script>中的js代码
                    minifyURLs: true // 使用 relateurl 压缩url信息
                }
            } : undefined)
        ),
        new CleanWebpackPlugin()
    ],
    // 性能提示，当bundle过大时给出信息
    // todo：可以仿照react做自己的提示，ex. FileSizeReporter
    performance: {
        // 当生成的bundle过大时，作出警告提示
        hints: 'warning',
        // 入口文件最大 250000字节
        maxEntrypointSize: 250000,
        // 资源文件（非入口文件）最大 250000字节
        maxAssetSize: 250000,
    }
}
