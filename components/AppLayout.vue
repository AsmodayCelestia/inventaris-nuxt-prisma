<template>
  <!-- 1. Tahan SEMUA sampai auth siap -->
  <div v-if="!authReady" class="min-h-screen flex items-center justify-center">
    <div class="text-sm text-slate-600">Loading...</div>
  </div>

  <!-- 2. Kalau sudah ready baru tampil full layout -->
  <div v-else class="min-h-screen bg-gray-100">
    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/40 z-30"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      ref="sidebarEl"
      class="w-64 bg-slate-800 text-slate-100 flex flex-col shadow-2xl
             fixed inset-y-0 left-0 z-40
             transition-transform duration-300"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Brand -->
      <div class="h-16 flex items-center px-4 gap-3 border-b border-slate-700">
        <img
          src="https://placehold.co/36x36/ffffff/0ea5e9?text=I "
          alt="Logo"
          class="w-9 h-9 rounded"
        >
        <span class="font-semibold tracking-wide">Inventaris</span>
      </div>

      <!-- User panel -->
      <div class="p-4 flex items-center gap-3 border-b border-slate-700">
        <img
          src="https://placehold.co/40x40/cccccc/ffffff?text=U "
          class="w-10 h-10 rounded-full"
        >
        <div>
          <div class="text-sm font-semibold">{{ userName }}</div>
          <div class="text-xs text-slate-300">{{ userRole }}</div>
        </div>
      </div>

      <!-- Menu -->
      <nav class="flex-1 px-2 py-4 space-y-1 text-sm">
        <template v-for="m in menu" :key="m.label">
          <!-- single link -->
          <NuxtLink
            v-if="!m.children"
            :to="m.to"
            class="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-700"
            :class="$route.path === m.to ? 'bg-slate-700 text-white' : 'text-slate-300'"
          >
            <component :is="m.icon" class="w-5 h-5" />
            <span>{{ m.label }}</span>
          </NuxtLink>

          <!-- dropdown -->
          <div v-else>
            <button
              @click="toggle(m.label)"
              class="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-700 text-left"
              :class="open[m.label] ? 'bg-slate-700 text-white' : 'text-slate-300'"
            >
              <component :is="m.icon" class="w-5 h-5" />
              <span class="flex-1">{{ m.label }}</span>
              <ChevronRightIcon class="w-4 h-4 transition" :class="open[m.label] ? 'rotate-90' : ''" />
            </button>
            <Collapse :show="open[m.label]">
              <div class="pl-6 mt-1 space-y-1">
                <NuxtLink
                  v-for="c in m.children"
                  :key="c.to"
                  :to="c.to"
                  class="block px-3 py-1.5 rounded text-slate-300 hover:bg-slate-700 hover:text-white"
                  :class="$route.path === c.to ? 'bg-slate-700 text-white' : ''"
                >
                  {{ c.label }}
                </NuxtLink>
              </div>
            </Collapse>
          </div>
        </template>
      </nav>
    </aside>

    <!-- Page Wrapper -->
    <div class="flex flex-col">
      <!-- Topbar -->
    <header class="h-14 bg-white shadow flex items-center justify-between px-4">
        <div class="flex items-center gap-3">
        <button @click="sidebarOpen = !sidebarOpen" class="text-slate-600">
            <Bars3Icon class="w-6 h-6" />
        </button>
        <!-- judul dinamis & di kiri -->
        <div class="text-sm text-slate-700 capitalize">
            {{ pageTitle }}
        </div>
        </div>

        <div class="flex items-center gap-3">
        <span class="text-sm text-slate-700">Halo, <b>{{ userName }}</b></span>
        <UButton label="Logout" color="gray" size="xs" @click="logout" />
        </div>
    </header>

      <!-- Content -->
      <main class="flex-1 p-4 overflow-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="h-10 bg-white border-t flex items-center px-4 text-xs text-slate-500">
        © {{ new Date().getFullYear() }} Inventaris APP
      </footer>
    </div>
  </div>
</template>

<script setup>
/* ---------- Icon ---------- */
import {
  Bars3Icon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

/* ---------- Auth & Menu ---------- */
const { userName, userRole, logout, authReady } = useAuth()
const { menu } = useMenu()          // icon sudah komponen Vue

/* ---------- Collapse ---------- */
const open = reactive({})
const toggle = (key) => (open[key] = !open[key])

/* ---------- Sidebar state & click-outside ---------- */
const sidebarOpen = ref(false)
const sidebarEl = ref(null)
onClickOutside(sidebarEl, () => (sidebarOpen.value = false))

const route = useRoute()
const pageTitle = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  if (!parts.length) return 'Dashboard'
  // ambil segmen terakhir
  const last = parts[parts.length - 1]
  return last.replace(/-/g, ' ')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>