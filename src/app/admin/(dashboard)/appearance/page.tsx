'use client'

import { AdminPageHeader, Field, AdminCard } from '@/components/admin/ui'
import { useSingleton } from '@/lib/portfolio/use-api'
import { Sun, Moon, Check } from 'lucide-react'
import type { ThemeSettings } from '@/lib/portfolio/default-content'

const ACCENT_PRESETS = [
  { name: 'Emerald', accent: '#00D084', soft: '#00FF9D', bg: '#0B0B0B' },
  { name: 'Cyan', accent: '#06B6D4', soft: '#22D3EE', bg: '#0B0B0B' },
  { name: 'Violet', accent: '#8B5CF6', soft: '#A78BFA', bg: '#0B0B0B' },
  { name: 'Rose', accent: '#F43F5E', soft: '#FB7185', bg: '#0B0B0B' },
  { name: 'Amber', accent: '#F59E0B', soft: '#FBBF24', bg: '#0B0B0B' },
  { name: 'Lime', accent: '#84CC16', soft: '#A3E635', bg: '#0B0B0B' },
]

const LIGHT_PRESETS = [
  { name: 'Pearl', accent: '#00A86A', soft: '#00C781', bg: '#F7F7F5' },
  { name: 'Cream', accent: '#00A86A', soft: '#00C781', bg: '#FAF8F2' },
  { name: 'Cool Gray', accent: '#0EA5E9', soft: '#38BDF8', bg: '#F1F5F9' },
  { name: 'Warm', accent: '#D97706', soft: '#F59E0B', bg: '#FFFBEB' },
]

