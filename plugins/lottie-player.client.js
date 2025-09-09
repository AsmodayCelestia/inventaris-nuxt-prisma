// plugins/lottie-player.js
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    import('@lottiefiles/lottie-player')
  }
})