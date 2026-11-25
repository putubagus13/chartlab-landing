import { motion } from 'framer-motion'
import { AppLink } from './app-link'

type Props = {
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  external?: boolean
  children: React.ReactNode
  className?: string
}

const base =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200'
const variants = {
  primary: 'bg-accent text-on-accent hover:opacity-90',
  secondary: 'bg-fg text-bg hover:opacity-90',
  ghost: 'border border-border text-fg hover:bg-surface',
}

export function LinkButton({ href, variant = 'primary', external, children, className = '' }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`
  return (
    <motion.span className="inline-block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      ) : (
        <AppLink href={href} className={cls}>
          {children}
        </AppLink>
      )}
    </motion.span>
  )
}
