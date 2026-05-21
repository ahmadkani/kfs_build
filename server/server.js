const express = require('express');
const app = express();
const PORT = 8888;

// 1. Log raw bodies (the packfiles)
app.use(express.raw({ type: '*/*', limit: '50mb' }));

// Helper for Git protocol formatting
const pktLine = (str) => {
  const len = str.length + 4;
  return len.toString(16).padStart(4, '0') + str;
};

// 2. The Discovery Endpoint
app.get('/info/refs', (req, res) => {
  const service = req.query.service;
  
  // LOG EVERYTHING
  console.log('\n========================================');
  console.log(`[DISCOVERY] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Send minimal Smart HTTP response
  res.setHeader('Content-Type', `application/x-${service}-advertisement`);
  
  let body = pktLine(`# service=${service}\n`) + '0000';
  
  // Add a fake 'main' branch so the client thinks the repo exists
  if (service === 'git-upload-pack') {
    body += pktLine('0000000000000000000000000000000000000000 refs/heads/main\0multi_ack\n');
  } else {
    body += pktLine('0000000000000000000000000000000000000000 refs/heads/main\0report-status\n');
  }
  
  body += '0000';
  res.send(body);
});

// 3. The Fetch Endpoint (Clone/Pull)
app.post('/git-upload-pack', (req, res) => {
  console.log('\n========================================');
  console.log('[FETCH] Client is sending "wants" and "haves"');
  console.log('Body Size:', req.body.length, 'bytes');
  // console.log('Body (hex):', req.body.toString('hex')); // Uncomment to see raw data
  
  // Respond with NAK (I have nothing for you)
  res.setHeader('Content-Type', 'application/x-git-upload-pack-result');
  res.send(pktLine('NAK\n'));
});

// 4. The Push Endpoint
app.post('/git-receive-pack', (req, res) => {
  console.log('\n========================================');
  console.log('[PUSH] Client is sending a packfile!');
  console.log('Body Size:', req.body.length, 'bytes');
  
  // Respond with "ok"
  res.setHeader('Content-Type', 'application/x-git-receive-pack-result');
  res.send(pktLine('unpack ok\n') + '0000');
});

app.listen(PORT, () => {
  console.log(`Raw Log Server running on http://localhost:${PORT}`);
});