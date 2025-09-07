<!-- components/FloorForm.vue -->
<template>
  <UModal :modelValue="true" @close="$emit('close')">
    <UCard>
      <template #header>
        <h5>{{ editData ? 'Edit Lantai' : 'Tambah Lantai' }}</h5>
      </template>

      <UForm :state="form" @submit="submit">
        <UFormGroup label="Nama Lantai" name="number" required>
          <UInput v-model="form.number" placeholder="Contoh: Lantai 1" />
        </UFormGroup>

        <UFormGroup label="Unit" name="unit_id" required class="mt-4">
          <USelectMenu
            v-model="form.unit_id"
            :options="units"
            placeholder="Pilih Unit"
            value-attribute="id"
            option-attribute="name"
          />
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
import { reactive, computed, ref } from 'vue'
import { useUnits } from '~/composables/useUnits'
import { useFloors } from '~/composables/useFloors'

const props = defineProps({ editData: Object })
const emit  = defineEmits(['close', 'saved'])

const { units, fetchUnits } = useUnits() // <-- tarik fetchUnits
const { createFloor, updateFloor } = useFloors()

// fetch unit list segera
await fetchUnits()

const isEdit  = computed(() => !!props.editData)
const pending = ref(false)

const form = reactive({
  number: props.editData?.number || '',
  unit_id: props.editData?.unit_id || null
})

const submit = async () => {
  pending.value = true
  try {
    if (isEdit.value) await updateFloor(props.editData.id, { ...form })
    else await createFloor({ ...form })
    emit('saved')
  } finally {
    pending.value = false
  }
}
</script>