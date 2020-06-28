const paths = require('./paths');

module.exports = {
    // 本意是为了防止远程服务通过DNS重新绑定访问本地内容
    // 在这里关闭是为了避开因hostname检查出现的【Invalid Host header】问题
    // 以及提供同局域网内支持IP访问能力
    // 默认 true
    disableHostCheck: process.env.CLOSE_DEVSERVER_HOST_CHECK === 'true',
    // 启用gzip压缩
    compress: true,
    // 关闭webpack在控制台的info输出，因为这些输出会显得冗余，且帮助不大
    // 但会保留关闭error和warning的信息输出
    clientLogLevel: 'none',
    // webpackDevServer运行后打包资源都放入了内存，只有在获取内存外的静态资源时
    // 会从contentBase路径里获取
    // 一般只用在 favicon.ico, manifest.json 这样的文件
    contentBase: paths.appPublic,
    // 如果 paths.appPublic 路径里的文件需要使用public信息,
    // 可以像这样使用，PUBLIC_URL === process.env.PUBLIC_URL
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    contentBasePublicPath: paths.publicUrl,
    // 当contentBase路径里的文件发生更改时触发一次完整的页面重载
    watchContentBase: true,
    // 热更新重载
    // 但需要注意，webpack-dev-server只支持css更新热重载，js更新会刷新浏览器
    hot: true,
    // 公共路径，开发模式默认为 '/' 
    publicPath: paths.publicUrl,
    // 服务启动后，除了启动信息，终端上不会输出其他信息，包括重构建信息、错误、警告等信息
    // 启动后需要自己捕获输出各种信息
    quiet: true
}