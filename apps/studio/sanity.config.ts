import {defineSanityConfig} from '@demo-ecommerce/sanity'


// See `isStegaEnabled.ts` for more details
const domain =
  typeof document === "undefined"
    ? process.env.VERCEL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : "http://localhost:3000" // TODO: Switch to env variable
    : "http://localhost:3000"; // TODO: Switch to env variable


export default defineSanityConfig({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  preview: {
    domain,
    secret: process.env.SANITY_STUDIO_PREVIEW_SECRET,
  },
  shopify: {
    storeDomain: process.env.SANITY_STUDIO_SHOPIFY_STORE_DOMAIN!,
  },
})
