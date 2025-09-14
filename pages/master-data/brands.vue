<!-- pages/master-data/brands.vue -->
<template>
  <div class="p-4">
    <div class="bg-white rounded shadow">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold text-gray-800">Daftar Merk</h2>
        <UButton label="Tambah Merk" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">No</th>
              <th class="px-4 py-2 text-left">Nama Merk</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
            <tr v-for="(brand, index) in brands" :key="brand.id">
              <td class="px-4 py-2">{{ index + 1 }}</td>
              <td class="px-4 py-2">{{ brand.name }}</td>
              <td class="px-4 py-2 space-x-2">
                <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(brand)" />
                <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="deleteBrand(brand.id)" />
              </td>
            </tr>
            <tr v-if="!brands.length">
              <td colspan="3" class="text-center text-gray-500 p-4">Belum ada data merk.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BrandForm v-if="showForm" :editData="selectedBrand" @close="showForm = false" @saved="refreshBrands" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBrands } from '~/composables/useBrands'
import BrandForm from '~/components/BrandForm.vue'

definePageMeta({ roles: ['admin', 'head'] })

const { brands, fetchBrands, removeBrand } = useBrands()
const showForm = ref(false)
const selectedBrand = ref(null)

// 1. TOP-LEVEL → jalan di server & client navigasi
await fetchBrands()

// 2. onMounted cuma untuk DOM (kalau ada)
// onMounted(() => { /* init tooltip, etc */ })

const openForm = (brand) => {
  selectedBrand.value = brand
  showForm.value = true
}

const refreshBrands = async () => {
  showForm.value = false
  await fetchBrands()
}

const deleteBrand = async (id) => {
  if (confirm('Yakin ingin menghapus merk ini?')) {
    await removeBrand(id)
    await fetchBrands()
  }
}
</script>