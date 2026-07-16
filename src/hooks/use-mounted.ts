'use client'

import { useSyncExternalStore } from 'react'

/**
 * SSR-safe "has this component mounted on the client?" hook.
 *
 * Uses `useSyncExternalStore` so that:
 * - Server render → returns `false`
 * - Client first render (hydration) → returns `false` (matches server → no hydration mismatch)
 * - Client after mount → returns `true`
 *
 * This is the React-recommended pattern for gating browser-only UI
 * without triggering hydration warnings or the `set-state-in-effect` lint rule.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    // No real subscription needed — we just need a stable snapshot
    () => () => {},
    // Client snapshot
    () => true,
    // Server snapshot
    () => false
  )
}
