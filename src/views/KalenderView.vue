<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTermineStore } from '@/stores/termine.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import PageHeader from '@/components/shared/PageHeader.vue'
import LoadingState from '@/components/shared/LoadingState.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const store = useTermineStore()
const toast = useToast()
const confirm = useConfirm()

const ansicht = ref('monat')
const filterKategorie = ref('Alle')
const aktuellerMonatDatum = ref(new Date())
const dialog = ref(false)
const editTermin = ref(null)

const form = ref({
  titel: '',
  beschreibung: '',
  datum: '',
  uhrzeit_start: '09:00',
  uhrzeit_ende: '',
  kategorie: '',
  ort: '',
  teilnehmer: '',
  prioritaet: 'Normal',
})

const wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const aktuellerMonat = computed(() =>
  aktuellerMonatDatum.value.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
)

const gefilterteTermine = computed(() =>
  store.termine
    .filter(t => filterKategorie.value === 'Alle' || t.kategorie === filterKategorie.value)
    .sort((a, b) => new Date(a.datum) - new Date(b.datum))
)

const kalenderTage = computed(() => {
  const jahr = aktuellerMonatDatum.value.getFullYear()
  const monat = aktuellerMonatDatum.value.getMonth()
  const ersterTag = new Date(jahr, monat, 1)
  const letzterTag = new Date(jahr, monat + 1, 0)
  const startWochentag = (ersterTag.getDay() + 6) % 7
  const tage = []

  const vorherMonat = new Date(jahr, monat, 0)
  for (let i = startWochentag - 1; i >= 0; i--) {
    tage.push(tagErstellen(new Date(jahr, monat - 1, vorherMonat.getDate() - i), false))
  }
  for (let tag = 1; tag <= letzterTag.getDate(); tag++) {
    tage.push(tagErstellen(new Date(jahr, monat, tag), true))
  }
  const rest = 42 - tage.length
  for (let tag = 1; tag <= rest; tag++) {
    tage.push(tagErstellen(new Date(jahr, monat + 1, tag), false))
  }
  return tage
})

function tagErstellen(datum, imAktuellenMonat) {
  const heute = new Date()
  return {
    datum: datum.toISOString(),
    tag: datum.getDate(),
    imAktuellenMonat,
    istHeute: datum.toDateString() === heute.toDateString(),
    termine: gefilterteTermine.value.filter(t =>
      new Date(t.datum).toDateString() === datum.toDateString()
    ),
  }
}

function vorherigenMonat() {
  const d = aktuellerMonatDatum.value
  aktuellerMonatDatum.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
}

function naechstenMonat() {
  const d = aktuellerMonatDatum.value
  aktuellerMonatDatum.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
}

function openCreate() {
  editTermin.value = null
  form.value = {
    titel: '', beschreibung: '', datum: new Date().toISOString().split('T')[0],
    uhrzeit_start: '09:00', uhrzeit_ende: '', kategorie: '', ort: '',
    teilnehmer: '', prioritaet: 'Normal',
  }
  dialog.value = true
}

function openEdit(termin) {
  editTermin.value = termin
  form.value = {
    titel: termin.titel || '',
    beschreibung: termin.beschreibung || '',
    datum: termin.datum ? termin.datum.split('T')[0] : '',
    uhrzeit_start: termin.uhrzeit_start || '',
    uhrzeit_ende: termin.uhrzeit_ende || '',
    kategorie: termin.kategorie || '',
    ort: termin.ort || '',
    teilnehmer: termin.teilnehmer || '',
    prioritaet: termin.prioritaet || 'Normal',
  }
  dialog.value = true
}

