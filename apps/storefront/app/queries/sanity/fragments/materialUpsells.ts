import groq from "groq";

import { PRODUCT_WITH_VARIANT_FIELDS } from "./productWithVariantFields";

export const MATERIAL_UPSELLS = groq`*[
    _type == 'product'
    && references(*[_type=="material" && _id in ^.^.composition[]->_id]._id)
    && !(_id in path("drafts.**"))
  ] {
    "productWithVariant": {
      ${PRODUCT_WITH_VARIANT_FIELDS},
      "variantPrice": coalesce(^.variant->store.price, store.variants[0]->store.price)
    }
  } | order(productWithVariant.variantPrice desc, _updatedAt desc)[0..2]`;
