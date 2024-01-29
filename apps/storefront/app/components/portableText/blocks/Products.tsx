import type { PortableTextBlock } from "@portabletext/types";
import { WithEncodeDataAttribute } from "@sanity/react-loader";
import clsx from "clsx";

import ProductModule from "~/components/modules/Product";
import type { SanityModuleProducts } from "~/lib/sanity";

type Props = {
  value: PortableTextBlock & SanityModuleProducts;
  parentIndex: number;
  encodeDataAttribute?: WithEncodeDataAttribute["encodeDataAttribute"];
};

export default function ProductsBlock({
  value,
  parentIndex,
  encodeDataAttribute,
}: Props) {
  if (!Array.isArray(value?.modules)) {
    return null;
  }

  const multipleProducts = value.modules.length > 1;

  const parentPath = ["body", parentIndex, "_key"];
  const parentAttribute = encodeDataAttribute?.(parentPath) ?? ``;

  return (
    <div
      data-sanity={parentAttribute}
      className={clsx(
        "first:mt-0 last:mb-0", //
        "my-8 grid grid-cols-1 gap-3",
        multipleProducts ? "md:grid-cols-2" : "md:grid-cols-1"
      )}
    >
      {value?.modules?.map((module, moduleIndex) => {
        const path = ["body", parentIndex, "modules", moduleIndex, "_key"];
        const attribute = encodeDataAttribute?.(path) ?? ``;

        return (
          <div key={module._key} data-sanity={attribute}>
            <ProductModule
              imageAspectClassName="aspect-[320/220]"
              layout={value.layout}
              module={module}
            />
          </div>
        );
      })}
    </div>
  );
}
