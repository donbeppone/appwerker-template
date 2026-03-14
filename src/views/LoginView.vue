<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const appName = import.meta.env.VITE_APP_NAME || 'App'

// ── Token Auto-Login (QR-Code / shared link) ──
const tokenLoading = ref(false)
const tokenError = ref('')

onMounted(async () => {
  const urlToken = route.query.token
  const urlUser = route.query.user
  if (urlToken && urlUser) {
    tokenLoading.value = true
    try {
      await auth.verifyOTP(urlUser, urlToken)
      router.replace('/dashboard')
      return
    } catch {
      tokenError.value = 'Dieser Login-Link ist abgelaufen oder ungültig.'
      tokenLoading.value = false
      router.replace('/login')
    }
    return
  }

  try {
    if (!auth.user) await auth.fetchUser()
    if (auth.user) router.replace('/dashboard')
  } catch {}
})

// ── State ──
const step = ref('email')        // 'email' | 'code' | 'admin'
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const otpUserId = ref('')

// OTP code digits
const code = ref(['', '', '', '', '', ''])
const codeRefs = ref([])

// ── OTP Flow ──
async function requestCode() {
  if (!email.value.trim()) return
  error.value = ''
  loading.value = true
  try {
    const userId = await auth.loginWithOTP(email.value.trim())
    otpUserId.value = userId
    step.value = 'code'
    await nextTick()
    codeRefs.value[0]?.focus()
  } catch (e) {
    error.value = e.message || 'Code konnte nicht gesendet werden.'
  } finally {
    loading.value = false
  }
}

async function verifyCode() {
  const secret = code.value.join('')
  if (secret.length !== 6) return
  error.value = ''
  loading.value = true
  try {
    await auth.verifyOTP(otpUserId.value, secret)
    router.push('/dashboard')
  } catch {
    error.value = 'Code ungültig oder abgelaufen.'
    code.value = ['', '', '', '', '', '']
    await nextTick()
    codeRefs.value[0]?.focus()
  } finally {
    loading.value = false
  }
}

function onCodeInput(index, event) {
  const val = event.target.value
  code.value[index] = val.replace(/\D/g, '').slice(-1)

  if (code.value[index] && index < 5) {
    codeRefs.value[index + 1]?.focus()
  }

  if (code.value.every(d => d !== '')) {
    verifyCode()
  }
}

function onCodeKeydown(index, event) {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    codeRefs.value[index - 1]?.focus()
  }
}

function onCodePaste(event) {
  event.preventDefault()
  const paste = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (!paste) return
  for (let i = 0; i < 6; i++) {
    code.value[i] = paste[i] || ''
  }
  const nextEmpty = code.value.findIndex(d => !d)
  codeRefs.value[nextEmpty === -1 ? 5 : nextEmpty]?.focus()

  if (code.value.every(d => d !== '')) {
    verifyCode()
  }
}

function backToEmail() {
  step.value = 'email'
  code.value = ['', '', '', '', '', '']
  error.value = ''
}

// ── Admin Login ──
async function adminLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message || 'Anmeldung fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}

function switchToAdmin() {
  step.value = 'admin'
  error.value = ''
}

function switchToOtp() {
  step.value = 'email'
  error.value = ''
  password.value = ''
}
</script>

