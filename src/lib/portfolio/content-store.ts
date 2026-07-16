'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  defaultContent,
  type SiteContent,
  type HeroContent,
  type ShowreelContent,
  type Service,
  type Project,
  type BeforeAfterContent,
  type WorkflowStep,
  type Skill,
  type Milestone,
  type Testimonial,
  type ContactContent,
  type ThemeSettings,
} from './default-content'

interface ContentStore extends SiteContent {
  // Section updates
  setHero: (patch: Partial<HeroContent>) => void
  setShowreel: (patch: Partial<ShowreelContent>) => void
  setBeforeAfter: (patch: Partial<BeforeAfterContent>) => void
  setContact: (patch: Partial<ContactContent>) => void

  // CRUD for collections
  upsertService: (item: Service) => void
  removeService: (id: string) => void
  reorderServices: (ids: string[]) => void

  upsertProject: (item: Project) => void
  removeProject: (id: string) => void

  upsertWorkflowStep: (item: WorkflowStep) => void
  removeWorkflowStep: (id: string) => void

  upsertSkill: (item: Skill) => void
  removeSkill: (id: string) => void

  upsertMilestone: (item: Milestone) => void
  removeMilestone: (id: string) => void

  upsertTestimonial: (item: Testimonial) => void
  removeTestimonial: (id: string) => void

  // Theme
  setTheme: (patch: Partial<ThemeSettings>) => void
  toggleTheme: () => void

  // Bulk operations
  importContent: (content: Partial<SiteContent>) => void
  exportContent: () => SiteContent
  resetAll: () => void
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id)
  if (idx === -1) return [...list, item]
  const next = [...list]
  next[idx] = { ...next[idx], ...item }
  return next
}

function remove<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id)
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      ...defaultContent,

      setHero: (patch) => set((s) => ({ hero: { ...s.hero, ...patch } })),
      setShowreel: (patch) => set((s) => ({ showreel: { ...s.showreel, ...patch } })),
      setBeforeAfter: (patch) => set((s) => ({ beforeAfter: { ...s.beforeAfter, ...patch } })),
      setContact: (patch) => set((s) => ({ contact: { ...s.contact, ...patch } })),

      upsertService: (item) => set((s) => ({ services: upsert(s.services, item) })),
      removeService: (id) => set((s) => ({ services: remove(s.services, id) })),
      reorderServices: (ids) =>
        set((s) => ({
          services: ids
            .map((id) => s.services.find((x) => x.id === id))
            .filter(Boolean) as Service[],
        })),

      upsertProject: (item) => set((s) => ({ projects: upsert(s.projects, item) })),
      removeProject: (id) => set((s) => ({ projects: remove(s.projects, id) })),

      upsertWorkflowStep: (item) => set((s) => ({ workflow: upsert(s.workflow, item) })),
      removeWorkflowStep: (id) => set((s) => ({ workflow: remove(s.workflow, id) })),

      upsertSkill: (item) => set((s) => ({ skills: upsert(s.skills, item) })),
      removeSkill: (id) => set((s) => ({ skills: remove(s.skills, id) })),

      upsertMilestone: (item) => set((s) => ({ about: upsert(s.about, item) })),
      removeMilestone: (id) => set((s) => ({ about: remove(s.about, id) })),

      upsertTestimonial: (item) => set((s) => ({ testimonials: upsert(s.testimonials, item) })),
      removeTestimonial: (id) => set((s) => ({ testimonials: remove(s.testimonials, id) })),

      setTheme: (patch) => set((s) => ({ theme: { ...s.theme, ...patch } })),
      toggleTheme: () =>
        set((s) => {
          const newMode = s.theme.mode === 'dark' ? 'light' : 'dark'
          // When toggling modes, also swap to sensible default background + accent
          // if the user hasn't customized them away from the defaults.
          const isDarkDefault = s.theme.background === '#0B0B0B'
          const isLightDefault = s.theme.background === '#F7F7F5'
          let patch: Partial<ThemeSettings> = { mode: newMode }
          if (newMode === 'light' && isDarkDefault) {
            patch.background = '#F7F7F5'
            patch.accent = '#00A86A'
            patch.accentSoft = '#00C781'
          } else if (newMode === 'dark' && isLightDefault) {
            patch.background = '#0B0B0B'
            patch.accent = '#00D084'
            patch.accentSoft = '#00FF9D'
          }
          return { theme: { ...s.theme, ...patch } }
        }),

      importContent: (content) =>
        set((s) => ({
          ...s,
          ...content,
          theme: { ...s.theme, ...(content.theme || {}) },
        })),

      exportContent: () => {
        const s = get()
        const { setHero, setShowreel, setBeforeAfter, setContact, setTheme, toggleTheme,
          upsertService, removeService, reorderServices, upsertProject, removeProject,
          upsertWorkflowStep, removeWorkflowStep, upsertSkill, removeSkill,
          upsertMilestone, removeMilestone, upsertTestimonial, removeTestimonial,
          importContent, exportContent, resetAll, ...data } = s
        return data as SiteContent
      },

      resetAll: () => set({ ...defaultContent }),
    }),
    {
      name: 'amk-portfolio-content',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
