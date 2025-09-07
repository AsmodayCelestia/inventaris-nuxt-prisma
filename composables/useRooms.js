// composables/useRooms.js
export const useRooms = () => {
  const rooms = useState('rooms', () => [])

const fetchRooms = async () => {
  console.log('🚀 fetchRooms dipanggil')
  const data = await $fetch('/api/rooms')
  console.log('📦 data dari API:', data)
  rooms.value = data.map(r => ({
    ...r,
    floor: { id: r.floor.id, number: r.floor.number, unit: r.floor.unit },
    locationPersonInCharge: r.locationPersonInCharge
  }))
  console.log('✅ rooms.value setelah mapping:', rooms.value)
}

  const createRoom = async (payload) => {
    await $fetch('/api/rooms', { method: 'POST', body: payload })
    await fetchRooms()
  }

  const updateRoom = async (id, payload) => {
    await $fetch(`/api/rooms/${id}`, { method: 'PUT', body: payload })
    await fetchRooms()
  }

  const removeRoom = async (id) => {
    await $fetch(`/api/rooms/${id}`, { method: 'DELETE' })
    await fetchRooms()
  }

  return { rooms: readonly(rooms), fetchRooms, createRoom, updateRoom, removeRoom }
}