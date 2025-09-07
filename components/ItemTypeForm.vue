<!-- components/ItemTypeForm.vue -->
<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ editData ? 'Edit Jenis Barang' : 'Tambah Jenis Barang' }}</h5>
      </template>

      <UForm :state="form" @submit="submit">
        <UFormGroup label="Nama Jenis" name="name" required>
          <UInput v-model="form.name" placeholder="Contoh: Elektronik, Otomotif, dll" />
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
import { useItemTypes } from '~/composables/useItemTypes'

const props = defineProps({ editData: Object })
const emit  = defineEmits(['close', 'saved'])

const { createItemType, updateItemType } = useItemTypes()

const isEdit  = computed(() => !!props.editData)
const pending = ref(false)

const form = reactive({ name: props.editData?.name || '' })

const submit = async () => {
  pending.value = true
  try {
    if (isEdit.value) await updateItemType(props.editData.id, { ...form })
    else await createItemType({ ...form })
    emit('saved')
  } finally {
    pending.value = false
  }
}
</script>