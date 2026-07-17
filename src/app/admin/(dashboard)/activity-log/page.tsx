import { db } from '@/lib/db';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ActivityLogPage() {
  const logs = await db.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-[var(--text-secondary)]">Enterprise-grade activity monitoring and security logs.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-secondary)]">
          <thead className="bg-[var(--surface-hover)] text-xs uppercase text-[var(--text-primary)]">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Device / OS / Browser</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-[var(--text-muted)]">No logs found.</td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]">
                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">{format(log.timestamp, 'MMM d, yyyy HH:mm:ss')}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--text-primary)]">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{log.ip || 'N/A'}</td>
                <td className="px-6 py-4 text-xs">
                  {log.device} • {log.os} • {log.browser}
                </td>
                <td className="px-6 py-4 text-xs">
                  {log.city && log.country ? `${log.city}, ${log.country}` : 'Unknown'}
                </td>
                <td className="px-6 py-4 font-mono text-[10px] opacity-75 max-w-[200px] truncate">
                  {log.metadata || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
