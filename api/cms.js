/**
 * Vercel Serverless Function: /api/cms
 * ===================================
 * Connects to Neon Postgres to manage Profile, Skills, and Experience
 * enabling full CMS management across all devices.
 */

import { neon } from '@neondatabase/serverless';

const NEON_DEFAULT_URL = 'postgresql://neondb_owner:npg_TltLr4Znqb0M@ep-broad-voice-b3vj2hzu-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const databaseUrl = process.env.DATABASE_URL || NEON_DEFAULT_URL;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!databaseUrl) {
    return res.status(200).json({
      connected: false,
      message: 'DATABASE_URL belum disetel di Vercel. Menggunakan data lokal.',
      settings: {},
    });
  }

  try {
    const sql = neon(databaseUrl);

    // Auto-migration: Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        key VARCHAR(64) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 1. GET: Fetch all CMS configurations
    if (req.method === 'GET') {
      const rows = await sql`SELECT key, value, updated_at FROM portfolio_settings`;
      const settings = {};
      for (const row of rows) {
        if (row.key !== 'admin_auth') {
          settings[row.key] = row.value;
        }
      }

      return res.status(200).json({
        connected: true,
        settings,
      });
    }

    // 2. POST: Update a CMS section (profile, skills, experiences)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { key, value } = body;

      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Field "key" dan "value" wajib diisi' });
      }

      // Security: do not allow updating admin_auth through this endpoint
      if (key === 'admin_auth') {
        return res.status(403).json({ error: 'Gunakan /api/auth untuk mengubah password' });
      }

      const jsonStr = JSON.stringify(value);

      await sql`
        INSERT INTO portfolio_settings (key, value, updated_at)
        VALUES (${key}, ${jsonStr}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        message: `Pengaturan "${key}" berhasil disimpan di Neon Postgres!`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Neon CMS API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal berkomunikasi dengan database Neon',
    });
  }
}
