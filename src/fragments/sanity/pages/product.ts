import groq from 'groq';
import {COLOR_THEME} from '../colorTheme';
import {CUSTOM_PRODUCT_OPTIONS} from '../customProductOptions';
import {CREATOR} from '../creator';
import {PRODUCT_FAQS} from '../productFaqs';
import {MATERIAL} from '../material';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO_SHOPIFY} from '../seoShopify';
import {SHARED_TEXT} from '../sharedText';

export const PRODUCT_PAGE = groq`
  _id,
  "available": !store.isDeleted && store.status == 'active',
  "body": body[]{
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
  "customProductOptions": *[_type == 'settings'][0].customProductOptions[title in ^.store.options[].name] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  ${SHARED_TEXT},
`;
