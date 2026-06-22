const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf-8');

// The string replace injected literal `\n` because in JS `\\n` is literal.
content = content.replace(/\\n/g, '\n');

fs.writeFileSync('app.js', content, 'utf-8');
console.log('Fixed \\n');
