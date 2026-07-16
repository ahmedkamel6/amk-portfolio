import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const rows = await db.testimonial.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    company: r.company,
    quote: r.quote,
    initials: r.initials,
    color: r.color,
    rating: r.rating,
    photoUrl: r.photoUrl,
    order: r.order,
  })))
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const count = await db.testimonial.count()
  const row = await db.testimonial.create({
    data: {
      name: body.name ?? 'New Client',
      role: body.role ?? 'Role',
      company: body.company ?? 'Company',
      quote: body.quote ?? 'Quote',
      initials: body.initials ?? 'NC',
      color: body.color ?? '#00D084',
      rating: body.rating ?? 5,
      photoUrl: body.photoUrl ?? null,
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
      await db.testimonial.update({ where: { id: item.id }, data: { order: item.order } })
    }
    revalidateSite()
    return NextResponse.json({ ok: true })
  }
  const row = await db.testimonial.update({
    where: { id: body.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.quote !== undefined && { quote: body.quote }),
      ...(body.initials !== undefined && { initials: body.initials }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
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
  await db.testimonial.delete({ where: { id } })
  revalidateSite()
  return NextResponse.json({ ok: true })
})
