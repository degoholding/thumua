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

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_FILE_PATH = path.join(PUBLIC_DIR, 'data.js');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Helper to determine content type
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

// Simple multipart/form-data parser for local single file uploads
function parseMultipart(req, callback) {
  const contentType = req.headers['content-type'] || '';
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    return callback(new Error('No boundary found in headers'));
  }
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const boundaryBuffer = Buffer.from('--' + boundary);
  
  let chunks = [];
  req.on('data', chunk => {
    chunks.push(chunk);
  });
  
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const parts = [];
    let start = 0;
    
    while (true) {
      const index = buffer.indexOf(boundaryBuffer, start);
      if (index === -1) break;
      if (start !== 0) {
        // Extract the part and strip the leading/trailing CRLF
        parts.push(buffer.subarray(start + 2, index - 2)); 
      }
      start = index + boundaryBuffer.length;
    }
    
    let fileData = null;
    let filename = '';
    
    for (const part of parts) {
      const headerEndIndex = part.indexOf('\r\n\r\n');
      if (headerEndIndex === -1) continue;
      
      const headers = part.subarray(0, headerEndIndex).toString('utf8');
      const body = part.subarray(headerEndIndex + 4); 
      
      if (headers.includes('name="upload"') || headers.includes('filename=')) {
        const filenameMatch = headers.match(/filename="([^"]+)"/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
          fileData = body;
          break;
        }
      }
    }
    
    if (fileData && filename) {
      callback(null, filename, fileData);
    } else {
      callback(new Error('No valid file found in multipart upload'));
    }
  });
}

const server = http.createServer((req, res) => {
  // Handle API route for uploading images
  if (req.method === 'POST' && req.url === '/api/upload-image') {
    parseMultipart(req, (err, filename, fileData) => {
      if (err) {
        console.error('Upload parsing error:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err.message }));
      }

      try {
        // Sanitize filename (keep extension, hash name or clean it)
        const ext = path.extname(filename);
        const nameWithoutExt = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const cleanFilename = `${nameWithoutExt}_${Date.now()}${ext}`;
        const destPath = path.join(IMAGES_DIR, cleanFilename);

        // Write the file
        fs.writeFileSync(destPath, fileData);
        console.log(`Successfully uploaded image saved to: ${destPath}`);

        // Return relative URL for HTML rendering
        const relativeUrl = `images/${cleanFilename}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          url: relativeUrl 
        }));
      } catch (writeErr) {
        console.error('File write error:', writeErr);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to write file to disk' }));
      }
    });
    return;
  }

  // Handle API route for saving content
  if (req.method === 'POST' && req.url === '/api/save') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { key, title, category, content } = payload;
        
        if (!key || !title || !category || !content) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Missing required fields' }));
        }

        // Read and parse current data.js content
        let currentDataContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        
        // Extract the JSON object from the file string: "const docData = { ... };"
        const jsonStartIndex = currentDataContent.indexOf('{');
        const jsonEndIndex = currentDataContent.lastIndexOf('}');
        
        if (jsonStartIndex === -1 || jsonEndIndex === -1) {
          throw new Error('Could not parse data.js file structure');
        }

        const jsonStr = currentDataContent.substring(jsonStartIndex, jsonEndIndex + 1);
        const docDataSandbox = {};
        const evalStr = currentDataContent.replace('const docData =', 'docDataSandbox.docData =');
        eval(evalStr); 
        
        const docData = docDataSandbox.docData;
        if (!docData) {
          throw new Error('Failed to evaluate docData');
        }

        // Update the specific section
        docData[key] = { title, category, content };

        // Write back to data.js with formatting
        const newFileContent = `const docData = ${JSON.stringify(docData, null, 2)};\n`;
        fs.writeFileSync(DATA_FILE_PATH, newFileContent, 'utf8');
        
        console.log(`Successfully updated documentation section: ${key}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Content saved successfully' }));
      } catch (err) {
        console.error('Error saving data:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to write to file: ' + err.message }));
      }
    });
    return;
  }

  // Handle Static File serving
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  // Normalize paths for comparison to prevent case issues on Windows drive letters
  const normPublicDir = PUBLIC_DIR.toLowerCase();
  const normFilePath = filePath.toLowerCase();
  
  // Prevent directory traversal attacks
  const relative = path.relative(PUBLIC_DIR, filePath);
  const normRelative = path.relative(normPublicDir, normFilePath);
  
  const isForbidden = normRelative.startsWith('..') || path.isAbsolute(relative) || path.isAbsolute(normRelative);
  
  if (isForbidden) {
    console.warn(`[43] Access Forbidden: URL="${req.url}" ResolvedPath="${filePath}" Relative="${relative}"`);
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.warn(`[44] File Not Found: URL="${req.url}" ResolvedPath="${filePath}"`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        console.error(`[50] Server Error reading file: ${err.code} URL="${req.url}"`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      console.log(`[200] Served: URL="${req.url}" Size=${content.length} bytes`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`DEGO ERP Docs Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================`);
});
