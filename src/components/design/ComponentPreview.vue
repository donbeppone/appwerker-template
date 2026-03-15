<script setup>
import { ref } from 'vue'

const sampleTableItems = [
  { name: 'Anna Müller', email: 'anna@example.de', rolle: 'Admin', status: 'Aktiv' },
  { name: 'Ben Schmidt', email: 'ben@example.de', rolle: 'Mitglied', status: 'Aktiv' },
  { name: 'Clara Wagner', email: 'clara@example.de', rolle: 'Gast', status: 'Inaktiv' },
]

const sampleTableHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'E-Mail', key: 'email' },
  { title: 'Rolle', key: 'rolle' },
  { title: 'Status', key: 'status' },
]

const textInput = ref('Beispieltext')
const selectValue = ref('option1')
const switchValue = ref(true)
const checkboxValue = ref(true)
const radioValue = ref('a')
const sliderValue = ref(40)
const tabValue = ref('tab1')
const chipGroup = ref(['Vue', 'Vuetify'])
</script>

<template>
  <div class="cp-root">

    <!-- BUTTONS -->
    <section class="cp-section">
      <h3 class="cp-title">Buttons</h3>
      <div class="cp-group">
        <p class="cp-label">Varianten</p>
        <div class="cp-row">
          <v-btn color="primary" variant="flat">Flat</v-btn>
          <v-btn color="primary" variant="outlined">Outlined</v-btn>
          <v-btn color="primary" variant="tonal">Tonal</v-btn>
          <v-btn color="primary" variant="text">Text</v-btn>
          <v-btn color="primary" variant="elevated">Elevated</v-btn>
        </div>
      </div>
      <div class="cp-group">
        <p class="cp-label">Farben</p>
        <div class="cp-row">
          <v-btn color="primary" variant="flat" size="small">Primary</v-btn>
          <v-btn color="secondary" variant="flat" size="small">Secondary</v-btn>
          <v-btn color="error" variant="flat" size="small">Error</v-btn>
          <v-btn color="success" variant="flat" size="small">Success</v-btn>
          <v-btn color="warning" variant="flat" size="small">Warning</v-btn>
          <v-btn color="info" variant="flat" size="small">Info</v-btn>
        </div>
      </div>
      <div class="cp-group">
        <p class="cp-label">Größen & Zustände</p>
        <div class="cp-row">
          <v-btn color="primary" size="x-small">X-Small</v-btn>
          <v-btn color="primary" size="small">Small</v-btn>
          <v-btn color="primary">Default</v-btn>
          <v-btn color="primary" size="large">Large</v-btn>
          <v-btn color="primary" disabled>Disabled</v-btn>
          <v-btn color="primary" loading>Loading</v-btn>
        </div>
      </div>
      <div class="cp-group">
        <p class="cp-label">Icon-Buttons</p>
        <div class="cp-row">
          <v-btn icon="mdi-pencil" color="primary" variant="flat" size="small" />
          <v-btn icon="mdi-delete" color="error" variant="tonal" size="small" />
          <v-btn icon="mdi-heart" color="secondary" variant="outlined" size="small" />
          <v-btn icon="mdi-share" color="info" variant="text" size="small" />
          <v-btn prepend-icon="mdi-plus" color="primary" variant="flat" size="small">Neu</v-btn>
          <v-btn prepend-icon="mdi-download" color="secondary" variant="outlined" size="small">Export</v-btn>
        </div>
      </div>
    </section>

    <!-- CARDS -->
    <section class="cp-section">
      <h3 class="cp-title">Karten</h3>
      <div class="cp-cards-grid">
        <v-card>
          <v-card-title>Einfache Karte</v-card-title>
          <v-card-subtitle>Mit Untertitel</v-card-subtitle>
          <v-card-text>
            Diese Karte zeigt die aktuellen Schatten, Radien und Hintergrundfarben.
            Alle Werte kommen aus den Design-Tokens.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="text">Aktion</v-btn>
            <v-btn color="primary" variant="text">Mehr</v-btn>
          </v-card-actions>
        </v-card>

        <v-card>
          <v-card-title>Statistik</v-card-title>
          <v-card-text>
            <div class="cp-stat">
              <span class="cp-stat-value">1.247</span>
              <span class="cp-stat-label">Besucher diese Woche</span>
            </div>
            <v-progress-linear color="primary" model-value="72" rounded class="mt-3" />
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Liste</v-card-title>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-account" title="Benutzer" subtitle="12 aktiv" />
            <v-list-item prepend-icon="mdi-file-document" title="Dokumente" subtitle="48 Dateien" />
            <v-list-item prepend-icon="mdi-calendar" title="Termine" subtitle="3 heute" />
          </v-list>
        </v-card>
      </div>
    </section>

    <!-- FORMULARE -->
    <section class="cp-section">
      <h3 class="cp-title">Formular-Elemente</h3>
      <div class="cp-form-grid">
        <v-text-field
          v-model="textInput"
          label="Textfeld"
          variant="outlined"
          density="comfortable"
          hint="Hilfetext für dieses Feld"
          persistent-hint
        />
        <v-text-field
          label="Mit Icon"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          placeholder="Suchen..."
        />
        <v-select
          v-model="selectValue"
          label="Auswahl"
          variant="outlined"
          density="comfortable"
          :items="[
            { title: 'Option 1', value: 'option1' },
            { title: 'Option 2', value: 'option2' },
            { title: 'Option 3', value: 'option3' },
          ]"
        />
        <v-textarea
          label="Textarea"
          variant="outlined"
          density="comfortable"
          rows="2"
          model-value="Mehrzeiliger Text zur Vorschau"
        />
      </div>
      <div class="cp-group">
        <p class="cp-label">Schalter & Checkboxen</p>
        <div class="cp-row cp-row-controls">
          <v-switch v-model="switchValue" label="Aktiv" color="primary" hide-details />
          <v-checkbox v-model="checkboxValue" label="Bestätigt" color="primary" hide-details />
          <v-radio-group v-model="radioValue" inline hide-details>
            <v-radio label="Option A" value="a" color="primary" />
            <v-radio label="Option B" value="b" color="primary" />
          </v-radio-group>
        </div>
      </div>
      <div class="cp-group">
        <p class="cp-label">Slider</p>
        <v-slider v-model="sliderValue" color="primary" thumb-label hide-details />
      </div>
    </section>

    <!-- TABELLE -->
    <section class="cp-section">
      <h3 class="cp-title">Datentabelle</h3>
      <v-data-table
        :headers="sampleTableHeaders"
        :items="sampleTableItems"
        density="comfortable"
        class="rounded"
      >
        <template #item.status="{ value }">
          <v-chip
            :color="value === 'Aktiv' ? 'success' : 'default'"
            size="small"
            variant="tonal"
          >
            {{ value }}
          </v-chip>
        </template>
      </v-data-table>
    </section>

    <!-- FEEDBACK -->
    <section class="cp-section">
      <h3 class="cp-title">Feedback & Hinweise</h3>
      <div class="cp-alerts-grid">
        <v-alert type="success" variant="tonal" title="Erfolg" text="Die Aktion wurde erfolgreich durchgeführt." />
        <v-alert type="error" variant="tonal" title="Fehler" text="Es ist ein Fehler aufgetreten." />
        <v-alert type="warning" variant="tonal" title="Warnung" text="Bitte überprüfen Sie die Eingaben." />
        <v-alert type="info" variant="tonal" title="Info" text="Es gibt neue Aktualisierungen." />
      </div>
      <div class="cp-group">
        <p class="cp-label">Badges & Chips</p>
        <div class="cp-row">
          <v-chip color="primary" variant="flat">Primary</v-chip>
          <v-chip color="secondary" variant="flat">Secondary</v-chip>
          <v-chip color="error" variant="flat" size="small">3 Fehler</v-chip>
          <v-chip color="success" variant="tonal" prepend-icon="mdi-check">Erledigt</v-chip>
          <v-chip closable color="primary" variant="outlined">Entfernbar</v-chip>
        </div>
      </div>
      <div class="cp-group">
        <p class="cp-label">Chip-Gruppe (auswählbar)</p>
        <div class="cp-row">
          <v-chip-group v-model="chipGroup" multiple selected-class="text-primary">
            <v-chip v-for="tag in ['Vue', 'Vuetify', 'Pinia', 'Appwrite', 'TypeScript']" :key="tag" :value="tag" variant="outlined" filter>
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </section>

    <!-- NAVIGATION -->
    <section class="cp-section">
      <h3 class="cp-title">Navigation</h3>
      <div class="cp-group">
        <p class="cp-label">Tabs</p>
        <v-tabs v-model="tabValue" color="primary">
          <v-tab value="tab1">Übersicht</v-tab>
          <v-tab value="tab2">Details</v-tab>
          <v-tab value="tab3">Einstellungen</v-tab>
        </v-tabs>
      </div>
      <div class="cp-group">
        <p class="cp-label">Breadcrumbs</p>
        <v-breadcrumbs :items="['Dashboard', 'Einstellungen', 'Design']" />
      </div>
      <div class="cp-group">
        <p class="cp-label">Pagination</p>
        <div class="cp-row">
          <v-pagination :length="5" :model-value="2" density="comfortable" size="small" />
        </div>
      </div>
    </section>

    <!-- TYPOGRAFIE -->
    <section class="cp-section">
      <h3 class="cp-title">Typografie</h3>
      <div class="cp-typo-stack">
        <h1 style="font-family: var(--aw-typo-heading-font); font-size: var(--aw-typo-h1-size); font-weight: var(--aw-typo-h1-weight); line-height: var(--aw-typo-h1-lh);">Überschrift H1</h1>
        <h2 style="font-family: var(--aw-typo-heading-font); font-size: var(--aw-typo-h2-size); font-weight: var(--aw-typo-h2-weight); line-height: var(--aw-typo-h2-lh);">Überschrift H2</h2>
        <h3 style="font-family: var(--aw-typo-heading-font); font-size: var(--aw-typo-h3-size); font-weight: var(--aw-typo-h3-weight); line-height: var(--aw-typo-h3-lh);">Überschrift H3</h3>
        <h4 style="font-family: var(--aw-typo-heading-font); font-size: var(--aw-typo-h4-size); font-weight: var(--aw-typo-h4-weight); line-height: var(--aw-typo-h4-lh);">Überschrift H4</h4>
        <h5 style="font-family: var(--aw-typo-heading-font); font-size: var(--aw-typo-h5-size); font-weight: var(--aw-typo-h5-weight); line-height: var(--aw-typo-h5-lh);">Überschrift H5</h5>
        <h6 style="font-family: var(--aw-typo-heading-font); font-size: var(--aw-typo-h6-size); font-weight: var(--aw-typo-h6-weight); line-height: var(--aw-typo-h6-lh);">Überschrift H6</h6>
        <p style="font-family: var(--aw-typo-body-font); font-size: var(--aw-typo-body-size); font-weight: var(--aw-typo-body-weight); line-height: var(--aw-typo-body-lh);">
          Body-Text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p style="font-family: var(--aw-typo-body-font); font-size: var(--aw-typo-small-size); font-weight: var(--aw-typo-small-weight); line-height: var(--aw-typo-small-lh); opacity: 0.7;">
          Small-Text: Kleinere Beschreibungen, Hilfe-Texte und Fußnoten verwenden diese Größe.
        </p>
      </div>
    </section>

    <!-- PROGRESS & LOADING -->
    <section class="cp-section">
      <h3 class="cp-title">Ladezustände</h3>
      <div class="cp-group">
        <p class="cp-label">Progress</p>
        <div class="cp-progress-stack">
          <v-progress-linear color="primary" model-value="25" rounded />
          <v-progress-linear color="secondary" model-value="60" rounded />
          <v-progress-linear color="success" model-value="100" rounded />
          <v-progress-linear color="primary" indeterminate rounded />
        </div>
      </div>
      <div class="cp-group">
        <p class="cp-label">Circular</p>
        <div class="cp-row">
          <v-progress-circular color="primary" :model-value="25" :size="48" :width="4">25%</v-progress-circular>
          <v-progress-circular color="secondary" :model-value="60" :size="48" :width="4">60%</v-progress-circular>
          <v-progress-circular color="success" :model-value="100" :size="48" :width="4">
            <v-icon icon="mdi-check" size="small" />
          </v-progress-circular>
          <v-progress-circular color="primary" indeterminate :size="48" :width="4" />
        </div>
      </div>
    </section>

    <!-- SCHATTEN -->
    <section class="cp-section">
      <h3 class="cp-title">Schatten & Radien</h3>
      <div class="cp-shadow-grid">
        <div v-for="level in ['xs', 'sm', 'md', 'lg', 'xl', '2xl']" :key="level" class="cp-shadow-card" :style="{ boxShadow: `var(--aw-shadow-${level})` }">
          <span class="cp-shadow-label">{{ level }}</span>
        </div>
      </div>
      <div class="cp-group" style="margin-top: var(--aw-space-lg);">
        <p class="cp-label">Border-Radius</p>
        <div class="cp-radius-row">
          <div v-for="r in ['xs', 'sm', 'md', 'lg', 'xl', 'full']" :key="r" class="cp-radius-box" :style="{ borderRadius: `var(--aw-radius-${r})` }">
            {{ r }}
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.cp-root {
  display: flex;
  flex-direction: column;
  gap: var(--aw-space-xl);
}

