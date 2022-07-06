export default class Time {
  constructor ({ auth }) {
    this.auth = auth
    this.serverTime = Date.now()
    this.timeInterval = setInterval(() => {
      this.serverTime += 5000
    }, 5000)

    setTimeout(() => {
      return this.updateServerTime()
    }, 100)
  }

  updateServerTime = async () => {
    const { data } = await this.auth.call({ query: 'query Time { time }' })
    this.serverTime = Date.parse(data.time.now)
  }

  getServerTime = () => {
    return this.serverTime
  }

  dispose = () => {
    clearInterval(this.timeInterval)
  }
}
