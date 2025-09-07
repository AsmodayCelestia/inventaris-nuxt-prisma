<!-- components/BrandForm.vue -->
<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ editData ? 'Edit Merk' : 'Tambah Merk' }}</h5>
      </template>

      <UForm :state="form" @submit="submitForm">
        <UFormGroup label="Nama Merk" name="name" required>
          <UInput v-model="form.name" placeholder="Contoh: Samsung" />
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-4">
          <UButton variant="ghost" @click="$emit('close')">Batal</UButton>
          <UButton type="submit" :loading="loading">{{ editData ? 'Update' : 'Simpan' }}</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useBrands } from '~/composables/useBrands'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createBrand, updateBrand } = useBrands()
const loading = ref(false)
const form = reactive({ name: '' })

watch(() => props.editData, (val) => {
  form.name = val?.name || ''
}, { immediate: true })

const submitForm = async () => {
  loading.value = true
  try {
    if (props.editData) await updateBrand(props.editData.id, form)
    else await createBrand(form)
    emit('saved')
  } finally {
    loading.value = false
  }
}
</script>