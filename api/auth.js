/**
 * Vercel Serverless Function: /api/auth
 * ====================================
 * Connects to Neon Postgres to securely verify and change admin password
 * with multi-device persistence and privacy.
 */

import { neon } from '@neondatabase/serverless';

const DEFAULT_PASSWORD = 'admin123';

const NEON_DEFAULT_URL = 'postgresql://neondb_owner:npg_TltLr4Znqb0M@ep-broad-voice-b3vj2hzu-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const databaseUrl = process.env.DATABASE_URL || NEON_DEFAULT_URL;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Anti-cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Fallback if databaseUrl is missing
  if (!databaseUrl) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.action === 'verify') {
      const isValid = body.password === DEFAULT_PASSWORD;
      return res.status(200).json({ success: isValid });
    }
    return res.status(200).json({ success: false, message: 'Database belum terhubung di Vercel' });
  }

  try {
    const sql = neon(databaseUrl);

    // Auto-migration: ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        key VARCHAR(64) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Fetch current stored password
    const rows = await sql`SELECT value FROM portfolio_settings WHERE key = 'admin_auth'`;
    let storedPassword = DEFAULT_PASSWORD;

    if (rows.length > 0 && rows[0].value && rows[0].value.password) {
      storedPassword = rows[0].value.password;
    } else {
      // Seed default password if missing
      await sql`
        INSERT INTO portfolio_settings (key, value, updated_at)
        VALUES ('admin_auth', ${JSON.stringify({ password: DEFAULT_PASSWORD })}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO NOTHING;
      `;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { action, password, currentPassword, newPassword } = body;

    // 1. Action: Verify password
    if (action === 'verify') {
      if (password === storedPassword) {
        return res.status(200).json({
          success: true,
          message: 'Login berhasil!',
        });
      } else {
        return res.status(200).json({
          success: false,
          message: 'Password admin salah! Silakan coba lagi.',
        });
      }
    }

    // 2. Action: Change password
    if (action === 'change') {
      if (currentPassword !== storedPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password lama tidak sesuai!',
        });
      }

      if (!newPassword || newPassword.length < 5) {
        return res.status(400).json({
          success: false,
          message: 'Password baru minimal 5 karakter!',
        });
      }

      const newAuthValue = JSON.stringify({ password: newPassword });

      await sql`
        INSERT INTO portfolio_settings (key, value, updated_at)
        VALUES ('admin_auth', ${newAuthValue}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        message: 'Password admin berhasil diubah dan tersimpan di database Neon cloud!',
      });
    }

    return res.status(400).json({ error: 'Aksi tidak valid (gunakan action: "verify" atau "change")' });
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal berkomunikasi dengan database autentikasi',
    });
  }
}
