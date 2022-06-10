import React, { useMemo } from 'react'
import App from 'next/app'
import '../styles/globals.css'

// TODO: should this just be 'truffle-ssr'? so react can ignore dep?
import { setSsrReq, setSsrRes } from 'https://tfl.dev/@truffle/utils@0.0.1/ssr.js'
import { Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import io from 'https://tfl.dev/@truffle/api@0.0.1/legacy/io.js'
import model from 'https://tfl.dev/@truffle/api@0.0.1/legacy/index.js'

function MyApp ({ Component, pageProps }) {
  useMemo(() => {
    const siteInfoReadyObs = Obs.of({ orgId: 'c3d130d0-e068-11ec-a6dd-a83786015fef' }) // FIXME pull from package.json?
    console.log('set site info ready', siteInfoReadyObs)
    model.auth.setSiteInfoReadyObs(siteInfoReadyObs)
    if (typeof document !== 'undefined') {
      io.connect()
    }
  }, [])

  return <>
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Component {...pageProps} />
    </ErrorBoundary>
  </>
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)

  if (typeof document === 'undefined') {
    const WS = await import('ws')
    io.connect(WS.WebSocket)
    setSsrReq(appContext.ctx.req)
    setSsrRes(appContext.ctx.res)
  }

  return { ...appProps }
}

export default MyApp

function ErrorPage () {
  return <>error</>
}

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error) {
    console.log('err', error)
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }

  render () {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    // Return children components in case of no error

    return this.props.children
  }
}
