<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ isEdit ? 'Edit Pengguna' : 'Tambah Pengguna' }}</h5>
      </template>

      <UForm :state="form" @submit="submit">
        <UFormGroup label="Nama" name="name" required>
          <UInput v-model="form.name" placeholder="Nama lengkap" />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required class="mt-4">
          <UInput v-model="form.email" type="email" placeholder="email@domain.com" />
        </UFormGroup>

        <UFormGroup v-if="!isEdit" label="Password" name="password" required class="mt-4">
          <UInput v-model="form.password" type="password" placeholder="Min. 6 karakter" />
        </UFormGroup>

        <UFormGroup v-if="!isEdit" label="Konfirmasi Password" name="password_confirmation" required class="mt-4">
          <UInput v-model="form.password_confirmation" type="password" />
        </UFormGroup>

        <UFormGroup label="Role" name="role" required class="mt-4">
          <USelectMenu
            v-model="form.role"
            :options="roleOpts"
            placeholder="Pilih Role"
            value-attribute="value"
            option-attribute="label"
          />
        </UFormGroup>

        <UFormGroup label="Divisi" name="division_id" required class="mt-4">
          <USelectMenu
            v-model="form.division_id"
            :options="divisions"
            placeholder="Pilih Divisi"
            value-attribute="id"
            option-attribute="name"
          />
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-6">
          <UButton variant="ghost" @click="$emit('close')">Batal</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Update' : 'Simpan' }}</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useUsers } from '~/composables/useUsers'
import { useDivisions } from '~/composables/useDivisions'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createUser, updateUser } = useUsers()
const { divisions, fetchDivisions } = useDivisions()

const roleOpts = [
  { value: 'admin', label: 'Admin' },
  { value: 'head', label: 'Kepala Unit' },
  { value: 'karyawan', label: 'Karyawan' }
]

const isEdit = computed(() => !!props.editData)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
  division_id: ''
})

const pending = ref(false)

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    division_id: ''
  })
}

const loadEdit = () => {
  if (props.editData) {
    form.name = props.editData.name
    form.email = props.editData.email
    form.role = props.editData.role
    form.division_id = props.editData.division_id || ''
    form.password = ''
    form.password_confirmation = ''
  } else {
    resetForm()
  }
}

const submit = async () => {
  pending.value = true
  try {
    const payload = { ...form }
    if (isEdit.value && !payload.password) {
      delete payload.password
      delete payload.password_confirmation
    }
    isEdit.value
      ? await updateUser(props.editData.id, payload)
      : await createUser(payload)
    emit('saved')
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  await fetchDivisions()
  loadEdit()
})
</script>