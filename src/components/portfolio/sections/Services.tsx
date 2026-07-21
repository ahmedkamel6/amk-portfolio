'use client'

import { useRef } from 'react'
import { m as motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import { TiltCard } from '../TiltCard'
import { DynamicIcon } from '../DynamicIcon'
import type { Service } from '@/lib/portfolio/default-content'

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <TiltCard className="h-full" max={6} scale={1.01}>
        <div className="relative h-full overflow-hidden rounded-3xl glass-strong p-8 transition-colors duration-500 group-hover:border-emerald-glow/30">
          <div className="absolute right-6 top-6 opacity-0 transition-all duration-500 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5 text-emerald-glow" />
          </div>
          <span className="pointer-events-none absolute -bottom-4 -right-2 font-display text-[7rem] font-bold leading-none text-[var(--text-primary)] opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.06]">
            0{index + 1}
          </span>
          <div className="relative mb-8">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-glow/10 text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
              <DynamicIcon name={service.iconName} className="absolute h-7 w-7 text-emerald-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="transition-opacity duration-300 group-hover:opacity-0">{service.emoji}</span>
              <div className="absolute inset-0 rounded-2xl bg-emerald-glow/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>
          <h3 className="relative font-display text-2xl font-bold text-[var(--text-primary)]">{service.title}</h3>
          <p className="relative mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{service.description}</p>
          <div className="relative mt-6 flex flex-wrap gap-2">
            {service.features.map((f) => (
              <span key={f} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">{f}</span>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-emerald-glow to-transparent transition-all duration-500 group-hover:w-full" />
        </div>
      </TiltCard>
    </motion.div>
  )
}

export function Services({ services, index }: { services: Service[], index?: string }) {
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[50vh] w-[40vw] rounded-full opacity-20 blur-[120px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading index="02" eyebrow="Services" title={<>Crafted With <span className="text-gradient-emerald">Intention</span></>} description="Four disciplines, one creative compass. Every engagement blends cinematic sensibility with strategic rigor." />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}
