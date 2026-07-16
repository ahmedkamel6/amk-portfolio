'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionHeading } from '../SectionHeading'
import type { Skill } from '@/lib/portfolio/default-content'
import { useIsMobile } from '@/hooks/use-mobile'

const FLOAT_Y = [0, -12, 0, 8, 0]
const FLOAT_X = [0, 6, -4, 2, 0]
const ROTATE = [0, 2, -1, 1, 0]

function FloatingBadge({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "0px 0px -50px 0px" })
  const isMobile = useIsMobile()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: isMobile ? (index % 3) * 0.05 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08, transition: { duration: 0.3 } }}
      className="group relative"
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div
        animate={{ y: FLOAT_Y, x: FLOAT_X, rotate: ROTATE }}
        transition={{ duration: (isMobile ? 18 : 6) + (index % 4), repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        className="relative"
      >
        <div className="absolute -inset-2 rounded-3xl opacity-0 blur-md md:blur-xl transition-opacity duration-500 group-hover:opacity-60" style={{ background: `radial-gradient(circle, ${skill.color}40, transparent 70%)` }} />
        <div className="relative flex flex-col items-center gap-3 rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] px-5 py-6 backdrop-blur-md md:backdrop-blur-xl transition-all duration-500 group-hover:border-emerald-glow/30 group-hover:bg-emerald-glow/[0.03]">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-lg font-bold transition-transform duration-500 group-hover:scale-110"
            style={{
              background: `${skill.color}15`,
              border: `1px solid ${skill.color}40`,
              color: skill.color,
              textShadow: `0 0 12px ${skill.color}80`,
            }}
          >
            {skill.short}
          </div>
          <span className="text-center text-sm font-medium text-[var(--text-primary)]">{skill.name}</span>
          <span className="font-mono-display text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">{skill.category}</span>
          <div className="relative mt-1 h-1 w-16 overflow-hidden rounded-full bg-[var(--border)]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${skill.level}%` } : {}}
              transition={{ duration: 1.2, delay: index * 0.08 + 0.4, ease: 'easeOut' }}
            />
          </div>
          <span className="font-mono-display text-[9px] text-[var(--text-muted)]">{skill.level}%</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Skills({ skills, index = '06' }: { skills: Skill[], index?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, amount: 0.1 })

  return (
    <section id="skills" className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48 contain-paint" style={{ contentVisibility: 'auto' }} ref={containerRef}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-[60vh] w-[40vw] -translate-y-1/2 rounded-full opacity-20 blur-[60px] md:blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 30%, transparent), transparent 70%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading index={index} eyebrow="Toolkit" title={<>Tools of the <span className="text-gradient-emerald">Trade</span></>} description="A floating constellation of the software and disciplines I reach for daily — each one pushed past its defaults." />
        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {skills.map((skill, i) => <FloatingBadge key={skill.id} skill={skill} index={i} />)}
        </div>
        <motion.div className="mt-16 flex items-center justify-center gap-3 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <span className="h-px w-12 bg-emerald-glow/30" />
          <span className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Always learning — the next tool is already on the bench</span>
          <span className="h-px w-12 bg-emerald-glow/30" />
        </motion.div>
      </div>
    </section>
  )
}
