import { db } from '@/lib/db'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type {
  HeroContent,
  ShowreelContent,
  Service,
  Project,
  BeforeAfterContent,
  WorkflowStep,
  Skill,
  Testimonial,
  ContactContent,
  ThemeSettings,
} from '@/lib/portfolio/default-content'

/**
 * Data access layer.
 * All reads from the public site go through these functions.
 * Wrapped in React.cache() to deduplicate queries within the same render cycle.
 */

const _getHero = async (): Promise<HeroContent> => {
  const row = await db.heroContent.findUnique({ where: { id: 'singleton' } })
  if (!row) throw new Error('Hero content not seeded')
  return {
    name: row.name,
    nameHighlight: row.nameHighlight,
    eyebrow: row.eyebrow,
    badge: row.badge,
    roles: row.roles.split(',').map((r) => r.trim()).filter(Boolean),
    stats: JSON.parse(row.statsJson) as { value: string; label: string }[],
    primaryCta: { label: row.primaryCtaLabel, href: row.primaryCtaHref },
    secondaryCta: { label: row.secondaryCtaLabel, href: row.secondaryCtaHref },
  }
}

const _getShowreel = async (): Promise<ShowreelContent> => {
  const row = await db.showreelContent.findUnique({ where: { id: 'singleton' } })
  if (!row) {
    return {
      title: "",
      titleHighlight: "",
      description: "",
      duration: "",
      year: "",
      software: "",
      videoTitle: "",
      timecode: "",
      videoUrl: null
    }
  }
  return {
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    duration: row.duration,
    year: row.year,
    software: row.software,
    videoTitle: row.videoTitle,
    timecode: row.timecode,
  }
}

const _getServices = async (): Promise<Service[]> => {
  const rows = await db.service.findMany({ orderBy: { order: 'asc' } })
  return rows.map((r) => ({
    id: r.id,
    emoji: r.emoji,
    iconName: r.iconName,
    title: r.title,
    description: r.description,
    features: r.features.split(',').map((f) => f.trim()).filter(Boolean),
  }))
}

export interface ProjectDetail extends Project {
  slug: string
  fullDescription: string
  duration: string | null
  client: string | null
  videoUrl: string | null
  coverImage: string | null
  gallery: string[]
  beforeAfter: { before?: string; after?: string }
  featured: boolean
}

const _getProjects = async (): Promise<ProjectDetail[]> => {
  const rows = await db.project.findMany({ orderBy: { order: 'asc' } })
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    shortDescription: r.shortDescription,
    fullDescription: r.fullDescription,
    toolsUsed: r.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean),
    year: r.year,
    gradient: r.gradient,
    pattern: r.pattern as Project['pattern'],
    duration: r.duration,
    client: r.client,
    videoUrl: r.videoUrl,
    coverImage: r.coverImage?.startsWith('data:image') ? `/api/project-image/${r.slug}?type=cover` : r.coverImage,
    driveUrl: r.driveUrl,
    thumbnailUrl: r.thumbnailUrl?.startsWith('data:image') ? `/api/project-image/${r.slug}?type=thumbnail` : r.thumbnailUrl,
    gallery: JSON.parse(r.galleryJson) as string[],
    beforeAfter: JSON.parse(r.beforeAfterJson) as { before?: string; after?: string },
    featured: r.featured,
  }))
}

const _getFeaturedProjects = async (): Promise<ProjectDetail[]> => {
  const all = await _getProjects()
  return all.filter((p) => p.featured)
}

const _getProjectBySlug = async (slug: string): Promise<ProjectDetail | null> => {
  const r = await db.project.findUnique({ where: { slug } })
  if (!r) return null
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    shortDescription: r.shortDescription,
    fullDescription: r.fullDescription,
    toolsUsed: r.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean),
    year: r.year,
    gradient: r.gradient,
    pattern: r.pattern as Project['pattern'],
    duration: r.duration,
    client: r.client,
    videoUrl: r.videoUrl,
    coverImage: r.coverImage?.startsWith('data:image') ? `/api/project-image/${r.slug}?type=cover` : r.coverImage,
    driveUrl: r.driveUrl,
    thumbnailUrl: r.thumbnailUrl?.startsWith('data:image') ? `/api/project-image/${r.slug}?type=thumbnail` : r.thumbnailUrl,
    gallery: JSON.parse(r.galleryJson) as string[],
    beforeAfter: JSON.parse(r.beforeAfterJson) as { before?: string; after?: string },
    featured: r.featured,
  }
}

const _getRelatedProjects = async (slug: string, category: string, limit = 3): Promise<ProjectDetail[]> => {
  // First try same category
  let rows = await db.project.findMany({
    where: { category, slug: { not: slug }, featured: true },
    orderBy: { order: 'asc' },
    take: limit,
  })
  // Fallback: any other featured project
  if (rows.length === 0) {
    rows = await db.project.findMany({
      where: { slug: { not: slug }, featured: true },
      orderBy: { order: 'asc' },
      take: limit,
    })
  }
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    description: r.shortDescription,
    shortDescription: r.shortDescription,
    fullDescription: r.fullDescription,
    tech: r.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean),
    toolsUsed: r.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean),
    year: r.year,
    gradient: r.gradient,
    pattern: r.pattern as Project['pattern'],
    duration: r.duration,
    client: r.client,
    videoUrl: r.videoUrl,
    coverImage: r.coverImage?.startsWith('data:image') ? `/api/project-image/${r.slug}?type=cover` : r.coverImage,
    driveUrl: r.driveUrl,
    thumbnailUrl: r.thumbnailUrl?.startsWith('data:image') ? `/api/project-image/${r.slug}?type=thumbnail` : r.thumbnailUrl,
    gallery: JSON.parse(r.galleryJson) as string[],
    beforeAfter: JSON.parse(r.beforeAfterJson) as { before?: string; after?: string },
    featured: r.featured,
  }))
}

