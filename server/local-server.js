const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(ROOT_DIR, 'data'))) {
  fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
}

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hostbolt-Auth');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (req.url === '/api/data' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.url === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Remote Webhook Command Execution (For 24/7 Mobile Control)
  if (req.url === '/api/command' && req.method === 'POST') {
    const authKey = req.headers['x-hostbolt-auth'];
    const validKey = process.env.HOSTBOLT_AUTH_KEY || 'hostbolt-secure-2026';
    if (authKey !== validKey) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid X-Hostbolt-Auth key' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { action, customCommand } = JSON.parse(body || '{}');
        let cmdToRun = '';

        if (action === 'system-status') {
          const uptimeHrs = (os.uptime() / 3600).toFixed(1);
          const freeMemMb = Math.round(os.freemem() / (1024 * 1024));
          const totalMemMb = Math.round(os.totalmem() / (1024 * 1024));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            output: `Hostbolt 24/7 Server Online | Uptime: ${uptimeHrs}h | Free RAM: ${freeMemMb}MB / ${totalMemMb}MB | OS: ${os.platform()} ${os.arch()}`
          }));
          return;
        } else if (action === 'trovenza-status') {
          cmdToRun = `cd "D:\\Hostbolt\\new me\\07_Trovenza_Travels_Website" && git status --short`;
        } else if (action === 'pos-git-status') {
          cmdToRun = `cd "D:\\Hostbolt\\clients\\Haridwar\\Rajnandni Boutique POS" && git status --short`;
        } else if (action === 'custom' && customCommand) {
          cmdToRun = customCommand;
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unknown action' }));
          return;
        }

        exec(cmdToRun, { timeout: 30000, shell: 'powershell.exe' }, (error, stdout, stderr) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: !error,
            output: stdout || stderr || (error ? error.message : 'Command completed with no output.')
          }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(ROOT_DIR, 'public', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(ROOT_DIR, 'public', 'index.html'), (err2, fallback) => {
          if (err2) {
            res.writeHead(404);
            res.end('File Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallback);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`🚀 Hostbolt Command Center is RUNNING!`);
  console.log(`💻 Desktop: http://localhost:${PORT}`);
  console.log(`📱 Android Mobile (Wi-Fi): http://${localIp}:${PORT}`);
  console.log(`======================================================\n`);
});
