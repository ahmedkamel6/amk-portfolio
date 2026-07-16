import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const row = await db.contactInfo.findUnique({ where: { id: 'singleton' } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    channels: JSON.parse(row.channelsJson),
    footerName: row.footerName,
    footerTagline: row.footerTagline,
    footerCopyright: row.footerCopyright,
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
  if (body.ctaLabel !== undefined) patch.ctaLabel = body.ctaLabel
  if (body.ctaHref !== undefined) patch.ctaHref = body.ctaHref
  if (body.channels !== undefined) patch.channelsJson = JSON.stringify(body.channels)
  if (body.footerName !== undefined) patch.footerName = body.footerName
  if (body.footerTagline !== undefined) patch.footerTagline = body.footerTagline
  if (body.footerCopyright !== undefined) patch.footerCopyright = body.footerCopyright

  const row = await db.contactInfo.upsert({
    where: { id: 'singleton' },
    update: patch,
    create: {
      id: 'singleton',
      title: body.title ?? '',
      titleHighlight: body.titleHighlight ?? '',
      description: body.description ?? '',
      ctaLabel: body.ctaLabel ?? '',
      ctaHref: body.ctaHref ?? '',
      channelsJson: JSON.stringify(body.channels ?? []),
      footerName: body.footerName ?? '',
      footerTagline: body.footerTagline ?? '',
      footerCopyright: body.footerCopyright ?? '',
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})
