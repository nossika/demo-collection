const { default: babelTraverse } = require('@babel/traverse');
const f = require('../utils/file');

module.exports = {
  exec: (file, key, output) => {
    const ast = f.file2AST(file);

    babelTraverse(ast, {
      ObjectProperty(path) {
        const node = path.node;
        const keyName = node.key.name;
        if (key === keyName) {
          path.remove();
        }
      },
    });

    f.ast2File(ast, output);
  },
};