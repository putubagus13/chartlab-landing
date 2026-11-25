import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'
import { getContent } from '@/content'
import { isLang } from '@/i18n/lang'
import { useContent, useLang } from '@/i18n/use-content'
import { ProfileCard } from '@/components/about/profile-card'
import { ExperienceTimeline } from '@/components/about/experience-timeline'
import { LinkButton } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'

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
  const lang = useLang()
  const { about, ui } = useContent()
  return (
    <>
      <section className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ProfileCard />
        </div>
      </section>
      <section className="bg-bg py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <h2 className="text-2xl font-bold">{ui.skillsTitle}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {about.skills.map((s) => (
                <li key={s} className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <div>
            <h2 className="mb-8 text-2xl font-bold">{ui.experienceTitle}</h2>
            <ExperienceTimeline items={about.experiences} />
          </div>
        </div>
      </section>
      <section className="bg-bg pb-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <LinkButton href={`/${lang}#ebook`}>{ui.aboutCta}</LinkButton>
        </div>
      </section>
    </>
  )
}
