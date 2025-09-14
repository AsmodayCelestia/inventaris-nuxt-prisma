<!-- pages/inventories/index.vue  |  FULL TAILWIND  -->
<template>
  <div class="p-4">
    <!-- HEADER -->
    <div class="bg-white rounded shadow px-4 py-3 mb-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h1 class="text-xl font-semibold text-gray-800">Data Inventaris</h1>
        <nav class="text-sm text-gray-500">
          <NuxtLink to="/dashboard" class="hover:text-gray-700">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-gray-900 font-medium">Inventaris</span>
        </nav>
      </div>
    </div>

    <!-- FILTER -->
    <div class="bg-white rounded shadow p-4 mb-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <!-- search -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs font-medium mb-1 text-gray-600">Cari</label>
          <input
            v-model="params.search"
            class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="nomor / nama barang"
            @input="debounceApply"
          >
        </div>

        <!-- status -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs font-medium mb-1 text-gray-600">Status</label>
          <VueSelect
            v-model="params.status"
            :options="statusOptions"
            :clearable="true"
            placeholder="Semua"
            class="vs-select"
          />
        </div>

        <!-- unit -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs font-medium mb-1 text-gray-600">Unit</label>
          <VueSelect
            v-model="selectedUnits"
            :options="units"
            label="name"
            :reduce="u => u.id"
            multiple
            placeholder="Semua"
            class="vs-select"
          />
        </div>

        <!-- floor -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs font-medium mb-1 text-gray-600">Lantai</label>
          <VueSelect
            v-model="selectedFloors"
            :options="floors"
            label="number"
            :reduce="f => f.id"
            multiple
            placeholder="Semua"
            :disabled="!selectedUnits.length"
            class="vs-select"
          />
        </div>

        <!-- room -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs font-medium mb-1 text-gray-600">Ruangan</label>
          <VueSelect
            v-model="selectedRooms"
            :options="rooms"
            label="name"
            :reduce="r => r.id"
            multiple
            placeholder="Semua"
            :disabled="!selectedFloors.length"
            class="vs-select"
          />
        </div>

        <!-- buttons -->
        <div class="col-span-2 md:col-span-1 flex flex-col justify-end gap-2">
          <UButton class="w-full" size="sm" @click="applyFilter">
            <i class="fas fa-filter mr-1"></i> Terapkan
          </UButton>
          <UButton variant="outline" class="w-full" size="sm" @click="resetFilter">
            <i class="fas fa-undo mr-1"></i> Reset
          </UButton>
        </div>
      </div>
    </div>

    <!-- GRAND TOTAL -->
    <div v-if="isAdmin && grandTotal" class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-blue-50 border border-blue-200 rounded p-4">
        <p class="text-sm text-blue-700">Total Nilai Beli (sesuai filter)</p>
        <p class="text-2xl font-bold text-blue-900">{{ fmtCur(grandTotal.purchase ?? 0) }}</p>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded p-4">
        <p class="text-sm text-amber-700">Total Depresiasi (sesuai filter)</p>
        <p class="text-2xl font-bold text-amber-900">{{ fmtCur(grandTotal.depreciation ?? 0) }}</p>
      </div>
    </div>

    <!-- TABEL -->
    <div class="bg-white rounded shadow overflow-hidden">
      <div class="px-4 py-3 border-b flex items-center justify-between">
        <h3 class="text-gray-800 font-semibold">Daftar Unit Inventaris</h3>
      </div>

      <LoadingLottie v-if="loading" class="p-8" />
      <UAlert v-else-if="error" color="red" :title="error" class="m-4" />
      <UAlert v-else-if="!inventories.length" color="blue" title="Belum ada data unit inventaris." class="m-4" />

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">Nomor Inventaris</th>
              <th class="px-4 py-2 text-left">Nama Barang</th>
              <th class="px-4 py-2 text-left">Lokasi</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Tanggal Pengadaan</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
            <tr v-for="item in inventories" :key="item.id">
              <td class="px-4 py-2">{{ item.inventory_number }}</td>
              <td class="px-4 py-2">{{ item.inventory_items?.name || '-' }}</td>
              <td class="px-4 py-2">
                {{ item.rooms?.name || '-' }} ({{ item.location_units?.name || '-' }})
              </td>
              <td class="px-4 py-2">
                <span :class="['px-2 py-1 text-xs rounded-full', statusBadge(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-4 py-2">{{ fmtDate(item.procurement_date) }}</td>
              <td class="px-4 py-2 space-x-2">
                <UButton
                  color="sky"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-eye"
                  :to="`/inventories/${item.id}`"
                />
                <UButton
                  v-if="isAdmin || isHead || canUpdatePrice"
                  color="amber"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-pencil"
                  :to="`/inventories/edit/${item.id}`"
                />
                <UButton
                  v-if="isAdmin || isHead"
                  color="rose"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-trash"
                  @click="confirmDelete(item.id, item.inventory_number)"
                />
              </td>
            </tr>
            <tr v-if="!inventories.length">
              <td colspan="6" class="text-center text-gray-500 p-4">Belum ada data unit inventaris.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION (Tailwind) -->
      <div class="p-4 flex items-center justify-center">
        <div class="flex items-center space-x-1 text-sm">
          <UButton
            label="Previous"
            :disabled="params.page <= 1"
            @click="prevPage"
            class="px-3 py-1.5 rounded"
          />
          <template v-if="windowStart > 1">
            <UButton label="1" @click="goPage(1)" class="px-3 py-1.5" />
            <span v-if="windowStart > 2" class="px-2 text-gray-500">...</span>
          </template>

          <UButton
            v-for="p in visiblePages"
            :key="p"
            :label="String(p)"
            :color="p === params.page ? 'primary' : 'white'"
            class="px-3 py-1.5"
            @click="goPage(p)"
          />

          <template v-if="windowEnd < lastPage">
            <span v-if="windowEnd < lastPage - 1" class="px-2 text-gray-500">...</span>
            <UButton :label="String(lastPage)" @click="goPage(lastPage)" class="px-3 py-1.5" />
          </template>

          <UButton
            label="Next"
            :disabled="params.page >= lastPage"
            @click="nextPage"
            class="px-3 py-1.5 rounded"
          />
        </div>
      </div>
    </div>

    <!-- MODAL DELETE -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h5 class="text-gray-800">Konfirmasi Hapus</h5>
        </template>
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus <strong>{{ itemToDeleteName }}</strong>?
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showDeleteModal = false">Batal</UButton>
            <UButton color="red" :loading="deleting" @click="deleteConfirmed">Hapus</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
