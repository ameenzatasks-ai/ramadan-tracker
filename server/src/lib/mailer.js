import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV_OTP_LOG = path.join(__dirname, '..', '..', 'dev-otp.log');

let transporter = null;

function smtpConfigured() {
  const host = (process.env.SMTP_HOST || '').trim();
  if (!host) return false;
  // Treat placeholder hosts from .env.example as unset so that a copied-but-not-edited
  // env file doesn't silently break signup.
  if (/your-provider|your-domain|example\.com/.test(host)) return false;
  return true;
}

function getTransporter() {
  if (transporter) return transporter;
  if (!smtpConfigured()) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function sendOtpEmail(toEmail, code, fullName) {
  const fromName = process.env.EMAIL_FROM_NAME || 'Ramadan Goal Companion Auth';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'no-reply@example.com';
  const subject = 'Your Ramadan Goal Companion verification code';
  const greeting = fullName ? `As-salamu alaykum ${fullName},` : 'As-salamu alaykum,';
  const text =
    `${greeting}\n\n` +
    `Your verification code is: ${code}\n\n` +
    `This code expires in 10 minutes. If you did not request it, you can ignore this email.\n\n` +
    `— ${fromName}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:#004643; padding:24px; color:#fffffe;">
      <h2 style="color:#fffffe; margin:0 0 12px;">Ramadan Goal Companion</h2>
      <p style="color:#abd1c6; margin:0 0 16px;">${greeting}</p>
      <p style="color:#abd1c6; margin:0 0 8px;">Your verification code is:</p>
      <div style="background:#f9bc60; color:#001e1d; font-size:28px; letter-spacing:6px; font-weight:700; padding:14px 18px; border-radius:10px; display:inline-block;">${code}</div>
      <p style="color:#abd1c6; margin:16px 0 0;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
      <p style="color:#abd1c6; margin-top:20px;">— ${fromName}</p>
    </div>
  `;

  const t = getTransporter();
  if (!t) {
    // Dev fallback: log the code so testing without SMTP still works end-to-end.
    console.log(`\n[mailer:dev] OTP for ${toEmail} -> ${code}\n`);
    try { fs.appendFileSync(DEV_OTP_LOG, `${new Date().toISOString()} ${toEmail} ${code}\n`); } catch {}
    return { dev: true };
  }
  try {
    await t.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toEmail,
      subject,
      text,
      html,
    });
    // Belt and braces: also log in dev so a misconfigured sender doesn't lock you out.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[mailer] sent OTP to ${toEmail} (code logged for dev convenience): ${code}`);
    }
    return { dev: false };
  } catch (err) {
    console.warn(`[mailer] SMTP send failed, falling back to console: ${err.message}`);
    console.log(`\n[mailer:dev] OTP for ${toEmail} -> ${code}\n`);
    try { fs.appendFileSync(DEV_OTP_LOG, `${new Date().toISOString()} ${toEmail} ${code}\n`); } catch {}
    return { dev: true, smtpFailed: true };
  }
}
