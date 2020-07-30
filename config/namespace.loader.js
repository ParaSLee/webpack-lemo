/**
 * @file 以文件路径自动命名的loader
 * @description
 * 在写react的时候用上的，读取react的jsx/tsx/less文件
 * 如果有_namespace，则自动把_namespace替换成路径
 * ex.
 * // src/pages/demo/index,jsx
 * <div className="_namespace"> ... </dic>
 * 替换后：
 * <div className="pages_demo"> ... </dic>
 */

var paths = require('./paths');

module.exports = function(content) {
    if (/_namespace/i.test(content)) {
        var resourcePath = this.resourcePath;
        var context = this.context;

        var fileRelativePath = context.replace(paths.appSrc, '');
        var classNameArr = fileRelativePath.split('/');
        classNameArr.shift();

        var className = classNameArr.join('_');

        if (
            (/\.jsx|\.tsx/.test(resourcePath)) ||
            (/\.less/.test(resourcePath) && !/node_modules|statics\/css/i.test(resourcePath))
        ) {
            content = content.replace(/_namespace/ig, className);
        }
    }
    return content
}