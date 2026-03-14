import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: () => import('@/components/layout/AppShell.vue'),
      meta: { title: 'Dashboard' },
      children: [
        { path: '', component: () => import('@/views/DashboardView.vue') },
      ],
    },
    {
      path: '/einstellungen',
      component: () => import('@/components/layout/AppShell.vue'),
      meta: { title: 'Einstellungen' },
      children: [
        {
          path: 'design',
          component: () => import('@/views/DesignView.vue'),
          meta: { title: 'Design' },
        },
      ],
    },
    // ═══ Neue Module hier einfügen ═══
    // Beispiel:
    // {
    //   path: '/kunden',
    //   component: () => import('@/components/layout/AppShell.vue'),
    //   meta: { title: 'Kunden' },
    //   children: [
    //     { path: '', component: () => import('@/views/KundenView.vue') },
    //   ],
    // },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.public) return true

  const auth = useAuthStore()

  // Auto-Login via Appwrite Token (von Appwerker gesetzt)
  if (!auth.user && to.query['aw-user'] && to.query['aw-secret']) {
    try {
      await auth.loginWithToken(to.query['aw-user'], to.query['aw-secret'])
      // Parameter aus URL entfernen
      const { 'aw-user': _u, 'aw-secret': _s, ...cleanQuery } = to.query
      return { path: to.path, query: cleanQuery }
    } catch {
      // Token-Login fehlgeschlagen → normal zum Login
    }
  }

  if (!auth.user) {
    try {
      await auth.fetchUser()
      if (!auth.user) return '/login'
    } catch {
      return '/login'
    }
  }

  return true
})

export default router
