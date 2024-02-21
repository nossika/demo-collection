const { default: babelTraverse } = require('@babel/traverse');
const fileUtil = require('../utils/file');

module.exports = {
  exec: (file, key, output) => {
    const ast = fileUtil.file2AST(file);

    babelTraverse(ast, {
      ObjectProperty(path) {
        const node = path.node;
        // 只判断字面量类型的 key，忽略其他类型（引用、表达式等）
        if (node.key.type !== 'Identifier' || node.computed) return;
        // 忽略开头有 @ignore 注释的
        if (node.leadingComments?.some(c => c.value.trim().startsWith('@ignore'))) return;

        if (key === node.key.name) {
          path.remove();
        }
      },
    });

    fileUtil.ast2File(ast, output);
  },
};