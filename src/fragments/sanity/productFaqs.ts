import groq from 'groq';

export const PRODUCT_FAQS = groq`
  "faqs": {
    "groups": array::compact(
      [
        ...faqs[] {
          _key,
          "title": question,
          "body": answer
        },
        ...composition[]->{
          faqs[] {
            _key,
            "title": question,
            "body": answer
          }
        }.faqs[]
      ]
    )
  }
`;
