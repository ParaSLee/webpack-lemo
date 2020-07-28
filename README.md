# webpack-lemo
自己研究的webpack配置，在较多场景中可以使用


## 涵盖功能

✅ 完成 ⭕ 完成部分 ⬜ 待完成 ❌ 无法执行

|- ⭕ 环境配置<br>
|--- ✅ 区分 dev 和 build 环境<br>
|--- ✅ 增加 build:debug 环境，不压缩代码，输出打包结果<br>
|--- ✅ 增加 build:dll 环境，打包第三方模块<br>
|<br>
│- ⭕ 用 node 启动 webpack打包<br>
|--- ⭕️ 打包结果提示<br>
|----- ✅ 中文化打包提示<br>
|----- ⬜ 增加与上一次打包结果的大小对比<br>
|----- ✅ 输出打包时间<br>
|<br>
│- ⭕️ 用 node 启动 webpack-dev-server 服务<br>
|--- ✅ 完成 webpack-dev-server 配置<br>
|--- ⭕️ 服务提示<br>
|----- ✅ 中文化提示<br>
|----- ⬜ rebuild 提示<br>
|----- ⬜ error 提示和处理<br>
|----- ⬜ todo: 将一些react的工具简单化、个人化，保留需要的部分<br>
|<br>
|- ⭕ 完成 webpack 配置<br>
|--- ✅ 处理素材文件, ex. 图片、字体<br>
|--- ✅ 处理css\less<br>
|--- ✅ 处理js<br>
|--- ⬜ 处理ts<br>
|--- ⬜ eslint<br>
|--- ✅ 打包性能优化<br>
|----- ✅ js压缩<br>
|----- ✅ css压缩<br>
|----- ✅ tree-shaking<br>
|----- ✅ 代码分割<br>
|----- ✅ 分离mainfest<br>
|----- ✅ 多线程<br>
|<br>
|- ⭕ 其他<br>
|--- ⭕ 增加打包分析<br>
|----- ✅ 打包速度分析：speed-measure-webpack-plugin <br>
|----- ⬜ 打包体积分析 <br>
|--- ✅ 增加dllplugin配置<br>
|--- ⬜ 自定义loader：处理模块文件名<br>




