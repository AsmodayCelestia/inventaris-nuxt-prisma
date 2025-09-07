<template>
  <div class="grid place-items-center">
    <!-- player baru dibuat setelah load -->
    <lottie-player
      v-if="mounted"
      src="/loading.json"
      background="transparent"
      speed="1"
      style="width:120px;height:120px"
      loop
      autoplay
    />
    <p class="mt-2 text-sm text-slate-600">{{ text }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import loadLottie from '@/composables/lottie-player'

defineProps({ text: { type: String, default: 'Loading...' } })

const mounted = ref(false)
onMounted(async () => {
  await loadLottie()   // muat player
  mounted.value = true // baru render tag <lottie-player>
})
</script>