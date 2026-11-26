/**
 * The Disatu mark as a big, faint silhouette, filled with the brand gradient (green into logo yellow).
 * Purely decorative: place it inside a `relative overflow-hidden` parent and size it with `className`.
 * It is a CSS mask over a gradient, so it follows the theme with no second image.
 */
export function BrandSilhouette({ className = '' }: { className?: string }) {
  const mask = "url('/brand/disatu-symbol-black.svg')"
  return (
    <div
      data-brand-silhouette
      aria-hidden="true"
      className={`pointer-events-none absolute bg-grad ${className}`}
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  )
}
