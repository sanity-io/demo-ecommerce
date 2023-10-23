import { EarthAmericasIcon, PackageIcon } from "@sanity/icons";
import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import {
  Product,
  ProductVariant,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";

import ProductForm from "~/components/product/Form";
import type { SanityProductPage } from "~/lib/sanity";

import { Label } from "../global/Label";

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
};

function ProductPrices({
  storefrontProduct,
  selectedVariant,
}: {
  storefrontProduct: Product;
  selectedVariant: ProductVariant;
}) {
  if (!storefrontProduct || !selectedVariant) {
    return null;
  }

  return (
    <div className="mt-2 flex text-md font-bold">
      {selectedVariant.compareAtPrice && (
        <span className="mr-3 text-darkGray line-through decoration-red">
          <Money data={selectedVariant.compareAtPrice} />
        </span>
      )}
      {selectedVariant.price && <Money data={selectedVariant.price} />}
    </div>
  );
}

export default function ProductWidget({
  sanityProduct,
  storefrontProduct,
  selectedVariant,
  analytics,
}: Props) {
  const availableForSale = selectedVariant?.availableForSale;

  const environmentallyFriendly =
    sanityProduct?.composition &&
    sanityProduct?.composition.length > 0 &&
    sanityProduct?.composition?.every(
      (comp) => comp?.material?.attributes?.environmentallyFriendly
    );

  if (!selectedVariant) {
    return null;
  }

  return (
    <div
      className={clsx(
        "pointer-events-auto z-10 ml-auto rounded bg-white px-4 py-6 shadow",
        "md:px-6"
      )}
    >
      {/* Sold out */}
      {!availableForSale && (
        <div className="mb-3 text-xs font-bold uppercase text-darkGray">
          <Label _key="product.soldOut" />
        </div>
      )}

      {/* Sale */}
      {availableForSale && selectedVariant?.compareAtPrice && (
        <div className="mb-3 text-xs font-bold uppercase text-red">
          <Label _key="product.sale" />
        </div>
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
      <ProductPrices
        storefrontProduct={storefrontProduct}
        selectedVariant={selectedVariant}
      />

      {/* Divider */}
      <div className="my-4 w-full border-b border-gray" />

      {/* Product options */}
      <ProductForm
        product={storefrontProduct}
        selectedVariant={selectedVariant}
        analytics={analytics}
        customProductOptions={sanityProduct.customProductOptions}
      />

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
