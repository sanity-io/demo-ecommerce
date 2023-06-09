import groq from "groq";

import { PRODUCT_WITH_VARIANT_FIELDS } from "./productWithVariantFields";

export const PRODUCT_WITH_VARIANT = groq`
  product->{
    ${PRODUCT_WITH_VARIANT_FIELDS}
  }
`;
