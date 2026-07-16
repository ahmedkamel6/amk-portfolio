import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const rows = await db.service.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(rows.map((r) => ({
    id: r.id,
    emoji: r.emoji,
    iconName: r.iconName,
    title: r.title,
    description: r.description,
    features: r.features.split(',').map((f) => f.trim()).filter(Boolean),
    order: r.order,
  })))
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const count = await db.service.count()
  const row = await db.service.create({
    data: {
      emoji: body.emoji ?? '✨',
      iconName: body.iconName ?? 'Sparkles',
      title: body.title ?? 'New Service',
      description: body.description ?? '',
      features: Array.isArray(body.features) ? body.features.join(', ') : body.features ?? '',
      order: body.order ?? count,
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  // body can be a single item { id, ... } or an array for reorder
  if (Array.isArray(body)) {
    // Reorder: body is array of { id, order }
    for (const item of body) {
      await db.service.update({ where: { id: item.id }, data: { order: item.order } })
    }
    revalidateSite()
    return NextResponse.json({ ok: true })
  }
  const row = await db.service.update({
    where: { id: body.id },
    data: {
      ...(body.emoji !== undefined && { emoji: body.emoji }),
      ...(body.iconName !== undefined && { iconName: body.iconName }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.features !== undefined && { features: Array.isArray(body.features) ? body.features.join(', ') : body.features }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})

export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await db.service.delete({ where: { id } })
  revalidateSite()
  return NextResponse.json({ ok: true })
})
