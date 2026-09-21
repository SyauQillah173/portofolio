/**
 * Vercel Serverless Function: /api/works
 * =====================================
 * Connects to Neon Serverless Postgres to provide persistent,
 * real-time multi-device database storage for portfolio works.
 */

import { neon } from '@neondatabase/serverless';

const NEON_DEFAULT_URL = 'postgresql://neondb_owner:npg_TltLr4Znqb0M@ep-broad-voice-b3vj2hzu-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const databaseUrl = process.env.DATABASE_URL || NEON_DEFAULT_URL;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Fallback if DATABASE_URL is completely missing
  if (!databaseUrl) {
    return res.status(200).json({
      connected: false,
      message: 'DATABASE_URL belum disetel di Vercel Environment Variables. Sistem otomatis menggunakan penyimpanan lokal.',
      works: null,
    });
  }

  try {
    const sql = neon(databaseUrl);

    // 1. Auto-migration: Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_works (
        id SERIAL PRIMARY KEY,
        work_id BIGINT UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        full_description TEXT,
        year VARCHAR(100),
        role VARCHAR(255),
        client_name VARCHAR(255),
        production_house VARCHAR(255),
        featured BOOLEAN DEFAULT FALSE,
        technologies JSONB DEFAULT '[]'::jsonb,
        gallery JSONB DEFAULT '[]'::jsonb,
        external_links JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. GET: List all projects
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT 
          work_id as id,
          title,
          category,
          image,
          description,
          full_description as "fullDescription",
          year,
          role,
          client_name as client,
          production_house as "productionHouse",
          featured,
          technologies,
          gallery,
          external_links as "externalLinks"
        FROM portfolio_works
        ORDER BY work_id ASC, id ASC
      `;

      return res.status(200).json({
        connected: true,
        count: rows.length,
        works: rows,
      });
    }

    // 3. POST: Add or Upsert a project
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const workId = body.id || Date.now();
      const title = body.title || 'Untitled';
      const category = body.category || 'web';
      const image = body.image || '';
      const description = body.description || '';
      const fullDescription = body.fullDescription || description;
      const year = body.year || '';
      const role = body.role || '';
      const clientName = body.client || '';
      const productionHouse = body.productionHouse || '';
      const featured = Boolean(body.featured);
      const technologies = JSON.stringify(body.technologies || []);
      const gallery = JSON.stringify(body.gallery || (image ? [image] : []));
      const externalLinks = JSON.stringify(body.externalLinks || []);

      const result = await sql`
        INSERT INTO portfolio_works (
          work_id, title, category, image, description, full_description,
          year, role, client_name, production_house, featured,
          technologies, gallery, external_links, updated_at
        ) VALUES (
          ${workId}, ${title}, ${category}, ${image}, ${description}, ${fullDescription},
          ${year}, ${role}, ${clientName}, ${productionHouse}, ${featured},
          ${technologies}::jsonb, ${gallery}::jsonb, ${externalLinks}::jsonb, CURRENT_TIMESTAMP
        )
        ON CONFLICT (work_id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          description = EXCLUDED.description,
          full_description = EXCLUDED.full_description,
          year = EXCLUDED.year,
          role = EXCLUDED.role,
          client_name = EXCLUDED.client_name,
          production_house = EXCLUDED.production_house,
          featured = EXCLUDED.featured,
          technologies = EXCLUDED.technologies,
          gallery = EXCLUDED.gallery,
          external_links = EXCLUDED.external_links,
          updated_at = CURRENT_TIMESTAMP
        RETURNING work_id as id, title;
      `;

      return res.status(201).json({
        success: true,
        message: 'Karya berhasil disimpan ke Neon Postgres!',
        work: result[0],
      });
    }

    // 4. PUT: Update an existing project
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const workId = body.id;
      if (!workId) {
        return res.status(400).json({ error: 'ID karya diperlukan untuk update' });
      }

      const title = body.title || 'Untitled';
      const category = body.category || 'web';
      const image = body.image || '';
      const description = body.description || '';
      const fullDescription = body.fullDescription || description;
      const year = body.year || '';
      const role = body.role || '';
      const clientName = body.client || '';
      const productionHouse = body.productionHouse || '';
      const featured = Boolean(body.featured);
      const technologies = JSON.stringify(body.technologies || []);
      const gallery = JSON.stringify(body.gallery || (image ? [image] : []));
      const externalLinks = JSON.stringify(body.externalLinks || []);

      await sql`
        UPDATE portfolio_works SET
          title = ${title},
          category = ${category},
          image = ${image},
          description = ${description},
          full_description = ${fullDescription},
          year = ${year},
          role = ${role},
          client_name = ${clientName},
          production_house = ${productionHouse},
          featured = ${featured},
          technologies = ${technologies}::jsonb,
          gallery = ${gallery}::jsonb,
          external_links = ${externalLinks}::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE work_id = ${workId}
      `;

      return res.status(200).json({
        success: true,
        message: 'Karya berhasil diperbarui di Neon Postgres!',
      });
    }

    // 5. DELETE: Delete a project
    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      const workId = id ? parseInt(id, 10) : null;
      if (!workId) {
        return res.status(400).json({ error: 'ID karya diperlukan' });
      }

      await sql`DELETE FROM portfolio_works WHERE work_id = ${workId}`;

      return res.status(200).json({
        success: true,
        message: `Karya #${workId} berhasil dihapus dari Neon Postgres!`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Neon Postgres API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal berkomunikasi dengan database Neon',
    });
  }
}
