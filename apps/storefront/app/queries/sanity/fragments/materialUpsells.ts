import groq from "groq";

import { PRODUCT_WITH_VARIANT_FIELDS } from "./productWithVariantFields";

export const MATERIAL_UPSELLS = groq`
  {
    'all': *[_type == "product" && !store.isDeleted && store.status == 'active' && references(^.materialId)] {
      _id,
      "title": store.title,
      "productWithVariant": {
        ${PRODUCT_WITH_VARIANT_FIELDS},
        "variantPrice": coalesce(^.variant->store.price, store.variants[0]->store.price)
      },
      _updatedAt
    }
  }
  {
    'drafts': all[_id in path('drafts.**')],
    'published': all[!(_id in path('drafts.**'))]
  }
  {
    drafts,
    published,
    'both': published[('drafts.'+_id) in ^.drafts[]._id]{'published': @, 'draft': ^.drafts[_id == ('drafts.' + ^._id)][0]}
  }
  {
    'onlyDrafts': drafts[!(_id in ^.both[].draft._id)]{'draft': @},
    'onlyPublished': published[!(_id in ^.both[].published._id)]{'published': @},
    both
  }
  {
    'all': [...onlyDrafts, ...both, ...onlyPublished]{'latest': coalesce(draft, published)}[].latest | order(variantPrice desc, _updatedAt desc)
  }
  .all[0..2]
`;
