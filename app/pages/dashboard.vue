<!-- app/pages/dashboard.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
    <h1 class="text-6xl font-extrabold text-white animate-pulse">DUARR MEMEK!!!!!!</h1>

    <button
      class="mt-8 px-6 py-3 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:bg-purple-100 transition"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
const token = useCookie('auth-token')

const logout = () => {
  token.value = null
  navigateTo('/login')
}
</script>