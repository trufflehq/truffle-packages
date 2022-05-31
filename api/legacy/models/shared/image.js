import * as _ from 'https://jspm.dev/lodash-es'

function hashFn (s) {
  if (!s) {
    return 'none'
  }
  return s.split('').reduce(function (a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
}

export default class ImageModel {
  constructor ({ cdnUrls }) {
    this.cdnUrls = cdnUrls
    this.loadedImages = {}
  }
  // TODO: clear this out every once in a while (otherwise it's technically a memory leak)

  load = (url) => {
    const hash = hashFn(url)
    if (this.loadedImages[hash] === true) {
      return Promise.resolve(null)
    } else if (this.loadedImages[hash]) {
      return this.loadedImages[hash]
    }
    this.loadedImages[hash] = new Promise((resolve, reject) => {
      const preloadImage = new Image()
      preloadImage.src = url
      return preloadImage.addEventListener('load', () => {
        this.loadedImages[hash] = true
        return resolve()
      })
    })
    return this.loadedImages[hash]
  }

  isLoaded = (url) => {
    // don't show for server-side otherwise it shows,
    // then hides, then shows again
    return (typeof window !== 'undefined') &&
      this.loadedImages[hashFn(url)] === true
  }

  getHash = (url) => {
    return hashFn(url)
  }

  isLoadedByHash = (hash) => {
    // don't show for server-side otherwise it shows,
    // then hides, then shows again
    return (typeof window !== 'undefined') &&
      this.loadedImages[hash] === true
  }

  getSrcByImageObj = (imageObj, { size = 'small' } = {}) => {
    const { cdn, prefix, variations, ext = 'jpg' } = imageObj || {}

    if (!prefix) {
      return ''
    }

    const postfix = `.${size}`

    // check if variation exists
    const cdnKey = !cdn ? 'legacy' : cdn
    const hasVariation = _.find(variations, { postfix }) || (
      cdnKey === 'legacy' && ext !== 'svg' // legacy embedded imageObjs don't always have variations
    )

    const cdnUrl = this.cdnUrls[cdnKey] || this.cdnUrls.default

    if (hasVariation) {
      return `${cdnUrl}/${prefix}${postfix}.${ext}`
    } else {
      // if (['png', 'jpg'].includes(ext)) {
      //   // if this happens, we should make sure graphql is sending back variations
      //   // otherwise we might get stuck using large (5mb) versions of image
      //   console.log('missing variation', `${cdnUrl}/${prefix}.${ext}`)
      // }
      return `${cdnUrl}/${prefix}.${ext}`
    }
  }

  parseExif = async (file, parsedDataStream) => {
    if (file.type.indexOf('jpeg') !== -1) {
      const ExifParser = await import('https://jspm.dev/exif-parser')
      const reader = new FileReader()
      reader.onload = (e) => {
        const parser = ExifParser.create(e.target.result)
        parser.enableSimpleValues(true)
        const result = parser.parse()
        let rotation
        switch (result.tags.Orientation) {
          case 3: rotation = 'rotate-180'; break
          case 8: rotation = 'rotate-270'; break
          case 6: rotation = 'rotate-90'; break
          default: rotation = ''
        }
        parsedDataStream?.next({
          width: result.imageSize?.width,
          height: result.imageSize?.height,
          rotation
        })
      }
      reader.readAsArrayBuffer(file)
    }
  }
}
