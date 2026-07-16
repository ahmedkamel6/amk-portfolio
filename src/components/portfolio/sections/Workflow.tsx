'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SectionHeading } from '../SectionHeading'
import { DynamicIcon } from '../DynamicIcon'
import type { WorkflowStep } from '@/lib/portfolio/default-content'
import { useIsMobile } from '@/hooks/use-mobile'

const STEP_PULSE_ANIM = { scale: [1, 1.6], opacity: [0.6, 0] }

function StepItem({ step, index }: { step: WorkflowStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const isMobile = useIsMobile()
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
      <div className="absolute left-4 top-2 z-20 md:left-1/2 md:-translate-x-1/2">
        <motion.div
          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-emerald-glow/30 bg-[var(--background)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-glow glow-emerald" />
          <motion.span className="absolute inset-0 rounded-full border border-emerald-glow/40" animate={STEP_PULSE_ANIM} transition={{ duration: isMobile ? 6 : 2, repeat: Infinity, delay: index * 0.3 }} />
        </motion.div>
      </div>
      <motion.div
        className={`pl-16 md:pl-0 ${isEven ? 'md:col-start-1 md:text-right' : 'md:col-start-2 md:col-end-3'}`}
        initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <div className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] p-7 backdrop-blur-md md:backdrop-blur-xl transition-all duration-500 hover:border-emerald-glow/30 hover:bg-emerald-glow/[0.03]">
          <div className={`mb-5 flex items-center gap-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-glow/10 text-emerald-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <DynamicIcon name={step.iconName} className="h-5 w-5" />
            </div>
            <div className={isEven ? 'md:text-right' : ''}>
              <div className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">Step {step.number}</div>
              <div className="font-mono-display text-[10px] text-emerald-glow/60">{step.duration}</div>
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] md:text-3xl">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
          <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-glow to-transparent transition-all duration-700 group-hover:w-full" />
        </div>
      </motion.div>
    </div>
  )
}

export function Workflow({ workflow, index = '05' }: { workflow: WorkflowStep[], index?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, amount: 0.1 })

  return (
    <section id="process" className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48" ref={containerRef}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[80vh] w-[40vw] -translate-x-1/2 rounded-full opacity-25 blur-[60px] md:blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading index={index} eyebrow="Workflow" title={<>How the <span className="text-gradient-emerald">Magic</span> Happens</>} description="A deliberate five-step process designed to keep you in the loop from first call to final master." />
        <div className="relative mt-24">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-glow/30 to-transparent md:left-1/2 md:-translate-x-1/2" />
          <div className="flex flex-col gap-16 md:gap-24">
            {workflow.map((step, i) => <StepItem key={step.id} step={step} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
