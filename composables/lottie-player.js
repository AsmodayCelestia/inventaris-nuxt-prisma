// composables/load-lottie.client.ts
export default async function () {
  if (process.client && !customElements.get('lottie-player')) {
    await import('@lottiefiles/lottie-player')
  }
}