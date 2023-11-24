import groq from "groq";

import { COLOR_THEME } from "./fragments/colorTheme";

export const BADGES_QUERY = groq`
  *[_type == "badge" && $language in text[]._key]{
    _id,
    "text": text[_key==$language][0].value,
    mappingType,
    tag,
    colorTheme->{
      ${COLOR_THEME}
    },
  }
`;
