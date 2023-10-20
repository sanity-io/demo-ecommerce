import groq from "groq";

import { MARK_DEFS } from "./portableText/markDefs";

export const PRODUCT_FAQS = groq`
  "faqs": {
    "groups": array::compact(
      [
        ...coalesce(faqs[_key == $language][0].value, faqs[_key == $baseLanguage][0].value)[] {
          _key,
          "title": question,
          "body": answer[] {
            ...,
            markDefs[] {
              ${MARK_DEFS}
            }
          }
        },
        ...composition[]->{
          "faqs": coalesce(faqs[_key == $language][0].value, faqs[_key == $baseLanguage][0].value)[] {
            _key,
            "title": question,
            "body": answer[] {
              ...,
              markDefs[] {
                ${MARK_DEFS}
              }
            }
          }
        }.faqs[]
      ]
    )
  }
`;
