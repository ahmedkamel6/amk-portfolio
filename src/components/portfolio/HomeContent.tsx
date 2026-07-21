import dynamic from 'next/dynamic'
import { Navigation } from '@/components/portfolio/sections/Navigation'
import { Hero } from '@/components/portfolio/sections/Hero'
import type { SiteContent, Project } from '@/lib/portfolio/default-content'
import { HomeProviders } from './HomeProviders'

// ─── Lazy-loaded wrappers (below the fold) ───
// These are dynamically imported with ssr:false so they don't bloat the initial JS bundle.

const ScrollProgress = dynamic(
  () => import('@/components/portfolio/ScrollProgress').then(m => ({ default: m.ScrollProgress }))
)

const AmbientBackground = dynamic(
  () => import('@/components/portfolio/AmbientBackground').then(m => ({ default: m.AmbientBackground }))
)

const Showreel = dynamic(
  () => import('@/components/portfolio/sections/Showreel').then(m => ({ default: m.Showreel })),
  { loading: () => <SectionSkeleton /> }
)

const Services = dynamic(
  () => import('@/components/portfolio/sections/Services').then(m => ({ default: m.Services })),
  { loading: () => <SectionSkeleton /> }
)

const FeaturedProjects = dynamic(
  () => import('@/components/portfolio/sections/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })),
  { loading: () => <SectionSkeleton /> }
)

const BeforeAfter = dynamic(
  () => import('@/components/portfolio/sections/BeforeAfter').then(m => ({ default: m.BeforeAfter })),
  { loading: () => <SectionSkeleton /> }
)

const Workflow = dynamic(
  () => import('@/components/portfolio/sections/Workflow').then(m => ({ default: m.Workflow })),
  { loading: () => <SectionSkeleton /> }
)

const Skills = dynamic(
  () => import('@/components/portfolio/sections/Skills').then(m => ({ default: m.Skills })),
  { loading: () => <SectionSkeleton /> }
)

const About = dynamic(
  () => import('@/components/portfolio/sections/About').then(m => ({ default: m.About })),
  { loading: () => <SectionSkeleton /> }
)

const Testimonials = dynamic(
  () => import('@/components/portfolio/sections/Testimonials').then(m => ({ default: m.Testimonials })),
  { loading: () => <SectionSkeleton /> }
)

const Contact = dynamic(
  () => import('@/components/portfolio/sections/Contact').then(m => ({ default: m.Contact })),
  { loading: () => <SectionSkeleton /> }
)

// Lightweight placeholder while sections load
function SectionSkeleton() {
  return (
    <div
      className="w-full"
      style={{
        minHeight: '60vh',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 60vh',
      }}
    />
  )
}

interface HomeContentProps {
  content: SiteContent & { toolLogos: any[] }
  featuredProjects: Project[]
}

export function HomeContent({ content, featuredProjects }: HomeContentProps) {
  const t = content.theme

  // Auto-numbering logic
  let sectionCount = 0
  const getIndex = () => {
    sectionCount++
    return sectionCount.toString().padStart(2, '0')
  }

  return (
    <HomeProviders>
      <ScrollProgress />
      <AmbientBackground theme={content.theme} />
      <Navigation theme={content.theme} />

      <main className="relative">
        <Hero hero={content.hero} theme={content.theme} />
        {t.showShowreel !== false && <Showreel showreel={content.showreel} index={getIndex()} />}
        {t.showServices !== false && <Services services={content.services} index={getIndex()} />}
        {t.showAbout !== false && <About about={content.about} index={getIndex()} />}
        {t.showProjects !== false && <FeaturedProjects projects={featuredProjects} toolLogos={content.toolLogos} index={getIndex()} />}
        {t.showBeforeAfter !== false && <BeforeAfter beforeAfter={content.beforeAfter} index={getIndex()} />}
        {t.showWorkflow !== false && <Workflow workflow={content.workflow} index={getIndex()} />}
        {t.showSkills !== false && <Skills skills={content.skills} index={getIndex()} />}
        {t.showTestimonials !== false && <Testimonials testimonials={content.testimonials} index={getIndex()} />}
        {t.showContact !== false && <Contact contact={content.contact} index={getIndex()} />}
      </main>
    </HomeProviders>
  )
}
