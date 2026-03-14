<script setup>
const model = defineModel({ type: Object, required: true })

const popularFonts = [
  'DM Sans', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Poppins', 'Nunito', 'Raleway', 'Source Sans 3', 'Work Sans',
  'Outfit', 'Plus Jakarta Sans', 'Manrope', 'Space Grotesk',
]
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-4">Textschrift</h3>
        <v-select
          v-model="model.fontFamily"
          :items="popularFonts"
          label="Font Family"
          hide-details
        />
        <div class="mt-4 pa-4 rounded-lg" style="background: var(--aw-bg)">
          <p :style="{ fontFamily: model.fontFamily }" class="text-body-1">
            Dies ist ein Beispieltext in der gewählten Schrift.
            Zahlen: 0123456789. Sonderzeichen: äöü ÄÖÜ ß.
          </p>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card variant="outlined" rounded="lg" class="pa-6">
        <h3 class="text-body-1 font-weight-bold mb-4">Überschriften-Schrift</h3>
        <v-select
          v-model="model.headingFontFamily"
          :items="popularFonts"
          label="Heading Font Family"
          hide-details
        />
        <div class="mt-4 pa-4 rounded-lg" style="background: var(--aw-bg)">
          <h2 :style="{ fontFamily: model.headingFontFamily }" class="text-h5 font-weight-bold mb-2">
            Überschrift Beispiel
          </h2>
          <h3 :style="{ fontFamily: model.headingFontFamily }" class="text-h6">
            Unterüberschrift
          </h3>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
