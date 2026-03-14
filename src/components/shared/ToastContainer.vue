<script setup>
import { useToastStore } from '@/stores/toast.js'

const toast = useToastStore()

const colorMap = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const iconMap = {
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  warning: 'mdi-alert',
  info: 'mdi-information',
}
</script>

<template>
  <div class="aw-toast-container">
    <transition-group name="toast">
      <v-alert
        v-for="item in toast.queue"
        :key="item.id"
        :type="item.severity"
        :icon="iconMap[item.severity] || 'mdi-information'"
        :title="item.summary"
        :text="item.detail"
        closable
        density="compact"
        class="aw-toast mb-2"
        @click:close="toast.remove(item.id)"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.aw-toast-container {
  position: fixed;
  bottom: var(--aw-space-lg);
  right: var(--aw-space-lg);
  z-index: 9999;
  max-width: 400px;
}

.aw-toast {
  box-shadow: var(--aw-shadow);
  border-radius: var(--aw-radius) !important;
}

.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
