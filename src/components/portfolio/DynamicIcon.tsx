'use client'

import { ICONS, DEFAULT_ICON } from '@/lib/portfolio/icons'

/**
 * Render a Lucide icon by name.
 * Avoids calling resolveIcon() during render (which trips the
 * react-hooks/static-components lint rule).
 */
export function DynamicIcon({
  name,
  className,
  ...rest
}: {
  name: string
  className?: string
} & React.SVGProps<SVGSVGElement>) {
  const Icon = ICONS[name] || DEFAULT_ICON
  return <Icon className={className} {...rest} />
}
