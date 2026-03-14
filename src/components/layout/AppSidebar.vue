<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useAppShell } from '@/composables/useAppShell.js'
import { usePermissions } from '@/composables/usePermissions.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { drawerOpen, isDark, toggleDarkMode } = useAppShell()
const { canAccess } = usePermissions()

const appName = import.meta.env.VITE_APP_NAME || 'App'

// Navigation — wird von Claude erweitert wenn neue Module hinzugefügt werden
const allNavItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  // Neue Module hier einfügen:
  // { title: 'Kunden', icon: 'mdi-account-group', to: '/kunden', module: 'kunden' },
]

const navItems = computed(() =>
  allNavItems.filter((item) => !item.module || canAccess(item.module)),
)

const settingsItems = [
  { title: 'Benutzer', icon: 'mdi-account-cog-outline', to: '/einstellungen/benutzer' },
  { title: 'Design', icon: 'mdi-palette', to: '/einstellungen/design' },
]

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    :width="220"
    class="aw-sidebar"
  >
    <!-- Logo / App Name -->
    <div class="aw-sidebar-header" @click="router.push('/dashboard')">
      <v-icon size="28" color="white" class="mr-2">mdi-apps</v-icon>
      <span class="aw-sidebar-title">{{ appName }}</span>
    </div>

    <v-divider class="my-1" style="border-color: var(--aw-sidebar-active-bg)" />

    <!-- Haupt-Navigation -->
    <v-list density="compact" nav class="px-2">
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        class="aw-nav-item"
        :active="route.path.startsWith(item.to)"
      />
    </v-list>

    <template #append>
      <v-divider class="mb-1" style="border-color: var(--aw-sidebar-active-bg)" />

      <!-- Einstellungen -->
      <v-list density="compact" nav class="px-2">
        <v-list-item
          v-for="item in settingsItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="aw-nav-item"
          :active="route.path.startsWith(item.to)"
        />
      </v-list>

      <!-- User + Actions -->
      <div class="aw-sidebar-footer">
        <div class="aw-user-info" v-if="auth.user" @click="router.push('/profil')" style="cursor: pointer">
          <v-icon size="18" class="mr-2">mdi-account-circle</v-icon>
          <span class="text-truncate text-body-2">{{ auth.user.name || auth.user.email }}</span>
        </div>
        <div class="aw-footer-actions">
          <v-btn
            variant="text"
            size="small"
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            @click="toggleDarkMode"
            class="aw-logout-btn"
          />
          <v-btn
            variant="text"
            size="small"
            icon="mdi-logout"
            @click="handleLogout"
            class="aw-logout-btn"
          />
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.aw-sidebar {
  background: var(--aw-sidebar-bg) !important;
  border-right: none !important;
}

.aw-sidebar-header {
  display: flex;
  align-items: center;
  padding: var(--aw-space-md) var(--aw-space-md) var(--aw-space-sm);
  cursor: pointer;
}

.aw-sidebar-title {
  font-size: var(--aw-typo-body-size);
  font-weight: 600;
  color: var(--aw-sidebar-active-text);
  letter-spacing: -0.01em;
}

.aw-nav-item {
  color: var(--aw-sidebar-text) !important;
  margin-bottom: 2px;
}

.aw-nav-item:hover {
  background: var(--aw-sidebar-active-bg) !important;
}

.aw-nav-item.v-list-item--active {
  background: var(--aw-sidebar-active-bg) !important;
  color: var(--aw-sidebar-active-text) !important;
}

.aw-sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--aw-space-xs) var(--aw-space-sm) var(--aw-space-sm);
}

.aw-user-info {
  display: flex;
  align-items: center;
  color: var(--aw-sidebar-text);
  overflow: hidden;
  flex: 1;
}

.aw-footer-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.aw-logout-btn {
  color: var(--aw-sidebar-text) !important;
  opacity: 0.6;
}

.aw-logout-btn:hover {
  opacity: 1;
}
</style>
