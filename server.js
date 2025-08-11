// server.js
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Route for root
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Prepare safe configuration (DO NOT include secrets)
  const clientConfig = {
    environment: process.env.NODE_ENV || 'production',
    showAds: process.env.SHOW_ADS === 'true',
  };

  // Inject safe config into the HTML
  const injection = `<script>window.__SAFE_CONFIG__ = ${JSON.stringify(clientConfig)};</script>`;
  html = html.replace('</head>', injection + '\n</head>');

  // Example CSP header for extra security
  res.set('Content-Security-Policy', "default-src 'self' https:; script-src 'self' 'unsafe-inline';");
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
