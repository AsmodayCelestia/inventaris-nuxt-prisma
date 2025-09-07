<!-- components/UnitForm.vue -->
<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ editData ? 'Edit Unit Lokasi' : 'Tambah Unit Lokasi' }}</h5>
      </template>

      <UForm :state="form" @submit="submit">
        <UFormGroup label="Nama Unit" name="name" required>
          <UInput v-model="form.name" placeholder="Contoh: Unit A" />
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
import { useUnits } from '~/composables/useUnits'

const props = defineProps({ editData: Object })
const emit  = defineEmits(['close', 'saved'])

const { createUnit, updateUnit } = useUnits()

const isEdit  = computed(() => !!props.editData)
const pending = ref(false)

const form = reactive({ name: props.editData?.name || '' })

const submit = async () => {
  pending.value = true
  try {
    if (isEdit.value) await updateUnit(props.editData.id, { ...form })
    else await createUnit({ ...form })
    emit('saved')
  } finally {
    pending.value = false
  }
}
</script>