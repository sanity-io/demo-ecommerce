import groq from 'groq';

export const PRODUCT_FAQS = groq`
  "faqs": {
    "groups": array::compact(
      [
        ...faqs[] {
          "title": question,
          "body": answer
        },
        ...composition[]->{
          faqs[] {
            "title": question,
            "body": answer
          }
        }.faqs[]
      ]
    )
  }
`;
