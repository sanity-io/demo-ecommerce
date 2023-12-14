import type { PortableTextBlock } from "@portabletext/types";
import { Await, useLoaderData, useParams } from "@remix-run/react";
import type { ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import {
  flattenConnection,
  getSelectedProductOptions,
  type SeoConfig,
  type SeoHandleFunction,
  ShopifyAnalyticsProduct,
} from "@shopify/hydrogen";
import type {
  MediaConnection,
  MediaImage,
  Product,
  ProductOption,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import { AnalyticsPageType } from "@shopify/hydrogen-react";
import {
  defer,
  type LoaderFunctionArgs,
  redirect,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import { Label } from "~/components/global/Label";
import AccordionBlock from "~/components/portableText/blocks/Accordion";
import PortableText from "~/components/portableText/PortableText";
import ProductDetails from "~/components/product/Details";
import Magazine from "~/components/product/Magazine";
import RelatedProducts from "~/components/product/RelatedProducts";
import { baseLanguage } from "~/data/countries";
import type { SanityFaqs, SanityProductPage } from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PRODUCT_PAGE_QUERY } from "~/queries/sanity/product";
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from "~/queries/shopify/product";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => {
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

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  invariant(handle, "Missing handle param, check route filename");

  const selectedOptions = getSelectedProductOptions(request);

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
        language,
        baseLanguage,
      },
      cache,
    }),
    context.storefront.query<{
      product: Product & {
        selectedVariant?: ProductVariant;
        translatedOptions?: ProductOption[];
      };
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

  if (!product.selectedVariant) {
    return redirectToFirstVariant({ product, request });
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  // In order to show which variants are available in the UI, we need to query
  // all of them. We defer this query so that it doesn't block the page.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle,
    },
  });

  // Get recommended products from Shopify
  const recommended = context.storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {
      productId: product.id,
    },
  });

  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  return defer({
    language,
    page,
    product,
    variants,
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

function redirectToFirstVariant({
  product,
  request,
}: {
  product: Product;
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams();
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  throw redirect(`${url.pathname}?${searchParams.toString()}`, 302);
}

export default function ProductHandle() {
  const {
    language,
    page,
    product,
    variants,
    selectedVariant,
    analytics,
    recommended,
    gids,
  } = useLoaderData<typeof loader>();
  const { handle } = useParams();

  return (
    <SanityPreview
      data={page}
      query={PRODUCT_PAGE_QUERY}
      params={{ slug: handle, language, baseLanguage }}
    >
      {(page) => (
        <ColorTheme value={page?.colorTheme}>
          <div className="relative top-20 w-full">
            <Suspense
              fallback={
                <ProductDetails
                  selectedVariant={selectedVariant}
                  sanityProduct={page as SanityProductPage}
                  storefrontProduct={product}
                  storefrontVariants={[]}
                  analytics={analytics as ShopifyAnalyticsPayload}
                />
              }
            >
              <Await
                errorElement="There was a problem loading related products"
                resolve={variants}
              >
                {(resp) => (
                  <ProductDetails
                    selectedVariant={selectedVariant}
                    sanityProduct={page as SanityProductPage}
                    storefrontProduct={product}
                    storefrontVariants={resp.product?.variants.nodes || []}
                    analytics={analytics as ShopifyAnalyticsPayload}
                  />
                )}
              </Await>
            </Suspense>

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
                <Magazine page={page as SanityProductPage} product={product} />

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
                      {page?.faqs?.groups && page?.faqs?.groups.length > 0 && (
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
        <Label _key="shipping.shippingReturns" />
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
        <Label _key="faqs.title" />
      </h2>
      <AccordionBlock value={faqs} />
    </>
  );
};
