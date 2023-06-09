import type { PortableTextBlock } from "@portabletext/types";
import clsx from "clsx";

import ProductModule from "~/components/modules/Product";
import type { SanityModuleTaggedProducts } from "~/lib/sanity";

type Props = {
  value: PortableTextBlock & SanityModuleTaggedProducts;
};

export default function TaggedProductsBlock({ value }: Props) {
  if (!Array.isArray(value?.products)) {
    return null;
  }

  const products = value?.products.slice(0, value?.number ?? 0);

  const multipleProducts = products.length > 1;
  return (
    <>
      {products.length > 0 && (
        <div
          className={clsx(
            "first:mt-0 last:mb-0", //
            "my-8 grid grid-cols-1 gap-3",
            multipleProducts ? "md:grid-cols-2" : "md:grid-cols-1"
          )}
        >
          {products.map((product) => {
            return (
              <ProductModule
                imageAspectClassName="aspect-[320/220]"
                key={`${value._key}-${product.productWithVariant._id}}`}
                layout={value.layout}
                module={product}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
