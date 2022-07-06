export default class FormResponse {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByFormId = (formId, { limit } = {}) => {
    return this.auth.stream({
      query: `
        query FormResponseGetAllByFormId($formId: ID, $limit: Int) {
          formResponses(formId: $formId, limit: $limit) {
            id, name, description
            formQuestionAnswers {
              nodes {
                value
              }
            }
          }
        }`,
      variables: { formId, limit },
      pull: 'formResponses'
    })
  }

  getAllMeByFormId = (formId, { limit } = {}) => {
    return this.auth.stream({
      query: `
        query FormResponseGetAllMeByFormId($formId: ID, $isMe: Boolean, $limit: Int) {
          formResponses(formId: $formId, isMe: $isMe, limit: $limit) {
            nodes {
              id, name, description, metadata
              formQuestionAnswers {
                nodes {
                  formQuestionId, value
                }
              }
            }
          }
        }`,
      variables: { formId, isMe: true, limit },
      pull: 'formResponses'
    })
  }

  getAllByFormIdAndTimeRange = (formId, minTime, maxTime, { limit } = {}) => {
    return this.auth.stream({
      query: `
      query getAllByFormIdAndTimeRange($formId: ID, $minTime: String, $maxTime: String, $limit: Int) {
        formResponsesByFormIdAndTimeRange(formId: $formId, minTime: $minTime, maxTime: $maxTime, limit: $limit) {
          totalCount
          nodes {
            id, name, description, metadata, time
            formQuestionAnswers {
              nodes {
                formQuestionId, value
              }
            }
            user { id, name, avatarImage { cdn, prefix, ext, data, variations { postfix }, aspectRatio } }
          }
        }
      }`,
      variables: { formId, minTime, maxTime, limit },
      pull: 'formResponsesByFormIdAndTimeRange'
    })
  }

  upsert = ({ id, formId, formQuestionAnswers, metadata }) => {
    return this.auth.call({
      query: `
        mutation FormResponseUpsert(
          $id: ID
          $formId: ID
          $formQuestionAnswers: JSON
          $metadata: JSON
        ) {
          formResponseUpsert(id: $id, formId: $formId, formQuestionAnswers: $formQuestionAnswers, metadata: $metadata) { id }
        }`,
      variables: { id, formId, formQuestionAnswers, metadata },
      pull: 'formResponseUpsert'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation formResponseDeleteById($id: ID) {
          formResponseDeleteById(id: $id)
        }
      `,
      variables: { id },
      pull: 'formResponseDeleteById'
    }, { invalidateAll: true })
  }
}
