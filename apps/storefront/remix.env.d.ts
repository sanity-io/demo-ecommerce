/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { HydrogenCart } from "@shopify/hydrogen";

import type { SanityContext } from "~/lib/sanity";
import type { Storefront } from "~/types/shopify";

import type { HydrogenSession } from "handler";

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  // @ts-expect-error
  const process: { env: { NODE_ENV: "production" | "development" } & Env };

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION?: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    SANITY_PROJECT_ID: string;
    SANITY_DATASET?: string;
    SANITY_API_VERSION?: string;
    SANITY_API_TOKEN: string;
    SANITY_PREVIEW_SECRET: string;
  }
}

/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.ts`.
 */
declare module "@shopify/remix-oxygen" {
  export interface AppLoadContext {
    session: HydrogenSession;
    waitUntil: ExecutionContext["waitUntil"];
    storefront: Storefront;
    cart: HydrogenCart;
    env: Env;
    sanity: SanityContext;
  }
}
