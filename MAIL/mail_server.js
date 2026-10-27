// server.js
require('dotenv').config();
const http = require('http');
const nodemailer = require('nodemailer');
const path = require('path');

const PORT = process.env.PORT || 3003;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Node.js Automated Mailer</title></head>
      <body>
        <h2>Send Automated Email</h2>
        <form method="POST" action="/send">
          <input type="email" name="to" placeholder="Recipient Email Address" required />
          <button type="submit">Send Test Mail</button>
        </form>
      </body>
      </html>
    `);
  } else if (req.url === '/send' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => { 
      body += chunk; 
    });
    
    req.on('end', () => {
      // Decode URL-encoded POST body parameter
      const recipient = decodeURIComponent(body.split('=')[1]);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Automated Email via HTTP Server',
        text: 'This email was triggered from a Node.js HTTP web interface.',
        html: '<h2>Notification</h2><p>This mail was sent automatically via a Node.js server.</p>',
        attachments: [
          { filename: 'report.pdf', path: path.join(__dirname, 'report.pdf') }
        ]
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Failed to send email:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Failed to send email.');
        } else {
          console.log('Email dispatched:', info.response);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`Email sent successfully to ${recipient}`);
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Mail server running on http://localhost:${PORT}`);
});