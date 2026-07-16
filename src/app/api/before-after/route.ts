import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const row = await db.beforeAfterContent.findUnique({ where: { id: 'singleton' } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    beforeLabel: row.beforeLabel,
    afterLabel: row.afterLabel,
  })
}

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const patch: Record<string, any> = {}
  if (body.title !== undefined) patch.title = body.title
  if (body.titleHighlight !== undefined) patch.titleHighlight = body.titleHighlight
  if (body.description !== undefined) patch.description = body.description
  if (body.beforeLabel !== undefined) patch.beforeLabel = body.beforeLabel
  if (body.afterLabel !== undefined) patch.afterLabel = body.afterLabel

  const row = await db.beforeAfterContent.upsert({
    where: { id: 'singleton' },
    update: patch,
    create: {
      id: 'singleton',
      title: body.title ?? '',
      titleHighlight: body.titleHighlight ?? '',
      description: body.description ?? '',
      beforeLabel: body.beforeLabel ?? 'Before',
      afterLabel: body.afterLabel ?? 'After',
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})
