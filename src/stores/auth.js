import { defineStore } from 'pinia'
import { ref } from 'vue'
import { account, databases, DB_ID } from '@/lib/appwrite.js'
import { ID, Query } from 'appwrite'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userPermissions = ref(null)  // null = full access, string[] = specific permissions
  const userDocument = ref(null)     // matched document from 'users' collection

  async function loadUserPermissions() {
    if (!user.value?.email) {
      userPermissions.value = null
      userDocument.value = null
      return
    }
    try {
      const res = await databases.listDocuments(DB_ID, 'users', [
        Query.equal('email', user.value.email),
        Query.limit(1),
      ])
      if (res.documents.length > 0) {
        userDocument.value = res.documents[0]
        const doc = res.documents[0]

        // Rolle-basierte Berechtigungen
        if (doc.rolle) {
          try {
            const rolle = await databases.getDocument(DB_ID, 'rollen', doc.rolle)
            if (rolle.istAdmin) {
              userPermissions.value = null // Vollzugriff
              return
            }
            const perms = rolle.berechtigungen
            userPermissions.value = (Array.isArray(perms) && perms.length > 0) ? perms : null
            return
          } catch {
            // Rolle nicht gefunden → Vollzugriff
          }
        }

        // Kein Rolle → Vollzugriff (Standard für neue User)
        userPermissions.value = null
      } else {
        // Kein Eintrag in users Collection → Admin/System-User → Vollzugriff
        userPermissions.value = null
        userDocument.value = null
      }
    } catch {
      // Fehler → Vollzugriff, um Aussperrung zu verhindern
      userPermissions.value = null
      userDocument.value = null
    }
  }

  async function fetchUser() {
    try {
      user.value = await account.get()
      await loadUserPermissions()
    } catch {
      user.value = null
      userPermissions.value = null
      userDocument.value = null
    }
  }

  async function login(email, password) {
    await account.createEmailPasswordSession(email, password)
    await fetchUser()
  }

  async function register(email, password, name) {
    await account.create(ID.unique(), email, password, name)
    await login(email, password)
  }

  // ── OTP (Passwordless) Login ──
  async function loginWithOTP(email) {
    const token = await account.createEmailToken(ID.unique(), email)
    return token.userId
  }

  async function verifyOTP(userId, secret) {
    await account.createSession(userId, secret)
    await fetchUser()
  }

  // ── Token-Login (von Appwerker Admin oder QR-Code) ──
  async function loginWithToken(userId, secret) {
    await account.createSession(userId, secret)
    await fetchUser()
  }

  async function logout() {
    await account.deleteSession('current')
    user.value = null
    userPermissions.value = null
    userDocument.value = null
  }

  return {
    user, userPermissions, userDocument,
    fetchUser, loadUserPermissions,
    login, register, loginWithOTP, verifyOTP, loginWithToken, logout,
  }
})
