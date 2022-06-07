import React, { useMemo } from 'react'

import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import useObservables from 'https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js'
import classKebab from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js'

// import Icon from '../icon/icon.jsx'
import Ripple from '../ripple/ripple.jsx'
import cssVars from '../../util/css-vars.js'

// import './button.css'

/**
 * @param {Object} props
 * @param {primary|primary-outline|secondary|secondary-outline|bg|bgInverse|text} [props.style=primary] general style classification (color, border, etc...)
 * @param {small|medium|large} [props.size=medium]
 * @param {button|submit} [props.type=button] native <button> type
 * @param {normal|tile} [props.display=normal] the display type of the button; if 'tile', it will display as a tile button.
 * @param {string} [props.bg] a value to be passed to the background style of the button
 * @param {string} [props.borderRadius] a value to be passed to the borderRadius style of the button
 * @param {string} [props.text]
 * @param {string} [props.textColor]
 * @param {string} [props.secondaryText] a second piece of text displayed on tile buttons. You can also pass JSX to this prop.
 * @param {string} [props.secondaryTextColor]
 * @param {string} [props.icon] the icon path
 * @param {left|right} [props.iconLocation=left]
 * @param {number} [props.iconViewBox] passed directly to the viewBox prop of the icon component
 * @param {string} [props.iconColor] passed directly to the color prop of the icon component
 * @param {boolean} [props.iconCircled] passed directly to the isCircled prop of the icon component
 * @param {boolean} [props.shouldHandleLoading] if true, awaits onclick promise and shows loading during
 * @param {string} [props.href] if specified, the button is an <a>
 * @param {string} [props.target] specifies the link target
 * @param {function} [props.onclick]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.isFullWidth] if true, is width: 100%
 * @param {boolean} [props.isSelected] eg if action button is causing is true (drawer opened)
 * @param {stream} [props.isLoadingStream]
 */

export default function Button (props) {
  const {
    style = 'primary',
    size = 'medium',
    type = 'button',
    display = 'normal',
    bgColor,
    bg,
    borderRadius,
    text,
    textColor,
    secondaryText,
    secondaryTextColor,
    icon,
    iconViewBox,
    iconColor,
    iconCircled,
    iconLocation = 'left',
    shouldHandleLoading,
    href,
    onclick,
    onMouseDown,
    isDisabled,
    isSelected,
    isFullWidth,
    target
  } = props
  const { isLoadingStream } = useMemo(() => {
    return {
      isLoadingStream: props.isLoadingStream || createSubject(false)
    }
  }, [])

  const { isLoading } = useObservables(() => ({
    isLoading: isLoadingStream.obs
  }))

  const isTileButton = display === 'tile'

  const styleInfoMap = {
    primary: {
      textColor: cssVars.$primaryBaseText
    },
    'primary-outline': {
      textColor: cssVars.$primaryBase
    },
    secondary: {
      textColor: cssVars.$inheritBaseText
    },
    'secondary-outline': {
      textColor: cssVars.$secondaryBase
    },
    inherit: {
      textColor: cssVars.$inheritBaseText
    },
    bgInverse: {
      textColor: cssVars.$bgModInverse1Text
    },
    bg: {
      textColor: cssVars.$bgBaseText,
      selectedColor: cssVars.$secondaryBase
    },
    text: {
      textColor: cssVars.$inheritBaseText
    },
    link: {
      textColor: cssVars.$inheritBaseText
    },
    premium: {
      textColor: cssVars.$bgBaseText
    }
  }

  const sizeInfoMap = !isTileButton
    ? {
        small: {
          iconSize: '20px'
        },
        medium: {
          iconSize: '20px'
        },
        large: {
          iconSize: '24px'
        }
      }
    : {
        small: {
          iconSize: '20px'
        },
        medium: {
          iconSize: '30px'
        },
        large: {
          iconSize: '40px'
        }
      }

  const styleInfo = styleInfoMap[style] || {}
  const sizeInfo = sizeInfoMap[size]

  const $iconWrapper = icon && (
    <div className="icon-wrapper">
      {/* <Icon
        icon={icon}
        size={sizeInfo.iconSize}
        color={iconColor || (isSelected && styleInfo.selectedColor) || styleInfo.textColor}
        viewBox={iconViewBox}
        isCircled={iconCircled}
      /> */}
    </div>
  )

  const buttonStyles = {
    borderRadius,
    color: textColor
  }

  if (bgColor) buttonStyles.backgroundColor = bgColor
  if (bg) buttonStyles.background = bg

  // TODO: routing w/o hard page load if href exists
  return <button
    className={`z-button style-${style} size-${!isTileButton && size} icon-location-${iconLocation} ` + classKebab({
      hasIcon: Boolean(icon),
      isSelected,
      isDisabled,
      isFullWidth,
      removeBorder: !!bg,
      tileButton: isTileButton
    })}
    type={type}
    disabled={Boolean(isDisabled)}
    href={href}
    target={target}
    style={buttonStyles}
    onMouseDown={onMouseDown}
    onClick={async (e) => {
      if (!isDisabled) {
        shouldHandleLoading && isLoadingStream.next(true)
        try {
          await onclick?.(e)
          shouldHandleLoading && isLoadingStream.next(false)
        } catch (err) {
          shouldHandleLoading && isLoadingStream.next(false)
          throw err
        }
      }
    }}
  >
    { isTileButton
      ? <div className="tile-container">
          {icon && $iconWrapper}
          <div
            className={`secondary-text ${(isLoading || !secondaryText) ? 'invisible' : ''}`}
            style={{
              color: secondaryTextColor ?? textColor
            }}
          >{ !isLoading && secondaryText }</div>
          <div
            className="primary-text"
            style={{
              color: textColor
            }}
          >{isLoading ? 'Loading...' : text }</div>
        </div>
      : <>
          {icon && iconLocation === 'left' && $iconWrapper}
          {isLoading ? 'Loading...' : text}
          {icon && iconLocation === 'right' && $iconWrapper}
        </>
    }
    <Ripple color={styleInfo.textColor} />
  </button>
}
