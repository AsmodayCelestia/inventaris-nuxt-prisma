// nuxt.config.js  (CommonJS style)
export default {
  compatibilityDate: '2025-09-02',
  devtools: { enabled: false },

  modules: [
    '@nuxt/ui',     // ← cukup ini
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    },
  },
  css: ['~/assets/css/tailwind.css'], // boleh kosong/override kamu
  ui: { icons: ['heroicons'] }
}