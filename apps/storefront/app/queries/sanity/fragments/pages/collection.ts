import groq from "groq";

import { COLOR_THEME } from "../colorTheme";
import { HERO_COLLECTION } from "../heroes/collection";
import { MODULES } from "../modules";
import { BANNER } from "../banner";
import { SEO_SHOPIFY } from "../seoShopify";

export const COLLECTION_PAGE = groq`
  _id,
  colorTheme->{
    ${COLOR_THEME}
  },
  (showHero == true) => {
    "hero": hero[_key == $language][0].value {
      ${HERO_COLLECTION}
    },
  },
  banner[] {
    ${BANNER}
  },
  ($language == "en") => {
    modules[] {
      ${MODULES}
    },
  },
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  "sortOrder": store.sortOrder,
  "title": store.title,
`;
