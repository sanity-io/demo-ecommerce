import groq from "groq";

import { COLOR_THEME } from "./fragments/colorTheme";
import { MODULE_CALL_TO_ACTION } from "./fragments/modules/callToAction";

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
