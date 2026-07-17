import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { UAParser } from 'ua-parser-js';

export interface AuditMetadata {
  [key: string]: any;
}

export interface RequestDetails {
  ip: string;
  userAgent: string;
  country: string;
  city: string;
}

export function getRequestDetails(req: NextRequest | Headers): RequestDetails {
  let ip = 'Unknown';
  let userAgent = 'Unknown';
  let country = 'Unknown';
  let city = 'Unknown';

  const extract = (headers: Headers) => {
    ip = headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip') || 'Unknown';
    userAgent = headers.get('user-agent') || 'Unknown';
    country = headers.get('x-vercel-ip-country') || 'Unknown';
    city = headers.get('x-vercel-ip-city') || 'Unknown';
  };

  if ('headers' in req && typeof req.headers.get === 'function' && !('nextUrl' in req)) {
    extract(req as Headers);
  } else if ('headers' in req) {
    extract((req as NextRequest).headers);
  }

  return { ip, userAgent, country, city };
}

export async function logAudit(
  action: string,
  userId?: string,
  reqDetails?: RequestDetails,
  metadata?: AuditMetadata
) {
  try {
    let browser = 'Unknown', os = 'Unknown', device = 'Unknown';
    if (reqDetails?.userAgent && reqDetails.userAgent !== 'Unknown') {
      const parser = new UAParser(reqDetails.userAgent);
      browser = `${parser.getBrowser().name || 'Unknown'} ${parser.getBrowser().version || ''}`.trim();
      os = `${parser.getOS().name || 'Unknown'} ${parser.getOS().version || ''}`.trim();
      device = `${parser.getDevice().vendor || 'Unknown'} ${parser.getDevice().model || ''}`.trim();
    }

    await db.auditLog.create({
      data: {
        userId,
        action,
        ip: reqDetails?.ip,
        browser,
        os,
        device,
        country: reqDetails?.country,
        city: reqDetails?.city,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
