import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const row = await db.heroContent.findUnique({ where: { id: 'singleton' } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    name: row.name,
    nameHighlight: row.nameHighlight,
    eyebrow: row.eyebrow,
    badge: row.badge,
    roles: row.roles.split(',').map((r) => r.trim()).filter(Boolean),
    stats: JSON.parse(row.statsJson),
    primaryCta: { label: row.primaryCtaLabel, href: row.primaryCtaHref },
    secondaryCta: { label: row.secondaryCtaLabel, href: row.secondaryCtaHref },
  })
}

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()

  // Build patch object — only include fields that are actually provided
  const patch: Record<string, any> = {}
  if (body.name !== undefined) patch.name = body.name
  if (body.nameHighlight !== undefined) patch.nameHighlight = body.nameHighlight
  if (body.eyebrow !== undefined) patch.eyebrow = body.eyebrow
  if (body.badge !== undefined) patch.badge = body.badge
  if (body.roles !== undefined) patch.roles = Array.isArray(body.roles) ? body.roles.join(', ') : body.roles
  if (body.stats !== undefined) patch.statsJson = JSON.stringify(body.stats)
  if (body.primaryCta !== undefined) {
    patch.primaryCtaLabel = body.primaryCta.label
    patch.primaryCtaHref = body.primaryCta.href
  }
  if (body.secondaryCta !== undefined) {
    patch.secondaryCtaLabel = body.secondaryCta.label
    patch.secondaryCtaHref = body.secondaryCta.href
  }

  const row = await db.heroContent.upsert({
    where: { id: 'singleton' },
    update: patch,
    create: {
      id: 'singleton',
      name: body.name ?? 'Name',
      nameHighlight: body.nameHighlight ?? 'Highlight',
      eyebrow: body.eyebrow ?? '',
      badge: body.badge ?? '',
      roles: Array.isArray(body.roles) ? body.roles.join(', ') : (body.roles ?? ''),
      statsJson: JSON.stringify(body.stats ?? []),
      primaryCtaLabel: body.primaryCta?.label ?? '',
      primaryCtaHref: body.primaryCta?.href ?? '',
      secondaryCtaLabel: body.secondaryCta?.label ?? '',
      secondaryCtaHref: body.secondaryCta?.href ?? '',
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})
