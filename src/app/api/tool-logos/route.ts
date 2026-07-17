import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const tools = await db.toolLogo.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(tools)
}

export async function POST(req: Request) {
  const data = await req.json()
  const tool = await db.toolLogo.create({
    data: {
      name: data.name,
      imageUrl: data.imageUrl,
    }
  })
  return NextResponse.json(tool)
}

export async function PUT(req: Request) {
  const data = await req.json()
  const tool = await db.toolLogo.update({
    where: { id: data.id },
    data: {
      name: data.name,
      imageUrl: data.imageUrl,
    }
  })
  return NextResponse.json(tool)
}

export async function DELETE(req: Request) {
  const data = await req.json()
  await db.toolLogo.delete({
    where: { id: data.id }
  })
  return NextResponse.json({ success: true })
}
