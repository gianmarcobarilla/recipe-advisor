import { useQuery } from '@tanstack/react-query'
import { fetchIngredients } from '../services/mealdb'

export const WizardPage = () => {
  const {
    data: ingredients,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  })

  if (isLoading) return <p>Loading ingredients...</p>
  if (isError) return <p>Failed to load ingredients.</p>

  return (
    <ul>
      {ingredients?.map((i) => (
        <li key={i.strIngredient}>{i.strIngredient}</li>
      ))}
    </ul>
  )
}
