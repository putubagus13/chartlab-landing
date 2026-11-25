import { useContent } from '@/i18n/use-content'
import { Reveal } from '@/components/motion/reveal'

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^\p{L}/u.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ProfileCard() {
  const { about } = useContent()
  return (
    <Reveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      {about.photo ? (
        <img src={about.photo} alt={about.name} width={128} height={128} className="h-32 w-32 rounded-full object-cover ring-2 ring-accent" />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-brand-green font-display text-4xl font-bold text-white ring-2 ring-accent"
        >
          {initialsOf(about.name)}
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{about.name}</h1>
        <p className="mt-1 text-lg text-accent">{about.headline}</p>
        <p className="mt-1 text-sm text-muted">{about.location}</p>
        <p className="mt-4 max-w-2xl text-muted">{about.bio}</p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {about.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-surface"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
