<template>
  <div class="grid place-items-center">
    <lottie-player
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
defineProps({ text: { type: String, default: 'Loading...' } })
</script>