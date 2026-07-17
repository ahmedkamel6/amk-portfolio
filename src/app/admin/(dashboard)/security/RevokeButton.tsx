'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { revokeSessionAction } from './actions';

export function RevokeButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    if (!confirm('Are you sure you want to revoke this session?')) return;
    setLoading(true);
    await revokeSessionAction(sessionId);
    setLoading(false);
  }

  return (
    <button
      onClick={handleRevoke}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {loading ? 'Revoking...' : 'Revoke Session'}
    </button>
  );
}
