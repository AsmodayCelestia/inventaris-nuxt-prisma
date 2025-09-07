<template>
  <AppLayout>
    <NuxtPage />   <!-- konten halaman di sini -->
  </AppLayout>
</template>

<script setup>
const { authReady, initializeAuth } = useAuth()
if (process.server) await initializeAuth()
onMounted(() => { if (!authReady.value) initializeAuth() })
</script>