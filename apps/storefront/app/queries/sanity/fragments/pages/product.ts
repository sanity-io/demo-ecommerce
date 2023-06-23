import groq from "groq";

import { COLOR_THEME } from "../colorTheme";
import { CREATOR } from "../creator";
import { CUSTOM_PRODUCT_OPTIONS } from "../customProductOptions";
import { MATERIAL } from "../material";
import { PORTABLE_TEXT } from "../portableText/portableText";
import { PRODUCT_FAQS } from "../productFaqs";
import { SEO_SHOPIFY } from "../seoShopify";
import { SHARED_TEXT } from "../sharedText";

export const PRODUCT_PAGE = groq`
  _id,
  "productId": coalesce(
    string::split(_id, "drafts.")[1],
    string::split(_id, "drafts.")[0]
  ),
  "available": !store.isDeleted && store.status == 'active',
  body[]{
    ${PORTABLE_TEXT}
  },
  colorTheme->{
    ${COLOR_THEME}
  },
  creators[]{
    ${CREATOR}
  },
  composition[]{
    ${MATERIAL}
  },
  "materialId": composition[0]._ref,
  ${PRODUCT_FAQS},
  "customProductOptions": *[_type == 'settings'][0].customProductOptions[title in ^.store.options[].name] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  ${SHARED_TEXT},
`;
