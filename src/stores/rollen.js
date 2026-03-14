import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DB_ID } from '@/lib/appwrite.js'
import { ID, Query } from 'appwrite'

const COL_ID = 'rollen'

export const useRollenStore = defineStore('rollen', () => {
  const rollen = ref([])
  const loading = ref(false)

  async function fetchRollen() {
    loading.value = true
    try {
      const res = await databases.listDocuments(DB_ID, COL_ID, [
        Query.orderAsc('sortierung'),
        Query.limit(100),
      ])
      rollen.value = res.documents
    } finally {
      loading.value = false
    }
  }

  async function createRolle(data) {
    const doc = await databases.createDocument(DB_ID, COL_ID, ID.unique(), data)
    rollen.value.push(doc)
    rollen.value.sort((a, b) => (a.sortierung || 0) - (b.sortierung || 0))
    return doc
  }

  async function updateRolle(id, data) {
    const doc = await databases.updateDocument(DB_ID, COL_ID, id, data)
    const idx = rollen.value.findIndex((r) => r.$id === id)
    if (idx !== -1) rollen.value[idx] = doc
    return doc
  }

  async function deleteRolle(id) {
    await databases.deleteDocument(DB_ID, COL_ID, id)
    rollen.value = rollen.value.filter((r) => r.$id !== id)
  }

  function getRolleById(id) {
    return rollen.value.find((r) => r.$id === id) || null
  }

  return { rollen, loading, fetchRollen, createRolle, updateRolle, deleteRolle, getRolleById }
})
