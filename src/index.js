import index2 from './index2';

console.log('index2: ' + index2);

const fn = () => {}
new Promise(() => {
    console.log('a')
})

class Test {
    constructor(name) {
        this.name = name
    };
}

let ab = new Test('ab');
console.log(ab);