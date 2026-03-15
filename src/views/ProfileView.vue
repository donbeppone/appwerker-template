<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useToast } from '@/composables/useToast.js'
import { account } from '@/lib/appwrite.js'
import PageHeader from '@/components/shared/PageHeader.vue'

const auth = useAuthStore()
const toast = useToast()

const name = ref('')
const email = ref('')
const loading = ref(false)

// Password change
const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const passwordLoading = ref(false)

onMounted(() => {
  if (auth.user) {
    name.value = auth.user.name || ''
    email.value = auth.user.email || ''
  }
})

async function saveName() {
  if (!name.value.trim()) return
  loading.value = true
  try {
    await account.updateName(name.value.trim())
    await auth.fetchUser()
    toast.success('Name aktualisiert')
  } catch (e) {
    toast.error(e.message || 'Fehler beim Speichern')
  } finally {
    loading.value = false
  }
}

async function saveEmail() {
  if (!email.value.trim()) return
  loading.value = true
  try {
    // Appwrite requires current password to update email
    // For OTP users without password, this may not work
    await account.updateEmail(email.value.trim(), '')
    await auth.fetchUser()
    toast.success('E-Mail aktualisiert')
  } catch (e) {
    toast.error(e.message || 'E-Mail konnte nicht geändert werden. Ggf. Passwort erforderlich.')
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  if (!newPassword.value || newPassword.value !== newPasswordConfirm.value) {
    toast.error('Passwörter stimmen nicht überein')
    return
  }
  if (newPassword.value.length < 8) {
    toast.error('Mindestens 8 Zeichen')
    return
  }
  passwordLoading.value = true
  try {
    await account.updatePassword(newPassword.value, oldPassword.value || undefined)
    toast.success('Passwort geändert')
    showPasswordForm.value = false
    oldPassword.value = ''
    newPassword.value = ''
    newPasswordConfirm.value = ''
  } catch (e) {
    toast.error(e.message || 'Passwort konnte nicht geändert werden')
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader title="Profil" subtitle="Eigene Daten und Passwort verwalten" />

    <div class="aw-page-content">
      <!-- Name -->
      <v-card variant="outlined" class="mb-4">
        <v-card-text>
          <p class="text-body-2 font-weight-bold mb-3">Name</p>
          <div class="pv-row">
            <v-text-field
              v-model="name"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 320px"
            />
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              :loading="loading"
              :disabled="!name.trim() || name === auth.user?.name"
              @click="saveName"
            >
              Speichern
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Email -->
      <v-card variant="outlined" class="mb-4">
        <v-card-text>
          <p class="text-body-2 font-weight-bold mb-3">E-Mail</p>
          <div class="pv-row">
            <v-text-field
              v-model="email"
              type="email"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 320px"
            />
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              :loading="loading"
              :disabled="!email.trim() || email === auth.user?.email"
              @click="saveEmail"
            >
              Speichern
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Password -->
      <v-card variant="outlined">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-3">
            <p class="text-body-2 font-weight-bold">Passwort</p>
            <v-btn
              v-if="!showPasswordForm"
              variant="text"
              size="small"
              @click="showPasswordForm = true"
            >
              Ändern
            </v-btn>
          </div>

          <template v-if="showPasswordForm">
            <v-text-field
              v-model="oldPassword"
              label="Aktuelles Passwort"
              type="password"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-3"
              style="max-width: 320px"
            />
            <v-text-field
              v-model="newPassword"
              label="Neues Passwort"
              type="password"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-3"
              style="max-width: 320px"
            />
            <v-text-field
              v-model="newPasswordConfirm"
              label="Passwort bestätigen"
              type="password"
              density="compact"
              variant="outlined"
              hide-details
              class="mb-4"
              style="max-width: 320px"
            />
            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                variant="flat"
                size="small"
                :loading="passwordLoading"
                @click="changePassword"
              >
                Passwort ändern
              </v-btn>
              <v-btn variant="text" size="small" @click="showPasswordForm = false">
                Abbrechen
              </v-btn>
            </div>
          </template>

          <p v-else class="text-body-2 text-medium-emphasis">
            ••••••••
          </p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.pv-row {
  display: flex;
  align-items: center;
  gap: var(--aw-space-sm);
}

.gap-2 {
  gap: var(--aw-space-sm);
}
</style>
