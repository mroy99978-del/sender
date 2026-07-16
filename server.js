const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, body, senderName, senderEmail, replyTo, password } = req.body;

  if (process.env.APP_PASSWORD && password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
  }

  // NOTE: Most providers (Gmail, Outlook) require the "From" address to match
  // the authenticated account or a verified alias on that account. Sending as
  // an arbitrary senderEmail will usually be rejected or rewritten by the provider.
  const fromAddress = senderEmail || process.env.SMTP_USER;
  const fromName = senderName || 'Sent via app';

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      replyTo: replyTo || fromAddress,
      subject,
      text: body,
    });
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
