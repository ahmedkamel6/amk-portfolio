import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

function formatProject(r: any) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    shortDescription: r.shortDescription,
    fullDescription: r.fullDescription,
    gradient: r.gradient,
    pattern: r.pattern,
    toolsUsed: r.toolsUsed.split(',').map((t: string) => t.trim()).filter(Boolean),
    tech: r.toolsUsed.split(',').map((t: string) => t.trim()).filter(Boolean),
    year: r.year,
    duration: r.duration,
    client: r.client,
    videoUrl: r.videoUrl,
    coverImage: r.coverImage,
    driveUrl: r.driveUrl,
    thumbnailUrl: r.thumbnailUrl,
    gallery: JSON.parse(r.galleryJson),
    beforeAfter: JSON.parse(r.beforeAfterJson),
    featured: r.featured,
    order: r.order,
  }
}

export async function GET() {
  const rows = await db.project.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(rows.map(formatProject))
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const count = await db.project.count()
  const slug = body.slug || slugify(body.title)
  const row = await db.project.create({
    data: {
      slug,
      title: body.title ?? 'New Project',
      category: body.category ?? 'Category',
      shortDescription: body.shortDescription ?? body.description ?? '',
      fullDescription: body.fullDescription ?? body.shortDescription ?? '',
      gradient: body.gradient ?? 'from-[#003B2A] via-[#00D084]/40 to-[#0B0B0B]',
      pattern: body.pattern ?? 'cinema',
      toolsUsed: Array.isArray(body.toolsUsed) ? body.toolsUsed.join(', ') : (Array.isArray(body.tech) ? body.tech.join(', ') : ''),
      year: body.year ?? '2026',
      duration: body.duration ?? null,
      client: body.client ?? null,
      videoUrl: body.videoUrl ?? null,
      coverImage: body.coverImage ?? null,
      driveUrl: body.driveUrl ?? null,
      thumbnailUrl: body.thumbnailUrl ?? null,
      galleryJson: JSON.stringify(body.gallery ?? []),
      beforeAfterJson: JSON.stringify(body.beforeAfter ?? {}),
      featured: body.featured ?? true,
      order: body.order ?? count,
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: formatProject(row) })
})

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  if (Array.isArray(body)) {
    for (const item of body) {
      await db.project.update({ where: { id: item.id }, data: { order: item.order } })
    }
    revalidateSite()
    return NextResponse.json({ ok: true })
  }
  const patch: Record<string, any> = {}
  if (body.slug !== undefined || body.title !== undefined) {
    patch.slug = body.slug || slugify(body.title)
  }
  if (body.title !== undefined) patch.title = body.title
  if (body.category !== undefined) patch.category = body.category
  if (body.shortDescription !== undefined) patch.shortDescription = body.shortDescription
  if (body.description !== undefined && !body.shortDescription) patch.shortDescription = body.description
  if (body.fullDescription !== undefined) patch.fullDescription = body.fullDescription
  if (body.gradient !== undefined) patch.gradient = body.gradient
  if (body.pattern !== undefined) patch.pattern = body.pattern
  if (body.toolsUsed !== undefined) patch.toolsUsed = Array.isArray(body.toolsUsed) ? body.toolsUsed.join(', ') : ''
  if (body.tech !== undefined && !body.toolsUsed) patch.toolsUsed = Array.isArray(body.tech) ? body.tech.join(', ') : ''
  if (body.year !== undefined) patch.year = body.year
  if (body.duration !== undefined) patch.duration = body.duration
  if (body.client !== undefined) patch.client = body.client
  if (body.videoUrl !== undefined) patch.videoUrl = body.videoUrl
  if (body.coverImage !== undefined) patch.coverImage = body.coverImage
  if (body.driveUrl !== undefined) patch.driveUrl = body.driveUrl
  if (body.thumbnailUrl !== undefined) patch.thumbnailUrl = body.thumbnailUrl
  if (body.gallery !== undefined) patch.galleryJson = JSON.stringify(body.gallery)
  if (body.beforeAfter !== undefined) patch.beforeAfterJson = JSON.stringify(body.beforeAfter)
  if (body.featured !== undefined) patch.featured = body.featured
  if (body.order !== undefined) patch.order = body.order

  const row = await db.project.update({
    where: { id: body.id },
    data: patch,
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: formatProject(row) })
})

export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await db.project.delete({ where: { id } })
  revalidateSite()
  return NextResponse.json({ ok: true })
})
