import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const rows = await db.skill.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(rows.map((r) => ({
    id: r.id,
    name: r.name,
    short: r.short,
    level: r.level,
    color: r.color,
    category: r.category,
    order: r.order,
  })))
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const count = await db.skill.count()
  const row = await db.skill.create({
    data: {
      name: body.name ?? 'New Skill',
      short: body.short ?? 'NS',
      level: body.level ?? 80,
      color: body.color ?? '#00D084',
      category: body.category ?? 'Category',
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
  if (Array.isArray(body)) {
    for (const item of body) {
      await db.skill.update({ where: { id: item.id }, data: { order: item.order } })
    }
    revalidateSite()
    return NextResponse.json({ ok: true })
  }
  const row = await db.skill.update({
    where: { id: body.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.short !== undefined && { short: body.short }),
      ...(body.level !== undefined && { level: Number(body.level) }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.category !== undefined && { category: body.category }),
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
  await db.skill.delete({ where: { id } })
  revalidateSite()
  return NextResponse.json({ ok: true })
})
