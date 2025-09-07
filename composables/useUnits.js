// composables/useUnits.js
export const useUnits = () => {
  const units = useState('units', () => [])

  const fetchUnits = async () => {
    units.value = await $fetch('/api/units')
  }

  const createUnit = async (data) => {
    await $fetch('/api/units', { method: 'POST', body: data })
    await fetchUnits()
  }

  const updateUnit = async (id, data) => {
    await $fetch(`/api/units/${id}`, { method: 'PUT', body: data })
    await fetchUnits()
  }

  const removeUnit = async (id) => {
    await $fetch(`/api/units/${id}`, { method: 'DELETE' })
    await fetchUnits()
  }

  return { units: readonly(units), fetchUnits, createUnit, updateUnit, removeUnit }
}