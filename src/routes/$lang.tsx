import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import { isLang } from '@/i18n/lang'

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound()
  },
  component: LangLayout,
})

function LangLayout() {
  return (
    <main id="main">
      <Outlet />
    </main>
  )
}
