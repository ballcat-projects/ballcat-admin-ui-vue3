export const useModal = (defaultTitle = '') => {
  const title = ref(defaultTitle)

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
