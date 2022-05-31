export default class Product {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query CacheableProductsWithProductVariants {
          products {
            nodes {
              id, # required for clearing entire query cache
              orgId,
              slug,
              name,
              description,
              priceCents,
              rank,
              productVariants { # if you change this name to productVariantConnection, update zygote cache.js categories too
                nodes {
                  id, # required for clearing entire query cache
                  # name,
                  # description,
                  color,
                  # colorCode,
                  inStock,
                  size,
                  style,
                  # productId,
                  priceCents,
                  compareAtPriceCents,
                  # sourceType,
                  # sourceId,
                  # sourceData { productId, priceCents }
                  imageFileRels {
                    fileObj { cdn, prefix, ext, data, variations }
                    key
                  },
                  # printFileRel {
                  #  fileObj { cdn, prefix, ext, data },
                  #  areaWidth,
                  #  areaHeight,
                  #  width,
                  #  height,
                  #  top,
                  #  left
                  # }
                }
              },
              imageFileRels { fileObj { cdn, prefix, data, variations, ext } }
              sourceType,
              sourceId,
              priceRange {
                maxPriceCents,
                minPriceCents
              }
            }
          }
        }`,
      pull: 'products'
    })
  }

  getAllAdmin = () => {
    return this.auth.stream({
      query: `
        query ProductsWithProductVariantsAdmin {
          products {
            nodes {
              id, # required for clearing entire query cache
              orgId,
              slug,
              name,
              description,
              priceCents,
              rank
              productVariants { # if you change this name to productVariantConnection, update zygote cache.js categories too
                nodes {
                  id, # required for clearing entire query cache
                  name,
                  description,
                  color,
                  colorCode,
                  inStock,
                  size,
                  style,
                  productId,
                  priceCents,
                  sourceType,
                  sourceId,
                  sourceData {
                    productId,
                    priceCents
                  }
                  imageFileRels {
                    fileObj { cdn, prefix, ext, data, variations }
                    key
                  },
                  printFileRel {
                    fileObj { cdn, prefix, ext, data },
                    areaWidth,
                    areaHeight,
                    width,
                    height,
                    top,
                    left
                  }
                }
              },
              imageFileRels { fileObj { cdn, prefix, data, variations, ext } }
              sourceType,
              sourceId,
              priceRange {
                maxPriceCents,
                minPriceCents
              }
            }
          }
        }`,
      pull: 'products'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query ProductsGetById($id: ID) {
          product(id: $id) {
            id,
            orgId,
            slug,
            name,
            description,
            priceCents,
            sourceId,
            rank,
            imageFileRels { fileObj { cdn, prefix, ext, data, variations } }
            printFileRel {
              fileObj { cdn, prefix, ext, data },
              areaWidth,
              areaHeight,
              width,
              height,
              top,
              left
            }
            priceRange {
              maxPriceCents,
              minPriceCents
            }
          }
        }`,
      variables: { id },
      pull: 'product'
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ProductsDeleteById($id: ID!) {
          productDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'productDeleteById'
    }, { invalidateAll: true })
  }

  upsert = async ({
    id,
    name,
    description,
    priceCents,
    sourceType = 'printful',
    sourceId,
    imageUrl,
    imageFileRels,
    areaWidth,
    areaHeight,
    width,
    height,
    top,
    left,
    minDpi,
    printWidthIn,
    printHeightIn,
    rank
  }, { file } = {}) => {
    const query = `
      mutation ProductUpsert(
        $id: ID
        $name: String
        $description: String
        $priceCents: Int
        $sourceType: String
        $sourceId: String
        $imageUrl: String
        $imageFileRels: [JSON]
        $areaWidth: Float
        $areaHeight: Float
        $width: Float
        $height: Float
        $top: Float
        $left: Float
        $minDpi: Int
        $printWidthIn: Int
        $printHeightIn: Int,
        $rank: Int,
      ) {
        productUpsert(
          id: $id,
          name: $name,
          description: $description,
          priceCents: $priceCents,
          sourceType: $sourceType,
          sourceId: $sourceId,
          imageUrl: $imageUrl,
          imageFileRels: $imageFileRels,
          areaWidth: $areaWidth,
          areaHeight: $areaHeight,
          width: $width,
          height: $height,
          top: $top,
          left: $left,
          minDpi: $minDpi,
          printWidthIn: $printWidthIn,
          printHeightIn: $printHeightIn,
          rank: $rank,
        ) { id }
      }`
    const variables = {
      id,
      name,
      description,
      priceCents,
      sourceType,
      sourceId,
      imageUrl,
      imageFileRels,
      areaWidth,
      areaHeight,
      width,
      height,
      top,
      left,
      minDpi,
      printWidthIn,
      printHeightIn,
      rank
    }
    if (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response = await this.proxy(this.apiUrl + '/upload', {
        method: 'POST',
        query: {
          graphqlQuery: query,
          variables: JSON.stringify(variables)
        },
        body: formData
      })
      setTimeout(this.graphqlClient.invalidateAll, 0)
      return response
    } else {
      return this.auth.call({
        query, variables
      }, { invalidateAll: true })
    }
  }

  batchUpsert = async (products) => {
    const query = `
      mutation ProductBatchUpsert(
        $products: JSON
      ) {
        productBatchUpsert(
          products: $products
        )
      }`

    const variables = { products }
    return this.auth.call({ query, variables }, { invalidateAll: true })
  }

  productPublish = async ({ id }) => {
    return this.auth.call({
      query: `
        mutation ProductPublish($id: ID!) {
          productPublish(id: $id)
        }
      `,
      variables: { id },
      pull: 'productPublish'
    }, { invalidateAll: true })
  }

  generateMockups = async ({ id, url }) => {
    return this.auth.call({
      query: `
        mutation ProductsGenerateMockups($id: ID!, $url: String) {
          productVariantsGenerateMockups(id: $id, url: $url)
        }`,
      variables: { id, url },
      pull: 'productVariantsGenerateMockups'
    }, { invalidateAll: true })
  }
}
