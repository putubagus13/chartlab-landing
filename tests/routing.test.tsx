import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from './utils'

describe('routing', () => {
  it('/ redirects to /id', async () => {
    const { router } = await renderWithRouter('/')
    await waitFor(() => expect(router.state.location.pathname).toBe('/id'))
  })
  it('unknown lang is not found', async () => {
    await renderWithRouter('/fr')
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument())
  })
  it('/en sets html lang', async () => {
    await renderWithRouter('/en')
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
  })
})
