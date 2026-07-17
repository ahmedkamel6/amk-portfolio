import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/portfolio/auth';
import { getRequestDetails, logAudit } from '@/lib/portfolio/audit';
import { verifyPassword } from '@/lib/portfolio/password';
import { Resend } from 'resend';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const reqDetails = getRequestDetails(req);
  const { username, password, totpCode } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }

  // 1. Rate Limiting Check (PostgreSQL)
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
  const recentAttempts = await db.loginAttempt.count({
    where: {
      ip: reqDetails.ip,
      email: username,
      createdAt: { gte: fifteenMinsAgo },
    },
  });

  if (recentAttempts >= 5) {
    await logAudit('RATE_LIMIT_LOCK', undefined, reqDetails, { username });
    return NextResponse.json({ error: 'Too many attempts. Locked for 15 minutes.' }, { status: 429 });
  }

  // 2. Fetch User & Verify Password
  const user = await db.adminUser.findFirst({ where: { OR: [{ username }, { email: username }] } });
  
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    // Log failed attempt
    await db.loginAttempt.create({
      data: { ip: reqDetails.ip, email: username },
    });
    await logAudit('FAILED_LOGIN', user?.id, reqDetails, { reason: 'Invalid credentials' });
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 3. Two Factor Authentication (TOTP)
  if (user.totpEnabled) {
    if (!totpCode) {
      return NextResponse.json({ requireTotp: true }, { status: 200 });
    }
    // TODO: Verify TOTP Code here
    // For now, if totpCode is sent but we haven't wired the TOTP module into the route yet,
    // we would import verifyTOTP and decrypt secret.
    const { verifyTOTP } = await import('@/lib/portfolio/totp');
    const { decrypt } = await import('@/lib/portfolio/encryption');
    
    if (user.totpSecret) {
      const decryptedSecret = decrypt(user.totpSecret);
      const isValidTotp = verifyTOTP(totpCode, decryptedSecret);
      
      let isValidRecovery = false;
      let usedRecoveryCodeId: string | null = null;
      
      if (!isValidTotp) {
        // Fallback to Recovery Code
        const recoveries = await db.recoveryCode.findMany({
          where: { userId: user.id, used: false },
        });
        
        for (const recovery of recoveries) {
          try {
            const decryptedCode = decrypt(recovery.hashedCode);
            if (decryptedCode === totpCode) {
              isValidRecovery = true;
              usedRecoveryCodeId = recovery.id;
              break;
            }
          } catch (err) {
            // ignore decryption error for individual codes
          }
        }
      }

      if (!isValidTotp && !isValidRecovery) {
        await db.loginAttempt.create({ data: { ip: reqDetails.ip, email: username } });
        await logAudit('FAILED_LOGIN_TOTP', user.id, reqDetails);
        return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
      }

      if (isValidRecovery && usedRecoveryCodeId) {
        await db.recoveryCode.update({ where: { id: usedRecoveryCodeId }, data: { used: true } });
        await logAudit('RECOVERY_CODE_USED', user.id, reqDetails);
      }
    }
  }

  // 4. Successful Login: Create Session
  await createSession(user.id, reqDetails);
  await logAudit('LOGIN', user.id, reqDetails);

  // 5. Trusted Devices & Email Notification
  const fingerprintString = `${reqDetails.ip}-${reqDetails.userAgent}`;
  const deviceFingerprint = crypto.createHash('sha256').update(fingerprintString).digest('hex');

  const isTrusted = await db.trustedDevice.findFirst({
    where: { userId: user.id, deviceFingerprint },
  });

  if (!isTrusted) {
    // Save as trusted for next time
    await db.trustedDevice.create({
      data: {
        userId: user.id,
        deviceFingerprint,
        ip: reqDetails.ip,
        os: 'Parsed OS', // We can parse this similarly if we extract OS from UAParser here
      },
    });

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Admin Security <onboarding@resend.dev>',
          to: user.email,
          subject: 'New Device Login Alert',
          html: `<p>A new login to your Admin Dashboard was detected.</p>
                 <p><b>Time:</b> ${new Date().toISOString()}</p>
                 <p><b>IP:</b> ${reqDetails.ip}</p>
                 <p><b>Location:</b> ${reqDetails.city}, ${reqDetails.country}</p>
                 <br/><a href="${req.nextUrl.origin}/admin/security">Review Security Activity</a>`,
        });
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    }
  } else {
    // Update last used
    await db.trustedDevice.updateMany({
      where: { userId: user.id, deviceFingerprint },
      data: { lastUsedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
