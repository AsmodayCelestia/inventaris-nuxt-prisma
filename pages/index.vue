<script setup>
// cuma redirect otomatis ke dashboard
// (middleware global sudah pastikan user login dulu)
await navigateTo('/dashboard', { replace: true })
</script>