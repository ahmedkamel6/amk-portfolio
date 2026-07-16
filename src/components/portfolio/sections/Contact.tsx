'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, ArrowUpRight } from 'lucide-react'
import { MagneticButton } from '../MagneticButton'
import { SectionHeading } from '../SectionHeading'
import { DynamicIcon } from '../DynamicIcon'
import type { ContactContent } from '@/lib/portfolio/default-content'

export function Contact({ contact, index = '09' }: { contact: ContactContent, index?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="contact" ref={ref} className="relative w-full overflow-hidden pt-28 pb-32 md:pt-32 md:pb-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 translate-y-1/2 rounded-full opacity-30 blur-[150px]" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--emerald-glow) 20%, transparent), transparent 70%)' }} />
        <div className="absolute inset-0 bg-radial-spotlight opacity-50" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeading index={index} eyebrow="Contact" title={<>{contact.title} <span className="text-gradient-emerald">{contact.titleHighlight}</span></>} description={contact.description} />
        <motion.div className="mt-12 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.3 }}>
          <MagneticButton as="a" href={contact.ctaHref} className="!px-10 !py-6 text-base glow-emerald-strong" strength={0.6}>
            <Mail className="h-5 w-5" />
            {contact.ctaLabel}
          </MagneticButton>
        </motion.div>
        <motion.div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.5 }}>
          {contact.channels.map((ch, i) => (
            <motion.a
              key={ch.id || i}
              href={ch.href}
              target={ch.href.startsWith('http') ? '_blank' : undefined}
              rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0d0f14] to-[#3a4559] p-6 backdrop-blur-xl transition-all duration-500 hover:border-emerald-glow/30 hover:bg-emerald-glow/[0.03]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-transparent text-emerald-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <DynamicIcon name={ch.iconName} className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition-all duration-500 group-hover:rotate-0 group-hover:text-emerald-glow" />
              </div>
              <div className="mt-6">
                <div className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">{ch.label}</div>
                <div className="mt-2 text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-emerald-glow">{ch.handle}</div>
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-emerald-glow to-transparent transition-all duration-700 group-hover:w-full" />
            </motion.a>
          ))}
        </motion.div>
        <motion.div className="mt-24 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-12 text-center" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 1 }}>
          <p className="font-display text-2xl font-bold text-gradient-white">{contact.footerName}</p>
          <p className="font-mono-display text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">{contact.footerTagline}</p>
          <p className="mt-4 font-mono-display text-[10px] text-[var(--text-muted)]">{contact.footerCopyright}</p>
        </motion.div>
      </div>
    </section>
  )
}
