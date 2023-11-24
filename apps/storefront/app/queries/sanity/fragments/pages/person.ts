import groq from "groq";

import { PORTABLE_TEXT } from "../portableText/portableText";
import { PRODUCT_WITH_VARIANT_FIELDS } from "../productWithVariantFields";
import { SEO } from "../seo";

export const PERSON_PAGE = groq`
  name,
  image,
  "bio": bio[_key == $language][0].value[] {
    ${PORTABLE_TEXT}
  },
  ${SEO},
  "products": *[
    _type == 'product'
    && references(^._id)
    && ^.id in creators[].person._ref[]
    && !(_id in path("drafts.**"))
  ]{
    "productWithVariant": {
      ${PRODUCT_WITH_VARIANT_FIELDS}
    },
    "_type": "module.product",
    "_key": _id,
  } | order(_updatedAt desc)
`;
