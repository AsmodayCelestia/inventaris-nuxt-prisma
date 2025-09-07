<!-- pages/master-data/floors.vue -->
<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Data Lantai</h2>
      <UButton label="Tambah Lantai" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
    </div>

    <div class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Nama Lantai</th>
            <th class="px-4 py-2 text-left">Unit</th>
            <th class="px-4 py-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
          <tr v-for="floor in floors" :key="floor.id">
            <td class="px-4 py-2">{{ floor.number }}</td>
            <td class="px-4 py-2">{{ floor.location_units?.name || '—' }}</td>
            <td class="px-4 py-2 space-x-2">
              <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(floor)" />
              <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="remove(floor.id)" />
            </td>
          </tr>
          <tr v-if="!floors.length">
            <td colspan="3" class="text-center text-gray-500 p-4">Belum ada data.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <FloorForm v-if="showForm" :editData="selectedFloor" @close="showForm = false" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFloors } from '~/composables/useFloors'

definePageMeta({ roles: ['admin', 'head'] })

const { floors, fetchFloors, removeFloor } = useFloors()
const showForm      = ref(false)
const selectedFloor = ref(null)

const openForm = (f = null) => {
  selectedFloor.value = f
  showForm.value = true
}

const handleSaved = async () => {
  showForm.value = false
  await fetchFloors()
}

const remove = async (id) => {
  if (confirm('Yakin ingin menghapus lantai ini?')) {
    await removeFloor(id)
    await fetchFloors()
  }
}

await fetchFloors()
</script>