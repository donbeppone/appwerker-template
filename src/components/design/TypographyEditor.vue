<script setup>
import { onMounted } from 'vue'

const model = defineModel({ type: Object, required: true })

/**
 * Lokal verfügbare Schriften (self-hosted via @fontsource, DSGVO-konform).
 * Neue Fonts: npm install @fontsource/<name> + hier eintragen + in loadFont() importieren.
 */
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

/**
 * Dynamisch @fontsource CSS laden (lazy, nur bei Auswahl)
 */
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

onMounted(() => {
  if (model.value.fontFamily) loadFont(model.value.fontFamily)
  if (model.value.headingFontFamily) loadFont(model.value.headingFontFamily)
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-4">Textschrift</h3>
        <v-select
          :model-value="model.fontFamily"
          @update:model-value="onFontChange('fontFamily', $event)"
          :items="availableFonts"
          item-title="title"
          item-value="value"
          label="Font Family"
          hide-details
        />
        <div class="mt-4 pa-4 rounded-lg" style="background: var(--aw-background)">
          <p :style="{ fontFamily: `'${model.fontFamily}', sans-serif` }" class="text-body-1 mb-2">
            Dies ist ein Beispieltext in der gewählten Schrift.
          </p>
          <p :style="{ fontFamily: `'${model.fontFamily}', sans-serif` }" class="text-body-2 text-medium-emphasis">
            Zahlen: 0123456789. Sonderzeichen: äöü ÄÖÜ ß.
          </p>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-4">Überschriften-Schrift</h3>
        <v-select
          :model-value="model.headingFontFamily"
          @update:model-value="onFontChange('headingFontFamily', $event)"
          :items="availableFonts"
          item-title="title"
          item-value="value"
          label="Heading Font Family"
          hide-details
        />
        <div class="mt-4 pa-4 rounded-lg" style="background: var(--aw-background)">
          <h2 :style="{ fontFamily: `'${model.headingFontFamily}', sans-serif` }" class="text-h5 font-weight-bold mb-2">
            Überschrift Beispiel
          </h2>
          <h3 :style="{ fontFamily: `'${model.headingFontFamily}', sans-serif` }" class="text-h6">
            Unterüberschrift
          </h3>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