<template>
  <div class="lv-page">
    <div class="lv-wrapper">
      <!-- Brand -->
      <div class="lv-brand">
        <div class="lv-logo-mark" />
        <h1 class="lv-app-name">{{ appName }}</h1>
      </div>

      <!-- Token Auto-Login -->
      <div v-if="tokenLoading" class="lv-card">
        <div class="lv-token-state">
          <v-progress-circular indeterminate color="primary" size="32" />
          <p class="lv-token-text">Anmeldung läuft…</p>
        </div>
      </div>

      <div v-else class="lv-card">
        <!-- Token error -->
        <div v-if="tokenError" class="lv-error-banner">
          <v-icon icon="mdi-alert-circle-outline" size="16" />
          {{ tokenError }}
        </div>

        <Transition name="lv-slide" mode="out-in">
          <!-- ═══ Step 1: Email ═══ -->
          <div v-if="step === 'email'" key="email" class="lv-step">
            <div class="lv-step-header">
              <h2 class="lv-step-title">Anmelden</h2>
              <p class="lv-step-desc">E-Mail eingeben — wir senden dir einen Code.</p>
            </div>

            <form @submit.prevent="requestCode" class="lv-form">
              <label class="lv-field">
                <span class="lv-field-label">E-Mail-Adresse</span>
                <div class="lv-field-box">
                  <input
                    v-model="email"
                    type="email"
                    placeholder="name@beispiel.de"
                    required
                    autocomplete="email"
                    class="lv-field-input"
                  />
                </div>
              </label>

              <div v-if="error" class="lv-inline-error">
                <v-icon icon="mdi-close-circle" size="14" />
                {{ error }}
              </div>

              <button type="submit" class="lv-btn-primary" :disabled="loading || !email.trim()">
                <template v-if="!loading">
                  Code anfordern
                  <v-icon icon="mdi-arrow-right" size="18" />
                </template>
                <v-progress-circular v-else indeterminate size="18" width="2" />
              </button>
            </form>

            <div class="lv-footer">
              <button class="lv-link-btn" @click="switchToAdmin">
                <v-icon icon="mdi-shield-key-outline" size="13" />
                Admin-Login mit Passwort
              </button>
            </div>
          </div>

          <!-- ═══ Step 2: OTP Code ═══ -->
          <div v-else-if="step === 'code'" key="code" class="lv-step">
            <button class="lv-nav-back" @click="backToEmail" aria-label="Zurück">
              <v-icon icon="mdi-chevron-left" size="20" />
            </button>

            <div class="lv-step-header lv-step-header--centered">
              <div class="lv-badge">
                <v-icon icon="mdi-email-check-outline" size="22" />
              </div>
              <h2 class="lv-step-title">Code eingeben</h2>
              <p class="lv-step-desc">
                6-stelliger Code an<br />
                <strong>{{ email }}</strong> gesendet.
              </p>
            </div>

            <form @submit.prevent="verifyCode" class="lv-form">
              <div class="lv-otp-row" @paste="onCodePaste">
                <input
                  v-for="(_, i) in 6"
                  :key="i"
                  :ref="el => { if (el) codeRefs[i] = el }"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="1"
                  :value="code[i]"
                  @input="onCodeInput(i, $event)"
                  @keydown="onCodeKeydown(i, $event)"
                  class="lv-otp-cell"
                  :class="{ 'lv-otp-cell--filled': code[i] }"
                  autocomplete="one-time-code"
                />
                <span class="lv-otp-dash" />
              </div>

              <div v-if="error" class="lv-inline-error">
                <v-icon icon="mdi-close-circle" size="14" />
                {{ error }}
              </div>

              <button type="submit" class="lv-btn-primary" :disabled="loading || code.some(d => !d)">
                <template v-if="!loading">
                  Anmelden
                  <v-icon icon="mdi-check" size="18" />
                </template>
                <v-progress-circular v-else indeterminate size="18" width="2" />
              </button>
            </form>

            <div class="lv-footer">
              <button class="lv-link-btn" @click="requestCode" :disabled="loading">
                Code erneut senden
              </button>
            </div>
          </div>

          <!-- ═══ Admin Login ═══ -->
          <div v-else-if="step === 'admin'" key="admin" class="lv-step">
            <button class="lv-nav-back" @click="switchToOtp" aria-label="Zurück">
              <v-icon icon="mdi-chevron-left" size="20" />
            </button>

            <div class="lv-step-header">
              <div class="lv-badge lv-badge--subtle">
                <v-icon icon="mdi-shield-key-outline" size="22" />
              </div>
              <h2 class="lv-step-title">Admin-Login</h2>
              <p class="lv-step-desc">Anmeldung mit E-Mail und Passwort.</p>
            </div>

            <form @submit.prevent="adminLogin" class="lv-form">
              <label class="lv-field">
                <span class="lv-field-label">E-Mail</span>
                <div class="lv-field-box">
                  <input
                    v-model="email"
                    type="email"
                    placeholder="admin@beispiel.de"
                    required
                    autocomplete="email"
                    class="lv-field-input"
                  />
                </div>
              </label>

              <label class="lv-field">
                <span class="lv-field-label">Passwort</span>
                <div class="lv-field-box">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    class="lv-field-input"
                  />
                  <button type="button" class="lv-field-eye" @click="showPassword = !showPassword" tabindex="-1">
                    <v-icon :icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" size="16" />
                  </button>
                </div>
              </label>

              <div v-if="error" class="lv-inline-error">
                <v-icon icon="mdi-close-circle" size="14" />
                {{ error }}
              </div>

              <button type="submit" class="lv-btn-primary" :disabled="loading || !email.trim() || !password">
                <template v-if="!loading">Anmelden</template>
                <v-progress-circular v-else indeterminate size="18" width="2" />
              </button>
            </form>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ── */
.lv-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aw-background);
  padding: var(--aw-space-lg);
}

.lv-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aw-space-xl);
  width: 100%;
  max-width: 380px;
}

/* ── Brand ── */
.lv-brand {
  display: flex;
  align-items: center;
  gap: var(--aw-space-sm);
}

.lv-logo-mark {
  width: 28px;
  height: 28px;
  background: var(--aw-text);
  border-radius: var(--aw-radius-sm);
}

