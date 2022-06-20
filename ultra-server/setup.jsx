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
  </Suspense>
}

function AsyncTruffleSetup ({ state, useAsync, children }) {
  // only use value if it's from Deno
  // useAsync gets run on server (to populate data) and client as fallback
  // TODO: Promise.resolve doesn't work for some reason
  const config = useAsync('/client-config', () => globalThis?.Deno ? new Promise((resolve) => setTimeout(() => resolve(clientConfig), 0)) : {})
  if (!Object.entries(config)?.length) {
    console.warn('Config from ssr not found')
  }
  // FIXME: this is called way too much if domain is null (invalid page error log) for some reason
  setConfig(config)
  globalThis?.Deno && setConfig(serverConfig)

  const hostname = state?.url?.hostname || window.location.hostname
  const domain = useAsync('/domain', () => getDomainByDomainName(hostname))
  console.log('domain', domain)
  if (domain) { // FIXME: figure out why this is sometimes null / errors on server
    const context = globalContext.getStore()
    context.orgId = domain.orgId
    context.packageVersionId = domain.packageVersionId
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

  console.log('got domain', domain)

  if (!domain) {
    console.error(`Invalid page, ${domainName}`)
  }

  return domain || null
}