async function save() {
  if (!form.value.titel || !form.value.datum) return
  const data = {
    ...form.value,
    datum: new Date(form.value.datum + 'T' + (form.value.uhrzeit_start || '00:00')).toISOString(),
  }
  try {
    if (editTermin.value) {
      await store.update(editTermin.value.$id, data)
      toast.add({ severity: 'success', summary: 'Termin aktualisiert' })
    } else {
      await store.create(data)
      toast.add({ severity: 'success', summary: 'Termin erstellt' })
    }
    dialog.value = false
  } catch (e) {
    toast.add({ severity: 'error', summary: e.message || 'Fehler beim Speichern' })
  }
}

async function remove(termin) {
  const ok = await confirm.require({
    header: 'Termin löschen',
    message: `"${termin.titel}" wirklich löschen?`,
    acceptProps: { label: 'Löschen', severity: 'danger' },
  })
  if (ok) {
    await store.remove(termin.$id)
    toast.add({ severity: 'success', summary: 'Termin gelöscht' })
  }
}

function kategorieColor(kat) {
  const map = { Arbeit: 'blue', Privat: 'green', Gesundheit: 'red', Sport: 'orange', Familie: 'purple', Sonstiges: 'teal' }
  return map[kat] || 'grey'
}

function prioritaetColor(p) {
  const map = { Niedrig: 'green', Normal: 'blue', Hoch: 'orange', Dringend: 'red' }
  return map[p] || 'grey'
}

function formatDatum(d) {
  return new Date(d).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => store.fetchAll())
</script>

<template>
  <PageHeader title="Kalender" subtitle="Termine verwalten">
    <template #actions>
      <v-btn-toggle v-model="ansicht" mandatory density="compact" class="mr-2">
        <v-btn value="monat" icon="mdi-calendar" size="small" />
        <v-btn value="liste" icon="mdi-format-list-bulleted" size="small" />
      </v-btn-toggle>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Termin</v-btn>
    </template>
  </PageHeader>

  <div class="aw-page-content">
    <LoadingState v-if="store.loading" />

    <!-- ═══ Monatsansicht ═══ -->
    <template v-else-if="ansicht === 'monat'">
      <div class="kv-nav">
        <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="vorherigenMonat" />
        <span class="kv-monat">{{ aktuellerMonat }}</span>
        <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="naechstenMonat" />
      </div>

      <v-card>
        <div class="kv-header">
          <div v-for="tag in wochentage" :key="tag" class="kv-wochentag">{{ tag }}</div>
        </div>
        <div class="kv-grid">
          <div
            v-for="tag in kalenderTage"
            :key="tag.datum"
            class="kv-tag"
            :class="{ 'kv-tag--other': !tag.imAktuellenMonat, 'kv-tag--today': tag.istHeute }"
          >
            <div class="kv-tag-nr">{{ tag.tag }}</div>
            <div
              v-for="t in tag.termine.slice(0, 3)"
              :key="t.$id"
              class="kv-termin"
              :style="{ borderLeftColor: `rgb(var(--v-theme-${kategorieColor(t.kategorie)}))` }"
              @click="openEdit(t)"
            >
              <span class="kv-termin-zeit">{{ t.uhrzeit_start }}</span>
              {{ t.titel }}
            </div>
            <div v-if="tag.termine.length > 3" class="kv-mehr">+{{ tag.termine.length - 3 }}</div>
          </div>
        </div>
      </v-card>
    </template>

    <!-- ═══ Listenansicht ═══ -->
    <template v-else>
      <v-select
        v-model="filterKategorie"
        :items="['Alle', ...store.kategorien]"
        label="Kategorie"
        density="compact"
        class="mb-4"
        style="max-width: 240px"
      />

      <EmptyState
        v-if="!gefilterteTermine.length"
        title="Keine Termine"
        action-label="Termin erstellen"
        @action="openCreate"
      />

      <v-card v-for="t in gefilterteTermine" :key="t.$id" class="mb-3">
        <v-card-text>
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="d-flex align-center mb-1" style="gap: var(--aw-space-xs)">
                <v-chip :color="kategorieColor(t.kategorie)" size="x-small">{{ t.kategorie }}</v-chip>
                <v-chip v-if="t.prioritaet !== 'Normal'" :color="prioritaetColor(t.prioritaet)" size="x-small" variant="outlined">{{ t.prioritaet }}</v-chip>
              </div>
              <p class="text-body-1 font-weight-medium">{{ t.titel }}</p>
              <p v-if="t.beschreibung" class="text-body-2 text-medium-emphasis">{{ t.beschreibung }}</p>
              <div class="text-body-2 text-medium-emphasis mt-1">
                {{ formatDatum(t.datum) }} · {{ t.uhrzeit_start }}<span v-if="t.uhrzeit_ende"> – {{ t.uhrzeit_ende }}</span>
                <span v-if="t.ort"> · {{ t.ort }}</span>
              </div>
            </div>
            <div class="d-flex">
              <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEdit(t)" />
              <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="remove(t)" />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- ═══ Dialog ═══ -->
    <v-dialog v-model="dialog" max-width="560">
      <v-card>
        <v-card-title>{{ editTermin ? 'Termin bearbeiten' : 'Neuer Termin' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.titel" label="Titel" class="mb-2" />
          <v-row dense class="mb-2">
            <v-col cols="6"><v-text-field v-model="form.datum" label="Datum" type="date" /></v-col>
            <v-col cols="3"><v-text-field v-model="form.uhrzeit_start" label="Von" type="time" /></v-col>
            <v-col cols="3"><v-text-field v-model="form.uhrzeit_ende" label="Bis" type="time" /></v-col>
          </v-row>
          <v-row dense class="mb-2">
            <v-col cols="6"><v-select v-model="form.kategorie" :items="store.kategorien" label="Kategorie" /></v-col>
            <v-col cols="6"><v-select v-model="form.prioritaet" :items="store.prioritaeten" label="Priorität" /></v-col>
          </v-row>
          <v-text-field v-model="form.ort" label="Ort" class="mb-2" />
          <v-text-field v-model="form.teilnehmer" label="Teilnehmer" class="mb-2" />
          <v-textarea v-model="form.beschreibung" label="Beschreibung" rows="2" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Abbrechen</v-btn>
          <v-btn color="primary" variant="flat" @click="save">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.kv-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--aw-space-sm);
  margin-bottom: var(--aw-space-md);
}

