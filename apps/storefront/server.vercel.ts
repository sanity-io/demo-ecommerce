import { handler } from "handler";

/**
 * Export a fetch handler in module format.
 */
export default function (request: Request): Promise<Response> {
  const env: Env = {
    SESSION_SECRET: process.env.SESSION_SECRET!,
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN!,
    PRIVATE_STOREFRONT_API_TOKEN: process.env.PRIVATE_STOREFRONT_API_TOKEN!,
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN!,
    PUBLIC_STOREFRONT_API_VERSION: process.env.PUBLIC_STOREFRONT_API_VERSION,
    PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID!,
    SANITY_PREVIEW_SECRET: process.env.SANITY_PREVIEW_SECRET!,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN!,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID!,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_API_VERSION: process.env.SANITY_API_VERSION,
  };

  const executionContext: ExecutionContext = {
    waitUntil: () => Promise.resolve(),
    // @ts-expect-error
    passThroughOnException: () => {},
  };

  return handler(request, env as Env, executionContext);
}
