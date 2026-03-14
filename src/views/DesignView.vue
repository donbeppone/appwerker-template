<script setup>
import { onMounted, computed } from 'vue'
import { useDesignStore } from '@/stores/design.js'
import { useAutoSave } from '@/composables/useAutoSave.js'
import { useToast } from '@/composables/useToast.js'
import PageHeader from '@/components/shared/PageHeader.vue'
import ColorEditor from '@/components/design/ColorEditor.vue'
import TypographyEditor from '@/components/design/TypographyEditor.vue'
import SpacingEditor from '@/components/design/SpacingEditor.vue'
import LayoutPicker from '@/components/design/LayoutPicker.vue'

const design = useDesignStore()
const toast = useToast()

const { status, markLoaded } = useAutoSave(
  () => design.tokens,
  async () => await design.saveTokens(),
  { delay: 2000 }
)

const statusText = computed(() => {
  const map = { idle: '', pending: 'Änderungen...', saving: 'Speichern...', saved: 'Gespeichert', error: 'Fehler' }
  return map[status.value] || ''
})

const statusColor = computed(() => {
  const map = { saved: 'success', error: 'error', saving: 'info', pending: 'warning' }
  return map[status.value] || 'grey'
})

onMounted(async () => {
  await design.fetchTokens()
  markLoaded()
})
</script>

<template>
  <PageHeader title="Design" subtitle="Gestalte das Aussehen deiner App">
    <template #actions>
      <v-chip v-if="statusText" :color="statusColor" size="small" variant="tonal">
        {{ statusText }}
      </v-chip>
    </template>
  </PageHeader>

  <v-container fluid class="px-6">
    <v-tabs v-model="tab" class="mb-6">
      <v-tab value="colors">Farben</v-tab>
      <v-tab value="typography">Typografie</v-tab>
      <v-tab value="spacing">Abstände</v-tab>
      <v-tab value="layout">Layout</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="colors">
        <ColorEditor v-model="design.tokens.colors" />
      </v-tabs-window-item>
      <v-tabs-window-item value="typography">
        <TypographyEditor v-model="design.tokens.typography" />
      </v-tabs-window-item>
      <v-tabs-window-item value="spacing">
        <SpacingEditor
          v-model:borderRadius="design.tokens.borderRadius"
          v-model:shadows="design.tokens.shadows"
        />
      </v-tabs-window-item>
      <v-tabs-window-item value="layout">
        <LayoutPicker v-model="design.tokens.layout" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script>
export default {
  data: () => ({ tab: 'colors' }),
}
</script>
