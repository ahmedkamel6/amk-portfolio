/**
 * Default content for the portfolio.
 * Every value here can be overridden at runtime via the Admin Dashboard.
 * Shape is the contract between the store and all section components.
 */

export interface HeroContent {
  name: string
  nameHighlight: string
  eyebrow: string
  badge: string
  roles: string[]
  stats: { value: string; label: string }[]
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export interface ShowreelContent {
  title: string
  titleHighlight: string
  description: string
  duration: string
  year: string
  software: string
  videoTitle: string
  timecode: string
}

export interface Service {
  id: string
  emoji: string
  iconName: string
  title: string
  description: string
  features: string[]
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  tech: string[]
  year: string
  gradient: string
  pattern: 'cinema' | 'product' | 'brand' | 'motion'
  driveUrl?: string | null
  thumbnailUrl?: string | null
}

export interface BeforeAfterContent {
  title: string
  titleHighlight: string
  description: string
  beforeLabel: string
  afterLabel: string
}

export interface WorkflowStep {
  id: string
  number: string
  title: string
  description: string
  iconName: string
  duration: string
}

export interface Skill {
  id: string
  name: string
  short: string
  level: number
  color: string
  category: string
}

export interface AboutContent {
  title: string
  titleHighlight: string
  description: string
  imageUrl?: string | null
  videoUrl?: string | null
  tools: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  initials: string
  color: string
}

export interface ContactContent {
  title: string
  titleHighlight: string
  description: string
  ctaLabel: string
  ctaHref: string
  channels: { id: string; iconName: string; label: string; handle: string; href: string }[]
  footerName: string
  footerTagline: string
  footerCopyright: string
}

export interface ThemeSettings {
  mode: 'dark' | 'light'
  accent: string
  accentSoft: string
  background: string
  particleCount: number
  gridOpacity: number
  glowIntensity: number
  showShowreel?: boolean
  showServices?: boolean
  showProjects?: boolean
  showBeforeAfter?: boolean
  showWorkflow?: boolean
  showSkills?: boolean
  showAbout?: boolean
  showTestimonials?: boolean
  showContact?: boolean
  orderProjects?: number
  orderSkills?: number
  orderAbout?: number
  orderContact?: number
  customLogoUrl?: string | null
}

export interface SiteContent {
  hero: HeroContent
  showreel: ShowreelContent
  services: Service[]
  projects: Project[]
  beforeAfter: BeforeAfterContent
  workflow: WorkflowStep[]
  skills: Skill[]
  about: AboutContent
  testimonials: Testimonial[]
  contact: ContactContent
  theme: ThemeSettings
}

export const defaultContent: SiteContent = {
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
  },
  services: [
    {
      id: 's1',
      emoji: '🎬',
      iconName: 'Film',
      title: 'Video Editing',
      description:
        'Cinematic edits with surgical pacing, sound design, and color science that elevates every frame into a story worth watching on the big screen.',
      features: ['Cinematic Color', 'Sound Design', 'Motion Tracking', 'Multi-cam'],
    },
    {
      id: 's2',
      emoji: '🧊',
      iconName: 'Box',
      title: '3D Design',
      description:
        'Photoreal product visualizations, abstract motion pieces, and immersive worlds built in Blender and Octane — engineered to feel tangible.',
      features: ['Product Viz', 'Character Rig', 'Simulations', 'Look Dev'],
    },
    {
      id: 's3',
      emoji: '🎨',
      iconName: 'Palette',
      title: 'Graphic Design',
      description:
        'Brand systems, posters, social kits and editorial layouts with bold typography and a sharp eye for hierarchy, contrast and rhythm.',
      features: ['Brand Identity', 'Editorial', 'Social Kits', 'Print'],
    },
    {
      id: 's4',
      emoji: '📈',
      iconName: 'TrendingUp',
      title: 'Creative Strategy',
      description:
        'End-to-end campaign thinking — from audience insight to creative direction and channel rollout, balancing art with measurable impact.',
      features: ['Positioning', 'Concepting', 'Art Direction', 'Rollout'],
    },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Echoes of Cairo',
      category: 'Cinematic Short Film',
      description:
        'A 4-minute cinematic short blending live footage with 3D environments. Color-graded in DaVinci, sound designed in Pro Tools.',
      tech: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
      year: '2026',
      gradient: 'from-[#003B2A] via-[#00D084]/40 to-[#0B0B0B]',
      pattern: 'cinema',
    },
    {
      id: 'p2',
      title: 'Aurora Product Launch',
      category: '3D Product Film',
      description:
        'A 60-second hero film for a luxury skincare brand — fully CGI, photoreal materials, simulated liquid dynamics.',
      tech: ['Blender', 'Octane', 'After Effects'],
      year: '2025',
      gradient: 'from-[#001F3F] via-[#00D084]/30 to-[#0B0B0B]',
      pattern: 'product',
    },
    {
      id: 'p3',
      title: 'Lumen Brand System',
      category: 'Brand Identity',
      description:
        'A complete identity system — logo, typography, color, motion guidelines — for an emerging tech studio in Dubai.',
      tech: ['Illustrator', 'Photoshop', 'After Effects'],
      year: '2025',
      gradient: 'from-[#2A0A3F] via-[#00FF9D]/25 to-[#0B0B0B]',
      pattern: 'brand',
    },
    {
      id: 'p4',
      title: 'Pulse — Title Sequence',
      category: 'Motion Graphics',
      description:
        'Opening title sequence for a documentary series. Typographic choreography synced to a custom-composed score.',
      tech: ['After Effects', 'Cinema 4D', 'Premiere Pro'],
      year: '2024',
      gradient: 'from-[#3F0A0A] via-[#FF6B6B]/30 to-[#0B0B0B]',
      pattern: 'motion',
    },
  ],
  beforeAfter: {
    title: 'The Transformation',
    titleHighlight: 'Transformation',
    description:
      'Drag the handle to see the difference raw footage becomes after color grading, sound design, and motion polish.',
    beforeLabel: 'Before',
    afterLabel: 'After',
  },
  workflow: [
    {
      id: 'w1',
      number: '01',
      title: 'Discovery',
      description:
        'We start with a deep conversation. I learn your story, audience, brand voice and the outcome you are chasing — not just the brief, but the why beneath it.',
      iconName: 'Search',
      duration: '1–2 days',
    },
    {
      id: 'w2',
      number: '02',
      title: 'Research',
      description:
        'Mood boards, reference frames, sonic palettes, competitor scan. By the end of this stage you will see a clear creative direction before a single frame is touched.',
      iconName: 'Microscope',
      duration: '2–4 days',
    },
    {
      id: 'w3',
      number: '03',
      title: 'Editing',
      description:
        'The heart of the work. Assembly, sound design, color science, motion — every cut, every transition, every breath is intentional and crafted in real time.',
      iconName: 'Clapperboard',
      duration: '5–10 days',
    },
    {
      id: 'w4',
      number: '04',
      title: 'Feedback',
      description:
        'You review a polished cut. We refine together — two structured rounds ensure the work gets sharper without losing its original spark or momentum.',
      iconName: 'MessageSquare',
      duration: '2–3 days',
    },
    {
      id: 'w5',
      number: '05',
      title: 'Final Delivery',
      description:
        'Master files delivered in every format you need — vertical, square, cinematic, broadcast. Plus a short behind-the-scenes note on the creative choices made.',
      iconName: 'Package',
      duration: '1 day',
    },
  ],
  skills: [
    { id: 'sk1', name: 'Premiere Pro', short: 'Pr', level: 95, color: '#9999FF', category: 'Editing' },
    { id: 'sk2', name: 'After Effects', short: 'Ae', level: 90, color: '#9999FF', category: 'Motion' },
    { id: 'sk3', name: 'Blender', short: 'Bl', level: 85, color: '#FF9D4D', category: '3D' },
    { id: 'sk4', name: 'Photoshop', short: 'Ps', level: 92, color: '#4D9DFF', category: 'Design' },
    { id: 'sk5', name: 'Illustrator', short: 'Ai', level: 88, color: '#FF7D4D', category: 'Design' },
    { id: 'sk6', name: 'DaVinci Resolve', short: 'Dr', level: 82, color: '#4DFFC8', category: 'Color' },
    { id: 'sk7', name: 'CapCut', short: 'Cc', level: 80, color: '#000000', category: 'Mobile' },
    { id: 'sk8', name: 'Media Buying', short: 'Mb', level: 75, color: '#00D084', category: 'Strategy' },
    { id: 'sk9', name: 'Motion Graphics', short: 'Mg', level: 89, color: '#00FF9D', category: 'Motion' },
  ],
  about: {
    title: 'The Journey',
    titleHighlight: 'So Far',
    description: 'From borrowed laptops to brand films — five years of deliberate practice, harder conversations, and work I am finally proud to sign. I am a creative director, 3D artist, and video editor crafting cinematic stories for world-class brands.',
    tools: 'Premiere Pro, After Effects, Photoshop, Illustrator, Blender, DaVinci Resolve',
    imageUrl: null,
    videoUrl: null,
  },
  testimonials: [
    {
      id: 't1',
      name: 'Layla Hassan',
      role: 'Creative Director',
      company: 'Studio Nine',
      quote:
        'Ahmed delivered a brand film that completely shifted how our audience perceives us. The pacing, the color, the sound design — every detail was deliberate. He is the rare editor who thinks like a director.',
      initials: 'LH',
      color: '#00D084',
    },
    {
      id: 't2',
      name: 'Omar Rashid',
      role: 'Founder',
      company: 'Aurora Skincare',
      quote:
        'Our product launch film was 100% CGI and looked more real than reality. Ahmed handled everything from modeling to final grade. The film drove a 38% lift in pre-orders within a week.',
      initials: 'OR',
      color: '#00FF9D',
    },
    {
      id: 't3',
      name: 'Sara Mansour',
      role: 'Marketing Lead',
      company: 'Pulse Network',
      quote:
        'We have worked with editors across three continents. Ahmed is in the top tier. He listens, he pushes back when it matters, and he ships on time without the drama.',
      initials: 'SM',
      color: '#5CFFC1',
    },
    {
      id: 't4',
      name: 'Khaled Aziz',
      role: 'Documentary Producer',
      company: 'Echo Films',
      quote:
        'The title sequence Ahmed designed for our series became its signature. People quote it back to us. That is the power of motion design done right.',
      initials: 'KA',
      color: '#00D084',
    },
    {
      id: 't5',
      name: 'Mona Tarek',
      role: 'Brand Manager',
      company: 'Lumen Labs',
      quote:
        'From identity system to launch film, Ahmed built our entire visual world. Working with him felt less like hiring a freelancer and more like adding a creative partner.',
      initials: 'MT',
      color: '#00FF9D',
    },
  ],
  contact: {
    title: "Let's Create Something",
    titleHighlight: 'Amazing',
    description:
      'Have a project in mind, a brief in hand, or just want to talk craft? I read every message and reply within 24 hours.',
    ctaLabel: 'Start a Conversation',
    ctaHref: 'mailto:hello@ahmedmkamel.com',
    channels: [
      { id: 'c1', iconName: 'Mail', label: 'Email', handle: 'hello@ahmedmkamel.com', href: 'mailto:hello@ahmedmkamel.com' },
      { id: 'c2', iconName: 'Linkedin', label: 'LinkedIn', handle: 'in/ahmedmkamel', href: 'https://www.linkedin.com/in/ahmedmkamel' },
      { id: 'c3', iconName: 'Instagram', label: 'Instagram', handle: '@ahmedmkamel.creative', href: 'https://www.instagram.com/ahmedmkamel.creative' },
      { id: 'c4', iconName: 'MessageCircle', label: 'WhatsApp', handle: '+20 100 000 0000', href: 'https://wa.me/201000000000' },
    ],
    footerName: 'Ahmed Mohamed Kamel',
    footerTagline: 'Video Editor · 3D Artist · Creative Strategist',
    footerCopyright: '© 2026 — Crafted with intention in Cairo',
  },
  theme: {
    mode: 'dark',
    accent: '#00D084',
    accentSoft: '#00FF9D',
    background: '#0B0B0B',
    particleCount: 600,
    gridOpacity: 0.15,
    glowIntensity: 1,
  },
}
