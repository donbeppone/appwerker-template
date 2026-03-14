<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

defineProps({
  title: { type: String, default: '' },
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const appName = import.meta.env.VITE_APP_NAME || 'App'

const navItems = [
  { title: 'Dashboard', to: '/dashboard' },
]

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <v-app-bar flat density="compact" class="aw-topbar-full">
    <div class="aw-topbar-brand" @click="router.push('/dashboard')">
      <v-icon size="24" class="mr-2">mdi-apps</v-icon>
      <span class="font-weight-bold">{{ appName }}</span>
    </div>

    <v-tabs class="ml-4">
      <v-tab
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-spacer />

    <slot name="actions" />

    <v-btn icon="mdi-logout" size="small" variant="text" @click="handleLogout" />
  </v-app-bar>

  <v-main>
    <slot />
  </v-main>
</template>

<style scoped>
.aw-topbar-full {
  background: var(--aw-surface) !important;
  border-bottom: 1px solid var(--aw-border) !important;
}

.aw-topbar-brand {
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  color: var(--aw-text);
}
</style>
