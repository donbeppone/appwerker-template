import { ref } from 'vue'

const drawerOpen = ref(true)
const activeLayout = ref('sidebar') // 'sidebar' | 'topbar' | 'minimal'

export function useAppShell() {
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  function setLayout(layout) {
    activeLayout.value = layout
  }

  return { drawerOpen, activeLayout, toggleDrawer, setLayout }
}
