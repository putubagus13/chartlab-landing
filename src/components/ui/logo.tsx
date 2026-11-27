type LogoProps = {
  className?: string
  alt?: string
}

// The ChartLab horizontal logo from chartlab-brand-kit: colour on light, reverse on dark (w-32 = 128 px, kit minimum 110 px).
export function Logo({ className = '', alt = 'ChartLab' }: LogoProps) {
  const size = 'h-auto w-32'
  return (
    <>
      <img src="/brand/chartlab-horizontal-color.svg" alt={alt} className={`${size} dark:hidden ${className}`} />
      <img src="/brand/chartlab-horizontal-reverse-transparent.svg" alt={alt} className={`${size} hidden dark:block ${className}`} />
    </>
  )
}
