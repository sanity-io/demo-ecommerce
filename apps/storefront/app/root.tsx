import { STUDIO_PATH } from "@demo-ecommerce/sanity/src/constants";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import {
  Seo,
  type SeoHandleFunction,
  ShopifySalesChannel,
} from "@shopify/hydrogen";
import { useNonce } from "@shopify/hydrogen";
import type { Collection, Shop } from "@shopify/hydrogen/storefront-api-types";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import { lazy, Suspense } from "react";

import { GenericError } from "~/components/global/GenericError";
import { Layout } from "~/components/global/Layout";
import { NotFound } from "~/components/global/NotFound";
import { DEFAULT_LOCALE } from "~/lib/utils";
import { LAYOUT_QUERY } from "~/queries/sanity/layout";
import { COLLECTION_QUERY_ID } from "~/queries/shopify/collection";

import { baseLanguage } from "./data/countries";
import { useAnalytics } from "./hooks/useAnalytics";
import { LayoutContext } from "./hooks/useLayoutContext";
import { isStegaEnabled } from "./lib/isStegaEnabled";
import { Sanity, SanityLayout } from "./lib/sanity";

const VisualEditing = lazy(() => import("./lib/sanity/VisualEditing"));

export const meta: MetaFunction = () => [
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1",
  },
];

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.layout?.data?.seo?.title,
  titleTemplate: `%s${
    data?.layout?.data?.seo?.title ? ` · ${data?.layout?.data?.seo?.title}` : ""
  }`,
  description: data?.layout?.data?.seo?.description,
});

export const handle = {
  seo,
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { cart, storefront, sanity } = context;

  const isStudioRoute = new URL(request.url).pathname.startsWith(STUDIO_PATH);
  // TODO: Check this from context.sanity.client.config().stega.enabled
  // Type of initialized client in TS makes this complicated currently
  const stegaEnabled = isStegaEnabled(request.url);
  const visualEditingEnabled = stegaEnabled && !isStudioRoute;

  const selectedLocale = storefront.i18n;
  const language = selectedLocale.language.toLowerCase();

  const query = LAYOUT_QUERY;
  const queryParams = {
    language,
    baseLanguage,
  };
  const [shop, initial] = await Promise.all([
    storefront.query<{ shop: Shop }>(SHOP_QUERY),
    sanity.loader.loadQuery<SanityLayout>(query, queryParams),
  ]);

  return json({
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
    cart: await cart.get(),
    initial,
    query,
    queryParams,
    notFoundCollection: initial?.data.notFoundPage?.collectionGid
      ? context.storefront.query<{ collection: Collection }>(
          COLLECTION_QUERY_ID,
          {
            variables: {
              id: initial.data.notFoundPage.collectionGid,
              count: 16,
            },
          }
        )
      : undefined,
    locale: selectedLocale ?? DEFAULT_LOCALE,
    storeDomain: storefront.getShopifyDomain(),
    visualEditingEnabled,
    isStudioRoute,
  });
}

export default function App() {
  const {
    initial,
    query,
    queryParams,
    visualEditingEnabled,
    isStudioRoute,
    locale,
  } = useLoaderData<SerializeFrom<typeof loader>>();
  const hasUserConsent = true;
  const nonce = useNonce();

  useAnalytics(hasUserConsent);

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        {isStudioRoute ? (
          <Outlet key={`${locale.language}-${locale.country}`} />
        ) : (
          <LayoutContext.Provider
            value={{
              initial: {
                ...initial,
                // Satisfy TS
                sourceMap: initial.sourceMap || undefined,
              },
              query,
              queryParams,
            }}
          >
            <Outlet key={`${locale.language}-${locale.country}`} />
          </LayoutContext.Provider>
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
        <Sanity nonce={nonce} />
        {visualEditingEnabled ? (
          <Suspense>
            <VisualEditing />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const nonce = useNonce();

  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  // TODO: Restore dynamic values form useLoaderData()
  const locale = DEFAULT_LOCALE;
  const notFoundCollection = undefined;
  const layout = { notFoundPage: undefined };
  const { notFoundPage } = layout;

  let title = "Error";
  if (isRouteError) {
    title = "Not found";
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout
          key={`${locale.language}-${locale.country}`}
          backgroundColor={notFoundPage?.colorTheme?.background}
        >
          {isRouteError ? (
            <>
              {routeError.status === 404 ? (
                <NotFound
                  notFoundPage={notFoundPage}
                  notFoundCollection={notFoundCollection}
                />
              ) : (
                <GenericError
                  error={{ message: `${routeError.status} ${routeError.data}` }}
                />
              )}
            </>
          ) : (
            <GenericError error={error instanceof Error ? error : undefined} />
          )}
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
        <Sanity nonce={nonce} />
      </body>
    </html>
  );
}

const SHOP_QUERY = `#graphql
  query layout($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      shop {
        id
        name
        description
      }
    }
`;
