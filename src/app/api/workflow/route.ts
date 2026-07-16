import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const rows = await db.workflowStep.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(rows.map((r) => ({
    id: r.id,
    number: r.number,
    title: r.title,
    description: r.description,
    iconName: r.iconName,
    duration: r.duration,
    order: r.order,
  })))
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const count = await db.workflowStep.count()
  const row = await db.workflowStep.create({
    data: {
      number: body.number ?? String(count + 1).padStart(2, '0'),
      title: body.title ?? 'New Step',
      description: body.description ?? '',
      iconName: body.iconName ?? 'Sparkles',
      duration: body.duration ?? '1 day',
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
      await db.workflowStep.update({ where: { id: item.id }, data: { order: item.order, number: item.number } })
    }
    revalidateSite()
    return NextResponse.json({ ok: true })
  }
  const row = await db.workflowStep.update({
    where: { id: body.id },
    data: {
      ...(body.number !== undefined && { number: body.number }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.iconName !== undefined && { iconName: body.iconName }),
      ...(body.duration !== undefined && { duration: body.duration }),
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
  await db.workflowStep.delete({ where: { id } })
  revalidateSite()
  return NextResponse.json({ ok: true })
})
