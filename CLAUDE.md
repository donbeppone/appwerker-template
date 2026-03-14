# Appwerker Template — Anweisungen für Claude

## Projektstruktur

```
src/
├── main.js                 — Vue + Vuetify 4 + Pinia Bootstrap
├── App.vue                 — Root: Design-Tokens laden, Toast + Confirm
├── assets/main.css         — CSS Custom Properties (--aw-*)
├── lib/
│   ├── appwrite.js         — Appwrite Client, Account, Databases, Storage
│   ├── designTokens.js     — Token-Injection + Vuetify-Sync
│   └── crudFactory.js      — Generischer CRUD-Store-Generator
├── stores/
│   ├── auth.js             — Login, Register, Session
│   ├── toast.js            — Toast-Queue
│   ├── confirm.js          — Bestätigungsdialog
│   └── design.js           — Design-Tokens (Appwrite)
├── composables/
│   ├── useToast.js         — Toast-Wrapper: useToast().add({...})
│   ├── useConfirm.js       — Confirm-Wrapper: useConfirm().require({...})
│   ├── useAutoSave.js      — Debounced Auto-Save
│   └── useAppShell.js      — Drawer-State, Layout-Umschaltung
├── components/
│   ├── layout/             — AppShell, AppSidebar, AppTopbar, Layouts
│   ├── shared/             — Toast, Confirm, EmptyState, LoadingState, PageHeader
│   └── design/             — Design-Editor-Komponenten
├── views/
│   ├── LoginView.vue       — Login/Register
│   ├── DashboardView.vue   — Dashboard
│   └── DesignView.vue      — Design-Editor
└── router/index.js         — Vue Router mit Auth-Guards
```

## Neues CRUD-Modul hinzufügen

### 1. Store erstellen

```javascript
// src/stores/kunden.js
import { createCrudStore } from '@/lib/crudFactory.js'

export const useKundenStore = createCrudStore('kunden', 'kunden', {
  defaultSort: { field: 'name', direction: 'asc' },
})
```

### 2. View erstellen

```vue
<!-- src/views/KundenView.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useKundenStore } from '@/stores/kunden.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import LoadingState from '@/components/shared/LoadingState.vue'

const store = useKundenStore()
const toast = useToast()
const confirm = useConfirm()
const dialog = ref(false)
const form = ref({ name: '', email: '' })
const editId = ref(null)

onMounted(() => store.fetchAll())

function openCreate() {
  form.value = { name: '', email: '' }
  editId.value = null
  dialog.value = true
}

function openEdit(item) {
  form.value = { name: item.name, email: item.email }
  editId.value = item.$id
  dialog.value = true
}

async function save() {
  if (editId.value) {
    await store.update(editId.value, form.value)
    toast.add({ severity: 'success', summary: 'Gespeichert' })
  } else {
    await store.create(form.value)
    toast.add({ severity: 'success', summary: 'Erstellt' })
  }
  dialog.value = false
}

async function remove(item) {
  const ok = await confirm.require({
    header: 'Löschen',
    message: `"${item.name}" wirklich löschen?`,
    acceptProps: { label: 'Löschen', severity: 'danger' },
  })
  if (ok) {
    await store.remove(item.$id)
    toast.add({ severity: 'success', summary: 'Gelöscht' })
  }
}
</script>

<template>
  <PageHeader title="Kunden">
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Neu</v-btn>
    </template>
  </PageHeader>

  <v-container fluid class="px-6">
    <LoadingState v-if="store.loading" />
    <EmptyState
      v-else-if="!store.items.length"
      title="Keine Kunden"
      action-label="Ersten Kunden anlegen"
      @action="openCreate"
    />
    <v-data-table
      v-else
      :items="store.items"
      :headers="[
        { title: 'Name', key: 'name' },
        { title: 'E-Mail', key: 'email' },
        { title: '', key: 'actions', sortable: false, align: 'end' },
      ]"
    >
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEdit(item)" />
        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="remove(item)" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editId ? 'Bearbeiten' : 'Neu' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.name" label="Name" class="mb-2" />
          <v-text-field v-model="form.email" label="E-Mail" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Abbrechen</v-btn>
          <v-btn color="primary" variant="flat" @click="save">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
```

### 3. Route hinzufügen

```javascript
// In src/router/index.js — als child der AppShell-Route ('/' path) einfügen:
{
  path: 'kunden',
  component: () => import('@/views/KundenView.vue'),
  meta: { title: 'Kunden' },
},
```

### 4. Navigation erweitern

```javascript
// In src/components/layout/AppSidebar.vue — navItems Array erweitern:
{ title: 'Kunden', icon: 'mdi-account-group', to: '/kunden' },
```

## DSGVO / Datenschutz

- **KEINE externen Dienste** im Frontend einbinden (Google Fonts, CDNs, Analytics, etc.)
- Schriften müssen **lokal gebündelt** werden (self-hosted via npm oder /public/fonts/)
- Alle Daten bleiben auf dem eigenen Appwrite-Server
- Keine Tracking-Skripte, keine externen Stylesheets

## Konventionen

- Alle Texte auf **Deutsch**
- Datenbank-ID: immer `'main'` (DB_ID aus appwrite.js)
- Auth: `useAuthStore()` → `user`, `login()`, `register()`, `logout()`
- Datenbank: `import { databases, DB_ID } from '@/lib/appwrite'`
- UI: **Vuetify 4** Komponenten (v-card, v-btn, v-data-table, v-dialog, ...)
- Icons: Material Design Icons (mdi-*)
- Styling: CSS Custom Properties `var(--aw-*)`, **kein Tailwind**
- Benachrichtigungen: `useToast().add({ severity, summary, detail })`
- Bestätigung: `useConfirm().require({ header, message, acceptProps })`
- Stores: `createCrudStore()` aus `@/lib/crudFactory.js`

## Verfügbare Shared-Komponenten

- `PageHeader` — Seitentitel + Aktions-Buttons (slot #actions)
- `EmptyState` — "Keine Daten" mit Icon + optionalem Button
- `LoadingState` — Lade-Spinner
- `ConfirmDialog` — Globaler Bestätigungsdialog (über useConfirm)
- `ToastContainer` — Toast-Benachrichtigungen (über useToast)

## Umgebungsvariablen

```
VITE_APP_NAME=MeineApp
VITE_APPWRITE_ENDPOINT=https://api.appwerker.de/v1
VITE_APPWRITE_PROJECT_ID=projekt-id
VITE_APPWRITE_DB_ID=main
```
