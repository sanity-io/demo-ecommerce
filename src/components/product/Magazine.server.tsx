// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import groq from 'groq';
import clsx from 'clsx';
import {
  SanityCreator,
  ProductWithNodes,
  SanityProductPage,
  SanityGuideProducts,
} from '../../types';
import {MODULE_IMAGE} from '../../fragments/sanity/modules/image';
import {PRODUCT_HOTSPOT} from '../../fragments/sanity/productHotspot';
import useSanityQuery from '../../hooks/useSanityQuery';
import Creator from './Creator.server';
import Guide from './Guide.server';
import Composition from './Composition.server';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: ProductWithNodes;
  creators?: SanityCreator[];
};

export default function Magazine({
  storefrontProduct,
  sanityProduct,
  creators = [],
}: Props) {
  const compositionStories =
    sanityProduct?.composition &&
    sanityProduct?.composition.filter(
      (block) => block?.material?.story ?? false,
    );

  // Get the guides for this product - make sure we use the non-draft ID
  const isDraft = sanityProduct._id.startsWith('drafts.');
  const id = isDraft ? sanityProduct._id.slice(7) : sanityProduct._id;
  const {data: productGuide} = useSanityQuery<SanityGuideProducts>({
    params: {
      sanityId: id,
    },
    query: QUERY_SANITY,
  });

  return (
    <>
      {((creators && creators.length > 0) ||
        productGuide ||
        compositionStories) && (
        <div
          className={clsx(
            'w-full', //
            'lg:w-[calc(100%-315px)]',
            'mb-10 p-5',
          )}
        >
          {creators.map((creator) => (
            <Creator
              storefrontProduct={storefrontProduct}
              creator={creator}
              key={creator._key}
            />
          ))}

          {productGuide && <Guide productGuide={productGuide} />}

          {compositionStories && compositionStories.length > 0 && (
            <Composition
              sanityProduct={sanityProduct}
              compositionStories={compositionStories}
            />
          )}
        </div>
      )}
    </>
  );
}

// Query to get any guides that include the product in the hotspots
const QUERY_SANITY = groq`
  *[
    _type == 'guide'
    && references($sanityId)
    && (
      $sanityId in hero.content[0].productHotspots[].productWithVariant.product._ref
      ||
      $sanityId in body[_type == "blockImages"].modules[].productHotspots[].productWithVariant.product._ref
    )
  ] {
    title,
    "slug": "/guides/" + slug.current,
    "images": [
      ...hero.content[_type == "imageWithProductHotspots"] {
        ...,
        "variant": "productHotspots",
        productHotspots[] {
          _key,
          ${PRODUCT_HOTSPOT}
        }
      },
      ...@.body[_type == "blockImages"].modules[] {
        ${MODULE_IMAGE}
      }
    ]
  } [ count(images) > 1 ] | order(_updatedAt desc)[0]
`;
