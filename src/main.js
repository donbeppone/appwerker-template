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
          primary: '#6366f1',
          'on-primary': '#ffffff',
          secondary: '#6b7280',
          error: '#ef4444',
          success: '#22c55e',
          warning: '#f59e0b',
          info: '#3b82f6',
          surface: '#ffffff',
          background: '#f8f9fb',
        },
      },
      dark: {
        colors: {
          primary: '#818cf8',
          'on-primary': '#1e1b4b',
          secondary: '#9ca3af',
          error: '#f87171',
          success: '#4ade80',
          warning: '#fbbf24',
          info: '#60a5fa',
          surface: '#1a1d27',
          background: '#0f1117',
        },
      },
    },
  },
  defaults: {
    VBtn: { style: 'font-family: inherit; text-transform: none; letter-spacing: 0;' },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSwitch: { color: 'primary', density: 'comfortable' },
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
