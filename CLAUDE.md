# Appwerker Template — Anweisungen für Claude

## Projektstruktur

```
src/
├── main.js                 — Vue + Vuetify 4 + Pinia Bootstrap
├── App.vue                 — Root: Design-Tokens laden, Toast + Confirm
├── assets/main.css         — CSS Custom Properties (--aw-*)
├── lib/
│   ├── appwrite.js         — Appwrite Client, Account, Databases, Storage, Functions
│   ├── designTokens.js     — Token-Injection + Vuetify-Sync
│   └── crudFactory.js      — Generischer CRUD-Store-Generator
├── stores/
│   ├── auth.js             — Login (OTP + Passwort), Session, Permissions
│   ├── users.js            — CRUD für users-Collection + Einladung
│   ├── rollen.js           — CRUD für rollen-Collection
│   ├── toast.js            — Toast-Queue
│   ├── confirm.js          — Bestätigungsdialog
│   └── design.js           — Design-Tokens (Appwrite)
├── composables/
│   ├── usePermissions.js   — Granulares module:action Berechtigungssystem
│   ├── useToast.js         — Toast-Wrapper: useToast().add({...})
│   ├── useConfirm.js       — Confirm-Wrapper: useConfirm().require({...})
│   ├── useAutoSave.js      — Debounced Auto-Save
│   └── useAppShell.js      — Drawer-State, Layout-Umschaltung
├── components/
│   ├── layout/             — AppShell, AppSidebar, AppTopbar, Layouts
│   ├── shared/             — Toast, Confirm, EmptyState, LoadingState, PageHeader
│   └── design/             — Design-Editor-Komponenten
├── views/
│   ├── LoginView.vue       — OTP-Login (E-Mail → Code) + Admin-Passwort-Fallback
│   ├── DashboardView.vue   — Dashboard
│   ├── ProfileView.vue     — Eigene Daten bearbeiten (Name, E-Mail, Passwort)
│   ├── UsersView.vue       — Benutzerverwaltung + Rollenverwaltung (Admin)
│   └── DesignView.vue      — Design-Editor
└── router/index.js         — Vue Router mit Auth-Guards + Permission-Guards
```

## Seitenstruktur (PFLICHT)

Jede View MUSS exakt dieses Layout verwenden — keine Ausnahmen:

```vue
<template>
  <PageHeader title="Seitentitel" subtitle="Optionaler Untertitel">
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-plus">Aktion</v-btn>
    </template>
  </PageHeader>

  <div class="aw-page-content">
    <!-- Seiteninhalt -->
  </div>
</template>
```

- **PageHeader** ist PFLICHT für den Seitentitel — NIEMALS eigene `<h1>`, `<h2>` oder sonstige Überschriften-Elemente verwenden
- **`.aw-page-content`** ist die globale CSS-Klasse für den Inhaltsbereich (definiert in `main.css`, Padding via Design-Tokens)
- KEIN `<v-container>`, KEIN `px-6`, KEIN hardcodiertes Padding — immer `.aw-page-content` verwenden

## Design-Token System (PFLICHT)

Alle Abstände, Farben, Radien, Schatten und Typografie MÜSSEN über `var(--aw-*)` CSS Custom Properties laufen. KEINE hardcodierten Werte wie `#333`, `16px`, `8px border-radius`.

### Farben
| Token | Beschreibung |
|-------|-------------|
| `--aw-primary` | Primärfarbe |
| `--aw-primary-hover` | Primärfarbe Hover |
| `--aw-on-primary` | Text auf Primary |
| `--aw-secondary` | Sekundärfarbe |
| `--aw-accent` | Akzentfarbe |
| `--aw-error`, `--aw-success`, `--aw-warning`, `--aw-info` | Status-Farben |
| `--aw-background` | Hintergrund |
| `--aw-surface` | Card/Panel-Hintergrund |
| `--aw-surface-raised` | Erhöhte Surface |
| `--aw-text` | Haupttext |
| `--aw-text-secondary` | Sekundärtext |
| `--aw-text-muted` | Gedämpfter Text |
| `--aw-border` | Rahmenfarbe |

### Abstände
| Token | Default |
|-------|---------|
| `--aw-space-xs` | 4px |
| `--aw-space-sm` | 8px |
| `--aw-space-md` | 16px |
| `--aw-space-lg` | 24px |
| `--aw-space-xl` | 32px |
| `--aw-space-2xl` | 48px |

