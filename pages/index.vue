<!-- pages/index.vue -->
<script setup>
// 1. cek cookie & ambil user di server
const { initializeAuth, isLoggedIn } = useAuth()
if (process.server) await initializeAuth()

// 2. redirect sesuai status
if (isLoggedIn.value) {
  await navigateTo('/dashboard', { replace: true })
} else {
  await navigateTo('/login', { replace: true })
}
</script>

<template>
  <p>Redirecting…</p>
</template>