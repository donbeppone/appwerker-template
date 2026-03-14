import { Client, Account, Databases, Storage } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://api.appwerker.de/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'demo')

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID || 'main'

/**
 * Konvertiert ein Appwrite-URL-Objekt in einen String.
 */
export function toUrl(url) {
  return url instanceof URL ? url.href : String(url)
}

export { client, account, databases, storage }
