import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Loader from './Loader'

describe('Loader', () => {
  it('renders progress when active', () => {
    render(<Loader active progress={42} />)

    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('renders nothing when inactive', () => {
    const { container } = render(<Loader active={false} progress={100} />)

    expect(container).toBeEmptyDOMElement()
  })
})