.lv-app-name {
  font-size: var(--aw-typo-h5-size);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--aw-text);
}

/* ── Card ── */
.lv-card {
  width: 100%;
  background: var(--aw-surface);
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-lg);
  box-shadow: var(--aw-shadow-sm);
  overflow: hidden;
}

/* ── Steps ── */
.lv-step {
  padding: var(--aw-space-xl);
  position: relative;
}

.lv-step-header {
  margin-bottom: var(--aw-space-lg);
}

.lv-step-header--centered {
  text-align: center;
}

.lv-step-title {
  font-size: var(--aw-typo-h5-size);
  font-weight: 700;
  color: var(--aw-text);
  margin-bottom: var(--aw-space-xs);
}

.lv-step-desc {
  font-size: var(--aw-typo-body-size);
  color: var(--aw-text-secondary);
  line-height: 1.5;
}

/* ── Badge ── */
.lv-badge {
  width: 44px;
  height: 44px;
  border-radius: var(--aw-radius-md);
  background: var(--aw-primary);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--aw-space-sm);
}

.lv-badge--subtle {
  background: var(--aw-surface-variant);
  color: var(--aw-text-secondary);
}

/* ── Form ── */
.lv-form {
  display: flex;
  flex-direction: column;
  gap: var(--aw-space-md);
}

.lv-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lv-field-label {
  font-size: var(--aw-typo-small-size);
  font-weight: 600;
  color: var(--aw-text-secondary);
}

.lv-field-box {
  display: flex;
  align-items: center;
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  background: var(--aw-background);
  transition: border-color 0.15s;
}

.lv-field-box:focus-within {
  border-color: var(--aw-primary);
}

.lv-field-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 12px;
  font-size: var(--aw-typo-body-size);
  color: var(--aw-text);
  outline: none;
  font-family: inherit;
}

.lv-field-input::placeholder {
  color: var(--aw-text-secondary);
  opacity: 0.5;
}

.lv-field-eye {
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--aw-text-secondary);
  display: flex;
  align-items: center;
}

/* ── Primary Button ── */
.lv-btn-primary {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: var(--aw-radius-sm);
  background: var(--aw-primary);
  color: white;
  font-size: var(--aw-typo-body-size);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--aw-space-xs);
  transition: opacity 0.15s;
  font-family: inherit;
}

.lv-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.lv-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── OTP Code Row ── */
.lv-otp-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  position: relative;
}

.lv-otp-cell {
  width: 44px;
  height: 52px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  font-family: inherit;
  border: 1px solid var(--aw-border);
  border-radius: var(--aw-radius-sm);
  background: var(--aw-background);
  color: var(--aw-text);
  outline: none;
  transition: border-color 0.15s;
}

.lv-otp-cell:focus {
  border-color: var(--aw-primary);
}

.lv-otp-cell--filled {
  border-color: var(--aw-primary);
  background: var(--aw-surface);
}

/* Dash between 3rd and 4th cell */
.lv-otp-dash {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 2px;
  background: var(--aw-border);
  pointer-events: none;
}

/* ── Error ── */
.lv-inline-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--aw-typo-small-size);
  color: var(--aw-error, #d32f2f);
}

.lv-error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px var(--aw-space-lg);
  font-size: var(--aw-typo-small-size);
  background: color-mix(in srgb, var(--aw-error, #d32f2f) 8%, transparent);
  color: var(--aw-error, #d32f2f);
  border-bottom: 1px solid var(--aw-border);
}

/* ── Footer / Links ── */
.lv-footer {
  margin-top: var(--aw-space-lg);
  padding-top: var(--aw-space-md);
  border-top: 1px solid var(--aw-border);
  display: flex;
  justify-content: center;
}

.lv-link-btn {
  background: none;
  border: none;
  font-size: var(--aw-typo-small-size);
  color: var(--aw-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--aw-radius-sm);
  transition: color 0.15s;
  font-family: inherit;
}

.lv-link-btn:hover {
  color: var(--aw-primary);
}

.lv-link-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Nav Back ── */
.lv-nav-back {
  position: absolute;
  top: var(--aw-space-md);
  left: var(--aw-space-md);
  background: none;
  border: none;
  color: var(--aw-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--aw-radius-sm);
  display: flex;
  align-items: center;
}

.lv-nav-back:hover {
  color: var(--aw-text);
}

/* ── Token State ── */
.lv-token-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aw-space-md);
  padding: var(--aw-space-2xl);
}

.lv-token-text {
  font-size: var(--aw-typo-body-size);
  color: var(--aw-text-secondary);
}

/* ── Transitions ── */
.lv-slide-enter-active,
.lv-slide-leave-active {
  transition: all 0.2s ease;
}

.lv-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.lv-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
