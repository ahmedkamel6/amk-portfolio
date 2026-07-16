'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Hook for fetching + mutating a content collection via the API.
 * Used by admin editor pages. Re-fetches after mutations.
 */
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Failed to load ${endpoint}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    refresh()
  }, [refresh])

  const update = useCallback(async (body: any, method: 'POST' | 'PUT' | 'DELETE' = 'PUT') => {
    const url = method === 'DELETE' && body?.id ? `${endpoint}?id=${body.id}` : endpoint
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'DELETE' ? undefined : JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Request failed (${res.status})`)
    }
    
    const responseData = await res.json()
    
    // Optimistically update local data without full refresh (avoids input focus loss)
    setData((prev) => {
      if (Array.isArray(prev)) {
        if (method === 'PUT' && !Array.isArray(body) && body?.id) {
          return prev.map((item: any) => item.id === body.id ? { ...item, ...body } : item) as T
        }
        if (method === 'DELETE' && body?.id) {
          return prev.filter((item: any) => item.id !== body.id) as T
        }
        if (method === 'POST' && responseData.data) {
          return [...prev, responseData.data] as T
        }
      }
      return prev
    })
    
    return responseData
  }, [endpoint])

  return { data, loading, error, update, refresh }
}

/**
 * Hook for singleton content (Hero, Showreel, BeforeAfter, Contact, Appearance).
 * Uses debounce + optimistic update to avoid input focus loss on every keystroke.
 */
export function useSingleton<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<Partial<T>>({})

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Failed to load ${endpoint}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    refresh()
  }, [refresh])

  const update = useCallback(async (body: Partial<T>) => {
    // Optimistic update — apply immediately to local state
    setData((prev) => prev ? { ...prev, ...body } as T : prev)

    // Merge with pending changes (debounce)
    pendingRef.current = { ...pendingRef.current, ...body }

    // Clear existing timer
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // Debounce the API call — wait 400ms after last keystroke
    return new Promise<void>((resolve) => {
      debounceRef.current = setTimeout(async () => {
        const bodyToSend = pendingRef.current
        pendingRef.current = {}
        try {
          const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyToSend),
          })
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error || `Request failed (${res.status})`)
          }
          resolve()
        } catch (e: any) {
          setError(e.message)
          resolve()
        }
      }, 400)
    })
  }, [endpoint])

  return { data, loading, error, update, refresh }
}
