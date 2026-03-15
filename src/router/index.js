import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { checkAccess } from '@/composables/usePermissions.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/upload',
      component: () => import('@/views/MobileUploadView.vue'),
      meta: { public: true },
    },
    {
      // Gemeinsames Layout — AppShell wird nur einmal gemountet (kein Flackern)
      path: '/',
      component: () => import('@/components/layout/AppShell.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'profil',
          component: () => import('@/views/ProfileView.vue'),
          meta: { title: 'Profil' },
        },
        {
          path: 'einstellungen/design',
          component: () => import('@/views/DesignView.vue'),
          meta: { title: 'Design' },
        },
        {
          path: 'einstellungen/benutzer',
          component: () => import('@/views/UsersView.vue'),
          meta: { title: 'Benutzer' },
        },
        // ═══ Neue Module hier einfügen ═══
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  // 1. Öffentliche Routen
  if (to.meta.public) return true

  const auth = useAuthStore()

  // 2. Auto-Login via Appwrite Token (von Appwerker gesetzt)
  if (!auth.user && to.query['aw-user'] && to.query['aw-secret']) {
    try {
      await auth.loginWithToken(to.query['aw-user'], to.query['aw-secret'])
      const { 'aw-user': _u, 'aw-secret': _s, ...cleanQuery } = to.query
      return { path: to.path, query: cleanQuery }
    } catch {
      // Token-Login fehlgeschlagen → normal zum Login
    }
  }

  // 3. Auth prüfen
  if (!auth.user) {
    try {
      await auth.fetchUser()
      if (!auth.user) return '/login'
    } catch {
      return '/login'
    }
  }

  // 4. Modul-Berechtigung prüfen
  const requiredModule = to.meta?.module
  if (requiredModule && !checkAccess(auth.userPermissions, requiredModule)) {
    return '/dashboard'
  }

  return true
})

// Aktuelle Route an Parent-Fenster (Appwerker Admin) melden
router.afterEach((to) => {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'aw-route', path: to.path, title: to.meta?.title || '' }, '*')
  }
})

export default router
