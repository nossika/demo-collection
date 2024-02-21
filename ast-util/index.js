const { program } = require('commander');
const deleteObjectKey = require('./scripts/delete-object-key');
const overrideValue = require('./scripts/override-value');
const path = require('path');

program
  .name('ast-util')
  .description('convert js files by AST');

program
  .command('delete-object-key')
  .description('delete key from object')
  .argument('<file>', 'target file')
  .argument('<key>', 'object key to delete')
  .option('-o, --output <output>', 'output dir', '.')
  .action((file, key, opts) => {
    const filename = path.basename(file);
    const output = path.join(opts.output, filename);
    deleteObjectKey.exec({ file, key, output });
  });

program
  .command('override-value')
  .description('override target with value')
  .argument('<file>', 'target file')
  .argument('<target>', 'target name')
  .argument('<value>', 'override value')
  .option('-o, --output <output>', 'output dir', '.')
  .action((file, target, value, opts) => {
    const filename = path.basename(file);
    const output = path.join(opts.output, filename);
    overrideValue.exec({ file, target, value, output });
  });

program.parse();
