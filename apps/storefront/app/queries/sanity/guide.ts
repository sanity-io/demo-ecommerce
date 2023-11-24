import groq from "groq";

import { PAGE } from "./fragments/pages/page";

export const GUIDE_QUERY = groq`
  *[
    _type == 'guide'
    && slug.current == $slug
    && language == $language
  ] | order(_updatedAt desc) [0]{
    ${PAGE}
  }
`;