.cp-section {
  background: var(--aw-color-bg);
  border: 1px solid rgba(128, 128, 128, 0.15);
  border-radius: var(--aw-radius-md);
  padding: var(--aw-space-lg);
}

.cp-title {
  font-family: var(--aw-typo-heading-font);
  font-size: var(--aw-typo-h4-size);
  font-weight: var(--aw-typo-h4-weight);
  margin-bottom: var(--aw-space-md);
  padding-bottom: var(--aw-space-sm);
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
}

.cp-group {
  margin-top: var(--aw-space-md);
}

.cp-label {
  font-size: var(--aw-typo-small-size);
  font-weight: 600;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--aw-space-sm);
}

.cp-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--aw-space-sm);
  align-items: center;
}

.cp-row-controls {
  gap: var(--aw-space-lg);
}

.cp-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--aw-space-md);
}

.cp-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cp-stat-value {
  font-family: var(--aw-typo-heading-font);
  font-size: var(--aw-typo-h2-size);
  font-weight: 700;
  color: var(--aw-color-primary);
}

.cp-stat-label {
  font-size: var(--aw-typo-small-size);
  opacity: 0.6;
}

.cp-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--aw-space-md);
}

.cp-alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--aw-space-sm);
}

.cp-typo-stack {
  display: flex;
  flex-direction: column;
  gap: var(--aw-space-xs);
}

.cp-progress-stack {
  display: flex;
  flex-direction: column;
  gap: var(--aw-space-sm);
}

.cp-shadow-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--aw-space-md);
}

.cp-shadow-card {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aw-color-bg);
  border-radius: var(--aw-radius-md);
  border: 1px solid rgba(128, 128, 128, 0.08);
}

.cp-shadow-label {
  font-size: var(--aw-typo-small-size);
  font-weight: 600;
  opacity: 0.5;
  text-transform: uppercase;
}

.cp-radius-row {
  display: flex;
  gap: var(--aw-space-md);
  flex-wrap: wrap;
}

.cp-radius-box {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aw-color-primary);
  color: white;
  font-size: var(--aw-typo-small-size);
  font-weight: 600;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .cp-shadow-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
