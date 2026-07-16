import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const row = await db.showreelContent.findUnique({ where: { id: 'singleton' } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    duration: row.duration,
    year: row.year,
    software: row.software,
    videoTitle: row.videoTitle,
    timecode: row.timecode,
    videoUrl: row.videoUrl,
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
  if (body.duration !== undefined) patch.duration = body.duration
  if (body.year !== undefined) patch.year = body.year
  if (body.software !== undefined) patch.software = body.software
  if (body.videoTitle !== undefined) patch.videoTitle = body.videoTitle
  if (body.timecode !== undefined) patch.timecode = body.timecode
  if (body.videoUrl !== undefined) patch.videoUrl = body.videoUrl

  const row = await db.showreelContent.upsert({
    where: { id: 'singleton' },
    update: patch,
    create: {
      id: 'singleton',
      title: body.title ?? '',
      titleHighlight: body.titleHighlight ?? '',
      description: body.description ?? '',
      duration: body.duration ?? '',
      year: body.year ?? '',
      software: body.software ?? '',
      videoTitle: body.videoTitle ?? '',
      timecode: body.timecode ?? '',
      videoUrl: body.videoUrl ?? null,
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})
