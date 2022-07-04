import React, { Suspense } from 'https://npm.tfl.dev/react'

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
  HOST: globalThis?.Deno?.env.get('ULTRA_HOST') || 'dev.sporocarp.dev'
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

// only passing useSsrData in vs importing directly because file is ts
export function TruffleSetup ({ state, useSsrData, children }) {
  return <Suspense>
    <AsyncTruffleSetup state={state} useSsrData={useSsrData}>
      {children}
    </AsyncTruffleSetup>
    <script dangerouslySetInnerHTML={{
      __html: `window._truffleConfig = ${JSON.stringify(window._truffleConfig || clientConfig)}`
    }} />
  </Suspense>
}

function AsyncTruffleSetup ({ state, useSsrData, children }) {
  const host = state?.url?.host || window.location.host
  const domain = useSsrData('/domain', () => getDomainByDomainName(host))

  console.log('domain', domain);

  if (domain) {
    const context = globalContext.getStore()
    context.orgId = domain.orgId
    context.packageVersionId = domain.packageVersionId
  } else {
    const context = globalContext.getStore()
    context.orgId = 'f3da2460-de12-11ec-93d2-e9c00a37f9c9' // FIXME: rm
    console.error(`Error fetching domain from server (useSsrData) ${host}`)
  }

  return children
}

async function getDomainByDomainName (domainName) {
  const client = getClient()
  if (config.IS_DEV_ENV) {
    domainName = config.HOST
  }

  console.log('get', domainName, config.HOST)

  const domainResponse = await client
    .query(GET_DOMAIN_QUERY, { domainName, _skipAuth: true })
    .toPromise()
  const domain = domainResponse?.data?.domain

  console.log('got domain', domainName, domain, domainResponse?.error)

  if (!domain) {
    console.error(`Invalid page, ${domainName}`)
  }

  return domain || null
}
