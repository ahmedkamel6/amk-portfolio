'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/portfolio/auth';
import { logAudit } from '@/lib/portfolio/audit';
import { revalidatePath } from 'next/cache';

export async function revokeSessionAction(sessionIdToRevoke: string) {
  const currentSession = await getSession();
  if (!currentSession) throw new Error('Unauthorized');

  const session = await db.adminSession.findUnique({ where: { id: sessionIdToRevoke } });
  if (!session || session.userId !== currentSession.userId) {
    throw new Error('Invalid session');
  }

  await db.adminSession.delete({ where: { id: sessionIdToRevoke } });
  
  // Log the action without reqDetails (as it's a server action, though we could pass headers())
  await logAudit('REVOKE_SESSION', currentSession.userId, undefined, { revokedSessionId: sessionIdToRevoke, revokedDevice: session.device });
  
  revalidatePath('/admin/security');
}
