<template>
  <!-- 1. overlay saat auth belum ready (tetap) -->
  <Transition
    enter-from-class="opacity-0"
    enter-active-class="duration-300"
    leave-active-class="duration-300"
    leave-to-class="opacity-0"
  >
    <div
      v-if="!authReady"
      class="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur"
    >
      <LoadingLottie text="Preparing your workspace…" />
    </div>
  </Transition>

  <!-- 2. overlay SAAT HALAMAN FETCH (baru) -->
  <Transition
    enter-from-class="opacity-0"
    enter-active-class="duration-300"
    leave-active-class="duration-300"
    leave-to-class="opacity-0"
  >
    <div
      v-if="pageLoading"
      class="fixed inset-0 z-40 grid place-items-center bg-black/80 backdrop-blur-sm"
    >
      <LoadingLottie text="Loading page…" />
    </div>
  </Transition>

  <!-- 3. layout utama (AppLayout) -->
  <AppLayout>
    <NuxtPage />
  </AppLayout>
</template>

<script setup>
const { authReady, initializeAuth, pageLoading } = useAuth()

if (process.server) await initializeAuth()
onMounted(() => { if (!authReady.value) initializeAuth() })
</script>