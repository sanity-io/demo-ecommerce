import groq from "groq";

import { PAGE } from "./fragments/pages/page";

export const ARTICLE_QUERY = groq`
  *[
    _type == 'article'
    && slug.current == $slug
    && language == $language
  ] | order(_updatedAt desc) [0]{
    ${PAGE}
    creators->
  }
`;
