export default class Domain {
  constructor ({ auth, org }) {
    this.auth = auth
    this.org = org
  }

  getByDomainName = (domainName) => {
    // skip auth (this is used to get orgSlug, etc... which auth depends on)
    return this.auth.stream({
      query: `
        query DomainByDomainName($domainName: String) {
          domain(domainName: $domainName) {
            orgId
            packageVersionId
            org { slug }
          }
        }`,
      variables: { domainName },
      pull: 'domain',
      skipAuth: true
    })
  }

  getAllSearchDomainsByDomainNameQueryStr = (domainNameQueryStr, options = {}) => {
    const { limit, isAvailable } = options
    return this.auth.stream({
      query: `
        query SearchDomainsGetAllByDomainNameQueryStr(
          $domainNameQueryStr: String
          $limit: Int
          $isAvailable: Boolean
        ) {
          searchDomains(domainNameQueryStr: $domainNameQueryStr, limit: $limit, isAvailable: $isAvailable) {
            nodes {
              domainName, priceCents, isAvailable
            }
          }
        }`,
      variables: { domainNameQueryStr, limit, isAvailable },
      pull: 'searchDomains'
    })
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query DomainGetAll {
          domainConnection { nodes { domainName, isRegisteredElsewhere } }
        }`,
      // variables: {},
      pull: 'domainConnection'
    })
  }

  bring = async ({ domainName }) => {
    const res = await this.auth.call({
      query: `
        mutation DomainBring($domainName: String) {
          domainBring(domainName: $domainName)
        }`,
      variables: {
        domainName
      },
      pull: 'domainBring'
    }, { invalidateAll: false }) // done separately

    this.org.invalidateGetMeThenAll()

    return res
  }

  purchase = async (options) => {
    const {
      domainName, amountCents, stripeTokenId, name, address1, address2,
      city, state, country, email, phone
    } = options

    const res = await this.auth.call({
      query: `
        mutation DomainPurchase(
          $domainName: String
          $amountCents: Int
          $stripeTokenId: String
          $name: String
          $address1: String
          $address2: String
          $city: String
          $state: String
          $country: String
          $email: String
          $phone: String
        ) {
          domainPurchase(
            domainName: $domainName
            amountCents: $amountCents
            stripeTokenId: $stripeTokenId
            name: $name
            address1: $address1
            address2: $address2
            city: $city
            state: $state
            country: $country
            email: $email
            phone: $phone
          )
        }`,
      variables: {
        domainName,
        amountCents,
        stripeTokenId,
        name,
        address1,
        address2,
        city,
        state,
        country,
        email,
        phone
      },
      pull: 'domainPurchase'
    }, { invalidateAll: false }) // done separately

    this.org.invalidateGetMeThenAll()

    return res
  }
}
