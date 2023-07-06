import groq from "groq";

import { PERSON_PAGE } from "./fragments/pages/person";

export const PERSON_QUERY = groq`
  *[
    _type == 'person'
    && slug.current == $slug
  ] | order(_updatedAt desc) {
    ${PERSON_PAGE}
  }[0]`;
