// Auto-Discovery Module System
// Scannt src/modules/{name}/index.js und sammelt Routes, Nav-Items und Permissions.
// Neue Module werden automatisch erkannt — keine manuelle Registrierung nötig.

/* eslint-disable-next-line */
const moduleFiles = import.meta.glob('../modules/*/index.js', { eager: true })

export const modules = Object.values(moduleFiles).map(m => m.default).filter(Boolean)

/** Alle Modul-Routen (als children der AppShell-Route) */
export function getModuleRoutes() {
  return modules.map(m => m.route).filter(Boolean)
}

/** Öffentliche Routen (Top-Level, ohne Auth) */
export function getPublicRoutes() {
  return modules.flatMap(m => m.publicRoutes || [])
}

/** Nav-Items für die Sidebar */
export function getNavItems() {
  return modules.map(m => m.nav).filter(Boolean)
}

/** Permissions aus allen Modulen zusammenführen */
export function getModulePermissions() {
  const perms = {}
  modules.forEach(m => {
    if (m.permissions) Object.assign(perms, m.permissions)
  })
  return perms
}
