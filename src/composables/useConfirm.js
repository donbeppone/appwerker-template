import { useConfirmStore } from '@/stores/confirm.js'

export function useConfirm() {
  const store = useConfirmStore()
  return { require: store.require }
}
