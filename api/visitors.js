/**
 * Vercel Serverless Function: /api/visitors
 * ========================================
 * Accurate, anti-spam visitor tracking and analytics using Neon Postgres.
 * Features:
 * - Unique Visitor Count based on client IP
 * - Geolocation detection via Vercel Edge headers (City, Region, Country)
 * - User-Agent parsing for device and browser insight
 * - Public endpoint (summary counts) and Admin endpoint (detailed visitor table)
 */

import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

// Helper: Parse client IP address
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

// Helper: Parse user agent for device and browser
function parseUserAgent(uaString = '') {
  const ua = uaString.toLowerCase();
  let device = 'Desktop';
  let browser = 'Browser';

  // Device detection
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    if (/tablet|ipad/i.test(ua)) {
      device = 'Tablet';
    } else {
      device = 'Mobile';
    }
  } else if (/tablet|ipad/i.test(ua)) {
    device = 'Tablet';
  }

  // OS detection
  let os = 'OS Lain';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) os = 'iOS';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';

  // Browser detection
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';
  else if (ua.includes('samsungbrowser')) browser = 'Samsung Internet';

  return {
    device: `${os} (${device})`,
    browser,
  };
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Anti-cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Fallback if databaseUrl is not set
  if (!databaseUrl) {
    return res.status(200).json({
      connected: false,
      message: 'DATABASE_URL belum disetel di Vercel.',
      totalUnique: 1,
      totalViews: 1,
      visitors: [],
    });
  }

  try {
    const sql = neon(databaseUrl);

    // Auto-migration: Ensure visitors table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_visitors (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(128) NOT NULL UNIQUE,
        city VARCHAR(128),
        region VARCHAR(128),
        country VARCHAR(64),
        device VARCHAR(128),
        browser VARCHAR(128),
        user_agent TEXT,
        visit_count INT DEFAULT 1,
        first_visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 1. POST: Record a visit
    if (req.method === 'POST') {
      const ip = getClientIp(req);
      const uaString = req.headers['user-agent'] || '';
      const { device, browser } = parseUserAgent(uaString);

      // Geolocation headers provided automatically by Vercel Edge
      let rawCity = req.headers['x-vercel-ip-city'];
      let city = rawCity ? decodeURIComponent(rawCity) : null;
      let region = req.headers['x-vercel-ip-country-region'] || null;
      let country = req.headers['x-vercel-ip-country'] || null;

      // Handle localhost or local testing
      if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        city = city || 'Gresik (Lokal)';
        region = region || 'Jawa Timur';
        country = country || 'ID';
      } else {
        city = city || 'Indonesia';
        country = country || 'ID';
      }

      // Upsert: If IP exists, increment visit_count & update timestamp. If new, insert.
      await sql`
        INSERT INTO portfolio_visitors (
          ip_address, city, region, country, device, browser, user_agent, visit_count, last_visited_at
        ) VALUES (
          ${ip}, ${city}, ${region}, ${country}, ${device}, ${browser}, ${uaString.slice(0, 500)}, 1, CURRENT_TIMESTAMP
        )
        ON CONFLICT (ip_address) DO UPDATE SET
          visit_count = portfolio_visitors.visit_count + 1,
          last_visited_at = CURRENT_TIMESTAMP,
          city = COALESCE(EXCLUDED.city, portfolio_visitors.city),
          region = COALESCE(EXCLUDED.region, portfolio_visitors.region),
          country = COALESCE(EXCLUDED.country, portfolio_visitors.country),
          device = COALESCE(EXCLUDED.device, portfolio_visitors.device),
          browser = COALESCE(EXCLUDED.browser, portfolio_visitors.browser);
      `;

      // Return aggregate counts
      const countResult = await sql`
        SELECT 
          COUNT(*)::int AS total_unique,
          COALESCE(SUM(visit_count), 0)::int AS total_views
        FROM portfolio_visitors;
      `;

      const totalUnique = countResult[0]?.total_unique || 1;
      const totalViews = countResult[0]?.total_views || 1;

      return res.status(200).json({
        success: true,
        totalUnique,
        totalViews,
      });
    }

    // 2. GET: Retrieve statistics
    if (req.method === 'GET') {
      const isDetail = req.query.detail === 'true';

      // Aggregate summary
      const countResult = await sql`
        SELECT 
          COUNT(*)::int AS total_unique,
          COALESCE(SUM(visit_count), 0)::int AS total_views,
          COUNT(CASE WHEN last_visited_at >= CURRENT_DATE THEN 1 END)::int AS today_unique
        FROM portfolio_visitors;
      `;

      const totalUnique = countResult[0]?.total_unique || 0;
      const totalViews = countResult[0]?.total_views || 0;
      const todayUnique = countResult[0]?.today_unique || 0;

      // Public request only needs simple counts
      if (!isDetail) {
        return res.status(200).json({
          success: true,
          totalUnique,
          totalViews,
        });
      }

      // Admin request gets full detailed list & top locations
      const visitors = await sql`
        SELECT 
          id,
          ip_address AS "ipAddress",
          city,
          region,
          country,
          device,
          browser,
          visit_count AS "visitCount",
          first_visited_at AS "firstVisitedAt",
          last_visited_at AS "lastVisitedAt"
        FROM portfolio_visitors
        ORDER BY last_visited_at DESC
        LIMIT 100;
      `;

      const topLocations = await sql`
        SELECT 
          COALESCE(city, 'Indonesia') AS location,
          COUNT(*)::int AS count
        FROM portfolio_visitors
        GROUP BY COALESCE(city, 'Indonesia')
        ORDER BY count DESC
        LIMIT 5;
      `;

      return res.status(200).json({
        success: true,
        summary: {
          totalUnique,
          totalViews,
          todayUnique,
          topLocations,
        },
        visitors,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Visitors API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Gagal memproses analitik pengunjung',
      totalUnique: 1,
      totalViews: 1,
    });
  }
}
