// nuxt.config.js
export default {
  compatibilityDate: '2025-09-02',
  devtools: { enabled: false },

  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    },
  },

  css: ['~/assets/css/tailwind.css'],
  ui: { icons: ['heroicons'] },

  /* --- yang baru --- */
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'lottie-player',
    },
  },

  app: {
    head: {
      script: [
        {
          src: 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
          defer: true,
        },
      ],
    },
  },
}