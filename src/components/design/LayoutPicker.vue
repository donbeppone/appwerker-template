<script setup>
import { useAppShell } from '@/composables/useAppShell.js'

const model = defineModel({ type: String, default: 'sidebar' })
const { setLayout } = useAppShell()

const layouts = [
  {
    value: 'sidebar',
    title: 'Sidebar',
    desc: 'Klassisches Layout mit Seitenleiste links',
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
  <div>
    <div class="lp-section-label">LAYOUT</div>
    <div class="lp-grid">
      <div
        v-for="layout in layouts"
        :key="layout.value"
        class="lp-card"
        :class="{ 'lp-card--active': model === layout.value }"
        @click="selectLayout(layout.value)"
      >
        <v-icon :icon="layout.icon" size="48" class="lp-icon" />
        <div class="lp-title">{{ layout.title }}</div>
        <div class="lp-desc">{{ layout.desc }}</div>
        <div class="lp-radio">
          <div class="lp-radio-dot" :class="{ 'lp-radio-dot--active': model === layout.value }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lp-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--aw-text-secondary);
  font-family: var(--aw-font-mono);
  margin-bottom: 16px;
}

.lp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .lp-grid { grid-template-columns: 1fr; }
}

.lp-card {
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lp-card:hover {
  border-color: var(--aw-text-muted);
}

.lp-card--active {
  border-color: var(--aw-primary);
  border-width: 2px;
  padding: 23px;
}

.lp-icon {
  color: var(--aw-text-secondary);
  margin-bottom: 12px;
}

.lp-card--active .lp-icon {
  color: var(--aw-primary);
}

.lp-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--aw-text);
}

.lp-desc {
  font-size: 12px;
  color: var(--aw-text-muted);
  margin-top: 4px;
  line-height: 1.5;
}

.lp-radio {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.lp-radio-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--aw-border);
  transition: all 0.15s ease;
}

.lp-radio-dot--active {
  border-color: var(--aw-primary);
  background: var(--aw-primary);
  box-shadow: inset 0 0 0 3px var(--aw-surface);
}
</style>
