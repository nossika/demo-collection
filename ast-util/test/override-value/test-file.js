const a = {
  k1: 1,
  k2: 2,
};

/** 对象替换: process.env.a ---> 'aaa' */
a.k1 = process.env.a; // ---> a.k1 = "aaa"
a.k1 = process.env.b; // 会被忽略，不匹配
a.k1 = process.env['a' + '']; // 会被忽略，表达式类型
a.k1 = 'process.env.a'; // 会被忽略，非对象类型

/** 变量替换: AAA ---> 'aaa' */
a.k2 = AAA; // ---> a.k2 = "aaa"
a[AAA] = 3; // ---> a["aaa"] = 3
a.k2 = a[AAA]?.a; // ---> a.k2 = a["aaa"]?.a
a.k2 = a.AAA?.a; // 会被忽略，AAA 在此处并非变量

module.exports = a;