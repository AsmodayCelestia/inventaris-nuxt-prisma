// composables/useCategories.js
export const useCategories = () => {
  const categories = useState('categories', () => [])

  const fetchCategories = async () => {
    categories.value = await $fetch('/api/categories')
  }

  const createCategory = async (data) => {
    await $fetch('/api/categories', { method: 'POST', body: data })
    await fetchCategories()
  }

  const updateCategory = async (id, data) => {
    await $fetch(`/api/categories/${id}`, { method: 'PUT', body: data })
    await fetchCategories()
  }

  const removeCategory = async (id) => {
    await $fetch(`/api/categories/${id}`, { method: 'DELETE' })
    await fetchCategories()
  }

  return { categories: readonly(categories), fetchCategories, createCategory, updateCategory, removeCategory }
}