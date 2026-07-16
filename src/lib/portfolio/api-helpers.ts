import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/portfolio/auth'
import { revalidatePath } from 'next/cache'

/** Helper: returns 401 if not authenticated */
export async function requireAuthOr401(): Promise<NextResponse | null> {
  try {
    const ok = await isAuthenticated()
    if (!ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return null
  } catch (e: any) {
    console.error('[requireAuthOr401] Error:', e)
    return NextResponse.json({ error: 'Auth check failed: ' + e.message }, { status: 500 })
  }
}

/** Revalidate the home page + project pages after any content mutation */
export function revalidateSite() {
  try {
    revalidatePath('/', 'page')
    revalidatePath('/projects/[slug]', 'page')
  } catch (e) {
    // revalidatePath can throw in certain Next.js contexts (e.g. Turbopack dev)
    // This is non-critical — the pages will still pick up changes on next request
    console.warn('[revalidateSite] Non-critical error:', e)
  }
}

/**
 * Wraps an API route handler with error handling.
 * Catches Prisma errors (e.g. P2025 record not found) and other exceptions,
 * returning proper JSON error responses instead of crashing with raw 500s.
 */
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (e: any) {
      console.error(`[API ${req.method} ${req.nextUrl.pathname}] Error:`, e)

      // Prisma known errors (e.g. P2025 = record not found for delete/update)
      if (e?.code === 'P2025') {
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        )
      }

      // Prisma validation errors
      if (e?.code?.startsWith?.('P2')) {
        return NextResponse.json(
          { error: e.message || 'Database error' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: e.message || 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

