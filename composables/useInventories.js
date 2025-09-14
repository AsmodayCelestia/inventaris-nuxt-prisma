// composables/useInventories.js
export const useInventories = () => {
  const inventories = useState('inventories', () => [])
  const totalRows   = useState('inventoryTotalRows', () => 0)
  const grandTotal  = useState('inventoryGrandTotal', () => null)
  const loading     = useState('inventoryLoading', () => false)
  const error       = useState('inventoryError', () => '')

  const params = reactive({
    search: '',
    status: null,
    unit_id: [],
    floor_id: [],
    room_id: [],
    page: 1,
    per_page: 10
  })

  const auth = useAuth()
  const isAdmin = computed(() => auth.value?.user?.role === 'admin')
  const isHead  = computed(() => auth.value?.user?.role === 'head')
  const canSeePrice = computed(() => {
    const u = auth.value?.user
    if (!u) return false
    return u.role === 'admin' ||
           u.division?.name === 'Keuangan' ||
           (u.role === 'head' && u.division?.name === 'Umum')
  })
  const canUpdatePrice = computed(() => {
    const u = auth.value?.user
    if (!u) return false
    return u.role === 'admin' || u.division?.name === 'Keuangan'
  })

  const fetchTable = async () => {
    loading.value = true
    error.value   = ''
    try {
      const q = new URLSearchParams()
      Object.keys(params).forEach(k => {
        const v = params[k]
        if (Array.isArray(v)) v.forEach(i => q.append(k, i))
        else if (v != null) q.append(k, v)
      })
      const res = await $fetch(`/api/inventories/table?${q}`)
      inventories.value = res.data
      totalRows.value   = res.recordsFiltered
      grandTotal.value  = canSeePrice.value ? res.grand_total : null
    } catch (e) {
      error.value = e.data?.message || 'Gagal memuat inventaris'
    } finally {
      loading.value = false
    }
  }

  const removeInventory = async (id) => {
    await $fetch(`/api/inventories/${id}`, { method: 'DELETE' })
    await fetchTable()
  }

  const resetParams = () => {
    Object.assign(params, {
      search: '',
      status: null,
      unit_id: [],
      floor_id: [],
      room_id: [],
      page: 1,
      per_page: 10
    })
  }

  // tailwind helpers
  const statusBadge = (s) => {
    const map = {
      ada: 'bg-green-100 text-green-800',
      rusak: 'bg-red-100 text-red-800',
      perbaikan: 'bg-yellow-100 text-yellow-800',
      hilang: 'bg-gray-100 text-gray-800',
      dipinjam: 'bg-blue-100 text-blue-800',
      '-': 'bg-gray-100 text-gray-600'
    }
    return map[s.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'

  const fmtCur = (v) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)

  return {
    inventories: readonly(inventories),
    totalRows: readonly(totalRows),
    grandTotal: readonly(grandTotal),
    loading: readonly(loading),
    error: readonly(error),
    params: readonly(params),
    isAdmin,
    isHead,
    canSeePrice,
    canUpdatePrice,
    fetchTable,
    removeInventory,
    resetParams,
    statusBadge,
    fmtDate,
    fmtCur
  }
}