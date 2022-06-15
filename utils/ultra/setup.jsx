import React, { Suspense, useMemo } from 'react'

import { getModel } from 'https://tfl.dev/@truffle/api@0.0.1/legacy/index.js'
import config, { setConfig } from '../config/config.js'

// NOTE: this gets injected into dom for client, so DO NOT put anything secret in here!!!
console.log('client', globalThis?.Deno?.env.get('ULTRA_MODE'))
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

// only passing useAsync in vs importing directly because file is ts
export function TruffleSetup ({ state, useAsync, children }) {
  return <Suspense>
    <AsyncTruffleSetup state={state} useAsync={useAsync}>
      {children}
    </AsyncTruffleSetup>
  </Suspense>
}

function AsyncTruffleSetup ({ state, useAsync, children }) {
  // only use value if it's from Deno
  // useAsync gets run on server (to populate data) and client as fallback
  const config = useAsync('/client-config', () => globalThis?.Deno ? Promise.resolve(clientConfig) : {})
  if (!Object.entries(config)?.length) {
    console.warn('Config from ssr not found')
  }
  // FIXME: this is called way too much if domain is null (invalid page error log) for some reason
  setConfig(config)
  globalThis?.Deno && setConfig(serverConfig)

  const hostname = state?.url?.hostname || window.location.hostname
  const domain = useAsync('/domain', () => getDomainByDomainName(hostname))
  state.domain = domain

  useTruffleSetup({ domain })

  return children
}

function useTruffleSetup ({ domain } = {}) {
  useMemo(() => {
    if (domain) {
      const siteInfo = {
        packageVersionId: domain.packageVersionId,
        orgId: domain.orgId
      }

      getModel().auth.setSiteInfo(siteInfo)
    }
  }, [Boolean(domain)])
}

async function getDomainByDomainName (domainName) {
  console.log('setup isdev', config, domainName)
  if (config.IS_DEV_ENV) {
    domainName = `staging-dev.${config.HOSTNAME}`
  }

  const domainResponse = await graphqlQuery({
    query: `query DomainByDomainName($domainName: String) {
      domain(domainName: $domainName) {
        orgId
        packageVersionId
        org { slug }
      }
    }`,
    variables: { domainName }
  })
  const domain = domainResponse?.data?.domain

  if (!domain) {
    console.error(`Invalid page, ${domainName}`)
  }

  return domain || null
}

async function graphqlQuery ({ query, variables, orgId, accessToken }) {
  const response = await fetch(`${config.API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'X-Access-Token': accessToken || '',
      'X-Org-Id': orgId || ''
    }, // Avoid CORS preflight
    body: JSON.stringify({ query, variables })
  })

  return response.json()
}
