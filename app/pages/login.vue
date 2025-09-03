<!-- ~/app/pages/login.vue -->
<template>
  <main
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4"
  >
    <div
      class="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6"
    >
      <h1 class="text-3xl font-bold text-center text-white">Welcome back</h1>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <!-- Email -->
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
            required
            minlength="6"
            class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-sm text-red-400 text-center">{{ error }}</p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          :class="[
            'w-full py-3 rounded-lg font-semibold transition',
            isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          ]"
        >
          {{ isLoading ? 'Logging in…' : 'Log in' }}
        </button>
      </form>
    </div>
  </main>
</template>

<!-- app/pages/login.vue -->
<script setup>
definePageMeta({ layout: false })

const email    = ref('')
const password = ref('')
const error    = ref('')
const isLoading = ref(false)

async function handleLogin () {
  try {
    const { token } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    const authCookie = useCookie('auth-token', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    authCookie.value = token

    console.log('redirect triggered')
    await navigateTo('/dashboard')
  } catch (e) {
    error.value = e?.data?.message || 'Login gagal'
  }
}
</script>

<style scoped>
/* Tambahan jika belum punya Tailwind di global css */
@import 'tailwindcss/tailwind.css';
</style>