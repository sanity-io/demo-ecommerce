import groq from "groq";

import { MARK_DEFS } from "./portableText/markDefs";

export const PRODUCT_FAQS = groq`
  "faqs": {
    "groups": array::compact(
      [
        ...faqs[] {
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
          faqs[] {
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
