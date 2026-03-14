<script setup>
import { useAppShell } from '@/composables/useAppShell.js'

const model = defineModel({ type: String, default: 'sidebar' })
const { setLayout } = useAppShell()

const layouts = [
  {
    value: 'sidebar',
    title: 'Sidebar',
    desc: 'Klassisches Layout mit dunkler Seitenleiste links',
    icon: 'mdi-page-layout-sidebar-left',
  },
  {
    value: 'topbar',
    title: 'Topbar',
    desc: 'Horizontale Navigation oben, volle Breite',
    icon: 'mdi-page-layout-header',
  },
  {
    value: 'minimal',
    title: 'Minimal',
    desc: 'Nur Logo und Content, ideal für Onboarding',
    icon: 'mdi-page-layout-body',
  },
]

function selectLayout(value) {
  model.value = value
  setLayout(value)
}
</script>

<template>
  <v-row>
    <v-col
      v-for="layout in layouts"
      :key="layout.value"
      cols="12"
      md="4"
    >
      <v-card
        :variant="model === layout.value ? 'flat' : 'outlined'"
        :color="model === layout.value ? 'primary' : undefined"
        rounded="lg"
        class="pa-6 cursor-pointer"
        :class="{ 'aw-layout-active': model === layout.value }"
        @click="selectLayout(layout.value)"
      >
        <div class="text-center">
          <v-icon :icon="layout.icon" size="48" class="mb-3" />
          <h3 class="text-body-1 font-weight-bold">{{ layout.title }}</h3>
          <p class="text-body-2 mt-1" :class="model === layout.value ? '' : 'text-medium-emphasis'">
            {{ layout.desc }}
          </p>
        </div>

        <div class="d-flex justify-center mt-4">
          <v-radio
            :model-value="model === layout.value"
            :value="true"
            hide-details
            density="compact"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.aw-layout-active {
  border: 2px solid var(--aw-primary) !important;
}
</style>
