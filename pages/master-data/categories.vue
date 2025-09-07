<!-- pages/master-data/categories.vue -->
<template>
  <div class="p-4">
    <div class="bg-white rounded shadow">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold text-gray-800">Daftar Kategori</h2>
        <UButton label="Tambah" icon="i-heroicons-plus" size="sm" @click="openForm()" />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th class="px-4 py-2 text-left w-10">#</th>
              <th class="px-4 py-2 text-left">Nama Kategori</th>
              <th class="px-4 py-2 text-left w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
            <tr v-for="(cat, index) in categories" :key="cat.id">
              <td class="px-4 py-2">{{ index + 1 }}</td>
              <td class="px-4 py-2">{{ cat.name }}</td>
              <td class="px-4 py-2 space-x-2">
                <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(cat)" />
                <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="deleteCategory(cat.id)" />
              </td>
            </tr>
            <tr v-if="!categories.length">
              <td colspan="3" class="text-center text-gray-500 p-4">Belum ada data.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CategoryForm v-if="showForm" :editData="selected" @close="showForm = false" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategories } from '~/composables/useCategories'
import CategoryForm from '~/components/CategoryForm.vue'

definePageMeta({ roles: ['admin', 'head'] })

const { categories, fetchCategories, removeCategory } = useCategories()
const showForm = ref(false)
const selected = ref(null)

const openForm = (cat = null) => {
  selected.value = cat
  showForm.value = true
}

const handleSaved = async () => {
  showForm.value = false
  selected.value = null
  await fetchCategories()
}

const deleteCategory = async (id) => {
  if (confirm('Yakin ingin menghapus kategori ini?')) {
    await removeCategory(id)
    await fetchCategories()
  }
}

onMounted(fetchCategories)
</script>