<script setup>
import { computed } from 'vue'

const model = defineModel({ type: Object, required: true })

// Abgeleitete Radien aus Basis-Radius
const radiusBase = computed(() => model.value.radius || 6)
const radiusPreview = computed(() => [
  { label: 'Klein (sm)', value: Math.max(2, Math.round(radiusBase.value * 0.67)), use: 'Chips, Tags' },
  { label: 'Mittel (md)', value: radiusBase.value, use: 'Buttons, Inputs' },
  { label: 'Groß (lg)', value: Math.round(radiusBase.value * 1.33), use: 'Cards, Dialoge' },
  { label: 'Extra Groß (xl)', value: Math.round(radiusBase.value * 2), use: 'Modals, Banner' },
])

// Abgeleitete Abstände aus Basis-Spacing
const spacingBase = computed(() => model.value.spacing || 16)
const spacingPreview = computed(() => [
  { label: 'xs', value: Math.round(spacingBase.value * 0.25), use: 'Inline-Abstände' },
  { label: 'sm', value: Math.round(spacingBase.value * 0.5), use: 'Kompakte Elemente' },
  { label: 'md', value: spacingBase.value, use: 'Standard-Padding' },
  { label: 'lg', value: Math.round(spacingBase.value * 1.5), use: 'Sections, Gruppen' },
  { label: 'xl', value: Math.round(spacingBase.value * 2), use: 'Seitenränder' },
  { label: '2xl', value: Math.round(spacingBase.value * 3), use: 'Große Abstände' },
])
</script>

<template>
  <v-row>
    <!-- Abstände -->
    <v-col cols="12" md="4">
      <v-card variant="outlined" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-2">Abstände</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          Ein Wert steuert alle Abstände. Die Varianten werden automatisch skaliert.
        </p>

        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-body-2 font-weight-medium">Basis-Abstand</span>
          <span class="text-body-2 font-weight-bold">{{ spacingBase }}px</span>
        </div>
        <v-slider
          v-model="model.spacing"
          :min="4"
          :max="32"
          :step="2"
          hide-details
          color="primary"
          thumb-label
        />

        <div class="mt-6">
          <div
            v-for="s in spacingPreview"
            :key="s.label"
            class="d-flex align-center gap-3 mb-3"
          >
            <div
              :style="{
                width: s.value + 'px',
                height: '16px',
                background: 'var(--aw-primary)',
                borderRadius: '2px',
                flexShrink: 0,
                minWidth: '4px',
              }"
            />
            <div class="text-caption">
              <span class="font-weight-medium">{{ s.label }}</span>
              <span class="text-medium-emphasis ml-1">{{ s.value }}px — {{ s.use }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Border Radius -->
    <v-col cols="12" md="4">
      <v-card variant="outlined" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-2">Radien</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          Ein Wert steuert alle Radien. Die Varianten werden automatisch skaliert.
        </p>

        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-body-2 font-weight-medium">Basis-Radius</span>
          <span class="text-body-2 font-weight-bold">{{ radiusBase }}px</span>
        </div>
        <v-slider
          v-model="model.radius"
          :min="0"
          :max="24"
          :step="1"
          hide-details
          color="primary"
          thumb-label
        />

        <div class="mt-6">
          <div
            v-for="r in radiusPreview"
            :key="r.label"
            class="d-flex align-center gap-4 mb-4"
          >
            <div
              :style="{
                width: '64px',
                height: '32px',
                background: 'var(--aw-primary)',
                borderRadius: r.value + 'px',
                flexShrink: 0,
              }"
            />
            <div class="text-caption">
              <span class="font-weight-medium">{{ r.label }}</span>
              <span class="text-medium-emphasis d-block">{{ r.value }}px</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Schatten -->
    <v-col cols="12" md="4">
      <v-card variant="outlined" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-2">Schatten</h3>
        <p class="text-caption text-medium-emphasis mb-4">
          Werden automatisch aus dem Hintergrund abgeleitet.
        </p>

        <div class="d-flex flex-column gap-6">
          <div v-for="(label, key) in { xs: 'Klein', md: 'Mittel', lg: 'Groß' }" :key="key">
            <span class="text-body-2 font-weight-medium">{{ label }}</span>
            <div class="d-flex justify-center mt-3">
              <div
                :style="{
                  width: '120px',
                  height: '48px',
                  background: 'var(--aw-surface)',
                  borderRadius: 'var(--aw-radius)',
                  boxShadow: `var(--aw-shadow${key === 'md' ? '' : '-' + key})`,
                }"
              />
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
