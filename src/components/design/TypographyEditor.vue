<script setup>
import { computed, onMounted } from 'vue'
import { deriveTypography, typeScalePresets } from '@/lib/designTokens.js'

const model = defineModel({ type: Object, required: true })

// ── Fonts ──────────────────────────────────────────────
const availableFonts = [
  { title: 'Instrument Sans', value: 'Instrument Sans' },
  { title: 'Inter', value: 'Inter' },
  { title: 'DM Sans', value: 'DM Sans' },
  { title: 'Open Sans', value: 'Open Sans' },
  { title: 'Roboto', value: 'Roboto' },
  { title: 'Nunito', value: 'Nunito' },
  { title: 'Work Sans', value: 'Work Sans' },
  { title: 'Manrope', value: 'Manrope' },
  { title: 'Source Sans 3', value: 'Source Sans 3' },
  { title: 'JetBrains Mono', value: 'JetBrains Mono' },
]

const loadedFonts = new Set(['Instrument Sans', 'JetBrains Mono'])

async function loadFont(name) {
  if (loadedFonts.has(name)) return
  loadedFonts.add(name)
  try {
    const imports = {
      'Inter': () => Promise.all([import('@fontsource/inter/400.css'), import('@fontsource/inter/600.css'), import('@fontsource/inter/700.css')]),
      'DM Sans': () => Promise.all([import('@fontsource/dm-sans/400.css'), import('@fontsource/dm-sans/600.css'), import('@fontsource/dm-sans/700.css')]),
      'Open Sans': () => Promise.all([import('@fontsource/open-sans/400.css'), import('@fontsource/open-sans/600.css'), import('@fontsource/open-sans/700.css')]),
      'Roboto': () => Promise.all([import('@fontsource/roboto/400.css'), import('@fontsource/roboto/500.css'), import('@fontsource/roboto/700.css')]),
      'Nunito': () => Promise.all([import('@fontsource/nunito/400.css'), import('@fontsource/nunito/600.css'), import('@fontsource/nunito/700.css')]),
      'Work Sans': () => Promise.all([import('@fontsource/work-sans/400.css'), import('@fontsource/work-sans/600.css'), import('@fontsource/work-sans/700.css')]),
      'Manrope': () => Promise.all([import('@fontsource/manrope/400.css'), import('@fontsource/manrope/600.css'), import('@fontsource/manrope/700.css')]),
      'Source Sans 3': () => Promise.all([import('@fontsource/source-sans-3/400.css'), import('@fontsource/source-sans-3/600.css'), import('@fontsource/source-sans-3/700.css')]),
    }
    if (imports[name]) await imports[name]()
  } catch (e) {
    console.warn(`Font ${name} konnte nicht geladen werden:`, e)
  }
}

function onFontChange(key, value) {
  model.value[key] = value
  loadFont(value)
}

// ── Typografie-Presets ────────────────────────────────────

const presetDefs = [
  { key: 'h1', label: 'Überschrift 1', tag: 'H1', preview: 'Überschrift' },
  { key: 'h2', label: 'Überschrift 2', tag: 'H2', preview: 'Überschrift' },
  { key: 'h3', label: 'Überschrift 3', tag: 'H3', preview: 'Überschrift' },
  { key: 'h4', label: 'Überschrift 4', tag: 'H4', preview: 'Überschrift' },
  { key: 'h5', label: 'Überschrift 5', tag: 'H5', preview: 'Überschrift' },
  { key: 'h6', label: 'Überschrift 6', tag: 'H6', preview: 'Überschrift' },
  { key: 'body', label: 'Fließtext', tag: 'P', preview: 'Dies ist ein Beispieltext für den Fließtext.' },
  { key: 'small', label: 'Klein', tag: 'small', preview: 'Kleingedruckter Text und Beschriftungen.' },
]

const fontOptions = [
  { title: 'Textschrift', value: 'body' },
  { title: 'Überschriften-Schrift', value: 'heading' },
]