/* ---------- IMPORT ---------- */
import { ref, computed, onMounted, watch } from 'vue'
import { useInventories } from '~/composables/useInventories'
import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { useUnits } from '~/composables/useUnits'
import { useAuth } from '~/composables/useAuth'
import debounce from 'lodash.debounce'

/* ---------- COMPOSABLES ---------- */
const { units } = useUnits()
const {
  inventories,
  totalRows,
  grandTotal,
  loading,
  error,
  params,
  isAdmin,
  isHead,
  canUpdatePrice,
  fetchTable,
  removeInventory,
  resetParams,
  statusBadge,
  fmtDate,
  fmtCur
} = useInventories()

const { isHead: isHeadUser } = useAuth()

/* ---------- LOCAL ---------- */
const selectedUnits = ref([])
const selectedFloors = ref([])
const selectedRooms = ref([])

const floors = ref([])
const rooms = ref([])

const statusOptions = ['Ada', 'Rusak', 'Perbaikan', 'Hilang', 'Dipinjam', '-']

const showDeleteModal = ref(false)
const itemIdToDelete = ref(null)
const itemToDeleteName = ref('')
const deleting = ref(false)

/* ---------- PAGINATION ---------- */
const lastPage = computed(() => Math.max(1, Math.ceil(totalRows.value / params.per_page)))
const windowSize = 2
const windowStart = computed(() => Math.max(1, params.page - windowSize))
const windowEnd = computed(() => Math.min(lastPage.value, params.page + windowSize))
const visiblePages = computed(() => {
  const pages = []
  for (let i = windowStart.value; i <= windowEnd.value; i++) pages.push(i)
  return pages.length ? pages : [1]
})

/* ---------- WATCHERS ---------- */
watch(selectedUnits, async (ids) => {
  selectedFloors.value = []
  selectedRooms.value = []
  if (!ids.length) {
    floors.value = []
    return
  }
  floors.value = await $fetch('/api/floors/by-units', { query: { unit_id: ids } })
})

watch([selectedUnits, selectedFloors], async ([units, floors]) => {
  selectedRooms.value = []
  rooms.value = await $fetch('/api/rooms/by-units-floors', { query: { unit_id: units, floor_id: floors } })
})

/* ---------- METHODS ---------- */
const applyFilter = () => {
  Object.assign(params, {
    unit_id: selectedUnits.value,
    floor_id: selectedFloors.value,
    room_id: selectedRooms.value,
    page: 1
  })
  fetchTable()
}

const resetFilter = () => {
  selectedUnits.value = []
  selectedFloors.value = []
  selectedRooms.value = []
  resetParams()
  fetchTable()
}

const debounceApply = debounce(applyFilter, 400)

const prevPage = () => {
  if (params.page > 1) {
    params.page--
    fetchTable()
  }
}
const nextPage = () => {
  if (params.page < lastPage.value) {
    params.page++
    fetchTable()
  }
}
const goPage = (p) => {
  params.page = p
  fetchTable()
}

const confirmDelete = (id, name) => {
  itemIdToDelete.value = id
  itemToDeleteName.value = name
  showDeleteModal.value = true
}

const deleteConfirmed = async () => {
  deleting.value = true
  await removeInventory(itemIdToDelete.value)
  showDeleteModal.value = false
  deleting.value = false
}

/* ---------- LIFECYCLE ---------- */
onMounted(async () => {
  await fetchTable()
})
</script>

<!-- taruh paling bawah, di luar <template> & <script> -->
<style>
.vs-select .vs__dropdown-toggle,
.vs-select .vs__selected,
.vs-select .vs__search,
.vs-select .vs__dropdown-menu,
.vs-select .vs__dropdown-option {
  background-color: #ffffff !important;
  border: 1px solid #d1d5db !important;
  color: #111827 !important;
}
.vs-select .vs__dropdown-option--highlight {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}
.vs-select .vs__selected {
  background-color: #f3f4f6 !important;
  color: #111827 !important;
}
</style>