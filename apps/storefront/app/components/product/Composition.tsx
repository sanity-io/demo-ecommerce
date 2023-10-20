import { EarthAmericasIcon } from "@sanity/icons";
import groq from "groq";

import { Skeleton } from "~/components/global/Skeleton";
import ProductModule from "~/components/modules/Product";
import PortableText from "~/components/portableText/PortableText";
import { SanityComposition, SanityProductPage } from "~/lib/sanity";

import { Label } from "../global/Label";

type Props = {
  compositionStories: SanityComposition[];
  page: SanityProductPage;
};

export default function Composition({ compositionStories, page }: Props) {
  // Fetch products that match the material
  const products = page.materialUpsells;

  if (!Array.isArray(products)) {
    return null;
  }

  return (
    <div className="mb-3 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
      <div className="aspect-square" />
      <div className="col-span-2">
        <ProductModule module={products[0]} layout="image" />
      </div>

      <div className="grid grid-rows-2 gap-3">
        <ProductModule module={products[1]} layout="image" />
        <ProductModule module={products[2]} layout="image" />
      </div>

      <div className="col-span-2 grid aspect-square">
        <div className="mt-auto">
          <h2>
            <Label _key="product.madeFrom" />
          </h2>
          {compositionStories.map((composition) => (
            <div className="mb-8 last:mb-0" key={composition._key}>
              <h3 className="mb-2 text-xl font-bold text-purple-600">
                {composition.material.name}
              </h3>
              {composition.material.attributes.environmentallyFriendly &&
                page?.sharedText?.environmentallyFriendly && (
                  <div className="text-bold mb-2 flex items-center text-sm text-green-700">
                    <EarthAmericasIcon className="mr-1 text-lg" />{" "}
                    {page?.sharedText?.environmentallyFriendly}
                  </div>
                )}
              <PortableText blocks={composition.material.story} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