const weightOptions = [
  { title: 'Normal (400)', value: 400 },
  { title: 'Medium (500)', value: 500 },
  { title: 'Semi Bold (600)', value: 600 },
  { title: 'Bold (700)', value: 700 },
]

const lineHeightOptions = [
  { title: '100%', value: 100 },
  { title: '110%', value: 110 },
  { title: '115%', value: 115 },
  { title: '120%', value: 120 },
  { title: '125%', value: 125 },
  { title: '130%', value: 130 },
  { title: '135%', value: 135 },
  { title: '140%', value: 140 },
  { title: '150%', value: 150 },
  { title: '160%', value: 160 },
  { title: '180%', value: 180 },
  { title: '200%', value: 200 },
]

/** Abgeleitete Typografie (live aktualisiert) */
const derivedTypo = computed(() => deriveTypography(model.value))

/** Overrides als Objekt */
const overrides = computed(() => {
  if (!model.value.typoOverrides) return {}
  return typeof model.value.typoOverrides === 'string'
    ? JSON.parse(model.value.typoOverrides)
    : model.value.typoOverrides
})

function hasOverride(key) {
  return !!(overrides.value[key] && Object.keys(overrides.value[key]).length > 0)
}

function setOverride(key, prop, value) {
  const current = { ...overrides.value }
  if (!current[key]) current[key] = {}
  current[key][prop] = value
  model.value.typoOverrides = JSON.stringify(current)
}

function resetOverride(key) {
  const current = { ...overrides.value }
  delete current[key]
  model.value.typoOverrides = Object.keys(current).length > 0 ? JSON.stringify(current) : null
}

function previewStyle(key) {
  const preset = derivedTypo.value[key]
  const fontFamily = preset.font === 'heading'
    ? `'${model.value.headingFontFamily}', sans-serif`
    : `'${model.value.fontFamily}', sans-serif`
  return {
    fontFamily,
    fontSize: `${preset.fontSize}px`,
    lineHeight: `${preset.lineHeight}%`,
    fontWeight: preset.weight,
  }
}

onMounted(() => {
  if (model.value.fontFamily) loadFont(model.value.fontFamily)
  if (model.value.headingFontFamily) loadFont(model.value.headingFontFamily)
})
</script>

