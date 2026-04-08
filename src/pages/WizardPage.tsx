import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IngredientPicker } from '../components/IngredientPicker'
import { AreaPicker } from '../components/AreaPicker'
import styles from './WizardPage.module.css'

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
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.stepIndicator}>Step 1 of 2</p>
          <h1 className={styles.title}>What ingredient?</h1>
          <IngredientPicker value={ingredient} onSelect={setIngredient} />
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => setStep(2)} disabled={!ingredient}>
              Next →
            </button>
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
        <AreaPicker value={area} onChange={setArea} />
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => setStep(1)}>
            ← Back
          </button>
          <button className={styles.btnPrimary} onClick={handleSubmit} disabled={!area}>
            Find a recipe
          </button>
        </div>
      </div>
    </div>
  )
}
