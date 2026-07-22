import { getSiteContent } from '@/lib/portfolio/db'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import { SectionHeading } from '@/components/portfolio/SectionHeading'
import { Navigation } from '@/components/portfolio/sections/Navigation'
import { SmoothScroll } from '@/components/portfolio/SmoothScroll'
import { AmbientBackground } from '@/components/portfolio/AmbientBackground'

export const metadata = {
  title: 'All Projects | AMK Portfolio',
  description: 'A curated selection of cinematic cuts and motion design — optimized for the feed.',
}

export const revalidate = 60

export default async function ProjectsPage() {
  const content = await getSiteContent()
  const projects = content.projects
  const t = content.theme
  
  // Categorization Logic
  const archive3d = projects.filter(p => p.category?.toLowerCase()?.includes('3d') || p.category?.toLowerCase()?.includes('blender'))
  const archiveTimeline = projects.filter(p => p.category?.toLowerCase()?.includes('timeline') || p.category?.toLowerCase()?.includes('long'))
  const archiveReels = projects.filter(p => !archive3d.some(a => a.id === p.id) && !archiveTimeline.some(a => a.id === p.id))
  
  return (
    <SmoothScroll>
      <AmbientBackground theme={content.theme} />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-radial-spotlight" />
        <div className="absolute inset-0 bg-noise opacity-30" />
      </div>
      <Navigation theme={content.theme} />
      <main className="min-h-screen pt-32 pb-24 relative z-10 flex flex-col gap-24">
        
        {/* REELS ARCHIVE */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <SectionHeading 
            index="ARCHIVE" 
            eyebrow="All Projects" 
            title={<>The <span className="text-gradient-emerald">Reels</span> Archive</>} 
            description="Browse the complete collection of cinematic cuts and motion design." 
          />
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 md:gap-5">
            {archiveReels.map((p, i) => (
              <ProjectCard key={p.id} project={p as any} toolLogos={content.toolLogos} index={i} />
            ))}
          </div>
        </div>

        {/* 3D ARCHIVE */}
        {t.showArchive3D && archive3d.length > 0 && (
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
            <SectionHeading 
              index="3D ART" 
              eyebrow="Specialized Work" 
              title={<>The <span className="text-gradient-emerald">3D</span> Archive</>} 
              description="Immersive three-dimensional environments, products, and motion graphics." 
            />
            <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 md:gap-5">
              {archive3d.map((p, i) => (
                <ProjectCard key={p.id} project={p as any} toolLogos={content.toolLogos} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE ARCHIVE */}
        {t.showArchiveTimeline && archiveTimeline.length > 0 && (
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
            <SectionHeading 
              index="LONGFORM" 
              eyebrow="Timeline Masters" 
              title={<>The <span className="text-gradient-emerald">Timeline</span> Archive</>} 
              description="Extensive edits, documentaries, and narrative-driven sequences." 
            />
            <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 md:gap-5">
              {archiveTimeline.map((p, i) => (
                <ProjectCard key={p.id} project={p as any} toolLogos={content.toolLogos} index={i} />
              ))}
            </div>
          </div>
        )}

      </main>
    </SmoothScroll>
  )
}
