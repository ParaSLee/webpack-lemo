// 基本复用了 react-dev-tool/FileSizeReporter 的功能

'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var filesize = require('filesize');
var recursive = require('recursive-readdir');
var stripAnsi = require('strip-ansi');
var gzipSize = require('gzip-size').sync;

// 只获取js和css文件
function canReadAsset(asset) {
    return (
        /\.(js|css)$/.test(asset) &&
        !/service-worker\.js/.test(asset) &&
        !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
    );
}

// 打印构建后的文件大小与差异
function printFileSizesAfterBuild(
    webpackStats,
    previousSizeMap,
    buildFolder,
    maxBundleGzipSize,
    maxChunkGzipSize
) {
    var root = previousSizeMap.root;
    var sizes = previousSizeMap.sizes;
    var assets = (webpackStats.stats || [webpackStats])
        .map(stats =>
            stats
                .toJson({ all: false, assets: true }) // 获取stats.assets
                .assets.filter(asset => canReadAsset(asset.name)) // 挑选出.js和.css文件
                .map(asset => { // 计算gzip处理后的文件大小，保存需要的文件信息
                    var fileContents = fs.readFileSync(path.join(root, asset.name));
                    var size = gzipSize(fileContents);
                    var previousSize = sizes[removeFileNameHash(root, asset.name)];
                    var difference = getDifferenceLabel(size, previousSize);
                    return {
                        folder: path.join(
                            path.basename(buildFolder),
                            path.dirname(asset.name)
                        ),
                        name: path.basename(asset.name),
                        size: size,
                        localSize: filesize(asset.size),
                        sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : ''),
                    };
                })
        )
        .reduce((single, all) => all.concat(single), []);
    
    // assets排序
    assets.sort((a, b) => b.size - a.size);

    var longestSizeLabelLength = Math.max.apply(
        null,
        assets.map(a => stripAnsi(a.sizeLabel).length)
    );
    var suggestBundleSplitting = false;

    // 输出table
    console.log('本地文件大小 | gzip压缩后 | 路径\n');
    // 循环输出文件大小信息
    assets.forEach(asset => {
        var sizeLabel = asset.sizeLabel;
        var sizeLength = stripAnsi(sizeLabel).length;
        if (sizeLength < longestSizeLabelLength) {
            var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
            sizeLabel += rightPadding;
        }

        var isMainBundle = asset.name.indexOf('main.') === 0;
        var maxRecommendedSize = isMainBundle ? maxBundleGzipSize : maxChunkGzipSize;

        var isLarge = maxRecommendedSize && asset.size > maxRecommendedSize;
        if (isLarge && path.extname(asset.name) === '.js') {
            suggestBundleSplitting = true;
        }

        // 输出文件信息
        console.log(
            '   ' + chalk.bgWhite(chalk.black(asset.localSize)) + '   |' +
            '   ' + (isLarge ? chalk.yellow(sizeLabel) : sizeLabel) + '   |' +
            '   ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
        );
    });

    if (suggestBundleSplitting) {
        console.log();
        console.log(chalk.yellow('包文件过大，建议通过包分析优化代码或使用 code splitting 进行包拆分'));
        console.log();
    }
}

function removeFileNameHash(buildFolder, fileName) {
    return fileName
        .replace(buildFolder, '')
        .replace(/\\/g, '/')
        .replace(
            /\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/,
            (match, p1, p2, p3, p4) => p1 + p4
        );
}

// 输入示例: 1024, 2048
// 输出示例: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
    var FIFTY_KILOBYTES = 1024 * 50;
    var difference = currentSize - previousSize;
    var fileSize = !Number.isNaN(difference) ? filesize(difference) : 0;
    if (difference >= FIFTY_KILOBYTES) {
        return chalk.red('+' + fileSize);
    } else if (difference < FIFTY_KILOBYTES && difference > 0) {
        return chalk.yellow('+' + fileSize);
    } else if (difference < 0) {
        return chalk.green(fileSize);
    } else {
        return '';
    }
}

function measureFileSizesBeforeBuild(buildFolder) {
    return new Promise(resolve => {
        recursive(buildFolder, (err, fileNames) => {
            var sizes;
            if (!err && fileNames) {
                sizes = fileNames.filter(canReadAsset).reduce((memo, fileName) => {
                    var contents = fs.readFileSync(fileName);
                    var key = removeFileNameHash(buildFolder, fileName);
                    memo[key] = gzipSize(contents);
                    return memo;
                }, {});
            }
            resolve({
                root: buildFolder,
                sizes: sizes || {},
            });
        });
    });
}

module.exports = {
  measureFileSizesBeforeBuild: measureFileSizesBeforeBuild,
  printFileSizesAfterBuild: printFileSizesAfterBuild,
};