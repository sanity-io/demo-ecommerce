declare namespace NodeJS {
  export interface ProcessEnv {
    SANITY_STUDIO_PROJECT_ID: string
    SANITY_STUDIO_DATASET?: string
    SANITY_STUDIO_API_VERSION?: string
    SANITY_STUDIO_PREVIEW_DOMAIN?: string
    SANITY_STUDIO_PREVIEW_SECRET: string
    SANITY_STUDIO_SHOPIFY_STORE_DOMAIN: string
  }
}
