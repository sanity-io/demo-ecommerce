import groq from "groq";

import { COLOR_THEME } from "./colorTheme";
import { IMAGE } from "./image";

export const COLLECTION = groq`
  _id,
  _type,
  colorTheme->{
    ${COLOR_THEME}
  },
  "gid": store.gid,
  "slug": "/collections/" + store.slug.current,
  "title": store.title,
  "vector": vector.asset->url,
  //"image": collectionImage.asset->url,
  collectionImage {
      ${IMAGE}
    },
`;
