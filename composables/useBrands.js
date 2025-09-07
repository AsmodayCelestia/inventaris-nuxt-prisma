// composables/useBrands.js
export const useBrands = () => {
  const brands = useState('brands', () => [])

  const fetchBrands = async () => {
    brands.value = await $fetch('/api/brands')
  }

  const createBrand = async (data) => {
    await $fetch('/api/brands', { method: 'POST', body: data })
    await fetchBrands()
  }

  const updateBrand = async (id, data) => {
    await $fetch(`/api/brands/${id}`, { method: 'PUT', body: data })
    await fetchBrands()
  }

  const removeBrand = async (id) => {
    await $fetch(`/api/brands/${id}`, { method: 'DELETE' })
    await fetchBrands()
  }

  return { brands: readonly(brands), fetchBrands, createBrand, updateBrand, removeBrand }
}