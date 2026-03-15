// Auto-Discovery Module System
// Scannt src/modules/{name}/index.js und sammelt Routes, Nav-Items und Permissions.
// Neue Module werden automatisch erkannt — keine manuelle Registrierung nötig.

/* eslint-disable-next-line */
const moduleFiles = import.meta.glob('../modules/*/index.js', { eager: true })

export const modules = Object.values(moduleFiles).map(m => m.default).filter(Boolean)

/** Alle Modul-Routen (als flache children der AppShell-Route) */
export function getModuleRoutes() {
  const routes = []
  for (const m of modules) {
    if (!m.route) continue
    const { children, ...parentRoute } = m.route
    routes.push(parentRoute)
    // Child-Routes als flache Geschwister-Routen (kein <router-view> im Parent nötig)
    if (children) {
      for (const child of children) {
        routes.push({
          ...child,
          path: `${parentRoute.path}/${child.path}`,
        })
      }
    }
    // Zusätzliche Routen (Alternative zu children)
    if (m.additionalRoutes) {
      routes.push(...m.additionalRoutes)
    }
  }
  return routes
}

/** Öffentliche Routen (Top-Level, ohne Auth) */
export function getPublicRoutes() {
  return modules.flatMap(m => m.publicRoutes || [])
}

/** Nav-Items für die Sidebar (unterstützt verschachtelte children) */
export function getNavItems() {
  const items = []
  for (const m of modules) {
    if (!m.nav) continue
    if (m.nav.children) {
      // Modul mit Sub-Navigation: als Gruppe mit Children
      items.push(m.nav)
    } else {
      items.push(m.nav)
    }
  }
  return items
}

/** Permissions aus allen Modulen zusammenführen */
export function getModulePermissions() {
  const perms = {}
  modules.forEach(m => {
    if (m.permissions) Object.assign(perms, m.permissions)
  })
  return perms
}
