import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

export default class StatusBar {
  constructor () {
    this._data = createSubject(null)
  }

  getData = () => {
    return this._data
  }

  open = (data) => {
    this._data.next(data)
    if (data?.timeMs) {
      return setTimeout(this.close, data.timeMs)
    }
  }

  close = () => {
    return this._data.next(null)
  }
}
