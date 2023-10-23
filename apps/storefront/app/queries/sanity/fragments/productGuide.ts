import groq from "groq";

import { MODULE_IMAGE } from "./modules/image";
import { PRODUCT_HOTSPOT } from "./productHotspot";

export const PRODUCT_GUIDE = groq`*[
    _type == 'guide'
    && references(^._id)
    && (
      ^._id in hero.content[0].productHotspots[].productWithVariant.product._ref
      ||
      ^._id in body[_type == "blockImages"].modules[].productHotspots[].productWithVariant.product._ref
    )
    && language == $language
  ] {
    title,
    "slug": "/guides/" + slug.current,
    "images": [
      ...hero.content[_type == "imageWithProductHotspots"] {
        ...,
        "variant": "productHotspots",
        productHotspots[] {
          _key,
          ${PRODUCT_HOTSPOT}
        }
      },
      ...@.body[_type == "blockImages"].modules[] {
        ${MODULE_IMAGE}
      }
    ]
  } [ count(images) > 1 ] | order(_updatedAt desc)[0]`;
