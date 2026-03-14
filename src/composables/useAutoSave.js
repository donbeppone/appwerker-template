import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast.js'

/**
 * Debounced Auto-Save Composable.
 *
 * @param {Function} dataFn  — Getter der zu überwachenden Daten
 * @param {Function} saveFn  — Async-Funktion die das Speichern durchführt
 * @param {Object}   options — { delay: number } Debounce in ms (default 1500)
 *
 * @returns {{ status: Ref<string>, markLoaded: Function, saveNow: Function }}
 */
export function useAutoSave(dataFn, saveFn, { delay = 1500 } = {}) {
  const toast = useToast()
  const status = ref('idle')
  const loaded = ref(false)
  let timeout = null
  let savedTimeout = null

  function clearTimers() {
    if (timeout) { clearTimeout(timeout); timeout = null }
    if (savedTimeout) { clearTimeout(savedTimeout); savedTimeout = null }
  }

  async function doSave() {
    status.value = 'saving'
    try {
      await saveFn()
      status.value = 'saved'
      savedTimeout = setTimeout(() => { status.value = 'idle' }, 3000)
    } catch (e) {
      status.value = 'error'
      toast.add({ severity: 'error', summary: 'Speichern fehlgeschlagen', detail: e.message, life: 5000 })
    }
  }

  function scheduleSave() {
    if (!loaded.value) return
    clearTimers()
    status.value = 'pending'
    timeout = setTimeout(() => doSave(), delay)
  }

  async function saveNow() {
    if (!loaded.value) return
    clearTimers()
    await doSave()
  }

  watch(dataFn, scheduleSave, { deep: true })

  function markLoaded() {
    nextTick(() => { loaded.value = true })
  }

  onUnmounted(() => { clearTimers() })

  return { status, markLoaded, saveNow }
}
