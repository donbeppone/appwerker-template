<script setup>
import { ref, computed } from 'vue'
import { deriveTokens } from '@/lib/designTokens.js'

const model = defineModel({ type: Object, required: true })
const showStatus = ref(false)

const mainColors = [
  { key: 'primary', label: 'Primärfarbe', desc: 'Buttons, Links, Akzente' },
  { key: 'secondary', label: 'Sekundär', desc: 'Badges, Tags, dezente Elemente' },
  { key: 'accent', label: 'Akzent', desc: 'Hervorhebungen, Hover-Effekte' },
  { key: 'background', label: 'Hintergrund', desc: 'Seiten-Hintergrund' },
  { key: 'sidebarBg', label: 'Sidebar', desc: 'Seitenleisten-Hintergrund' },
]

const statusColors = [
  { key: 'error', label: 'Fehler', desc: 'Fehlermeldungen' },
  { key: 'success', label: 'Erfolg', desc: 'Erfolgsmeldungen' },
  { key: 'warning', label: 'Warnung', desc: 'Warnmeldungen' },
  { key: 'info', label: 'Info', desc: 'Informationsmeldungen' },
]

// Abgeleitete Farben für Preview
const derived = computed(() => deriveTokens(model.value))

const derivedPreview = computed(() => [
  { label: 'Text', value: derived.value.light.text },
  { label: 'Text sekundär', value: derived.value.light['text-secondary'] },
  { label: 'Oberfläche', value: derived.value.light.surface },
  { label: 'Rahmen', value: derived.value.light.border },
  { label: 'Auf Primär', value: derived.value.light['on-primary'] },
])
</script>

<template>
  <div>
    <!-- Hauptfarben -->
    <h3 class="text-body-1 font-weight-bold mb-4">Hauptfarben</h3>
    <v-row>
      <v-col
        v-for="def in mainColors"
        :key="def.key"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <div class="d-flex align-center gap-3 mb-2">
            <input
              type="color"
              :value="model[def.key] || '#000000'"
              @input="model[def.key] = $event.target.value"
              class="aw-color-input"
            />
            <div>
              <div class="text-body-2 font-weight-medium">{{ def.label }}</div>
              <div class="text-caption text-medium-emphasis">{{ def.desc }}</div>
            </div>
          </div>
          <v-text-field
            :model-value="model[def.key] || ''"
            @update:model-value="model[def.key] = $event"
            density="compact"
            variant="outlined"
            hide-details
            class="mt-2 mono-input"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Status-Farben (klappbar) -->
    <v-btn
      variant="text"
      size="small"
      class="mt-6 mb-2"
      @click="showStatus = !showStatus"
      :prepend-icon="showStatus ? 'mdi-chevron-up' : 'mdi-chevron-down'"
    >
      Status-Farben
    </v-btn>

    <v-expand-transition>
      <v-row v-show="showStatus">
        <v-col
          v-for="def in statusColors"
          :key="def.key"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <div class="d-flex align-center gap-3">
              <input
                type="color"
                :value="model[def.key] || '#000000'"
                @input="model[def.key] = $event.target.value"
                class="aw-color-input"
              />
              <div>
                <div class="text-body-2 font-weight-medium">{{ def.label }}</div>
                <div class="text-caption text-medium-emphasis">{{ def.desc }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-expand-transition>

    <!-- Abgeleitete Farben (read-only Preview) -->
    <h3 class="text-body-1 font-weight-bold mt-8 mb-3">Abgeleitete Farben</h3>
    <p class="text-caption text-medium-emphasis mb-4">
      Werden automatisch aus den Hauptfarben berechnet.
    </p>
    <div class="d-flex flex-wrap gap-4">
      <div
        v-for="item in derivedPreview"
        :key="item.label"
        class="d-flex align-center gap-2"
      >
        <div
          class="aw-swatch"
          :style="{ background: item.value }"
        />
        <div>
          <div class="text-caption font-weight-medium">{{ item.label }}</div>
          <div class="text-caption text-medium-emphasis" style="font-family: var(--aw-font-mono); font-size: 11px">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aw-color-input {
  width: 40px;
  height: 40px;
  border: 2px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  cursor: pointer;
  padding: 0;
  background: none;
  flex-shrink: 0;
}

.aw-color-input::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.aw-color-input::-webkit-color-swatch {
  border: none;
  border-radius: var(--aw-radius-sm);
}

.aw-swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--aw-radius-sm);
  border: 2px solid var(--aw-border);
  flex-shrink: 0;
}

.mono-input :deep(input) {
  font-family: var(--aw-font-mono);
  font-size: 13px;
}
</style>
