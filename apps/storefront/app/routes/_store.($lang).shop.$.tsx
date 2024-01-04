import { Await, useLoaderData, useSearchParams } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import { type Product as ProductType } from "@shopify/hydrogen/storefront-api-types";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { Suspense } from "react";

import { SORT_OPTIONS } from "~/components/collection/SortOrder";
import Filter, { cleanString } from "~/components/Filter";
import { Label } from "~/components/global/Label";
import CollectionHero from "~/components/heroes/Collection";
import ProductCard from "~/components/product/Card";
import { loader as queryStore, SanityShopPage } from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { notFound, validateLocale } from "~/lib/utils";
import { SHOP_PAGE_QUERY } from "~/queries/sanity/shop";
import { ALL_PRODUCTS } from "~/queries/shopify/product";
import { ProductWithNodes } from "~/types/shopify";
const { useQuery } = queryStore;

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.data?.seo?.title ?? data?.page.filterEditorial?.title,
  description:
    data?.page?.data?.seo?.description ??
    data?.page.filterEditorial?.description,
  media: data?.page?.data?.seo?.image ?? data?.page.filterEditorial?.image,
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

  const searchParams = new URL(request.url).searchParams;
  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get("sort") as SortParam
  );
  const cursor = searchParams.get("cursor");
  const count = searchParams.get("count");

  const queryParams = {
    language,
    // TODO: Shouldn't this be dynamic?
    baseLanguage: "en",
    material: searchParams.get("material") ?? null,
    person: searchParams.get("person") ?? null,
  };

  const [page, { products }] = await Promise.all([
    context.sanity.loader.loadQuery<SanityShopPage>(
      SHOP_PAGE_QUERY,
      queryParams,
      {
        perspective: "previewDrafts",
      }
    ),
    context.storefront.query<{
      products: {
        edges: {
          // TODO: No idea if this type is right, feels wrong
          node: ProductType;
        }[];
      };
    }>(ALL_PRODUCTS, {
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
  if (!page.data || !products) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  // const gids = fetchGids({ page: page.data.products, context });

  return defer({
    queryParams,
    page,
    products,

    // TODO: What is this?
    gids: [],
    sortKey,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      // TODO: What is this?
      // resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const { queryParams, gids, ...data } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const [params] = useSearchParams();
  const sort = params.get("sort");

  const shopifyProducts = data.products.edges.map(({ node }) => node);

  const { error, data: page } = useQuery<SanityShopPage>(
    SHOP_PAGE_QUERY,
    queryParams,
    // @ts-expect-error
    { initial: data.page }
  );

  if (error) {
    throw error;
  } else if (!page) {
    return null;
  }

  const { filterEditorial, products, materials, people } = page;

  const fallbackTitle = ["All products"];

  if (params.get("material")) {
    const material = materials.find((m) => m.slug === params.get("material"));
    if (material?.name) {
      fallbackTitle.push(`made of ${cleanString(material.name)}`);
    }
  }
  if (params.get("person")) {
    const person = people.find((p) => p.slug === params.get("person"));
    if (person?.name) {
      fallbackTitle.push(`created by ${cleanString(person.name)}`);
    }
  }

  // TODO: This is not good, I'm returning way too many Shopify products
  // just to find the ones that came back from the Sanity filtered query
  const filteredProducts = products
    .map((p) => shopifyProducts.find((sp) => sp.id === p.gid))
    .filter(Boolean) as ProductType[];

  return (
    <ColorTheme value={filterEditorial?.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* Hero */}
          <CollectionHero
            fallbackTitle={fallbackTitle.join(` `)}
            hero={filterEditorial}
          />

          <div
            className={clsx(
              "mb-32 mt-8 px-4", //
              "md:px-8"
            )}
          >
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <section className="grid w-full grid-cols-2 flex-col gap-4 md:w-1/4 md:grid-cols-1 md:gap-8">
                <h2 className="col-span-2 text-xl font-bold md:col-span-1">
                  Filters
                </h2>
                {Array.isArray(materials) && materials.length > 0 ? (
                  <Filter filterKey="material" values={materials} />
                ) : null}
                {Array.isArray(people) && people.length > 0 ? (
                  <Filter filterKey="person" values={people} />
                ) : null}
              </section>

              <section className="grid w-full grid-cols-2 gap-x-4 gap-y-12 md:w-3/4 md:grid-cols-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.handle}
                      storefrontProduct={product}
                    />
                  ))
                ) : (
                  <div className="mt-16 text-center text-lg text-darkGray">
                    <Label _key="collection.noResults" />
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* {products.length > 0 && (
              <div
                className={clsx(
                  "mb-8 flex justify-start", //
                  "md:justify-end"
                )}
              >
                <SortOrder key={page?._id} initialSortOrder={page?.sortOrder} />
              </div>
            )} */}
        </Await>
      </Suspense>
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
