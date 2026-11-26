import { ACCENT_PATH, MARK_PATH, VIEWBOX_MARK, VIEWBOX_WIDE, WORDMARK_PATH, WORDMARK_X, WORDMARK_Y } from './disatu-logo-paths'

/**
 * The animated Disatu logo, adapted from the logo kit's DisatuLoader ("assemble" variant). The "D" pops in, the
 * yellow accent flies to its corner and locks with a small knock, then the wordmark slides in, and it holds.
 * Colours follow the site theme (--fg for the body, logo yellow for the accent). Styles: styles.css, ".dsl-*".
 */
export function DisatuLoader({ withWordmark = true, className = '' }: { withWordmark?: boolean; className?: string }) {
  return (
    <svg className={`dsl-svg ${className}`} viewBox={withWordmark ? VIEWBOX_WIDE : VIEWBOX_MARK} aria-hidden="true" focusable="false">
      <path className="dsl-y" d={ACCENT_PATH} />
      <path className="dsl-g" d={MARK_PATH} />
      {withWordmark && (
        <g transform={`translate(${WORDMARK_X} ${WORDMARK_Y})`}>
          <path className="dsl-w" d={WORDMARK_PATH} />
        </g>
      )}
    </svg>
  )
}
