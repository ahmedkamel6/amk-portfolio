import { getProjects, getSiteContent } from '@/lib/portfolio/db'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import { SectionHeading } from '@/components/portfolio/SectionHeading'
import { Navigation } from '@/components/portfolio/sections/Navigation'

export const metadata = {
  title: 'All Projects | AMK Portfolio',
  description: 'A curated selection of cinematic cuts and motion design — optimized for the feed.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const content = await getSiteContent()
  // Limit to 100 as per user request
  const archive = projects.slice(0, 100)
  
  return (
    <>
      <Navigation theme={content.theme} />
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-[60vh] w-[40vw] rounded-full opacity-10 blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }} />
          <div className="absolute inset-0 bg-grid opacity-10" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6">
          <SectionHeading 
            index="ARCHIVE" 
            eyebrow="All Projects" 
            title={<>The <span className="text-gradient-emerald">Reels</span> Archive</>} 
            description="Browse the complete collection of cinematic cuts and motion design." 
          />
          
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 md:gap-5">
            {archive.map((p, i) => (
              <ProjectCard key={p.id} project={p as any} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
