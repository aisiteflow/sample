const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces or characters
  const decodedUrl = decodeURIComponent(req.url);
  const fileRoute = decodedUrl === '/' ? 'index.html' : decodedUrl;
  const filePath = path.join(__dirname, fileRoute);
  const ext = path.extname(filePath).toLowerCase();
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
});

const PORT = 8000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Aura Shops Dev Server running at http://127.0.0.1:${PORT}/`);
});
