import groq from "groq";

import { PAGE } from "./fragments/pages/page";

export const LANDINGPAGE_QUERY = groq`
  *[
    _type == 'landingPage'
    && slug.current == $slug
    && language == $language
  ] | order(_updatedAt desc) [0]{
    ${PAGE}
    creators->
  }
`;
