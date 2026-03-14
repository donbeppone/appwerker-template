<script setup>
import { computed, ref } from 'vue'

const model = defineModel({ type: Object, required: true })

// ── Spacing ──
const spacingBase = computed(() => model.value.spacing || 16)
const spacingSteps = computed(() => [
  { key: 'xs', factor: 0.25, label: 'Inline' },
  { key: 'sm', factor: 0.5, label: 'Kompakt' },
  { key: 'md', factor: 1, label: 'Standard' },
  { key: 'lg', factor: 1.5, label: 'Gruppen' },
  { key: 'xl', factor: 2, label: 'Ränder' },
  { key: '2xl', factor: 3, label: 'Sections' },
].map(s => ({ ...s, px: Math.round(spacingBase.value * s.factor) })))

const spacingPresets = [
  { label: 'Kompakt', value: 12 },
  { label: 'Standard', value: 16 },
  { label: 'Komfortabel', value: 20 },
  { label: 'Weit', value: 24 },
]

// ── Radien ──
const radiusBase = computed(() => model.value.radius ?? 6)
const radiusSteps = computed(() => [
  { key: 'sm', factor: 0.67, label: 'Chips' },
  { key: 'md', factor: 1, label: 'Buttons' },
  { key: 'lg', factor: 1.33, label: 'Cards' },
  { key: 'xl', factor: 2, label: 'Modals' },
].map(s => ({ ...s, px: s.key === 'sm' ? Math.max(0, Math.round(radiusBase.value * s.factor)) : Math.round(radiusBase.value * s.factor) })))

const radiusPresets = [
  { label: '0', value: 0 },
  { label: '4', value: 4 },
  { label: '6', value: 6 },
  { label: '8', value: 8 },
  { label: '12', value: 12 },
  { label: '16', value: 16 },
  { label: '24', value: 24 },
]

// ── Schatten ──
const shadowLevels = [
  { key: 'xs', label: 'XS', desc: 'Subtil', cssVar: '--aw-shadow-xs' },
  { key: 'sm', label: 'SM', desc: 'Leicht', cssVar: '--aw-shadow-sm' },
  { key: 'md', label: 'MD', desc: 'Standard', cssVar: '--aw-shadow' },
  { key: 'lg', label: 'LG', desc: 'Erhöht', cssVar: '--aw-shadow-lg' },
  { key: 'xl', label: 'XL', desc: 'Stark', cssVar: '--aw-shadow-xl' },
  { key: '2xl', label: '2XL', desc: 'Maximal', cssVar: '--aw-shadow-2xl' },
]

const activeShadow = ref('md')
</script>

<template>
  <div class="de-spacing-editor">
    <!-- ── ABSTÄNDE ── -->
    <div class="de-panel">
      <div class="de-panel-header">
        <div class="de-label-mono">ABSTÄNDE</div>
        <div class="de-value-pill">{{ spacingBase }}px</div>
      </div>

      <!-- Preset Buttons -->
      <div class="de-btn-row">
        <button
          v-for="p in spacingPresets"
          :key="p.value"
          class="de-toggle-btn"
          :class="{ active: spacingBase === p.value }"
          @click="model.spacing = p.value"
        >
          {{ p.label }}
        </button>
      </div>

      <v-slider
        v-model="model.spacing"
        :min="4"
        :max="32"
        :step="2"
        hide-details
        color="primary"
        class="mt-4 mb-2"
      />

      <!-- Spacing Scale Preview -->
      <div class="de-scale-grid">
        <template v-for="s in spacingSteps" :key="s.key">
          <div class="de-scale-label">{{ s.key }}</div>
          <div class="de-scale-bar-wrap">
            <div
              class="de-scale-bar"
              :style="{ width: Math.min(s.px * 2.5, 100) + '%' }"
            />
          </div>
          <div class="de-scale-px">{{ s.px }}px</div>
          <div class="de-scale-use">{{ s.label }}</div>
        </template>
      </div>
    </div>

    <!-- ── RADIEN ── -->
    <div class="de-panel">
      <div class="de-panel-header">
        <div class="de-label-mono">RADIEN</div>
        <div class="de-value-pill">{{ radiusBase }}px</div>
      </div>

      <!-- Preset Buttons -->
      <div class="de-btn-row">
        <button
          v-for="p in radiusPresets"
          :key="p.value"
          class="de-toggle-btn de-toggle-btn--compact"
          :class="{ active: radiusBase === p.value }"
          @click="model.radius = p.value"
        >
          {{ p.label }}
        </button>
      </div>

      <v-slider
        v-model="model.radius"
        :min="0"
        :max="24"
        :step="1"
        hide-details
        color="primary"
        class="mt-4 mb-2"
      />

      <!-- Radius Visual Preview -->
      <div class="de-radius-grid">
        <div
          v-for="r in radiusSteps"
          :key="r.key"
          class="de-radius-item"
        >
          <div
            class="de-radius-shape"
            :style="{ borderRadius: r.px + 'px' }"
          />
          <div class="de-radius-meta">
            <span class="de-radius-key">{{ r.key }}</span>
            <span class="de-radius-val">{{ r.px }}px</span>
          </div>
          <div class="de-radius-use">{{ r.label }}</div>
        </div>
      </div>
    </div>

    <!-- ── SCHATTEN ── -->
    <div class="de-panel">
      <div class="de-panel-header">
        <div class="de-label-mono">SCHATTEN</div>
        <div class="de-value-pill de-value-pill--muted">automatisch</div>
      </div>

      <p class="de-hint">
        Werden aus dem Hintergrund abgeleitet. Im Dark Mode intensiver.
      </p>

      <!-- Shadow Level Tabs -->
      <div class="de-btn-row de-btn-row--stretch">
        <button
          v-for="s in shadowLevels"
          :key="s.key"
          class="de-toggle-btn"
          :class="{ active: activeShadow === s.key }"
          @click="activeShadow = s.key"
        >
          {{ s.label }}
        </button>
      </div>

      <!-- Active Shadow Preview -->
      <div class="de-shadow-stage">
        <div
          class="de-shadow-card"
          :style="{ boxShadow: `var(${shadowLevels.find(s => s.key === activeShadow)?.cssVar})` }"
        >
          <div class="de-shadow-card-label">
            {{ shadowLevels.find(s => s.key === activeShadow)?.desc }}
          </div>
        </div>
      </div>

      <!-- All Shadows Overview -->
      <div class="de-shadow-row">
        <div
          v-for="s in shadowLevels"
          :key="s.key"
          class="de-shadow-thumb"
          :class="{ 'de-shadow-thumb--active': activeShadow === s.key }"
          :style="{ boxShadow: `var(${s.cssVar})` }"
          @click="activeShadow = s.key"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.de-spacing-editor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 960px) {
  .de-spacing-editor {
    grid-template-columns: 1fr;
  }
}

