import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuthOr401, revalidateSite } from '@/lib/portfolio/api-helpers'
import bcrypt from 'bcryptjs'

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

/**
 * Migrate endpoint — accepts the full localStorage JSON shape
 * (same as the previous Zustand store) and writes it to all DB tables.
 * Used by the "Migrate from localStorage" button in the admin dashboard.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuthOr401()
  if (auth) return auth

  const body = await req.json()
  const results: Record<string, number> = {}

  // Hero
  if (body.hero) {
    const h = body.hero
    await db.heroContent.upsert({
      where: { id: 'singleton' },
      update: {
        name: h.name, nameHighlight: h.nameHighlight, eyebrow: h.eyebrow, badge: h.badge,
        roles: Array.isArray(h.roles) ? h.roles.join(', ') : String(h.roles ?? ''),
        statsJson: JSON.stringify(h.stats ?? []),
        primaryCtaLabel: h.primaryCta?.label ?? '', primaryCtaHref: h.primaryCta?.href ?? '',
        secondaryCtaLabel: h.secondaryCta?.label ?? '', secondaryCtaHref: h.secondaryCta?.href ?? '',
      },
      create: {
        id: 'singleton',
        name: h.name, nameHighlight: h.nameHighlight, eyebrow: h.eyebrow, badge: h.badge,
        roles: Array.isArray(h.roles) ? h.roles.join(', ') : String(h.roles ?? ''),
        statsJson: JSON.stringify(h.stats ?? []),
        primaryCtaLabel: h.primaryCta?.label ?? '', primaryCtaHref: h.primaryCta?.href ?? '',
        secondaryCtaLabel: h.secondaryCta?.label ?? '', secondaryCtaHref: h.secondaryCta?.href ?? '',
      },
    })
    results.hero = 1
  }

  // Showreel
  if (body.showreel) {
    const s = body.showreel
    await db.showreelContent.upsert({
      where: { id: 'singleton' },
      update: {
        title: s.title, titleHighlight: s.titleHighlight, description: s.description,
        duration: s.duration, year: s.year, software: s.software,
        videoTitle: s.videoTitle, timecode: s.timecode, videoUrl: s.videoUrl ?? null,
      },
      create: {
        id: 'singleton',
        title: s.title, titleHighlight: s.titleHighlight, description: s.description,
        duration: s.duration, year: s.year, software: s.software,
        videoTitle: s.videoTitle, timecode: s.timecode, videoUrl: s.videoUrl ?? null,
      },
    })
    results.showreel = 1
  }

  // BeforeAfter
  if (body.beforeAfter) {
    const b = body.beforeAfter
    await db.beforeAfterContent.upsert({
      where: { id: 'singleton' },
      update: {
        title: b.title, titleHighlight: b.titleHighlight, description: b.description,
        beforeLabel: b.beforeLabel, afterLabel: b.afterLabel,
      },
      create: {
        id: 'singleton',
        title: b.title, titleHighlight: b.titleHighlight, description: b.description,
        beforeLabel: b.beforeLabel, afterLabel: b.afterLabel,
      },
    })
    results.beforeAfter = 1
  }

  // Contact
  if (body.contact) {
    const c = body.contact
    await db.contactInfo.upsert({
      where: { id: 'singleton' },
      update: {
        title: c.title, titleHighlight: c.titleHighlight, description: c.description,
        ctaLabel: c.ctaLabel, ctaHref: c.ctaHref,
        channelsJson: JSON.stringify(c.channels ?? []),
        footerName: c.footerName, footerTagline: c.footerTagline, footerCopyright: c.footerCopyright,
      },
      create: {
        id: 'singleton',
        title: c.title, titleHighlight: c.titleHighlight, description: c.description,
        ctaLabel: c.ctaLabel, ctaHref: c.ctaHref,
        channelsJson: JSON.stringify(c.channels ?? []),
        footerName: c.footerName, footerTagline: c.footerTagline, footerCopyright: c.footerCopyright,
      },
    })
    results.contact = 1
  }

  // Appearance
  if (body.theme) {
    const t = body.theme
    await db.appearanceSettings.upsert({
      where: { id: 'singleton' },
      update: {
        mode: t.mode, accent: t.accent, accentSoft: t.accentSoft, background: t.background,
        particleCount: Number(t.particleCount), gridOpacity: Number(t.gridOpacity), glowIntensity: Number(t.glowIntensity),
      },
      create: {
        id: 'singleton',
        mode: t.mode, accent: t.accent, accentSoft: t.accentSoft, background: t.background,
        particleCount: Number(t.particleCount), gridOpacity: Number(t.gridOpacity), glowIntensity: Number(t.glowIntensity),
      },
    })
    results.appearance = 1
  }

  // Services
  if (Array.isArray(body.services)) {
    await db.service.deleteMany({})
    for (let i = 0; i < body.services.length; i++) {
      const s = body.services[i]
      await db.service.create({
        data: {
          emoji: s.emoji ?? '✨', iconName: s.iconName ?? 'Sparkles',
          title: s.title ?? '', description: s.description ?? '',
          features: Array.isArray(s.features) ? s.features.join(', ') : '',
          order: i,
        },
      })
    }
    results.services = body.services.length
  }

  // Projects
  if (Array.isArray(body.projects)) {
    await db.project.deleteMany({})
    for (let i = 0; i < body.projects.length; i++) {
      const p = body.projects[i]
      await db.project.create({
        data: {
          slug: slugify(p.title),
          title: p.title ?? 'Untitled',
          category: p.category ?? 'Category',
          shortDescription: p.description ?? '',
          fullDescription: p.description ?? '',
          gradient: p.gradient ?? 'from-[#003B2A] via-[#00D084]/40 to-[#0B0B0B]',
          pattern: p.pattern ?? 'cinema',
          toolsUsed: Array.isArray(p.tech) ? p.tech.join(', ') : '',
          year: p.year ?? '2026',
          duration: null, client: null, videoUrl: null, coverImage: null,
          galleryJson: '[]', beforeAfterJson: '{}',
          featured: true, order: i,
        },
      })
    }
    results.projects = body.projects.length
  }

  // Workflow
  if (Array.isArray(body.workflow)) {
    await db.workflowStep.deleteMany({})
    for (let i = 0; i < body.workflow.length; i++) {
      const w = body.workflow[i]
      await db.workflowStep.create({
        data: {
          number: w.number ?? String(i + 1).padStart(2, '0'),
          title: w.title ?? '', description: w.description ?? '',
          iconName: w.iconName ?? 'Sparkles', duration: w.duration ?? '',
          order: i,
        },
      })
    }
    results.workflow = body.workflow.length
  }

  // Skills
  if (Array.isArray(body.skills)) {
    await db.skill.deleteMany({})
    for (let i = 0; i < body.skills.length; i++) {
      const s = body.skills[i]
      await db.skill.create({
        data: {
          name: s.name ?? '', short: s.short ?? '', level: s.level ?? 80,
          color: s.color ?? '#00D084', category: s.category ?? '',
          order: i,
        },
      })
    }
    results.skills = body.skills.length
  }

  // About
  if (Array.isArray(body.about)) {
    if ('aboutTimelineItem' in db) {
      await (db as any).aboutTimelineItem.deleteMany({})
      for (let i = 0; i < body.about.length; i++) {
        const a = body.about[i]
        await (db as any).aboutTimelineItem.create({
          data: {
            year: a.year ?? '2026', title: a.title ?? '', description: a.description ?? '',
            iconName: a.iconName ?? 'Sparkles', highlight: a.highlight ?? false,
            order: i,
          },
        })
      }
    }
    results.about = body.about.length
  }

  // Testimonials
  if (Array.isArray(body.testimonials)) {
    await db.testimonial.deleteMany({})
    for (let i = 0; i < body.testimonials.length; i++) {
      const t = body.testimonials[i]
      await db.testimonial.create({
        data: {
          name: t.name ?? '', role: t.role ?? '', company: t.company ?? '',
          quote: t.quote ?? '', initials: t.initials ?? '', color: t.color ?? '#00D084',
          rating: 5, order: i,
        },
      })
    }
    results.testimonials = body.testimonials.length
  }

  revalidateSite()
  return NextResponse.json({ ok: true, migrated: results })
}
