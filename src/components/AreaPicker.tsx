import styles from './AreaPicker.module.css'

interface Props {
  value: string
  onChange: (area: string) => void
  availableAreas: string[]
  isLoading?: boolean
}

export function AreaPicker({ value, onChange, availableAreas, isLoading }: Props) {
  return (
    <div className={styles.wrapper}>
      {isLoading || availableAreas.length === 0 ? (
        <p className={styles.loading} role="status">
          Filtering cuisines…
        </p>
      ) : (
        <>
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
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  )
}
