<script setup>
const model = defineModel({ type: Object, required: true })

const colorDefs = [
  { key: 'primary', label: 'Primärfarbe', desc: 'Buttons, Links, Akzente' },
  { key: 'on-primary', label: 'Text auf Primär', desc: 'Textfarbe auf Primär-Hintergrund' },
  { key: 'secondary', label: 'Sekundär', desc: 'Badges, Tags, dezente Elemente' },
  { key: 'accent', label: 'Akzent', desc: 'Hervorhebungen, Hover-Effekte' },
  { key: 'success', label: 'Erfolg', desc: 'Erfolgsmeldungen' },
  { key: 'warning', label: 'Warnung', desc: 'Warnmeldungen' },
  { key: 'error', label: 'Fehler', desc: 'Fehlermeldungen' },
  { key: 'info', label: 'Info', desc: 'Informationsmeldungen' },
  { key: 'background', label: 'Hintergrund', desc: 'Seiten-Hintergrund' },
  { key: 'surface', label: 'Oberfläche', desc: 'Cards, Dialoge' },
  { key: 'text', label: 'Text', desc: 'Haupttextfarbe' },
  { key: 'text-secondary', label: 'Sekundärtext', desc: 'Untertitel, Labels' },
  { key: 'border', label: 'Rahmen', desc: 'Trennlinien, Rahmen' },
]
</script>

<template>
  <v-row>
    <v-col
      v-for="def in colorDefs"
      :key="def.key"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card variant="outlined" rounded="lg" class="pa-4">
        <div class="d-flex align-center gap-3 mb-2">
          <input
            type="color"
            :value="model[def.key] || '#000000'"
            @input="model[def.key] = $event.target.value"
            class="aw-color-input"
          />
          <div>
            <div class="text-body-2 font-weight-medium">{{ def.label }}</div>
            <div class="text-caption text-medium-emphasis">{{ def.desc }}</div>
          </div>
        </div>
        <v-text-field
          :model-value="model[def.key] || ''"
          @update:model-value="model[def.key] = $event"
          density="compact"
          variant="outlined"
          hide-details
          class="mt-2"
          style="font-family: monospace; font-size: 13px"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.aw-color-input {
  width: 40px;
  height: 40px;
  border: 2px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  cursor: pointer;
  padding: 0;
  background: none;
}

.aw-color-input::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.aw-color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}
</style>
