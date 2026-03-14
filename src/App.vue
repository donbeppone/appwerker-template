<script setup>
import { onMounted } from 'vue'
import { useDesignStore } from '@/stores/design.js'
import ToastContainer from '@/components/shared/ToastContainer.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'

const design = useDesignStore()

onMounted(async () => {
  await design.fetchTokens()
})
</script>

<template>
  <v-app>
    <router-view />
    <ToastContainer />
    <ConfirmDialog />
  </v-app>
</template>