export default function AdminAppearancePage() {
  const { data: theme, update, loading } = useSingleton<ThemeSettings>('/api/appearance')
  if (loading || !theme) return <div className="text-[var(--text-muted)]">Loading...</div>

  const isDark = theme.mode === 'dark'
  const presets = isDark ? ACCENT_PRESETS : LIGHT_PRESETS

  const setMode = async (newMode: 'dark' | 'light') => {
    let patch: Partial<ThemeSettings> = { mode: newMode }
    if (newMode === 'light' && theme.background === '#0B0B0B') {
      patch.background = '#F7F7F5'
      patch.accent = '#00A86A'
      patch.accentSoft = '#00C781'
    } else if (newMode === 'dark' && theme.background === '#F7F7F5') {
      patch.background = '#0B0B0B'
      patch.accent = '#00D084'
      patch.accentSoft = '#00FF9D'
    }
    await update(patch)
    // Reload to apply theme globally (server components need refresh)
    window.location.reload()
  }

  return (
    <>
      <AdminPageHeader title="Appearance" description="Control the visual identity. Theme is stored in the database and applied server-side." />

      <AdminCard className="mb-6">
        <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Theme Mode</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => !isDark && setMode('dark')}
            className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${
              isDark ? 'border-emerald-glow/40 bg-emerald-glow/[0.04]' : 'border-[var(--border)] hover:border-[var(--text-muted)]'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <Moon className="h-5 w-5 text-emerald-glow" />
              {isDark && <Check className="h-4 w-4 text-emerald-glow" />}
            </div>
            <div className="font-display text-lg font-bold text-[var(--text-primary)]">Dark</div>
            <div className="text-xs text-[var(--text-muted)]">Premium cinematic feel</div>
            <div className="mt-4 h-16 rounded-lg" style={{ background: 'linear-gradient(135deg, #0B0B0B, #1a1a1a, #00D08420)' }} />
          </button>
          <button
            onClick={() => isDark && setMode('light')}
            className={`relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${
              !isDark ? 'border-emerald-glow/40 bg-emerald-glow/[0.04]' : 'border-[var(--border)] hover:border-[var(--text-muted)]'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <Sun className="h-5 w-5 text-emerald-glow" />
              {!isDark && <Check className="h-4 w-4 text-emerald-glow" />}
            </div>
            <div className="font-display text-lg font-bold text-[var(--text-primary)]">Light</div>
            <div className="text-xs text-[var(--text-muted)]">Clean editorial look</div>
            <div className="mt-4 h-16 rounded-lg" style={{ background: 'linear-gradient(135deg, #F7F7F5, #FFFFFF, #00A86A20)' }} />
          </button>
        </div>
      </AdminCard>

      <AdminCard className="mb-6">
        <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Accent Color Presets</h3>
        <p className="mb-4 text-xs text-[var(--text-muted)]">Click to apply. Custom colors available below.</p>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {presets.map((preset) => {
            const active = theme.accent.toLowerCase() === preset.accent.toLowerCase()
            return (
              <button
                key={preset.name}
                onClick={() => update({ accent: preset.accent, accentSoft: preset.soft, background: preset.bg })}
                className={`group relative overflow-hidden rounded-2xl border p-3 transition-all ${
                  active ? 'border-emerald-glow/40' : 'border-[var(--border)] hover:border-[var(--text-muted)]'
                }`}
              >
                <div className="h-12 w-full rounded-lg" style={{ background: `linear-gradient(135deg, ${preset.accent}, ${preset.soft})` }} />
                <div className="mt-2 text-center text-[10px] font-medium text-[var(--text-secondary)]">{preset.name}</div>
                {active && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-glow text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Custom Colors</h3>
          <div className="space-y-4">
            <Field label="Accent Color">
              <div className="flex items-center gap-3">
                <input type="color" defaultValue={theme.accent} onChange={(e) => update({ accent: e.target.value })} className="h-10 w-16" />
                <input className="admin-input font-mono-display text-xs" defaultValue={theme.accent} onChange={(e) => update({ accent: e.target.value })} />
              </div>
            </Field>
            <Field label="Accent Soft (gradient end)">
              <div className="flex items-center gap-3">
                <input type="color" defaultValue={theme.accentSoft} onChange={(e) => update({ accentSoft: e.target.value })} className="h-10 w-16" />
                <input className="admin-input font-mono-display text-xs" defaultValue={theme.accentSoft} onChange={(e) => update({ accentSoft: e.target.value })} />
              </div>
            </Field>
            <Field label="Background Color">
              <div className="flex items-center gap-3">
                <input type="color" defaultValue={theme.background} onChange={(e) => update({ background: e.target.value })} className="h-10 w-16" />
                <input className="admin-input font-mono-display text-xs" defaultValue={theme.background} onChange={(e) => update({ background: e.target.value })} />
              </div>
            </Field>
          </div>
        </AdminCard>
        <AdminCard>
          <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Effects</h3>
          <div className="space-y-5">
            <Field label={`Particle Count: ${theme.particleCount}`} hint="Floating particles in the hero background.">
              <input type="range" min={0} max={1500} step={50} defaultValue={theme.particleCount} onChange={(e) => update({ particleCount: Number(e.target.value) })} />
            </Field>
            <Field label={`Glow Intensity: ${theme.glowIntensity.toFixed(2)}x`} hint="Multiplier for all glow effects.">
              <input type="range" min={0} max={2} step={0.1} defaultValue={theme.glowIntensity} onChange={(e) => update({ glowIntensity: Number(e.target.value) })} />
            </Field>
            <Field label={`Grid Opacity: ${Math.round(theme.gridOpacity * 100)}%`} hint="Opacity of the ambient grid.">
              <input type="range" min={0} max={0.5} step={0.05} defaultValue={theme.gridOpacity} onChange={(e) => update({ gridOpacity: Number(e.target.value) })} />
            </Field>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-6">
        <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Custom Branding</h3>
        <Field label="Custom Logo URL (PNG)" hint="Provide a direct link to a transparent PNG. If set, it replaces the text logo 'AK' in the Navbar.">
          <input
            className="admin-input"
            placeholder="https://example.com/logo.png"
            defaultValue={theme.customLogoUrl || ''}
            onChange={(e) => update({ customLogoUrl: e.target.value })}
          />
        </Field>
      </AdminCard>

      <AdminCard className="mt-6">
        <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Navbar Ordering</h3>
        <p className="mb-4 text-xs text-[var(--text-muted)]">Set the order for the 4 main navigation links. Lower numbers appear first.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Field label="Work (Projects) Order">
            <input type="number" className="admin-input" defaultValue={theme.orderProjects ?? 1} onChange={(e) => update({ orderProjects: parseInt(e.target.value) || 1 })} />
          </Field>
          <Field label="Skills Order">
            <input type="number" className="admin-input" defaultValue={theme.orderSkills ?? 2} onChange={(e) => update({ orderSkills: parseInt(e.target.value) || 2 })} />
          </Field>
          <Field label="About Order">
            <input type="number" className="admin-input" defaultValue={theme.orderAbout ?? 3} onChange={(e) => update({ orderAbout: parseInt(e.target.value) || 3 })} />
          </Field>
          <Field label="Contact Order">
            <input type="number" className="admin-input" defaultValue={theme.orderContact ?? 4} onChange={(e) => update({ orderContact: parseInt(e.target.value) || 4 })} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard className="mt-6">
        <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">Section Visibility</h3>
        <p className="mb-4 text-xs text-[var(--text-muted)]">Toggle which sections appear on the homepage. Numbers will automatically adjust.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[
            { id: 'showShowreel', label: 'Showreel' },
            { id: 'showServices', label: 'Services' },
            { id: 'showProjects', label: 'Featured Projects' },
            { id: 'showBeforeAfter', label: 'Before / After' },
            { id: 'showWorkflow', label: 'Workflow' },
            { id: 'showSkills', label: 'Skills' },
            { id: 'showAbout', label: 'About Me' },
            { id: 'showTestimonials', label: 'Testimonials' },
            { id: 'showContact', label: 'Contact' },
          ].map((sec) => (
            <label key={sec.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-emerald-glow/30">
              <input
                type="checkbox"
                defaultChecked={theme[sec.id as keyof ThemeSettings] !== false}
                onChange={(e) => update({ [sec.id]: e.target.checked })}
                className="h-4 w-4 rounded border-[var(--border)] bg-transparent text-emerald-glow focus:ring-emerald-glow/50"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">{sec.label}</span>
            </label>
          ))}
        </div>
      </AdminCard>
    </>
  )
}
