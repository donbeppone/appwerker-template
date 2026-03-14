<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppShell } from '@/composables/useAppShell.js'
import SidebarLayout from './SidebarLayout.vue'
import TopbarLayout from './TopbarLayout.vue'
import MinimalLayout from './MinimalLayout.vue'

const route = useRoute()
const { activeLayout } = useAppShell()

const layoutComponents = {
  sidebar: SidebarLayout,
  topbar: TopbarLayout,
  minimal: MinimalLayout,
}

const currentLayout = computed(() => layoutComponents[activeLayout.value] || SidebarLayout)
const pageTitle = computed(() => route.meta.title || '')
</script>

<template>
  <component :is="currentLayout" :title="pageTitle">
    <template #actions>
      <slot name="actions" />
    </template>
    <router-view />
  </component>
</template>
