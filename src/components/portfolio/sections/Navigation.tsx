'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import type { ThemeSettings } from '@/lib/portfolio/default-content'

export function Navigation({ theme }: { theme: ThemeSettings }) {
  const rawLinks = [
    ...(theme.showProjects !== false ? [{ label: 'Work', href: '#projects', order: theme.orderProjects ?? 1 }] : []),
    ...(theme.showSkills !== false ? [{ label: 'Skills', href: '#skills', order: theme.orderSkills ?? 2 }] : []),
    ...(theme.showAbout !== false ? [{ label: 'About', href: '#about', order: theme.orderAbout ?? 3 }] : []),
    ...(theme.showContact !== false ? [{ label: 'Contact', href: '#contact', order: theme.orderContact ?? 4 }] : []),
  ]

  const links = rawLinks.sort((a, b) => a.order - b.order)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40)
  })

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close menu on route change to clear scroll locks
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[9990] flex justify-center px-4 pt-4 pointer-events-none"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.6 }}
      >
        <motion.nav
          className="flex items-center justify-between gap-6 rounded-full px-6 py-3 transition-all duration-500 pointer-events-auto"
          style={{
            background: scrolled
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
              : 'transparent',
            backdropFilter: scrolled ? 'blur(20px) saturate(150%)' : 'none',
            border: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {/* Logo */}
          <Link
            href={pathname === '/' ? '#home' : '/'}
            data-cursor="hover"
            className="flex items-center justify-center gap-2"
            aria-label="Home"
          >
            <svg width="0" height="0" className="absolute">
              <filter id="iceBlueColorize">
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.415
                          0 0 0 0 0.486
                          0 0 0 0 0.603
                          0 0 0 1 0"
                />
              </filter>
            </svg>
            <Image
              src="/logo.png"
              alt="Ahmed Kamel Logo"
              width={120}
              height={36}
              priority
              style={{ filter: 'url(#iceBlueColorize)' }}
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={pathname === '/' ? link.href : '/' + link.href}
                data-cursor="hover"
                className="rounded-full px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:text-emerald-glow"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href={pathname === '/' ? '#contact' : '/#contact'}
              data-cursor="hover"
              className="hidden rounded-full glass-emerald px-5 py-2 text-xs font-medium text-emerald-glow transition-colors hover:text-[var(--text-primary)] md:block"
            >
              Let&apos;s Talk
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9989] flex flex-col items-center justify-center gap-6 bg-[var(--background)]/95 backdrop-blur-xl md:hidden pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-radial-spotlight opacity-50" />
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={pathname === '/' ? link.href : '/' + link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl font-bold text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href={pathname === '/' ? '#contact' : '/#contact'}
                onClick={() => setOpen(false)}
                className="mt-6 inline-block rounded-full glass-emerald px-8 py-3 text-sm font-medium text-emerald-glow"
              >
                Let&apos;s Talk
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
