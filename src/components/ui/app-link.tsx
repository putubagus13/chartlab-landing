import { Link } from '@tanstack/react-router'

type AppLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
  'aria-label'?: string
}

// Internal link from a "/path#hash" string; client-side navigation.
export function AppLink({ href, children, ...rest }: AppLinkProps) {
  const [to, hash] = href.split('#')
  return (
    <Link to={to as '/'} hash={hash || undefined} {...rest}>
      {children}
    </Link>
  )
}
