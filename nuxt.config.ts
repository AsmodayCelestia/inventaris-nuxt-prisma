import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  alias: {
    '#prisma': './app/generated/prisma/index.js'
  },
  compatibilityDate: '2025-09-02'
})