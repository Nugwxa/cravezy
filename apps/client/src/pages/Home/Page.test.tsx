import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './Page'

describe('App', () => {
  it('Should Render Title Properly', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Cravezy'
    )
  })
})
