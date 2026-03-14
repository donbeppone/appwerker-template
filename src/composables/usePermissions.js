import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

// ── Module definitions ──────────────────────────────────────────────────────
// Claude füllt neue Module hier ein, wenn CRUD-Module erstellt werden.
export const MODULES = {
  dashboard: { label: 'Dashboard', actions: ['read'] },
  // Beispiel:
  // kunden: { label: 'Kunden', actions: ['read', 'write'] },
}

export const ACTION_LABELS = {
  read: 'Lesen',
  write: 'Schreiben',
}

// ── Standalone functions (usable in router guards, no reactive context) ─────

/**
 * Resolve raw permissions array into a Set.
 * Returns null if raw is null (= full access / admin).
 */
export function resolvePermissions(raw) {
  if (raw === null || raw === undefined) return null
  const resolved = new Set()
  for (const entry of raw) {
    if (entry.includes(':')) {
      resolved.add(entry)
    }
  }
  return resolved
}

/**
 * Check if a user has any permission for a given module.
 * raw = null means full access (admin/system user).
 */
export function checkAccess(raw, module) {
  if (raw === null || raw === undefined) return true
  const perms = resolvePermissions(raw)
  if (perms === null) return true
  for (const p of perms) {
    if (p.startsWith(module + ':')) return true
  }
  return false
}

/**
 * Check if a user has a specific permission.
 */
export function checkPermission(raw, module, action) {
  if (raw === null || raw === undefined) return true
  const perms = resolvePermissions(raw)
  if (perms === null) return true
  return perms.has(`${module}:${action}`)
}

// ── Composable (for use in components) ──────────────────────────────────────

export function usePermissions() {
  const auth = useAuthStore()

  const resolved = computed(() => resolvePermissions(auth.userPermissions))

  function canAccess(module) {
    if (resolved.value === null) return true
    for (const p of resolved.value) {
      if (p.startsWith(module + ':')) return true
    }
    return false
  }

  function hasPermission(module, action) {
    if (resolved.value === null) return true
    return resolved.value.has(`${module}:${action}`)
  }

  function canRead(module) {
    return hasPermission(module, 'read')
  }

  function canWrite(module) {
    return hasPermission(module, 'write')
  }

  return { resolved, canAccess, hasPermission, canRead, canWrite }
}
