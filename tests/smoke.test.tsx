import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'

it('renders', () => {
  render(<h1>Disatu</h1>)
  expect(screen.getByRole('heading')).toHaveTextContent('Disatu')
})
