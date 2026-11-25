type LogoProps = {
  variant?: 'horizontal' | 'symbol'
  onDark?: boolean
  className?: string
  alt?: string
}

export function Logo({ variant = 'horizontal', onDark = false, className = '', alt = 'Disatu' }: LogoProps) {
  const base = `/brand/disatu-${variant}`
  const size = variant === 'horizontal' ? 'h-auto w-28' : 'h-8 w-8'
  if (onDark) {
    return <img src={`${base}-white.svg`} alt={alt} className={`${size} ${className}`} />
  }
  return (
    <>
      <img src={`${base}-black.svg`} alt={alt} className={`${size} dark:hidden ${className}`} />
      <img src={`${base}-white.svg`} alt={alt} className={`${size} hidden dark:block ${className}`} />
    </>
  )
}
