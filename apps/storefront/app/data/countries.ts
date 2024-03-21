import { Localizations } from "~/types/shopify";

export const countries: Localizations = {
  default: {
    language: "EN",
    country: "US",
    label: "United States (USD $)",
    currency: "USD",
  },
  "/en-au": {
    language: "EN",
    country: "AU",
    label: "Australia (AUD $)",
    currency: "AUD",
  },
  "/en-gb": {
    language: "EN",
    country: "GB",
    label: "UK (GBP £)",
    currency: "GBP",
  },
  "/no-no": {
    language: "NO",
    country: "NO",
    label: "Norway (NOK kr)",
    currency: "NOK",
  },
  // "/de-de": {
  //   language: "DE",
  //   country: "DE",
  //   label: "Germany (EUR €)",
  //   currency: "EUR",
  // },
  // "/fr-fr": {
  //   language: "FR",
  //   country: "FR",
  //   label: "France (EUR €)",
  //   currency: "EUR",
  // },
  // "/es-es": {
  //   language: "ES",
  //   country: "ES",
  //   label: "Spain (EUR €)",
  //   currency: "EUR",
  // },
  // "/it-it": {
  //   language: "IT",
  //   country: "IT",
  //   label: "Italy (EUR €)",
  //   currency: "EUR",
  // },
  // "/pt-pt": {
  //   language: "PT",
  //   country: "PT",
  //   label: "Portugal (EUR €)",
  //   currency: "EUR",
  // },
  // "/nl-nl": {
  //   language: "NL",
  //   country: "NL",
  //   label: "Netherlands (EUR €)",
  //   currency: "EUR",
  // },
  // "/sv-se": {
  //   language: "SV",
  //   country: "SE",
  //   label: "Sweden (SEK kr)",
  //   currency: "SEK",
  // },
  // "/fi-fi": {
  //   language: "FI",
  //   country: "FI",
  //   label: "Finland (EUR €)",
  //   currency: "EUR",
  // },
  // "/da-dk": {
  //   language: "DA",
  //   country: "DK",
  //   label: "Denmark (DKK kr)",
  //   currency: "DKK",
  // },
  // "/pl-pl": {
  //   language: "PL",
  //   country: "PL",
  //   label: "Poland (PLN zł)",
  //   currency: "PLN",
  // },
};

export const baseLanguage = countries.default.language.toLowerCase();
