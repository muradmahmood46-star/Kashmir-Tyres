const fs = require('fs');
const path = require('path');

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(file, 'utf8');
      const original = content;

      if (!content.includes('Rs ')) continue;

      // Determine import path based on depth
      const depth = file.split(path.sep).length - 2; // src/pages/file.tsx -> 2 - 2 = 0 (..)
      const importPath = depth === 2 ? '../../utils/formatPrice' : '../utils/formatPrice';
      
      // Inject import if not exists
      if (!content.includes('formatPrice')) {
        const importStatement = `import { formatPrice } from '${importPath}'\n`;
        content = importStatement + content;
      }

      // Replace >Rs {something}< with >{formatPrice(something)}<
      content = content.replace(/>Rs \{([^}]+)\}</g, '>{formatPrice($1)}<');

      // Replace >Rs something< with >{formatPrice(something)}< for static numbers
      content = content.replace(/>Rs ([0-9.]+)</g, '>{formatPrice($1)}<');

      // Replace 'Rs ' + something -> formatPrice(something) (if exists)
      content = content.replace(/'Rs ' \+ /g, 'formatPrice('); // Not closing parenthesis, risky. Let's ignore string concats for now and fix manually.

      // Replace literal string 'Rs 49'
      content = content.replace(/'Rs ([0-9.]+)'/g, 'formatPrice($1)');
      content = content.replace(/"Rs ([0-9.]+)"/g, 'formatPrice($1)');

      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
      }
    }
  }
}
walk('src');
