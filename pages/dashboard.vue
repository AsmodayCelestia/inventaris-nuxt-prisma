<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div class="text-sm text-gray-500">
          Last login: {{ new Date().toLocaleString() }}
        </div>
      </div>

      <!-- Card Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Total Barang</span>
              <UIcon name="i-heroicons-cube" class="w-6 h-6 text-indigo-600" />
            </div>
          </template>
          <div class="text-2xl font-bold">{{ totalBarang }}</div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Maintenance Hari Ini</span>
              <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-orange-600" />
            </div>
          </template>
          <div class="text-2xl font-bold">{{ maintToday }}</div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Inventaris Aktif</span>
              <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600" />
            </div>
          </template>
          <div class="text-2xl font-bold">{{ aktifCount }}</div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">QR Code Terdaftar</span>
              <UIcon name="i-heroicons-qr-code" class="w-6 h-6 text-purple-600" />
            </div>
          </template>
          <div class="text-2xl font-bold">{{ qrCount }}</div>
        </UCard>
      </div>

      <!-- Quick Action -->
      <div class="flex flex-wrap gap-3">
        <UButton v-if="isAdmin || isHead" label="Tambah Barang Baru" icon="i-heroicons-plus" to="/inventories/add" />
        <UButton label="Scan QR" icon="i-heroicons-qr-code" color="gray" to="/scan-qrcode" />
      </div>
    </div>
  </div>
</template>

<script setup>
const { isAdmin, isHead } = useAuth()

/* === data summary === */
const totalBarang = ref(1234)
const maintToday  = ref(12)
const aktifCount  = ref(987)
const qrCount     = ref(567)
</script>