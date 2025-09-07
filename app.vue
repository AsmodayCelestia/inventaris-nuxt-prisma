<template>
  <AppLayout v-if="!isAuthPage">
    <NuxtPage />
  </AppLayout>

  <!-- Kalau halaman login -->
  <div v-else class="min-h-screen grid place-items-center bg-gray-100">
    <NuxtPage />
  </div>
</template>

<script setup>
import AppLayout from '~/components/AppLayout.vue'
const route = useRoute()

// daftar path yang gak perlu layout
const noLayoutPages = ['/login']
const isAuthPage = computed(() => noLayoutPages.includes(route.path))
</script>
