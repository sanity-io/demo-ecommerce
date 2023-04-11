import groq from 'groq';
import {
  SanityComposition,
  SanityModuleProduct,
  SanityProductPage,
} from '../../types';
import useSanityQuery from '../../hooks/useSanityQuery';
import PortableText from '../portableText/PortableText.server';
import ProductModule from '../modules/Product.server';
import {PRODUCT_WITH_VARIANT_FIELDS} from '../../fragments/sanity/productWithVariantFields';
// @ts-expect-error incompatibility with node16 resolution
import {EarthAmericasIcon} from '@sanity/icons';

type Props = {
  compositionStories: SanityComposition[];
  sanityProduct: SanityProductPage;
};

export default function Composition({
  compositionStories,
  sanityProduct,
}: Props) {
  // Fetch products that match the material
  const materials = compositionStories.map(
    (composition) => composition.material.name,
  );

  const {data: sanityProducts} = useSanityQuery<SanityModuleProduct[]>({
    params: {
      materials,
    },
    query: QUERY_SANITY,
  });

  return (
    <>
      {sanityProducts && (
        <div className="mb-3 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <div className="aspect-square" />
          <div className="col-span-2">
            <ProductModule module={sanityProducts[0]} layout="image" />
          </div>

          <div className="grid grid-rows-2 gap-3">
            <ProductModule module={sanityProducts[1]} layout="image" />
            <ProductModule module={sanityProducts[2]} layout="image" />
          </div>

          <div className="col-span-2 grid aspect-square">
            <div className="mt-auto">
              <h2>Made from...</h2>
              {compositionStories.map((composition) => (
                <div className="mb-8 last:mb-0" key={composition._key}>
                  <h3 className="mb-2 text-xl font-bold text-purple-600">
                    {composition.material.name}
                  </h3>
                  {composition.material.attributes.environmentallyFriendly &&
                    sanityProduct?.sharedText?.environmentallyFriendly && (
                      <div className="text-bold mb-2 flex items-center text-sm text-green-700">
                        <EarthAmericasIcon className="mr-1 text-lg" />{' '}
                        {sanityProduct?.sharedText?.environmentallyFriendly}
                      </div>
                    )}
                  <PortableText blocks={composition.material.story} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// To do - update GROQ to select products that match the artist(s) behind the product
const QUERY_SANITY = groq`
  *[
    _type == 'product'
    && references(*[_type=="material" && name in $materials]._id)
  ] {
    "productWithVariant": {
      ${PRODUCT_WITH_VARIANT_FIELDS},
      "variantPrice": coalesce(^.variant->store.price, store.variants[0]->store.price)
    }
  } | order(productWithVariant.variantPrice desc, _updatedAt desc)[0..2]
`;
