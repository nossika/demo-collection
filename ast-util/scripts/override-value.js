const { default: babelTraverse } = require('@babel/traverse');
const babelTypes = require('@babel/types');
const fileUtil = require('../utils/file');

module.exports = {
  exec: ({ file, target, value, output }) => {
    const ast = fileUtil.file2AST(file);

    // 目标名
    let name = target;
    // 目标 object 前缀（如有）
    let objectName = '';

    if (target.includes('.')) {
      objectName = target.slice(0, target.lastIndexOf('.'));
      name = target.slice(target.lastIndexOf('.') + 1, target.length);
    }

    const isObject = !!objectName;

    babelTraverse(ast, {
      Identifier(path) {
        if (isObject) return;

        const node = path.node;

        if (node.name === name) {
          // 如果是 object.name.xxx 形式，无法直接替换 name，库会报错并退出，忽略此种报错并继续即可，此时并不会真正换上错误值
          // @todo 精确识别上述场景并跳过，从根源避免报错
          try {
            path.replaceWith(babelTypes.valueToNode(value));
          } catch {}
        }
      },

      MemberExpression(path) {
        if (!isObject) return;

        // 忽略 object 前缀不匹配的
        if (!path.get('object').matchesPattern(objectName)) return;
        
        const key = path.toComputedKey();

        // 仅判断字面量类型的 key 是否匹配，其他类型（表达式、引用等）忽略
        if (babelTypes.isStringLiteral(key) && key.value === name) {
          path.replaceWith(babelTypes.valueToNode(value));
        }
      },
    });

    fileUtil.ast2File(ast, output);
  },
};