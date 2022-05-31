class Ssr {
  setReq = (req) => { this.req = req }
  getReq = () => this.req

  setRes = (res) => { this.res = res }
  getRes = () => this.res
}

const ssr = new Ssr()

// TODO: use asyncLocalStorage to get correct class instance for ssr
export const getSsrReq = ssr.getReq
export const setSsrReq = ssr.setReq
export const getSsrRes = ssr.getRes
export const setSsrRes = ssr.setRes
