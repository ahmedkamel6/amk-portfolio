import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite, withErrorHandler } from '@/lib/portfolio/api-helpers'

export async function GET() {
  const row = await db.appearanceSettings.findUnique({ where: { id: 'singleton' } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    mode: row.mode,
    accent: row.accent,
    accentSoft: row.accentSoft,
    background: row.background,
    particleCount: row.particleCount,
    gridOpacity: row.gridOpacity,
    glowIntensity: row.glowIntensity,
    showShowreel: row.showShowreel,
    showServices: row.showServices,
    showProjects: row.showProjects,
    showBeforeAfter: row.showBeforeAfter,
    showWorkflow: row.showWorkflow,
    showSkills: row.showSkills,
    showAbout: row.showAbout,
    showTestimonials: row.showTestimonials,
    showContact: row.showContact,
    orderProjects: (row as any).orderProjects ?? 1,
    orderSkills: (row as any).orderSkills ?? 2,
    orderAbout: (row as any).orderAbout ?? 3,
    orderContact: (row as any).orderContact ?? 4,
    customLogoUrl: (row as any).customLogoUrl || null,
  })
}

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const auth = await requireAuthOr401()
  if (auth) return auth
  const body = await req.json()
  const patch: Record<string, any> = {}
  if (body.mode !== undefined) patch.mode = body.mode
  if (body.accent !== undefined) patch.accent = body.accent
  if (body.accentSoft !== undefined) patch.accentSoft = body.accentSoft
  if (body.background !== undefined) patch.background = body.background
  if (body.particleCount !== undefined) patch.particleCount = Number(body.particleCount)
  if (body.gridOpacity !== undefined) patch.gridOpacity = Number(body.gridOpacity)
  if (body.glowIntensity !== undefined) patch.glowIntensity = Number(body.glowIntensity)

  // Visibility fields
  if (body.showShowreel !== undefined) patch.showShowreel = Boolean(body.showShowreel)
  if (body.showServices !== undefined) patch.showServices = Boolean(body.showServices)
  if (body.showProjects !== undefined) patch.showProjects = Boolean(body.showProjects)
  if (body.showBeforeAfter !== undefined) patch.showBeforeAfter = Boolean(body.showBeforeAfter)
  if (body.showWorkflow !== undefined) patch.showWorkflow = Boolean(body.showWorkflow)
  if (body.showSkills !== undefined) patch.showSkills = Boolean(body.showSkills)
  if (body.showAbout !== undefined) patch.showAbout = Boolean(body.showAbout)
  if (body.showTestimonials !== undefined) patch.showTestimonials = Boolean(body.showTestimonials)
  if (body.showContact !== undefined) patch.showContact = Boolean(body.showContact)
  if (body.orderProjects !== undefined) patch.orderProjects = Number(body.orderProjects)
  if (body.orderSkills !== undefined) patch.orderSkills = Number(body.orderSkills)
  if (body.orderAbout !== undefined) patch.orderAbout = Number(body.orderAbout)
  if (body.orderContact !== undefined) patch.orderContact = Number(body.orderContact)
  if (body.customLogoUrl !== undefined) patch.customLogoUrl = body.customLogoUrl

  const row = await db.appearanceSettings.upsert({
    where: { id: 'singleton' },
    update: patch,
    create: {
      id: 'singleton',
      mode: body.mode ?? 'dark',
      accent: body.accent ?? '#00D084',
      accentSoft: body.accentSoft ?? '#00FF9D',
      background: body.background ?? '#0B0B0B',
      particleCount: Number(body.particleCount ?? 600),
      gridOpacity: Number(body.gridOpacity ?? 0.15),
      glowIntensity: Number(body.glowIntensity ?? 1),
      showShowreel: Boolean(body.showShowreel ?? true),
      showServices: Boolean(body.showServices ?? true),
      showProjects: Boolean(body.showProjects ?? true),
      showBeforeAfter: Boolean(body.showBeforeAfter ?? true),
      showWorkflow: Boolean(body.showWorkflow ?? true),
      showSkills: Boolean(body.showSkills ?? true),
      showAbout: Boolean(body.showAbout ?? true),
      showTestimonials: Boolean(body.showTestimonials ?? true),
      showContact: Boolean(body.showContact ?? true),
      orderProjects: Number(body.orderProjects ?? 1),
      orderSkills: Number(body.orderSkills ?? 2),
      orderAbout: Number(body.orderAbout ?? 3),
      orderContact: Number(body.orderContact ?? 4),
      customLogoUrl: body.customLogoUrl || null,
    },
  })
  revalidateSite()
  return NextResponse.json({ ok: true, data: row })
})
