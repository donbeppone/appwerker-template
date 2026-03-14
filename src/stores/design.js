import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DB_ID } from '@/lib/appwrite.js'
import { defaultTokens, injectTokens, loadCachedTokens } from '@/lib/designTokens.js'

const CONFIG_COLLECTION = 'app_config'
const CONFIG_DOC_ID = 'design'

export const useDesignStore = defineStore('design', () => {
  const tokens = ref({ ...defaultTokens })
  const loading = ref(false)
  const loaded = ref(false)

  /**
   * Design-Tokens aus Appwrite laden und injizieren
   */
  async function fetchTokens() {
    // 1. Schneller Start mit Cache
    const cached = loadCachedTokens()
    if (cached) {
      tokens.value = { ...defaultTokens, ...cached }
      injectTokens(tokens.value)
    }

    // 2. Aus Appwrite laden
    loading.value = true
    try {
      const doc = await databases.getDocument(DB_ID, CONFIG_COLLECTION, CONFIG_DOC_ID)
      const data = doc.data ? JSON.parse(doc.data) : {}
      tokens.value = { ...defaultTokens, ...data }
      injectTokens(tokens.value)
      loaded.value = true
    } catch (e) {
      // Collection/Doc existiert nicht → Defaults verwenden
      if (!cached) {
        tokens.value = { ...defaultTokens }
        injectTokens(tokens.value)
      }
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  /**
   * Design-Tokens in Appwrite speichern
   */
  async function saveTokens() {
    try {
      await databases.updateDocument(DB_ID, CONFIG_COLLECTION, CONFIG_DOC_ID, {
        data: JSON.stringify(tokens.value),
      })
      injectTokens(tokens.value)
    } catch (e) {
      // Doc existiert nicht → erstellen
      const { ID } = await import('appwrite')
      await databases.createDocument(DB_ID, CONFIG_COLLECTION, CONFIG_DOC_ID, {
        data: JSON.stringify(tokens.value),
      })
      injectTokens(tokens.value)
    }
  }

  return { tokens, loading, loaded, fetchTokens, saveTokens }
})