const _getBeforeAfter = async (): Promise<BeforeAfterContent> => {
  const row = await db.beforeAfterContent.findUnique({ where: { id: 'singleton' } })
  if (!row) throw new Error('BeforeAfter content not seeded')
  return {
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    beforeLabel: row.beforeLabel,
    afterLabel: row.afterLabel,
  }
}

const _getWorkflow = async (): Promise<WorkflowStep[]> => {
  const rows = await db.workflowStep.findMany({ orderBy: { order: 'asc' } })
  return rows.map((r) => ({
    id: r.id,
    number: r.number,
    title: r.title,
    description: r.description,
    iconName: r.iconName,
    duration: r.duration,
  }))
}

const _getSkills = async (): Promise<Skill[]> => {
  const rows = await db.skill.findMany({ orderBy: { order: 'asc' } })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    short: r.short,
    level: r.level,
    color: r.color,
    category: r.category,
  }))
}

const _getAboutContent = async () => {
  const row = await db.aboutContent.findUnique({
    where: { id: 'singleton' },
  })
  if (!row) return { 
    title: 'The Journey', 
    titleHighlight: 'So Far', 
    description: 'From borrowed laptops to brand films — five years of deliberate practice, harder conversations, and work I am finally proud to sign. I am a creative director, 3D artist, and video editor crafting cinematic stories for world-class brands.', 
    tools: 'Premiere Pro, After Effects, Photoshop, Illustrator, Blender, DaVinci Resolve', 
    imageUrl: null, 
    videoUrl: null 
  }
  return row
}

const _getTestimonials = async (): Promise<Testimonial[]> => {
  const rows = await db.testimonial.findMany({ orderBy: { order: 'asc' } })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    company: r.company,
    quote: r.quote,
    initials: r.initials,
    color: r.color,
  }))
}

const _getContact = async (): Promise<ContactContent> => {
  const row = await db.contactInfo.findUnique({ where: { id: 'singleton' } })
  if (!row) throw new Error('Contact info not seeded')
  const channels = JSON.parse(row.channelsJson) as { id: string; iconName: string; label: string; handle: string; href: string }[]
  return {
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    channels,
    footerName: row.footerName,
    footerTagline: row.footerTagline,
    footerCopyright: row.footerCopyright,
  }
}

const _getAppearance = async (): Promise<ThemeSettings> => {
  const row = await db.appearanceSettings.findUnique({ where: { id: 'singleton' } })
  if (!row) throw new Error('Appearance settings not seeded')
  return {
    mode: row.mode as 'dark' | 'light',
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
    showArchive3D: (row as any).showArchive3D ?? true,
    showArchiveTimeline: (row as any).showArchiveTimeline ?? true,
  }
}

const _getToolLogos = async () => {
  const rows = await db.toolLogo.findMany()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl,
  }))
}

// -----------------------------------------------------------------------------
// EXPORTS (WRAPPED IN REACT.CACHE)
// Deduplicates identical queries executed in the same request/render pass.
// -----------------------------------------------------------------------------

export const getHero = cache(_getHero)
export const getShowreel = cache(_getShowreel)
export const getServices = cache(_getServices)
export const getProjects = cache(_getProjects)
export const getFeaturedProjects = cache(_getFeaturedProjects)
export const getProjectBySlug = cache(_getProjectBySlug)
export const getRelatedProjects = cache(_getRelatedProjects)
export const getBeforeAfter = cache(_getBeforeAfter)
export const getWorkflow = cache(_getWorkflow)
export const getSkills = cache(_getSkills)
export const getAboutContent = cache(_getAboutContent)
export const getTestimonials = cache(_getTestimonials)
export const getContact = cache(_getContact)
export const getAppearance = cache(_getAppearance)
export const getToolLogos = cache(_getToolLogos)

/** 
 * Fetch all site content. 
 * Sequential execution limits connection usage to exactly 1 database connection 
 * at a time, preventing Neon from hitting connection limits during build.
 */
const _getSiteContent = async () => {
  const hero = await _getHero()
  const showreel = await _getShowreel()
  const services = await _getServices()
  const projects = await _getProjects()
  const beforeAfter = await _getBeforeAfter()
  const workflow = await _getWorkflow()
  const skills = await _getSkills()
  const about = await _getAboutContent()
  const testimonials = await _getTestimonials()
  const contact = await _getContact()
  const appearance = await _getAppearance()
  const toolLogos = await _getToolLogos()
  
  return { 
    hero, showreel, services, projects, beforeAfter, 
    workflow, skills, about, testimonials, contact, 
    theme: appearance, toolLogos 
  }
}

// Wrap getSiteContent in unstable_cache for cross-worker sharing
// since it represents the global layout content and rarely changes.
export const getSiteContent = unstable_cache(
  _getSiteContent,
  ['global-site-content'],
  { revalidate: 60, tags: ['site-content'] }
)
