import { SmoothScroll } from '@/components/portfolio/SmoothScroll'
import { LoadingScreen } from '@/components/portfolio/LoadingScreen'
import { ScrollProgress } from '@/components/portfolio/ScrollProgress'
import { AmbientBackground } from '@/components/portfolio/AmbientBackground'
import { Navigation } from '@/components/portfolio/sections/Navigation'
import { Hero } from '@/components/portfolio/sections/Hero'
import { Showreel } from '@/components/portfolio/sections/Showreel'
import { Services } from '@/components/portfolio/sections/Services'
import { FeaturedProjects } from '@/components/portfolio/sections/FeaturedProjects'
import { BeforeAfter } from '@/components/portfolio/sections/BeforeAfter'
import { Workflow } from '@/components/portfolio/sections/Workflow'
import { Skills } from '@/components/portfolio/sections/Skills'
import { About } from '@/components/portfolio/sections/About'
import { Testimonials } from '@/components/portfolio/sections/Testimonials'
import { Contact } from '@/components/portfolio/sections/Contact'
import { getSiteContent, getFeaturedProjects } from '@/lib/portfolio/db'

// Revalidate at most every 60 seconds, plus on-demand from admin mutations
export const revalidate = 60

export default async function Home() {
  // Fetch all content from DB in parallel
  const [content, featuredProjects] = await Promise.all([
    getSiteContent(),
    getFeaturedProjects(),
  ])

  const t = content.theme

  // Auto-numbering logic
  let sectionCount = 0
  const getIndex = () => {
    sectionCount++
    return sectionCount.toString().padStart(2, '0')
  }

  return (
    <SmoothScroll>
      <LoadingScreen />
      <ScrollProgress />
      <AmbientBackground theme={content.theme} />
      <Navigation theme={content.theme} />

      <main className="relative">
        <Hero hero={content.hero} theme={content.theme} />
        {t.showShowreel !== false && <Showreel showreel={content.showreel} index={getIndex()} />}
        {t.showServices !== false && <Services services={content.services} index={getIndex()} />}
        {t.showProjects !== false && <FeaturedProjects projects={featuredProjects} toolLogos={content.toolLogos} index={getIndex()} />}
        {t.showBeforeAfter !== false && <BeforeAfter beforeAfter={content.beforeAfter} index={getIndex()} />}
        {t.showWorkflow !== false && <Workflow workflow={content.workflow} index={getIndex()} />}
        {t.showSkills !== false && <Skills skills={content.skills} index={getIndex()} />}
        {t.showAbout !== false && <About about={content.about} index={getIndex()} />}
        {t.showTestimonials !== false && <Testimonials testimonials={content.testimonials} index={getIndex()} />}
        {t.showContact !== false && <Contact contact={content.contact} index={getIndex()} />}
      </main>
    </SmoothScroll>
  )
}
