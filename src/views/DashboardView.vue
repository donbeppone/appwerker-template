<script setup>
import { useAuthStore } from '@/stores/auth.js'
import PageHeader from '@/components/shared/PageHeader.vue'

const auth = useAuthStore()
const appName = import.meta.env.VITE_APP_NAME || 'App'
</script>

<template>
  <PageHeader
    title="Dashboard"
    :subtitle="`Willkommen bei ${appName}`"
  />

  <v-container fluid class="px-6">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-6" >
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" size="24" class="mr-3">mdi-account</v-icon>
            <span class="text-body-1 font-weight-medium">Angemeldet als</span>
          </div>
          <p class="text-h6 font-weight-bold">{{ auth.user?.name || 'Benutzer' }}</p>
          <p class="text-body-2 text-medium-emphasis">{{ auth.user?.email }}</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="pa-6" >
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" size="24" class="mr-3">mdi-rocket-launch</v-icon>
            <span class="text-body-1 font-weight-medium">Erste Schritte</span>
          </div>
          <v-list>
            <v-list-item prepend-icon="mdi-palette" title="Design anpassen" subtitle="Farben, Schriften und Layout konfigurieren" to="/einstellungen/design" />
            <v-list-item prepend-icon="mdi-database-plus" title="Daten hinzufügen" subtitle="Erstelle dein erstes CRUD-Modul" />
            <v-list-item prepend-icon="mdi-cog" title="Einstellungen" subtitle="App-Konfiguration verwalten" to="/einstellungen/design" />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
