import { useQuery } from '@tanstack/react-query'
import { fetchAreas } from '../services/mealdb'
import styles from './AreaPicker.module.css'

interface Props {
  value: string
  onChange: (area: string) => void
}

export function AreaPicker({ value, onChange }: Props) {
  const {
    data: areas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['areas'],
    queryFn: fetchAreas,
  })

  if (isLoading) return <p>Loading areas...</p>
  if (isError) return <p>Failed to load areas.</p>

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="area-select">
        Cuisine / Area
      </label>
      <select
        className={styles.select}
        id="area-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select an area --</option>
        {areas?.map((a) => (
          <option key={a.strArea} value={a.strArea}>
            {a.strArea}
          </option>
        ))}
      </select>
    </div>
  )
}
