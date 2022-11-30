// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import type {
  SanityModuleTaggedProducts,
  SanityModuleProduct,
} from '../../../types';
import groq from 'groq';
import clsx from 'clsx';
import useSanityQuery from '../../../hooks/useSanityQuery';
import ProductModule from '../../modules/Product.server';
import {PRODUCT_WITH_VARIANT_FIELDS} from '../../../fragments/sanity/productWithVariantFields';

type Props = {
  node: PortableTextBlock & SanityModuleTaggedProducts;
};

export default function TaggedProductsBlock({node}: Props) {
  const {data: taggedProducts = []} = useSanityQuery<SanityModuleProduct[]>({
    params: {
      tag: node.tag,
      number: node.number - 1,
    },
    query: QUERY_SANITY,
  });

  const multipleProducts = taggedProducts.length > 1;

  return (
    <>
      {taggedProducts.length > 0 && (
        <div
          className={clsx(
            'first:mt-0 last:mb-0', //
            'my-8 grid grid-cols-1 gap-3',
            multipleProducts ? 'md:grid-cols-2' : 'md:grid-cols-1',
          )}
        >
          {taggedProducts.map((product) => {
            return (
              <ProductModule
                imageAspectClassName="aspect-[320/220]"
                key={node._key}
                layout={node.layout}
                module={product}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'product'
    && $tag in string::split(store.tags,',')
    && !(_id in path("drafts.**"))
  ] | order(_updatedAt desc) {
    "productWithVariant": {
      ${PRODUCT_WITH_VARIANT_FIELDS}
    }
  } [0..$number]
`;
