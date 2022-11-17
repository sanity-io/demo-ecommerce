import {ProductOptionsProvider} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import type {ProductWithNodes, SanityProductPage} from '../../types';
import ProductGallery from './Gallery.client';
import ProductWidget from './Widget.client';

type Props = {
  initialVariantId?: ProductVariant['id'];
  sanityProduct: SanityProductPage;
  storefrontProduct: ProductWithNodes;
  children: React.ReactNode;
};

export default function ProductDetails({
  initialVariantId,
  sanityProduct,
  storefrontProduct,
  children,
}: Props) {
  return (
    <ProductOptionsProvider
      data={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      <div
        className={clsx(
          'mx-auto grid w-full max-w-[1400px] gap-3 px-4 pt-32 pb-4 pb-6 md:grid-cols-2', //
          'md:px-8',
        )}
      >
        <div>
          {/* Gallery */}
          <ProductGallery
            storefrontProduct={storefrontProduct}
            heroGallery={false}
          />
        </div>
        <div>
          {/* Widget */}
          <div
            className={clsx(
              'max-w-[660px] pl-4', //
              'md:pl-8',
            )}
          >
            <ProductWidget
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
            />
          </div>
          {children}
        </div>
      </div>
    </ProductOptionsProvider>
  );
}
