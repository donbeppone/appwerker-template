import { defineStore } from 'pinia'
import { ref } from 'vue'
import { account } from '@/lib/appwrite.js'
import { ID } from 'appwrite'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  async function fetchUser() {
    try {
      user.value = await account.get()
    } catch {
      user.value = null
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

  async function logout() {
    await account.deleteSession('current')
    user.value = null
  }

  return { user, fetchUser, login, register, logout }
})
