<!-- ~/pages/login.vue -->
<template>
  <main class="min-h-screen grid place-items-center relative overflow-hidden
               bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">

    <!-- decorative blur -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"/>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"/>

    <!-- card -->
    <section class="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl
                    rounded-2xl shadow-2xl border border-white/10 p-8 md:p-10">

      <!-- header -->
      <header class="text-center mb-8">
        <div class="mx-auto mb-4 grid h-14 w-14 place-items-center
                    rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500">
          <UIcon name="i-heroicons-lock-closed" class="h-7 w-7 text-white"/>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
        <p class="mt-1 text-sm text-slate-300">Sign in to continue your journey</p>
      </header>

      <!-- form -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <!-- email -->
        <UInput
          v-model="email"
          type="email"
          placeholder="Email address"
          required
          size="lg"
          icon="i-heroicons-envelope"
          variant="none"
          :ui="{
            rounded: 'rounded-lg',
            base: 'bg-white/5 border border-white/20 text-white placeholder-slate-400',
            focus: 'ring-2 ring-indigo-500',
            leading: { icon: 'text-slate-400' }
          }"
        />

        <!-- password -->
        <UInput
          v-model="password"
          type="password"
          placeholder="Password"
          required
          minlength="6"
          size="lg"
          icon="i-heroicons-key"
          variant="none"
          :ui="{
            rounded: 'rounded-lg',
            base: 'bg-white/5 border border-white/20 text-white placeholder-slate-400',
            focus: 'ring-2 ring-indigo-500',
            leading: { icon: 'text-slate-400' }
          }"
        />

        <!-- error -->
        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
          :close-button="null"
        />

        <!-- submit -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          :label="isLoading ? 'Signing in…' : 'Sign in'"
          class="justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500
                 disabled:bg-indigo-400/50 disabled:cursor-not-allowed
                 transition"
        />
      </form>
    </section>
  </main>
</template>

<script setup>
definePageMeta({ layout: false })
useSeoMeta({ title: 'Login' })

const email      = ref('')
const password   = ref('')
const error      = ref('')
const isLoading  = ref(false)

/* ---------- gunakan fungsi login dari useAuth() ---------- */
const { login } = useAuth()

async function handleLogin() {
  try {
    error.value = ''
    isLoading.value = true
    await login(email.value, password.value) // otomatis simpan token & authUser
    await navigateTo('/dashboard')
  } catch (e) {
    error.value = e?.data?.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>