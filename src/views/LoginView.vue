<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const mode = ref('login') // 'login' | 'register'
const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const loading = ref(false)

const appName = import.meta.env.VITE_APP_NAME || 'App'

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'register') {
      await auth.register(email.value, password.value, name.value)
    } else {
      await auth.login(email.value, password.value)
    }
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message || 'Anmeldung fehlgeschlagen'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="aw-login-page">
    <v-card class="aw-login-card" max-width="400" width="100%">
      <v-card-text class="pa-8">
        <div class="text-center mb-6">
          <v-icon size="48" color="primary" class="mb-2">mdi-apps</v-icon>
          <h1 class="text-h5 font-weight-bold">{{ appName }}</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">
            {{ mode === 'login' ? 'Anmelden' : 'Konto erstellen' }}
          </p>
        </div>

        <v-alert v-if="error" type="error" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-if="mode === 'register'"
            v-model="name"
            label="Name"
            prepend-inner-icon="mdi-account"
            class="mb-2"
          />

          <v-text-field
            v-model="email"
            label="E-Mail"
            type="email"
            prepend-inner-icon="mdi-email"
            class="mb-2"
          />

          <v-text-field
            v-model="password"
            label="Passwort"
            type="password"
            prepend-inner-icon="mdi-lock"
            class="mb-4"
          />

          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            block
            size="large"
            :loading="loading"
          >
            {{ mode === 'login' ? 'Anmelden' : 'Registrieren' }}
          </v-btn>
        </v-form>

        <div class="text-center mt-4">
          <v-btn
            variant="text"
            size="small"
            @click="mode = mode === 'login' ? 'register' : 'login'"
          >
            {{ mode === 'login' ? 'Konto erstellen' : 'Bereits registriert? Anmelden' }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.aw-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aw-bg);
  padding: 24px;
}

.aw-login-card {
  border-radius: var(--aw-radius-lg) !important;
  box-shadow: var(--aw-shadow-lg) !important;
  border-top: 3px solid var(--aw-primary);
}
</style>
