import * as _ from 'https://jspm.dev/lodash-es'

import { API_URL } from './legacy/constants.js'

// if you update this, update value in backend too
const SOCKET_PING_INTERVAL_MS = 24 * 1000 // 24s in between pings

const SOCKET_PING_TIMEOUT_MS = 3 * 1000 // 3s for server to send 'pong' back from ping
const RECONNECT_DELAY_MS = 2 * 1000 // 2s

class IO {
  constructor () {
    this.isSsr = typeof window === 'undefined'
    this.url = API_URL
    this._queue = []
    this._listeners = {}
    this._reconnections = 0
    this._isClosed = true
    this._isConnecting = false
    this._isUnloaded = false
  }

  connect (ssrWebSocket) {
    if (this.isSsr) {
      this.WebSocket = ssrWebSocket
    } else {
      this.WebSocket = window.WebSocket
      // attempt to fix issue where socket connection sometimes hangs until browser restart
      // socket.io does this
      window.addEventListener('beforeunload', () => {
        this._isUnloaded = true
        this.close()
      })
    }
    if (!this._isClosed || this._isConnecting) {
      return console.log('already connected or connecting')
    }
    this._isConnecting = true
    this.connection = new this.WebSocket(this.url.replace(/^http/, 'ws'))
    console.log('ws connecting...')

    // TODO: 12/2/2021: sometimes socket seems to hang on trying to connect
    // onopen doesn't get fired for a good couple min, even after refresh
    // but fires instantly in another browser
    this.connection.onopen = () => {
      this._isConnecting = false
      this._isClosed = false
      console.log('ws connection open', this._reconnections)
      clearTimeout(this.reconnectTimeout)
      if (!this.isSsr) {
        this.ping()
      }
      // ping every PING_INTERVAL_MS seconds to check that we're still connected to server
      // times out if no pongs in SOCKET_PING_TIMEOUT_MS
      while (this._queue.length) this.connection.send(this._queue.shift())
      if (this._reconnections > 0) {
        this._onReconnect?.()
      }
      this._reconnections += 1
    }

    this.connection.onerror = (err) => {
      console.warn('ws error', err)
      // this.close()
    }

    this.connection.onclose = () => {
      this._isClosed = true
      this._isConnecting = false
      clearTimeout(this.timeoutTimeout)
      clearTimeout(this.pingIntervalTimeout)
      if (!this.isSsr && !this._isUnloaded) {
        this.attemptReconnect()
      }
    }

    this.connection.onmessage = (message) => {
      if (message.data === 'pong') {
        return this.pong()
      }
      const { event, data } = JSON.parse(message.data)
      this._listeners[event]?.(data)
    }
  }

  onReconnect (fn) {
    this._onReconnect = fn
  }

  on (event, fn) {
    this._listeners[event] = fn
    // TODO: make sure this doesn't infinitely grow (memory leak)
    console.log('listeners length', _.keys(this._listeners).length)
  }

  off (event, fn) {
    delete this._listeners[event]
  }

  emit (event, data) {
    const message = JSON.stringify({ event, data })

    this.connection?.readyState === 1
      ? this.connection.send(message)
      : this._queue.push(message)
  }

  ping () {
    if (this.connection.readyState !== 1) {
      return console.log('attempted ping without being ready')
    }
    this.connection.send('ping')
    clearTimeout(this.timeoutTimeout)
    clearTimeout(this.pingIntervalTimeout)
    this.timeoutTimeout = setTimeout(() => this.onTimeout(), SOCKET_PING_TIMEOUT_MS)
  }

  pong () {
    clearTimeout(this.timeoutTimeout)
    clearTimeout(this.pingIntervalTimeout)
    this.pingIntervalTimeout = setTimeout(() => this.ping(), SOCKET_PING_INTERVAL_MS)
  }

  onTimeout () {
    console.log('ws timeout')
    this.close()
  }

  close (attempt = 0) {
    if (this._isClosed) {
      return console.log('already closed')
    }
    // for some reason this.connection.close isn't firing onclose...
    this.connection.onclose?.()
    this.connection.onclose = () => null
    // ssr for some reason closes early with
    // WebSocket was closed before the connection was established
    // this avoids that.
    // TODO: look into the correct solution for this
    if (!this.isSsr && this.connection.readyState === 1) {
      if (attempt) {
        console.log('closed on second attempt (look into another way to do this)')
      }
      this.connection.close()
    } else if (!this.isSsr && !attempt) {
      // attempt again?
      setTimeout(() => this.close(attempt += 1), 1000)
    }
  }

  attemptReconnect () {
    console.log('attempting ws reconnection')
    clearTimeout(this.reconnectTimeout)
    // naive with no backoff
    this.reconnectTimeout = setTimeout(() => this.connect(), RECONNECT_DELAY_MS)
  }
}

export default new IO()
