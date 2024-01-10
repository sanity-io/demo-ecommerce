// From https://github.com/SimeonGriggs/sanity-remix-template/blob/main/app/sanity/projectDetails.ts#L64

// Enable stega on production deploys, but NOT the non-production domain
// Allow the production Studio to access non-production domains cross-origin

// Vercel provides multiple URLs for a single deployment:
// www.your-production-domain.com
// <git-repo-slug>-git-<branch>-<username>.vercel.app
// <git-repo-slug>-<sha>-<username>.vercel.app

// This is used to enable stega on any URL except this one
export const PRODUCTION_URL = "https://demo-ecommerce.sanity.build";

// With the logic below we enable stega only on the non-production domain
export function isStegaEnabled(url: string) {
  const { hostname } = new URL(url);
  return hostname !== new URL(PRODUCTION_URL).hostname;
}
