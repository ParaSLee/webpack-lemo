const paths = require('./paths');
const chalk = require('chalk');
const host = process.env.HOST || '0.0.0.0';

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
    quiet: true,
    // 关闭对https提供的服务，在本地开发时几乎没有https的要求，因此显式采用fasle
    https: false,
    // 启动服务的Host信息
    host,
    // 当出现错误时把错误输出到浏览器上
    overlay: true,
    // 针对SPA的配置，因为单页应用的路由是前端路由，例如 www.xxx.com/pageA, /pageA 为前端路由，
    // 为了避免直接访问 www.xxx.com/pageA 时绕开了 www.xxx.com(/index.html) 
    // 结果导致访问后端路径出现404
    // 配置 historyApiFallback (Webpack-dev-server 使用了 connect-history-api-fallback) 
    // 能解决这个问题。
    // 书写本配置的本意不是为了使用vue\react，因此注释了这段配置作为保留
    // historyApiFallback: {
    //     // 忽视pathname中有.的情况，如 www.xxx.com/pageA/page.html
    //     // pathname为 /pageA/page.html，这种时候会保留访问
    //     disableDotRule: true, 
    //     // 直接访问 www.xxx.com/pageA 时，会打到 www.xxx.com/(index.html) 
    //     index: '/',
    // },
    // 代理
    proxy: !process.env.PROXY_URL ? undefined : [{
        // 代理地址
        target: process.env.PROXY_URL,
        logLevel: 'silent',
        context: function (pathname, req) {
            const sockPath = process.env.WDS_SOCKET_PATH || '/sockjs-node';
            const isDefaultSockHost = !process.env.WDS_SOCKET_HOST;
            function mayProxy(pathname) {
                // 判断是否是请求public目录下的内容
                const maybePublicPath = path.resolve(paths.appPublic, pathname);
                const isPublicFileRequest = fs.existsSync(maybePublicPath);
                // 判断是否是websocket的请求
                const isWdsEndpointRequest = isDefaultSockHost && pathname.startsWith(sockPath);
                return !(isPublicFileRequest || isWdsEndpointRequest);
            }

            return (
                req.method !== 'GET' ||
                (mayProxy(pathname) &&
                req.headers.accept &&
                req.headers.accept.indexOf('text/html') === -1)
            );
        },
        // 订阅 http-proxy 的代理请求事件
        onProxyReq: function onProxyReq(proxyReq, req, res) {
            if (proxyReq.getHeader('origin')) {
                proxyReq.setHeader('origin', target);
              }
        },
        // 订阅 http-proxy 的错误事件
        onError: function onProxyError(err, req, res) {
            const host = req.headers && req.headers.host;
            console.log(
                chalk.red('代理错误: ') +
                ' 代理请求 ' + chalk.cyan(req.url) +
                ' 无法从 ' + chalk.cyan(host) +
                ' 代理到 ' + chalk.cyan(proxy)
            );
            console.log();
            
            if (res.writeHead && !res.headersSent) {
              res.writeHead(500);
            }
            res.end(
                '代理错误: 代理请求 ' + req.url +
                ' 无法从 ' + host +
                ' 代理到 ' + proxy +
                ' (' + err.code + ')'
            );
        },
        // 关闭https校验
        secure: false,
        // 代理时改变请求源
        changeOrigin: true,
        // 开启websockets代理
        ws: true,
        // 增加X-Forwarded-For请求头
        xfwd: true,
    }],
}