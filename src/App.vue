<script setup>
import { onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useDesignStore } from '@/stores/design.js'
import { syncVuetifyTheme } from '@/lib/designTokens.js'
import ToastContainer from '@/components/shared/ToastContainer.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'

const design = useDesignStore()
const theme = useTheme()

// Vuetify-Theme synchronisieren wenn Tokens sich ändern
watch(() => design.tokens, (newTokens) => {
  syncVuetifyTheme(theme, newTokens)
}, { deep: true })

onMounted(async () => {
  await design.fetchTokens()
  syncVuetifyTheme(theme, design.tokens)
})
</script>

<template>
  <v-app>
    <router-view />
    <ToastContainer />
    <ConfirmDialog />
  </v-app>
</template>
