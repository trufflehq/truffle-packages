export default class ActivePowerup {
  constructor ({ auth }) {
    this.auth = auth
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation activePowerupDeleteById($id: ID) {
          activePowerupDeleteById(id: $id)
        }
      `,
      variables: { id },
      pull: 'activePowerupDeleteById'
    }, { invalidateAll: true })
  }
}
