// 假设打包系统已经将各模块整理成如dep的结构

const dep = {
    'entry': function (require, module) { // 入口文件
        const a = require('./a');
        const b = require('./b');
        module.exports = {
            a,
            b,
        };
    },
    './a': function (require, module) { // 函数内为模块A的文本内容
        const b = require('./b');
        module.exports = b + 1;
    },
    './b': function (require, module) { // 函数内为模块B的文本内容
        module.exports = 1;
    }
};

function run () {
    const cache = {};
    function require (name) {
        if (cache[name]) return cache[name]; // 命中缓存直接返回，保证模块单例
        let module = {};
        cache[name] = {}; // 被require时先定义一个空缓存，避免有循环加载时陷入死循环
        dep[name](require, module);
        cache[name] = module.exports;
        return module.exports;
    }
    let output = {};
    dep.entry(require, output);
    console.log(output);
}

run();