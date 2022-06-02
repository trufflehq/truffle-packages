import React from 'react'
import PropTypes from 'prop-types'

export default function DefaultSite ({ exampleProp }) {
  return <div>
    This is my default site, with variable: {exampleProp}
  </div>
}

DefaultSite.propTypes = {
  exampleProp: PropTypes.string
}
