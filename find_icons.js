const fs = require('fs');
const path = require('path');
const dir = 'd:/01.Soft/pltgiang/thu_mua_tool/src/pages';
const files = fs.readdirSync(dir);
files.forEach(f => {
  if (f.endsWith('.jsx')) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = c.match(/import\s+{([^}]+)}\s+from\s+['"]@ant-design\/icons['"]/);
    if (m) console.log(f, ':', m[1].trim().replace(/\s+/g, ' '));
  }
});
