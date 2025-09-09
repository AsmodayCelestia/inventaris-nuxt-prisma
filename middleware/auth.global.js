import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { initializeAuth, authUser } = useAuth()

  // skip fetch TAPI tetap tunggu animasi selesai
if (!authUser.value) await initializeAuth() // <- animasi 700 ms hanya sekali

  if (!useAuth().isLoggedIn.value && to.path !== '/login') return navigateTo('/login')
  if (useAuth().isLoggedIn.value && to.path === '/login') return navigateTo('/dashboard')
})