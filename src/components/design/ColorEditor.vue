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
  <div class="ce-root">
    <!-- Hauptfarben -->
    <div class="ce-section">
      <div class="ce-section-label">HAUPTFARBEN</div>
      <div class="ce-color-grid">
        <div
          v-for="def in mainColors"
          :key="def.key"
          class="ce-color-card"
        >
          <div class="ce-color-head">
            <input
              type="color"
              :value="model[def.key] || '#000000'"
              @input="model[def.key] = $event.target.value"
              class="ce-color-input"
            />
            <div class="ce-color-info">
              <div class="ce-color-label">{{ def.label }}</div>
              <div class="ce-color-desc">{{ def.desc }}</div>
            </div>
          </div>
          <v-text-field
            :model-value="model[def.key] || ''"
            @update:model-value="model[def.key] = $event"
            density="compact"
            variant="outlined"
            hide-details
            class="ce-hex-input"
          />
        </div>
      </div>
    </div>

    <!-- Status-Farben -->
    <div class="ce-section">
      <button class="ce-expand-btn" @click="showStatus = !showStatus">
        <v-icon :icon="showStatus ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" class="mr-2" />
        <span class="ce-section-label" style="margin-bottom: 0">STATUS-FARBEN</span>
      </button>

      <v-expand-transition>
        <div v-show="showStatus" class="ce-status-grid">
          <div
            v-for="def in statusColors"
            :key="def.key"
            class="ce-status-item"
          >
            <input
              type="color"
              :value="model[def.key] || '#000000'"
              @input="model[def.key] = $event.target.value"
              class="ce-color-input ce-color-input--sm"
            />
            <div class="ce-color-info">
              <div class="ce-color-label">{{ def.label }}</div>
              <div class="ce-color-desc">{{ def.desc }}</div>
            </div>
          </div>
        </div>
      </v-expand-transition>
    </div>

    <!-- Abgeleitete Farben -->
    <div class="ce-section">
      <div class="ce-section-label">ABGELEITET</div>
      <p class="ce-hint">Werden automatisch aus den Hauptfarben berechnet.</p>
      <div class="ce-derived-row">
        <div
          v-for="item in derivedPreview"
          :key="item.label"
          class="ce-derived-item"
        >
          <div class="ce-derived-swatch" :style="{ background: item.value }" />
          <div class="ce-derived-info">
            <div class="ce-derived-label">{{ item.label }}</div>
            <div class="ce-derived-hex">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ce-root {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ce-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--aw-text-secondary);
  font-family: var(--aw-font-mono);
  margin-bottom: 16px;
}

.ce-hint {
  font-size: 12px;
  color: var(--aw-text-muted);
  margin: -8px 0 16px;
  line-height: 1.5;
}

/* ── Color Grid ── */
.ce-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.ce-color-card {
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  padding: 16px;
}

.ce-color-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ce-color-input {
  width: 40px;
  height: 40px;
  border: 2px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  cursor: pointer;
  padding: 0;
  background: none;
  flex-shrink: 0;
}

.ce-color-input::-webkit-color-swatch-wrapper { padding: 2px; }
.ce-color-input::-webkit-color-swatch { border: none; border-radius: var(--aw-radius-sm); }

.ce-color-input--sm {
  width: 32px;
  height: 32px;
}

.ce-color-info {
  flex: 1;
  min-width: 0;
}

.ce-color-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--aw-text);
}

.ce-color-desc {
  font-size: 11px;
  color: var(--aw-text-muted);
}

.ce-hex-input :deep(input) {
  font-family: var(--aw-font-mono);
  font-size: 13px;
}

/* ── Status ── */
.ce-expand-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--aw-text-secondary);
}

.ce-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.ce-status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  padding: 12px 16px;
}

/* ── Derived ── */
.ce-derived-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.ce-derived-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ce-derived-swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--aw-radius-sm);
  border: 2px solid var(--aw-border);
  flex-shrink: 0;
}

.ce-derived-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--aw-text);
}

.ce-derived-hex {
  font-size: 11px;
  font-family: var(--aw-font-mono);
  color: var(--aw-text-muted);
}
</style>
