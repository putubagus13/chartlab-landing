import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}
