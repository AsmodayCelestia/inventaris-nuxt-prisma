<!-- components/DivisionForm.vue -->
<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ isEdit ? 'Edit Divisi' : 'Tambah Divisi' }}</h5>
      </template>

      <UForm :state="form" @submit="submit">
        <UFormGroup label="Nama Divisi" name="name" required>
          <UInput v-model="form.name" placeholder="Contoh: IT" />
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-4">
          <UButton variant="ghost" @click="$emit('close')">Batal</UButton>
          <UButton type="submit" :loading="pending">{{ isEdit ? 'Update' : 'Simpan' }}</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({ editData: Object })
const emit   = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.editData)

const form   = reactive({ name: props.editData?.name || '' })
const pending = ref(false)

const submit = async () => {
  pending.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/divisions/${props.editData.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/divisions', { method: 'POST', body: form })
    }
    emit('saved')
  } finally {
    pending.value = false
  }
}
</script>