<script setup>
defineProps({
  text: { type: String, default: 'Laden...' },
})
</script>

<template>
  <div class="aw-loading-state">
    <v-progress-circular indeterminate color="primary" size="40" />
    <p class="text-body-2 text-medium-emphasis mt-4">{{ text }}</p>
  </div>
</template>

<style scoped>
.aw-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--aw-space-2xl) var(--aw-space-lg);
}
</style>
