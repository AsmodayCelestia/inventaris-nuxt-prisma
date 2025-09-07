<!-- pages/master-data/units.vue -->
<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Data Unit Lokasi</h2>
      <UButton label="Tambah Unit" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
    </div>

    <div v-if="!units.length" class="text-gray-500">Belum ada data.</div>

    <div v-else class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">No</th>
            <th class="px-4 py-2 text-left">Nama Unit</th>
            <th class="px-4 py-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
          <tr v-for="(unit, idx) in units" :key="unit.id">
            <td class="px-4 py-2">{{ idx + 1 }}</td>
            <td class="px-4 py-2">{{ unit.name }}</td>
            <td class="px-4 py-2 space-x-2">
              <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(unit)" />
              <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="remove(unit.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UnitForm v-if="showForm" :editData="selected" @close="showForm = false" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUnits } from '~/composables/useUnits'

definePageMeta({ roles: ['admin', 'head'] })

const { units, fetchUnits, removeUnit } = useUnits()
const showForm = ref(false)
const selected = ref(null)

const openForm = (u = null) => {
  selected.value = u
  showForm.value = true
}

const handleSaved = async () => {
  showForm.value = false
  await fetchUnits()
}

const remove = async (id) => {
  if (confirm('Yakin ingin menghapus unit ini?')) {
    await removeUnit(id)
    await fetchUnits()
  }
}

await fetchUnits()
</script>