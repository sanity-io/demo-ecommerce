import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import {
  Seo,
  type SeoHandleFunction,
  ShopifySalesChannel,
} from "@shopify/hydrogen";
import type {
  Cart,
  Collection,
  Shop,
} from "@shopify/hydrogen/storefront-api-types";
import {
  type AppLoadContext,
  defer,
  type LoaderArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";

import { GenericError } from "~/components/global/GenericError";
import { Layout } from "~/components/global/Layout";
import { NotFound } from "~/components/global/NotFound";
import { useAnalytics } from "~/hooks/useAnalytics";
import { useNonce } from "~/lib/nonce";
import { DEFAULT_LOCALE } from "~/lib/utils";
import { LAYOUT_QUERY } from "~/queries/sanity/layout";
import { CART_QUERY } from "~/queries/shopify/cart";
import { COLLECTION_QUERY_ID } from "~/queries/shopify/collection";
import type { I18nLocale } from "~/types/shopify";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.layout?.seo?.title,
  titleTemplate: `%s${
    data?.layout?.seo?.title ? ` · ${data?.layout?.seo?.title}` : ""
  }`,
  description: data?.layout?.seo?.description,
});

export const handle = {
  seo,
};

export async function loader({ context }: LoaderArgs) {
  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [cartId, shop, layout] = await Promise.all([
    context.session.get("cartId"),
    context.storefront.query<{ shop: Shop }>(SHOP_QUERY),
    context.sanity.query<any>({ query: LAYOUT_QUERY, cache }),
  ]);

  const selectedLocale = context.storefront.i18n as I18nLocale;

  return defer({
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
    cart: cartId ? getCart(context, cartId) : undefined,
    layout,
    notFoundCollection: layout?.notFoundPage?.collectionGid
      ? context.storefront.query<{ collection: Collection }>(
          COLLECTION_QUERY_ID,
          {
            variables: {
              id: layout.notFoundPage.collectionGid,
              count: 16,
            },
          }
        )
      : undefined,
    sanityProjectID: context.env.SANITY_PROJECT_ID,
    sanityDataset: context.env.SANITY_DATASET || "production",
    selectedLocale,
    storeDomain: context.storefront.getShopifyDomain(),
  });
}

export default function App() {
  const data = useLoaderData<SerializeFrom<typeof loader>>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;
  const nonce = useNonce();

  useAnalytics(hasUserConsent, locale);

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet key={`${locale.language}-${locale.country}`} />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const [root] = useMatches();
  const nonce = useNonce();

  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  const {
    selectedLocale: locale,
    layout,
    notFoundCollection,
  } = root.data
    ? root.data
    : { selectedLocale: DEFAULT_LOCALE, layout: null, notFoundCollection: {} };
  const { notFoundPage } = layout || {};

  let title = "Error";
  if (isRouteError) {
    title = "Not found";
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

const SHOP_QUERY = `#graphql
  query layout {
    shop {
      id
      name
      description
    }
  }
`;

async function getCart({ storefront }: AppLoadContext, cartId: string) {
  if (!storefront) {
    throw new Error("missing storefront client in cart query");
  }

  const { cart } = await storefront.query<{ cart?: Cart }>(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}
