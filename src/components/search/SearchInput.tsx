interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="search-field">
      <span>Qidirish</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Kitob nomi, muallif yoki kategoriya"
        aria-label="Kitoblarni qidirish"
      />
    </label>
  )
}
