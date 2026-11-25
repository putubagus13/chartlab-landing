import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'

export const Route = createFileRoute('/$lang/about')({
  head: () => ({ links: alternateLinks('/about') }),
  component: () => <div>about</div>,
})
