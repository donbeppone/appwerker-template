<script setup>
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <AppSidebar />
  <AppTopbar :title="title">
    <template #actions>
      <slot name="actions" />
    </template>
  </AppTopbar>
  <v-main>
    <slot />
  </v-main>
</template>
