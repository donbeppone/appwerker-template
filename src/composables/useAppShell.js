import { ref } from 'vue'
import { useTheme } from 'vuetify'

const drawerOpen = ref(true)
const activeLayout = ref('sidebar') // 'sidebar' | 'topbar' | 'minimal'
const isDark = ref(localStorage.getItem('aw-dark') === 'true')

export function useAppShell() {
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  function setLayout(layout) {
    activeLayout.value = layout
  }

  function toggleDarkMode() {
    const theme = useTheme()
    isDark.value = !isDark.value
    theme.global.name.value = isDark.value ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('aw-dark', String(isDark.value))
  }

  return { drawerOpen, activeLayout, isDark, toggleDrawer, setLayout, toggleDarkMode }
}
