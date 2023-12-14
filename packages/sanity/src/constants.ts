// Currency code (ISO 4217) to use when displaying prices in the studio
// https://en.wikipedia.org/wiki/ISO_4217
export const DEFAULT_CURRENCY_CODE = 'USD'

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'home', 'media.tag']

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
// - are from the Sanity Connect Shopify app - and can be linked to on Shopify
export const SHOPIFY_DOCUMENT_TYPES = ['product', 'productVariant', 'collection']

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  {type: 'collection'},
  {type: 'home'},
  {type: 'page'},
  {type: 'product'},
  {type: 'guide'},
  {type: 'article'},
  {type: 'landingPage'}
]

// API version to use when using the Sanity client within the studio
// https://www.sanity.io/help/studio-client-specify-api-version
export const SANITY_API_VERSION = '2022-10-25'

/**
 * Environment symbol to set on `window`
 */
export const ENVIRONMENT = Symbol('Sanity Environment')

export const LANGUAGES = [
  {id: 'en', title: 'English', icon: '🇬🇧', previewUrl: ''},
  {id: 'no', title: 'Norwegian', icon: '🇳🇴', previewUrl: 'no-no'},
]
