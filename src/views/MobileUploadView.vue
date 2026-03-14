<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Client, Storage, ID } from 'appwrite'

const route = useRoute()

const ready = ref(false)
const error = ref('')
const uploads = ref([])
const fileInputRef = ref(null)
const cameraInputRef = ref(null)

const appName = import.meta.env.VITE_APP_NAME || 'App'
const acceptType = computed(() => route.query.accept || '*/*')
const showCamera = computed(() => {
  const a = acceptType.value
  return a === '*/*' || a.startsWith('image')
})

let mobileStorage = null

onMounted(() => {
  const jwt = route.query.jwt
  const bucket = route.query.bucket
  if (!jwt || !bucket) {
    error.value = 'Ungültiger Link — Parameter fehlen.'
    return
  }

  try {
    const client = new Client()
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
      .setJWT(jwt)

    mobileStorage = new Storage(client)
    ready.value = true
  } catch {
    error.value = 'Verbindung fehlgeschlagen.'
  }
})

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function triggerCamera() {
  cameraInputRef.value?.click()
}

async function onFilesSelected(e) {
  const files = Array.from(e.target.files)
  e.target.value = ''
  for (const file of files) {
    await uploadFile(file)
  }
}

async function uploadFile(file) {
  const bucket = route.query.bucket
  const entryId = ID.unique()

  uploads.value.unshift({ id: entryId, name: file.name, done: false, error: null })

  try {
    await mobileStorage.createFile(bucket, ID.unique(), file)
    setEntry(entryId, { done: true })
  } catch (e) {
    const msg = e?.message || 'Upload fehlgeschlagen'
    if (msg.includes('JWT') || msg.includes('unauthorized') || msg.includes('401')) {
      error.value = 'Link abgelaufen — bitte neuen QR-Code scannen.'
    }
    setEntry(entryId, { error: msg })
  }
}

function setEntry(id, patch) {
  const idx = uploads.value.findIndex((u) => u.id === id)
  if (idx !== -1) Object.assign(uploads.value[idx], patch)
}

function countDone() {
  return uploads.value.filter((u) => u.done).length
}
</script>

<template>
  <div class="mu-page">
    <div class="mu-card">
      <div class="mu-header">
        <div class="mu-logo" />
        <div class="mu-title">{{ appName }} — Upload</div>
      </div>

      <div v-if="error" class="mu-error">
        <v-icon icon="mdi-alert-circle-outline" size="32" />
        <p class="mu-error-text">{{ error }}</p>
      </div>

      <template v-else-if="ready">
        <p class="mu-hint">Wähle Dateien oder Fotos von deinem Smartphone aus.</p>

        <div class="mu-buttons">
          <button class="mu-upload-btn" @click="triggerFileSelect">
            <v-icon icon="mdi-upload" size="22" />
            <span>Dateien auswählen</span>
          </button>

          <button v-if="showCamera" class="mu-upload-btn mu-upload-btn--camera" @click="triggerCamera">
            <v-icon icon="mdi-camera" size="22" />
            <span>Foto aufnehmen</span>
          </button>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          multiple
          :accept="acceptType"
          class="mu-sr-only"
          @change="onFilesSelected"
        />
        <input
          ref="cameraInputRef"
          type="file"
          accept="image/*"
          capture="environment"
          class="mu-sr-only"
          @change="onFilesSelected"
        />

        <div v-if="uploads.length" class="mu-uploads">
          <div class="mu-uploads-label">
            Uploads ({{ countDone() }}/{{ uploads.length }})
          </div>
          <div v-for="u in uploads" :key="u.id" class="mu-upload-item">
            <div class="mu-upload-icon">
              <v-icon v-if="u.done" icon="mdi-check-circle" size="18" color="success" />
              <v-icon v-else-if="u.error" icon="mdi-close-circle" size="18" color="error" />
              <v-progress-circular v-else indeterminate size="18" width="2" />
            </div>
            <div class="mu-upload-info">
              <span class="mu-upload-name">{{ u.name }}</span>
              <span v-if="u.error" class="mu-upload-error">{{ u.error }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="mu-loading">
        <v-progress-circular indeterminate size="28" width="3" />
        <p>Verbindung wird hergestellt…</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mu-page {
  min-height: 100dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--aw-space-lg) var(--aw-space-md);
  background: var(--aw-background);
}

.mu-card {
  width: 100%;
  max-width: 400px;
  background: var(--aw-surface);
  border-radius: var(--aw-radius-lg);
  padding: var(--aw-space-xl) var(--aw-space-lg);
  box-shadow: var(--aw-shadow-sm);
  border: 1px solid var(--aw-border);
}

.mu-header {
  display: flex;
  align-items: center;
  gap: var(--aw-space-sm);
  margin-bottom: var(--aw-space-lg);
}

.mu-logo {
  width: 36px;
  height: 36px;
  border-radius: var(--aw-radius-sm);
  background: var(--aw-primary);
  flex-shrink: 0;
}

.mu-title {
  font-size: var(--aw-typo-h6-size, 16px);
  font-weight: 700;
  color: var(--aw-text);
}

.mu-hint {
  font-size: var(--aw-typo-body-size);
  color: var(--aw-text-secondary);
  margin: 0 0 var(--aw-space-md);
  line-height: 1.5;
}

.mu-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--aw-space-sm);
}

.mu-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--aw-space-sm);
  width: 100%;
  padding: 14px 20px;
  border: 2px dashed var(--aw-border);
  border-radius: var(--aw-radius-md);
  background: var(--aw-background);
  color: var(--aw-text);
  font-size: var(--aw-typo-body-size);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.mu-upload-btn:active {
  border-color: var(--aw-primary);
  background: color-mix(in srgb, var(--aw-primary) 6%, transparent);
  transform: scale(0.98);
}

.mu-upload-btn--camera {
  border-style: solid;
}

.mu-uploads {
  margin-top: var(--aw-space-lg);
}

.mu-uploads-label {
  font-size: var(--aw-typo-small-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--aw-text-secondary);
  margin-bottom: var(--aw-space-xs);
}

.mu-upload-item {
  display: flex;
  align-items: center;
  gap: var(--aw-space-sm);
  padding: var(--aw-space-xs) 0;
  border-bottom: 1px solid var(--aw-border);
}

.mu-upload-item:last-child {
  border-bottom: none;
}

.mu-upload-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mu-upload-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mu-upload-name {
  font-size: var(--aw-typo-small-size);
  color: var(--aw-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mu-upload-error {
  font-size: 11px;
  color: var(--aw-error, #d32f2f);
  line-height: 1.3;
  word-break: break-word;
}

.mu-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aw-space-sm);
  padding: var(--aw-space-2xl) var(--aw-space-md);
  text-align: center;
  color: var(--aw-error, #d32f2f);
}

.mu-error-text {
  font-size: var(--aw-typo-body-size);
  color: var(--aw-text-secondary);
  margin: 0;
}

.mu-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aw-space-sm);
  padding: var(--aw-space-2xl);
  color: var(--aw-text-secondary);
  font-size: var(--aw-typo-small-size);
}

.mu-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
</style>
