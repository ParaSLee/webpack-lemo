'use strict';
const path = require('./path');
// 打包完成后，动态生成html文件，会自动引入打包生成的各项文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次打包的时候清理一次build文件夹下的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const isProdution = process.env.NODE_ENV = 'production';
const isDevelopment = process.env.NODE_ENV = 'development';

module.exports = {
    mode: isProdution ? 'production' : 'development',
    entry: {
        main: path.appSrcIndex
    },
    output: {
        path: isProdution ? path.appBuild : undefined,
        filename: '[name].[contenthash:8].js'
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign({}, {
                // 模板文件为 public/index.html
                template: path.appHtml
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
            }: undefined)
        ),
        new CleanWebpackPlugin()
    ]
}
