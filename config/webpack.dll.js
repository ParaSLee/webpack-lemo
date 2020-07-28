const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const venders = [
    'lodash'
]

module.exports = {
    mode: 'production',
    entry: {
        venders
    },
    output: {
        path: paths.appDll,
        filename: '[name].[chunkhash:7].dll.js',
        // 将第三方模块打包成一个库，通过全局变量的形式使用
        library: '[name]_[chunkhash]_libraray'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,
                cache: true,
                sourceMap: true,
            })
        ],
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            name: '[name]_[chunkhash]_libraray',
            path: path.resolve(paths.appDll, '[name].manifest.json')
        })
    ]
}