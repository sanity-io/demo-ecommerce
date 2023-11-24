import groq from "groq";

import { PAGE } from "./fragments/pages/page";

export const PAGE_QUERY = groq`
  coalesce(
    *[
      _type == 'page'
      && slug.current == $slug
      && language == $language
    ][0],
    *[
      _type == 'page'
      && slug.current == $slug
      && (language == $baseLanguage || !defined(language))
    ][0]
  ) {
    ${PAGE}
  }
`;
