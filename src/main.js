import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { de } from 'vuetify/locale'

import router from './router/index.js'
import App from './App.vue'

// Dark Mode aus localStorage wiederherstellen
if (localStorage.getItem('aw-dark') === 'true') {
  document.documentElement.classList.add('dark')
}

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
          primary: '#000000',
          'on-primary': '#ffffff',
          secondary: '#71717a',
          error: '#dc2626',
          success: '#16a34a',
          warning: '#ca8a04',
          info: '#2563eb',
          surface: '#ffffff',
          background: '#fafafa',
        },
      },
      dark: {
        colors: {
          primary: '#ffffff',
          'on-primary': '#09090b',
          secondary: '#a1a1aa',
          error: '#ef4444',
          success: '#22c55e',
          warning: '#eab308',
          info: '#3b82f6',
          surface: '#18181b',
          background: '#09090b',
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
