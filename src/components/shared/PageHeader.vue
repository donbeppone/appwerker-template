<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="aw-page-header">
    <div>
      <h1 class="text-h5 font-weight-bold">{{ title }}</h1>
      <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1">{{ subtitle }}</p>
    </div>
    <div class="aw-page-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.aw-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--aw-space-lg) var(--aw-space-lg) var(--aw-space-md);
}

.aw-page-actions {
  display: flex;
  gap: var(--aw-space-sm);
  align-items: center;
}
</style>
