import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]" style={{ background: 'radial-gradient(circle, var(--emerald-glow), transparent 70%)' }} />
        <div className="absolute inset-0 bg-grid opacity-15" />
      </div>

      <div className="text-center">
        <p className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-emerald-glow/70">
          Error 404
        </p>
        <h1 className="mt-4 font-display text-7xl font-bold text-gradient-emerald md:text-9xl">
          404
        </h1>
        <h2 className="mt-4 font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
          This page wandered off
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to the work.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full glass-emerald px-6 py-3 text-sm font-medium text-emerald-glow transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  )
}
