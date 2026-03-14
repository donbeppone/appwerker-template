import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const queue = ref([])

  function add({ severity = 'info', summary = '', detail = '', life = 3000 }) {
    const id = Date.now() + Math.random()
    queue.value.push({ id, severity, summary, detail, life })
    setTimeout(() => remove(id), life)
  }

  function remove(id) {
    queue.value = queue.value.filter((t) => t.id !== id)
  }

  return { queue, add, remove }
})
