import { StudioPathLike } from "@sanity/react-loader";
import type { Product } from "@shopify/hydrogen/storefront-api-types";

import ProductCard from "~/components/product/Card";
import ProductPill from "~/components/product/Pill";
import type {
  EncodeDataAttributeFunction,
  SanityModuleProduct,
} from "~/lib/sanity";
import { useGid } from "~/lib/utils";

type Props = {
  imageAspectClassName?: string;
  layout?: "card" | "pill" | "image";
  module?: SanityModuleProduct;
  path?: StudioPathLike;
  encodeDataAttribute?: EncodeDataAttributeFunction;
};

export default function ProductModule({
  imageAspectClassName,
  layout = "card",
  module,
  path,
  encodeDataAttribute,
}: Props) {
  const productGid = module?.productWithVariant?.gid;
  const productVariantGid = module?.productWithVariant?.variantGid;
  const storefrontProduct = useGid<Product>(productGid);

  if (!storefrontProduct) {
    return null;
  }

  if (layout === "pill") {
    return (
      <ProductPill
        storefrontProduct={storefrontProduct}
        variantGid={productVariantGid}
      />
    );
  }

  if (layout === "card") {
    return (
      <ProductCard
        imageAspectClassName={imageAspectClassName}
        storefrontProduct={storefrontProduct}
        variantGid={productVariantGid}
        path={path}
        encodeDataAttribute={encodeDataAttribute}
      />
    );
  }

  if (layout === "image") {
    return (
      <ProductCard
        imageAspectClassName={imageAspectClassName}
        storefrontProduct={storefrontProduct}
        imageOnly={true}
        path={path}
        encodeDataAttribute={encodeDataAttribute}
      />
    );
  }

  return null;
}
