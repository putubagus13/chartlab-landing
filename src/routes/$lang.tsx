import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import { isLang } from '@/i18n/lang'
import { useContent } from '@/i18n/use-content'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { CursorTubes } from '@/components/ui/cursor-tubes'

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound()
  },
  component: LangLayout,
})

function LangLayout() {
  const { ui } = useContent()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        {ui.skipToContent}
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
      <CursorTubes />
    </>
  )
}
