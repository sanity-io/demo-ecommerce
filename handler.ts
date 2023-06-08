// Virtual entry point for the app
import * as remixBuild from "@remix-run/dev/server-build";
import { createStorefrontClient, storefrontRedirect } from "@shopify/hydrogen";
import { createSanityClient, PreviewSession } from "hydrogen-sanity";

import { getLocaleFromRequest } from "~/lib/utils";
import {
  createCookieSessionStorage,
  type Session,
  type SessionStorage,
} from "~/lib/vercel";
import { createRequestHandler, getStorefrontHeaders } from "~/lib/vercel";

export async function handler(
  request: Request,
  env: Env,
  executionContext: ExecutionContext
): Promise<Response> {
  try {
    /**
     * Open a cache instance in the worker and a custom session instance.
     */
    if (!env?.SESSION_SECRET) {
      throw new Error("SESSION_SECRET environment variable is not set");
    }

    const waitUntil = (p: Promise<any>) => executionContext.waitUntil(p);
    // eslint-disable-next-line prefer-const
    let [cache, session, previewSession] = await Promise.all([
      caches?.open("hydrogen"),
      HydrogenSession.init(request, [env.SESSION_SECRET]),
      PreviewSession.init(request, [env.SESSION_SECRET]),
    ]);

    // shim `Cache` when deployed in an environment that
    // doesn't implement `CacheStorage`
    if (cache == null) {
      cache = {
        add: async () => {},
        addAll: async () => {},
        delete: async () => true,
        keys: async () => [],
        match: async () => undefined,
        matchAll: async () => [],
        put: async () => {},
      };
    }

    /**
     * Create Hydrogen's Storefront client.
     */
    const { storefront } = createStorefrontClient({
      cache,
      waitUntil,
      i18n: getLocaleFromRequest(request),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || "2023-01",
      storefrontId: env.PUBLIC_STOREFRONT_ID,
      storefrontHeaders: getStorefrontHeaders(request),
    });

    const sanity = createSanityClient({
      cache,
      waitUntil,
      // Optionally, pass session and token to enable live-preview
      preview:
        env.SANITY_PREVIEW_SECRET && env.SANITY_API_TOKEN
          ? {
              session: previewSession,
              token: env.SANITY_API_TOKEN,
            }
          : undefined,
      // Pass configuration options for Sanity client
      config: {
        projectId: env.SANITY_PROJECT_ID,
        dataset: env.SANITY_DATASET,
        apiVersion: env.SANITY_API_VERSION ?? "2023-03-30",
        useCdn: process.env.NODE_ENV === "production",
      },
    });

    /**
     * Create a Remix request handler and pass
     * Hydrogen's Storefront client to the loader context.
     */
    const handleRequest = createRequestHandler({
      // @ts-expect-error incompatible types
      build: remixBuild,
      mode: process.env.NODE_ENV,
      getLoadContext: () => ({
        session,
        waitUntil,
        storefront,
        env,
        sanity,
      }),
    });

    const response = await handleRequest(request);

    if (response.status === 404) {
      /**
       * Check for redirects only when there's a 404 from the app.
       * If the redirect doesn't exist, then `storefrontRedirect`
       * will pass through the 404 response.
       */
      return storefrontRedirect({ request, response, storefront });
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
}

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
class HydrogenSession {
  constructor(
    private sessionStorage: SessionStorage,
    private session: Session
  ) {}

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: "session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get("Cookie"));

    return new this(storage, session);
  }

  get(key: string) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key: string, value: any) {
    this.session.flash(key, value);
  }

  unset(key: string) {
    this.session.unset(key);
  }

  set(key: string, value: any) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}