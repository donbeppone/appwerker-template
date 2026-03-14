<script setup>
const borderRadius = defineModel('borderRadius', { type: Object, required: true })
const shadows = defineModel('shadows', { type: Object, required: true })

const radiusDefs = [
  { key: 'sm', label: 'Klein', desc: 'Chips, Tags' },
  { key: 'md', label: 'Mittel', desc: 'Buttons, Inputs' },
  { key: 'lg', label: 'Groß', desc: 'Cards, Dialoge' },
  { key: 'xl', label: 'Extra Groß', desc: 'Modals, Banner' },
]
</script>

<template>
  <v-row>
    <!-- Border Radius -->
    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-4">Border Radius</h3>

        <div v-for="def in radiusDefs" :key="def.key" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-body-2">{{ def.label }}</span>
            <span class="text-caption text-medium-emphasis">{{ borderRadius[def.key] }}</span>
          </div>
          <v-slider
            :model-value="parseInt(borderRadius[def.key]) || 0"
            @update:model-value="borderRadius[def.key] = $event + 'px'"
            :min="0"
            :max="30"
            :step="1"
            hide-details
            color="primary"
            thumb-label
          />
          <div
            class="mt-2 d-flex align-center justify-center"
            style="height: 48px"
          >
            <div
              :style="{
                width: '120px',
                height: '40px',
                background: 'var(--aw-primary)',
                borderRadius: borderRadius[def.key],
              }"
            />
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Schatten -->
    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-4">Schatten</h3>

        <div class="d-flex flex-column gap-6">
          <div v-for="(label, key) in { sm: 'Klein', md: 'Mittel', lg: 'Groß' }" :key="key">
            <span class="text-body-2 font-weight-medium">{{ label }}</span>
            <v-text-field
              v-model="shadows[key]"
              density="compact"
              variant="outlined"
              hide-details
              class="mt-2"
              style="font-family: monospace; font-size: 12px"
            />
            <div class="d-flex justify-center mt-3">
              <div
                :style="{
                  width: '160px',
                  height: '60px',
                  background: 'var(--aw-surface)',
                  borderRadius: 'var(--aw-radius)',
                  boxShadow: shadows[key],
                }"
              />
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
