import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'

export const Route = createFileRoute('/$lang/')({
  head: () => ({ links: alternateLinks('') }),
  component: () => <div>landing</div>,
})
