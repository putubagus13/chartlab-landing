// The founder's photo, recoloured to the brand. The original is a plain studio shot on a pale blue-grey backdrop,
// so it is turned into a "gradient map": darks stay near-black, then deep brand green, then mint, then a soft white.
// That ties the backdrop and skin tones to the site's palette. Done with an SVG filter, so the file on disk is untouched
// and the colours follow the theme.

type Rgb = [number, number, number]
const ch = (stops: Rgb[], i: 0 | 1 | 2) => stops.map((s) => (s[i] / 255).toFixed(3)).join(' ')

const LIGHT: Rgb[] = [[10, 10, 10], [18, 66, 50], [150, 205, 180], [244, 250, 247]]
// on the near-black page a bright backdrop would glare, so the top of the ramp stays darker
const DARK: Rgb[] = [[10, 10, 10], [14, 48, 37], [44, 128, 98], [122, 190, 162]]

function Duotone({ id, stops }: { id: string; stops: Rgb[] }) {
  return (
    <filter id={id} colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="table" tableValues={ch(stops, 0)} />
        <feFuncG type="table" tableValues={ch(stops, 1)} />
        <feFuncB type="table" tableValues={ch(stops, 2)} />
      </feComponentTransfer>
    </filter>
  )
}

export function FounderPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <Duotone id="founder-duo-light" stops={LIGHT} />
          <Duotone id="founder-duo-dark" stops={DARK} />
        </defs>
      </svg>
      {/* a soft brand-gradient glow behind the frame */}
      <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[2rem] bg-grad opacity-25 blur-2xl dark:opacity-20" />
      <div className="card-grad relative overflow-hidden p-1.5 [--card-bg:var(--bg)]">
        <img
          src={src}
          alt={alt}
          width={640}
          height={641}
          loading="lazy"
          decoding="async"
          className="block aspect-[4/5] w-full object-cover object-top [filter:url(#founder-duo-light)] dark:[filter:url(#founder-duo-dark)]"
        />
        {/* the photo is cropped at the chest: fade it into the frame instead of ending on a hard edge */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-1.5 bottom-1.5 h-1/4 bg-gradient-to-t from-bg to-transparent" />
      </div>
    </div>
  )
}
