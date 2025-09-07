<template>
  <!-- 1. static splash – center, tapi teks & animasi invisible dulu -->
  <div
    id="splash"
    class="fixed inset-0 z-[9999] grid place-items-center
           bg-black/60 backdrop-blur-sm
           opacity-0"         
  >
    <div class="text-center scale-125 opacity-0"> <!-- ← kontainer juga hidden -->
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

  <!-- 2. Vue App -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { authReady } = useAuth()

onMounted(() => {
  // begitu Vue siap, baru fade-in 1 frame
  const el = document.getElementById('splash')
  if (el) el.classList.replace('opacity-0', 'opacity-100')

  // hapus element setelah auth selesai
  watchEffect(() => {
    if (authReady.value) el?.remove()
  })
})
</script>