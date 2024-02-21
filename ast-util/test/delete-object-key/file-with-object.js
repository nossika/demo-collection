const a = {
  aa: {}, // 会被删除
  a2: 2,
  a3: 'cc',
};
const aa = 'aaa';
const b = {
  b1: null,
  b2: undefined,
  b3: {
    aa: 1, // 会被删除
    [aa]: 1, // 会被忽略，引用类型
    ['a' + '' + 'a']: 1, // 会被忽略，表达式类型
    bb: 2,
  },
  // @ignore
  aa: 1, // 会被忽略，有标记
};

module.exports = {
  a,
  b,
  aa, // 会被删除
};