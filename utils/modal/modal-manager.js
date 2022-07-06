export default class ModalManager {
  constructor () {
    this.modals = []
  }

  add = (Modal, props, { id, onRemove } = {}) => {
    const existingModal = id && this.modals.find((modal) => modal.id === id)
    if (existingModal) {
      return
    }

    this.modals.concat(
      { Modal, props, id, onRemove }
    )

    window.addEventListener('backbutton', this.removeFromBackButton)
  }

  removeFromBackButton = (e) => {
    e.stopPropagation()
    return this.remove({ isFromBackButton: true })
  }

  remove = ({ id } = {}) => {
    let onRemove

    window.removeEventListener('backbutton', this.removeFromBackButton)

    if (id) {
      const index = id && this.modals.findIndex((modal) => modal.id === id)
      if (index !== -1) {
        const modal = this.modals[index]
        onRemove = modal.onRemove
        this.modals.splice(index, 1)
      }
    } else {
      const modal = this.modals.pop()
      onRemove = modal.onRemove
    }

    onRemove?.()
  }
}
