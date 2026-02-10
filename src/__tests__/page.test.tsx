import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

test('Page renders main heading', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1, name: /Lingua/i })).toBeDefined()
})

test('Dropzone is accessible', () => {
  render(<Home />)
  const dropzone = screen.getByRole('button', { name: /Upload file area/i })
  expect(dropzone).toBeDefined()
})
