<!-- pages/master-data/item-types.vue -->
<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Data Jenis Barang</h2>
      <UButton label="Tambah Jenis" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
    </div>

    <div v-if="!itemTypes.length" class="text-gray-500">Belum ada data.</div>

    <div v-else class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">No</th>
            <th class="px-4 py-2 text-left">Nama Jenis</th>
            <th class="px-4 py-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
          <tr v-for="(item, idx) in itemTypes" :key="item.id">
            <td class="px-4 py-2">{{ idx + 1 }}</td>
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2 space-x-2">
              <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(item)" />
              <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="remove(item.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ItemTypeForm v-if="showForm" :editData="selected" @close="showForm = false" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useItemTypes } from '~/composables/useItemTypes'

definePageMeta({ roles: ['admin', 'head'] })

const { itemTypes, fetchItemTypes, removeItemType } = useItemTypes()
const showForm = ref(false)
const selected = ref(null)

const openForm = (it = null) => {
  selected.value = it
  showForm.value = true
}

const handleSaved = async () => {
  showForm.value = false
  await fetchItemTypes()
}

const remove = async (id) => {
  if (confirm('Yakin ingin menghapus jenis ini?')) {
    await removeItemType(id)
    await fetchItemTypes()
  }
}

await fetchItemTypes()
</script>