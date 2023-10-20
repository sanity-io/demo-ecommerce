import groq from "groq";

import { IMAGE } from "./image";
import { MARK_DEFS } from "./portableText/markDefs";

export const CREATOR = groq`
  _key,
  role,
  person->{
    name,
    "slug": "/people/" + slug.current,
    image {
      ${IMAGE}
    },
    "bio": coalesce(bio[_key == $language][0].value, bio[_key == $baseLanguage][0].value)[] {
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    }
  }
`;
