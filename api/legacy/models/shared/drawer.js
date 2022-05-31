import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

export default class Drawer {
  constructor () {
    this._isOpenStream = createSubject(false)
  }

  isOpen = () => {
    return this._isOpenStream
  }

  open = () => {
    // could use vanilla to open and close drawer for perf
    // (would need to get rid of all isOpens in state so it wouldn't re-render)
    this._isOpenStream.next(true)
  }

  close = () => {
    this._isOpenStream.next(false)
  }
}
