// composables/useFloors.js
export const useFloors = () => {
  const floors = useState('floors', () => [])

  const fetchFloors = async () => {
    const data = await $fetch('/api/floors')
    floors.value = data.map(f => ({
      ...f,
      unit: f.location_units
    }))
  }

  const createFloor = async (data) => {
    await $fetch('/api/floors', { method: 'POST', body: data })
    await fetchFloors()
  }

  const updateFloor = async (id, data) => {
    await $fetch(`/api/floors/${id}`, { method: 'PUT', body: data })
    await fetchFloors()
  }

  const removeFloor = async (id) => {
    await $fetch(`/api/floors/${id}`, { method: 'DELETE' })
    await fetchFloors()
  }

  return { floors: readonly(floors), fetchFloors, createFloor, updateFloor, removeFloor }
}