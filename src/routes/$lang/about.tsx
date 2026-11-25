import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'
import { getContent } from '@/content'
import { isLang } from '@/i18n/lang'
import { useContent } from '@/i18n/use-content'
import { ProfileCard } from '@/components/about/profile-card'
import { ExperienceTimeline } from '@/components/about/experience-timeline'
import { LinkButton } from '@/components/ui/button'
import { ServicesSection } from '@/components/sections/services-section'
import { Reveal } from '@/components/motion/reveal'
import { Brackets, SectionShell } from '@/components/ui/frame'

export const Route = createFileRoute('/$lang/about')({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : 'id'
    const { meta } = getContent(lang)
    return {
      meta: [
        { title: meta.aboutTitle },
        { name: 'description', content: meta.aboutDescription },
        { property: 'og:title', content: meta.aboutTitle },
        { property: 'og:description', content: meta.aboutDescription },
        { property: 'og:locale', content: lang === 'id' ? 'id_ID' : 'en_US' },
      ],
      links: alternateLinks('/about'),
    }
  },
  component: About,
})

function About() {
  const { about, ui, backtest } = useContent()
  return (
    <>
      <SectionShell id="profile" bg="warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ProfileCard />
        </div>
      </SectionShell>

      <ServicesSection />

      <SectionShell id="details" bg="dots" edge="none">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Reveal>
              <h2 className="text-2xl font-bold">{ui.skillsTitle}</h2>
              <div className="mt-6 space-y-6">
                {about.skills.map((g) => (
                  <div key={g.group}>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">{g.group}</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li key={item} className="rounded-full border border-border bg-bg px-3 py-1.5 text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="mb-8 text-2xl font-bold">{ui.experienceTitle}</h2>
              <ExperienceTimeline items={about.experiences} />
            </div>
            <Reveal>
              <h2 className="text-2xl font-bold">{ui.educationTitle}</h2>
              <ul className="mt-6 space-y-4">
                {about.education.map((e) => (
                  <li key={`${e.school}-${e.degree}`} className="relative border border-border bg-bg p-5">
                    <Brackets />
                    <p className="font-semibold">{e.degree}</p>
                    <p className="text-sm text-muted">{e.school}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-4xl px-4 text-center sm:px-6">
          <LinkButton href={backtest.appUrl} external>
            {ui.aboutCta}
          </LinkButton>
        </div>
      </SectionShell>
    </>
  )
}
