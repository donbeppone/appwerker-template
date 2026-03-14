<script setup>
import { computed, onMounted } from 'vue'
import { deriveTypography, typeScalePresets } from '@/lib/designTokens.js'

const model = defineModel({ type: Object, required: true })

// ── Fonts ──
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

// ── Typografie-Presets ──
const presetDefs = [
  { key: 'h1', label: 'Überschrift 1', tag: 'H1', preview: 'Überschrift' },
  { key: 'h2', label: 'Überschrift 2', tag: 'H2', preview: 'Überschrift' },
  { key: 'h3', label: 'Überschrift 3', tag: 'H3', preview: 'Überschrift' },
  { key: 'h4', label: 'Überschrift 4', tag: 'H4', preview: 'Überschrift' },
  { key: 'h5', label: 'Überschrift 5', tag: 'H5', preview: 'Überschrift' },
  { key: 'h6', label: 'Überschrift 6', tag: 'H6', preview: 'Überschrift' },
  { key: 'body', label: 'Fließtext', tag: 'P', preview: 'Dies ist ein Beispieltext für den Fließtext.' },
  { key: 'small', label: 'Klein', tag: 'SM', preview: 'Kleingedruckter Text und Beschriftungen.' },
]

const sizeOptions = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72]
const lineHeightOptions = [100, 110, 115, 120, 125, 130, 135, 140, 150, 160, 180]
const weightOptions = [
  { label: '400', value: 400 },
  { label: '500', value: 500 },
  { label: '600', value: 600 },
  { label: '700', value: 700 },
]

const derivedTypo = computed(() => deriveTypography(model.value))

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
    fontSize: `${Math.min(preset.fontSize, 48)}px`,
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
  <div class="te-root">
    <!-- ── SCHRIFTARTEN ── -->
    <div class="te-section">
      <div class="te-section-label">SCHRIFTARTEN</div>
      <div class="te-font-grid">
        <div class="te-font-card">
          <div class="te-font-card-head">
            <span class="te-font-card-label">Textschrift</span>
          </div>
          <v-select
            :model-value="model.fontFamily"
            @update:model-value="onFontChange('fontFamily', $event)"
            :items="availableFonts"
            item-title="title"
            item-value="value"
            hide-details
            density="compact"
          />
          <div class="te-font-sample" :style="{ fontFamily: `'${model.fontFamily}', sans-serif` }">
            Beispieltext — äöü ÄÖÜ ß 0123456789
          </div>
        </div>
        <div class="te-font-card">
          <div class="te-font-card-head">
            <span class="te-font-card-label">Überschriften</span>
          </div>
          <v-select
            :model-value="model.headingFontFamily"
            @update:model-value="onFontChange('headingFontFamily', $event)"
            :items="availableFonts"
            item-title="title"
            item-value="value"
            hide-details
            density="compact"
          />
          <div class="te-font-sample" :style="{ fontFamily: `'${model.headingFontFamily}', sans-serif`, fontWeight: 700, fontSize: '18px' }">
            Überschrift Beispiel
          </div>
        </div>
      </div>
    </div>

    <!-- ── SKALA ── -->
    <div class="te-section">
      <div class="te-section-label">TYPOGRAFISCHE SKALA</div>
      <div class="te-scale-row">
        <div class="te-scale-control">
          <span class="te-control-label">Basis</span>
          <div class="te-btn-group">
            <button
              v-for="s in [14, 15, 16, 17, 18]"
              :key="s"
              :class="{ active: (model.baseFontSize || 16) === s }"
              @click="model.baseFontSize = s"
            >{{ s }}</button>
          </div>
        </div>
        <div class="te-scale-control">
          <span class="te-control-label">Skalierung</span>
          <div class="te-btn-group">
            <button
              v-for="p in typeScalePresets"
              :key="p.value"
              :class="{ active: (model.typeScaleRatio || 1.25) === p.value }"
              @click="model.typeScaleRatio = p.value"
              :title="p.title"
            >{{ p.value.toFixed(p.value === 1.2 || p.value === 1.5 ? 1 : 3) }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TEXTFORMATE ── -->
    <div class="te-section">
      <div class="te-section-label">TEXTFORMATE</div>
      <p class="te-hint">
        Alle Werte aus der Skala abgeleitet. Individuelle Anpassungen werden als Überschreibung gespeichert.
      </p>

      <div class="te-presets">
        <div
          v-for="def in presetDefs"
          :key="def.key"
          class="te-preset"
        >
          <!-- Tag + Status -->
          <div class="te-preset-head">
            <div class="te-preset-tag">{{ def.tag }}</div>
            <div class="te-preset-info">
              <span class="te-preset-name">{{ def.label }}</span>
              <span class="te-preset-meta">{{ derivedTypo[def.key].fontSize }}px / {{ derivedTypo[def.key].lineHeight }}% / {{ derivedTypo[def.key].weight }}</span>
            </div>
            <div class="te-preset-actions">
              <button
                v-if="hasOverride(def.key)"
                class="te-reset-btn"
                @click="resetOverride(def.key)"
                title="Zurücksetzen"
              >
                <v-icon size="14">mdi-restore</v-icon>
              </button>
              <span v-if="hasOverride(def.key)" class="te-badge">angepasst</span>
            </div>
          </div>

          <!-- Preview -->
          <div class="te-preset-preview">
            <span :style="previewStyle(def.key)">{{ def.preview }}</span>
          </div>

          <!-- Controls als Button Groups -->
          <div class="te-preset-controls">
            <!-- Font Toggle -->
            <div class="te-control-col">
              <span class="te-control-micro">Schrift</span>
              <div class="te-btn-group">
                <button
                  :class="{ active: derivedTypo[def.key].font === 'body' }"
                  @click="setOverride(def.key, 'font', 'body')"
                >Text</button>
                <button
                  :class="{ active: derivedTypo[def.key].font === 'heading' }"
                  @click="setOverride(def.key, 'font', 'heading')"
                >Heading</button>
              </div>
            </div>

            <!-- Size -->
            <div class="te-control-col">
              <span class="te-control-micro">Größe</span>
              <div class="te-btn-group">
                <button
                  v-for="s in sizeOptions.filter(v => Math.abs(v - derivedTypo[def.key].fontSize) < (def.key.startsWith('h') && parseInt(def.key[1]) <= 3 ? 28 : 14))"
                  :key="s"
                  :class="{ active: derivedTypo[def.key].fontSize === s }"
                  @click="setOverride(def.key, 'fontSize', s)"
                >{{ s }}</button>
              </div>
            </div>

            <!-- Line Height -->
            <div class="te-control-col">
              <span class="te-control-micro">Zeilenhöhe</span>
              <div class="te-btn-group">
                <button
                  v-for="lh in lineHeightOptions.filter(v => Math.abs(v - derivedTypo[def.key].lineHeight) <= 30)"
                  :key="lh"
                  :class="{ active: derivedTypo[def.key].lineHeight === lh }"
                  @click="setOverride(def.key, 'lineHeight', lh)"
                >{{ lh }}%</button>
              </div>
            </div>

            <!-- Weight -->
            <div class="te-control-col">
              <span class="te-control-micro">Gewicht</span>
              <div class="te-btn-group">
                <button
                  v-for="w in weightOptions"
                  :key="w.value"
                  :class="{ active: derivedTypo[def.key].weight === w.value }"
                  @click="setOverride(def.key, 'weight', w.value)"
                >{{ w.label }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.te-root {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ── Section ── */
.te-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--aw-text-secondary);
  font-family: var(--aw-font-mono);
  margin-bottom: 16px;
}

.te-hint {
  font-size: 12px;
  color: var(--aw-text-muted);
  margin: -8px 0 16px;
  line-height: 1.5;
}

/* ── Font Cards ── */
.te-font-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .te-font-grid { grid-template-columns: 1fr; }
}

