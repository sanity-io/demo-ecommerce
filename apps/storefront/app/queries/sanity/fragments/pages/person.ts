import groq from "groq";

import { PORTABLE_TEXT } from "../portableText/portableText";
import { PRODUCT_WITH_VARIANT_FIELDS } from "../productWithVariantFields";
import { SEO } from "../seo";

export const PERSON_PAGE = groq`
  name,
  image,
  bio[]{
    ${PORTABLE_TEXT}
  },
  ${SEO},
  "personId": coalesce(
    string::split(_id, "drafts.")[1],
    string::split(_id, "drafts.")[0]
  ),
`;

export const PERSON_PAGE_PRODUCTS = groq`
  {
    'all': *[_type == "product" && !store.isDeleted && store.status == 'active' && ^.personId in creators[].person._ref] {
      _id,
      "title": store.title,
      "productWithVariant": {
        ${PRODUCT_WITH_VARIANT_FIELDS}
      },
      "_type": "module.product",
      "_key": _id,
    } | order(title asc)
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
    'all': [...onlyDrafts, ...both, ...onlyPublished]{'latest': coalesce(draft, published)}[].latest
  }
  .all
`;
