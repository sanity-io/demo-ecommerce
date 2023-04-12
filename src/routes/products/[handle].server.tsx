import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import groq from 'groq';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PortableText from '../../components/portableText/PortableText.server';
import Magazine from '../../components/product/Magazine.server';
import ProductDetails from '../../components/product/Details.client';
import AccessoryDetails from '../../components/product/AccessoryDetails.client';
import RelatedProducts from '../../components/product/RelatedProducts.server';
import {PRODUCT_PAGE} from '../../fragments/sanity/pages/product';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {
  ProductWithNodes,
  SanityFaqs,
  SanityProductPage,
} from '../../types';
import AccordionBlock from '../../components/portableText/blocks/Accordion.client';
import {PortableTextBlock} from '@sanity/types';

type ShopifyPayload = {
  product: Pick<
    Product,
    | 'handle'
    | 'id'
    | 'media'
    | 'options'
    | 'seo'
    | 'title'
    | 'variants'
    | 'vendor'
  >;
};

const SanityProductBody = (sanityProduct: SanityProductPage) => {
  return (
    <>
      {sanityProduct?.body && (
        <PortableText
          blocks={sanityProduct.body}
          colorTheme={sanityProduct?.colorTheme}
        />
      )}
    </>
  );
};

const SanityProductShipping = ({blocks}: {blocks: PortableTextBlock[]}) => {
  return (
    <>
      <h2
        className={clsx(
          'first:mt-0 last:mb-0', //
          'mb-6 mt-16 text-xl font-bold',
        )}
      >
        Shipping &amp; Returns
      </h2>
      <PortableText blocks={blocks} />
    </>
  );
};

const SanityProductFaqs = ({faqs}: {faqs: SanityFaqs}) => {
  return (
    <>
      <h2
        className={clsx(
          'first:mt-0 last:mb-0', //
          '-mb-6 mt-16 text-xl font-bold',
        )}
      >
        FAQs
      </h2>
      <AccordionBlock node={faqs} />
    </>
  );
};

export default function ProductRoute() {
  const {handle} = useRouteParams();

  const sanityParams = {slug: handle};

  // Fetch Sanity document
  const {data: sanityProduct} = useSanityQuery<SanityProductPage>({
    params: sanityParams,
    query: QUERY_SANITY,
  });

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;
  if (sanityProduct?.gid) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();

    const {
      data: {product},
    } = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: sanityProduct.gid,
        language: languageCode,
      },
    });
    storefrontProduct = product;
  }

  // Shopify analytics
  useServerAnalytics(
    storefrontProduct
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.product,
            resourceId: storefrontProduct.id,
          },
        }
      : null,
  );

  if (!sanityProduct || !storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityProduct.seo;

  const initialVariant = storefrontProduct.variants.nodes[0];

  return (
    <Layout>
      <div className="relative w-full">
        {storefrontProduct?.tags?.includes('Accessories') ? (
          <AccessoryDetails
            initialVariantId={initialVariant?.id}
            sanityProduct={sanityProduct}
            storefrontProduct={storefrontProduct}
          >
            <div
              className={clsx(
                'max-w-[660px] px-4 pb-24 pt-8', //
                'md:px-8',
              )}
            >
              {/* Body content */}
              <SanityProductBody {...sanityProduct} />

              {/* Shipping info */}
              {sanityProduct?.sharedText?.deliveryAndReturns && (
                <SanityProductShipping
                  blocks={sanityProduct?.sharedText?.deliveryAndReturns}
                />
              )}

              {/* FAQs */}
              {sanityProduct?.faqs?.groups.length > 0 && (
                <SanityProductFaqs faqs={sanityProduct.faqs} />
              )}
            </div>
          </AccessoryDetails>
        ) : (
          <>
            <ProductDetails
              initialVariantId={initialVariant?.id}
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
            />

            {/* Body content */}
            <div
              className={clsx(
                'w-full', //
                'lg:w-[calc(100%-315px)]',
                'mb-10 mt-8 p-5',
              )}
            >
              <div className="grid grid-cols-3 gap-10 md:grid-cols-4 lg:grid-cols-6">
                <div className="hidden xl:block" />
                <div className="col-span-6 xl:col-span-5">
                  {sanityProduct?.body && (
                    <SanityProductBody {...sanityProduct} />
                  )}
                </div>
              </div>
            </div>

            {/* Magazine features */}
            <Magazine
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
              creators={sanityProduct?.creators}
            />

            {/* Shipping info and FAQs */}
            <div
              className={clsx(
                'w-full', //
                'lg:w-[calc(100%-315px)]',
                'mb-10 mt-8 p-5',
              )}
            >
              <div className="mb-10 grid grid-cols-3 gap-10 md:grid-cols-4 lg:grid-cols-6">
                <div className="hidden aspect-square xl:block" />
                <div className="col-span-3 md:col-span-4 lg:col-span-3 xl:col-span-2">
                  {sanityProduct?.sharedText?.deliveryAndReturns && (
                    <SanityProductShipping
                      blocks={sanityProduct?.sharedText?.deliveryAndReturns}
                    />
                  )}
                </div>
                <div className="col-span-3 md:col-span-4 lg:col-span-3">
                  {sanityProduct?.faqs?.groups.length > 0 && (
                    <SanityProductFaqs faqs={sanityProduct.faqs} />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <RelatedProducts
        colorTheme={sanityProduct?.colorTheme}
        storefrontProduct={storefrontProduct}
      />

      <Seo
        data={{
          ...(sanitySeo.image
            ? {
                featuredImage: {
                  height: sanitySeo.image.height,
                  url: sanitySeo.image.url,
                  width: sanitySeo.image.width,
                },
              }
            : {}),
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="product"
      />
    </Layout>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ] | order(_updatedAt desc)[0]{
    ${PRODUCT_PAGE}
  }
`;

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product($country: CountryCode, $id: ID!, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      ...ProductFields
      media(first: 20) {
        nodes {
          ... on MediaImage {
            id
            image {
              altText
              height
              id
              url
              width
            }
            mediaContentType
          }
        }
      }
      variants(first: 250) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
