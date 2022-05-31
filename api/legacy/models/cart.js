import request from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/request.js'

export default class Cart {
  constructor ({ auth }) {
    this.auth = auth
  }

  // uses orgId and userId automatically
  getMe = () => {
    console.log('fetching cart')
    return this.auth.stream({
      query: `
        query CartByMe {
          cartByMe {
            id,
            orgId,
            userId,
            lastUpdateTime,
            cartItems {
              id,
              cartId,
              sourceType,
              sourceId,
              quantity,
              productVariant {
                id
                name
                color
                inStock
                size
                imageFileRels {
                  fileObj { cdn, prefix, ext, data }
                  key
                }
                priceCents
                productId
                sourceType
                sourceId
                product {
                  name
                }
              }
            }
          }
        }`,
      pull: 'cartByMe'
    }, { isErrorable: true })
  }

  upsert = async () => {
    const res = await this.auth.call({
      query: `
        mutation {
          cartUpsert {
            id
          }
        }
        `,
      pull: 'cartUpsert'
    }, { invalidateAll: true })

    return res
  }

  createShopifyCheckout = async ({ customAttributes } = {}) => {
    const res = await this.auth.call({
      query: `
        mutation {
          cartCheckout {
            storefrontAccessToken,
            shopUrl,
            lineItems {
              variantId
              quantity
            }
            customAttributes {
              key
              value
            }
          }
        }
        `,
      pull: 'cartCheckout'
    }, { invalidateAll: true })

    const checkout = await this.initializeShopifyCheckout({
      customAttributes: (res.customAttributes || []).concat(customAttributes || []),
      lineItems: res.lineItems
    }, res.storefrontAccessToken, res.shopUrl)

    return checkout
  }

  /**
 *  Note, the Shopify storefront API rate limits to 60 req/s so if somebody tries to spam
 * the create checkout mutation—we'll contain the rate limiting to the individual client
 * and prevent other connected clients from being effected by the Shopify rate limit
 *
 * @param {*} customAttributes [{ key: String, value: String }]
 * @param {*} lineItems [{ variantId: String, quantity: Int }]
 */
  initializeShopifyCheckout = async ({ customAttributes, lineItems }, accessToken, shopUrl) => {
    const storefrontApiUrl = getShopifyStorefrontGraphqlApiUrl(shopUrl)

    const shopifyCreateCheckoutQuery = `mutation ShopifyCheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id,
          webUrl
        }
      }
    }`

    const res = await request(storefrontApiUrl, {
      method: 'post',
      body: {
        query: shopifyCreateCheckoutQuery,
        variables: {
          input: {
            customAttributes, lineItems
          }
        }
      },
      headers: {
        'X-Shopify-Storefront-Access-Token': accessToken
      }
    })

    return res?.data?.checkoutCreate?.checkout
  }
}

const getShopifyStorefrontGraphqlApiUrl = (shopUrl) => `${shopUrl}/api/2021-10/graphql.json`
