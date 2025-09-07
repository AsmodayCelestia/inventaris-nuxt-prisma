<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Data Pengguna</h2>
      <UButton label="Tambah Pengguna" icon="i-heroicons-plus" size="sm" @click="openForm(null)" />
    </div>

    <!-- State kosong -->
    <div v-if="loading" class="text-gray-500">Memuat data...</div>
    <div v-else-if="!users.length" class="text-gray-500">Belum ada data.</div>

    <!-- Tabel -->
    <div v-else class="bg-white rounded shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">No</th>
            <th class="px-4 py-2 text-left">Nama</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Role</th>
            <th class="px-4 py-2 text-left">Divisi</th>
            <th class="px-4 py-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
          <tr v-for="(user, idx) in users" :key="user.id">
            <td class="px-4 py-2">{{ idx + 1 }}</td>
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">
              <UBadge
                :color="
                  user.role === 'admin'  ? 'rose' :
                  user.role === 'head'   ? 'sky'  :
                                           'gray'
                "
                variant="subtle"
              >
                {{ user.role }}
              </UBadge>
            </td>
            <td class="px-4 py-2">{{ user.division ?? '-' }}</td>
            <td class="px-4 py-2 space-x-2">
              <UButton color="sky" variant="ghost" size="xs" icon="i-heroicons-pencil" @click="openForm(user)" />
              <UButton color="rose" variant="ghost" size="xs" icon="i-heroicons-trash" @click="remove(user.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form modal -->
    <UserForm v-if="showForm" :editData="selectedUser" @close="showForm = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUsers } from '~/composables/useUsers'

definePageMeta({ roles: ['admin'] })

const { users, fetchUsers, deleteUser } = useUsers()
const showForm = ref(false)
const selectedUser = ref(null)
const loading = ref(true)

const openForm = (u = null) => {
  selectedUser.value = u
  showForm.value = true
}

const remove = async (id) => {
  if (!confirm('Yakin ingin menghapus pengguna ini?')) return
  await deleteUser(id)
  await fetchUsers()
}

const onSaved = async () => {
  showForm.value = false
  await fetchUsers()
}

await fetchUsers()
loading.value = false
</script>