/* ── Panel ── */
.de-panel {
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  padding: 24px;
}

.de-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.de-label-mono {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--aw-text-secondary);
  font-family: var(--aw-font-mono);
}

.de-value-pill {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--aw-font-mono);
  background: var(--aw-primary);
  color: var(--aw-on-primary);
  padding: 2px 10px;
  border-radius: 100px;
}

.de-value-pill--muted {
  background: var(--aw-border);
  color: var(--aw-text-secondary);
}

.de-hint {
  font-size: 12px;
  color: var(--aw-text-muted);
  margin: 0 0 16px;
  line-height: 1.5;
}

/* ── Toggle Buttons ── */
.de-btn-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.de-btn-row--stretch {
  gap: 0;
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius);
  overflow: hidden;
}

.de-btn-row--stretch .de-toggle-btn {
  flex: 1;
  border-radius: 0;
  border: none;
  border-right: 1px solid var(--aw-border);
}

.de-btn-row--stretch .de-toggle-btn:last-child {
  border-right: none;
}

.de-toggle-btn {
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--aw-font-mono);
  background: transparent;
  color: var(--aw-text-secondary);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.de-toggle-btn:hover {
  background: var(--aw-border);
  color: var(--aw-text);
}

.de-toggle-btn.active {
  background: var(--aw-primary);
  color: var(--aw-on-primary);
  border-color: var(--aw-primary);
}

.de-toggle-btn--compact {
  padding: 4px 8px;
  min-width: 32px;
  text-align: center;
}

/* ── Spacing Scale ── */
.de-scale-grid {
  display: grid;
  grid-template-columns: 32px 1fr 42px auto;
  gap: 6px 12px;
  align-items: center;
  margin-top: 16px;
}

.de-scale-label {
  font-size: 11px;
  font-weight: 600;
  font-family: var(--aw-font-mono);
  color: var(--aw-text-secondary);
  text-transform: uppercase;
}

.de-scale-bar-wrap {
  height: 8px;
  background: var(--aw-border);
  border-radius: 4px;
  overflow: hidden;
}

.de-scale-bar {
  height: 100%;
  background: var(--aw-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
  min-width: 4px;
}

.de-scale-px {
  font-size: 11px;
  font-weight: 500;
  font-family: var(--aw-font-mono);
  color: var(--aw-text);
  text-align: right;
}

.de-scale-use {
  font-size: 11px;
  color: var(--aw-text-muted);
}

/* ── Radius ── */
.de-radius-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.de-radius-item {
  text-align: center;
}

.de-radius-shape {
  width: 100%;
  aspect-ratio: 2 / 1;
  background: var(--aw-primary);
  transition: border-radius 0.3s ease;
}

.de-radius-meta {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.de-radius-key {
  font-size: 11px;
  font-weight: 600;
  font-family: var(--aw-font-mono);
  text-transform: uppercase;
  color: var(--aw-text-secondary);
}

.de-radius-val {
  font-size: 11px;
  font-family: var(--aw-font-mono);
  color: var(--aw-text-muted);
}

.de-radius-use {
  font-size: 10px;
  color: var(--aw-text-muted);
  margin-top: 2px;
}

/* ── Shadows ── */
.de-shadow-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  margin-top: 16px;
  background:
    radial-gradient(circle at 30% 30%, rgba(0,0,0,0.02) 0%, transparent 50%),
    var(--aw-background);
  border-radius: var(--aw-radius);
}

.de-shadow-card {
  width: 180px;
  height: 80px;
  background: var(--aw-surface);
  border-radius: var(--aw-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s ease;
}

.de-shadow-card-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--aw-text-secondary);
}

.de-shadow-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 16px;
}

.de-shadow-thumb {
  height: 32px;
  background: var(--aw-surface);
  border-radius: var(--aw-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.de-shadow-thumb:hover {
  border-color: var(--aw-border);
}

.de-shadow-thumb--active {
  border-color: var(--aw-primary);
}
</style>
