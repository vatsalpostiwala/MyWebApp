// sendmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');

// Configure Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Mail options configuration
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'bhayaniparth932@gmail.com', // Replace with target recipient
  subject: 'Automated Email from Node.js Lab',
  text: 'This is a plain-text fallback message.',
  html: '<h2>Hello!</h2><p>This email was sent automatically using <b>Nodemailer</b> from a Node.js application.</p>',
  attachments: [
    { 
      filename: 'report.pdf', 
      path: path.join(__dirname, 'report.pdf') 
    }
  ]
};

// Send mail via transporter
transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});