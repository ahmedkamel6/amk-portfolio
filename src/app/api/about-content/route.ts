import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const row = await db.aboutContent.findUnique({
    where: { id: 'singleton' },
  })
  return NextResponse.json(row || {})
}

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const patch: any = {}

  if (body.title !== undefined) patch.title = body.title
  if (body.titleHighlight !== undefined) patch.titleHighlight = body.titleHighlight
  if (body.description !== undefined) patch.description = body.description
  if (body.imageUrl !== undefined) patch.imageUrl = body.imageUrl
  if (body.videoUrl !== undefined) patch.videoUrl = body.videoUrl
  if (body.tools !== undefined) patch.tools = body.tools

  const row = await db.aboutContent.upsert({
    where: { id: 'singleton' },
    update: patch,
    create: {
      id: 'singleton',
      title: body.title ?? 'The Journey',
      titleHighlight: body.titleHighlight ?? 'So Far',
      description: body.description ?? '',
      imageUrl: body.imageUrl || null,
      videoUrl: body.videoUrl || null,
      tools: body.tools ?? '',
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})
