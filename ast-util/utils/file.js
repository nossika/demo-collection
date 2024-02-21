const fs = require('fs');
const path = require('path');
const babelParse = require('@babel/parser');
const babelGenerator = require('@babel/generator');

module.exports = {
  file2AST: (file) => {
    const code = fs.readFileSync(file, 'utf8');
    const ast = babelParse.parse(code, {
      plugins: ['typescript'],
    });
    return ast;
  },
  ast2File: (ast, file) => {
    const { code } = babelGenerator.default(ast, {
      retainLines: true,
    });
    const dirname = path.dirname(file);
    fs.mkdirSync(dirname, { recursive: true });
    fs.writeFileSync(file, code);
  },
}