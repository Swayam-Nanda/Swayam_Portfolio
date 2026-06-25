import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import server from './dist/server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080;
const clientDir = path.join(__dirname, 'dist', 'client');

// Mime types helper for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function serveStatic(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = await fs.readFile(filePath);
      return { contentType, content };
    }
  } catch {
    // File not found, return null
  }
  return null;
}

createServer(async (req, res) => {
  const decodedPath = decodeURIComponent(req.url.split('?')[0]);
  
  // 1. Try to serve static file from dist/client
  let staticPath = path.join(clientDir, decodedPath);
  
  // If it's a folder, try serving index.html
  try {
    const stats = await fs.stat(staticPath);
    if (stats.isDirectory()) {
      staticPath = path.join(staticPath, 'index.html');
    }
  } catch {}

  // Prevent directory traversal
  if (staticPath.startsWith(clientDir)) {
    const staticFile = await serveStatic(staticPath);
    if (staticFile) {
      res.writeHead(200, {
        'Content-Type': staticFile.contentType,
        'Cache-Control': decodedPath.startsWith('/assets/') 
          ? 'public, max-age=31536000, immutable' 
          : 'public, max-age=3600',
      });
      res.end(staticFile.content);
      return;
    }
  }

  // 2. Fallback to WinterCG Fetch Handler (SSR)
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url}`;

  // Read request body for POST/PUT requests
  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    body = Buffer.concat(buffers);
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  const request = new Request(url, {
    method: req.method,
    headers,
    body,
    duplex: body ? 'half' : undefined
  });

  try {
    const response = await server.fetch(request, {}, {});

    res.statusCode = response.status;
    res.statusMessage = response.statusText;

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        const cookies = response.headers.getSetCookie 
          ? response.headers.getSetCookie() 
          : [value];
        res.setHeader('set-cookie', cookies);
      } else {
        res.setHeader(key, value);
      }
    });

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error('Error handling SSR request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}).listen(port, () => {
  console.log(`Production SSR server listening on port ${port}`);
});
