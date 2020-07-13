import _ from 'lodash';
// 入口文件
document.body.innerHTML = '打包成功!！'

const a = 1
// a = 2;

let c = {};

console.log(_.isEmpty(c))

// new Promise((resolve, reject) => {
//     resolve('a');
// }).then((res) => {
//     console.log(res);
//     return new Promise((resolve, reject) => {
//         reject('b');
//     })
// }).then((a) => {
//     console.log('ok');
// }, (err) => {
//     console.log('inerr');
//     console.log(err);
// });