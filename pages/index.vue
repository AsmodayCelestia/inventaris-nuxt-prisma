<script setup>
const { initializeAuth, isLoggedIn } = useAuth()

// 1. client saja
onMounted(async () => {
  await initializeAuth()
  if (isLoggedIn.value) {
    await navigateTo('/dashboard', { replace: true })
  } else {
    await navigateTo('/login', { replace: true })
  }
})
</script>

<template>
  <div class="min-h-screen grid place-items-center text-sm text-slate-600">
    Redirecting…
  </div>
</template>