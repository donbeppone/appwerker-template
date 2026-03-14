<script setup>
const appName = import.meta.env.VITE_APP_NAME || 'App'
</script>

<template>
  <v-main>
    <div class="aw-minimal-header">
      <v-icon size="24" class="mr-2" color="primary">mdi-apps</v-icon>
      <span class="font-weight-bold">{{ appName }}</span>
    </div>
    <slot />
  </v-main>
</template>

<style scoped>
.aw-minimal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--aw-space-lg);
  color: var(--aw-text);
}
</style>
