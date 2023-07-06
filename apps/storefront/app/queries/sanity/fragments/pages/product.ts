import groq from "groq";

import { COLOR_THEME } from "../colorTheme";
import { CREATOR } from "../creator";
import { CUSTOM_PRODUCT_OPTIONS } from "../customProductOptions";
import { MATERIAL } from "../material";
import { MATERIAL_UPSELLS } from "../materialUpsells";
import { PORTABLE_TEXT } from "../portableText/portableText";
import { PRODUCT_FAQS } from "../productFaqs";
import { PRODUCT_GUIDE } from "../productGuide";
import { SEO_SHOPIFY } from "../seoShopify";
import { SHARED_TEXT } from "../sharedText";

export const PRODUCT_PAGE = groq`
  _id,
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
  ${PRODUCT_FAQS},
  "guide": ${PRODUCT_GUIDE},
  "materialUpsells": ${MATERIAL_UPSELLS},
  "customProductOptions": *[_type == 'settings'][0].customProductOptions[title in ^.store.options[].name] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  ${SHARED_TEXT},
`;
