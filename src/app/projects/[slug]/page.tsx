import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { getProjectBySlug, getRelatedProjects, getToolLogos } from '@/lib/portfolio/db'
import { ProjectDetailPage } from '@/components/portfolio/ProjectDetailPage'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  return {
    title: `${project.title} — Project`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Ahmed Mohamed Kamel`,
      description: project.shortDescription,
      type: 'website',
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Ahmed Mohamed Kamel`,
      description: project.shortDescription,
      images: project.coverImage ? [project.coverImage] : [],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    notFound()
  }
  const related = await getRelatedProjects(slug, project.category, 3)
  const toolLogos = await getToolLogos()

  return <ProjectDetailPage project={project} related={related} toolLogos={toolLogos} />
}
