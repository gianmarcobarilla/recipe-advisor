import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IngredientPicker } from '../components/IngredientPicker'
import { AreaPicker } from '../components/AreaPicker'

export const WizardPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [ingredient, setIngredient] = useState('')
  const [area, setArea] = useState('')

  function handleSubmit() {
    navigate('/result', { state: { ingredient, area } })
  }

  if (step === 1) {
    return (
      <div>
        <p>Step 1 of 2</p>
        <h1>Choose an ingredient</h1>
        <IngredientPicker value={ingredient} onSelect={setIngredient} />
        <button onClick={() => setStep(2)} disabled={!ingredient}>
          Next
        </button>
      </div>
    )
  }

  return (
    <div>
      <p>Step 2 of 2</p>
      <h1>Choose a cuisine</h1>
      <AreaPicker value={area} onChange={setArea} />
      <div>
        <button onClick={() => setStep(1)}>Back</button>
        <button onClick={handleSubmit} disabled={!area}>
          Find a recipe
        </button>
      </div>
    </div>
  )
}
