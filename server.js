const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial seed data if not present
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    goal: {
      targetUsd: 5000,
      targetInr: 420000,
      startDate: "2026-11-16",
      endDate: "2027-01-15",
      collectedInr: 112000
    },
    projects: [
      {
        id: "proj-1",
        name: "Trovenza Travels Portal",
        client: "Trovenza Travels Pvt Ltd",
        category: "Travel & Cabs",
        dealValue: 28000,
        collected: 7000,
        pending: 21000,
        status: "in-progress",
        priority: "high",
        nextAction: "Deploy Taxi Fare Calculator, Urbania Fleet showcase & Mobile CRO Bar",
        deadline: "2026-11-22"
      },
      {
        id: "proj-2",
        name: "Rajaji National Park Safari",
        client: "Talib Bhai (Safari Team)",
        category: "Tourism & Safari",
        dealValue: 30000,
        collected: 0,
        pending: 30000,
        status: "planning",
        priority: "high",
        nextAction: "Build Google Ads policy-safe landing page with disclaimer and WhatsApp zone bookings",
        deadline: "2026-11-25"
      },
      {
        id: "proj-3",
        name: "Rajnandini Boutique POS",
        client: "Indu Ji & Rajnandini Studio",
        category: "Retail & Apparel",
        dealValue: 25000,
        collected: 25000,
        pending: 0,
        status: "delivered",
        priority: "medium",
        nextAction: "Assist with physical stock count reconciliation using master Excel",
        deadline: "2026-11-20"
      },
      {
        id: "proj-4",
        name: "Hotel Aadvik Inn Check-In App",
        client: "Amit Sir (Hotel Aadvik)",
        category: "Hospitality",
        dealValue: 25000,
        collected: 10000,
        pending: 15000,
        status: "in-progress",
        priority: "high",
        nextAction: "Finalize contactless guest check-in QR flow and guest WhatsApp review prompt",
        deadline: "2026-11-28"
      },
      {
        id: "proj-5",
        name: "Urbanage Atelier Portfolio Portal",
        client: "Urbanage Atelier LLP (Haridwar)",
        category: "Architecture & Design",
        dealValue: 35000,
        collected: 0,
        pending: 35000,
        status: "pipeline",
        priority: "medium",
        nextAction: "Send customized WhatsApp audit pitch and high-end portfolio mockup",
        deadline: "2026-12-05"
      }
    ],
    payments: [
      { id: "pay-1", project: "Rajnandini Boutique POS", amount: 25000, mode: "UPI", date: "2026-10-15", status: "Verified" },
      { id: "pay-2", project: "Trovenza Travels (Phase 1 Advance)", amount: 7000, mode: "Bank Transfer", date: "2026-10-18", status: "Verified" },
      { id: "pay-3", project: "Hotel Aadvik Inn (Advance)", amount: 10000, mode: "UPI", date: "2026-10-25", status: "Verified" },
      { id: "pay-4", project: "Hotel Satyam Swagat", amount: 25000, mode: "Cash & UPI", date: "2026-09-20", status: "Verified" }
    ],
    leads: [
      {
        id: "lead-1",
        name: "Urbanage Atelier LLP",
        category: "Interior & Architecture",
        phone: "9810832451",
        city: "Haridwar",
        address: "First Floor, Agarwal agnecy, Uncha pul, Arya Nagar, Jwalapur",
        status: "hot",
        source: "Excel Database",
        pitchAngle: "High-end 3D portfolio showcase + Local HNI lead capture funnel"
      },
      {
        id: "lead-2",
        name: "Arcraft Designers",
        category: "Architecture",
        phone: "9897123456",
        city: "Dehradun",
        address: "Rajpur Road, Dehradun",
        status: "warm",
        source: "Outreach Samples",
        pitchAngle: "Interactive luxury project walkthroughs + Google Business SEO"
      },
      {
        id: "lead-3",
        name: "OTB Architects",
        category: "Architectural Studio",
        phone: "9756000000",
        city: "Haridwar / Rishikesh",
        address: "Shivalik Nagar, Haridwar",
        status: "new",
        source: "Directory",
        pitchAngle: "Minimalist mobile-first studio portfolio"
      },
      {
        id: "lead-4",
        name: "Resort Near Rajaji / Chilla",
        category: "Resort & Safari Stay",
        phone: "9837000000",
        city: "Rishikesh / Chilla",
        address: "Chilla Range, Rajaji National Park",
        status: "hot",
        source: "Safari Synergy",
        pitchAngle: "Direct safari package + resort room booking engine with zero OTA commissions"
      }
    ],
    coFounderNotes: [
      { id: "note-1", author: "Antigravity", text: "Trovenza Travels Phase 2 is the fastest route to cashflow (₹21k locked). Delivery within 48h.", date: "2026-11-17" },
      { id: "note-2", author: "Sourabh", text: "Rajnandini bug is fixed and live. Need to help them with remaining physical count.", date: "2026-11-17" },
      { id: "note-3", author: "Antigravity", text: "For Talib Bhai safari site: add disclaimer on top and bottom to make Google Ads 100% compliant.", date: "2026-11-17" }
    ]
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, fallback) => {
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

// Get local network IP for mobile access
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
