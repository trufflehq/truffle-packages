export default class Form {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query Forms {
          forms {
            nodes { id, slug, name, description }
          }
        }`,
      // variables: {},
      pull: 'forms'
    })
  }

  getBySlugAdmin = (slug) => {
    return this.auth.stream({
      query: `
        query FormBySlug($slug: String) {
          form(slug: $slug) {
            id, slug, name, description, endTime
            formQuestions {
              nodes { id, question, type, data }
            }
            formResponses {
              totalCount
            }
          }
        }`,
      variables: { slug },
      pull: 'form'
    })
  }

  // HACK / HARDCODED for stanz task manager
  getStanzLeaderboard = ({ limit, ignoreCache }) => {
    return this.auth.stream({
      query: `
        query FormStanzLeaderboard($limit: Int) {
          form(slug: "stanz-leaderboard") {
            id, slug, name, description, endTime
            formQuestions {
              nodes { id, question, type }
            }
            formResponses(limit: $limit) {
              totalCount
              nodes {
                id
                formQuestionAnswers {
                  nodes {
                    id, formQuestionId, metadata
                  }
                }
                user { id, name, avatarImage { cdn, prefix, ext, data, variations { postfix }, aspectRatio } }
              }
            }
          }
        }`,
      variables: { limit },
      pull: 'form'
    }, { ignoreCache })
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query FormBySlug($slug: String) {
          form(slug: $slug) {
            id, slug, name, description, buttonText, maxResponsesPerUser, endTime
            formQuestions {
              nodes { id, question, type, data }
            }
          }
        }`,
      variables: { slug },
      pull: 'form'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query FormById($id: ID) {
          form(id: $id) {
            id, slug, name, description, buttonText, maxResponsesPerUser, endTime
            formQuestions {
              nodes { id, question, type, data }
            }
          }
        }`,
      variables: { id },
      pull: 'form'
    })
  }
}
