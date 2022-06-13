import React, { Suspense, useMemo } from 'react'

import { getModel } from 'https://tfl.dev/@truffle/api@0.0.1/legacy/index.js'

// TODO: config
// const API_URL = 'http://localhost:50330'
const API_URL = 'https://mycelium.staging.bio'
const PRODUCTION_DOMAIN = 'truffle.vip'

// only passing useAsync in vs importing directly because file is ts
export function TruffleSetup ({ state, useAsync, children }) {
  return <Suspense>
    <AsyncTruffleSetup state={state} useAsync={useAsync}>
      {children}
    </AsyncTruffleSetup>
  </Suspense>
}

function AsyncTruffleSetup ({ state, useAsync, children }) {
  const hostname = state?.url?.hostname
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
  if (globalThis?.Deno?.env.get('mode') === 'dev' || true) {
    domainName = `staging-dev.${PRODUCTION_DOMAIN}`
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
    throw new Error('Invalid page')
  }

  return domain || null
}

async function graphqlQuery ({ query, variables, orgId, accessToken }) {
  const response = await fetch(`${API_URL}/graphql`, {
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
