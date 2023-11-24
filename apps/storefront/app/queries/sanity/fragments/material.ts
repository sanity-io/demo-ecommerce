import groq from "groq";

import { MARK_DEFS } from "./portableText/markDefs";

export const MATERIAL = groq`
  _key,
  'material': @->{
    _id,
    "name": coalesce(name[_key == $language][0].value, name[_key == $baseLanguage][0].value),
    attributes,
    "story": coalesce(story[_key == $language][0].value, story[_key == $baseLanguage][0].value)[] {
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    }
  }
`;
