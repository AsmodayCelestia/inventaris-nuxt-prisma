<template>
  <NuxtLayout v-if="!isAuthPage">
    <NuxtPage />
  </NuxtLayout>

  <!-- login page tanpa layout -->
  <div v-else class="min-h-screen grid place-items-center bg-gray-100">
    <NuxtPage />
  </div>
</template>

<script setup>
import AppLayout from '~/components/AppLayout.vue'
const route = useRoute()
const publicPages = ['/login']
const isAuthPage = computed(() => publicPages.includes(route.path))
</script>