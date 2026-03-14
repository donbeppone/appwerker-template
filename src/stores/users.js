import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, functions, DB_ID } from '@/lib/appwrite.js'
import { ID, Query } from 'appwrite'

const COL_ID = 'users'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      const res = await databases.listDocuments(DB_ID, COL_ID, [
        Query.limit(500),
        Query.orderAsc('nachname'),
      ])
      users.value = res.documents
    } finally {
      loading.value = false
    }
  }

  async function createUser(data) {
    const doc = await databases.createDocument(DB_ID, COL_ID, ID.unique(), data)
    users.value.push(doc)
    users.value.sort((a, b) => (a.nachname || '').localeCompare(b.nachname || ''))
    return doc
  }

  async function updateUser(id, data) {
    const doc = await databases.updateDocument(DB_ID, COL_ID, id, data)
    const idx = users.value.findIndex((u) => u.$id === id)
    if (idx !== -1) users.value[idx] = doc
    return doc
  }

  async function deleteUser(id) {
    await databases.deleteDocument(DB_ID, COL_ID, id)
    users.value = users.value.filter((u) => u.$id !== id)
  }

  /**
   * Benutzer einladen: Appwrite Account erstellen + users-Document anlegen.
   * Nutzt eine Cloud Function für server-seitige User-Erstellung.
   */
  async function inviteUser({ vorname, nachname, email, rolle }) {
    const fullName = [vorname, nachname].filter(Boolean).join(' ')
    let userId = null
    try {
      const execution = await functions.createExecution(
        'create-user',
        JSON.stringify({ name: fullName, email }),
        false,
      )
      const result = JSON.parse(execution.responseBody || '{}')
      userId = result.userId || null
    } catch (e) {
      console.warn('Cloud Function create-user fehlgeschlagen, erstelle nur Document:', e)
    }

    const doc = await databases.createDocument(DB_ID, COL_ID, ID.unique(), {
      userId: userId || '',
      vorname: vorname || '',
      nachname: nachname || '',
      email,
      rolle: rolle || '',
    })
    users.value.push(doc)
    users.value.sort((a, b) => (a.nachname || '').localeCompare(b.nachname || ''))
    return doc
  }

  return { users, loading, fetchUsers, createUser, updateUser, deleteUser, inviteUser }
})
