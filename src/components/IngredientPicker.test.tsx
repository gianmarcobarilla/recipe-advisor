import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { IngredientPicker } from './IngredientPicker'

// Replace the real fetchIngredients with a function that returns fake data instantly.
// This prevents any real network calls during tests.
vi.mock('../services/mealdb', () => ({
  fetchIngredients: vi
    .fn()
    .mockResolvedValue([
      { strIngredient: 'Chicken' },
      { strIngredient: 'Chocolate' },
      { strIngredient: 'Cheese' },
      { strIngredient: 'Beef' },
      { strIngredient: 'Tomato' },
    ]),
}))

// IngredientPicker uses useQuery internally, which requires a QueryClientProvider.
// retry: false means a failed query fails immediately instead of retrying 3 times.
function renderWithQuery(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('IngredientPicker', () => {
  let onSelect: (ingredient: string) => void

  beforeEach(() => {
    onSelect = vi.fn()
  })

  it('renders the text input', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)

    // Wait for the loading state to resolve before asserting.
    // findBy* is async — it retries until the element appears or times out.
    const input = await screen.findByRole('combobox')
    expect(input).toBeInTheDocument()
  })

  it('does not show suggestions for fewer than 2 characters', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)
    const input = await screen.findByRole('combobox')

    await userEvent.type(input, 'c')

    // queryByRole returns null instead of throwing if the element is not found.
    // We want to assert absence, so we use queryBy over getBy/findBy.
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows suggestions when the user types 2 or more characters', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)
    const input = await screen.findByRole('combobox')

    await userEvent.type(input, 'ch')

    // The listbox should appear with the 3 ingredients containing "ch".
    const listbox = await screen.findByRole('listbox')
    expect(listbox).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3) // Chicken, Chocolate, Cheese
  })

  it('filters suggestions to only those matching the query', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)
    const input = await screen.findByRole('combobox')

    await userEvent.type(input, 'bee')

    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Beef')
  })

  it('calls onSelect with the ingredient name when an option is clicked', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)
    const input = await screen.findByRole('combobox')

    await userEvent.type(input, 'ch')
    const chickenOption = await screen.findByRole('option', { name: 'Chicken' })

    // mousedown is used instead of click in the component (to prevent blur before selection).
    await userEvent.pointer({ target: chickenOption, keys: '[MouseLeft>]' })

    expect(onSelect).toHaveBeenLastCalledWith('Chicken')
  })

  it('navigates suggestions with ArrowDown and selects with Enter', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)
    const input = await screen.findByRole('combobox')

    await userEvent.type(input, 'ch')
    await screen.findByRole('listbox') // wait for suggestions to appear

    // ArrowDown moves focus to the first option (index 0).
    // The component sorts: startsWith first, then localeCompare.
    // All three match startsWith 'ch', so alphabetical order applies:
    // index 0 = Cheese, index 1 = Chicken, index 2 = Chocolate.
    await userEvent.keyboard('{ArrowDown}')
    // Enter confirms the currently highlighted option (index 0 = Cheese).
    await userEvent.keyboard('{Enter}')

    expect(onSelect).toHaveBeenLastCalledWith('Cheese')
  })

  it('clears the input and closes the listbox on Escape', async () => {
    renderWithQuery(<IngredientPicker value="" onSelect={onSelect} />)
    const input = await screen.findByRole('combobox')

    await userEvent.type(input, 'ch')
    await screen.findByRole('listbox')

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveValue('')
  })
})
