import { describe, it, expect } from 'vitest'
import { fireEvent, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

describe.each(LANGS)('WorkflowSection %s', (lang) => {
  const c = getContent(lang)
  const w = c.workflow
  async function section() {
    return waitFor(() => {
      const el = document.getElementById('workflow')
      if (!el) throw new Error('no workflow section')
      return el
    })
  }

  it('lists the five stages in the right order', () => {
    expect(w.steps.map((s) => s.id)).toEqual(['learn', 'system', 'backtest', 'live', 'profit'])
    expect(w.steps[0].points.map((p) => p.label)).toHaveLength(3)
  })

  it('renders heading, ordered rail, and starts on step 1', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    expect(within(sec).getByRole('heading', { level: 2, name: w.title })).toBeInTheDocument()
    const ol = sec.querySelector('ol') as HTMLElement
    expect(within(ol).getAllByRole('listitem')).toHaveLength(5)
    const first = within(ol).getByRole('button', { name: new RegExp(w.steps[0].label) })
    expect(first).toHaveAttribute('aria-current', 'step')
    expect(within(sec).getByRole('heading', { level: 3, name: w.steps[0].title })).toBeInTheDocument()
    const list = sec.querySelector('#workflow-panel ul') as HTMLElement
    for (const p of w.steps[0].points) expect(within(list).getByText(p.label)).toBeInTheDocument()
  })

  it('switches the detail panel when a stage is chosen', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    const ol = sec.querySelector('ol') as HTMLElement
    fireEvent.click(within(ol).getByRole('button', { name: new RegExp(w.steps[2].label) }))
    expect(within(sec).getByRole('heading', { level: 3, name: w.steps[2].title })).toBeInTheDocument()
    expect(within(sec).queryByRole('heading', { level: 3, name: w.steps[0].title })).toBeNull()
    expect(within(ol).getByRole('button', { name: new RegExp(w.steps[2].label) })).toHaveAttribute('aria-current', 'step')
    expect(within(ol).getByRole('button', { name: new RegExp(w.steps[0].label) })).not.toHaveAttribute('aria-current')
  })

  it('next button advances, and the last stage points to the free web app', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    fireEvent.click(within(sec).getByRole('button', { name: w.next }))
    expect(within(sec).getByRole('heading', { level: 3, name: w.steps[1].title })).toBeInTheDocument()
    const ol = sec.querySelector('ol') as HTMLElement
    fireEvent.click(within(ol).getByRole('button', { name: new RegExp(w.steps[4].label) }))
    expect(within(sec).queryByRole('button', { name: w.next })).toBeNull()
    const cta = within(sec).getByRole('link', { name: new RegExp(w.cta) })
    expect(cta).toHaveAttribute('href', `/${lang}#chartlab`)
  })
})
