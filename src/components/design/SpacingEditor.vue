<script setup>
import { computed } from 'vue'

const model = defineModel({ type: Object, required: true })

// Abgeleitete Radien aus Basis-Radius
const radiusSm = computed(() => Math.max(2, Math.round((model.value.radius || 6) * 0.67)))
const radiusBase = computed(() => model.value.radius || 6)
const radiusLg = computed(() => Math.round((model.value.radius || 6) * 1.33))
const radiusXl = computed(() => Math.round((model.value.radius || 6) * 2))

const radiusPreview = computed(() => [
  { label: 'Klein (sm)', value: radiusSm.value, use: 'Chips, Tags' },
  { label: 'Mittel (md)', value: radiusBase.value, use: 'Buttons, Inputs' },
  { label: 'Groß (lg)', value: radiusLg.value, use: 'Cards, Dialoge' },
  { label: 'Extra Groß (xl)', value: radiusXl.value, use: 'Modals, Banner' },
])
</script>

<template>
  <v-row>
    <!-- Border Radius -->
    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-2">Border Radius</h3>
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

        <!-- Preview der abgeleiteten Radien -->
        <div class="mt-6">
          <div
            v-for="r in radiusPreview"
            :key="r.label"
            class="d-flex align-center gap-4 mb-4"
          >
            <div
              :style="{
                width: '80px',
                height: '36px',
                background: 'var(--aw-primary)',
                borderRadius: r.value + 'px',
                flexShrink: 0,
              }"
            />
            <div>
              <div class="text-body-2 font-weight-medium">{{ r.label }}</div>
              <div class="text-caption text-medium-emphasis">{{ r.value }}px — {{ r.use }}</div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Schatten (nur Preview) -->
    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
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
                  width: '160px',
                  height: '60px',
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
