// composables/useItemTypes.js
export const useItemTypes = () => {
  const itemTypes = useState('itemTypes', () => [])

  const fetchItemTypes = async () => {
    itemTypes.value = await $fetch('/api/item-types')
  }

  const createItemType = async (data) => {
    await $fetch('/api/item-types', { method: 'POST', body: data })
    await fetchItemTypes()
  }

  const updateItemType = async (id, data) => {
    await $fetch(`/api/item-types/${id}`, { method: 'PUT', body: data })
    await fetchItemTypes()
  }

  const removeItemType = async (id) => {
    await $fetch(`/api/item-types/${id}`, { method: 'DELETE' })
    await fetchItemTypes()
  }

  return { itemTypes: readonly(itemTypes), fetchItemTypes, createItemType, updateItemType, removeItemType }
}