import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DB_ID } from '@/lib/appwrite.js'
import { coreTokenDefaults, injectTokens, loadCachedTokens } from '@/lib/designTokens.js'

const CONFIG_COLLECTION = 'app_config'
const CONFIG_DOC_ID = 'design'

export const useDesignStore = defineStore('design', () => {
  const tokens = ref({ ...coreTokenDefaults })
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchTokens() {
    // 1. Schneller Start mit Cache
    const cached = loadCachedTokens()
    if (cached) {
      tokens.value = { ...coreTokenDefaults, ...cached }
      injectTokens(tokens.value)
    }

    // 2. Aus Appwrite laden
    loading.value = true
    try {
      const doc = await databases.getDocument(DB_ID, CONFIG_COLLECTION, CONFIG_DOC_ID)
      const data = doc.data ? JSON.parse(doc.data) : {}
      tokens.value = { ...coreTokenDefaults, ...data }
      injectTokens(tokens.value)
      loaded.value = true
    } catch {
      if (!cached) {
        tokens.value = { ...coreTokenDefaults }
        injectTokens(tokens.value)
      }
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function saveTokens() {
    injectTokens(tokens.value)
    try {
      await databases.updateDocument(DB_ID, CONFIG_COLLECTION, CONFIG_DOC_ID, {
        data: JSON.stringify(tokens.value),
      })
    } catch {
      try {
        await databases.createDocument(DB_ID, CONFIG_COLLECTION, CONFIG_DOC_ID, {
          data: JSON.stringify(tokens.value),
        })
      } catch (e) {
        // Collection existiert nicht → nur localStorage-Cache verwenden
        console.warn('[design] app_config Collection fehlt, Tokens nur lokal gespeichert:', e.message)
      }
    }
  }

  /** Tokens live aktualisieren (ohne Speichern) */
  function applyTokens() {
    injectTokens(tokens.value)
  }

  return { tokens, loading, loaded, fetchTokens, saveTokens, applyTokens }
})