<template>
  <div>
    <!-- ── Schriftarten ── -->
    <h3 class="text-body-1 font-weight-bold mb-4">Schriftarten</h3>
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="pa-5">
          <div class="text-body-2 font-weight-medium mb-2">Textschrift</div>
          <v-select
            :model-value="model.fontFamily"
            @update:model-value="onFontChange('fontFamily', $event)"
            :items="availableFonts"
            item-title="title"
            item-value="value"
            hide-details
          />
          <div class="mt-3 pa-3 rounded-lg" style="background: var(--aw-background)">
            <p :style="{ fontFamily: `'${model.fontFamily}', sans-serif` }" class="mb-0">
              Beispieltext — äöü ÄÖÜ ß 0123456789
            </p>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="pa-5">
          <div class="text-body-2 font-weight-medium mb-2">Überschriften-Schrift</div>
          <v-select
            :model-value="model.headingFontFamily"
            @update:model-value="onFontChange('headingFontFamily', $event)"
            :items="availableFonts"
            item-title="title"
            item-value="value"
            hide-details
          />
          <div class="mt-3 pa-3 rounded-lg" style="background: var(--aw-background)">
            <h3 :style="{ fontFamily: `'${model.headingFontFamily}', sans-serif`, fontWeight: 700 }" class="mb-0">
              Überschrift Beispiel
            </h3>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ── Typografische Skala ── -->
    <h3 class="text-body-1 font-weight-bold mb-4">Typografische Skala</h3>
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-card variant="outlined" class="pa-5">
          <div class="text-body-2 font-weight-medium mb-2">Basis-Schriftgröße</div>
          <div class="d-flex align-center gap-3">
            <v-slider
              v-model="model.baseFontSize"
              :min="12"
              :max="24"
              :step="1"
              hide-details
              color="primary"
              thumb-label
              class="flex-grow-1"
            />
            <span class="text-body-2 font-weight-bold" style="min-width: 40px">{{ model.baseFontSize || 16 }}px</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card variant="outlined" class="pa-5">
          <div class="text-body-2 font-weight-medium mb-2">Skalierungsfaktor</div>
          <v-select
            v-model="model.typeScaleRatio"
            :items="typeScalePresets"
            item-title="title"
            item-value="value"
            hide-details
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- ── Textformate ── -->
    <h3 class="text-body-1 font-weight-bold mb-2">Textformate</h3>
    <p class="text-caption text-medium-emphasis mb-4">
      Alle Werte werden aus der Skala abgeleitet. Individuelle Änderungen werden als Überschreibung gespeichert.
    </p>

    <div class="d-flex flex-column" style="gap: var(--aw-space-md)">
      <v-card
        v-for="def in presetDefs"
        :key="def.key"
        variant="outlined"
        class="pa-5"
      >
        <div class="d-flex align-start" style="gap: var(--aw-space-lg)">
          <!-- Tag-Label -->
          <div class="aw-tag-label text-center" style="min-width: 48px">
            <span class="text-caption font-weight-bold text-medium-emphasis">{{ def.tag }}</span>
          </div>

          <!-- Content -->
          <div class="flex-grow-1">
            <!-- Live Preview -->
            <div class="aw-typo-preview mb-3 pa-3 rounded-lg" style="background: var(--aw-background); overflow: hidden">
              <span :style="previewStyle(def.key)">{{ def.preview }}</span>
            </div>

            <!-- Controls -->
            <div class="d-flex flex-wrap align-center" style="gap: var(--aw-space-md)">
              <v-select
                :model-value="derivedTypo[def.key].font"
                @update:model-value="setOverride(def.key, 'font', $event)"
                :items="fontOptions"
                item-title="title"
                item-value="value"
                label="Schrift"
                hide-details
                density="compact"
                style="max-width: 180px"
              />
              <v-text-field
                :model-value="derivedTypo[def.key].fontSize"
                @update:model-value="setOverride(def.key, 'fontSize', parseInt($event) || derivedTypo[def.key].fontSize)"
                label="Größe"
                suffix="px"
                type="number"
                hide-details
                density="compact"
                style="max-width: 110px"
              />
              <v-select
                :model-value="derivedTypo[def.key].lineHeight"
                @update:model-value="setOverride(def.key, 'lineHeight', $event)"
                :items="lineHeightOptions"
                item-title="title"
                item-value="value"
                label="Zeilenhöhe"
                hide-details
                density="compact"
                style="max-width: 120px"
              />
              <v-select
                :model-value="derivedTypo[def.key].weight"
                @update:model-value="setOverride(def.key, 'weight', $event)"
                :items="weightOptions"
                item-title="title"
                item-value="value"
                label="Gewicht"
                hide-details
                density="compact"
                style="max-width: 160px"
              />

              <!-- Reset-Button (nur bei Überschreibung) -->
              <v-btn
                v-if="hasOverride(def.key)"
                icon="mdi-restore"
                size="x-small"
                variant="text"
                color="warning"
                title="Zurücksetzen"
                @click="resetOverride(def.key)"
              />
              <v-chip
                v-if="hasOverride(def.key)"
                size="x-small"
                color="warning"
                variant="tonal"
              >
                angepasst
              </v-chip>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.aw-tag-label {
  padding: 6px 8px;
  border-radius: var(--aw-radius-sm);
  background: var(--aw-background);
}

.aw-typo-preview {
  min-height: 40px;
  display: flex;
  align-items: center;
}
</style>
