import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { databases, DB_ID } from '@/lib/appwrite.js'
import { Query } from 'appwrite'

const COLLECTION_ID = 'termine'

export const useTermineStore = defineStore('termine', () => {
  const termine = ref([])
  const loading = ref(false)

  const kategorien = ['Arbeit', 'Privat', 'Gesundheit', 'Sport', 'Familie', 'Sonstiges']
  const prioritaeten = ['Niedrig', 'Normal', 'Hoch', 'Dringend']

  const termineNachDatum = computed(() => {
    const grouped = {}
    termine.value.forEach(t => {
      const datum = new Date(t.datum).toDateString()
      if (!grouped[datum]) grouped[datum] = []
      grouped[datum].push(t)
    })
    return grouped
  })

  async function fetchAll() {
    loading.value = true
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
        Query.orderAsc('datum'),
        Query.limit(500),
      ])
      termine.value = res.documents
    } catch (e) {
      console.error('Termine laden fehlgeschlagen:', e)
      termine.value = []
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const res = await databases.createDocument(DB_ID, COLLECTION_ID, 'unique()', data)
    termine.value.push(res)
    return res
  }

  async function update(id, data) {
    const res = await databases.updateDocument(DB_ID, COLLECTION_ID, id, data)
    const idx = termine.value.findIndex(t => t.$id === id)
    if (idx !== -1) termine.value[idx] = res
    return res
  }

  async function remove(id) {
    await databases.deleteDocument(DB_ID, COLLECTION_ID, id)
    termine.value = termine.value.filter(t => t.$id !== id)
  }

  return {
    termine, loading, kategorien, prioritaeten, termineNachDatum,
    fetchAll, create, update, remove,
  }
})
