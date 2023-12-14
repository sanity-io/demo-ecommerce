import type {
  FilteredResponseQueryOptions,
  InitializedClientConfig,
  QueryParams,
  RawQueryResponse,
  ResponseQueryOptions,
  SanityClient,
  UnfilteredResponseQueryOptions,
} from "@sanity/client";
import type {
  InitializedClientStegaConfig,
  SanityStegaClient,
} from "@sanity/client/stega";
import { createQueryStore } from "@sanity/react-loader";
import { CacheLong, createWithCache } from "@shopify/hydrogen";

import { createSanityEnvironment, SanityEnvironment } from "./environment";

/** @see https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/cache#caching-strategies */
type CachingStrategy = ReturnType<typeof CacheLong>;

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
}

interface RequestInit {
  hydrogen?: {
    cache?: CachingStrategy;
  };
}

type HydrogenResponseQueryOptions = Omit<
  ResponseQueryOptions<"hydrogen">,
  "next" | "cache"
> & {
  hydrogen?: "hydrogen" extends keyof RequestInit
    ? RequestInit["hydrogen"]
    : never;
};

type EnvironmentOptions = {
  /**
   * A Cache API instance.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
   */
  cache: Cache;
  /**
   * A runtime utility for serverless environments
   * @see https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#waituntil
   */
  waitUntil: ExecutionContext["waitUntil"];
};

type QueryStore = ReturnType<typeof createQueryStore>;
type SanityOverlayProviderOptions = {
  client: SanityStegaClient;
  loader: QueryStore;
} & EnvironmentOptions;
type SanityClientProviderOptions = {
  client: SanityClient;
} & EnvironmentOptions;
type SanityProviderOptions =
  | SanityOverlayProviderOptions
  | SanityClientProviderOptions;

// TODO: narrow the return value based on the options passed in
export function createSanityProvider(
  options: SanityProviderOptions
): SanityContext {
  const { client, cache, waitUntil } = options;
  const withCache = createWithCache({
    cache,
    waitUntil,
  });

  const clientConfig = client.config();
  const { projectId, dataset, apiVersion } = clientConfig;

  const environment: SanityEnvironment = {
    projectId: projectId!,
    dataset: dataset!,
    apiVersion,
  };

  const { SanityProvider } = createSanityEnvironment(environment);

  if ("loader" in options) {
    // if (!(client instanceof SanityStegaClient)) {
    //   throw new Error("If using loaders, the client must be a stega client");
    // }
    const { loader } = options;
    // Run on each invocation of the handler!
    if (!globalThis.didSetClient) {
      loader.setServerClient(client);
      globalThis.didSetClient = true;
    }
  }

  // TODO: should this be enforced?
  // if (client instanceof SanityStegaClient) {
  //   throw new Error("Stega client must be used with a loader");
  // }

  return {
    // @ts-expect-error
    client,
    cache,
    // @ts-expect-error
    loader: options?.loader,
    SanityProvider,
    ...environment,
  };
}

/**
 * Checks whether stega is enabled on the configuration passed in
 */
function isStegaEnabled(
  config: InitializedClientConfig | InitializedClientStegaConfig
): config is InitializedClientStegaConfig {
  return "stega" in config && config.stega?.enabled;
}

/**
 * Create an SHA-256 hash as a hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
async function sha256(message: string): Promise<string> {
  // encode as UTF-8
  const messageBuffer = await new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);

  // convert bytes to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hash query and its parameters for use as cache key
 * NOTE: Oxygen deployment will break if the cache key is long or contains `\n`
 */
function hashQuery(query: string, params: QueryParams): Promise<string> {
  let hash = query;

  if (params !== null) {
    hash += JSON.stringify(params);
  }

  return sha256(hash);
}

export type SanityContext = {
  loader: QueryStore;
  cache: Cache;
  client: Omit<SanityClient, "fetch"> & {
    /**
     * Perform a GROQ-query against the configured dataset.
     *
     * @param query - GROQ-query to perform
     */
    fetch<R = any>(query: string): Promise<R>;
    /**
     * Perform a GROQ-query against the configured dataset.
     *
     * @param query - GROQ-query to perform
     * @param params - Optional query parameters
     */
    fetch<R = any, Q = QueryParams>(query: string, params: Q): Promise<R>;
    /**
     * Perform a GROQ-query against the configured dataset.
     *
     * @param query - GROQ-query to perform
     * @param params - Optional query parameters
     * @param options - Request options
     */
    fetch<R = any, Q = QueryParams>(
      query: string,
      params: Q | undefined,
      options: FilteredResponseQueryOptions & HydrogenResponseQueryOptions
    ): Promise<R>;
    /**
     * Perform a GROQ-query against the configured dataset.
     *
     * @param query - GROQ-query to perform
     * @param params - Optional query parameters
     * @param options - Request options
     */
    fetch<R = any, Q = QueryParams>(
      query: string,
      params: Q | undefined,
      options: UnfilteredResponseQueryOptions & HydrogenResponseQueryOptions
    ): Promise<RawQueryResponse<R>>;
  };
  SanityProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => React.FunctionComponentElement<
    React.ProviderProps<SanityEnvironment | null>
  >;
} & SanityEnvironment;
