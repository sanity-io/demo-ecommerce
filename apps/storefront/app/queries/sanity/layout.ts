import groq from "groq";

import { COLOR_THEME } from "./fragments/colorTheme";
import { LINKS } from "./fragments/links";
import { PORTABLE_TEXT } from "./fragments/portableText/portableText";

export const LAYOUT_QUERY = groq`
  *[_type == 'settings' && _id == 'settings-' + $language] | order(_updatedAt desc) [0] {
    seo,
    "menuLinks": menu.links[] {
      ${LINKS}
    },
    footer {
      links[] {
        ${LINKS}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
    notFoundPage {
      body,
      "collectionGid": collection->store.gid,
      colorTheme->{
        ${COLOR_THEME}
      },
      title
    },
    "labels": *[_type == 'sharedText' && _id == 'sharedText'][0] {
      labels[] {
        key,
        "text": coalesce(text[_key == $language][0].value, text[_key == $baseLanguage][0].value),
      }
    }.labels
  }
`;
