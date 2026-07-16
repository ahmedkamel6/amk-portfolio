import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Default content values — mirrors src/lib/portfolio/default-content.ts
// Keeping them inline so the seed script is self-contained.
const defaults = {
  hero: {
    name: 'Ahmed Mohamed',
    nameHighlight: 'Kamel',
    eyebrow: 'Creative Director Portfolio',
    badge: 'Available for Projects · 2026',
    roles: ['Video Editor', '3D Artist', 'Graphic Designer', 'Creative Strategist'],
    stats: [
      { value: '120+', label: 'Projects Delivered' },
      { value: '45+', label: 'Happy Clients' },
      { value: '4Y', label: 'Creative Practice' },
    ],
    primaryCta: { label: 'View My Work', href: '#showreel' },
    secondaryCta: { label: "Let's Talk", href: '#contact' },
  },
  showreel: {
    title: 'The Reel',
    titleHighlight: '2026',
    description:
      'A curated montage of the past year — cinematic edits, 3D motion, brand films and color-graded commercials. Press play to enter.',
    duration: '02:48',
    year: '2026',
    software: 'Premiere · After Effects · DaVinci',
    videoTitle: 'Cinematic Stories, Crafted Frame by Frame',
    timecode: 'REC · 4K · 24FPS',
    videoUrl: null as string | null,
  },
  services: [
    { emoji: '🎬', iconName: 'Film', title: 'Video Editing', description: 'Cinematic edits with surgical pacing, sound design, and color science that elevates every frame into a story worth watching on the big screen.', features: ['Cinematic Color', 'Sound Design', 'Motion Tracking', 'Multi-cam'] },
    { emoji: '🧊', iconName: 'Box', title: '3D Design', description: 'Photoreal product visualizations, abstract motion pieces, and immersive worlds built in Blender and Octane — engineered to feel tangible.', features: ['Product Viz', 'Character Rig', 'Simulations', 'Look Dev'] },
    { emoji: '🎨', iconName: 'Palette', title: 'Graphic Design', description: 'Brand systems, posters, social kits and editorial layouts with bold typography and a sharp eye for hierarchy, contrast and rhythm.', features: ['Brand Identity', 'Editorial', 'Social Kits', 'Print'] },
    { emoji: '📈', iconName: 'TrendingUp', title: 'Creative Strategy', description: 'End-to-end campaign thinking — from audience insight to creative direction and channel rollout, balancing art with measurable impact.', features: ['Positioning', 'Concepting', 'Art Direction', 'Rollout'] },
  ],
  projects: [
    {
      title: 'Echoes of Cairo',
      slug: 'echoes-of-cairo',
      category: 'Cinematic Short Film',
      shortDescription: 'A 4-minute cinematic short blending live footage with 3D environments.',
      fullDescription: 'A 4-minute cinematic short blending live footage with 3D environments. Color-graded in DaVinci, sound designed in Pro Tools. The film explores the layered textures of Cairo at dawn — from the call of the muezzin to the rhythm of the souk, woven into a meditative visual poem.',
      gradient: 'from-[#003B2A] via-[#00D084]/40 to-[#0B0B0B]',
      pattern: 'cinema',
      toolsUsed: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
      year: '2026',
      duration: '04:12',
      client: 'Echo Films',
      videoUrl: null as string | null,
      coverImage: null as string | null,
      gallery: [] as string[],
      beforeAfter: {} as Record<string, string>,
      featured: true,
    },
    {
      title: 'Aurora Product Launch',
      slug: 'aurora-product-launch',
      category: '3D Product Film',
      shortDescription: 'A 60-second hero film for a luxury skincare brand — fully CGI.',
      fullDescription: 'A 60-second hero film for a luxury skincare brand — fully CGI, photoreal materials, simulated liquid dynamics. Every frame was rendered in Octane at 4K, with custom shaders developed for the glass bottle and the silk backdrop.',
      gradient: 'from-[#001F3F] via-[#00D084]/30 to-[#0B0B0B]',
      pattern: 'product',
      toolsUsed: ['Blender', 'Octane', 'After Effects'],
      year: '2025',
      duration: '01:00',
      client: 'Aurora Skincare',
      videoUrl: null as string | null,
      coverImage: null as string | null,
      gallery: [] as string[],
      beforeAfter: {} as Record<string, string>,
      featured: true,
    },
    {
      title: 'Lumen Brand System',
      slug: 'lumen-brand-system',
      category: 'Brand Identity',
      shortDescription: 'A complete identity system for an emerging tech studio in Dubai.',
      fullDescription: 'A complete identity system — logo, typography, color, motion guidelines — for an emerging tech studio in Dubai. The work spanned print, digital, and a launch film that introduced the brand to investors and the press.',
      gradient: 'from-[#2A0A3F] via-[#00FF9D]/25 to-[#0B0B0B]',
      pattern: 'brand',
      toolsUsed: ['Illustrator', 'Photoshop', 'After Effects'],
      year: '2025',
      duration: null,
      client: 'Lumen Labs',
      videoUrl: null as string | null,
      coverImage: null as string | null,
      gallery: [] as string[],
      beforeAfter: {} as Record<string, string>,
      featured: true,
    },
    {
      title: 'Pulse — Title Sequence',
      slug: 'pulse-title-sequence',
      category: 'Motion Graphics',
      shortDescription: 'Opening title sequence for a documentary series.',
      fullDescription: 'Opening title sequence for a documentary series. Typographic choreography synced to a custom-composed score. The sequence became the visual signature of the series, quoted back to us by viewers across social media.',
      gradient: 'from-[#3F0A0A] via-[#FF6B6B]/30 to-[#0B0B0B]',
      pattern: 'motion',
      toolsUsed: ['After Effects', 'Cinema 4D', 'Premiere Pro'],
      year: '2024',
      duration: '00:45',
      client: 'Pulse Network',
      videoUrl: null as string | null,
      coverImage: null as string | null,
      gallery: [] as string[],
      beforeAfter: {} as Record<string, string>,
      featured: true,
    },
  ],
  beforeAfter: {
    title: 'The Transformation',
    titleHighlight: 'Transformation',
    description: 'Drag the handle to see the difference raw footage becomes after color grading, sound design, and motion polish.',
    beforeLabel: 'Before',
    afterLabel: 'After',
  },
  workflow: [
    { number: '01', title: 'Discovery', description: 'We start with a deep conversation. I learn your story, audience, brand voice and the outcome you are chasing — not just the brief, but the why beneath it.', iconName: 'Search', duration: '1–2 days' },
    { number: '02', title: 'Research', description: 'Mood boards, reference frames, sonic palettes, competitor scan. By the end of this stage you will see a clear creative direction before a single frame is touched.', iconName: 'Microscope', duration: '2–4 days' },
    { number: '03', title: 'Editing', description: 'The heart of the work. Assembly, sound design, color science, motion — every cut, every transition, every breath is intentional and crafted in real time.', iconName: 'Clapperboard', duration: '5–10 days' },
    { number: '04', title: 'Feedback', description: 'You review a polished cut. We refine together — two structured rounds ensure the work gets sharper without losing its original spark or momentum.', iconName: 'MessageSquare', duration: '2–3 days' },
    { number: '05', title: 'Final Delivery', description: 'Master files delivered in every format you need — vertical, square, cinematic, broadcast. Plus a short behind-the-scenes note on the creative choices made.', iconName: 'Package', duration: '1 day' },
  ],
  skills: [
    { name: 'Premiere Pro', short: 'Pr', level: 95, color: '#9999FF', category: 'Editing' },
    { name: 'After Effects', short: 'Ae', level: 90, color: '#9999FF', category: 'Motion' },
    { name: 'Blender', short: 'Bl', level: 85, color: '#FF9D4D', category: '3D' },
    { name: 'Photoshop', short: 'Ps', level: 92, color: '#4D9DFF', category: 'Design' },
    { name: 'Illustrator', short: 'Ai', level: 88, color: '#FF7D4D', category: 'Design' },
    { name: 'DaVinci Resolve', short: 'Dr', level: 82, color: '#4DFFC8', category: 'Color' },
    { name: 'CapCut', short: 'Cc', level: 80, color: '#000000', category: 'Mobile' },
    { name: 'Media Buying', short: 'Mb', level: 75, color: '#00D084', category: 'Strategy' },
    { name: 'Motion Graphics', short: 'Mg', level: 89, color: '#00FF9D', category: 'Motion' },
  ],
  about: [
    { year: '2022', title: 'Started Editing', description: 'Picked up Premiere Pro on a borrowed laptop. Cut my teeth on short-form YouTube content and learned the rhythm of storytelling one frame at a time.', iconName: 'Sparkles', highlight: false },
    { year: '2023', title: 'Professional Freelance Work', description: 'Took on my first paid clients — wedding films, brand intros, real-estate walkthroughs. Built a system for delivery, feedback and versioning that still serves me today.', iconName: 'Briefcase', highlight: false },
    { year: '2024', title: 'Expanded into 3D', description: 'Added Blender and Octane to the toolkit. Began blending live-action with CGI — product launches, title sequences, abstract motion pieces that felt impossible a year earlier.', iconName: 'Box', highlight: false },
    { year: '2025', title: 'Creative Projects', description: 'Directed my first brand film. Collaborated with agencies across the Gulf and North Africa. Won a regional mention for motion design and started mentoring two junior editors.', iconName: 'Award', highlight: true },
    { year: '2026', title: 'Building a Personal Brand', description: 'Launching this portfolio, a YouTube channel, and a creative studio in Cairo. The goal: become the editor creative directors in the region think of first.', iconName: 'Rocket', highlight: true },
  ],
  testimonials: [
    { name: 'Layla Hassan', role: 'Creative Director', company: 'Studio Nine', quote: 'Ahmed delivered a brand film that completely shifted how our audience perceives us. The pacing, the color, the sound design — every detail was deliberate. He is the rare editor who thinks like a director.', initials: 'LH', color: '#00D084' },
    { name: 'Omar Rashid', role: 'Founder', company: 'Aurora Skincare', quote: 'Our product launch film was 100% CGI and looked more real than reality. Ahmed handled everything from modeling to final grade. The film drove a 38% lift in pre-orders within a week.', initials: 'OR', color: '#00FF9D' },
    { name: 'Sara Mansour', role: 'Marketing Lead', company: 'Pulse Network', quote: 'We have worked with editors across three continents. Ahmed is in the top tier. He listens, he pushes back when it matters, and he ships on time without the drama.', initials: 'SM', color: '#5CFFC1' },
    { name: 'Khaled Aziz', role: 'Documentary Producer', company: 'Echo Films', quote: 'The title sequence Ahmed designed for our series became its signature. People quote it back to us. That is the power of motion design done right.', initials: 'KA', color: '#00D084' },
    { name: 'Mona Tarek', role: 'Brand Manager', company: 'Lumen Labs', quote: 'From identity system to launch film, Ahmed built our entire visual world. Working with him felt less like hiring a freelancer and more like adding a creative partner.', initials: 'MT', color: '#00FF9D' },
  ],
  contact: {
    title: "Let's Create Something",
    titleHighlight: 'Amazing',
    description: 'Have a project in mind, a brief in hand, or just want to talk craft? I read every message and reply within 24 hours.',
    ctaLabel: 'Start a Conversation',
    ctaHref: 'mailto:hello@ahmedmkamel.com',
    footerName: 'Ahmed Mohamed Kamel',
    footerTagline: 'Video Editor · 3D Artist · Creative Strategist',
    footerCopyright: '© 2026 — Crafted with intention in Cairo',
    channels: [
      { iconName: 'Mail', label: 'Email', handle: 'hello@ahmedmkamel.com', href: 'mailto:hello@ahmedmkamel.com' },
      { iconName: 'Linkedin', label: 'LinkedIn', handle: 'in/ahmedmkamel', href: 'https://www.linkedin.com/in/ahmedmkamel' },
      { iconName: 'Instagram', label: 'Instagram', handle: '@ahmedmkamel.creative', href: 'https://www.instagram.com/ahmedmkamel.creative' },
      { iconName: 'MessageCircle', label: 'WhatsApp', handle: '+20 100 000 0000', href: 'https://wa.me/201000000000' },
    ],
  },
  appearance: {
    mode: 'dark',
    accent: '#00D084',
    accentSoft: '#00FF9D',
    background: '#0B0B0B',
    particleCount: 600,
    gridOpacity: 0.15,
    glowIntensity: 1,
  },
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Admin user setup is now handled via the /api/auth/setup endpoint

  // 2. Hero (singleton)
  await prisma.heroContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: defaults.hero.name,
      nameHighlight: defaults.hero.nameHighlight,
      eyebrow: defaults.hero.eyebrow,
      badge: defaults.hero.badge,
      roles: defaults.hero.roles.join(', '),
      statsJson: JSON.stringify(defaults.hero.stats),
      primaryCtaLabel: defaults.hero.primaryCta.label,
      primaryCtaHref: defaults.hero.primaryCta.href,
      secondaryCtaLabel: defaults.hero.secondaryCta.label,
      secondaryCtaHref: defaults.hero.secondaryCta.href,
    },
  })
  console.log('  ✓ Hero content')

  // 3. Showreel (singleton)
  await prisma.showreelContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: defaults.showreel.title,
      titleHighlight: defaults.showreel.titleHighlight,
      description: defaults.showreel.description,
      duration: defaults.showreel.duration,
      year: defaults.showreel.year,
      software: defaults.showreel.software,
      videoTitle: defaults.showreel.videoTitle,
      timecode: defaults.showreel.timecode,
      videoUrl: defaults.showreel.videoUrl,
    },
  })
  console.log('  ✓ Showreel content')

  // 4. Services
  await prisma.service.deleteMany({})
  for (let i = 0; i < defaults.services.length; i++) {
    const s = defaults.services[i]
    await prisma.service.create({
      data: {
        emoji: s.emoji,
        iconName: s.iconName,
        title: s.title,
        description: s.description,
        features: s.features.join(', '),
        order: i,
      },
    })
  }
  console.log(`  ✓ ${defaults.services.length} services`)

  // 5. Projects
  await prisma.project.deleteMany({})
  for (let i = 0; i < defaults.projects.length; i++) {
    const p = defaults.projects[i]
    await prisma.project.create({
      data: {
        slug: p.slug || slugify(p.title),
        title: p.title,
        category: p.category,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        gradient: p.gradient,
        pattern: p.pattern,
        toolsUsed: p.toolsUsed.join(', '),
        year: p.year,
        duration: p.duration,
        client: p.client,
        videoUrl: p.videoUrl,
        coverImage: p.coverImage,
        galleryJson: JSON.stringify(p.gallery),
        beforeAfterJson: JSON.stringify(p.beforeAfter),
        featured: p.featured,
        order: i,
      },
    })
  }
  console.log(`  ✓ ${defaults.projects.length} projects`)

  // 6. BeforeAfter (singleton)
  await prisma.beforeAfterContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: defaults.beforeAfter.title,
      titleHighlight: defaults.beforeAfter.titleHighlight,
      description: defaults.beforeAfter.description,
      beforeLabel: defaults.beforeAfter.beforeLabel,
      afterLabel: defaults.beforeAfter.afterLabel,
    },
  })
  console.log('  ✓ Before/After content')

  // 7. Workflow
  await prisma.workflowStep.deleteMany({})
  for (let i = 0; i < defaults.workflow.length; i++) {
    const w = defaults.workflow[i]
    await prisma.workflowStep.create({
      data: {
        number: w.number,
        title: w.title,
        description: w.description,
        iconName: w.iconName,
        duration: w.duration,
        order: i,
      },
    })
  }
  console.log(`  ✓ ${defaults.workflow.length} workflow steps`)

  // 8. Skills
  await prisma.skill.deleteMany({})
  for (let i = 0; i < defaults.skills.length; i++) {
    const s = defaults.skills[i]
    await prisma.skill.create({
      data: {
        name: s.name,
        short: s.short,
        level: s.level,
        color: s.color,
        category: s.category,
        order: i,
      },
    })
  }
  console.log(`  ✓ ${defaults.skills.length} skills`)

  // 9. About (singleton)
  await prisma.aboutContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: 'The Journey',
      titleHighlight: 'So Far',
      description: 'I am a creative director and video editor.',
      tools: 'Premiere Pro, After Effects, Photoshop, Blender',
    },
  })
  console.log(`  ✓ About content`)

  // 10. Testimonials
  await prisma.testimonial.deleteMany({})
  for (let i = 0; i < defaults.testimonials.length; i++) {
    const t = defaults.testimonials[i]
    await prisma.testimonial.create({
      data: {
        name: t.name,
        role: t.role,
        company: t.company,
        quote: t.quote,
        initials: t.initials,
        color: t.color,
        rating: 5,
        order: i,
      },
    })
  }
  console.log(`  ✓ ${defaults.testimonials.length} testimonials`)

  // 11. Contact (singleton)
  await prisma.contactInfo.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      title: defaults.contact.title,
      titleHighlight: defaults.contact.titleHighlight,
      description: defaults.contact.description,
      ctaLabel: defaults.contact.ctaLabel,
      ctaHref: defaults.contact.ctaHref,
      footerName: defaults.contact.footerName,
      footerTagline: defaults.contact.footerTagline,
      footerCopyright: defaults.contact.footerCopyright,
      channelsJson: JSON.stringify(defaults.contact.channels),
    },
  })
  console.log('  ✓ Contact info')

  // 12. Appearance (singleton)
  await prisma.appearanceSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      ...defaults.appearance,
    },
  })
  console.log('  ✓ Appearance settings')

  console.log('\n✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
