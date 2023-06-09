import { useMatches } from "@remix-run/react";

import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import PortableText from "~/components/portableText/PortableText";
import type { SanityCreator } from "~/lib/sanity";
import type { ProductWithNodes } from "~/types/shopify";

type Props = {
  product: ProductWithNodes;
  creator: SanityCreator;
};

export default function Creator({ product, creator }: Props) {
  const [root] = useMatches();
  const { sanityDataset, sanityProjectID } = root.data;

  return (
    <div className="mb-10 grid grid-cols-3 gap-3 lg:grid-cols-6">
      <div className="aspect-square" />
      <div className="col-span-2">
        <div className="relative aspect-square overflow-hidden rounded bg-lightGray">
          {creator.person.image && (
            <SanityImage
              alt={creator.person.image?.altText}
              crop={creator.person.image?.crop}
              dataset={sanityDataset}
              hotspot={creator.person.image?.hotspot}
              layout="fill"
              objectFit="cover"
              projectId={sanityProjectID}
              sizes="25vw"
              src={creator.person.image?.asset?._ref}
            />
          )}
        </div>
      </div>
      <div className="aspect-square" />
      <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
        <div className="col-span-2">
          <div className="">
            <div className="tracking-tight text-xl font-bold text-purple-600">
              {creator.person.name}
            </div>
            {creator.role && (
              <div className="tracking-tight mb-2 text-xl text-purple-600">
                {`${creator.role.charAt(0).toUpperCase()}${creator.role.slice(
                  1
                )}`}{" "}
                of the {product.title}
              </div>
            )}
            <PortableText className="text-sm" blocks={creator.person.bio} />
          </div>
        </div>
        <Link to={creator.person.slug}>
          <div className="flex aspect-square items-center overflow-hidden rounded bg-purple-600 hover:bg-purple-800">
            <div className="tracking-tight block items-center p-5 text-lg font-medium text-white xl:w-10/12">
              Check out all of {creator.person.name.split(" ")[0]}&apos;s work
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
