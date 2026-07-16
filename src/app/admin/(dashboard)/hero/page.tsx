'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useSingleton } from '@/lib/portfolio/use-api'
import type { HeroContent } from '@/lib/portfolio/default-content'

export default function AdminHeroPage() {
  const { data: hero, update, loading } = useSingleton<HeroContent>('/api/hero')

  if (loading || !hero) return <div className="text-[var(--text-muted)]">Loading...</div>

  return (
    <>
      <AdminPageHeader
        title="Hero Section"
        description="The first thing visitors see. Changes save instantly to the database."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="space-y-5">
            <Field label="Eyebrow">
              <input className="admin-input" defaultValue={hero.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
            </Field>
            <Field label="Badge Text">
              <input className="admin-input" defaultValue={hero.badge} onChange={(e) => update({ badge: e.target.value })} />
            </Field>
            <Field label="Name — Line 1" hint="Renders in white">
              <input className="admin-input" defaultValue={hero.name} onChange={(e) => update({ name: e.target.value })} />
            </Field>
            <Field label="Name — Line 2 (Highlight)" hint="Renders in emerald gradient with glow">
              <input className="admin-input" defaultValue={hero.nameHighlight} onChange={(e) => update({ nameHighlight: e.target.value })} />
            </Field>
            <Field label="Primary CTA — Label">
              <input className="admin-input" defaultValue={hero.primaryCta.label} onChange={(e) => update({ primaryCta: { ...hero.primaryCta, label: e.target.value } })} />
            </Field>
            <Field label="Primary CTA — Link">
              <input className="admin-input" defaultValue={hero.primaryCta.href} onChange={(e) => update({ primaryCta: { ...hero.primaryCta, href: e.target.value } })} />
            </Field>
            <Field label="Secondary CTA — Label">
              <input className="admin-input" defaultValue={hero.secondaryCta.label} onChange={(e) => update({ secondaryCta: { ...hero.secondaryCta, label: e.target.value } })} />
            </Field>
            <Field label="Secondary CTA — Link">
              <input className="admin-input" defaultValue={hero.secondaryCta.href} onChange={(e) => update({ secondaryCta: { ...hero.secondaryCta, href: e.target.value } })} />
            </Field>
          </div>
        </AdminCard>
        <div className="space-y-6">
          <AdminCard>
            <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Roles</h3>
            <p className="mb-4 text-xs text-[var(--text-muted)]">Comma-separated list of roles shown under the name.</p>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={hero.roles.join(', ')}
              onChange={(e) => update({ roles: e.target.value.split(',').map((r) => r.trim()).filter(Boolean) })}
            />
          </AdminCard>
          <AdminCard>
            <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Stats Strip</h3>
            <div className="space-y-3">
              {hero.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <Field label={`Stat ${i + 1} — Value`}>
                    <input
                      className="admin-input"
                      defaultValue={stat.value}
                      onChange={(e) => {
                        const next = [...hero.stats]
                        next[i] = { ...stat, value: e.target.value }
                        update({ stats: next })
                      }}
                    />
                  </Field>
                  <Field label={`Stat ${i + 1} — Label`}>
                    <input
                      className="admin-input"
                      defaultValue={stat.label}
                      onChange={(e) => {
                        const next = [...hero.stats]
                        next[i] = { ...stat, label: e.target.value }
                        update({ stats: next })
                      }}
                    />
                  </Field>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  )
}
