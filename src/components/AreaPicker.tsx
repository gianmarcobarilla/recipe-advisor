import styles from './AreaPicker.module.css'

interface Props {
  value: string
  onChange: (area: string) => void
  availableAreas: string[]
  isLoading?: boolean
  isEmpty?: boolean
}

export function AreaPicker({ value, onChange, availableAreas, isLoading, isEmpty }: Props) {
  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <p className={styles.loading} role="status">
          Filtering cuisines…
        </p>
      ) : isEmpty ? (
        <p className={styles.loading} role="status">
          No cuisines available for this ingredient.
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
