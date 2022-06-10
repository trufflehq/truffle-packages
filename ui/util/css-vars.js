const cssVars = {
  $bgBaseText: ''
}

export default cssVars

const IS_HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

export function rgb2rgba (color, opacity = 1) {
  const rgb = color.replace(/^rgb?\(|\s+|\)$/g, '')?.split(',')

  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, ${opacity})`
}

export function hexOpacity (hex, alpha) {
  return `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`
}

export function hex2rgb (hex) {
  const red = parseInt(hex[1] + hex[2], 16)
  const green = parseInt(hex[3] + hex[4], 16)
  const blue = parseInt(hex[5] + hex[6], 16)

  return `rgb(${red},${green}, ${blue})`
}

export function hex2rgba (hex, opacity = 1) {
  const rgb = this.hex2rgb(hex)

  return this.rgb2rgba(rgb, opacity)
}

export function isHex (hex) {
  return hex?.match(IS_HEX_REGEX)
}
