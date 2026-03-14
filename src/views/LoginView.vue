<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const mode = ref('login')
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
    <div class="aw-login-wrapper">
      <div class="aw-login-brand">
        <div class="aw-logo-mark" />
        <h1 class="aw-app-name">{{ appName }}</h1>
      </div>

      <v-card class="aw-login-card" max-width="380" width="100%">
        <v-card-text class="pa-7">
          <h2 class="text-body-1 font-weight-bold mb-1">
            {{ mode === 'login' ? 'Anmelden' : 'Konto erstellen' }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-5">
            {{ mode === 'login' ? 'Melde dich mit deinem Konto an.' : 'Erstelle ein neues Konto.' }}
          </p>

          <v-alert v-if="error" type="error" density="compact" class="mb-4" variant="tonal">
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-if="mode === 'register'"
              v-model="name"
              label="Name"
              class="mb-3"
              hide-details
            />

            <v-text-field
              v-model="email"
              label="E-Mail"
              type="email"
              class="mb-3"
              hide-details
            />

            <v-text-field
              v-model="password"
              label="Passwort"
              type="password"
              class="mb-5"
              hide-details
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

          <v-divider class="my-5" />

          <div class="text-center">
            <v-btn
              variant="text"
              size="small"
              color="secondary"
              @click="mode = mode === 'login' ? 'register' : 'login'"
            >
              {{ mode === 'login' ? 'Konto erstellen' : 'Bereits registriert? Anmelden' }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.aw-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aw-background);
  padding: var(--aw-space-lg);
}

.aw-login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aw-space-xl);
}

.aw-login-brand {
  display: flex;
  align-items: center;
  gap: var(--aw-space-sm);
}

.aw-logo-mark {
  width: 28px;
  height: 28px;
  background: var(--aw-text);
  border-radius: var(--aw-radius-sm);
}

.aw-app-name {
  font-size: var(--aw-typo-h5-size);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--aw-text);
}

.aw-login-card {
  border: 1px solid var(--aw-border) !important;
  box-shadow: var(--aw-shadow) !important;
}
</style>
