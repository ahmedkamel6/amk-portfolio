import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';
import { RequestDetails } from './audit';

const SESSION_COOKIE = 'amk_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string, reqDetails: RequestDetails, oldSessionToken?: string): Promise<boolean> {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  let browser = 'Unknown', os = 'Unknown', device = 'Unknown';
  if (reqDetails.userAgent && reqDetails.userAgent !== 'Unknown') {
    const parser = new UAParser(reqDetails.userAgent);
    browser = `${parser.getBrowser().name || 'Unknown'} ${parser.getBrowser().version || ''}`.trim();
    os = `${parser.getOS().name || 'Unknown'} ${parser.getOS().version || ''}`.trim();
    device = `${parser.getDevice().vendor || 'Unknown'} ${parser.getDevice().model || ''}`.trim();
  }

  // Session rotation: Destroy old session if it exists
  if (oldSessionToken) {
    const oldHashed = hashToken(oldSessionToken);
    await db.adminSession.deleteMany({ where: { hashedToken: oldHashed } });
  }

  await db.adminSession.create({
    data: {
      hashedToken,
      userId,
      ip: reqDetails.ip,
      userAgent: reqDetails.userAgent,
      browser,
      os,
      device,
      country: reqDetails.country,
      city: reqDetails.city,
      expiresAt,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  });

  return true;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const hashedToken = hashToken(token);
    await db.adminSession.deleteMany({ where: { hashedToken } });
  }
  store.delete(SESSION_COOKIE);
}

export async function destroyAllSessions(userId: string): Promise<void> {
  await db.adminSession.deleteMany({ where: { userId } });
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const hashedToken = hashToken(token);
  const session = await db.adminSession.findUnique({ where: { hashedToken } });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.adminSession.delete({ where: { id: session.id } });
    store.delete(SESSION_COOKIE);
    return null;
  }

  // Sliding expiration: Update lastActivity and optionally extend expiration if less than half remains
  // For simplicity and performance, we'll just update lastActivity occasionally, or every time.
  // We do it asynchronously without blocking the response.
  db.adminSession.update({
    where: { id: session.id },
    data: { lastActivity: new Date() }
  }).catch(() => {});

  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

export async function requireAuth(): Promise<boolean> {
  return await isAuthenticated();
}
