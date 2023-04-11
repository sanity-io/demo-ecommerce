import {ProductPrice, useProductOptions} from '@shopify/hydrogen';
import clsx from 'clsx';
import type {ProductWithNodes, SanityProductPage} from '../../types';
import {hasMultipleProductOptions} from '../../utils/productOptions';
import SelectedVariantBuyNowButton from './buttons/SelectedVariantBuyNow.client';
import SelectedVariantAddToCartButton from './buttons/SelectedVariantAddToCart.client';
import ProductOptions from './options/ProductOptions.client';
// @ts-expect-error incompatibility with node16 resolution
import {PackageIcon, EarthAmericasIcon} from '@sanity/icons';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: ProductWithNodes;
};

function ProductPrices({
  storefrontProduct,
}: {
  storefrontProduct: ProductWithNodes;
}) {
  const {selectedVariant} = useProductOptions();

  if (!storefrontProduct || !selectedVariant) {
    return null;
  }

  return (
    <div className="mt-2 flex text-md font-bold">
      <ProductPrice
        className="mr-3 text-darkGray line-through decoration-red"
        data={storefrontProduct}
        priceType="compareAt"
        variantId={selectedVariant.id}
      />
      <ProductPrice data={storefrontProduct} variantId={selectedVariant.id} />
    </div>
  );
}

export default function ProductWidget({
  sanityProduct,
  storefrontProduct,
}: Props) {
  const {selectedVariant} = useProductOptions();
  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );

  const availableForSale = selectedVariant?.availableForSale;

  const environmentallyFriendly =
    sanityProduct?.composition &&
    sanityProduct?.composition.length > 0 &&
    sanityProduct?.composition?.every(
      (comp) => comp?.material?.attributes?.environmentallyFriendly,
    );

  if (!selectedVariant) {
    return null;
  }

  return (
    <div
      className={clsx(
        'pointer-events-auto z-10 ml-auto rounded bg-white px-4 py-6 shadow',
        'md:px-6',
      )}
    >
      {/* Sold out */}
      {!availableForSale && (
        <div className="mb-3 text-xs font-bold uppercase text-darkGray">
          Sold out
        </div>
      )}

      {/* Sale */}
      {availableForSale && selectedVariant?.compareAtPriceV2 && (
        <div className="mb-3 text-xs font-bold uppercase text-red">Sale</div>
      )}

      {/* Title */}
      {storefrontProduct?.title && (
        <h1 className="text-md font-bold uppercase">
          {storefrontProduct.title}
        </h1>
      )}

      {/* Vendor */}
      {storefrontProduct?.vendor && (
        <div className="mt-1 text-md text-darkGray">
          {storefrontProduct.vendor}
        </div>
      )}

      {/* Prices */}
      <ProductPrices storefrontProduct={storefrontProduct} />

      {/* Divider */}
      <div className="my-4 w-full border-b border-gray" />

      {/* Product options */}
      {multipleProductOptions && (
        <ProductOptions
          customProductOptions={sanityProduct.customProductOptions}
        />
      )}

      {/* Product actions */}
      <div className="mt-4 flex flex-col space-y-2">
        <SelectedVariantAddToCartButton />
        <SelectedVariantBuyNowButton />
      </div>

      {(sanityProduct?.sharedText?.deliverySummary ||
        (environmentallyFriendly &&
          sanityProduct?.sharedText?.environmentallyFriendly)) && (
        <>
          {/* Divider */}
          <div className="my-4 w-full border-b border-gray" />

          {/* Delivery */}
          {sanityProduct?.sharedText?.deliverySummary && (
            <div className="text-bold mt-1 flex items-center text-xs">
              <PackageIcon className="mr-1 text-lg" />
              {sanityProduct.sharedText.deliverySummary}
            </div>
          )}

          {/* Environmentally Friendly */}
          {environmentallyFriendly &&
            sanityProduct?.sharedText?.environmentallyFriendly && (
              <div className="mt-1 flex items-center text-xs text-green-700">
                <EarthAmericasIcon className="mr-1 text-lg" />
                {sanityProduct.sharedText.environmentallyFriendly}
              </div>
            )}
        </>
      )}
    </div>
  );
}
