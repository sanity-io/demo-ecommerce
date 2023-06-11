import type { PortableTextBlock } from "@portabletext/types";
import { Await, useLoaderData, useParams } from "@remix-run/react";
import {
  flattenConnection,
  type SeoConfig,
  type SeoHandleFunction,
  ShopifyAnalyticsProduct,
} from "@shopify/hydrogen";
import type {
  MediaConnection,
  MediaImage,
  Product,
  ProductVariant,
  SelectedOptionInput,
} from "@shopify/hydrogen/storefront-api-types";
import { AnalyticsPageType } from "@shopify/hydrogen-react";
import { defer, type LoaderArgs } from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import AccordionBlock from "~/components/portableText/blocks/Accordion";
import PortableText from "~/components/portableText/PortableText";
import ProductDetails from "~/components/product/Details";
import Magazine from "~/components/product/Magazine";
import RelatedProducts from "~/components/product/RelatedProducts";
import type { SanityFaqs, SanityProductPage } from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PRODUCT_PAGE_QUERY } from "~/queries/sanity/product";
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
} from "~/queries/shopify/product";

const seo: SeoHandleFunction = ({ data }) => {
  const media = flattenConnection<MediaConnection>(data.product?.media).find(
    (media) => media.mediaContentType === "IMAGE"
  ) as MediaImage | undefined;

  return {
    title:
      data?.page?.seo?.title ??
      data?.product?.seo?.title ??
      data?.product?.title,
    media: data?.page?.seo?.image ?? media?.image,
    description:
      data?.page?.seo?.description ??
      data?.product?.seo?.description ??
      data?.product?.description,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      brand: data?.product?.vendor,
      name: data?.product?.title,
    },
  } satisfies SeoConfig<Product>;
};

export const handle = {
  seo,
};

export async function loader({ params, context, request }: LoaderArgs) {
  validateLocale({ context, params });

  const { handle } = params;
  invariant(handle, "Missing handle param, check route filename");

  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: SelectedOptionInput[] = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({ name, value });
  });

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, { product }] = await Promise.all([
    context.sanity.query<SanityProductPage>({
      query: PRODUCT_PAGE_QUERY,
      params: {
        slug: params.handle,
      },
      cache,
    }),
    context.storefront.query<{
      product: Product & { selectedVariant?: ProductVariant };
    }>(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
      },
    }),
  ]);

  if (!page || !product?.id) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  // Get recommended products from Shopify
  const recommended = context.storefront.query<{
    product: Product & { selectedVariant?: ProductVariant };
  }>(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {
      productId: product.id,
    },
  });

  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  return defer({
    page,
    product,
    gids,
    selectedVariant,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
  });
}

export default function ProductHandle() {
  const { page, product, selectedVariant, analytics, recommended, gids } =
    useLoaderData();
  const { handle } = useParams();

  return (
    <SanityPreview
      data={page}
      query={PRODUCT_PAGE_QUERY}
      params={{ slug: handle }}
    >
      {(page) => (
        <ColorTheme value={page.colorTheme}>
          <div className="relative w-full">
            <ProductDetails
              selectedVariant={selectedVariant}
              sanityProduct={page}
              storefrontProduct={product}
              analytics={analytics}
            />
            <Suspense>
              <Await resolve={gids}>
                {/* Body */}
                {page?.body && (
                  <div
                    className={clsx(
                      "w-full", //
                      "lg:w-[calc(100%-315px)]",
                      "mb-10 mt-8 p-5"
                    )}
                  >
                    <div className="grid grid-cols-3 gap-10 md:grid-cols-4 lg:grid-cols-6">
                      <div className="hidden xl:block" />
                      <div className="col-span-6 xl:col-span-5">
                        <PortableText blocks={page.body} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Magazine */}
                <Magazine page={page} product={product} />

                {/* Shipping info and FAQs */}
                <div
                  className={clsx(
                    "w-full", //
                    "lg:w-[calc(100%-315px)]",
                    "mb-10 mt-8 p-5"
                  )}
                >
                  <div className="mb-10 grid grid-cols-3 gap-10 md:grid-cols-4 lg:grid-cols-6">
                    <div className="hidden aspect-square xl:block" />
                    <div className="col-span-3 md:col-span-4 lg:col-span-3 xl:col-span-2">
                      {page?.sharedText?.deliveryAndReturns && (
                        <SanityProductShipping
                          blocks={page?.sharedText?.deliveryAndReturns}
                        />
                      )}
                    </div>
                    <div className="col-span-3 md:col-span-4 lg:col-span-3">
                      {page?.faqs?.groups.length > 0 && (
                        <SanityProductFaqs faqs={page.faqs} />
                      )}
                    </div>
                  </div>
                </div>
              </Await>
            </Suspense>
          </div>

          {/* Related products */}
          <Suspense>
            <Await
              errorElement="There was a problem loading related products"
              resolve={recommended}
            >
              {(products) => (
                <RelatedProducts
                  relatedProducts={products.productRecommendations}
                />
              )}
            </Await>
          </Suspense>
        </ColorTheme>
      )}
    </SanityPreview>
  );
}

const SanityProductShipping = ({ blocks }: { blocks: PortableTextBlock[] }) => {
  return (
    <>
      <h2
        className={clsx(
          "first:mt-0 last:mb-0", //
          "mb-6 mt-16 text-xl font-bold"
        )}
      >
        Shipping &amp; Returns
      </h2>
      <PortableText blocks={blocks} />
    </>
  );
};

const SanityProductFaqs = ({ faqs }: { faqs: SanityFaqs }) => {
  return (
    <>
      <h2
        className={clsx(
          "first:mt-0 last:mb-0", //
          "-mb-6 mt-16 text-xl font-bold"
        )}
      >
        FAQs
      </h2>
      <AccordionBlock value={faqs} />
    </>
  );
};
