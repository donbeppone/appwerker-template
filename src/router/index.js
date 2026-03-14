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

  // Auto-Login via URL-Parameter (von Appwerker gesetzt)
  if (!auth.user && to.query['aw-email'] && to.query['aw-pass']) {
    try {
      await auth.login(to.query['aw-email'], to.query['aw-pass'])
      // Parameter aus URL entfernen
      const { 'aw-email': _e, 'aw-pass': _p, ...cleanQuery } = to.query
      return { path: to.path, query: cleanQuery }
    } catch {
      // Login fehlgeschlagen → normal zum Login
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
