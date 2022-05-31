export default class ProductVariant {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getAllByProductId = (id) => {
    return this.auth.stream({
      query: `
        query ProductVariantsGetByProductId($id: ID) {
          productVariantsByProductId(id: $id) {
            nodes {
              id
              name
              description
              color
              colorCode
              inStock
              size
              style
              productId
              priceCents
              sourceType
              sourceId
              sourceData {
                productId
                priceCents
              }
              imageFileRels {
                fileObj { cdn, prefix, ext, data, variations }
                key
              },
              printFileRel {
                fileObj { cdn, prefix, ext, data }
                areaWidth
                areaHeight
                width
                height
                top
                left
              }
            }
          }
        }`,
      variables: { id },
      pull: 'productVariantsByProductId'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query ProductVariantGetById($id: ID) {
          productVariant(id: $id) {
            id
            orgId
            slug
            name
            description
            color
            colorCode
            inStock
            size
            style
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
            priceCents
            productId
            sourceType
            sourceId
            sourceData {
              productId,
              priceCents
            }
          }
        }`,
      variables: { id },
      pull: 'productVariant'
    })
  }

  batchUpsert = async (productVariants) => {
    const query = `
      mutation ProductVariantBatchUpsert(
        $productVariants: JSON
      ) {
        productVariantBatchUpsert(
          productVariants: $productVariants
        )
      }`

    const variables = { productVariants }

    return this.auth.call({ query, variables }, { invalidateAll: true })
  }

  upsert = async ({
    id,
    name,
    description,
    color,
    colorCode,
    imageFileRels,
    inStock,
    notSupported,
    size,
    priceCents,
    productId,
    sourceType,
    sourceId,
    sourceProductId,
    sourceSyncProductId,
    sourceSyncProductVariantId,
    sourcePriceCents
  }, { file } = {}) => {
    const query = `
      mutation ProductVariantUpsert(
        $id: ID
        $name: String
        $description: String
        $color: String
        $colorCode: String
        $imageFileRels: JSON
        $inStock: Boolean
        $notSupported: Boolean
        $size: String
        $priceCents: Int
        $productId: ID
        $sourceType: String
        $sourceId: String
        $sourceProductId: String
        $sourceSyncProductId: String
        $sourceSyncProductVariantId: String
        $sourcePriceCents: Int
      ) {
        productVariantUpsert(
          id: $id,
          name: $name,
          description: $description,
          color: $color,
          colorCode: $colorCode,
          imageFileRels: $imageFileRels,
          inStock: $inStock,
          notSupported: $notSupported,
          size: $size,
          priceCents: $priceCents,
          productId: $productId,
          sourceType: $sourceType,
          sourceId: $sourceId,
          sourceProductId: $sourceProductId,
          sourceSyncProductId: $sourceSyncProductId,
          sourceSyncProductVariantId: $sourceSyncProductVariantId,
          sourcePriceCents: $sourcePriceCents
        )
          {
            id
          }
      }`

    const variables = {
      id,
      name,
      description,
      color,
      colorCode,
      imageFileRels,
      inStock,
      notSupported,
      size,
      priceCents,
      productId,
      sourceType,
      sourceId,
      sourceProductId,
      sourceSyncProductId,
      sourceSyncProductVariantId,
      sourcePriceCents
    }

    return this.auth.call({
      query, variables
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ProductVariantDeleteById($id: ID!) {
          productVariantDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'productVariantDeleteById'
    }, { invalidateAll: true })
  }
}
