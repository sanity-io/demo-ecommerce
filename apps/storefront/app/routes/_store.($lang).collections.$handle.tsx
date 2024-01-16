import { useLoaderData, useSearchParams } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import { type Collection as CollectionType } from "@shopify/hydrogen/storefront-api-types";
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import invariant from "tiny-invariant";

import ProductGrid from "~/components/collection/ProductGrid";
import SortOrder from "~/components/collection/SortOrder";
import { SORT_OPTIONS } from "~/components/collection/SortOrder";
import { Label } from "~/components/global/Label";
import CollectionHero from "~/components/heroes/Collection";
import { type SanityCollectionPage, type SanityHeroHome } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { COLLECTION_PAGE_QUERY } from "~/queries/sanity/collection";
import { COLLECTION_QUERY } from "~/queries/shopify/collection";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.initial?.data?.seo?.title ?? data?.collection?.title,
  description:
    data?.initial?.data?.seo?.description ?? data?.collection?.description,
  media: data?.initial?.data?.seo?.image ?? data?.collection?.image,
});

export const handle = {
  seo,
};

export type SortParam =
  | "price-low-high"
  | "price-high-low"
  | "best-selling"
  | "newest"
  | "featured"
  | "title-a-z"
  | "title-z-a";

const PAGINATION_SIZE = 12;

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  const searchParams = new URL(request.url).searchParams;
  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get("sort") as SortParam
  );
  const cursor = searchParams.get("cursor");
  const count = searchParams.get("count");

  invariant(params.handle, "Missing collection handle");

  const query = COLLECTION_PAGE_QUERY;
  const queryParams = {
    slug: params.handle,
    language,
  };
  const [initial, { collection }] = await Promise.all([
    context.sanity.loader.loadQuery<SanityCollectionPage>(query, queryParams),
    context.storefront.query<{ collection: CollectionType }>(COLLECTION_QUERY, {
      variables: {
        handle,
        cursor,
        sortKey,
        reverse,
        count: count ? parseInt(count) : PAGINATION_SIZE,
      },
    }),
  ]);

  // Handle 404s
  if (!initial.data || !collection) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = await fetchGids({ page: initial.data, context });

  return json({
    initial,
    query,
    queryParams,
    collection,
    // Retrieved by useLoaderData() in useGids() for Image Hotspots
    gids,
    sortKey,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const { initial, query, queryParams, collection } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const [params] = useSearchParams();
  const sort = params.get("sort");

  const products = (collection as any).products.nodes;

  const { error, data: page } = useQuery(
    query,
    queryParams,
    // @ts-expect-error
    { initial }
  );

  if (error) {
    throw error;
  }

  return (
    <ColorTheme value={page?.colorTheme}>
      {/* Hero */}
      <CollectionHero
        fallbackTitle={collection?.title}
        hero={page?.hero as SanityHeroHome}
      />

      <div
        className={clsx(
          "mb-32 mt-8 px-4", //
          "md:px-8"
        )}
      >
        {products.length > 0 && (
          <div
            className={clsx(
              "mb-8 flex justify-start", //
              "md:justify-end"
            )}
          >
            <SortOrder key={page?._id} initialSortOrder={page?.sortOrder} />
          </div>
        )}

        {/* No results */}
        {products.length === 0 && (
          <div className="mt-16 text-center text-lg text-darkGray">
            <Label _key="collection.noResults" />
          </div>
        )}

        {(page?.modules || products.length > 0) && (
          <ProductGrid
            collection={collection as any}
            modules={page?.modules || []}
            url={`/collections/${(collection as any).handle}`}
            key={`${(collection as any).handle}-${sort}`}
          />
        )}
      </div>
    </ColorTheme>
  );
}

function getSortValuesFromParam(sortParam: SortParam | null) {
  const productSort = SORT_OPTIONS.find((option) => option.key === sortParam);

  return (
    productSort || {
      sortKey: null,
      reverse: false,
    }
  );
}
