import _ from 'https://esm.sh/lodash?no-check'

export function formatNumber (number) {
  // http://stackoverflow.com/a/2901298
  if (number != null) {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    return '...'
  }
}

// https://stackoverflow.com/a/32638472
export function abbreviateNumber (value, fixed) {
  if (value == null) {
    return '...'
  }
  // terminate early
  if (value === 0) {
    return '0'
  }
  if (typeof value !== 'number') {
    value = Number(value)
  }
  // terminate early
  fixed = !fixed || (fixed < 0) ? 0 : fixed
  // number of decimal places to show
  const b = value.toPrecision(2).split('e')
  const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3)
  const c = k < 1 ? value.toFixed(0 + fixed) : (value / Math.pow(10, (k * 3))).toFixed(1 + fixed)
  const d = c < 0 ? c : Math.abs(c)
  const e = d + [
    '',
    'K',
    'M',
    'B',
    'T'
  ][k]
  // append power
  return e
}

export function abbreviateDollar (value, fixed = 2) {
  return `$${this.abbreviateNumber(value, fixed)}`
}

export function formatLocation (obj) {
  const { city, state } = obj || {}
  if (city && state) {
    return `${city}, ${state}`
  } else if (state) {
    return state
  } else if (obj) {
    return 'Unknown'
  } else {
    return '...'
  }
}

export function formatPercentage (value) {
  return `${Math.round(value * 100)}%`
}

export function centsToDollars (cents) {
  return (cents / 100).toFixed(2)
}

export function formatCountdown (s, { shouldAlwaysShowHours = true } = {}) {
  let hours, prettyTimer
  let seconds = Math.floor(s % 60)
  if (seconds < 0) {
    seconds = '00'
  } else if (seconds < 10) {
    seconds = `0${seconds}`
  }

  const days = Math.floor(s / 86400)
  let minutes = Math.floor(s / 60) % 60
  if (minutes < 0) {
    minutes = '00'
  } else if (minutes < 10) {
    minutes = `0${minutes}`
  }
  if (days > 2) {
    hours = Math.floor(s / 3600) % 24
    if (hours < 10) {
      hours = `0${hours}`
    }
    prettyTimer = `${days} days`
  } else {
    hours = Math.floor(s / 3600)
    if (hours < 0) {
      hours = '00'
    } else if (hours < 10) {
      hours = `0${hours}`
    }

    if (shouldAlwaysShowHours || hours !== '00') {
      prettyTimer = `${hours}:${minutes}:${seconds}`
    } else {
      prettyTimer = `${minutes}:${seconds}`
    }
  }

  return prettyTimer
}

export function arrayToSentence (arr) {
  return arr.join(', ').replace(/, ((?:.(?!, ))+)$/, ' and $1')
}

// [2015, 2016, 2017, 2019] -> "2015-2017, 2019"
export function yearsArrayToEnglish (years) {
  let isConsecutive = false
  let str = ''
  years.forEach(function (year, i) {
    if ((years[i + 1] === (year + 1)) && !isConsecutive) {
      str += `${year}-`
      isConsecutive = true
    } else if (!isConsecutive) {
      str += `${year}, `
    } else if (years[i + 1] !== (year + 1)) {
      str += `${year}, `
      isConsecutive = false
    }
  })

  return str.slice(0, -2)
}

export function formatUnit (value, unit, type = 'text') {
  if (unit === 'second') {
    value = (value / 60).toFixed(2)
  }

  if (unit === 'percentFraction') {
    value = Math.round(10 * value * 100) / 10
  } else if (unit === 'float') {
    value = Math.round(100 * value) / 100
  } else if (unit === 'cents') {
    value = this.abbreviateDollar(value / 100)
  } else if (unit === 'dollars') {
    value = this.abbreviateDollar(value)
  } else if (type === 'graph') {
    value = this.abbreviateNumber(value)
  }

  if (unit === 'second') { // already converted to min above
    value += ' min'
  }

  return value
}

// https://stackoverflow.com/a/8358141
export function formatPhone (number) {
  const cleaned = ('' + number).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}

// https://stackoverflow.com/a/45309230
export function parseNumber (value, locales = navigator.languages) {
  const example = Intl.NumberFormat(locales).format('1.1')
  const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, 'g')
  const cleaned = value.replace(cleanPattern, '')
  const normalized = cleaned.replace(example.charAt(1), '.')

  return parseFloat(normalized)
}

export function formatCurrency (value) {
  let inputVal = `${parseFloat(value / 100).toFixed(2)}`
  if (inputVal === '') { return }

  if (inputVal.indexOf('.') >= 0) {
    const decimalPos = inputVal.indexOf('.')

    let leftSide = inputVal.substring(0, decimalPos)
    let rightSide = inputVal.substring(decimalPos)

    leftSide = this.formatNumber(leftSide)

    rightSide = this.formatNumber(rightSide)

    rightSide = rightSide.substring(0, 2)

    inputVal = leftSide + '.' + rightSide
  } else {
    inputVal = this.formatNumber(inputVal)
  }

  return inputVal
}

export function parseToCents (n) {
  let cents = n.replace(/[^\d]/g, '')
  cents = parseFloat(cents)
  return cents
}

export function zeroPrefix (number) {
  return parseInt(number) < 10 && parseInt(number) > 0 ? `0${number}` : number
}

export function strReplaceWithComponent (text, regex, $component) {
  let textArray
  // if we already replaced and now have an array
  if (_.isArray(text)) {
    textArray = _.flatten(_.map(text, (chunk) => {
      if (typeof chunk === 'string') {
        return chunk.split(regex)
      } else {
        return chunk
      }
    }))
  } else {
    textArray = text.split(regex)
  }
  return _.map(textArray, (chunk) => {
    if (typeof chunk === 'string' && regex.test(chunk)) {
      return $component
    }
    return chunk
  })
}
