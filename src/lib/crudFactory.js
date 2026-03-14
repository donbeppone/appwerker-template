import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DB_ID } from '@/lib/appwrite.js'
import { ID, Query } from 'appwrite'

/**
 * Generischer CRUD Store Factory.
 *
 * Erstellt einen Pinia Store mit Standard-CRUD-Operationen für eine Appwrite Collection.
 *
 * @param {string} storeName     — Eindeutiger Store-Name (z.B. 'customers')
 * @param {string} collectionId  — Appwrite Collection ID
 * @param {Object} options       — Optionen
 * @param {Object} options.defaultSort  — { field: string, direction: 'asc'|'desc' }
 * @param {number} options.limit        — Max. Dokumente (default: 500)
 *
 * @returns {Function} Pinia defineStore
 *
 * @example
 * // src/stores/customers.js
 * import { createCrudStore } from '@/lib/crudFactory.js'
 * export const useCustomersStore = createCrudStore('customers', 'customers', {
 *   defaultSort: { field: 'name', direction: 'asc' },
 * })
 *
 * // In einer Vue-Komponente:
 * const store = useCustomersStore()
 * await store.fetchAll()
 * await store.create({ name: 'Neuer Kunde', email: 'test@example.com' })
 * await store.update(id, { name: 'Geänderter Name' })
 * await store.remove(id)
 */
export function createCrudStore(storeName, collectionId, options = {}) {
  const { defaultSort, limit = 500 } = options

  return defineStore(storeName, () => {
    const items = ref([])
    const loading = ref(false)

    /**
     * Alle Dokumente laden
     */
    async function fetchAll(extraQueries = []) {
      loading.value = true
      try {
        const queries = [Query.limit(limit), ...extraQueries]
        if (defaultSort) {
          const sortFn = defaultSort.direction === 'desc' ? Query.orderDesc : Query.orderAsc
          queries.push(sortFn(defaultSort.field))
        }
        const res = await databases.listDocuments(DB_ID, collectionId, queries)
        items.value = res.documents
      } finally {
        loading.value = false
      }
    }

    /**
     * Einzelnes Dokument laden
     */
    async function fetchOne(id) {
      return await databases.getDocument(DB_ID, collectionId, id)
    }

    /**
     * Neues Dokument erstellen
     */
    async function create(data) {
      const doc = await databases.createDocument(DB_ID, collectionId, ID.unique(), data)
      items.value.push(doc)
      if (defaultSort) {
        const dir = defaultSort.direction === 'desc' ? -1 : 1
        items.value.sort((a, b) => {
          const aVal = a[defaultSort.field] ?? ''
          const bVal = b[defaultSort.field] ?? ''
          return typeof aVal === 'string'
            ? dir * aVal.localeCompare(bVal)
            : dir * (aVal - bVal)
        })
      }
      return doc
    }

    /**
     * Dokument aktualisieren
     */
    async function update(id, data) {
      const doc = await databases.updateDocument(DB_ID, collectionId, id, data)
      const idx = items.value.findIndex((d) => d.$id === id)
      if (idx !== -1) items.value[idx] = doc
      return doc
    }

    /**
     * Dokument löschen
     */
    async function remove(id) {
      await databases.deleteDocument(DB_ID, collectionId, id)
      items.value = items.value.filter((d) => d.$id !== id)
    }

    return { items, loading, fetchAll, fetchOne, create, update, remove }
  })
}
