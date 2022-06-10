import _ from 'https://esm.sh/lodash?no-check'

const isSsr = typeof document === 'undefined'

// we use instead of fetch bc fetch doesn't support progress listeners (for upload progress bar)
export default async function request (url, { method = 'GET', query, body, headers = {}, beforeSend } = {}) {
  url = `${url}?` + new URLSearchParams(query)

  // not 1-1 api, but i don't think we call this server-side
  if (isSsr) {
    console.warn('our request method ssr support is mediocre')
    const res = await fetch(url, { method, body, headers })
    return res.json()
  }

  const isFile = !isSsr && (body instanceof FormData)
  if (isFile) {
    // this breaks things for some reason (no boundary set)
    // headers['Content-Type'] = 'multipart/form-data'
    // so we don't set content-type
  } else if (_.isPlainObject(body)) {
    // necessary for shopify checkout
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  // window.fetch doesn't support progress listener
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  beforeSend?.(xhr)
  const response = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(xhr.response)
        }
      }
    }
  })
  xhr.open(method, url, true)
  _.forEach(headers, (value, key) => {
    xhr.setRequestHeader(key, value)
  })
  xhr.send(body)

  return response
}
