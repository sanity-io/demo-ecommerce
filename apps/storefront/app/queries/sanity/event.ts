import groq from "groq";

import { COLOR_THEME } from "./fragments/colorTheme";
import { MODULE_CALL_TO_ACTION } from "./fragments/modules/callToAction";

// Query for events with a title and slug
// and no date or a date in the future
// order firstly by events with no date
// then by dates with closer dates first
export const EVENT_INDEX_QUERY = groq`*[
  _type == "event" &&
  defined(slug.current) && 
  defined(title) &&
  (!defined(date) || date > now())
] 
  | score(!defined(date))
  | order(_score desc, date asc)
  [0...12] {
    ...,
    image {
      ...,
      asset->
    },
    colorTheme->{
      ${COLOR_THEME}
    },
    callToAction { 
      ${MODULE_CALL_TO_ACTION} 
    }
}`;

export const EVENT_PAGE_QUERY = groq`*[_type == "event" && slug.current == $slug][0]{
    ...,
    image {
      ...,
      asset->
    },
    colorTheme->{
      ${COLOR_THEME}
    },
    callToAction { 
      ${MODULE_CALL_TO_ACTION} 
    }
}`;
