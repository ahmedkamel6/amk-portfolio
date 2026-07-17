import { db } from '@/lib/db';
import { getSession } from '@/lib/portfolio/auth';
import { format } from 'date-fns';
import { RevokeButton } from './RevokeButton';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const currentSession = await getSession();
  if (!currentSession) return null;

  const sessions = await db.adminSession.findMany({
    where: { userId: currentSession.userId },
    orderBy: { lastActivity: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Security & Devices</h1>
        <p className="text-[var(--text-secondary)]">Manage your active sessions and security settings.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Sessions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const isCurrent = session.id === currentSession.id;
            return (
              <div key={session.id} className={`rounded-xl border p-5 \${isCurrent ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{session.device || 'Unknown Device'}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{session.os} • {session.browser}</p>
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="mt-4 space-y-1 text-xs text-[var(--text-secondary)]">
                  <p>IP: <span className="font-mono">{session.ip || 'Unknown'}</span></p>
                  <p>Location: {session.city && session.country ? `\${session.city}, \${session.country}` : 'Unknown'}</p>
                  <p>Last active: {format(session.lastActivity, 'MMM d, yyyy HH:mm')}</p>
                </div>

                {!isCurrent && (
                  <div className="mt-4">
                    <RevokeButton sessionId={session.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
