export default class Org {
  constructor ({ auth, org }) {
    this.auth = auth
    this.org = org
  }

  // uses orgSlug automatically
  getMe = () => {
    return this.auth.stream({
      query: `
        query OrgConfigByMe {
          orgConfig {
            cssVars
          }
        }`,
      // variables: {},
      pull: 'orgConfig'
    })
  }

  getMeWithHasCompletedTasks = () => {
    return this.auth.stream({
      query: 'query OrgConfigByMeWithCompletedTasks { orgConfig { completedTasks } }',
      // variables: {}
      pull: 'orgConfig'
    })
  }

  getMeWithBotUser = () => {
    return this.auth.stream({
      query: `query OrgConfigByMeWithBotUser {
        orgConfig {
          botUser {
            id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio }
          }
        }
      }`,
      pull: 'orgConfig'
    })
  }

  getMeWithData = () => {
    return this.auth.stream({
      query: `query OrgConfigByMeWithBotUser {
        orgConfig { data }
      }`,
      pull: 'orgConfig'
    })
  }

  upsert = async ({ fileRels, colors, features, socials, radiusMultiplier, fonts, data }) => {
    const res = await this.auth.call({
      query: `
        mutation OrgConfigUpsert(
          $fileRels: JSON
          $colors: JSON
          $features: [String]
          $socials: JSON
          $radiusMultiplier: Float
          $fonts: JSON
          $data: JSON
        ) {
          orgConfigUpsert(fileRels: $fileRels, colors: $colors, features: $features, socials: $socials, radiusMultiplier: $radiusMultiplier, fonts: $fonts, data: $data) {
            features
          }
        }`,
      variables: { fileRels, colors, features, socials, radiusMultiplier, fonts, data },
      pull: 'orgConfig'
    }, { invalidateAll: false }) // done separately

    this.org.invalidateGetMeThenAll()

    return res
  }

  completeTask = async (taskKey) => {
    const res = await this.auth.call({
      query: `
        mutation orgConfigCompleteTask($taskKey: String) {
          orgConfigCompleteTask(taskKey: $taskKey) {
            completedTasks
          }
        }`,
      variables: { taskKey },
      pull: 'orgConfigCompleteTask'
    }, { invalidateAll: false }) // done separately

    this.org.invalidateGetMeThenAll()

    return res
  }
}
