<!-- components/CategoryForm.vue -->
<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ editData ? 'Edit Kategori' : 'Tambah Kategori' }}</h5>
      </template>

      <UForm :state="form" @submit="handleSubmit">
        <UFormGroup label="Nama Kategori" name="name" required>
          <UInput v-model="form.name" placeholder="Contoh: Elektronik" />
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-4">
          <UButton variant="ghost" @click="$emit('close')">Batal</UButton>
          <UButton type="submit" :loading="loading">Simpan</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useCategories } from '~/composables/useCategories'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createCategory, updateCategory } = useCategories()
const loading = ref(false)
const form = reactive({ id: null, name: '' })

watch(() => props.editData, (val) => {
  form.id = val?.id || null
  form.name = val?.name || ''
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  try {
    if (form.id) await updateCategory(form.id, { name: form.name })
    else await createCategory({ name: form.name })
    emit('saved')
  } finally {
    loading.value = false
  }
}
</script>