export const useModal = () => {
  const title = ref('')

  const visible = ref(false)

  return {
    title,
    visible,
    openModal() {
      visible.value = true
    },
    closeModal() {
      visible.value = false
    }
  }
}
