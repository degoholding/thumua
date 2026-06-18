const http = require('http');
const fs = require('fs');
const path = require('path');

// Native .env parser
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      // Ignore comments
      if (line.trim().startsWith('#')) return;
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        value = value.replace(/(^['"]|['"]$)/g, '').trim();
        process.env[key] = value;
      }
    });
  }
} catch (err) {
  console.warn('Could not parse .env file', err);
}

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  // Normalize paths to prevent directory traversal attacks
  const normPublicDir = PUBLIC_DIR.toLowerCase();
  const normFilePath = filePath.toLowerCase();
  
  const relative = path.relative(PUBLIC_DIR, filePath);
  const normRelative = path.relative(normPublicDir, normFilePath);
  
  const isForbidden = normRelative.startsWith('..') || path.isAbsolute(relative) || path.isAbsolute(normRelative);
  
  if (isForbidden) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`DEGO Thu Mua Tool Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================`);
});
