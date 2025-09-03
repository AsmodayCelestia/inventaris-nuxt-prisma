<!-- pages/index.vue -->
<script setup>
onMounted(() => {
  navigateTo('/login', { external: false, replace: true })
})
</script>

<template>
  <p>Redirecting…</p>
</template>