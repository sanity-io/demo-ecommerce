import groq from "groq";

import { HERO_HOME } from "../heroes/home";
import { MODULES } from "../modules";
import { BANNER } from "../banner";
import { SEO } from "../seo";

export const HOME_PAGE = groq`
  hero {
    ${HERO_HOME}
  },
  banner[] {
    ${BANNER}
  },
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;
