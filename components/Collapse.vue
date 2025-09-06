<template>
  <Transition name="collapse">
    <div v-show="show">
      <slot />
    </div>
  </Transition>
</template>

<script setup>
defineProps({ show: Boolean })
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height .25s ease;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
}
</style>