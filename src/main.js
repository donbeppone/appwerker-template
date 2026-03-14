import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import '@fontsource/instrument-sans/600.css'
import '@fontsource/instrument-sans/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import 'vuetify/styles'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { de } from 'vuetify/locale'

import router from './router/index.js'
import App from './App.vue'
import { coreTokenDefaults, deriveTokens, loadCachedTokens } from './lib/designTokens.js'

// Dark Mode aus localStorage wiederherstellen
if (localStorage.getItem('aw-dark') === 'true') {
  document.documentElement.classList.add('dark')
}

// Tokens aus Cache oder Defaults laden und Vuetify-Theme ableiten
const cachedCore = loadCachedTokens()
const core = { ...coreTokenDefaults, ...cachedCore }
const derived = deriveTokens(core)

const vuetify = createVuetify({
  locale: {
    locale: 'de',
    messages: { de },
  },
  theme: {
    defaultTheme: localStorage.getItem('aw-dark') === 'true' ? 'dark' : 'light',
    themes: {
      light: {
        colors: {
          primary: derived.light.primary,
          'on-primary': derived.light['on-primary'],
          secondary: derived.light.secondary,
          'on-secondary': derived.light['on-secondary'],
          error: derived.light.error,
          'on-error': derived.light['on-error'],
          success: derived.light.success,
          'on-success': derived.light['on-success'],
          warning: derived.light.warning,
          'on-warning': derived.light['on-warning'],
          info: derived.light.info,
          'on-info': derived.light['on-info'],
          surface: derived.light.surface,
          'on-surface': derived.light['on-surface'],
          background: derived.light.background,
          'on-background': derived.light['on-background'],
        },
      },
      dark: {
        colors: {
          primary: derived.dark.primary,
          'on-primary': derived.dark['on-primary'],
          secondary: derived.dark.secondary,
          'on-secondary': derived.dark['on-secondary'],
          error: derived.dark.error,
          'on-error': derived.dark['on-error'],
          success: derived.dark.success,
          'on-success': derived.dark['on-success'],
          warning: derived.dark.warning,
          'on-warning': derived.dark['on-warning'],
          info: derived.dark.info,
          'on-info': derived.dark['on-info'],
          surface: derived.dark.surface,
          'on-surface': derived.dark['on-surface'],
          background: derived.dark.background,
          'on-background': derived.dark['on-background'],
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'font-family: inherit; text-transform: none; letter-spacing: -0.01em; font-weight: 500;',
    },
    VTextField: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'lg' },
    VTextarea: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'lg' },
    VSelect: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'lg' },
    VAutocomplete: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'lg' },
    VSwitch: { color: 'primary', density: 'compact' },
    VCard: { rounded: 'lg', flat: true },
    VDataTableFooter: {
      itemsPerPageOptions: [10, 25, 50, 100],
      itemsPerPage: 25,
    },
  },
  icons: { defaultSet: 'mdi' },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
