<script setup>
import { useAppShell } from '@/composables/useAppShell.js'

defineProps({
  title: { type: String, default: '' },
})

const { drawerOpen, toggleDrawer, activeLayout } = useAppShell()
</script>

<template>
  <v-app-bar
    flat
    density="compact"
    class="aw-topbar"
  >
    <v-app-bar-nav-icon
      v-if="activeLayout === 'sidebar'"
      @click="toggleDrawer"
      size="small"
    />

    <v-app-bar-title class="aw-topbar-title">
      <span class="aw-title-accent" />
      {{ title }}
    </v-app-bar-title>

    <template #append>
      <slot name="actions" />
    </template>
  </v-app-bar>
</template>

<style scoped>
.aw-topbar {
  background: var(--aw-surface) !important;
  border-bottom: 1px solid var(--aw-border) !important;
}

.aw-topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--aw-text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.aw-title-accent {
  width: 3px;
  height: 16px;
  background: var(--aw-primary);
  border-radius: 2px;
  flex-shrink: 0;
}
</style>
