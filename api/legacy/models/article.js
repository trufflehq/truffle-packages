import _ from 'https://esm.sh/lodash'

export default class Article {
  constructor ({ auth, podcastEpisode, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.podcastEpisode = podcastEpisode
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient

    this.FIELDS = `id, slug, time, title, body, data, commentCount, lastUpdateTime
      fileRels { fileObj { cdn, prefix, data, variations, ext, type } }
      attachments {
        sourceType
        sourceId
        sourceData
        podcastEpisode { ${this.podcastEpisode.BASE_FIELDS} ${this.podcastEpisode.SINGLE_FIELDS} }
        file { id, cdn, data, prefix, ext, contentType, type, variations }
      }
      orgUser {
        id
        bio
        socials
        user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
        activePowerupConnection {
          nodes {
            powerup {
              jsx
              componentRels { component { id } }
            }
          }
        }
      }
      reactionCounts { sourceType, sourceId, source, count }
      myReactions { sourceType, sourceId, source, vote }
      activePowerupConnection {
        nodes {
          id
          powerup {
            name
            jsx
            componentRels { component { id } }
            data
          }
        }
      }`
  }

  upsert = ({ id, slug, category, title, body, attachments, fileRels }, { file } = {}) => {
    window?.ga?.('send', 'event', 'social_interaction', 'article', category)

    return this.auth.call({
      query: `
        mutation ArticleUpsert($id: ID, $slug: String, $category: String, $title: String, $body: String, $attachments: JSON, $fileRels: JSON) {
          articleUpsert(id: $id, slug: $slug, category: $category, title: $title, body: $body, attachments: $attachments, fileRels: $fileRels) {
            id, orgId, slug, title, body
          }
        }`,
      variables: { id, slug, category, title, body, attachments, fileRels },
      pull: 'articleUpsert'
    }, { invalidateAll: true })
  }

  getAll = (options = {}) => {
    const {
      category, sort, sortTopHoursBack, shouldSkipRead, skip, maxId, limit, ignoreCache
    } = options

    const baseArticleNode = ` id, slug, time, title, body, data, commentCount, lastUpdateTime
    orgUser {
      id, user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
      seasonPass { orgUserStats { xp, levelNum, rank } }
      activePowerupConnection {
        nodes {
          powerup {
            componentRels { component { id } }
            jsx
          }
        }
      }
    }
    fileRels { fileObj { cdn, prefix, data, variations, ext, type } }
    reactionCounts { sourceType, sourceId, source, count }
    myReactions { sourceType, sourceId, source, vote }
    activePowerupConnection {
      nodes {
        id
        powerup {
          name
          jsx
          componentRels { component { id } }
          data
        }
      }
    }`

    return this.auth.stream({
      query: `
        query ArticleGetAll($category: String, $sort: SortEnum, $sortTopHoursBack: SortTopHoursBackEnum, $shouldSkipRead: Boolean, $skip: Int, $maxId: ID, $limit: Int) {
          articles(category: $category, sort: $sort, sortTopHoursBack: $sortTopHoursBack, shouldSkipRead: $shouldSkipRead, skip: $skip, maxId: $maxId, limit: $limit) {
            nodes {
              ${baseArticleNode}
              attachments {
                sourceType
                sourceId
                sourceData
              }
            }
          }
        } `,
      variables: { category, sort, sortTopHoursBack, shouldSkipRead, skip, maxId, limit },
      pull: 'articles'
    }, { ignoreCache })
  }

  getById = (id, { ignoreCache } = {}) => {
    return this.auth.stream({
      query: `
        query ArticleById($id: ID) {
          article(id: $id) {
            ${this.FIELDS}
          }
        } `,
      variables: { id },
      pull: 'article'
    }, { ignoreCache })
  }

  getByUserId = (userId, { ignoreCache } = {}) => {
    return this.auth.stream({
      query: `
        query ArticleByUserId($userId: ID!) {
          articles(userId: $userId) {
            totalCount,
            nodes {
              ${this.FIELDS}
            }
          }
        } `,
      variables: { userId },
      pull: 'articles'
    }, { ignoreCache })
  }

  getBySlug = (slug, { ignoreCache } = {}) => {
    return this.auth.stream({
      query: `
        query ArticleById($slug: String) {
          article(slug: $slug) {
            ${this.FIELDS}
          }
        } `,
      variables: { slug },
      pull: 'article'
    }, { ignoreCache })
  }

  updateById = (id, diff) => {
    return this.auth.call(`${this.namespace}.updateById`, _.defaults(diff, { id }), {
      invalidateAll: true
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ArticleDeleteById($id: ID) {
          articleDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'articleDeleteById'
    }, { invalidateAll: true })
  }

  publishById = async ({ id, shouldSendEmail }, { file } = {}) => {
    const query = `
    mutation ArticlePublishById($id: ID, $shouldSendEmail: Boolean) {
      articlePublishById(id: $id, shouldSendEmail: $shouldSendEmail)
    }`

    const variables = { id, shouldSendEmail }

    if (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response = await this.proxy(this.apiUrl + '/upload', {
        method: 'POST',
        query: {
          graphqlQuery: query,
          variables: JSON.stringify(variables)
        },
        body: formData
      })
      setTimeout(this.graphqlClient.invalidateAll, 0)
      return response
    } else {
      return this.auth.call({
        query, variables
      }, { invalidateAll: true })
    }
  }

  pinById = (id) => {
    return this.auth.call(`${this.namespace}.pinById`, { id }, {
      invalidateAll: true
    })
  }

  unpinById = (id) => {
    return this.auth.call(`${this.namespace}.unpinById`, { id }, {
      invalidateAll: true
    })
  }

  getPath = (article, router) => {
    return router.get('orgArticle', { slug: article?.slug })
  }

  // uploadImage (file) {
  //   const formData = new FormData()
  //   formData.append('file', file, file.name)

  //   return this.proxy(config.API_URL + '/upload', {
  //     method: 'post',
  //     query: {
  //       path: `${this.namespace}.uploadImage`
  //     },
  //     body: formData
  //   })
  //     .then(response => {
  //       this.exoid.invalidateAll()
  //       return response
  //     })
  // }
}