.kv-monat {
  font-weight: 600;
  min-width: 160px;
  text-align: center;
}

.kv-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--aw-border);
}

.kv-wochentag {
  padding: var(--aw-space-sm);
  text-align: center;
  font-weight: 600;
  font-size: var(--aw-typo-small-size);
  color: var(--aw-text-secondary);
}

.kv-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.kv-tag {
  min-height: 100px;
  padding: var(--aw-space-xs);
  border-right: 1px solid var(--aw-border);
  border-bottom: 1px solid var(--aw-border);
}

.kv-tag:nth-child(7n) {
  border-right: none;
}

.kv-tag--other {
  opacity: 0.4;
}

.kv-tag--today .kv-tag-nr {
  background: var(--aw-primary);
  color: var(--aw-on-primary);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kv-tag-nr {
  font-size: var(--aw-typo-small-size);
  font-weight: 600;
  margin-bottom: var(--aw-space-xs);
}

.kv-termin {
  font-size: 11px;
  padding: 1px var(--aw-space-xs);
  border-left: 3px solid;
  border-radius: 2px;
  margin-bottom: 2px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kv-termin:hover {
  background: var(--aw-surface-raised);
}

.kv-termin-zeit {
  font-weight: 600;
  margin-right: var(--aw-space-xs);
}

.kv-mehr {
  font-size: 10px;
  color: var(--aw-text-muted);
  text-align: center;
}

@media (max-width: 768px) {
  .kv-tag {
    min-height: 60px;
  }
  .kv-termin {
    font-size: 10px;
  }
}
</style>
