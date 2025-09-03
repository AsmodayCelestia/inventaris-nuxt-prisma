// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-09-02',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css']
})