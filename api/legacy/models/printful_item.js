export default class PrintfulItem {
  constructor ({ auth }) {
    this.auth = auth
  }

  getById (id) {
    return this.auth.stream({
      query: `
        query PrintfulItemGetById($id: Int) {
          printfulItem(id: $id) {
            product {
              id,
              type,
              type_name,
              brand,
              model,
              image,
              variant_count,
              currency,
              is_discontinued,
              avg_fulfillment_time,
              description
            }
            variants {
              id,
              product_id,
              name,
              size,
              color,
              color_code,
              color_code2,
              image,
              price,
              in_stock,
              availability_status {
                region,
                status
              }
            }
          }
        }`,
      variables: { id },
      pull: 'printfulItem'
    })
  }

  getVariantLayoutsById (id) {
    return this.auth.stream({
      query: `
      query PrintfulItemVariationLayoutsGetById($id: Int) {
        printfulItemVariationLayouts(id: $id) {
          variant_id,
          front_template_id,
          template_id,
          image_url,
          background_url,
          background_color,
          printfile_id,
          template_width,
          template_height,
          print_area_width,
          print_area_height,
          print_area_top,
          print_area_left,
          is_template_on_front,
          orientation
        }
      }`,
      variables: { id },
      pull: 'printfulItemVariationLayouts'
    })
  }
}
