import groq from 'groq';
import {SanityComposition, SanityModuleProduct} from '../../types';
import {PRODUCT_PAGE} from '../../fragments/sanity/pages/product';
import useSanityQuery from '../../hooks/useSanityQuery';
import PortableText from '../portableText/PortableText.server';
import Square from '../elements/Square';
import ProductModule from '../modules/Product.server';

type Props = {
  compositionStories: SanityComposition[];
};

export default function Composition({compositionStories}: Props) {
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
        <>
          <Square />
          <div className="col-span-2">
            <ProductModule module={sanityProducts[0]} layout="image" />
          </div>

          <div className="grid grid-rows-2 gap-3">
            <ProductModule module={sanityProducts[1]} layout="image" />
            <ProductModule module={sanityProducts[2]} layout="image" />
          </div>

          <Square className="col-span-2 grid">
            <div className="lg:mt-auto">
              {compositionStories.map((composition) => (
                <>
                  <div className="mb-8 last:mb-0" key={composition._key}>
                    <h3 className="mb-2 text-xl font-bold text-purple-600">
                      {composition.material.name}
                    </h3>
                    <PortableText blocks={composition.material.story} />
                  </div>
                </>
              ))}
            </div>
          </Square>
        </>
      )}
    </>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'product'
    && references(*[_type=="material" && name in $materials]._id)
  ][0..2] | order(_updatedAt desc){
    "productWithVariant": {
      _id,
      "available": !store.isDeleted && store.status == 'active',
      "gid": store.gid,
      "slug": store.slug.current,
      "variantGid": coalesce(^.variant->store.gid, store.variants[0]->store.gid)
    }
  }
`;