### Radien
| Token | Beschreibung |
|-------|-------------|
| `--aw-radius-sm` | Klein (Chips) |
| `--aw-radius` | Standard (Buttons, Inputs) |
| `--aw-radius-lg` | Groß (Cards, Dialoge) |
| `--aw-radius-xl` | Extra groß |

### Schatten
`--aw-shadow-xs`, `--aw-shadow-sm`, `--aw-shadow`, `--aw-shadow-lg`, `--aw-shadow-xl`, `--aw-shadow-2xl`

### Typografie
| Token-Muster | Elemente |
|-------------|----------|
| `--aw-typo-{el}-size` | h1, h2, h3, h4, h5, h6, body, small |
| `--aw-typo-{el}-line-height` | Zeilenhöhe |
| `--aw-typo-{el}-weight` | Schriftstärke |
| `--aw-typo-{el}-font` | Schriftfamilie |
| `--aw-font-family` | Body-Schrift |
| `--aw-font-family-heading` | Überschriften-Schrift |
| `--aw-font-mono` | Monospace-Schrift |

### Sidebar
`--aw-sidebar-bg`, `--aw-sidebar-text`, `--aw-sidebar-active-bg`, `--aw-sidebar-active-text`, `--aw-sidebar-width`

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

  <div class="aw-page-content">
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
  </div>
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
// In src/components/layout/AppSidebar.vue — allNavItems Array erweitern:
{ title: 'Kunden', icon: 'mdi-account-group', to: '/kunden', module: 'kunden' },
```

### 5. Berechtigungen registrieren

```javascript
// In src/composables/usePermissions.js — MODULES erweitern:
kunden: { label: 'Kunden', actions: ['read', 'write'] },
```

### 6. Route mit Permission-Guard

```javascript
// In src/router/index.js — meta.module setzt Permission-Prüfung:
{
  path: 'kunden',
  component: () => import('@/views/KundenView.vue'),
  meta: { title: 'Kunden', module: 'kunden' },
},
```

## Berechtigungssystem

- **Format:** `module:action` (z.B. `kunden:read`, `kunden:write`)
- **null** = Vollzugriff (Admin oder kein `users`-Eintrag)
- **Rollen-Collection:** `rollen` mit Feldern `name`, `istAdmin`, `berechtigungen[]`, `sortierung`
- **Users-Collection:** `users` mit Feldern `userId`, `vorname`, `nachname`, `email`, `rolle`, `profilBild`
- **Router:** `meta.public: true` = ohne Login, `meta.module: 'xyz'` = Berechtigung prüfen
- **Sidebar:** Nav-Items mit `module`-Feld werden automatisch gefiltert

## Authentifizierung

- **OTP-Login:** E-Mail → 6-stelliger Code → Session (erfordert SMTP in Appwrite)
- **Admin-Login:** E-Mail + Passwort als Fallback
- **Token-Login:** Auto-Login via URL-Parameter (`?aw-user=...&aw-secret=...`)

## DSGVO / Datenschutz

- **KEINE externen Dienste** im Frontend einbinden (Google Fonts, CDNs, Analytics, etc.)
- Schriften müssen **lokal gebündelt** werden (self-hosted via npm oder /public/fonts/)
- Alle Daten bleiben auf dem eigenen Appwrite-Server
- Keine Tracking-Skripte, keine externen Stylesheets

## Konventionen

- Alle Texte auf **Deutsch**
- Datenbank-ID: immer `'main'` (DB_ID aus appwrite.js)
- Auth: `useAuthStore()` → `user`, `loginWithOTP()`, `verifyOTP()`, `login()`, `logout()`
- Berechtigungen: `usePermissions()` → `canAccess()`, `canRead()`, `canWrite()`
- Datenbank: `import { databases, DB_ID } from '@/lib/appwrite'`
- UI: **Vuetify 4** Komponenten (v-card, v-btn, v-data-table, v-dialog, ...)
- Icons: Material Design Icons (mdi-*)
- Styling: **IMMER** CSS Custom Properties `var(--aw-*)` für alle Abstände, Farben, Radien, Schatten — **kein Tailwind**, **keine hardcodierten Werte**
- Seitenstruktur: **IMMER** `<PageHeader>` + `<div class="aw-page-content">` — kein eigenes HTML für Seitentitel oder Padding
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
