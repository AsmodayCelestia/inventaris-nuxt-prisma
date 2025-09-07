<template>
  <!-- 1. static splash – center, teks & animasi invisible dulu -->
  <div
    id="splash"
    class="fixed inset-0 z-[9999] grid place-items-center
           bg-black/60 backdrop-blur-sm opacity-0"
  >
    <div class="text-center scale-125 opacity-0">
      <lottie-player
        src="/loading.json"
        background="transparent"
        speed="1"
        style="width:180px;height:180px"
        autoplay
      ></lottie-player>
      <p class="mt-4 text-sm text-white">Preparing your workspace…</p>
    </div>
  </div>

  <!-- 2. Vue App – baru dipasang setelah redirect selesai -->
  <div v-if="!isNavigating">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { authReady } = useAuth()
const isNavigating = ref(true)   // blocker

onMounted(() => {
  const el = document.getElementById('splash')
  if (el) el.classList.replace('opacity-0', 'opacity-100')
})

watchEffect(() => {
  if (authReady.value) {
    isNavigating.value = false        // lepas blocker
    document.getElementById('splash')?.remove()
  }
})
</script>