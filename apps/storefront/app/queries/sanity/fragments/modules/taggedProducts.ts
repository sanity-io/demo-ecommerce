import groq from "groq";

import { PRODUCT_WITH_VARIANT_FIELDS } from "../productWithVariantFields";

export const MODULE_TAGGED_PRODUCTS = groq`
  tag,
  layout,
  number,
  "products": *[
    _type == "product" && ^.tag in string::split(store.tags,',')
  ] | order(_createdAt desc) {
    "productWithVariant": {
      ${PRODUCT_WITH_VARIANT_FIELDS}
    }
  } [0..3]
`;
