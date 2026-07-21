import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const type = request.nextUrl.searchParams.get('type')

    const project = await db.project.findUnique({
      where: { slug },
      select: {
        coverImage: true,
        thumbnailUrl: true,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    const imageStr = type === 'cover' ? project.coverImage : project.thumbnailUrl

    if (!imageStr || !imageStr.startsWith('data:image')) {
      return new NextResponse('Image not found or not base64', { status: 404 })
    }

    // Parse data:image/png;base64,iVBORw0KGgo...
    const matches = imageStr.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return new NextResponse('Invalid base64 string', { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving project image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
