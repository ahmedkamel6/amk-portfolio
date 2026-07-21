import { HomeContent } from '@/components/portfolio/HomeContent'
import { getSiteContent, getFeaturedProjects } from '@/lib/portfolio/db'

// Revalidate at most every 60 seconds, plus on-demand from admin mutations
export const revalidate = 60

export default async function Home() {
  // Fetch all content from DB in parallel (server-side)
  const [content, featuredProjects] = await Promise.all([
    getSiteContent(),
    getFeaturedProjects(),
  ])

  return (
    <HomeContent
      content={content}
      featuredProjects={featuredProjects}
    />
  )
}
