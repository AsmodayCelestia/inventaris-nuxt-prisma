<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ isEdit ? 'Edit Ruangan' : 'Tambah Ruangan' }}</h5>
      </template>

      <UForm :state="form" @submit="submit">
        <UFormGroup label="Nama Ruangan" name="name" required>
          <UInput v-model="form.name" placeholder="Contoh: Ruang Server" />
        </UFormGroup>

        <UFormGroup label="Unit" name="unit_id" required class="mt-4">
          <USelectMenu
            v-model="form.unit_id"
            :options="units"
            placeholder="Pilih Unit"
            value-attribute="id"
            option-attribute="name"
            @change="onUnitChange"
          />
        </UFormGroup>

        <UFormGroup label="Lantai" name="floor_id" required class="mt-4">
          <USelectMenu
            v-model="form.floor_id"
            :options="floorsFiltered"
            placeholder="Pilih Lantai"
            value-attribute="id"
            option-attribute="number"
            :disabled="!form.unit_id"
          />
        </UFormGroup>

        <UFormGroup label="Pengawas Ruangan" name="pj_lokasi_id" class="mt-4">
          <USelectMenu
            v-model="form.pj_lokasi_id"
            :options="users"
            placeholder="-- Tidak Ada --"
            value-attribute="id"
            option-attribute="name"
          />
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-4">
          <UButton variant="ghost" @click="$emit('close')">Batal</UButton>
          <UButton type="submit" :loading="pending">
            {{ isEdit ? 'Update' : 'Simpan' }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useUnits } from '~/composables/useUnits'
import { useFloors } from '~/composables/useFloors'
import { useRooms } from '~/composables/useRooms'
import { useUsers } from '~/composables/useUsers'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

// ✅ Ambil data + fungsi fetch
const { units, fetchUnits } = useUnits()
const { floors, fetchFloors } = useFloors()
const { users, fetchUsers } = useUsers()
const { createRoom, updateRoom } = useRooms()

const isEdit = computed(() => !!props.editData)

const form = reactive({
  name: props.editData?.name || '',
  unit_id: props.editData?.floor?.unit?.id || null,
  floor_id: props.editData?.floor_id || null,
  pj_lokasi_id: props.editData?.locationPersonInCharge?.id || null
})

const floorsFiltered = computed(() =>
  form.unit_id
    ? floors.value.filter(f => String(f.unit?.id) === String(form.unit_id))
    : []
)

const onUnitChange = () => {
  form.floor_id = null
}

const pending = ref(false)

const submit = async () => {
  pending.value = true
  try {
    const payload = {
      name: form.name,
      floor_id: form.floor_id,
      pj_lokasi_id: form.pj_lokasi_id
    }
    isEdit.value
      ? await updateRoom(props.editData.id, payload)
      : await createRoom(payload)
    emit('saved')
  } finally {
    pending.value = false
  }
}

// ✅ Fetch semua data saat form dibuka
onMounted(async () => {
  await Promise.all([fetchUnits(), fetchFloors(), fetchUsers()])
})
</script>