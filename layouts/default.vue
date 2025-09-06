<!-- layouts/default.vue -->
<template>
  <div v-if="!authReady" class="min-h-screen flex items-center justify-center">
    <p class="text-sm text-slate-600">Loading...</p>
  </div>
  <AppLayout v-else>
    <slot />
  </AppLayout>
</template>

<script setup>
const { authReady, initializeAuth } = useAuth()

// SSR: bawa cookie → auth langsung ready
if (process.server) await initializeAuth()

// client: jika SSR gagal / navigasi client-side
onMounted(() => {
  if (!authReady.value) initializeAuth()
})
</script>