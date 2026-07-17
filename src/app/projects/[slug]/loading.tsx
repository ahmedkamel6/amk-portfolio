/**
 * Instant loading skeleton for project detail pages.
 * This appears immediately when navigating, eliminating the black screen.
 */
export default function ProjectLoading() {
  return (
    <main className="relative min-h-screen pt-24">
      {/* Ambient background placeholder */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--background,#0B0B0B)]" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Back link skeleton */}
        <div className="h-5 w-40 rounded bg-white/5 animate-pulse" />

        {/* Title skeleton */}
        <div className="mt-14 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 rounded-full bg-emerald-500/10 animate-pulse" />
            <div className="h-4 w-12 rounded bg-white/5 animate-pulse" />
          </div>
          <div className="h-12 w-3/4 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-6 w-1/2 rounded bg-white/5 animate-pulse" />
        </div>

        {/* Video player skeleton */}
        <div className="relative mt-12 w-full aspect-video rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>

        {/* Details skeleton */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-white/5 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
              <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
