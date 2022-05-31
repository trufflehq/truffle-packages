import request from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/request.js'
import { Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

const GIPHY_PUBLIC_API_KEY = '26hitOr3B5XJKYCs0'

const PATH = 'https://api.giphy.com/v1/gifs'

export default class Gif {
  search (query, { limit }) {
    return Obs.from(request(`${PATH}/search`, {
      method: 'GET',
      query: { q: query, limit, api_key: GIPHY_PUBLIC_API_KEY }
    }))
  }
}
