<script setup>
defineProps({
  icon: { type: String, default: 'mdi-inbox-outline' },
  title: { type: String, default: 'Keine Daten' },
  subtitle: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
})

defineEmits(['action'])
</script>

<template>
  <div class="aw-empty-state">
    <v-icon :icon="icon" size="64" color="grey-lighten-1" />
    <h3 class="text-h6 mt-4 text-medium-emphasis">{{ title }}</h3>
    <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1">{{ subtitle }}</p>
    <v-btn
      v-if="actionLabel"
      color="primary"
      variant="flat"
      class="mt-4"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<style scoped>
.aw-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--aw-space-2xl) var(--aw-space-lg);
  text-align: center;
}
</style>
