import groq from "groq";

import { MATERIAL_UPSELLS } from "./fragments/materialUpsells";
import { PRODUCT_PAGE } from "./fragments/pages/product";
import { PRODUCT_GUIDE } from "./fragments/productGuide";

export const PRODUCT_PAGE_QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${PRODUCT_PAGE}
  } {
    ...,
    "guide": ${PRODUCT_GUIDE},
    "materialUpsells": ${MATERIAL_UPSELLS},
  }
`;
