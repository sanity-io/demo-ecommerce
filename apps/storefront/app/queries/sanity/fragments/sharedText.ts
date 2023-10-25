import groq from "groq";

export const SHARED_TEXT = groq`
  "sharedText": *[_type == 'sharedText'][0] {
    "deliveryAndReturns": coalesce(deliveryAndReturns[_key == $language][0].value, deliveryAndReturns[_key == $baseLanguage][0].value)[]
  }
`;
