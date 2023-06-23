import groq from "groq";

import { PERSON_PAGE, PERSON_PAGE_PRODUCTS } from "./fragments/pages/person";

export const PERSON_QUERY = groq`
  *[
    _type == 'person'
    && slug.current == $slug
  ] | order(_updatedAt desc)[0] {
    ${PERSON_PAGE}
  } {
    ...,
    "products": ${PERSON_PAGE_PRODUCTS}
  }
`;
