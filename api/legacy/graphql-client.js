// docs: https://github.com/spore-gg/frontend-shared/blob/master/services/graphql_client.md
import _ from 'https://esm.sh/lodash'
// get consistent hash from stringified results
import stringify from 'https://jspm.dev/json-stable-stringify'
import uuid from 'https://jspm.dev/uuid@3'

import { createSubject, op, Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import request from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/request.js'
import { getCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

import io from '../io.js'
import { AUTH_COOKIE } from './constants.js'

export default class GraphqlClient {
  constructor ({ ioEmit, cache }) {
    this.isSsr = typeof document !== 'undefined'
    this._cache = {}
    this._batchQueue = []
    this._listeners = {}
    this._consumeTimeout = null

    this.ioEmit = ioEmit
    this.allowInvalidation = true
    this.synchronousCache = cache
    // used to prevent duplicated client-side increments
    this.connectionId = uuid.v4()
    this.dataCacheReplaySubject = new Obs.ReplaySubject(1)
    this.dataCacheReplaySubject.next(Obs.of(cache))

    _.forEach(cache, (result, key) => {
      if (result.shouldRefetchAfterSsr) {
        this._cache[key] = { rawData: result.value }
      } else {
        this._cacheSet(key, { dataObs: Obs.of(result.value) })
      }
    })

    this.dataCacheObs = this.dataCacheReplaySubject.pipe(op.switchAll())
    // simulataneous invalidateAlls seem to break streams
    this.invalidateAll = _.debounce(this._invalidateAll, 0, { trailing: true })
    !this.isSsr && io.onReconnect(() => {
      this.invalidateAll({ shouldOnlyInvalidateStream: true })
    })
  }

  disableInvalidation = () => {
    this.allowInvalidation = false
  }

  enableInvalidation = () => {
    this.allowInvalidation = true
  }

  // for ssr since it's synchronous 1 render atm (can't use getCacheObs)
  setSynchronousCache = (synchronousCache) => { this.synchronousCache = synchronousCache }
  getSynchronousCache = () => { return this.synchronousCache }

  _updateDataCacheObs = () => {
    const dataObsArray = _.map(this._cache, ({ dataObs, shouldRefetchAfterSsr }, key) =>
      dataObs
        ? dataObs.pipe(op.map(value => ({ key, value, shouldRefetchAfterSsr })))
        : Obs.of({ key, value: undefined })
    )
    const obs = Obs.combineLatest(dataObsArray)
      .pipe(
        op.map((datas) => {
          return _.reduce(datas, (cache, data) => {
            // ignore if the request hasn't finished yet (esp for server-side render)
            // don't use null since some reqs return null
            const { key, value, shouldRefetchAfterSsr } = data
            if (value !== undefined) {
              cache[key] = { value, shouldRefetchAfterSsr }
            }
            return cache
          }, {})
        })
      )

    return this.dataCacheReplaySubject.next(obs)
  }

  getCacheObs = () => { return this.dataCacheObs }

  _cacheSet (key, { combinedObs, dataObs, rawData, options }) {
    let combinedReplaySubject, dataObsSubject
    const valueToCache = options?.ignoreCache ? {} : this._cache[key] || {}
    valueToCache.shouldRefetchAfterSsr = options?.shouldRefetchAfterSsr
    if (dataObs && !valueToCache?.dataObs) {
      // https://github.com/claydotio/exoid/commit/fc26eb830910b6567d50e15063ec7544e2ccfedc
      dataObsSubject = this.isSsr
        ? new Obs.BehaviorSubject(Obs.of(undefined))
        : new Obs.ReplaySubject(1)
      valueToCache.dataObsSubject = dataObsSubject
      if (rawData) {
        // cache actual value for synchronous subscribe (obs startWith)
        // prevents double render since state can start w/ actual value
        valueToCache.rawData = rawData
      }
      valueToCache.dataObs = dataObsSubject.pipe(
        op.switchAll(),
        op.tap((rawData) => { valueToCache.rawData = rawData })
      )
    }

    if (combinedObs && !valueToCache?.combinedObs) {
      combinedReplaySubject = new Obs.ReplaySubject(1)
      valueToCache.options = options
      valueToCache.combinedReplaySubject = combinedReplaySubject
      valueToCache.combinedObs = combinedReplaySubject.pipe(op.switchAll())
    }

    if (dataObs) {
      valueToCache.dataObsSubject.next(dataObs)
    }

    if (combinedObs) {
      valueToCache.combinedReplaySubject.next(combinedObs)
    }

    if (!options?.ignoreCache) {
      this._cache[key] = valueToCache
      this._updateDataCacheObs()
    }

    return valueToCache
  }

  _batchRequest = (req, { isErrorable, isStreamed, streamId = uuid.v4() } = {}) => {
    if (!this._consumeTimeout) {
      this._consumeTimeout = setTimeout(this._consumeBatchQueue)
    }

    const res = new Obs.AsyncSubject()
    this._batchQueue.push({ req, res, isErrorable, isStreamed, streamId })
    return res
  }

  _consumeBatchQueue = () => {
    const queue = this._batchQueue
    this._batchQueue = []
    this._consumeTimeout = null

    const onBatch = (responses) => {
      _.forEach(responses, ({ result, error }, streamId) => {
        const queueIndex = _.findIndex(queue, { streamId })
        if (queueIndex === -1) {
          console.log('stream ignored', streamId)
          return
        }
        const { res, isErrorable } = queue[queueIndex]
        // console.log '-----------'
        // console.log req.path, req.body, req.query, Date.now() - start
        // console.log '-----------'
        queue.splice(queueIndex, 1)
        if (_.isEmpty(queue)) {
          io.off(batchId, onBatch)
        }

        if (isErrorable && (error != null)) {
          res.error(error)
          res.complete()
        } else if (error == null) {
          res.next(result)
          res.complete()
        } else {
          console.error('response error (not thrown)', error)
        }
      })
    }

    const onSuccess = (response) => {
      if (response.isError) {
        onError(response.info)
      } else {
        onBatch(response)
      }
    }
    const onError = (error) =>
      _.map(queue, ({ res, isErrorable }) => {
        if (isErrorable) {
          return res.error(error)
        } else {
          return console.error(error)
        }
      })

    const batchId = uuid.v4()
    io.on(batchId, onSuccess, onError)

    console.log('emitting')

    this.ioEmit('graphqlClient', {
      connectionId: this.connectionId,
      batchId,
      requests: _.map(queue, ({ req, streamId, isStreamed }) => ({
        streamId, path: req.path, body: req.body, isStreamed
      }))
    })

    console.log('emitted')
  }

  _combinedRequestObs = (req, options = {}) => {
    const { streamId, clientChangesStream } = options

    this._listeners[streamId] = this._listeners[streamId] || {}

    const initialDataObs = this._initialDataRequest(req, options)
    const additionalDataObs = streamId && options.isStreamed &&
      this._replaySubjectFromIo(io, streamId)
    const changesObs = additionalDataObs && clientChangesStream
      ? Obs.merge(additionalDataObs, clientChangesStream.obs)
      : additionalDataObs || clientChangesStream?.obs

    if (!changesObs) {
      return initialDataObs
    }

    // ideally we'd use concat here instead, but initialDataObs is
    // a switch observable because of cache
    const combinedObs = Obs.merge(initialDataObs, changesObs).pipe(
      op.scan((currentValue, update) => {
        // TODO: sometimes a change comes in before initialData (need to figure
        // out why) when changing pages. this & the filter counters that
        if (update?.changes && !currentValue) {
          return null
        }
        return this._combineChanges({
          connectionId: update?.connectionId,
          currentValue,
          initial: update?.changes ? null : update,
          changes: update?.changes
        }, options)
      }, null),
      op.filter((res) => res),
      op.publishReplay(1),
      op.refCount()
      // NOTE: shareReplay isn't great for this use case. when we invalidate
      // cache, we're unsubscribing from this combinedObs and creating
      // a new one but shareReplay here has this op.scan live on forever.
      // so instead we use publishReplay and refCount, manually listen to it
      // so it doesn't reset when it hits 0 subscribers, then clean up
      // when we invalidate.
      // op.shareReplay(1)
    )

    // if stream gets to 0 subscribers, the next subscriber starts over
    // from scratch and we lose all the progress of the .scan.
    // This is because publishReplay().refCount() (and any subject)
    // will disconnect when it
    // 2/17/2021 this is not needed anymore after switching to shareReplay
    this._listeners[streamId].combinedDisposable = combinedObs.subscribe(() => null)

    return combinedObs
  }

  // accept changes from socket emit (new node, deleted node, etc...)
  // TODO: can we use something like dotwild here instead of our made up syntax
  // for the changes array?
  // something like { target: 'dotwild.notation', action: 'increment|update|delete|create', value }
  _combineChanges = ({ connectionId, currentValue, initial, changes }, options) => {
    const {
      initialSortFn, limit, shouldPrependNewUpdates,
      ignoreIncrementsFromMe, ignoreNewStream, shouldMergeStreamUpdates
    } = options
    let newValue
    if (initial) {
      newValue = _.cloneDeep(initial)
      if (_.isArray(newValue) && initialSortFn) {
        newValue = initialSortFn(newValue)
      }
    } else if (changes) {
      options.onNewData?.(changes)
      console.log('changes', changes)
      // FIXME: figure out double changes
      // console.log('changes', changes)
      newValue = _.defaults({
        data: _.mapValues(currentValue.data, (data) => {
          const currentNodes = data.nodes || []
          let newNodes = _.cloneDeep(currentNodes)
          _.forEach(changes, (change) => {
            let existingIndex = -1
            if (['update', 'delete', 'incrementChildren', 'updateChildren', 'updateChild'].includes(change.action)) {
              existingIndex = _.findIndex(currentNodes, { id: change.oldId })
            }

            // if client already added this id, update instead
            if (change.action === 'create') {
              existingIndex = _.findIndex(currentNodes, { clientId: change.newVal?.clientId })
              if (existingIndex !== -1) {
                change.action = 'update'
              }
            }

            if (change.action === 'delete' && change.clientId) {
              existingIndex = _.findIndex(currentNodes, { clientId: change.clientId })
            }

            const isFromMe = connectionId === this.connectionId
            // used for updating reactions
            if (change.action === 'incrementChildren' && existingIndex !== -1 && (!isFromMe || !ignoreIncrementsFromMe)) {
              const existingChildren = newNodes[existingIndex][change.childKey]
              _.forEach(change.children, (childDiff) => {
                const existingChildIndex = _.findIndex(existingChildren, childDiff.find)
                if (existingChildIndex !== -1) {
                  _.forEach(childDiff.increment, (incrementAmount, key) => {
                    const existingValue = newNodes[existingIndex][change.childKey][existingChildIndex][key]
                    // default the child to 0 if it doesn't exist
                    newNodes[existingIndex][change.childKey][existingChildIndex][key] = existingValue || 0
                    newNodes[existingIndex][change.childKey][existingChildIndex][key] += incrementAmount
                  })
                } else {
                  // childDiff doesn't exist, let's create it from the find and increment
                  newNodes[existingIndex][change.childKey] = existingChildren.concat({
                    ...childDiff.find,
                    ...childDiff.increment
                  })
                }
              })
            } else if (change.action === 'updateChild' && existingIndex !== -1 && (!isFromMe || !ignoreIncrementsFromMe)) {
              newNodes[existingIndex][change.childKey] = change.newChildValue
            } else if (change.action === 'updateChildren' && existingIndex !== -1 && (!isFromMe || !ignoreIncrementsFromMe)) {
              const existingChildren = newNodes[existingIndex][change.childKey]
              _.forEach(change.children, (child) => {
                const existingChildIndex = _.findIndex(existingChildren, child.find)
                if (existingChildIndex !== -1) {
                  newNodes[existingIndex][change.childKey][existingChildIndex] = _.defaults(
                    child.replace,
                    newNodes[existingIndex][change.childKey][existingChildIndex]
                  )
                } else {
                  newNodes[existingIndex][change.childKey] = existingChildren.concat(
                    _.defaults(child.replace, child.find)
                  )
                }
              })

            // update existing value
            } else if (change.action === 'update' && existingIndex !== -1) {
              if (shouldMergeStreamUpdates) {
                newNodes.splice(existingIndex, 1, _.defaultsDeep(change.newVal, newNodes[existingIndex]))
              } else {
                newNodes.splice(existingIndex, 1, change.newVal)
              }

            // rm existing value
            } else if (change.action === 'delete' && existingIndex !== -1) {
              newNodes.splice(existingIndex, 1)

            // add new value
            } else if (change.action === 'create' && !ignoreNewStream) {
              if (shouldPrependNewUpdates) {
                newNodes = [change.newVal].concat(currentNodes)
                if (limit && newNodes.length > limit) {
                  newNodes.pop()
                }
              } else {
                newNodes = currentNodes.concat([change.newVal])
                if (limit && newNodes.length > limit) {
                  newNodes.shift()
                }
              }
            }
          })
          return _.defaults({ nodes: newNodes }, data)
        })
      }, currentValue)
    }

    return newValue
  }

  _replaySubjectFromIo = (io, eventName) => {
    let replaySubject
    if (!this._listeners[eventName].replaySubject) {
      // console.log('new listener')
      replaySubject = new Obs.ReplaySubject(0)
      const ioListener = (data) => replaySubject.next(data)
      io.on(eventName, ioListener)
      this._listeners[eventName].replaySubject = replaySubject
      this._listeners[eventName].ioListener = ioListener
    }
    return this._listeners[eventName].replaySubject
  }

  _streamFromIo (io, eventName) {
    return new Obs.Observable(observer => {
      io.on(eventName, (data) => observer.next(data))
      return () => io.off(eventName)
    })
  }

  _initialDataRequest = (req, { isErrorable, streamId, ignoreCache, isStreamed }) => {
    const key = stringify(req)
    let cachedValue = this._cache[key]

    if (!cachedValue?.dataObs || ignoreCache) {
      // should only be caching the actual async result and nothing more, since
      // that's all we can really get from server -> client rendering with
      // json.stringify
      cachedValue = this._cacheSet(key, {
        dataObs: this._batchRequest(req, { isErrorable, streamId, isStreamed }),
        options: { ignoreCache }
      })
    }

    return cachedValue.dataObs
  }

  setDataCache = (req, data) => {
    const key = typeof req === 'string' ? req : stringify(req)
    return this._cacheSet(key, { dataObs: Obs.of(data) })
  }

  getCachedObs = (path, body, isErrorable) => {
    const req = { path, body, isErrorable: Boolean(isErrorable) }
    const key = stringify(req)

    if (this._cache[key]?.dataObs) {
      return this._cache[key].dataObs
    } else {
      return Obs.of(null)
    }
  }

  _getXhrRequestObs ({ url }, { method, query, body }) {
    const accessToken = getCookie(AUTH_COOKIE)
    return Obs.from(request(url, {
      method,
      query,
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }))
  }

  streamXhr (url, options = {}) {
    const { method = 'POST', query, body } = options
    const req = { url, method, query, body }
    const key = stringify(req)
    options.isXhr = true

    let cachedValue = this._cache[key]

    if (!cachedValue?.combinedObs || options.ignoreCache) {
      const dataObs = this._getXhrRequestObs(req, options)
      cachedValue = this._cacheSet(key, {
        options,
        dataObs,
        combinedObs: dataObs
      })
    }

    return cachedValue?.combinedObs
  }

  // returns promise
  async callXhr (url, options) {
    const { method = 'POST', query, body, shouldSkipInvalidation } = options
    const accessToken = getCookie(AUTH_COOKIE)
    const res = await request(url, {
      method,
      query,
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (!shouldSkipInvalidation) {
      this.invalidateAll()
    }
    return res
  }

  stream = (path, body, options = {}) => {
    // we don't want parents that have isErrorable: false to use the same
    // stream as those with isErrorable: true, so that's added to the cache key
    const req = { path, body, isErrorable: Boolean(options.isErrorable) }
    const key = stringify(req)

    let cachedValue = this._cache[key]
    const cachedValueRawData = this._cache[key]?.rawData

    if (!cachedValue?.combinedObs || options.ignoreCache) {
      const streamId = uuid.v4()
      options = _.defaults(options, {
        streamId,
        isErrorable: false
      })
      const { clientChangesStream } = options
      options.clientChangesStream = clientChangesStream && createSubject(clientChangesStream?.obs?.pipe(
        op.filter(_.identity), // initially and on validation this is set to null, which is filtered out here
        op.map((change) => {
          return {
            initial: null,
            changes: [change],
            isClient: true
          }
        }),
        op.share()
      ))

      cachedValue = this._cacheSet(key, {
        options,
        combinedObs: this._combinedRequestObs(req, options)
      })
    }

    return cachedValueRawData
      ? cachedValue?.combinedObs
        .pipe(
          // start with actual value to prevent 2 renders (basically makes subscribing to the obs synchronous)
          op.startWith(cachedValueRawData)
        )
      : cachedValue?.combinedObs
  }

  call = async (path, body, { additionalDataObs } = {}) => {
    const req = { path, body }

    const streamId = uuid.v4()

    if (additionalDataObs) {
      additionalDataObs.next(this._streamFromIo(io, streamId))
    }

    const obs = this._batchRequest(req, { isErrorable: true, streamId })

    const result = await obs.pipe(op.take(1)).toPromise()
    if (result?.error && (typeof document !== 'undefined' && window !== null)) {
      throw new Error(JSON.stringify(result?.error))
    }
    return result
  }

  disposeAll = () => {
    _.map(this._listeners, (listener, streamId) => {
      io.off(streamId, listener?.ioListener)
      listener?.combinedDisposable?.unsubscribe()
    })
    this._listeners = {}
  }

  // deobunced in constructor
  // clear cache for all requests (refetch all)
  _invalidateAll = ({ shouldOnlyInvalidateStream } = {}) => {
    if (!this.allowInvalidation) {
      return
    }

    this.disposeAll()

    this._cache = _.pickBy(_.mapValues(this._cache, (cache, key) => {
      const { dataObsSubject, combinedReplaySubject, options } = cache

      const shouldSkipInvalidation = options?.persistThroughInvalidateAll || (
        shouldOnlyInvalidateStream && !options?.isStreamed
      )
      if (shouldSkipInvalidation) {
        return cache
      }

      // without this, after invalidating, the stream is just the clientChanges
      // for a split second (eg chat just shows the messages you
      // posted for a flash until the rest reload in). this is kind of hacky
      // since it's a prop on the object, the observable gets completed replaced
      // in the model too

      if (options?.clientChangesStream) {
        console.log('clear stream')
        options.clientChangesStream?.next(null)
      }

      if (!combinedReplaySubject || (combinedReplaySubject.observers.length === 0)) {
        return false
      }
      const req = JSON.parse(key)
      delete cache.rawData
      if (options?.isXhr) {
        this.streamXhr(req.url, options)
        const dataObs = this._getXhrRequestObs(req, options)
        dataObsSubject.next(dataObs)
        combinedReplaySubject.next(dataObs)
      } else {
        dataObsSubject.next(this._batchRequest(req, options))
        combinedReplaySubject.next(this._combinedRequestObs(req, options))
      }
      return cache
    }), (val) => val)
    return null
  }

  // clear cache for single request (refetch)
  invalidate = (path, body, isErrorable) => {
    if (!this.allowInvalidation) {
      return
    }

    // console.log('Invalidating single', body)

    let req = { path, body, isErrorable: Boolean(isErrorable) }
    const key = stringify(req)

    _.map(this._cache, (cache, cacheKey) => {
      const { dataObsSubject, combinedReplaySubject, options } = cache
      req = JSON.parse(cacheKey)

      if ((req.path === path && _.isUndefined(body)) || cacheKey === key) {
        // console.log('found invalidation')
        const listener = this._listeners[options.streamId]
        listener?.combinedDisposable?.unsubscribe()
        delete this._listeners[options.streamId]
        io.off(options.streamId)

        delete cache.rawData
        dataObsSubject?.next(this._batchRequest(req, options))
        combinedReplaySubject.next(this._combinedRequestObs(req, options))
      }
    })

    return null
  }
}
