import { useQuery } from '@tanstack/react-query'
import { fetchAreas } from '../services/mealdb'

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
    <div>
      <label htmlFor="area-select">Cuisine / Area</label>
      <select id="area-select" value={value} onChange={(e) => onChange(e.target.value)}>
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
