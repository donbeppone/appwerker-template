import { useToastStore } from '@/stores/toast.js'

export function useToast() {
  const store = useToastStore()
  return { add: store.add }
}
