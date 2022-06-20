import React, { Suspense } from 'react'

import { getClient, gql, Provider } from 'https://tfl.dev/@truffle/api@0.0.1/client.js'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'
import config, { setConfig } from 'https://tfl.dev/@truffle/utils@0.0.1/config/config.js'

// NOTE: this gets injected into dom for client, so DO NOT put anything secret in here!!!
const clientConfig = {
  IS_DEV_ENV: globalThis?.Deno?.env.get('ULTRA_MODE') === 'development',
  IS_STAGING_ENV: false,
  IS_PROD_ENV: globalThis?.Deno?.env.get('ULTRA_MODE') !== 'development',
  PUBLIC_API_URL: globalThis?.Deno?.env.get('PUBLIC_MYCELIUM_API_URL'),
  API_URL: globalThis?.Deno?.env.get('PUBLIC_MYCELIUM_API_URL'),
  HOSTNAME: globalThis?.Deno?.env.get('SPOROCARP_HOSTNAME')
}
const serverConfig = {
  PUBLIC_API_URL: globalThis?.Deno?.env.get('PUBLIC_MYCELIUM_API_URL'),
  API_URL: globalThis?.Deno?.env.get('MYCELIUM_API_URL')
}

setConfig(globalThis?.Deno ? { ...clientConfig, ...serverConfig } : window._truffleConfig)

const GET_DOMAIN_QUERY = gql`query DomainByDomainName($domainName: String) {
  domain(domainName: $domainName) {
    orgId
    packageVersionId
    org { slug }
  }
}`

// only passing useAsync in vs importing directly because file is ts
export function TruffleSetup ({ state, useAsync, children }) {
  return <Suspense>
    <AsyncTruffleSetup state={state} useAsync={useAsync}>
      <Provider value={getClient()}>
        {children}
      </Provider>
    </AsyncTruffleSetup>
    <script dangerouslySetInnerHTML={{
      __html: `window._truffleConfig = ${JSON.stringify(window._truffleConfig || clientConfig)}`
    }} />
  </Suspense>
}

function AsyncTruffleSetup ({ state, useAsync, children }) {
  const hostname = state?.url?.hostname || window.location.hostname
  const domain = useAsync('/domain', () => getDomainByDomainName(hostname))

  if (domain) {
    const context = globalContext.getStore()
    context.orgId = domain.orgId
    context.packageVersionId = domain.packageVersionId
  } else {
    console.error('Error fetching domain from server (useAsync)')
  }

  return children
}

async function getDomainByDomainName (domainName) {
  const client = getClient()
  if (config.IS_DEV_ENV) {
    domainName = config.HOSTNAME
  }

  const domainResponse = await client
    .query(GET_DOMAIN_QUERY, { domainName, _skipAuth: true })
    .toPromise()
  const domain = domainResponse?.data?.domain

  console.log('got domain', domainName, domain, domainResponse)

  if (!domain) {
    console.error(`Invalid page, ${domainName}`)
  }

  return domain || null
}
