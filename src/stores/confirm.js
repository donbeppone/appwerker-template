import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const visible = ref(false)
  const message = ref('')
  const header = ref('')
  const acceptLabel = ref('OK')
  const rejectLabel = ref('Abbrechen')
  const acceptColor = ref('primary')
  let resolveFn = null

  function require({ message: msg, header: hdr, acceptProps, rejectProps }) {
    message.value = msg
    header.value = hdr || 'Bestätigung'
    acceptLabel.value = acceptProps?.label || 'OK'
    acceptColor.value = acceptProps?.severity === 'danger' ? 'error' : 'primary'
    rejectLabel.value = rejectProps?.label || 'Abbrechen'
    visible.value = true
    return new Promise((resolve) => { resolveFn = resolve })
  }

  function accept() {
    visible.value = false
    resolveFn?.(true)
  }

  function reject() {
    visible.value = false
    resolveFn?.(false)
  }

  return { visible, message, header, acceptLabel, rejectLabel, acceptColor, require, accept, reject }
})
