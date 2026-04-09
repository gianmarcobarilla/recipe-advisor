import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchAreas, filterByIngredient, filterByArea } from '../services/mealdb'
import { IngredientPicker } from '../components/IngredientPicker'
import { AreaPicker } from '../components/AreaPicker'
import { Button } from '../components/Button'
import styles from './WizardPage.module.css'

export const WizardPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [ingredient, setIngredient] = useState('')
  const [area, setArea] = useState('')

  const { data: allAreas } = useQuery({
    queryKey: ['areas'],
    queryFn: fetchAreas,
  })

  const { data: byIngredient } = useQuery({
    queryKey: ['filter', 'ingredient', ingredient],
    queryFn: () => filterByIngredient(ingredient),
    enabled: !!ingredient,
    staleTime: Infinity,
  })

  const byIngredientIds = new Set((byIngredient ?? []).map((m) => m.idMeal))

  const areaRecipesResults = useQueries({
    queries: (allAreas ?? []).map((a) => ({
      queryKey: ['filter', 'area', a.strArea],
      queryFn: () => filterByArea(a.strArea),
      enabled: step === 2 && byIngredientIds.size > 0,
      staleTime: Infinity,
    })),
  })

  const isLoadingAreas = areaRecipesResults.some((q) => q.isLoading)

  const availableAreas = (allAreas ?? [])
    .filter((_, i) => {
      const meals = areaRecipesResults[i]?.data ?? []
      return meals.some((m) => byIngredientIds.has(m.idMeal))
    })
    .map((a) => a.strArea)

  function handleSubmit() {
    navigate('/result', { state: { ingredient, area } })
  }

  if (step === 1) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.stepIndicator}>Step 1 of 2</p>
          <h1 className={styles.title}>What ingredient?</h1>
          <IngredientPicker value={ingredient} onSelect={setIngredient} />
          <div className={styles.actions}>
            <Button
              variant="primary"
              style={{ flex: 1 }}
              onClick={() => setStep(2)}
              disabled={!ingredient}
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.stepIndicator}>Step 2 of 2</p>
        <h1 className={styles.title}>Which cuisine?</h1>
        <AreaPicker
          value={area}
          onChange={setArea}
          availableAreas={availableAreas}
          isLoading={isLoadingAreas}
        />
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setStep(1)}>
            ← Back
          </Button>
          <Button variant="primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={!area}>
            Find a recipe
          </Button>
        </div>
      </div>
    </div>
  )
}
