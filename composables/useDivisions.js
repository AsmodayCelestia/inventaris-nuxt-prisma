// composables/useDivisions.js
export const useDivisions = () => {
  const divisions = useState('divisions', () => [])

  const fetchDivisions = async () => {
    divisions.value = await $fetch('/api/divisions')
  }

  const removeDivision = async (id) => {
    await $fetch(`/api/divisions/${id}`, { method: 'DELETE' })
  }

  return { divisions: readonly(divisions), fetchDivisions, removeDivision }
}