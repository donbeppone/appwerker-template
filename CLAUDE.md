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
│   ├── shared/             — ToastContainer, ConfirmDialog, EmptyState, LoadingState, PageHeader
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

### Sidebar (automatisch abgeleitet aus Background)
`--aw-sidebar-bg`, `--aw-sidebar-text`, `--aw-sidebar-active-bg`, `--aw-sidebar-active-text`, `--aw-sidebar-width`

Die Sidebar-Farben werden **automatisch** aus der Background-Farbe berechnet (kontrastreich, kein UI-Picker). Die CSS-Variablen existieren und können bei Bedarf in scoped CSS überschrieben werden.

## Neues Modul hinzufügen (Auto-Discovery)

Module werden automatisch erkannt — **KEINE bestehenden Dateien ändern!**
Alle Dateien eines Moduls liegen in `src/modules/{name}/`.

### Modul-Struktur

```
src/modules/kunden/
├── index.js              ← Modul-Definition (Route, Nav, Permissions)
├── KundenView.vue        ← Haupt-View
├── store.js              ← Store (optional)
└── components/           ← Modul-spezifische Komponenten (optional)
```

### 1. Modul-Definition (`src/modules/kunden/index.js`)

```javascript
export default {
  route: {
    path: 'kunden',
    component: () => import('./KundenView.vue'),
    meta: { title: 'Kunden', module: 'kunden' },
  },
  nav: {
    title: 'Kunden',
    icon: 'mdi-account-group',
    to: '/kunden',
    module: 'kunden',
  },
  permissions: {
    kunden: { label: 'Kunden', actions: ['read', 'write'] },
  },
}
```

Für komplexe Module mit mehreren Views (z.B. Buchhaltung):
```javascript
export default {
  route: {
    path: 'buchhaltung',
    component: () => import('./BuchhaltungView.vue'),
    meta: { title: 'Buchhaltung', module: 'buchhaltung' },
    children: [
      { path: 'konten', component: () => import('./KontenView.vue'), meta: { title: 'Kontenplan' } },
      { path: 'buchungen', component: () => import('./BuchungenView.vue'), meta: { title: 'Buchungen' } },
    ],
  },
  nav: {
    title: 'Buchhaltung',
    icon: 'mdi-calculator',
    to: '/buchhaltung',
    module: 'buchhaltung',
    children: [
      { title: 'Übersicht', icon: 'mdi-view-dashboard', to: '/buchhaltung' },
      { title: 'Kontenplan', icon: 'mdi-format-list-numbered', to: '/buchhaltung/konten' },
      { title: 'Buchungen', icon: 'mdi-book-open', to: '/buchhaltung/buchungen' },
    ],
  },
  permissions: {
    buchhaltung: { label: 'Buchhaltung', actions: ['read', 'write'] },
  },
}
```
Child-Routes werden automatisch als flache Routen registriert. Nav-Children werden als aufklappbare Gruppe in der Sidebar angezeigt.

Für öffentliche Routen (ohne Login):
```javascript
export default {
  route: { ... },
  publicRoutes: [
    {
      path: '/umfrage/:id',
      component: () => import('./UmfrageTeilnahmeView.vue'),
      meta: { public: true },
    },
  ],
  nav: { ... },
}
```

### 2. Store (`src/modules/kunden/store.js`)

Für Standard-CRUD:
```javascript
import { createCrudStore } from '@/lib/crudFactory.js'

export const useKundenStore = createCrudStore('kunden', 'kunden', {
  defaultSort: { field: 'name', direction: 'asc' },
})
```

`createCrudStore` liefert: `items` (ref), `loading` (ref), `fetchAll()`, `create(data)`, `update(id, data)`, `remove(id)`.

Für erweiterte Logik: eigener Store mit `defineStore` + Composition API.
Imports: `import { databases, DB_ID } from '@/lib/appwrite.js'` und `import { Query, ID } from 'appwrite'`

### 3. View (`src/modules/kunden/KundenView.vue`)

Muss dem Seitenstruktur-Pattern folgen (PageHeader + aw-page-content).
Store-Import relativ: `import { useKundenStore } from './store.js'`

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
- Datenbank: `import { databases, DB_ID } from '@/lib/appwrite'` — für `Query` und `ID`: `import { Query, ID } from 'appwrite'` (npm-Paket, NICHT aus @/lib/appwrite)
- UI: **Vuetify 4** Komponenten (v-card, v-btn, v-data-table, v-dialog, ...)
- Icons: Material Design Icons (mdi-*)
- Styling: **IMMER** CSS Custom Properties `var(--aw-*)` für alle Abstände, Farben, Radien, Schatten — **kein Tailwind**, **keine hardcodierten Werte**
- Seitenstruktur: **IMMER** `<PageHeader>` + `<div class="aw-page-content">` — kein eigenes HTML für Seitentitel oder Padding
- Benachrichtigungen: `useToast().add({ severity, summary, detail })`
- Bestätigung: `useConfirm().require({ header, message, acceptProps })`
- Stores: `createCrudStore()` aus `@/lib/crudFactory.js` für Standard-CRUD. Bei erweiterter Logik: eigener Store mit `defineStore` + Composition API (NICHT Options API, NICHT createCrudStore wrappen)

## Appwrite Datenbank-Tools (Bot)

Wenn der Bot (claude-service) neue Module erstellt, nutzt er diese Tools:

- **`manage_collection`** — Collection mit Attributen in der Appwrite-Datenbank anlegen. IMMER zuerst die Collection anlegen, BEVOR Code geschrieben wird.
- **`create_documents`** — Dokumente direkt in eine Collection einfügen (Testdaten, Seed-Daten). Braucht KEINEN Branch oder Deploy.

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
