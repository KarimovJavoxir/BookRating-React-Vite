interface CategoryFilterProps {
  categories: string[]
  selectedCategory?: string
  onChange: (category?: string) => void
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <label className="filter-field">
      <span>Kategoriya</span>
      <select
        value={selectedCategory ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
      >
        <option value="">Barcha kategoriyalar</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  )
}
