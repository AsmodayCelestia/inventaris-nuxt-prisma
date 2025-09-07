<script setup>
const { initializeAuth, isLoggedIn } = useAuth()
const token = useCookie('auth-token')

onNuxtReady(async () => {
  if (!token.value) {
    // === first-time visitor : instan ===
    return navigateTo('/login', { replace: true })
  }

  // === returning user : validasi dulu ===
  await initializeAuth()
  if (isLoggedIn.value) {
    return navigateTo('/dashboard', { replace: true })
  } else {
    // cookie ternyata invalid
    return navigateTo('/login', { replace: true })
  }
})
</script>