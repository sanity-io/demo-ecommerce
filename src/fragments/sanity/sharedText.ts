import groq from 'groq';

export const SHARED_TEXT = groq`
  "sharedText": *[_type == 'settings'][0] {
    deliveryAndReturns,
    deliverySummary,
    environmentallyFriendly
  }
`;
