import {
  isRouteErrorResponse,
  Links,
  LiveReload,
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
import { useNonce } from "@shopify/hydrogen";
import type { Collection, Shop } from "@shopify/hydrogen/storefront-api-types";
import {
  defer,
  type LoaderFunctionArgs,
  type MetaFunction,
  type SerializeFrom,
} from "@shopify/remix-oxygen";

import { GenericError } from "~/components/global/GenericError";
import { Layout } from "~/components/global/Layout";
import { NotFound } from "~/components/global/NotFound";
import { DEFAULT_LOCALE } from "~/lib/utils";
import { LAYOUT_QUERY } from "~/queries/sanity/layout";
import { COLLECTION_QUERY_ID } from "~/queries/shopify/collection";

import { baseLanguage } from "./data/countries";
import { useAnalytics } from "./hooks/useAnalytics";
import {
  loader as queryStore,
  Sanity,
  SanityLayout,
  stegaFilter,
  VisualEditing,
} from "./lib/sanity";
const { useQuery } = queryStore;

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

export async function loader({ context }: LoaderFunctionArgs) {
  const { cart, storefront, sanity } = context;

  const selectedLocale = storefront.i18n;
  const language = selectedLocale.language.toLowerCase();

  const [shop, layout] = await Promise.all([
    storefront.query<{ shop: Shop }>(SHOP_QUERY),
    sanity.loader.loadQuery<SanityLayout>(
      LAYOUT_QUERY,
      {
        language,
        baseLanguage,
      },
      {
        perspective: "previewDrafts",
      }
    ),
  ]);

  return defer({
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
    cart: cart.get(),
    layout,
    notFoundCollection: layout?.data.notFoundPage?.collectionGid
      ? context.storefront.query<{ collection: Collection }>(
          COLLECTION_QUERY_ID,
          {
            variables: {
              id: layout.data.notFoundPage.collectionGid,
              count: 16,
            },
          }
        )
      : undefined,
    selectedLocale,
    storeDomain: storefront.getShopifyDomain(),
  });
}

export default function App() {
  const data = useLoaderData<SerializeFrom<typeof loader>>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
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
        <Outlet key={`${locale.language}-${locale.country}`} />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
        <Sanity nonce={nonce} />
        <VisualEditing filter={stegaFilter} />
      </body>
    </html>
  );
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  const data = root?.data as SerializeFrom<typeof loader>;

  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const language = locale.language.toLowerCase();
  const {
    error,
    loading,
    data: layout,
  } = useQuery(
    LAYOUT_QUERY,
    { language, baseLanguage },
    { initial: data.layout }
  );

  if (error) {
    throw error;
  }

  // TODO: Remove this once we have a better way to handle this
  return loading
    ? { ...data, layout: data.layout.data }
    : {
        ...data,
        layout,
      };
};

export function ErrorBoundary({ error }: { error: Error }) {
  const nonce = useNonce();

  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  const rootData = useRootLoaderData();

  const {
    selectedLocale: locale,
    layout,
    notFoundCollection,
  } = rootData
    ? rootData
    : {
        selectedLocale: DEFAULT_LOCALE,
        layout: null,
        notFoundCollection: undefined,
      };
  const { notFoundPage } = layout || {};

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
        <VisualEditing filter={stegaFilter} />
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
