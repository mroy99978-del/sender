# SMTP Email Sender

A tiny web app: a mobile-friendly form (sender name, sender email, reply-to, to, subject, body) backed by a Node.js server that sends the email via your SMTP account.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env` with your real SMTP details.

**Gmail:**
- Host: `smtp.gmail.com`, Port: `587`
- Turn on 2-Step Verification, then create an "App Password" (Google Account → Security → App passwords). Use that as `SMTP_PASS`, not your normal password.

**Outlook / Microsoft 365:**
- Host: `smtp-mail.outlook.com` (or `smtp.office365.com` for work accounts), Port: `587`

Run it:
```bash
npm start
```
Visit `http://localhost:3000` to test on your computer.

## 2. Important limitation: the "sender email" field

SMTP providers check that the "From" address matches the account you authenticated with, or a verified alias on it. If you type in an arbitrary sender email that isn't yours, most providers will either reject the send or silently rewrite the From address. If you need to send as multiple addresses, add each one as a verified "Send As" alias in your email provider settings first.

## 3. Getting this on your iPhone

Since the server needs to keep your SMTP password secret, it can't just be a static page — it has to run somewhere reachable over the internet. Easiest free options:

**Render.com** (recommended, free tier):
1. Push this folder to a GitHub repo (make it private — it will contain no secrets since `.env` is gitignored, but add credentials via Render's dashboard instead).
2. On Render: New → Web Service → connect the repo.
3. Build command: `npm install`, Start command: `npm start`.
4. Add environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) in the Render dashboard.
5. Deploy. Render gives you a URL like `https://your-app.onrender.com`.
6. Open that URL in Safari on your iPhone. Optionally tap Share → "Add to Home Screen" so it behaves like an app icon.

**Railway.app** works the same way and is just as simple.

Once deployed, `API_BASE` in `public/index.html` can stay as `""` since the frontend and backend are served from the same URL.

## 4. Password protection

Set `APP_PASSWORD` in your `.env` (or in Render/Railway's environment variables) to require a password before anyone can send email through the app. Leave it blank to disable the check.

The web form saves the password in your iPhone browser after your first successful send, so you won't need to retype it each time — but anyone else who opens the page will still need to enter it once.

## 5. Security notes

- Never commit your `.env` file or real SMTP password to a public repo.
- The password gate is a basic deterrent, not strong security — it's sent as plain text in the request (protected only by HTTPS in transit) and stored in plain text in the browser's local storage. Don't reuse an important password for it, and don't rely on it if this needs to resist a determined attacker.
