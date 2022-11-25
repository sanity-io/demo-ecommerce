import groq from 'groq';
import {COLOR_THEME} from '../colorTheme';
import {CUSTOM_PRODUCT_OPTIONS} from '../customProductOptions';
import {CREATOR} from '../creator';
import {MATERIAL} from '../material';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO_SHOPIFY} from '../seoShopify';

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
  "customProductOptions": *[_type == 'settings'][0].customProductOptions[title in ^.store.options[].name] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  "sharedText": *[_type == 'settings'][0] {
    deliveryAndReturns,
    deliverySummary,
    environmentallyFriendly
  },
`;
