import _ from 'lodash';
import imgsrc from './1.jpeg';
import './index.less'

// 入口文件
document.body.innerHTML = '打包成功!！'

const a = 1
// a = 2;

let c = {};

console.log(_.isEmpty(c))


let img = new Image();
img.src = imgsrc;
console.log(img);
document.body.appendChild(img);

