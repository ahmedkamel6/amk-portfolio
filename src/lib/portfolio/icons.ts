'use client'

import {
  Film,
  Box,
  Palette,
  TrendingUp,
  Search,
  Microscope,
  Clapperboard,
  MessageSquare,
  Package,
  Sparkles,
  Briefcase,
  Award,
  Rocket,
  Mail,
  Linkedin,
  Instagram,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'

/**
 * Icon registry. Maps string names (used by the admin dashboard) to Lucide components.
 * Exported as a stable object so consumers can read components without calling
 * a function during render (which would trip the react-hooks/static-components rule).
 */
export const ICONS: Record<string, LucideIcon> = {
  Film,
  Box,
  Palette,
  TrendingUp,
  Search,
  Microscope,
  Clapperboard,
  MessageSquare,
  Package,
  Sparkles,
  Briefcase,
  Award,
  Rocket,
  Mail,
  Linkedin,
  Instagram,
  MessageCircle,
}

export const ICON_NAMES = Object.keys(ICONS)

export const DEFAULT_ICON: LucideIcon = Sparkles
