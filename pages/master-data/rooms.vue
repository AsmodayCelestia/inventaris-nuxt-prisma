<script setup>
import { ref } from 'vue'
import { useRooms } from '~/composables/useRooms'

definePageMeta({ roles: ['admin', 'head'] })

const { rooms, fetchRooms, removeRoom } = useRooms()
const showForm = ref(false)
const selectedRoom = ref(null)
const loading = ref(true)

const openForm = (r = null) => {
  selectedRoom.value = r
  showForm.value = true
}

const handleSaved = async () => {
  showForm.value = false
  await fetchRooms()
}

const remove = async (id) => {
  if (confirm('Yakin ingin menghapus ruangan ini?')) {
    await removeRoom(id)
  }
}

onMounted(async () => {
  await fetchRooms()
  loading.value = false
})
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Data Ruangan</h2>
      <UButton label="Tambah Ruangan" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
    </div>

    <!-- loading -->
    <div v-if="loading" class="text-sm text-slate-600">Memuat data...</div>

    <!-- kosong -->
    <div v-else-if="!rooms.length" class="text-gray-500">Belum ada data.</div>

    <!-- table -->
    <div v-else class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left w-16">No</th>
            <th class="px-4 py-2 text-left">Nama Ruangan</th>
            <th class="px-4 py-2 text-left">Lantai</th>
            <th class="px-4 py-2 text-left">Unit</th>
            <th class="px-4 py-2 text-left">Pengawas Ruangan</th>
            <th class="px-4 py-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
          <tr v-for="(room, index) in rooms" :key="room.id">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ room.name }}</td>
            <td class="px-4 py-2">{{ room.floor?.number || '—' }}</td>
            <td class="px-4 py-2">{{ room.floor?.unit?.name || '—' }}</td>
            <td class="px-4 py-2">{{ room.locationPersonInCharge?.name || '—' }}</td>
            <td class="px-4 py-2 space-x-2">
              <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(room)" />
              <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="remove(room.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <RoomForm v-if="showForm" :editData="selectedRoom" @close="showForm = false" @saved="handleSaved" />
  </div>
</template>