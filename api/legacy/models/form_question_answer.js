export default class FormQuestionAnswer {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByFormId = (formId) => {
    return this.auth.stream({
      query: `
        query FormQuestionAnswerGetAllByFormId($formId: ID) {
          formQuestionAnswers(formId: $formId) {
            nodes {
              id
              formResponseId
              user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
              metadata
            }
          }
        }`,
      variables: { formId },
      pull: 'formQuestionAnswers'
    })
  }

  batchUpsertByFormId = (formId, formQuestionAnswers) => {
    console.log('batch', formQuestionAnswers)
    return this.auth.call({
      query: `
        mutation FormQuestionAnswerBatchUpsert(
          $formId: ID
          $formQuestionAnswers: JSON
        ) {
          formQuestionAnswerBatchUpsert(formId: $formId, formQuestionAnswers: $formQuestionAnswers)
        }`,
      variables: { formId, formQuestionAnswers },
      pull: 'formQuestionAnswerBatchUpsert'
    }, { invalidateAll: true })
  }

  upsert = ({ id, metadata }) => {
    console.log('single', id, metadata)
    return this.auth.call({
      query: `
        mutation FormQuestionAnswerUpsert(
          $id: ID
          $metadata: JSON
        ) {
          formQuestionAnswerUpsert(id: $id, metadata: $metadata) { id }
        }`,
      variables: { id, metadata },
      pull: 'formQuestionAnswerUpsert'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation formQuestionAnswerDeleteById($id: ID) {
          formQuestionAnswerDeleteById(id: $id)
        }
      `,
      variables: { id },
      pull: 'formQuestionAnswerDeleteById'
    }, { invalidateAll: true })
  }
}