.te-font-card {
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  padding: 20px;
}

.te-font-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.te-font-card-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--aw-text);
}

.te-font-sample {
  margin-top: 12px;
  padding: 12px;
  background: var(--aw-background);
  border-radius: var(--aw-radius);
  font-size: 15px;
  color: var(--aw-text);
  line-height: 1.5;
}

/* ── Scale Row ── */
.te-scale-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.te-scale-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.te-control-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--aw-text-secondary);
  white-space: nowrap;
}

/* ── Button Group ── */
.te-btn-group {
  display: inline-flex;
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  overflow: hidden;
}

.te-btn-group button {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--aw-font-mono);
  background: transparent;
  color: var(--aw-text-secondary);
  border: none;
  border-right: 1px solid var(--aw-border);
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
}

.te-btn-group button:last-child {
  border-right: none;
}

.te-btn-group button:hover {
  background: var(--aw-border);
  color: var(--aw-text);
}

.te-btn-group button.active {
  background: var(--aw-primary);
  color: var(--aw-on-primary);
}

/* ── Presets ── */
.te-presets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.te-preset {
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  padding: 16px 20px;
}

.te-preset-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.te-preset-tag {
  font-size: 11px;
  font-weight: 700;
  font-family: var(--aw-font-mono);
  background: var(--aw-background);
  color: var(--aw-text-secondary);
  padding: 4px 8px;
  border-radius: var(--aw-radius-sm);
  min-width: 32px;
  text-align: center;
}

.te-preset-info {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.te-preset-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--aw-text);
}

.te-preset-meta {
  font-size: 11px;
  font-family: var(--aw-font-mono);
  color: var(--aw-text-muted);
}

.te-preset-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.te-reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  cursor: pointer;
  color: var(--aw-warning);
  transition: all 0.15s ease;
}

.te-reset-btn:hover {
  background: var(--aw-border);
}

.te-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--aw-warning);
  background: color-mix(in srgb, var(--aw-warning) 12%, transparent);
  padding: 2px 6px;
  border-radius: 100px;
}

/* ── Preview ── */
.te-preset-preview {
  padding: 8px 12px;
  background: var(--aw-background);
  border-radius: var(--aw-radius);
  margin-bottom: 12px;
  overflow: hidden;
  min-height: 32px;
  display: flex;
  align-items: center;
}

/* ── Controls ── */
.te-preset-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.te-control-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.te-control-micro {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--aw-text-muted);
}
</style>
