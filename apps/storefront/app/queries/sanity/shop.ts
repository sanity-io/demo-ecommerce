import groq from "groq";

import { COLOR_THEME } from "./fragments/colorTheme";

export const SHOP_PAGE_QUERY = groq`
  {
    "filterEditorial": *[
      _type == "filter"
      // If the param is defined AND this document contains a reference for that param, look for a match
      // Otherwise disregard
      && select(defined(material) && defined($material) => $material == material->slug.current, false)
      && select(defined(person) && defined($person) => $person == person->slug.current, false)
    ][0]{
      "title": coalesce(title[_key == $language][0].value, title[_key == $baseLanguage][0].value),
      "description": coalesce(description[_key == $language][0].value, description[_key == $baseLanguage][0].value),
      colorTheme->{
        ${COLOR_THEME}
      },
    },
    "products": *[
      _type == "product"
       && defined(store.slug.current)
       && defined(store.gid)
       && select(defined($material) => $material in composition[]->slug.current, true)
       && select(defined($person) => $person in creators[].person->slug.current, true)
       && select(defined($color) => $color in store.options[_key == "Color"].values[], true)
    ]{
      "gid": store.gid,
    },
    "materials": *[
      _type == "material"
      && defined(slug.current)
    ]{
      _id,
      "name": coalesce(name[_key == $language][0].value, name[_key == $baseLanguage][0].value),
      "slug": slug.current
    } | order(name asc),
    "people": *[
      _type == "person"
      && defined(slug.current)
    ]{
      _id,
      name,
      "slug": slug.current
    } | order(name asc),
    "colors": array::unique(*[_type == "product"].store.options[_key == "Color"].values[]),
  }
`;
