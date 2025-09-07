<!-- pages/master-data/divisions.vue -->
<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Daftar Divisi</h2>
      <UButton label="Tambah Divisi" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
    </div>

    <div class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-2 w-12">#</th>
            <th class="px-4 py-2 text-left">Nama Divisi</th>
            <th class="px-4 py-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
          <tr v-for="(d, i) in divisions" :key="d.id">
            <td class="px-4 py-2">{{ i + 1 }}</td>
            <td class="px-4 py-2">{{ d.name }}</td>
            <td class="px-4 py-2 space-x-2">
              <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(d)" />
              <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="deleteDivision(d.id)" />
            </td>
          </tr>
          <tr v-if="!divisions.length">
            <td colspan="3" class="text-center text-gray-500 p-4">Belum ada data.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <DivisionForm v-if="showForm" :editData="selected" @close="showForm = false" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDivisions } from '~/composables/useDivisions'

definePageMeta({ roles: ['admin'] })

const { divisions, fetchDivisions, removeDivision } = useDivisions()
const showForm   = ref(false)
const selected   = ref(null)

const openForm = (d = null) => {
  selected.value = d
  showForm.value = true
}

const handleSaved = async () => {
  showForm.value = false
  await fetchDivisions()
}

const deleteDivision = async (id) => {
  if (confirm('Yakin hapus divisi ini?')) {
    await removeDivision(id)
    await fetchDivisions()
  }
}

await fetchDivisions()
</script>