import React from 'react'

// w/o the memo, browser css will flash every render
const MemoizeStylesheet = React.memo(({ url }) => {
  return (
    <link rel="stylesheet" href={url.toString()} />
  )
}, (prevProps, nextProps) => prevProps.url.toString() === nextProps.url.toString())

export default MemoizeStylesheet
