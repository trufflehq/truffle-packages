import _ from 'https://esm.sh/lodash?no-check'
import {
  FRAGMENT_COMPONENT_INSTANCE_FIELDS_ADMIN, FRAGMENT_COMPONENT_INSTANCE_FIELDS
} from '../constants.js'

export default class ComponentInstance {
  constructor ({ auth }) {
    this.auth = auth
  }

  getByShareSlug = (shareSlug) => {
    return this.auth.stream({
      query: `
        query CacheableComponentInstanceWithFields($shareSlug: String) {
          componentInstance(shareSlug: $shareSlug) {
            ...componentInstanceFields
          }
        } ${FRAGMENT_COMPONENT_INSTANCE_FIELDS}`,
      variables: { shareSlug },
      pull: 'componentInstance'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query CacheableComponentInstanceWithFields($id: ID) {
          componentInstance(id: $id) {
            ...componentInstanceFields
            children {
              ...componentInstanceFields
              children {
                ...componentInstanceFields
                children {
                  ...componentInstanceFields
                  children {
                    ...componentInstanceFields
                    children {
                      ...componentInstanceFields
                      children {
                        ...componentInstanceFields
                        children {
                          ...componentInstanceFields
                          children {
                            ...componentInstanceFields
                            children {
                              ...componentInstanceFields
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } ${FRAGMENT_COMPONENT_INSTANCE_FIELDS}`,
      variables: { id },
      pull: 'componentInstance'
    })
  }

  upsert = ({ id, componentId, parentId, topId, props }, { getFragment } = {}) => {
    return this.auth.call({
      query: `
        mutation ComponentInstanceUpsert(
          $id: ID
          $componentId: ID
          $parentId: ID
          $topId: ID
          $props: JSON
        ) {
          componentInstanceUpsert(id: $id, componentId: $componentId, parentId: $parentId, topId: $topId, props: $props) {
            ${getFragment ? '...componentInstanceFieldsAdmin' : 'id'}
          }
        } ${getFragment ? FRAGMENT_COMPONENT_INSTANCE_FIELDS_ADMIN : ''}`,
      variables: { id, componentId, parentId, topId, props },
      pull: 'componentInstanceUpsert'
    }, { invalidateAll: true })
  }

  setRanksByTopId = (topId, parentIdsWithIds) => {
    return this.auth.call({
      query: `
        mutation ComponentInstanceSetRanksByTopId(
          $topId: ID
          $parentIdsWithIds: JSON
        ) {
          componentInstanceSetRanksByTopId(topId: $topId, parentIdsWithIds: $parentIdsWithIds)
        }`,
      variables: { topId, parentIdsWithIds },
      pull: 'componentInstanceSetRanksByTopId'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ComponentInstanceDeleteById($id: ID) {
          componentInstanceDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'componentInstanceDeleteById'
    }, { invalidateAll: true })
  }

  // certain props we need to modify before sending to server...
  processProps = async (props, { componentInstance, model, propTypes, embedsStream }) => {
    const newProps = await awaitObject(_.mapValues(props, async (value, key) => {
      const propType = propTypes[key]
      if (this.PROP_TYPE_ON_BEFORE_SAVES[propType.type.name]) {
        return this.PROP_TYPE_ON_BEFORE_SAVES[propType.type.name](value, { componentInstance, model, embedsStream })
      }
      return value
    }))
    return newProps
  }

  PROP_TYPE_ON_BEFORE_SAVES = {
    image: async (value, { embedsStream, model }) => {
      const isFile = value instanceof File
      if (isFile) {
        const res = await model.file.upload(value)
        console.log('res', res)
        return res?.data?.fileUpload
      }
      return value
    },
    link: async (value, { componentInstance, embedsStream, model }) => {
      console.log('saving link', value)
      if (value.url) { // only know url, so lets find/create link
        const link = await model.link.upsert({
          url: value.url,
          sourceType: 'componentInstance',
          sourceId: componentInstance.id
        })
        embedsStream?.next([{ id: link.id, value: link }])
        return { id: link.id }
      } else if (value.id) {
        return { id: value.id }
      }
    }
  }
}

// https://stackoverflow.com/a/65700267
async function awaitObject (obj) {
  if (obj && typeof obj.then === 'function') obj = await obj
  if (!obj || typeof obj !== 'object') return obj
  const forWaiting = []
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k].then === 'function') forWaiting.push(obj[k].then(res => { obj[k] = res }))
    if (obj[k] && typeof obj[k] === 'object') forWaiting.push(awaitObject(obj[k]))
  })
  await Promise.all(forWaiting)
  return obj
}